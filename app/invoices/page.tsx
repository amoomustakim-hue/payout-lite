import { InvoiceStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CopyInvoiceLink } from "@/components/invoices/copy-invoice-link";
import { createInvoiceAction } from "@/app/invoices/actions";
import { formatNaira } from "@/lib/format";
import { getAppUrl } from "@/lib/app-url";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

type InvoiceRow = {
  id: string;
  customerName: string;
  customerEmail: string;
  amount: string;
  description: string | null;
  dueDate: Date | null;
  status: InvoiceStatus;
  paymentUrl: string | null;
};

async function getInvoices(): Promise<{ invoices: InvoiceRow[]; databaseReady: boolean }> {
  try {
    const invoices = await getDb().invoice.findMany({
      orderBy: { createdAt: "desc" },
      take: 25,
    });

    return {
      databaseReady: true,
      invoices: invoices.map((invoice) => ({
        ...invoice,
        amount: invoice.amount.toString(),
      })),
    };
  } catch {
    return { databaseReady: false, invoices: [] };
  }
}

export default async function InvoicesPage() {
  const { invoices, databaseReady } = await getInvoices();

  return (
    <main className="mx-auto max-w-7xl px-5 py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--payout-blue)]">Payout Lite</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950 md:text-4xl">Invoices</h1>
          <p className="mt-2 text-slate-600">Create invoices, share payment pages, and track confirmed payments.</p>
        </div>
        <ButtonLink href="#create-invoice">Create invoice</ButtonLink>
      </div>

      {!databaseReady ? (
        <Card className="mb-6 border-blue-100 bg-blue-50/70">
          <p className="font-bold text-slate-950">Database connection needed</p>
          <p className="mt-1 text-sm text-slate-600">Add DATABASE_URL and run Prisma migrations to create and list live invoices.</p>
        </Card>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <Card id="create-invoice" className="h-fit">
          <div className="mb-5">
            <h2 className="text-lg font-black text-slate-950">New invoice</h2>
            <p className="mt-1 text-sm text-slate-500">Status starts as UNPAID. Nomba webhook confirmation moves it to PAID.</p>
          </div>
          <form action={createInvoiceAction} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="customerName">Customer name</Label>
              <Input id="customerName" name="customerName" placeholder="Ada Johnson" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customerEmail">Customer email</Label>
              <Input id="customerEmail" name="customerEmail" placeholder="ada@example.com" type="email" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" name="amount" placeholder="120000" min="1" step="0.01" type="number" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" className="min-h-24" placeholder="Goods supplied for March" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due date</Label>
              <Input id="dueDate" name="dueDate" type="date" />
            </div>
            <button className="rounded-xl bg-[var(--payout-blue)] px-4 py-3 text-sm font-bold text-white shadow-[0_14px_30px_rgba(33,107,255,0.24)]" type="submit">
              Create invoice
            </button>
          </form>
        </Card>

        <Card>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-950">Invoice list</h2>
              <p className="mt-1 text-sm text-slate-500">Share links and watch webhook-confirmed status changes.</p>
            </div>
            <Badge value={`${invoices.length} TOTAL`} className="bg-blue-50 text-[var(--payout-blue)] ring-blue-100" />
          </div>

          {invoices.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/60 p-8 text-center">
              <p className="text-lg font-black text-slate-950">No invoices yet</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">Create your first invoice to generate a public payment page and Nomba checkout flow.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {invoices.map((invoice) => {
                const paymentUrl = invoice.paymentUrl ?? `${getAppUrl()}/pay/invoice/${invoice.id}`;
                return (
                  <div key={invoice.id} className="rounded-2xl border border-[var(--border)] bg-white p-4">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-black text-slate-950">{invoice.customerName}</p>
                          <Badge value={invoice.status} />
                        </div>
                        <p className="mt-1 text-sm text-slate-500">{invoice.customerEmail}</p>
                        <p className="mt-3 max-w-2xl text-sm text-slate-600">{invoice.description}</p>
                        <p className="mt-3 text-xs font-semibold text-slate-400">Due {invoice.dueDate ? invoice.dueDate.toLocaleDateString("en-NG") : "No due date"}</p>
                      </div>
                      <div className="md:text-right">
                        <p className="text-2xl font-black text-slate-950">{formatNaira(invoice.amount)}</p>
                        <div className="mt-3 flex flex-wrap gap-2 md:justify-end">
                          <ButtonLink href={`/pay/invoice/${invoice.id}`} variant="secondary" className="px-3 py-2 text-xs">View</ButtonLink>
                          <CopyInvoiceLink url={paymentUrl} />
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 break-all rounded-xl bg-slate-50 p-3 text-xs font-semibold text-slate-500">{paymentUrl}</p>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </section>
    </main>
  );
}
