import { NextResponse } from "next/server";
import { InvoiceStatus } from "@prisma/client";
import { getDb, hasDatabaseUrl } from "@/lib/db";
import { getAppUrl } from "@/lib/app-url";
import { getResendClient, getFromEmail } from "@/lib/resend";
import { buildInvoiceEmailHtml, buildInvoiceEmailText } from "@/lib/email/invoice-email";
import { formatNaira } from "@/lib/format";

// POST /api/recurring — processes all due recurring invoices and creates the next cycle
// Protected by a shared secret (RECURRING_SECRET env var) so only authorised callers can trigger it
export async function POST(req: Request) {
  const secret = process.env.RECURRING_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json({ error: "No database" }, { status: 503 });
  }

  const db = getDb();

  // Find all PAID recurring invoices whose next cycle is due
  const recurringInvoices = await db.invoice.findMany({
    where: { isRecurring: true, recurringDays: { not: null }, status: InvoiceStatus.PAID },
    include: { business: true },
  });

  const now = new Date();
  const created: string[] = [];

  for (const inv of recurringInvoices) {
    if (!inv.recurringDays) continue;
    const nextDue = new Date(inv.updatedAt);
    nextDue.setDate(nextDue.getDate() + inv.recurringDays);

    if (nextDue > now) continue; // not due yet

    // Check if a new invoice for this customer already exists in this cycle
    const existing = await db.invoice.findFirst({
      where: {
        businessId: inv.businessId,
        customerEmail: inv.customerEmail,
        isRecurring: true,
        status: { in: [InvoiceStatus.UNPAID, InvoiceStatus.PENDING] },
        createdAt: { gte: new Date(now.getTime() - inv.recurringDays * 24 * 60 * 60 * 1000) },
      },
    });
    if (existing) continue;

    const newDueDate = new Date();
    newDueDate.setDate(newDueDate.getDate() + inv.recurringDays);

    const newInvoice = await db.invoice.create({
      data: {
        businessId: inv.businessId,
        customerName: inv.customerName,
        customerEmail: inv.customerEmail,
        amount: inv.amount,
        currency: inv.currency,
        description: inv.description,
        dueDate: newDueDate,
        status: InvoiceStatus.UNPAID,
        isRecurring: true,
        recurringDays: inv.recurringDays,
      },
    });

    const paymentUrl = `${getAppUrl()}/pay/invoice/${newInvoice.id}`;
    await db.invoice.update({ where: { id: newInvoice.id }, data: { paymentUrl } });

    const count = await db.invoice.count({ where: { businessId: inv.businessId } });
    const invoiceNumber = `#INV-${String(count).padStart(3, "0")}`;
    const amountFormatted = formatNaira(inv.amount.toString());

    try {
      const resend = getResendClient();
      if (resend) {
        await resend.emails.send({
          from: `${inv.business.name} via Payout Lite <${getFromEmail()}>`,
          to: [inv.customerEmail],
          subject: `Recurring Invoice ${invoiceNumber} from ${inv.business.name} — ${amountFormatted}`,
          html: buildInvoiceEmailHtml({
            businessName: inv.business.name,
            customerName: inv.customerName,
            amount: amountFormatted,
            description: inv.description ?? "",
            dueDate: newDueDate,
            paymentUrl,
            invoiceNumber,
          }),
          text: buildInvoiceEmailText({
            businessName: inv.business.name,
            customerName: inv.customerName,
            amount: amountFormatted,
            description: inv.description ?? "",
            dueDate: newDueDate,
            paymentUrl,
            invoiceNumber,
          }),
        });
      }
    } catch (e) {
      console.error("Recurring invoice email failed (non-fatal):", e);
    }

    created.push(newInvoice.id);
  }

  return NextResponse.json({ processed: recurringInvoices.length, created: created.length, ids: created });
}

// GET /api/recurring — returns a summary of all recurring invoices (for dashboard display)
export async function GET() {
  if (!hasDatabaseUrl()) return NextResponse.json({ recurring: [] });
  try {
    const recurring = await getDb().invoice.findMany({
      where: { isRecurring: true },
      select: {
        id: true, customerName: true, customerEmail: true,
        amount: true, recurringDays: true, status: true, updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ recurring });
  } catch {
    return NextResponse.json({ recurring: [] });
  }
}
