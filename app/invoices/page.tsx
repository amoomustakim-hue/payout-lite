import { FileText, Plus, Send, Link2, BarChart3, RefreshCw, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { CustomerAvatar } from "@/components/ui/customer-avatar";
import { ShareInvoice } from "@/components/invoices/share-invoice";
import { createInvoiceAction } from "@/app/invoices/actions";
import { formatNaira } from "@/lib/format";
import { getAppUrl } from "@/lib/app-url";
import { hasDatabaseUrl } from "@/lib/db";
import { getCurrentBusiness } from "@/lib/auth/get-current-business";
import { listInvoices, type InvoiceRow } from "@/lib/data/invoices";
import { invoiceNumber } from "@/lib/presenters/invoice-number";

export const dynamic = "force-dynamic";

type InvoiceState = {
  invoices: InvoiceRow[];
  databaseReady: boolean;
};

async function getInvoices(): Promise<InvoiceState> {
  if (!hasDatabaseUrl()) {
    return { databaseReady: false, invoices: [] };
  }
  try {
    const business = await getCurrentBusiness();
    if (!business) return { databaseReady: true, invoices: [] };
    const invoices = await listInvoices(business.id);
    return { databaseReady: true, invoices };
  } catch {
    return { databaseReady: false, invoices: [] };
  }
}

function InvoiceForm({ databaseReady }: { databaseReady: boolean }) {
  const fields = (
    <>
      <div className="grid gap-1.5">
        <Label htmlFor="customerName">Customer Name</Label>
        <Input
          id="customerName"
          name="customerName"
          placeholder="e.g. Ada Johnson"
          required
          disabled={!databaseReady}
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="customerEmail">Email Address</Label>
        <Input
          id="customerEmail"
          name="customerEmail"
          placeholder="ada@example.com"
          type="email"
          required
          disabled={!databaseReady}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="amount">Amount (₦)</Label>
          <Input
            id="amount"
            name="amount"
            placeholder="0.00"
            min="1"
            step="0.01"
            type="number"
            required
            disabled={!databaseReady}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            disabled={!databaseReady}
          />
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          className="min-h-20"
          placeholder="What is this payment for?"
          required
          disabled={!databaseReady}
        />
      </div>
      {/* Recurring toggle */}
      <div className="rounded-lg border border-[var(--border)] bg-slate-50 p-3">
        <label className="flex cursor-pointer items-center gap-2.5">
          <input type="checkbox" name="isRecurring" id="isRecurring" className="h-4 w-4 rounded accent-[var(--payout-blue)]" disabled={!databaseReady} />
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">Recurring invoice</p>
            <p className="text-xs text-[var(--muted)]">Auto-generate this invoice on a schedule</p>
          </div>
          <RefreshCw size={13} className="ml-auto text-[var(--muted)]" />
        </label>
        <div className="mt-2.5 grid gap-1.5">
          <Label htmlFor="recurringDays" className="text-xs">Repeat every</Label>
          <select
            id="recurringDays"
            name="recurringDays"
            disabled={!databaseReady}
            className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--payout-blue)] focus:outline-none"
          >
            <option value="7">7 days (weekly)</option>
            <option value="14">14 days (bi-weekly)</option>
            <option value="30" selected>30 days (monthly)</option>
            <option value="60">60 days (bi-monthly)</option>
            <option value="90">90 days (quarterly)</option>
          </select>
        </div>
      </div>

      <button
        className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--payout-blue)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--payout-blue-dark)] disabled:cursor-not-allowed disabled:bg-slate-300"
        disabled={!databaseReady}
        type="submit"
      >
        <Plus size={16} />
        {databaseReady ? "Create Invoice" : "Database unavailable"}
      </button>
    </>
  );

  if (!databaseReady) {
    return <div className="grid gap-4 opacity-60">{fields}</div>;
  }

  return (
    <form action={createInvoiceAction} id="create-invoice" className="grid gap-4">
      {fields}
    </form>
  );
}

