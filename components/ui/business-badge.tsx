import { ChevronDown } from "lucide-react";
import { getCurrentBusiness } from "@/lib/auth/get-current-business";

export async function BusinessBadge() {
  const business = await getCurrentBusiness();
  const name = business?.name ?? "My Business";

  return (
    <button className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-slate-50">
      <span className="max-w-[120px] truncate">{name}</span>
      <ChevronDown size={13} className="shrink-0 text-slate-400" />
    </button>
  );
}
