"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getDb, hasDatabaseUrl } from "@/lib/db";
import { makeUniqueSlug, slugify } from "@/lib/slugify";

export type OnboardingFormState = {
  success?: boolean;
  error?: string;
};

export async function saveBusinessAction(
  _prev: OnboardingFormState,
  formData: FormData,
): Promise<OnboardingFormState> {
  if (!hasDatabaseUrl()) {
    return { error: "DATABASE_URL is not configured. Connect a database to save your business profile." };
  }

  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) {
    redirect("/sign-in");
  }

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();

  if (!name) return { error: "Business name is required." };
  if (!email) return { error: "Business email is required." };

  try {
    const db = getDb();
    const clerkUserData = await currentUser();

    const userEmail =
      clerkUserData?.emailAddresses[0]?.emailAddress ??
      email;
    const userName =
      [clerkUserData?.firstName, clerkUserData?.lastName].filter(Boolean).join(" ") ||
      email.split("@")[0];

    let user = await db.user.findUnique({ where: { clerkUserId } });

    if (!user) {
      user = await db.user.upsert({
        where: { email: userEmail },
        update: { clerkUserId },
        create: { clerkUserId, email: userEmail, name: userName },
      });
    }

    const existingBusiness = await db.business.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
    });

    if (existingBusiness) {
      const newSlug = slugify(name);
      const slugChanged = existingBusiness.name !== name;
      const finalSlug =
        slugChanged && newSlug !== existingBusiness.slug
          ? await makeUniqueSlug(name, db).then(async (s) => {
              const conflict = await db.business.findUnique({ where: { slug: s } });
              return !conflict || conflict.id === existingBusiness.id ? (newSlug === existingBusiness.slug ? existingBusiness.slug : s) : s;
            })
          : existingBusiness.slug;

      await db.business.update({
        where: { id: existingBusiness.id },
        data: {
          name,
          email,
          phone: phone || null,
          slug: finalSlug,
          onboardingComplete: true,
        },
      });
    } else {
      const slug = await makeUniqueSlug(name, db);
      await db.business.create({
        data: {
          userId: user.id,
          name,
          slug,
          email,
          phone: phone || null,
          onboardingComplete: true,
          nombaSubAccountId: process.env.NOMBA_SUB_ACCOUNT_ID || null,
        },
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/onboarding");
    return { success: true };
  } catch (err) {
    console.error("saveBusinessAction error:", err);
    return { error: "Failed to save business profile. Please try again." };
  }
}
