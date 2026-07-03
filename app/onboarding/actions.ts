"use server";

import { revalidatePath } from "next/cache";
import { getDb, hasDatabaseUrl } from "@/lib/db";
import { slugify } from "@/lib/slugify";

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

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();

  if (!name) return { error: "Business name is required." };
  if (!email) return { error: "Business email is required." };

  const slug = slugify(name);

  try {
    const db = getDb();
    const demoEmail = "demo@payoutlite.local";
    const user = await db.user.upsert({
      where: { email: demoEmail },
      update: {},
      create: { email: demoEmail, name: "Payout Lite Demo" },
    });

    await db.business.upsert({
      where: { slug },
      update: { name, email, phone: phone || null },
      create: {
        userId: user.id,
        name,
        slug,
        email,
        phone: phone || null,
        nombaSubAccountId: process.env.NOMBA_SUB_ACCOUNT_ID,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    console.error("saveBusinessAction error:", err);
    return { error: "Failed to save business profile. Please try again." };
  }
}
