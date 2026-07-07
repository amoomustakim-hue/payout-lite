import "server-only";
import { getDb } from "@/lib/db";

/**
 * Recent webhook events whose linked transaction belongs to this business.
 * Scoped via the transaction relation so a merchant only sees their own events.
 * Events with no matching transaction are provider-level and are not shown here.
 */
export async function listWebhookEvents(businessId: string, take = 100) {
  return getDb().webhookEvent.findMany({
    where: { transaction: { businessId } },
    orderBy: { createdAt: "desc" },
    take,
    include: {
      transaction: {
        select: { reference: true, amount: true, source: true, customerName: true },
      },
    },
  });
}
