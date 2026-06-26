import { TransactionStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/stat-card";
import { formatNaira } from "@/lib/format";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

type DashboardData = {
  databaseReady: boolean;
  totalReceived: number;
  pendingAmount: number;
  failedCount: number;
  paidCount: number;
  invoiceCount: number;
  unpaidInvoiceCount: number;
  recent: Array<{
    reference: string;
    source: string;
    status: string;
    amount: string;
    customerName: string | null;
  }>;
};

async function getDashboardData(): Promise<DashboardData> {
  try {
    const db = getDb();
    const [paidAggregate, pendingAggregate, failedCount, paidCount, invoiceCount, unpaidInvoiceCount, recent] = await Promise.all([
      db.transaction.aggregate({ where: { status: TransactionStatus.PAID }, _sum: { amount: true } }),
      db.transaction.aggregate({ where: { status: TransactionStatus.PENDING }, _sum: { amount: true } }),
      db.transaction.count({ where: { status: TransactionStatus.FAILED } }),
      db.transaction.count({ where: { status: TransactionStatus.PAID } }),
      db.invoice.count(),
      db.invoice.count({ where: { status: { in: ["UNPAID", "PENDING", "OVERDUE"] } } }),
      db.transaction.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    ]);

    return {
      databaseReady: true,
      totalReceived: Number(paidAggregate._sum.amount ?? 0),
      pendingAmount: Number(pendingAggregate._sum.amount ?? 0),
      failedCount,
      paidCount,
      invoiceCount,
      unpaidInvoiceCount,
      recent: recent.map((transaction) => ({
        reference: transaction.reference,
        source: transaction.source,
        status: transaction.status,
        amount: transaction.amount.toString(),
        customerName: transaction.customerName,
      })),
    };
  } catch {
    return {
      databaseReady: false,
      totalReceived: 0,
      pendingAmount: 0,
      failedCount: 0,
      paidCount: 0,
      invoiceCount: 0,
      unpaidInvoiceCount: 0,
      recent: [],
    };
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <main className="mx-auto max-w-7xl px-5 py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--payout-blue)]">Payout Lite</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950 md:text-4xl">Dashboard</h1>
          <p className="mt-2 text-slate-600">Track confirmed Nomba payments across every invoice and channel.</p>
        </div>
        <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-[var(--payout-blue)] ring-1 ring-blue-100">Test mode</span>
      </div>

      {!data.databaseReady ? (
        <Card className="mb-6 border-blue-100 bg-blue-50/70">
          <p className="font-bold text-slate-950">Connect DATABASE_URL to see live metrics</p>
          <p className="mt-1 text-sm text-slate-600">The dashboard is wired for Prisma and will update as webhooks mark transactions paid or failed.</p>
        </Card>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total received" value={formatNaira(data.totalReceived)} helper="Webhook-confirmed revenue" />
        <StatCard label="Pending payments" value={formatNaira(data.pendingAmount)} helper="Awaiting webhook confirmation" />
        <StatCard label="Paid payments" value={String(data.paidCount)} helper="Successful transactions" />
        <StatCard label="Failed payments" value={String(data.failedCount)} helper="Failed or abandoned payments" />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <h2 className="font-black text-slate-950">Revenue chart</h2>
          <div className="mt-6 flex h-64 items-end gap-3">
            {[32, 48, 38, 64, 46, 82, 60].map((height, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-xl bg-gradient-to-t from-[var(--payout-blue)] to-[var(--payout-cyan)]" style={{ height: `${height}%` }} />
                <span className="text-xs font-semibold text-slate-400">D{index + 1}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="font-black text-slate-950">Invoice summary</h2>
          <div className="mt-5 grid gap-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Total invoices</p>
              <p className="mt-1 text-2xl font-black text-slate-950">{data.invoiceCount}</p>
            </div>
            <div className="rounded-2xl bg-blue-50 p-4">
              <p className="text-sm text-slate-500">Unpaid or pending</p>
              <p className="mt-1 text-2xl font-black text-[var(--payout-blue)]">{data.unpaidInvoiceCount}</p>
            </div>
          </div>
        </Card>
      </section>

      <Card className="mt-6">
        <h2 className="font-black text-slate-950">Recent transactions</h2>
        {data.recent.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-blue-200 bg-blue-50/60 p-8 text-center">
            <p className="font-black text-slate-950">No transactions yet</p>
            <p className="mt-2 text-sm text-slate-600">Create an invoice and start a checkout to see pending payments here.</p>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="py-3">Reference</th>
                  <th>Customer</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.recent.map((row) => (
                  <tr key={row.reference} className="border-t border-[var(--border)]">
                    <td className="max-w-[220px] truncate py-3 font-bold text-slate-700">{row.reference}</td>
                    <td className="py-3 text-slate-600">{row.customerName ?? "Customer"}</td>
                    <td className="py-3 text-slate-600">{row.source}</td>
                    <td className="py-3"><Badge value={row.status} /></td>
                    <td className="py-3 text-right font-black text-slate-950">{formatNaira(row.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </main>
  );
}
