import Link from "next/link";

const features = ["Invoices", "Payment buttons", "Shop QR", "Unique account numbers", "Webhook confirmations", "AI CFO summaries"];

export default function HomePage() {
  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--payout-blue)]">Nomba Hackathon Demo</p>
          <h1 className="max-w-3xl text-5xl font-bold leading-tight text-slate-950 md:text-6xl">Payout Lite</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            A clean payment hub for small Nigerian businesses to collect, confirm, and understand payments without heavyweight operations.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dashboard" className="rounded-md bg-[var(--payout-blue)] px-5 py-3 font-semibold text-white">
              Open dashboard
            </Link>
            <Link href="/onboarding" className="rounded-md border border-[var(--border)] bg-white px-5 py-3 font-semibold text-slate-800">
              Create business
            </Link>
          </div>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Today received</p>
              <p className="text-3xl font-bold text-slate-950">NGN 482,000</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">Webhook confirmed</span>
          </div>
          <div className="grid gap-3">
            {features.map((feature) => (
              <div key={feature} className="flex items-center justify-between rounded-md border border-blue-100 bg-blue-50/50 px-4 py-3">
                <span className="font-medium text-slate-800">{feature}</span>
                <span className="h-2 w-2 rounded-full bg-[var(--payout-blue)]" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
