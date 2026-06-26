import type { HTMLAttributes } from "react";
import { clsx } from "clsx";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx("rounded-2xl border border-[var(--border)] bg-white/92 p-5 shadow-[0_20px_60px_rgba(15,37,68,0.08)]", className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("mb-5 flex items-start justify-between gap-4", className)} {...props} />;
}
