"use server";

import { revalidatePath } from "next/cache";
import { getDb, hasDatabaseUrl } from "@/lib/db";
import { getOrCreateBusiness } from "@/lib/auth/get-current-business";
import { createNombaVirtualAccount, getMissingNombaCheckoutEnvVars } from "@/lib/nomba";

export async function createVirtualAccountAction(): Promise<{ error?: string; detail?: string }> {
  if (!hasDatabaseUrl()) {
    return { error: "DATABASE_URL is not configured." };
  }

  const missing = getMissingNombaCheckoutEnvVars();
  if (missing.length > 0) {
    return { error: `Missing Nomba credentials: ${missing.join(", ")}` };
  }

  let business;
  try {
    business = await getOrCreateBusiness();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { error: "Authentication error — please sign out and sign back in.", detail: msg };
  }

  try {
    const db = getDb();

    const existing = await db.virtualAccount.findFirst({
      where: { businessId: business.id, active: true },
    });
    if (existing) {
      revalidatePath("/unique-account");
      return {};
    }

    const reference = `va-${business.slug}-${Date.now()}`;

    console.info("Creating Nomba virtual account", {
      businessId: business.id,
      businessName: business.name,
      reference,
      hasSubAccountId: Boolean(business.nombaSubAccountId),
    });

    const result = await createNombaVirtualAccount({
      businessName: business.name,
      reference,
      customerEmail: business.email,
      subAccountId: business.nombaSubAccountId,
    });

    console.info("Nomba virtual account result", { raw: result.raw });

    await db.virtualAccount.create({
      data: {
        businessId: business.id,
        accountNumber: result.accountNumber ?? "",
        bankName: result.bankName ?? "Nomba",
        accountName: result.accountName ?? business.name,
        providerRef: result.providerRef ?? reference,
        active: true,
      },
    });

    revalidatePath("/unique-account");
    return {};
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("createVirtualAccountAction error:", msg);
    return {
      error: "Failed to create virtual account.",
      detail: msg,
    };
  }
}
