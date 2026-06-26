export default async function PayShopPage({ params }: { params: Promise<{ businessId: string }> }) {
  const { businessId } = await params;

  return (
    <main className="mx-auto max-w-md px-5 py-16">
      <h1 className="text-3xl font-bold text-slate-950">Shop payment</h1>
      <p className="mt-2 text-slate-600">Enter the amount for business {businessId}.</p>
      <form className="mt-8 grid gap-4 rounded-lg border border-[var(--border)] bg-white p-5">
        <input className="rounded-md border border-[var(--border)] px-4 py-3" placeholder="Amount" type="number" />
        <input className="rounded-md border border-[var(--border)] px-4 py-3" placeholder="Email" type="email" />
        <button className="rounded-md bg-[var(--payout-blue)] px-4 py-3 font-semibold text-white">Continue to Nomba checkout</button>
        <p className="text-sm text-slate-500">Payment is confirmed by webhook, not by redirect alone.</p>
      </form>
    </main>
  );
}
