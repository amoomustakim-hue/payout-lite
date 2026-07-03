import { Building2, Link2 } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { getCurrentBusiness } from "@/lib/auth/get-current-business";
import { BusinessForm } from "@/components/onboarding/business-form";
import { getAppUrl } from "@/lib/app-url";
import { hasDatabaseUrl } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const business = await getCurrentBusiness();
  const appUrl = getAppUrl();

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your business profile and payment configuration."
      />

      <div className="grid gap-5 lg:grid-cols-[480px_1fr]">
        <Card>
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-[var(--payout-blue)]">
              <Building2 size={14} />
            </div>
            <p className="font-semibold text-[var(--foreground)]">Business Profile</p>
          </div>

          <BusinessForm
            defaultName={business?.name ?? ""}
            defaultEmail={business?.email ?? ""}
            defaultPhone={business?.phone ?? ""}
          />
        </Card>

        <div className="flex flex-col gap-4">
          {business && (
            <div className="rounded-xl border border-[var(--border)] bg-slate-50 p-5 text-sm">
              <p className="font-semibold text-[var(--foreground)]">Your payment links</p>
              <p className="mt-1 mb-3 text-xs text-[var(--muted)]">Share these links with your customers.</p>
              <div className="grid gap-2">
                {[
                  { label: "Invoice pay link", url: `${appUrl}/pay/invoice/[id]` },
                  { label: "Shop QR", url: `${appUrl}/pay/shop/${business.slug}` },
                  { label: "Website button", url: `${appUrl}/pay/button/${business.slug}` },
                ].map(({ label, url }) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-slate-500">{label}</span>
                    <div className="flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-white px-3 py-2">
                      <Link2 size={11} className="shrink-0 text-slate-400" />
                      <span className="truncate text-xs font-mono text-slate-600">{url}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-[var(--border)] bg-slate-50 p-5 text-sm">
            <p className="font-semibold text-[var(--foreground)]">About your profile</p>
            <p className="mt-2 text-[var(--muted)] leading-relaxed">
              Your business name and slug determine your public payment links. Changing the name creates a new slug, so update all shared links afterward.
            </p>
          </div>

          {!hasDatabaseUrl() && (
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-5 text-sm text-amber-700">
              <p className="font-semibold text-amber-800">Database not connected</p>
              <p className="mt-1">Add DATABASE_URL to save business changes persistently.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
