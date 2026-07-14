import { QrCode, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { getAppUrl } from "@/lib/app-url";
import { QrDisplay } from "@/components/shop-qr/qr-display";
import { requireOnboardedBusiness } from "@/lib/auth/require-onboarding";

export default async function ShopQrPage() {
  const appUrl = getAppUrl();
  const business = await requireOnboardedBusiness();
  const shopUrl = business ? `${appUrl}/pay/shop/${business.slug}` : "";
  const businessName = business?.name ?? "My Shop";

  return (
    <div>
      <PageHeader
        title="Shop QR Code"
        description="Print a QR code for your shop. Customers scan to pay any amount via Nomba Checkout."
      />

      {!business && (
        <div className="mb-5 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Complete your business setup in <a href="/onboarding" className="font-semibold underline">Settings</a> to generate your QR code.
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        {/* QR display */}
        <Card className="flex flex-col items-center gap-4 py-8">
          {business ? (
            <QrDisplay url={shopUrl} businessName={businessName} />
          ) : (
            <div className="flex h-48 w-48 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 text-sm text-slate-400">
              No business yet
            </div>
          )}
        </Card>

        {/* Details */}
        <div className="flex min-w-0 flex-col gap-4">
          <Card>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-[var(--payout-blue)]">
                <QrCode size={14} />
              </div>
              <p className="font-semibold text-[var(--foreground)]">Shop payment link</p>
            </div>
            {business ? (
              <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-slate-50 px-3 py-3">
                <p className="min-w-0 flex-1 truncate text-sm font-medium text-[var(--payout-blue)]">{shopUrl}</p>
                <a href={shopUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 text-slate-400 hover:text-slate-600">
                  <ExternalLink size={14} />
                </a>
              </div>
            ) : (
              <p className="text-sm text-[var(--muted)]">Set up your business to get a payment link.</p>
            )}
          </Card>

          <div className="rounded-xl border border-[var(--border)] bg-slate-50 p-5">
            <p className="text-sm font-semibold text-[var(--foreground)]">How it works</p>
            <ol className="mt-3 grid gap-2 text-sm text-[var(--muted)]">
              {[
                "Print or display the QR code at your shop counter.",
                "Customer scans with their phone camera.",
                "They enter the amount and complete Nomba Checkout.",
                "Payment confirmed via webhook — no manual reconciliation.",
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
      </div>
    </div>
  );
}
