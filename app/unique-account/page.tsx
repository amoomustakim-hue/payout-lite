import { Landmark, Copy, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

export default function UniqueAccountPage() {
  return (
    <div>
      <PageHeader
        title="Unique Account"
        description="One virtual bank account per business. Incoming transfers are reconciled automatically via Nomba webhooks."
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        {/* Account details */}
        <Card>
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-[var(--payout-blue)]">
              <Landmark size={14} />
            </div>
            <p className="font-semibold text-[var(--foreground)]">Virtual Account</p>
          </div>

          <div className="grid gap-4 rounded-xl border border-[var(--border)] bg-slate-50 p-5 sm:grid-cols-3">
            {[
              { label: "Bank name", value: "Nomba Bank" },
              { label: "Account number", value: "0123456789" },
              { label: "Account name", value: "Ada Stores — Payout Lite" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs font-medium text-[var(--muted)]">{label}</p>
                <p className="mt-1 font-bold text-[var(--foreground)]">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <button className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--foreground)] transition hover:bg-slate-50">
              <Copy size={12} />
              Copy account details
            </button>
            <button className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--foreground)] transition hover:bg-slate-50">
              <RefreshCw size={12} />
              Refresh from Nomba
            </button>
          </div>
        </Card>

        {/* Instructions */}
        <div className="rounded-xl border border-[var(--border)] bg-slate-50 p-5">
          <p className="text-sm font-semibold text-[var(--foreground)]">How it works</p>
          <ol className="mt-3 grid gap-3 text-sm text-[var(--muted)]">
            {[
              "Share your unique account number with any customer or partner.",
              "They transfer money via their bank or mobile app.",
              "Nomba sends a webhook confirming the incoming payment.",
              "The transaction appears in your dashboard automatically.",
            ].map((step, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--payout-blue)] text-[10px] font-bold text-white">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-700">
        Showing demo data — connect DATABASE_URL and Nomba credentials to create a real virtual account.
      </div>
    </div>
  );
}
