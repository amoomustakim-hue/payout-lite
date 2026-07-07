import "server-only";
import { getDb } from "@/lib/db";

/**
 * The active virtual account for a single business, most recent first.
 * Scoped to `businessId`.
 */
export async function getActiveVirtualAccount(businessId: string) {
  return getDb().virtualAccount.findFirst({
    where: { businessId, active: true },
    orderBy: { createdAt: "desc" },
  });
}
