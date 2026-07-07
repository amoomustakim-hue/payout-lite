import "server-only";
import { InvoiceStatus } from "@prisma/client";
import { getDb } from "@/lib/db";

export type InvoiceRow = {
  id: string;
  customerName: string;
  customerEmail: string;
  amount: string;
  description: string | null;
  dueDate: Date | null;
  status: InvoiceStatus;
  paymentUrl: string | null;
  isRecurring: boolean;
  recurringDays: number | null;
};

/**
 * Recent invoices for a single business, newest first, capped at `take`.
 * Scoped to `businessId`. Decimal amounts are serialized to strings for the client.
 */
export async function listInvoices(businessId: string, take = 25): Promise<InvoiceRow[]> {
  const invoices = await getDb().invoice.findMany({
    where: { businessId },
    orderBy: { createdAt: "desc" },
    take,
  });

  return invoices.map((inv) => ({
    id: inv.id,
    customerName: inv.customerName,
    customerEmail: inv.customerEmail,
    amount: inv.amount.toString(),
    description: inv.description,
    dueDate: inv.dueDate,
    status: inv.status,
    paymentUrl: inv.paymentUrl,
    isRecurring: inv.isRecurring,
    recurringDays: inv.recurringDays,
  }));
}
