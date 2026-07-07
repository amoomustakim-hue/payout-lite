import "server-only";
import { getDb } from "@/lib/db";

/**
 * Recent webhook events for this business: events linked to one of the
 * business's transactions, PLUS unmatched events (no transaction) which are
 * shown to everyone so a stuck/unrecognised payment is diagnosable. Unmatched
 * events carry no business-specific data, only the raw provider payload.
 */
export async function listWebhookEvents(businessId: string, take = 100) {
  return getDb().webhookEvent.findMany({
    where: {
      OR: [{ transaction: { businessId } }, { transactionId: null }],
    },
    orderBy: { createdAt: "desc" },
    take,
    include: {
      transaction: {
        select: { reference: true, amount: true, source: true, customerName: true },
      },
    },
  });
}
