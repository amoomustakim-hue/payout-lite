"use client";

import { useEffect } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";
import { saveBusinessAction, type OnboardingFormState } from "@/app/onboarding/actions";

const initialState: OnboardingFormState = {};

const CATEGORIES = [
  "Retail / Store",
  "Food & Restaurant",
  "Fashion & Apparel",
  "Electronics",
  "Health & Beauty",
  "Professional Services",
  "Education",
  "Technology",
  "Logistics",
  "Other",
];

const inputClass =
  "w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--foreground)] placeholder:text-slate-400 focus:border-[var(--payout-blue)] focus:outline-none focus:ring-2 focus:ring-[var(--payout-blue)]/10";

export function BusinessForm({
  defaultName = "",
  defaultEmail = "",
  defaultPhone = "",
  defaultCategory = "",
  defaultWebsite = "",
  defaultAddress = "",
  defaultDescription = "",
  redirectOnSuccess,
  submitLabel = "Save changes",
}: {
  defaultName?: string;
  defaultEmail?: string;
  defaultPhone?: string;
  defaultCategory?: string;
  defaultWebsite?: string;
  defaultAddress?: string;
  defaultDescription?: string;
  redirectOnSuccess?: string;
  submitLabel?: string;
}) {
  const [state, formAction, isPending] = useActionState(saveBusinessAction, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success && redirectOnSuccess) {
      router.push(redirectOnSuccess);
    }
  }, [state.success, redirectOnSuccess, router]);

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <label className="text-xs font-semibold text-[var(--muted)]" htmlFor="biz-name">
            Business name <span className="text-red-500">*</span>
          </label>
          <input id="biz-name" name="name" defaultValue={defaultName} required className={inputClass} placeholder="Ada Stores" />
        </div>
        <div className="grid gap-1.5">
          <label className="text-xs font-semibold text-[var(--muted)]" htmlFor="biz-category">
            Category
          </label>
          <select id="biz-category" name="category" defaultValue={defaultCategory} className={inputClass}>
            <option value="">Select a category…</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <label className="text-xs font-semibold text-[var(--muted)]" htmlFor="biz-email">
            Business email <span className="text-red-500">*</span>
          </label>
          <input id="biz-email" name="email" type="email" defaultValue={defaultEmail} required className={inputClass} placeholder="owner@example.com" />
        </div>
        <div className="grid gap-1.5">
          <label className="text-xs font-semibold text-[var(--muted)]" htmlFor="biz-phone">
            Phone number
          </label>
          <input id="biz-phone" name="phone" type="tel" defaultValue={defaultPhone} className={inputClass} placeholder="+234 800 000 0000" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <label className="text-xs font-semibold text-[var(--muted)]" htmlFor="biz-website">
            Website
          </label>
          <input id="biz-website" name="website" type="url" defaultValue={defaultWebsite} className={inputClass} placeholder="https://yourstore.com" />
        </div>
        <div className="grid gap-1.5">
          <label className="text-xs font-semibold text-[var(--muted)]" htmlFor="biz-address">
            Address
          </label>
          <input id="biz-address" name="address" defaultValue={defaultAddress} className={inputClass} placeholder="12 Market Rd, Lagos" />
        </div>
      </div>

      <div className="grid gap-1.5">
        <label className="text-xs font-semibold text-[var(--muted)]" htmlFor="biz-description">
          What does your business do?
        </label>
        <textarea
          id="biz-description"
          name="description"
          defaultValue={defaultDescription}
          rows={3}
          className={`${inputClass} min-h-20 resize-y`}
          placeholder="Short description customers will recognise on their receipts."
        />
      </div>

      {state.error && (
        <p className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">{state.error}</p>
      )}
      {state.success && !redirectOnSuccess && (
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
        {isPending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
