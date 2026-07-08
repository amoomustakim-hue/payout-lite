import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getDb, hasDatabaseUrl } from "@/lib/db";
import { makeUniqueSlug } from "@/lib/slugify";

export type CurrentBusiness = {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  phone: string | null;
  logoUrl: string | null;
  onboardingComplete: boolean;
  nombaSubAccountId: string | null;
};

export async function getCurrentBusiness(): Promise<CurrentBusiness | null> {
  if (!hasDatabaseUrl()) return null;

  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return null;

  const db = getDb();

  let user = await db.user.findUnique({ where: { clerkUserId } });

  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    const email =
      clerkUser.emailAddresses[0]?.emailAddress ??
      `${clerkUserId}@clerk.local`;
    const name =
      [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
      email.split("@")[0];

    user = await db.user.upsert({
      where: { email },
      update: { clerkUserId },
      create: { clerkUserId, email, name },
    });
  } else if (!user.clerkUserId) {
    user = await db.user.update({
      where: { id: user.id },
      data: { clerkUserId },
    });
  }

  let business = await db.business.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });

  if (!business) return null;

  // Backfill the Nomba sub-account id from the environment if the record was
  // created before it was configured. Checkout orders must be tagged with the
  // sub-account for the hackathon proxy to forward payment webhooks back to us.
  const envSubAccount = process.env.NOMBA_SUB_ACCOUNT_ID?.trim();
  if (envSubAccount && business.nombaSubAccountId !== envSubAccount) {
    business = await db.business.update({
      where: { id: business.id },
      data: { nombaSubAccountId: envSubAccount },
    });
  }

  return {
    id: business.id,
    name: business.name,
    slug: business.slug,
    email: business.email,
    phone: business.phone,
    logoUrl: business.logoUrl,
    onboardingComplete: business.onboardingComplete,
    nombaSubAccountId: business.nombaSubAccountId,
  };
}

export async function getOrCreateBusiness(): Promise<CurrentBusiness> {
  if (!hasDatabaseUrl()) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) throw new Error("Not authenticated");

  const db = getDb();
  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("Not authenticated");

  const email =
    clerkUser.emailAddresses[0]?.emailAddress ??
    `${clerkUserId}@clerk.local`;
  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
    email.split("@")[0];

  let user = await db.user.findUnique({ where: { clerkUserId } });

  if (!user) {
    user = await db.user.upsert({
      where: { email },
      update: { clerkUserId },
      create: { clerkUserId, email, name },
    });
  }

  let business = await db.business.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });

  if (!business) {
    const slug = await makeUniqueSlug(name || "my-business", db);
    business = await db.business.create({
      data: {
        userId: user.id,
        name: name || "My Business",
        slug,
        email,
        nombaSubAccountId: process.env.NOMBA_SUB_ACCOUNT_ID || null,
        onboardingComplete: false,
      },
    });
  }

  return {
    id: business.id,
    name: business.name,
    slug: business.slug,
    email: business.email,
    phone: business.phone,
    logoUrl: business.logoUrl,
    onboardingComplete: business.onboardingComplete,
    nombaSubAccountId: business.nombaSubAccountId,
  };
}
