export default function ShopQrPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-8">
      <h1 className="text-3xl font-bold text-slate-950">Shop QR Code</h1>
      <p className="mt-2 text-slate-600">QR points to a shop payment page where customers enter an amount and pay through Nomba checkout.</p>
      <section className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="rounded-lg border border-[var(--border)] bg-white p-5">
          <div className="qr-grid h-64 w-full rounded-md border border-slate-200" />
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-white p-5">
          <h2 className="font-semibold text-slate-950">Shop payment link</h2>
          <p className="mt-3 rounded-md bg-blue-50 p-3 text-sm text-[var(--payout-blue)]">https://your-domain.vercel.app/pay/shop/business_demo</p>
        </div>
      </section>
    </main>
  );
}
