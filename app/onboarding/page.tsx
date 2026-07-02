import { Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

export default function OnboardingPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your business profile and payment configuration."
      />

      <div className="grid gap-5 lg:grid-cols-[480px_1fr]">
        <Card>
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-[var(--payout-blue)]">
              <Building2 size={14} />
            </div>
            <p className="font-semibold text-[var(--foreground)]">Business Profile</p>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <label className="text-xs font-semibold text-[var(--muted)]" htmlFor="biz-name">
                Business name
              </label>
              <input
                id="biz-name"
                className="w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--foreground)] placeholder:text-slate-400 focus:border-[var(--payout-blue)] focus:ring-2 focus:ring-[var(--payout-blue)]/10"
                placeholder="Ada Stores"
              />
            </div>
            <div className="grid gap-1.5">
              <label className="text-xs font-semibold text-[var(--muted)]" htmlFor="biz-email">
                Business email
              </label>
              <input
                id="biz-email"
                className="w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--foreground)] placeholder:text-slate-400 focus:border-[var(--payout-blue)] focus:ring-2 focus:ring-[var(--payout-blue)]/10"
                placeholder="owner@example.com"
                type="email"
              />
            </div>
            <div className="grid gap-1.5">
              <label className="text-xs font-semibold text-[var(--muted)]" htmlFor="biz-phone">
                Phone number
              </label>
              <input
                id="biz-phone"
                className="w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--foreground)] placeholder:text-slate-400 focus:border-[var(--payout-blue)] focus:ring-2 focus:ring-[var(--payout-blue)]/10"
                placeholder="+234 800 000 0000"
                type="tel"
              />
            </div>
            <button className="mt-1 w-full rounded-lg bg-[var(--payout-blue)] py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--payout-blue-dark)]">
              Save changes
            </button>
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-5 text-sm">
            <p className="font-semibold text-amber-800">Auth coming soon</p>
            <p className="mt-1 text-amber-700">
              This form is a placeholder. Clerk authentication will be added to tie businesses to real user accounts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
