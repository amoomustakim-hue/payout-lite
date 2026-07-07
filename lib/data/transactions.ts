import "server-only";
import type { Prisma } from "@prisma/client";
import { getDb } from "@/lib/db";

/**
 * Recent transactions for a single business, newest first.
 * Scoped to `businessId`.
 */
export async function listTransactions(businessId: string, take = 50) {
  return getDb().transaction.findMany({
    where: { businessId },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export type TransactionReceipt = Prisma.TransactionGetPayload<{
  include: { invoice: true; business: true };
}>;

/**
 * A single transaction with its linked invoice and business, scoped to
 * `businessId` so users can only view receipts for their own transactions.
 */
export async function getTransactionForBusiness(
  id: string,
  businessId: string,
): Promise<TransactionReceipt | null> {
  return getDb().transaction.findFirst({
    where: { id, businessId },
    include: { invoice: true, business: true },
  });
}
