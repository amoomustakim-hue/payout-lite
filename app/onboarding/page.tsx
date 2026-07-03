import { Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { getDb, hasDatabaseUrl } from "@/lib/db";
import { BusinessForm } from "@/components/onboarding/business-form";

export const dynamic = "force-dynamic";

async function getCurrentBusiness() {
  if (!hasDatabaseUrl()) return null;
  try {
    return getDb().business.findFirst({
      where: { slug: "ada-stores" },
    });
  } catch {
    return null;
  }
}

export default async function OnboardingPage() {
  const business = await getCurrentBusiness();

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
