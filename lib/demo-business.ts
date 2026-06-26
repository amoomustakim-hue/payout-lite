import "server-only";
import { getDb } from "@/lib/db";

export async function getDemoBusiness() {
  const db = getDb();

  const user = await db.user.upsert({
    where: { email: "demo@payoutlite.local" },
    update: {},
    create: {
      email: "demo@payoutlite.local",
      name: "Payout Lite Demo",
    },
  });

  return db.business.upsert({
    where: { slug: "ada-stores" },
    update: {
      nombaSubAccountId: process.env.NOMBA_SUB_ACCOUNT_ID,
    },
    create: {
      userId: user.id,
      name: "Ada Stores",
      slug: "ada-stores",
      email: "owner@adastores.test",
      phone: "+2348000000000",
      nombaSubAccountId: process.env.NOMBA_SUB_ACCOUNT_ID,
    },
  });
}
