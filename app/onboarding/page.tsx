import { Building2, Link2, Sparkles, CheckCircle2 } from "lucide-react";
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
  const isFirstRun = !business || !business.onboardingComplete;

  return (
    <div>
      {isFirstRun ? (
        <div className="mb-6 rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--payout-blue)] to-indigo-700 p-6 text-white">
          <div className="mb-2 flex items-center gap-1.5">
            <Sparkles size={15} className="text-blue-200" />
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-200">Welcome to Payout Lite</span>
          </div>
          <h1 className="text-2xl font-black">Set up your business</h1>
          <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-blue-100/90">
            Tell us about your business so we can generate your payment links, invoices, and QR code.
            It only takes a minute.
          </p>
        </div>
      ) : (
        <PageHeader title="Settings" description="Manage your business profile and payment configuration." />
      )}

      <div className="grid gap-5 lg:grid-cols-[520px_1fr]">
        <Card className="min-w-0">
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-[var(--payout-blue)]">
              <Building2 size={14} />
            </div>
            <p className="font-semibold text-[var(--foreground)]">Business details</p>
          </div>

          <BusinessForm
            defaultName={business?.name ?? ""}
            defaultEmail={business?.email ?? ""}
            defaultPhone={business?.phone ?? ""}
            defaultCategory={business?.category ?? ""}
            defaultWebsite={business?.website ?? ""}
            defaultAddress={business?.address ?? ""}
            defaultDescription={business?.description ?? ""}
            redirectOnSuccess={isFirstRun ? "/dashboard" : undefined}
            submitLabel={isFirstRun ? "Complete setup" : "Save changes"}
          />
        </Card>

        <div className="flex min-w-0 flex-col gap-4">
          {isFirstRun ? (
            <div className="rounded-xl border border-[var(--border)] bg-slate-50 p-5 text-sm">
              <p className="font-semibold text-[var(--foreground)]">What you unlock</p>
              <ul className="mt-3 grid gap-2.5">
                {[
                  "A public payment link for invoices",
                  "Your own Shop QR code for walk-in customers",
                  "An embeddable website pay button",
                  "Webhook-confirmed transactions on your dashboard",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[var(--muted)]">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            business && (
              <div className="rounded-xl border border-[var(--border)] bg-slate-50 p-5 text-sm">
                <p className="font-semibold text-[var(--foreground)]">Your payment links</p>
                <p className="mt-1 mb-3 text-xs text-[var(--muted)]">Share these links with your customers.</p>
                <div className="grid gap-2">
                  {[
                    { label: "Shop QR", url: `${appUrl}/pay/shop/${business.slug}` },
                    { label: "Website button", url: `${appUrl}/pay/button/${business.slug}` },
                  ].map(({ label, url }) => (
                    <div key={label} className="flex flex-col gap-0.5">
                      <span className="text-xs font-medium text-slate-500">{label}</span>
                      <div className="flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-white px-3 py-2">
                        <Link2 size={11} className="shrink-0 text-slate-400" />
                        <span className="min-w-0 truncate text-xs font-mono text-slate-600">{url}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          <div className="rounded-xl border border-[var(--border)] bg-slate-50 p-5 text-sm">
            <p className="font-semibold text-[var(--foreground)]">About your profile</p>
            <p className="mt-2 leading-relaxed text-[var(--muted)]">
              Your business name determines your public payment links. Changing the name creates a new slug,
              so update any shared links afterward.
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
