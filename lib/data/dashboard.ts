import "server-only";
import { TransactionStatus } from "@prisma/client";
import { getDb } from "@/lib/db";

export type SourceStat = { source: string; amount: number; count: number };

export type DashboardData = {
  databaseReady: boolean;
  totalReceived: number;
  pendingAmount: number;
  failedCount: number;
  paidCount: number;
  invoiceCount: number;
  unpaidInvoiceCount: number;
  sourceStats: SourceStat[];
  recent: Array<{
    reference: string;
    source: string;
    status: string;
    amount: string;
    customerName: string | null;
    createdAt: Date;
  }>;
};

function emptyData(databaseReady: boolean): DashboardData {
  return {
    databaseReady,
    totalReceived: 0,
    pendingAmount: 0,
    failedCount: 0,
    paidCount: 0,
    invoiceCount: 0,
    unpaidInvoiceCount: 0,
    sourceStats: [],
    recent: [],
  };
}

/** Zeroed dashboard for the "DB is fine but this business has no data yet" case. */
export const EMPTY_DASHBOARD: DashboardData = emptyData(true);

/**
 * Aggregated dashboard metrics for a single business.
 * All queries are scoped to `businessId` so no cross-tenant data leaks.
 */
export async function getDashboardData(businessId: string): Promise<DashboardData> {
  try {
    const db = getDb();
    const [
      paidAggregate,
      pendingAggregate,
      failedCount,
      paidCount,
      invoiceCount,
      unpaidInvoiceCount,
      sourceGroups,
      recent,
    ] = await Promise.all([
      db.transaction.aggregate({ where: { businessId, status: TransactionStatus.PAID }, _sum: { amount: true } }),
      db.transaction.aggregate({ where: { businessId, status: TransactionStatus.PENDING }, _sum: { amount: true } }),
      db.transaction.count({ where: { businessId, status: TransactionStatus.FAILED } }),
      db.transaction.count({ where: { businessId, status: TransactionStatus.PAID } }),
      db.invoice.count({ where: { businessId } }),
      db.invoice.count({ where: { businessId, status: { in: ["UNPAID", "PENDING", "OVERDUE"] } } }),
      db.transaction.groupBy({
        by: ["source"],
        where: { businessId, status: TransactionStatus.PAID },
        _sum: { amount: true },
        _count: { _all: true },
      }),
      db.transaction.findMany({ where: { businessId }, orderBy: { createdAt: "desc" }, take: 8 }),
    ]);

    const sourceStats: SourceStat[] = sourceGroups.map((g) => ({
      source: g.source,
      amount: Number(g._sum.amount ?? 0),
      count: g._count._all,
    }));

    return {
      databaseReady: true,
      totalReceived: Number(paidAggregate._sum.amount ?? 0),
      pendingAmount: Number(pendingAggregate._sum.amount ?? 0),
      failedCount,
      paidCount,
      invoiceCount,
      unpaidInvoiceCount,
      sourceStats,
      recent: recent.map((t) => ({
        reference: t.reference,
        source: t.source,
        status: t.status,
        amount: t.amount.toString(),
        customerName: t.customerName,
        createdAt: t.createdAt,
      })),
    };
  } catch {
    return emptyData(false);
  }
}
