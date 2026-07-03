import { ArrowLeftRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { CustomerAvatar } from "@/components/ui/customer-avatar";
import { formatNaira } from "@/lib/format";
import { getDb, hasDatabaseUrl } from "@/lib/db";

export const dynamic = "force-dynamic";

const SOURCE_LABELS: Record<string, string> = {
  INVOICE: "Invoice",
  WEBSITE_BUTTON: "Website Button",
  SHOP_QR: "Shop QR",
  UNIQUE_ACCOUNT: "Unique Account",
};

function formatRelative(date: Date) {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 2) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  return date.toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" });
}

async function getTransactions() {
  if (!hasDatabaseUrl()) return { transactions: [], databaseReady: false };
  try {
    const transactions = await getDb().transaction.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return { transactions, databaseReady: true };
  } catch {
    return { transactions: [], databaseReady: false };
  }
}

export default async function TransactionsPage() {
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
                  {["Customer", "Source", "Amount", "Status", "Date"].map((h) => (
                    <th key={h} className="pb-3 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map((row) => (
                  <tr key={row.id} className="border-b border-[var(--border)] last:border-0">
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
                      {SOURCE_LABELS[row.source] ?? row.source}
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
