import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PayoutLiteLogo } from "@/components/brand/payout-lite-logo";
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

  return (
    <main className="grid min-h-screen place-items-center px-5 py-10">
      <div className="w-full max-w-lg">
        <div className="mb-6 flex justify-center">
          <PayoutLiteLogo />
        </div>
        <Card className="text-center">
          <Badge value={confirmed ? "PAID" : "PENDING"} />
          <h1 className="mt-5 text-2xl font-black text-slate-950">{confirmed ? "Payment confirmed" : "Payment being confirmed"}</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-600">
            {confirmed
              ? "Payment confirmed. This invoice has been marked as paid."
              : "Your payment is being confirmed. This invoice will update once payment confirmation is received."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <ButtonLink href={`/pay/invoice/${invoiceId}`} variant="secondary">View invoice</ButtonLink>
          </div>
        </Card>
      </div>
    </main>
  );
}
