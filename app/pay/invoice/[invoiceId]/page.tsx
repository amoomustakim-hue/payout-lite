import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PayoutLiteLogo } from "@/components/brand/payout-lite-logo";
import { formatNaira } from "@/lib/format";
import { getDb } from "@/lib/db";
import { startInvoicePaymentAction } from "./actions";

export const dynamic = "force-dynamic";

async function getInvoice(invoiceId: string) {
  try {
    return await getDb().invoice.findUnique({
      where: { id: invoiceId },
      include: { business: true },
    });
  } catch {
    return null;
  }
}

export default async function PayInvoicePage({ params }: { params: Promise<{ invoiceId: string }> }) {
  const { invoiceId } = await params;
  const invoice = await getInvoice(invoiceId);

  if (!invoice) {
    notFound();
  }

  const isPaid = invoice.status === "PAID";

  return (
    <main className="grid min-h-screen place-items-center px-5 py-10">
      <div className="w-full max-w-xl">
        <div className="mb-6 flex justify-center">
          <PayoutLiteLogo />
        </div>
        <Card className="p-6 md:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[var(--payout-blue)]">Invoice from {invoice.business.name}</p>
              <h1 className="mt-2 text-3xl font-black text-slate-950">{formatNaira(invoice.amount.toString())}</h1>
            </div>
            <Badge value={invoice.status} />
          </div>

          <div className="grid gap-4 rounded-2xl bg-slate-50 p-4 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Customer</span>
              <span className="text-right font-bold text-slate-900">{invoice.customerName}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Email</span>
              <span className="text-right font-bold text-slate-900">{invoice.customerEmail}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Due date</span>
              <span className="text-right font-bold text-slate-900">{invoice.dueDate ? invoice.dueDate.toLocaleDateString("en-NG") : "No due date"}</span>
            </div>
          </div>

          {invoice.description ? <p className="mt-5 text-sm leading-6 text-slate-600">{invoice.description}</p> : null}

          <form action={startInvoicePaymentAction} className="mt-6">
            <input type="hidden" name="invoiceId" value={invoice.id} />
            <button
              className="w-full rounded-xl bg-[var(--payout-blue)] px-5 py-4 text-sm font-black text-white shadow-[0_16px_34px_rgba(33,107,255,0.25)] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              disabled={isPaid}
              type="submit"
            >
              {isPaid ? "Payment confirmed" : "Pay Invoice"}
            </button>
          </form>

          <p className="mt-4 text-center text-xs font-semibold leading-5 text-slate-500">
            Secured by Payout Lite and Nomba Checkout. Payment status is confirmed by webhook, not by redirect alone.
          </p>
        </Card>
      </div>
    </main>
  );
}
