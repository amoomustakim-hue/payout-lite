import { clsx } from "clsx";

const statusClasses: Record<string, string> = {
  PAID: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  PENDING: "bg-amber-50 text-amber-700 border border-amber-100",
  UNPAID: "bg-slate-100 text-slate-600 border border-slate-200",
  FAILED: "bg-rose-50 text-rose-700 border border-rose-100",
  CANCELLED: "bg-slate-100 text-slate-500 border border-slate-200",
  OVERDUE: "bg-rose-50 text-rose-700 border border-rose-100",
  DRAFT: "bg-slate-100 text-slate-500 border border-slate-200",
};

export function Badge({ value, className }: { value: string; className?: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        statusClasses[value] ?? statusClasses.UNPAID,
        className,
      )}
    >
      {value.replace(/_/g, " ")}
    </span>
  );
}
