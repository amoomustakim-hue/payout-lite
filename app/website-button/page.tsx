const snippet = `<a href="https://your-domain.vercel.app/pay/button/business_demo" style="background:#0657d8;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:700">Pay with Payout Lite</a>`;

export default function WebsiteButtonPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-8">
      <h1 className="text-3xl font-bold text-slate-950">Website Payment Button</h1>
      <p className="mt-2 text-slate-600">Give merchants a link and a small HTML button snippet for their website.</p>
      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-[var(--border)] bg-white p-5">
          <h2 className="font-semibold text-slate-950">Payment URL</h2>
          <p className="mt-3 rounded-md bg-blue-50 p-3 text-sm text-[var(--payout-blue)]">https://your-domain.vercel.app/pay/button/business_demo</p>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-white p-5">
          <h2 className="font-semibold text-slate-950">HTML snippet</h2>
          <pre className="mt-3 overflow-x-auto rounded-md bg-slate-950 p-4 text-xs text-white">{snippet}</pre>
        </div>
      </section>
    </main>
  );
}
