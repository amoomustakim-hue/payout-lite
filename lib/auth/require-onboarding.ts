import "server-only";
import { redirect } from "next/navigation";
import { hasDatabaseUrl } from "@/lib/db";
import { getCurrentBusiness, type CurrentBusiness } from "./get-current-business";

/**
 * Gate a protected page behind a completed business profile.
 * - DB unreachable: returns null so the page can render its own
 *   "database not connected" state instead of redirect-looping.
 * - No business / onboarding incomplete: redirects to the onboarding wizard.
 * - Otherwise: returns the current business so the caller can reuse it.
 */
export async function requireOnboardedBusiness(): Promise<CurrentBusiness | null> {
  if (!hasDatabaseUrl()) return null;

  const business = await getCurrentBusiness();
  if (!business || !business.onboardingComplete) {
    redirect("/onboarding");
  }
  return business;
}
