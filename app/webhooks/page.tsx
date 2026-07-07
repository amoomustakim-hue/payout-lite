import { CheckCircle2, XCircle, Clock, Webhook } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { hasDatabaseUrl } from "@/lib/db";
import { formatNaira } from "@/lib/format";
import { getCurrentBusiness } from "@/lib/auth/get-current-business";
import { listWebhookEvents } from "@/lib/data/webhooks";
import { sourceLabel } from "@/lib/presenters/source-label";
import { formatRelative } from "@/lib/presenters/format-relative";

export const dynamic = "force-dynamic";

async function getEvents() {
  if (!hasDatabaseUrl()) return [];
  try {
    const business = await getCurrentBusiness();
    if (!business) return [];
    return await listWebhookEvents(business.id);
  } catch {
    return [];
  }
}

export default async function WebhooksPage() {
  const events = await getEvents();

  const verified = events.filter((e) => e.signatureValid).length;
  const total = events.length;

  return (
    <div>
      <PageHeader
        title="Webhook Events"
        description="Every Nomba payment event received and verified by HMAC-SHA256 signature."
      />

      {/* Stats strip */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total events", value: total, color: "text-slate-900" },
          { label: "Verified ✓", value: verified, color: "text-emerald-600" },
          { label: "Unverified", value: total - verified, color: "text-red-500" },
          {
            label: "Signature rate",
            value: total > 0 ? `${Math.round((verified / total) * 100)}%` : "—",
            color: "text-[var(--payout-blue)]",
          },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-[var(--border)] bg-white p-4">
            <p className="text-xs font-medium text-[var(--muted)]">{label}</p>
            <p className={`mt-1 text-2xl font-black ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <Card>
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-[var(--payout-blue)]">
            <Webhook size={14} />
          </div>
          <p className="font-semibold text-[var(--foreground)]">Event Log</p>
          <span className="ml-auto rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
            Last 100
          </span>
        </div>

        {events.length === 0 ? (
          <EmptyState
            icon={Webhook}
            title="No webhook events yet"
            description="Events will appear here as Nomba sends payment confirmations. Every event is verified by HMAC-SHA256 signature."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  {["Signature", "Event Type", "Transaction", "Source", "Amount", "Received"].map((h) => (
                    <th
                      key={h}
                      className="pb-3 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id} className="border-b border-[var(--border)] last:border-0">
                    <td className="py-3">
                      {ev.signatureValid ? (
                        <span className="flex items-center gap-1.5 text-emerald-600">
                          <CheckCircle2 size={14} />
                          <span className="text-xs font-semibold">Valid</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-red-500">
                          <XCircle size={14} />
                          <span className="text-xs font-semibold">Invalid</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                        {ev.eventType}
                      </span>
                    </td>
                    <td className="py-3">
                      {ev.transaction ? (
                        <p className="max-w-[160px] truncate font-mono text-xs text-slate-600">
                          {ev.transaction.reference}
                        </p>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3 text-xs text-slate-500">
                      {ev.transaction ? sourceLabel(ev.transaction.source) : "—"}
                    </td>
                    <td className="py-3 text-sm font-semibold text-slate-900">
                      {ev.transaction ? formatNaira(ev.transaction.amount.toString()) : "—"}
                    </td>
                    <td className="py-3">
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock size={11} />
                        {formatRelative(ev.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {events.length > 0 && (
          <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3">
            <p className="text-xs font-medium text-emerald-700">
              ✓ All events are verified server-side using HMAC-SHA256. Payment status only updates after a valid Nomba signature — never from a client redirect.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
