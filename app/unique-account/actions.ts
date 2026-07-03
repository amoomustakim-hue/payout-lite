"use server";

import { revalidatePath } from "next/cache";
import { getDb, hasDatabaseUrl } from "@/lib/db";
import { getDemoBusiness } from "@/lib/demo-business";
import { createNombaVirtualAccount, getMissingNombaCheckoutEnvVars } from "@/lib/nomba";

export async function createVirtualAccountAction(): Promise<{ error?: string }> {
  if (!hasDatabaseUrl()) {
    return { error: "DATABASE_URL is not configured." };
  }
  if (getMissingNombaCheckoutEnvVars().length > 0) {
    return { error: "Nomba credentials (NOMBA_ACCOUNT_ID, NOMBA_CLIENT_ID, NOMBA_PRIVATE_KEY) are not configured." };
  }

  try {
    const db = getDb();
    const business = await getDemoBusiness();

    // Check if already exists
    const existing = await db.virtualAccount.findFirst({
      where: { businessId: business.id, active: true },
    });
    if (existing) {
      revalidatePath("/unique-account");
      return {};
    }

    const reference = `va-${business.slug}-${Date.now()}`;
    const result = await createNombaVirtualAccount({
      businessName: business.name,
      reference,
      customerEmail: business.email,
      subAccountId: business.nombaSubAccountId,
    });

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
    console.error("createVirtualAccountAction error:", err);
    return { error: "Failed to create virtual account. Check Nomba credentials and try again." };
  }
}
