import type { InputHTMLAttributes } from "react";
import { clsx } from "clsx";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(
        "w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--foreground)] placeholder:text-slate-400 transition focus:border-[var(--payout-blue)] focus:ring-2 focus:ring-[var(--payout-blue)]/10",
        className,
      )}
      {...props}
    />
  );
}
