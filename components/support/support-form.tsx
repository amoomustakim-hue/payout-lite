"use client";

import { useActionState } from "react";
import { sendSupportMessageAction, type SupportResult } from "@/app/support/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Send, Loader2 } from "lucide-react";

const INITIAL: SupportResult = { success: false };

const SUBJECTS = [
  "Payment not confirmed",
  "Virtual account issue",
  "Invoice not delivered",
  "QR code not working",
  "AI CFO question",
  "Account / billing",
  "Feature request",
  "Other",
];

export function SupportForm() {
  const [state, action, pending] = useActionState(sendSupportMessageAction, INITIAL);

  if (state.success) {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 size={32} className="text-emerald-600" />
        </div>
        <div>
          <p className="text-lg font-bold text-slate-900">Message sent!</p>
          <p className="mt-1 text-sm text-slate-500">
            We&apos;ve received your request and will reply within 24 hours.
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 rounded-lg border border-[var(--border)] px-5 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-slate-50"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="name">Your name</Label>
          <Input id="name" name="name" placeholder="Ada Johnson" required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input id="email" name="email" type="email" placeholder="ada@example.com" required />
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="subject">Subject</Label>
        <select
          id="subject"
          name="subject"
          required
          className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-[var(--foreground)] focus:border-[var(--payout-blue)] focus:outline-none focus:ring-2 focus:ring-[var(--payout-blue)]/10"
        >
          <option value="">Select a topic…</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          required
          placeholder="Describe your issue in as much detail as possible…"
          className="min-h-32"
        />
      </div>

      {state.error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex items-center justify-center gap-2 rounded-lg bg-[var(--payout-blue)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--payout-blue-dark)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
