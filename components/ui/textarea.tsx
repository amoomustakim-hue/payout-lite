import type { TextareaHTMLAttributes } from "react";
import { clsx } from "clsx";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={clsx("w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--foreground)] transition placeholder:text-slate-400 focus:border-[var(--payout-blue)] focus:ring-2 focus:ring-[var(--payout-blue)]/10", className)}
      {...props}
    />
  );
}
