import Link from "next/link";

export default function SignInPage() {
  return (
    <main className="mx-auto max-w-md px-5 py-16">
      <h1 className="text-3xl font-bold text-slate-950">Sign in</h1>
      <p className="mt-2 text-slate-600">Simple auth placeholder for the hackathon build. Swap with Clerk before production.</p>
      <form className="mt-8 grid gap-4 rounded-lg border border-[var(--border)] bg-white p-5">
        <input className="rounded-md border border-[var(--border)] px-4 py-3" placeholder="Email address" type="email" />
        <input className="rounded-md border border-[var(--border)] px-4 py-3" placeholder="Password" type="password" />
        <Link href="/dashboard" className="rounded-md bg-[var(--payout-blue)] px-4 py-3 text-center font-semibold text-white">
          Continue
        </Link>
      </form>
    </main>
  );
}
