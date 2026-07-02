import type { LucideIcon } from "lucide-react";
import { clsx } from "clsx";

type BadgeVariant = "green" | "amber" | "blue" | "slate";

const badgeStyles: Record<BadgeVariant, string> = {
  green: "text-emerald-600",
  amber: "text-amber-600",
  blue: "text-[var(--payout-blue)]",
  slate: "text-slate-500",
};

const iconBg: Record<BadgeVariant, string> = {
  green: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  blue: "bg-blue-50 text-[var(--payout-blue)]",
  slate: "bg-slate-100 text-slate-500",
};

type StatCardProps = {
  label: string;
  value: string;
  badge?: string;
  variant?: BadgeVariant;
  icon?: LucideIcon;
  className?: string;
};

export function StatCard({
  label,
  value,
  badge,
  variant = "blue",
  icon: Icon,
  className,
}: StatCardProps) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        {Icon && (
          <div
            className={clsx(
              "flex h-9 w-9 items-center justify-center rounded-lg",
              iconBg[variant],
            )}
          >
            <Icon size={17} strokeWidth={2} />
          </div>
        )}
        {badge && (
          <span className={clsx("text-xs font-semibold", badgeStyles[variant])}>
            {badge}
          </span>
        )}
      </div>
      <p className="mt-4 text-sm font-medium text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">{value}</p>
    </div>
  );
}
