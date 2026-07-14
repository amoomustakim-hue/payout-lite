import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, Clock } from "lucide-react";
import { PrintButton } from "./print-button";
import { Card } from "@/components/ui/card";
import { formatNaira } from "@/lib/format";
import { hasDatabaseUrl } from "@/lib/db";
import { getCurrentBusiness } from "@/lib/auth/get-current-business";
import { requireOnboardedBusiness } from "@/lib/auth/require-onboarding";
import { getTransactionForBusiness } from "@/lib/data/transactions";
import { sourceLabel } from "@/lib/presenters/source-label";

export const dynamic = "force-dynamic";

async function getReceipt(id: string) {
  if (!hasDatabaseUrl()) return null;
  try {
    const business = await getCurrentBusiness();
    if (!business) return null;
    return await getTransactionForBusiness(id, business.id);
  } catch {
    return null;
  }
}

export default async function TransactionReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireOnboardedBusiness();
  const { id } = await params;
  const tx = await getReceipt(id);

  if (!tx) notFound();

  const isPaid = tx.status === "PAID";
  const isFailed = tx.status === "FAILED";

  const statusIcon = isPaid ? (
    <CheckCircle2 size={32} className="text-emerald-600" />
  ) : isFailed ? (
    <XCircle size={32} className="text-red-500" />
  ) : (
    <Clock size={32} className="text-amber-500" />
  );

  const headerBg = isPaid
    ? "bg-emerald-600"
    : isFailed
    ? "bg-red-500"
    : "bg-amber-500";

  const rows: [string, string][] = [
    ["Business", tx.business?.name ?? "—"],
    ["Customer", tx.customerName ?? "—"],
    ["Email", tx.customerEmail ?? "—"],
    ["Source", sourceLabel(tx.source)],
    ["Reference", tx.reference],
    ...(tx.providerReference ? [["Provider Ref", tx.providerReference] as [string, string]] : []),
    ["Currency", tx.currency],
    ["Status", tx.status],
    [
      "Date",
      (tx.paidAt ?? tx.createdAt).toLocaleDateString("en-NG", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    ],
    ...(tx.invoice?.description ? [["Description", tx.invoice.description] as [string, string]] : []),
    ...(tx.invoice?.dueDate
      ? [["Invoice Due", tx.invoice.dueDate.toLocaleDateString("en-NG")] as [string, string]]
      : []),
  ];

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-5">
        <Link
          href="/transactions"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
        >
          <ArrowLeft size={14} />
          Back to transactions
        </Link>
      </div>

      <Card className="overflow-hidden p-0">
        {/* Header */}
        <div className={`${headerBg} px-6 py-6 text-white`}>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
              {statusIcon}
            </div>
            <div>
              <p className="text-sm font-medium opacity-85">
                {isPaid ? "Payment confirmed" : isFailed ? "Payment failed" : "Payment pending"}
              </p>
              <p className="text-3xl font-black">{formatNaira(tx.amount.toString())}</p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="divide-y divide-[var(--border)] px-6">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-start justify-between gap-4 py-3">
              <span className="shrink-0 text-sm text-[var(--muted)]">{label}</span>
              <span className="break-all text-right text-sm font-medium text-[var(--foreground)]">
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4">
          <p className="text-xs text-[var(--muted)]">Powered by Payout Lite × Nomba</p>
          <PrintButton />
        </div>
      </Card>
    </div>
  );
}
