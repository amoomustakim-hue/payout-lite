import type { TextareaHTMLAttributes } from "react";
import { clsx } from "clsx";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={clsx("w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--payout-blue)] focus:ring-4 focus:ring-blue-100", className)}
      {...props}
    />
  );
}
