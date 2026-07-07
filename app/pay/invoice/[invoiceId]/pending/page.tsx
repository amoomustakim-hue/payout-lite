import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PayoutLiteLogo } from "@/components/brand/payout-lite-logo";
import { PendingPoller } from "@/components/pay/pending-poller";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

async function getStatus(invoiceId: string) {
  try {
    return await getDb().invoice.findUnique({
      where: { id: invoiceId },
      select: { status: true },
    });
  } catch {
    return null;
  }
}

export default async function InvoicePendingPage({ params }: { params: Promise<{ invoiceId: string }> }) {
  const { invoiceId } = await params;
  const invoice = await getStatus(invoiceId);
  const confirmed = invoice?.status === "PAID";

  // Once the webhook flips the invoice to PAID, send the payer to the receipt.
  if (confirmed) {
    redirect(`/pay/invoice/${invoiceId}/success`);
  }

  return (
    <main className="grid min-h-screen place-items-center px-5 py-10">
      {/* Auto-refreshes this page; redirect above fires as soon as PAID lands. */}
      <PendingPoller />
      <div className="w-full max-w-lg">
        <div className="mb-6 flex justify-center">
          <PayoutLiteLogo />
        </div>
        <Card className="text-center">
          <Badge value="PENDING" />
          <h1 className="mt-5 text-2xl font-black text-slate-950">Confirming your payment…</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-600">
            We&apos;re waiting for Nomba to confirm your payment. This page will update automatically —
            you&apos;ll be taken to your receipt as soon as it&apos;s confirmed.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--payout-blue)]" />
            Checking every few seconds
          </div>
          <div className="mt-6 flex justify-center gap-3">
            <ButtonLink href={`/pay/invoice/${invoiceId}`} variant="secondary">View invoice</ButtonLink>
          </div>
        </Card>
      </div>
    </main>
  );
}
