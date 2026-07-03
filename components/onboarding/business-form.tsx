"use client";

import { useActionState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { saveBusinessAction, type OnboardingFormState } from "@/app/onboarding/actions";

const initialState: OnboardingFormState = {};

export function BusinessForm({ defaultName = "", defaultEmail = "", defaultPhone = "" }: {
  defaultName?: string;
  defaultEmail?: string;
  defaultPhone?: string;
}) {
  const [state, formAction, isPending] = useActionState(saveBusinessAction, initialState);

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-1.5">
        <label className="text-xs font-semibold text-[var(--muted)]" htmlFor="biz-name">
          Business name <span className="text-red-500">*</span>
        </label>
        <input
          id="biz-name"
          name="name"
          defaultValue={defaultName}
          required
          className="w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--foreground)] placeholder:text-slate-400 focus:border-[var(--payout-blue)] focus:outline-none focus:ring-2 focus:ring-[var(--payout-blue)]/10"
          placeholder="Ada Stores"
        />
      </div>
      <div className="grid gap-1.5">
        <label className="text-xs font-semibold text-[var(--muted)]" htmlFor="biz-email">
          Business email <span className="text-red-500">*</span>
        </label>
        <input
          id="biz-email"
          name="email"
          type="email"
          defaultValue={defaultEmail}
          required
          className="w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--foreground)] placeholder:text-slate-400 focus:border-[var(--payout-blue)] focus:outline-none focus:ring-2 focus:ring-[var(--payout-blue)]/10"
          placeholder="owner@example.com"
        />
      </div>
      <div className="grid gap-1.5">
        <label className="text-xs font-semibold text-[var(--muted)]" htmlFor="biz-phone">
          Phone number
        </label>
        <input
          id="biz-phone"
          name="phone"
          type="tel"
          defaultValue={defaultPhone}
          className="w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--foreground)] placeholder:text-slate-400 focus:border-[var(--payout-blue)] focus:outline-none focus:ring-2 focus:ring-[var(--payout-blue)]/10"
          placeholder="+234 800 000 0000"
        />
      </div>

      {state.error && (
        <p className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">{state.error}</p>
      )}
      {state.success && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          <CheckCircle2 size={13} />
          Business profile saved successfully!
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--payout-blue)] py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--payout-blue-dark)] disabled:opacity-60"
      >
        {isPending && <Loader2 size={14} className="animate-spin" />}
        {isPending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
