import Link from "next/link";
import { ArrowLeftRight, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { CustomerAvatar } from "@/components/ui/customer-avatar";
import { formatNaira } from "@/lib/format";
import { hasDatabaseUrl } from "@/lib/db";
import { getCurrentBusiness } from "@/lib/auth/get-current-business";
import { requireOnboardedBusiness } from "@/lib/auth/require-onboarding";
import { listTransactions } from "@/lib/data/transactions";
import { sourceLabel } from "@/lib/presenters/source-label";
import { formatRelative } from "@/lib/presenters/format-relative";

export const dynamic = "force-dynamic";

async function getTransactions() {
  if (!hasDatabaseUrl()) return { transactions: [], databaseReady: false };
  try {
    const business = await getCurrentBusiness();
    if (!business) return { transactions: [], databaseReady: true };
    const transactions = await listTransactions(business.id);
    return { transactions, databaseReady: true };
  } catch {
    return { transactions: [], databaseReady: false };
  }
}

export default async function TransactionsPage() {
  await requireOnboardedBusiness();
  const { transactions, databaseReady } = await getTransactions();

  return (
    <div>
      <PageHeader
        title="Transactions"
        description="Webhook-confirmed payments from all Payout Lite channels."
      />

      {!databaseReady && (
        <div className="mb-5 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          <strong>Database not connected.</strong> Add DATABASE_URL to see real transactions.
        </div>
      )}

      <Card>
        {transactions.length === 0 ? (
          <EmptyState
            icon={ArrowLeftRight}
            title={databaseReady ? "No transactions yet" : "Database unavailable"}
            description={
              databaseReady
                ? "Payments from invoices, QR codes, buttons, and virtual accounts will appear here once confirmed by Nomba webhooks."
                : "Connect a database to see webhook-confirmed transactions."
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  {["Customer", "Source", "Amount", "Status", "Date", ""].map((h) => (
                    <th key={h} className="pb-3 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map((row) => (
                  <tr key={row.id} className="border-b border-[var(--border)] last:border-0 hover:bg-slate-50/50">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <CustomerAvatar name={row.customerName ?? "?"} />
                        <div>
                          <p className="font-medium text-[var(--foreground)]">
                            {row.customerName ?? "Customer"}
                          </p>
                          <p className="text-xs text-[var(--muted)]">{row.reference.slice(0, 20)}…</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-[var(--muted)]">
                      {sourceLabel(row.source)}
                    </td>
                    <td className="py-3 font-semibold text-[var(--foreground)]">
                      {formatNaira(row.amount.toString())}
                    </td>
                    <td className="py-3">
                      <Badge value={row.status} />
                    </td>
                    <td className="py-3 text-xs text-[var(--muted)]">
                      {formatRelative(row.createdAt)}
                    </td>
                    <td className="py-3">
                      <Link
                        href={`/transactions/${row.id}`}
                        className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] px-2.5 py-1 text-xs font-medium text-[var(--muted)] transition hover:border-[var(--payout-blue)] hover:text-[var(--payout-blue)]"
                      >
                        <Receipt size={11} />
                        View receipt
                      </Link>
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
