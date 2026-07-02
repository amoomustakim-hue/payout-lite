import { TransactionStatus } from "@prisma/client";
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  Link2,
  Sparkles,
  ArrowUpRight,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/stat-card";
import { CustomerAvatar } from "@/components/ui/customer-avatar";
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
    createdAt: Date;
  }>;
};

async function getDashboardData(): Promise<DashboardData> {
  try {
    const db = getDb();
    const [
      paidAggregate,
      pendingAggregate,
      failedCount,
      paidCount,
      invoiceCount,
      unpaidInvoiceCount,
      recent,
    ] = await Promise.all([
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

function sourceLabel(source: string) {
  const map: Record<string, string> = {
    INVOICE: "Invoice",
    WEBSITE_BUTTON: "Website Button",
    SHOP_QR: "Shop QR",
    UNIQUE_ACCOUNT: "Unique Account",
  };
  return map[source] ?? source;
}

function formatRelative(date: Date) {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div>
      <PageHeader
        title="Payment overview"
        description="Track invoices, checkout payments, QR payments, and account transfers in one place."
      />

      {!data.databaseReady && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-amber-600" />
          <div>
            <p className="font-semibold text-amber-800">Database not connected</p>
            <p className="mt-0.5 text-amber-700">
              Add DATABASE_URL to see live metrics. The dashboard will update as webhooks confirm payments.
            </p>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total received"
          value={formatNaira(data.totalReceived)}
          badge="Webhook confirmed"
          variant="green"
          icon={TrendingUp}
        />
        <StatCard
          label="Pending payments"
          value={formatNaira(data.pendingAmount)}
          badge="Awaiting confirmation"
          variant="amber"
          icon={Clock}
        />
        <StatCard
          label="Paid invoices"
          value={String(data.paidCount)}
          badge="This month"
          variant="slate"
          icon={CheckCircle2}
        />
        <StatCard
          label="Active payment links"
          value={String(data.invoiceCount)}
          badge="Ready to share"
          variant="blue"
          icon={Link2}
        />
      </div>

      {/* Chart + AI CFO */}
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_340px]">
        {/* Chart area */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-[var(--foreground)]">Payment activity</p>
              <p className="text-xs text-[var(--muted)]">Revenue distribution by collection channel</p>
            </div>
            <button className="flex items-center gap-1 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] hover:bg-slate-50">
              Last 7 Days
              <span className="text-slate-300">▼</span>
            </button>
          </div>
          <div className="flex h-48 items-end gap-4 px-2 pb-2">
            {[
              { label: "Invoices", h: 72 },
              { label: "Buttons", h: 40 },
              { label: "Shop QR", h: 55 },
              { label: "Account", h: 80 },
            ].map(({ label, h }) => (
              <div key={label} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-[var(--payout-blue)]/20"
                  style={{ height: `${h}%` }}
                />
                <span className="text-xs text-[var(--muted)]">{label}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* AI CFO insight */}
        <div className="rounded-xl bg-[var(--payout-blue)] p-5 text-white">
          <div className="mb-3 flex items-center gap-1.5">
            <Sparkles size={14} className="text-blue-200" />
            <span className="text-xs font-semibold uppercase tracking-wide text-blue-200">
              AI CFO Insight
            </span>
          </div>
          <p className="text-lg font-bold leading-snug">
            Shop QR payments are growing and may become your fastest offline collection channel.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-blue-100">
            Most of your confirmed revenue came from invoices this week. Consider promoting QR codes to your walk-in customers.
          </p>
          <ButtonLink
            href="/ai-cfo"
            variant="secondary"
            className="mt-5 w-full justify-center border-white/30 bg-white/10 text-white hover:bg-white/20"
          >
            Open AI CFO
            <ArrowUpRight size={14} />
          </ButtonLink>
        </div>
      </div>

      {/* Recent transactions */}
      <Card className="mt-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-semibold text-[var(--foreground)]">Recent transactions</p>
          <ButtonLink href="/transactions" variant="ghost" className="px-2 py-1 text-xs text-[var(--payout-blue)]">
            View all report
          </ButtonLink>
        </div>

        {data.recent.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="No transactions yet"
            description="Create an invoice and start a checkout to see payments here."
            action={<ButtonLink href="/invoices">Create invoice</ButtonLink>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  {["Customer / Name", "Source", "Amount", "Status", "Date"].map((h) => (
                    <th key={h} className="pb-3 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.recent.map((row) => (
                  <tr key={row.reference} className="border-b border-[var(--border)] last:border-0">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <CustomerAvatar name={row.customerName ?? "?"} />
                        <div>
                          <p className="font-medium text-[var(--foreground)]">
                            {row.customerName ?? "Customer"}
                          </p>
                          <p className="text-xs text-[var(--muted)]">
                            {row.reference.slice(0, 16)}…
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-[var(--muted)]">{sourceLabel(row.source)}</td>
                    <td className="py-3 font-semibold text-[var(--foreground)]">
                      {formatNaira(row.amount)}
                    </td>
                    <td className="py-3">
                      <Badge value={row.status} />
                    </td>
                    <td className="py-3 text-xs text-[var(--muted)]">
                      {formatRelative(row.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
