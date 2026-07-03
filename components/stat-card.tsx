import type { LucideIcon } from "lucide-react";
import { clsx } from "clsx";

type BadgeVariant = "green" | "amber" | "blue" | "slate";

const accentColor: Record<BadgeVariant, string> = {
  green: "from-emerald-400 to-emerald-600",
  amber: "from-amber-400 to-orange-500",
  blue: "from-blue-500 to-indigo-600",
  slate: "from-slate-400 to-slate-600",
};

const badgeText: Record<BadgeVariant, string> = {
  green: "text-emerald-600",
  amber: "text-amber-600",
  blue: "text-[var(--payout-blue)]",
  slate: "text-slate-500",
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
        "relative overflow-hidden rounded-2xl border border-white/70 bg-white/60 p-5 shadow-lg shadow-slate-200/50 backdrop-blur-md",
        className,
      )}
    >
      {/* Subtle gradient orb in corner */}
      <div
        className={clsx(
          "pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br opacity-[0.08] blur-xl",
          accentColor[variant],
        )}
      />

      <div className="flex items-start justify-between gap-3">
        {Icon && (
          <div
            className={clsx(
              "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm",
              accentColor[variant],
            )}
          >
            <Icon size={17} strokeWidth={2.5} />
          </div>
        )}
        {badge && (
          <span className={clsx("rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm", badgeText[variant])}>
            {badge}
          </span>
        )}
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
    </div>
  );
}
