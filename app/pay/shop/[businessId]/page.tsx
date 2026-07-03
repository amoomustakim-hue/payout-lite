import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { startShopPaymentAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function PayShopPage({ params }: { params: Promise<{ businessId: string }> }) {
  const { businessId } = await params;

  const db = getDb();
  const business = await db.business.findUnique({ where: { slug: businessId } });
  if (!business) notFound();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--payout-blue)] shadow-lg shadow-blue-500/25">
            <span className="text-xl font-black text-white">PL</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{business.name}</h1>
          <p className="mt-1 text-sm text-slate-500">Shop payment via QR</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/80 bg-white/90 p-6 shadow-xl shadow-slate-200/60 backdrop-blur-sm">
          <p className="mb-5 text-sm font-semibold text-slate-700">Enter payment details</p>
          <form action={startShopPaymentAction} className="grid gap-4">
            <input type="hidden" name="businessSlug" value={business.slug} />

            <div className="grid gap-1.5">
              <label className="text-xs font-semibold text-slate-500" htmlFor="amount">
                Amount (NGN) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                  ₦
                </span>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  min="1"
                  step="any"
                  required
                  placeholder="0.00"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[var(--payout-blue)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--payout-blue)]/10"
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <label className="text-xs font-semibold text-slate-500" htmlFor="email">
                Your email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[var(--payout-blue)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--payout-blue)]/10"
              />
            </div>

            <div className="grid gap-1.5">
              <label className="text-xs font-semibold text-slate-500" htmlFor="customerName">
                Your name <span className="text-slate-400">(optional)</span>
              </label>
              <input
                id="customerName"
                name="customerName"
                type="text"
                placeholder="Full name"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[var(--payout-blue)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--payout-blue)]/10"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-[var(--payout-blue)] py-3.5 text-sm font-bold text-white shadow-md shadow-blue-500/30 transition hover:bg-[var(--payout-blue-dark)] active:scale-[.98]"
            >
              Continue to payment →
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-slate-400">
          Payments secured by Nomba · Powered by Payout Lite
        </p>
      </div>
    </main>
  );
}
