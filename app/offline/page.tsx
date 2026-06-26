import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PayoutLiteLogo } from "@/components/brand/payout-lite-logo";

export default function OfflinePage() {
  return (
    <main className="grid min-h-screen place-items-center px-5 py-10">
      <div className="w-full max-w-lg">
        <div className="mb-6 flex justify-center">
          <PayoutLiteLogo />
        </div>
        <Card className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--payout-blue)]">Offline</p>
          <h1 className="mt-3 text-2xl font-black text-slate-950">You are offline</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-600">
            Payout Lite can show cached app pages offline, but payment, webhook, and API routes always require a live connection.
          </p>
          <div className="mt-6">
            <ButtonLink href="/dashboard">Back to dashboard</ButtonLink>
          </div>
        </Card>
      </div>
    </main>
  );
}
