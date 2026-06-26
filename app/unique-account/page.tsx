export default function UniqueAccountPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-8">
      <h1 className="text-3xl font-bold text-slate-950">Unique Account</h1>
      <p className="mt-2 text-slate-600">Create one virtual account per business and reconcile incoming transfers from Nomba webhooks.</p>
      <section className="mt-6 rounded-lg border border-[var(--border)] bg-white p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-slate-500">Bank name</p>
            <p className="mt-1 text-xl font-bold text-slate-950">Nomba Bank</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Account number</p>
            <p className="mt-1 text-xl font-bold text-slate-950">0123456789</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Account name</p>
            <p className="mt-1 text-xl font-bold text-slate-950">Ada Stores - Payout Lite</p>
          </div>
        </div>
      </section>
    </main>
  );
}
