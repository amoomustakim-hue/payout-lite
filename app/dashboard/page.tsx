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
import { EmptyState } from "@/components/ui/empty-state";
import { StatCard } from "@/components/stat-card";
import { CustomerAvatar } from "@/components/ui/customer-avatar";
import { formatNaira } from "@/lib/format";
import { getCurrentBusiness } from "@/lib/auth/get-current-business";
import { getDashboardData, EMPTY_DASHBOARD, type DashboardData, type SourceStat } from "@/lib/data/dashboard";
import { sourceLabel } from "@/lib/presenters/source-label";
import { formatRelative } from "@/lib/presenters/format-relative";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const business = await getCurrentBusiness();
  const data = business ? await getDashboardData(business.id) : EMPTY_DASHBOARD;

  return (
    <div className="relative">
      {/* Decorative gradient blobs — clipped to this container, no overflow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute -top-16 -right-16 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute top-40 -left-16 h-64 w-64 rounded-full bg-indigo-400/8 blur-3xl" />
        <div className="absolute bottom-8 right-1/3 h-48 w-48 rounded-full bg-emerald-300/6 blur-3xl" />
      </div>

      {/* Page title */}
      <div className="relative mb-6">
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Payment overview</h1>
        <p className="mt-0.5 text-sm text-slate-500">Track invoices, QR payments, and account transfers in one place.</p>
      </div>

      {!data.databaseReady && (
        <div className="relative mb-5 flex items-start gap-3 rounded-2xl border border-amber-100/80 bg-amber-50/80 p-4 text-sm backdrop-blur-sm">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-amber-600" />
          <div>
            <p className="font-semibold text-amber-800">Database not connected</p>
            <p className="mt-0.5 text-amber-700">
              Add DATABASE_URL to see live metrics. The dashboard will update as webhooks confirm payments.
            </p>
          </div>
        </div>
      )}

      {/* Stat cards — glassmorphism */}
      <div className="relative grid gap-3 grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total received"
          value={formatNaira(data.totalReceived)}
          badge="Confirmed"
          variant="green"
          icon={TrendingUp}
        />
        <StatCard
          label="Pending"
          value={formatNaira(data.pendingAmount)}
          badge="Awaiting"
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
          label="Payment links"
          value={String(data.invoiceCount)}
          badge="Active"
          variant="blue"
          icon={Link2}
        />
      </div>

      {/* Chart + AI CFO */}
      <div className="relative mt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
        {/* Chart area — glass card */}
        <div className="rounded-2xl border border-white/70 bg-white/60 p-5 shadow-lg shadow-slate-200/50 backdrop-blur-md">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-900">Payment activity</p>
              <p className="text-xs text-slate-400">Revenue by collection channel</p>
            </div>
            <button className="flex items-center gap-1 rounded-lg border border-slate-200/80 bg-white/60 px-3 py-1.5 text-xs font-medium text-slate-500 backdrop-blur-sm hover:bg-white/80">
              Last 7 Days
              <span className="text-slate-300">▼</span>
            </button>
          </div>
          <ChartBars sourceStats={data.sourceStats} />
        </div>

        {/* AI CFO insight — gradient glass */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--payout-blue)] to-indigo-700 p-5 text-white shadow-xl shadow-blue-500/20">
          <div className="pointer-events-none absolute -top-8 -right-8 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
          <div className="pointer-events-none absolute bottom-0 -left-4 h-24 w-24 rounded-full bg-indigo-300/10 blur-xl" />
          <div className="relative">
            <div className="mb-3 flex items-center gap-1.5">
              <Sparkles size={14} className="text-blue-200" />
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-200">
                AI CFO
              </span>
            </div>
            <AiCfoInsight data={data} />
            <ButtonLink
              href="/ai-cfo"
              variant="secondary"
              className="mt-4 w-full justify-center border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
            >
              Open AI CFO
              <ArrowUpRight size={14} />
            </ButtonLink>
          </div>
        </div>
      </div>

      {/* Recent transactions — glass card */}
      <div className="relative mt-4 rounded-2xl border border-white/70 bg-white/60 p-5 shadow-lg shadow-slate-200/50 backdrop-blur-md">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-semibold text-slate-900">Recent transactions</p>
          <ButtonLink href="/transactions" variant="ghost" className="px-2 py-1 text-xs text-[var(--payout-blue)]">
            View all
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
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Customer", "Source", "Amount", "Status", "Date"].map((h) => (
                    <th key={h} className="pb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.recent.map((row) => (
                  <tr key={row.reference} className="border-b border-slate-50 last:border-0">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <CustomerAvatar name={row.customerName ?? "?"} />
                        <div>
                          <p className="font-medium text-slate-800">
                            {row.customerName ?? "Customer"}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {row.reference.slice(0, 16)}…
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-xs text-slate-500">{sourceLabel(row.source)}</td>
                    <td className="py-3 font-semibold text-slate-900">
                      {formatNaira(row.amount)}
                    </td>
                    <td className="py-3">
                      <Badge value={row.status} />
                    </td>
                    <td className="py-3 text-[11px] text-slate-400">
                      {formatRelative(row.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const SOURCE_CONFIG: Record<string, { label: string; color: string }> = {
  INVOICE:        { label: "Invoices",  color: "bg-blue-500" },
  WEBSITE_BUTTON: { label: "Buttons",   color: "bg-indigo-400" },
  SHOP_QR:        { label: "Shop QR",   color: "bg-emerald-500" },
  UNIQUE_ACCOUNT: { label: "Account",   color: "bg-violet-500" },
};

function ChartBars({ sourceStats }: { sourceStats: SourceStat[] }) {
  const allSources = ["INVOICE", "WEBSITE_BUTTON", "SHOP_QR", "UNIQUE_ACCOUNT"];
  const maxAmount = Math.max(...sourceStats.map((s) => s.amount), 1);

  return (
    <div className="flex h-40 items-end gap-3 sm:gap-4 px-1 pb-1">
      {allSources.map((src) => {
        const stat = sourceStats.find((s) => s.source === src);
        const pct = stat ? Math.max(Math.round((stat.amount / maxAmount) * 100), 4) : 4;
        const { label, color } = SOURCE_CONFIG[src];
        return (
          <div key={src} className="flex flex-1 flex-col items-center gap-2">
            <div
              className={`w-full rounded-t-xl opacity-80 ${color} transition-all duration-700`}
              style={{ height: `${pct}%` }}
              title={stat ? `${label}: ₦${stat.amount.toLocaleString("en-NG")} (${stat.count} txns)` : `${label}: ₦0`}
            />
            <span className="text-[10px] font-medium text-slate-400">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

function AiCfoInsight({ data }: { data: DashboardData }) {
  if (!data.databaseReady || data.totalReceived === 0) {
    return (
      <>
        <p className="text-base font-bold leading-snug sm:text-lg">
          Your financial command centre is ready.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-blue-100/90">
          Create an invoice or share your QR code to get your first confirmed payment.
        </p>
      </>
    );
  }

  const top = data.sourceStats.sort((a, b) => b.amount - a.amount)[0];
  const topLabel = top ? (SOURCE_CONFIG[top.source]?.label ?? top.source) : null;
  const hasUnpaid = data.unpaidInvoiceCount > 0;
  const hasPending = data.pendingAmount > 0;

  const headline = topLabel
    ? `${topLabel} is your top revenue channel.`
    : "Payments are coming in — great start.";

  const detail = hasUnpaid
    ? `You have ${data.unpaidInvoiceCount} unpaid invoice${data.unpaidInvoiceCount > 1 ? "s" : ""} outstanding.${hasPending ? ` ₦${data.pendingAmount.toLocaleString("en-NG")} is awaiting webhook confirmation.` : ""}`
    : hasPending
    ? `₦${data.pendingAmount.toLocaleString("en-NG")} is awaiting webhook confirmation from Nomba.`
    : `All ${data.paidCount} confirmed payment${data.paidCount > 1 ? "s" : ""} are reconciled. You're on track.`;

  return (
    <>
      <p className="text-base font-bold leading-snug sm:text-lg">{headline}</p>
      <p className="mt-2 text-sm leading-relaxed text-blue-100/90">{detail}</p>
    </>
  );
}
