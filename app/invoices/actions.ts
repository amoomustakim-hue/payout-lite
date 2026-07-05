"use server";

import { InvoiceStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAppUrl } from "@/lib/app-url";
import { getDb, hasDatabaseUrl } from "@/lib/db";
import { getOrCreateBusiness } from "@/lib/auth/get-current-business";
import { getResendClient, getFromEmail } from "@/lib/resend";
import { buildInvoiceEmailHtml, buildInvoiceEmailText } from "@/lib/email/invoice-email";
import { formatNaira } from "@/lib/format";

function requiredString(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${key} is required`);
  }
  return value.trim();
}

export async function createInvoiceAction(formData: FormData) {
  if (!hasDatabaseUrl()) {
    redirect("/invoices?database=unavailable");
  }

  const customerName = requiredString(formData, "customerName");
  const customerEmail = requiredString(formData, "customerEmail");
  const amount = Number(requiredString(formData, "amount"));
  const description = requiredString(formData, "description");
  const dueDateValue = formData.get("dueDate");

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("amount must be greater than zero");
  }

  let invoiceId: string;
  let paymentUrl: string;
  let businessName: string;
  let invoiceNumber: string;
  let dueDate: Date | null = null;

  try {
    const db = getDb();
    const business = await getOrCreateBusiness();
    businessName = business.name;

    const invoice = await db.invoice.create({
      data: {
        businessId: business.id,
        customerName,
        customerEmail,
        amount,
        description,
        dueDate: typeof dueDateValue === "string" && dueDateValue ? new Date(dueDateValue) : null,
        status: InvoiceStatus.UNPAID,
      },
    });

    dueDate = invoice.dueDate;
    paymentUrl = `${getAppUrl()}/pay/invoice/${invoice.id}`;

    await db.invoice.update({
      where: { id: invoice.id },
      data: { paymentUrl },
    });

    // Generate invoice number from total invoice count
    const count = await db.invoice.count({ where: { businessId: business.id } });
    invoiceNumber = `#INV-${String(count).padStart(3, "0")}`;
    invoiceId = invoice.id;
  } catch {
    redirect("/invoices?database=unavailable");
  }

  // Send invoice email non-fatally — never block invoice creation if email fails
  try {
    const resend = getResendClient();
    if (resend) {
      const amountFormatted = formatNaira(amount);
      await resend.emails.send({
        from: `${businessName} via Payout Lite <${getFromEmail()}>`,
        to: [customerEmail],
        subject: `Invoice ${invoiceNumber} from ${businessName} — ${amountFormatted}`,
        html: buildInvoiceEmailHtml({
          businessName,
          customerName,
          amount: amountFormatted,
          description,
          dueDate,
          paymentUrl,
          invoiceNumber,
        }),
        text: buildInvoiceEmailText({
          businessName,
          customerName,
          amount: amountFormatted,
          description,
          dueDate,
          paymentUrl,
          invoiceNumber,
        }),
      });
    }
  } catch (emailErr) {
    console.error("Invoice email failed (non-fatal):", emailErr);
  }

  revalidatePath("/invoices");
  redirect(`/invoices?created=${invoiceId}`);
}
