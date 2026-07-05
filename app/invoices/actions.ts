"use server";

import { InvoiceStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAppUrl } from "@/lib/app-url";
import { getDb, hasDatabaseUrl } from "@/lib/db";
import { getOrCreateBusiness } from "@/lib/auth/get-current-business";

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

  try {
    const db = getDb();
    const business = await getOrCreateBusiness();
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

    const paymentUrl = `${getAppUrl()}/pay/invoice/${invoice.id}`;
    await db.invoice.update({
      where: { id: invoice.id },
      data: { paymentUrl },
    });

    invoiceId = invoice.id;
  } catch {
    redirect("/invoices?database=unavailable");
  }

  revalidatePath("/invoices");
  redirect(`/invoices?created=${invoiceId}`);
}