const quickActions = [
  { icon: Send, label: "Send Reminder", description: "Nudge customers with unpaid invoices automatically via SMS or Email.", color: "bg-[var(--payout-blue)]", textColor: "text-white", descColor: "text-blue-100" },
  { icon: Link2, label: "Payment Links", description: "Generate a direct link to a hosted checkout page for any amount.", color: "bg-white", textColor: "text-[var(--foreground)]", descColor: "text-[var(--muted)]" },
  { icon: BarChart3, label: "Revenue Insights", description: "Track your growth with detailed reports on paid vs pending invoices.", color: "bg-white", textColor: "text-[var(--foreground)]", descColor: "text-[var(--muted)]" },
];

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string }>;
}) {
  const { invoices, databaseReady } = await getInvoices();
  const { created } = await searchParams;
  const createdInvoice = created ? invoices.find((inv) => inv.id === created) : undefined;
  const createdUrl = createdInvoice
    ? createdInvoice.paymentUrl ?? `${getAppUrl()}/pay/invoice/${createdInvoice.id}`
    : null;

  return (
    <div>
      <PageHeader
        title="Invoices"
        description="Create invoices, share payment pages, and track confirmed payments."
        action={
          <a href="#create-invoice" className="flex items-center gap-1.5 rounded-lg bg-[var(--payout-blue)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--payout-blue-dark)]">
            <Plus size={15} />
            Create Invoice
          </a>
        }
      />

      {createdInvoice && createdUrl && (
        <Card className="mb-5 border-emerald-200 bg-emerald-50/60">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 size={18} className="text-emerald-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[var(--foreground)]">
                Invoice created for {createdInvoice.customerName} — {formatNaira(createdInvoice.amount)}
              </p>
              <p className="mt-0.5 text-sm text-[var(--muted)]">
                Share this payment link with your customer. Anyone with the link can pay — no login required.
              </p>
              <div className="mt-3">
                <ShareInvoice url={createdUrl} customerName={createdInvoice.customerName} />
              </div>
            </div>
          </div>
        </Card>
      )}

      {!databaseReady && (
        <div className="mb-5 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm">
          <p className="font-semibold text-amber-800">Database setup required</p>
          <p className="mt-0.5 text-amber-700">Add DATABASE_URL and redeploy to enable invoice creation.</p>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[400px_1fr]">
        {/* Create form */}
        <Card className="h-fit">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-[var(--payout-blue)]">
              <FileText size={14} />
            </div>
            <p className="font-semibold text-[var(--foreground)]">Quick Create</p>
          </div>
          <InvoiceForm databaseReady={databaseReady} />
        </Card>

        {/* Invoice list */}
        <div className="flex flex-col gap-5">
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-[var(--foreground)]">Recent Invoices</p>
              </div>
              {invoices.length > 0 && (
                <ButtonLink href="/invoices" variant="ghost" className="px-2 py-1 text-xs text-[var(--payout-blue)]">
                  View all
                </ButtonLink>
              )}
            </div>

            {invoices.length === 0 ? (
              <EmptyState
                icon={FileText}
                title={databaseReady ? "No invoices yet" : "Invoice data unavailable"}
                description={
                  databaseReady
                    ? "Create your first invoice to generate a public payment page."
                    : "Connect a database to enable invoice management."
                }
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      {["Invoice ID", "Customer", "Amount", "Due Date", "Type", "Payment link"].map((h) => (
                        <th key={h} className="pb-3 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice, idx) => {
                      const paymentUrl = invoice.paymentUrl ?? `${getAppUrl()}/pay/invoice/${invoice.id}`;
                      const invNum = invoiceNumber(idx + 1);
                      return (
                        <tr key={invoice.id} className="group border-b border-[var(--border)] last:border-0">
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <ButtonLink
                                href={`/pay/invoice/${invoice.id}`}
                                variant="ghost"
                                className="px-0 py-0 text-xs font-bold text-[var(--payout-blue)] hover:underline"
                              >
                                {invNum}
                              </ButtonLink>
                              <Badge value={invoice.status} />
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <CustomerAvatar name={invoice.customerName} size="sm" />
                              <div>
                                <p className="font-medium text-[var(--foreground)]">{invoice.customerName}</p>
                                <p className="text-xs text-[var(--muted)]">{invoice.customerEmail}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 font-semibold text-[var(--foreground)]">
                            {formatNaira(invoice.amount)}
                          </td>
                          <td className="py-3 text-xs text-[var(--muted)]">
                            {invoice.dueDate
                              ? invoice.dueDate.toLocaleDateString("en-NG", { day: "2-digit", month: "2-digit", year: "numeric" })
                              : "—"}
                          </td>
                          <td className="py-3">
                            {invoice.isRecurring ? (
                              <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-[var(--payout-blue)]">
                                <RefreshCw size={9} />
                                Every {invoice.recurringDays}d
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400">One-time</span>
                            )}
                          </td>
                          <td className="py-3">
                            <ShareInvoice url={paymentUrl} customerName={invoice.customerName} compact />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Quick action cards */}
          <div className="grid gap-3 sm:grid-cols-3">
            {quickActions.map(({ icon: Icon, label, description, color, textColor, descColor }) => (
              <div key={label} className={`rounded-xl p-4 ${color} border border-[var(--border)]`}>
                <div className={`mb-2 flex h-7 w-7 items-center justify-center rounded-md ${label === "Send Reminder" ? "bg-white/20" : "bg-blue-50"}`}>
                  <Icon size={14} className={label === "Send Reminder" ? "text-white" : "text-[var(--payout-blue)]"} />
                </div>
                <p className={`text-sm font-semibold ${textColor}`}>{label}</p>
                <p className={`mt-1 text-xs leading-relaxed ${descColor}`}>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
