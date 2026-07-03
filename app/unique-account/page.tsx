import { Landmark } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { getDb, hasDatabaseUrl } from "@/lib/db";
import { getDemoBusiness } from "@/lib/demo-business";
import { CreateVirtualAccountButton } from "@/components/unique-account/create-button";
import { CopyAccountButton } from "@/components/unique-account/copy-account-button";

export const dynamic = "force-dynamic";

async function getVirtualAccount() {
  if (!hasDatabaseUrl()) return null;
  try {
    const business = await getDemoBusiness();
    return getDb().virtualAccount.findFirst({
      where: { businessId: business.id, active: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return null;
  }
}

export default async function UniqueAccountPage() {
  const account = await getVirtualAccount();
  const copyText = account
    ? `Bank: ${account.bankName}\nAccount Number: ${account.accountNumber}\nAccount Name: ${account.accountName}`
    : "";

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

          {account ? (
            <>
              <div className="grid gap-4 rounded-xl border border-[var(--border)] bg-slate-50 p-5 sm:grid-cols-3">
                {[
                  { label: "Bank name", value: account.bankName },
                  { label: "Account number", value: account.accountNumber },
                  { label: "Account name", value: account.accountName },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs font-medium text-[var(--muted)]">{label}</p>
                    <p className="mt-1 font-bold text-[var(--foreground)]">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <CopyAccountButton text={copyText} />
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-[var(--border)] bg-slate-50 p-8 text-center">
              <Landmark size={28} className="mx-auto mb-3 text-slate-300" strokeWidth={1.5} />
              <p className="font-semibold text-[var(--foreground)]">No virtual account yet</p>
              <p className="mt-1.5 text-sm text-[var(--muted)]">
                Create a Nomba virtual account to receive bank transfers directly.
              </p>
              <div className="mt-5 flex justify-center">
                <CreateVirtualAccountButton />
              </div>
            </div>
          )}
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

      {!hasDatabaseUrl() && (
        <div className="mt-3 rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-700">
          Connect DATABASE_URL and Nomba credentials to create a real virtual account.
        </div>
      )}
    </div>
  );
}
