import { CheckCircle2, Download } from "lucide-react";
import { PayoutLiteLogo } from "@/components/brand/payout-lite-logo";
import { getDb } from "@/lib/db";
import { formatNaira } from "@/lib/format";
import { ButtonLink } from "@/components/ui/button";

export const dynamic = "force-dynamic";

async function getInvoiceDetails(invoiceId: string) {
  try {
    return await getDb().invoice.findUnique({
      where: { id: invoiceId },
      include: { business: { select: { name: true, email: true } } },
    });
  } catch {
    return null;
  }
}

export default async function InvoiceSuccessPage({ params }: { params: Promise<{ invoiceId: string }> }) {
  const { invoiceId } = await params;
  const invoice = await getInvoiceDetails(invoiceId);

  const paid = invoice?.status === "PAID";
  const isPending = !paid;

  return (
    <main className="grid min-h-screen place-items-center bg-[#F4F8FF] px-5 py-10 print:bg-white">
      <div className="w-full max-w-lg">
        <div className="mb-6 flex justify-center">
          <PayoutLiteLogo />
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
          {/* Status header */}
          <div className={`px-8 py-6 text-center ${paid ? "bg-emerald-50" : "bg-amber-50"}`}>
            <div className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full ${paid ? "bg-emerald-100" : "bg-amber-100"}`}>
              <CheckCircle2 size={28} className={paid ? "text-emerald-600" : "text-amber-500"} />
            </div>
            <h1 className="text-xl font-black text-slate-900">
              {paid ? "Payment Confirmed!" : "Confirmation Pending"}
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              {paid
                ? "This payment has been verified by Nomba webhook."
                : "Your payment is being verified. This page updates automatically."}
            </p>
          </div>

          {/* Invoice details */}
          {invoice && (
            <div className="px-8 py-6">
              {/* Amount */}
              <div className="mb-5 text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Amount Paid</p>
                <p className="mt-1 text-4xl font-black text-slate-900">{formatNaira(invoice.amount.toString())}</p>
              </div>

              <div className="divide-y divide-slate-100 rounded-xl border border-slate-100 bg-slate-50">
                {[
                  { label: "From", value: invoice.business.name },
                  { label: "To", value: invoice.customerName },
                  { label: "Email", value: invoice.customerEmail },
                  { label: "Description", value: invoice.description ?? "—" },
                  {
                    label: "Invoice Date",
                    value: invoice.createdAt.toLocaleDateString("en-NG", {
                      day: "2-digit", month: "long", year: "numeric",
                    }),
                  },
                  { label: "Status", value: invoice.status },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start justify-between gap-4 px-4 py-3">
                    <span className="text-xs font-medium text-slate-500">{label}</span>
                    <span className={`text-right text-sm font-semibold ${label === "Status" && paid ? "text-emerald-600" : "text-slate-800"}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-center text-xs text-slate-400">
                Reference: <span className="font-mono">{invoiceId.slice(0, 20)}…</span>
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-2 border-t border-slate-100 px-8 py-5 print:hidden">
            {paid && (
              <button
                onClick={() => window.print()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <Download size={14} />
                Download receipt
              </button>
            )}
            <ButtonLink href={`/pay/invoice/${invoiceId}`} variant="secondary" className="w-full justify-center">
              View invoice
            </ButtonLink>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-slate-400">
          Powered by Payout Lite · Secured by Nomba Checkout
        </p>
      </div>
    </main>
  );
}
