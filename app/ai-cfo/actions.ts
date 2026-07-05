"use server";

import { getGroqClient } from "@/lib/groq";
import { getDb, hasDatabaseUrl } from "@/lib/db";
import { getCurrentBusiness } from "@/lib/auth/get-current-business";
import { formatNaira } from "@/lib/format";

export async function askAiCfoAction(
  question: string,
): Promise<{ answer: string; error?: string }> {
  if (!process.env.GROQ_API_KEY) {
    return { answer: "", error: "GROQ_API_KEY is not configured." };
  }
  if (!hasDatabaseUrl()) {
    return { answer: "", error: "DATABASE_URL is not configured — connect a database to unlock live answers." };
  }
  if (!question.trim()) {
    return { answer: "", error: "Please enter a question." };
  }

  try {
    const db = getDb();
    const business = await getCurrentBusiness();
    if (!business) {
      return { answer: "", error: "No business profile found. Complete onboarding first." };
    }

    const [transactions, invoices] = await Promise.all([
      db.transaction.findMany({
        where: { businessId: business.id },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
      db.invoice.findMany({
        where: { businessId: business.id },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    ]);

    const paid = transactions.filter((t) => t.status === "PAID");
    const pending = transactions.filter((t) => t.status === "PENDING");
    const failed = transactions.filter((t) => t.status === "FAILED");
    const totalReceived = paid.reduce((s, t) => s + Number(t.amount), 0);

    const byChannel = ["INVOICE", "SHOP_QR", "WEBSITE_BUTTON", "UNIQUE_ACCOUNT"].map((src) => {
      const paidSrc = paid.filter((t) => t.source === src);
      return `${src}: ${paidSrc.length} paid · ${formatNaira(paidSrc.reduce((s, t) => s + Number(t.amount), 0))}`;
    });

    const recentLines = transactions.slice(0, 15).map(
      (t) =>
        `• ${t.customerName ?? "Customer"} — ${formatNaira(t.amount.toString())} via ${t.source} [${t.status}] on ${t.createdAt.toLocaleDateString("en-NG")}`,
    );

    const context = `
Business: ${business.name}
Currency: NGN (₦)

TRANSACTION SUMMARY (last ${transactions.length}):
Total received (webhook-confirmed): ${formatNaira(totalReceived)}
Paid: ${paid.length} · Pending: ${pending.length} · Failed: ${failed.length}

BY CHANNEL:
${byChannel.join("\n")}

RECENT TRANSACTIONS:
${recentLines.join("\n")}

INVOICE SUMMARY:
Total invoices: ${invoices.length}
Paid: ${invoices.filter((i) => i.status === "PAID").length}
Unpaid: ${invoices.filter((i) => i.status === "UNPAID").length}
Pending: ${invoices.filter((i) => i.status === "PENDING").length}
Overdue: ${invoices.filter((i) => i.status === "OVERDUE").length}
`.trim();

    const groq = getGroqClient();
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are the AI CFO for a Nigerian small business using Payout Lite, a payment hub powered by Nomba webhooks. You have access to the business's real transaction and invoice data below. Answer the owner's questions concisely and helpfully. Always use ₦ for naira. Be specific with numbers. Keep responses under 150 words unless asked for a detailed breakdown.\n\n${context}`,
        },
        { role: "user", content: question },
      ],
      max_tokens: 400,
      temperature: 0.3,
    });

    const answer =
      completion.choices[0]?.message?.content?.trim() ?? "I couldn't generate a response. Please try again.";

    try {
      await db.aiInsight.create({ data: { businessId: business.id, question, answer } });
    } catch {
      // non-fatal
    }

    return { answer };
  } catch (err) {
    console.error("AI CFO error:", err);
    return { answer: "", error: "Failed to generate response. Check that GROQ_API_KEY is set correctly." };
  }
}
