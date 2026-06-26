import { clsx } from "clsx";

const statusClasses: Record<string, string> = {
  PAID: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  PENDING: "bg-blue-50 text-[var(--payout-blue)] ring-blue-100",
  UNPAID: "bg-slate-100 text-slate-700 ring-slate-200",
  FAILED: "bg-rose-50 text-rose-700 ring-rose-100",
  CANCELLED: "bg-slate-100 text-slate-500 ring-slate-200",
  OVERDUE: "bg-amber-50 text-amber-700 ring-amber-100",
};

export function Badge({ value, className }: { value: string; className?: string }) {
  return (
    <span className={clsx("inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1", statusClasses[value] ?? statusClasses.UNPAID, className)}>
      {value.replace("_", " ")}
    </span>
  );
}
