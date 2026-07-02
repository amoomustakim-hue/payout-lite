import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PayoutLiteLogo } from "@/components/brand/payout-lite-logo";

const reasonCopy: Record<string, string> = {
  unavailable: "Payout Lite could not create a Nomba Checkout order. Please try again or contact the merchant.",
  "nomba-config": "Nomba Checkout is not configured yet. Add NOMBA_ACCOUNT_ID, NOMBA_CLIENT_ID, and NOMBA_PRIVATE_KEY in Vercel production environment variables, then redeploy.",
  "nomba-auth": "Nomba rejected the checkout credentials. Confirm you are using TEST credentials from the same Nomba account and that the parent account ID matches the client credentials.",
  "missing-url": "Nomba created a checkout response, but no hosted checkout URL was returned. The payment has not been sent to checkout.",
  "invalid-url": "Nomba returned a checkout value that was not a valid hosted URL. The payment has not been sent to checkout.",
};

export default async function InvoiceCheckoutErrorPage({
  params,
  searchParams,
}: {
  params: Promise<{ invoiceId: string }>;
  searchParams: Promise<{ reason?: string; reference?: string }>;
}) {
  const { invoiceId } = await params;
  const { reason = "unavailable", reference } = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center px-5 py-10">
      <div className="w-full max-w-lg">
        <div className="mb-6 flex justify-center">
          <PayoutLiteLogo />
        </div>
        <Card className="text-center">
          <Badge value="FAILED" />
          <h1 className="mt-5 text-2xl font-black text-slate-950">Checkout could not start</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-600">
            {reasonCopy[reason] ?? reasonCopy.unavailable}
          </p>
          {reference ? <p className="mt-4 break-all rounded-xl bg-slate-50 p-3 text-xs font-semibold text-slate-500">Reference: {reference}</p> : null}
          <div className="mt-6 flex justify-center gap-3">
            <ButtonLink href={`/pay/invoice/${invoiceId}`} variant="secondary">Back to invoice</ButtonLink>
          </div>
          <p className="mt-4 text-xs text-slate-500">This invoice has not been marked as paid. Webhook confirmation remains the only source of final PAID status.</p>
        </Card>
      </div>
    </main>
  );
}


