import Link from "next/link";
import {
  FileText,
  Globe,
  QrCode,
  Landmark,
  Webhook,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Invoices",
    description:
      "Create invoices and share hosted payment pages. Status updates automatically on webhook confirmation.",
  },
  {
    icon: Globe,
    title: "Website Button",
    description:
      "Drop a payment button on any website. Customers click to pay via Nomba Checkout.",
  },
  {
    icon: QrCode,
    title: "Shop QR",
    description:
      "Print a QR code for your shop. Walk-in customers scan to pay any amount instantly.",
  },
  {
    icon: Landmark,
    title: "Unique Account",
    description:
      "One virtual account per business. Reconcile transfers automatically from Nomba webhooks.",
  },
  {
    icon: Webhook,
    title: "Webhook Confirmed",
    description:
      "Every payment status is confirmed by Nomba webhooks — not redirects. No false positives.",
  },
  {
    icon: Sparkles,
    title: "AI CFO",
    description:
      "Groq-powered insights grounded in your real transaction data. Ask questions, get answers.",
  },
];

const highlights = [
  "Nomba Checkout integration",
  "HMAC webhook verification",
  "Multi-channel payment collection",
  "Prisma-backed transaction history",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--payout-blue)]">
              <span className="text-xs font-black text-white">PL</span>
            </div>
            <span className="text-sm font-black text-[var(--foreground)]">Payout Lite</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              Sign in
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg bg-[var(--payout-blue)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--payout-blue-dark)]"
            >
              Open dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pb-20 pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-[var(--payout-blue)]">
            Nomba Hackathon Build Track
          </span>
          <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-[var(--foreground)] sm:text-5xl">
            Collect, confirm, and understand{" "}
            <span className="text-[var(--payout-blue)]">payments</span>{" "}
            in one place.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
            Payout Lite is a clean payment hub for small Nigerian businesses — invoices, QR payments, website buttons, and virtual accounts, all confirmed by Nomba webhooks.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-lg bg-[var(--payout-blue)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--payout-blue-dark)]"
            >
              Open dashboard
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/onboarding"
              className="rounded-lg border border-[var(--border)] bg-white px-6 py-3 font-semibold text-[var(--foreground)] transition hover:bg-slate-50"
            >
              Create business
            </Link>
          </div>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {highlights.map((item) => (
              <li key={item} className="flex items-center gap-1.5 text-sm text-[var(--muted)]">
                <CheckCircle2 size={14} className="text-emerald-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Mock dashboard preview */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] shadow-lg">
          {/* Mock topbar */}
          <div className="flex items-center gap-3 border-b border-[var(--border)] bg-white px-5 py-3">
            <div className="h-3 w-3 rounded-full bg-rose-400" />
            <div className="h-3 w-3 rounded-full bg-amber-400" />
            <div className="h-3 w-3 rounded-full bg-emerald-400" />
            <div className="mx-auto flex-1 max-w-xs rounded-md border border-[var(--border)] bg-slate-50 px-3 py-1.5 text-center text-xs text-slate-400">
              payout-lite.vercel.app/dashboard
            </div>
          </div>
          <div className="grid gap-0 bg-[var(--background)] p-6 lg:grid-cols-[200px_1fr]">
            {/* Mock sidebar */}
            <div className="hidden border-r border-[var(--border)] bg-white pr-4 lg:block">
              {["Dashboard", "Invoices", "Website Button", "Shop QR", "Transactions", "AI CFO"].map(
                (item, i) => (
                  <div
                    key={item}
                    className={`mb-1 rounded-lg px-3 py-2 text-xs font-medium ${i === 0 ? "bg-[var(--payout-blue)] text-white" : "text-slate-500"}`}
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
            {/* Mock content */}
            <div className="pl-0 lg:pl-6">
              <p className="mb-4 text-sm font-bold text-[var(--foreground)]">Payment overview</p>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {[
                  { label: "Total received", value: "₦482,000", color: "text-emerald-600", badge: "Webhook confirmed" },
                  { label: "Pending", value: "₦120,000", color: "text-amber-600", badge: "Awaiting confirmation" },
                  { label: "Paid invoices", value: "8", color: "text-slate-500", badge: "This month" },
                  { label: "Payment links", value: "5", color: "text-[var(--payout-blue)]", badge: "Ready to share" },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg border border-[var(--border)] bg-white p-3">
                    <p className={`text-[10px] font-semibold ${s.color}`}>{s.badge}</p>
                    <p className="mt-1 text-base font-black text-[var(--foreground)]">{s.value}</p>
                    <p className="mt-0.5 text-[10px] text-slate-500">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-black text-[var(--foreground)]">Everything a small business needs</h2>
          <p className="mt-3 text-[var(--muted)]">Six payment channels, one dashboard, webhook-confirmed truth.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border border-[var(--border)] bg-white p-5 transition hover:shadow-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[var(--payout-blue)]">
                <Icon size={18} strokeWidth={2} />
              </div>
              <h3 className="font-semibold text-[var(--foreground)]">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--border)] bg-[var(--payout-blue)] py-16">
        <div className="mx-auto max-w-2xl px-5 text-center">
          <h2 className="text-2xl font-black text-white">Ready to collect payments?</h2>
          <p className="mt-3 text-blue-100">
            Set up your business and start generating payment links, invoices, and QR codes in minutes.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-lg bg-white px-6 py-3 font-semibold text-[var(--payout-blue)] transition hover:bg-blue-50"
            >
              Open dashboard
            </Link>
            <Link
              href="/onboarding"
              className="rounded-lg border border-blue-400 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Create business
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-white py-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5">
          <p className="text-xs text-[var(--muted)]">
            © 2025 Payout Lite · Nomba Hackathon
          </p>
          <p className="text-xs text-[var(--muted)]">
            Payments confirmed by Nomba webhooks
          </p>
        </div>
      </footer>
    </div>
  );
}
