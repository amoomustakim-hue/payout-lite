import type { PrismaClient } from "@prisma/client";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "business";
}

export async function makeUniqueSlug(base: string, db: PrismaClient): Promise<string> {
  const slug = slugify(base);
  const existing = await db.business.findUnique({ where: { slug } });
  if (!existing) return slug;

  for (let i = 2; i <= 99; i++) {
    const candidate = `${slug}-${i}`;
    const dup = await db.business.findUnique({ where: { slug: candidate } });
    if (!dup) return candidate;
  }
  return `${slug}-${Date.now()}`;
}
