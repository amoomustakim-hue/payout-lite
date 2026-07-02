import Link from "next/link";
import { PayoutLiteLogo } from "@/components/brand/payout-lite-logo";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <PayoutLiteLogo />
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
          <h1 className="mb-1 text-lg font-bold text-[var(--foreground)]">Sign in</h1>
          <p className="mb-5 text-sm text-[var(--muted)]">
            Placeholder — Clerk auth coming soon.
          </p>

          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <label className="text-xs font-semibold text-[var(--muted)]">Email address</label>
              <input
                className="w-full rounded-lg border border-[var(--border)] bg-slate-50 px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:border-[var(--payout-blue)] focus:ring-2 focus:ring-[var(--payout-blue)]/10"
                placeholder="you@example.com"
                type="email"
              />
            </div>
            <div className="grid gap-1.5">
              <label className="text-xs font-semibold text-[var(--muted)]">Password</label>
              <input
                className="w-full rounded-lg border border-[var(--border)] bg-slate-50 px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:border-[var(--payout-blue)] focus:ring-2 focus:ring-[var(--payout-blue)]/10"
                placeholder="••••••••"
                type="password"
              />
            </div>
            <Link
              href="/dashboard"
              className="mt-1 flex w-full items-center justify-center rounded-lg bg-[var(--payout-blue)] py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--payout-blue-dark)]"
            >
              Continue
            </Link>
          </div>

          <p className="mt-4 text-center text-xs text-[var(--muted)]">
            No account?{" "}
            <Link href="/sign-up" className="font-semibold text-[var(--payout-blue)] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
