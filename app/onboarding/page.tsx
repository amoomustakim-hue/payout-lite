export default function OnboardingPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-12">
      <h1 className="text-3xl font-bold text-slate-950">Business onboarding</h1>
      <p className="mt-2 text-slate-600">Capture the small-business basics needed to create payment links, QR flows, and virtual accounts.</p>
      <form className="mt-8 grid gap-4 rounded-lg border border-[var(--border)] bg-white p-5">
        <input className="rounded-md border border-[var(--border)] px-4 py-3" placeholder="Business name" />
        <input className="rounded-md border border-[var(--border)] px-4 py-3" placeholder="Business email" type="email" />
        <input className="rounded-md border border-[var(--border)] px-4 py-3" placeholder="Phone number" />
        <button className="rounded-md bg-[var(--payout-blue)] px-4 py-3 font-semibold text-white">Save business</button>
      </form>
    </main>
  );
}
