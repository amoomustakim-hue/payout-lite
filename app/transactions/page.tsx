import { ArrowLeftRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { CustomerAvatar } from "@/components/ui/customer-avatar";
import { formatNaira } from "@/lib/format";

const DEMO_TRANSACTIONS = [
  { ref: "INV-1007", source: "Invoice", status: "PAID", amount: 120000, customer: "Ada Johnson", date: "Today" },
  { ref: "QR-8082", source: "Shop QR", status: "PAID", amount: 8500, customer: "Tobi Stores", date: "Yesterday" },
  { ref: "BTN-0441", source: "Website Button", status: "PENDING", amount: 32000, customer: "Chika Foods", date: "Yesterday" },
  { ref: "VA-6001", source: "Unique Account", status: "PAID", amount: 250000, customer: "Musa Retail", date: "2 days ago" },
];

export default function TransactionsPage() {
  return (
    <div>
      <PageHeader
        title="Transactions"
        description="Confirmed, pending, and failed payments from all Payout Lite channels."
      />

      <Card>
        {DEMO_TRANSACTIONS.length === 0 ? (
          <EmptyState
            icon={ArrowLeftRight}
            title="No transactions yet"
            description="Payments from invoices, QR codes, buttons, and virtual accounts will appear here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
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
                {DEMO_TRANSACTIONS.map((row) => (
                  <tr key={row.ref} className="border-b border-[var(--border)] last:border-0">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <CustomerAvatar name={row.customer} />
                        <div>
                          <p className="font-medium text-[var(--foreground)]">{row.customer}</p>
                          <p className="text-xs text-[var(--muted)]">{row.ref}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-[var(--muted)]">{row.source}</td>
                    <td className="py-3 font-semibold text-[var(--foreground)]">{formatNaira(row.amount)}</td>
                    <td className="py-3"><Badge value={row.status} /></td>
                    <td className="py-3 text-xs text-[var(--muted)]">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="mt-3 rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-700">
        Showing demo data — connect DATABASE_URL to see real webhook-confirmed transactions.
      </div>
    </div>
  );
}
