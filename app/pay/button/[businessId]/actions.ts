"use server";

import crypto from "node:crypto";
import { Prisma, TransactionSource, TransactionStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { getAppUrl } from "@/lib/app-url";
import { getDb } from "@/lib/db";
import { createNombaCheckoutOrder, getMissingNombaCheckoutEnvVars } from "@/lib/nomba";

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export async function startButtonPaymentAction(formData: FormData) {
  const businessSlug = formData.get("businessSlug");
  const amountRaw = formData.get("amount");
  const email = formData.get("email");
  const name = formData.get("customerName");
  const paymentButtonId = formData.get("paymentButtonId");

  if (typeof businessSlug !== "string" || !businessSlug) throw new Error("Invalid business");
  if (typeof amountRaw !== "string" || !amountRaw) throw new Error("Amount is required");
  if (typeof email !== "string" || !email) throw new Error("Email is required");

  const amount = parseFloat(amountRaw);
  if (isNaN(amount) || amount <= 0) throw new Error("Invalid amount");

  const db = getDb();
  const business = await db.business.findUnique({ where: { slug: businessSlug } });
  if (!business) throw new Error("Business not found");

  const reference = `pl_btn_${business.id.slice(0, 8)}_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;

  const transaction = await db.transaction.create({
    data: {
      businessId: business.id,
      paymentButtonId: typeof paymentButtonId === "string" && paymentButtonId ? paymentButtonId : null,
      source: TransactionSource.WEBSITE_BUTTON,
      status: TransactionStatus.PENDING,
      amount,
      currency: "NGN",
      customerEmail: email as string,
      customerName: (name as string) || null,
      reference,
      metadata: { businessName: business.name },
    },
  });

  const missing = getMissingNombaCheckoutEnvVars();
  if (missing.length > 0) {
    await db.transaction.update({
      where: { id: transaction.id },
      data: {
        metadata: { checkoutError: "Missing Nomba env vars", missingEnvVars: missing } as Prisma.InputJsonValue,
      },
    });
    redirect(`/pay/button/${businessSlug}/error?reference=${reference}&reason=nomba-config`);
  }

  let checkoutUrl: string | undefined;
  try {
    const order = await createNombaCheckoutOrder({
      amount,
      currency: "NGN",
      reference,
      customerEmail: email as string,
      customerName: (name as string) || undefined,
      callbackUrl: `${getAppUrl()}/pay/button/${businessSlug}/pending?reference=${reference}`,
      description: `Payment to ${business.name}`,
      subAccountId: business.nombaSubAccountId,
      metadata: { transactionId: transaction.id, source: TransactionSource.WEBSITE_BUTTON },
    });

    checkoutUrl = order.checkoutUrl;
    await db.transaction.update({
      where: { id: transaction.id },
      data: {
        providerReference: order.orderReference,
        checkoutUrl: order.checkoutUrl,
        metadata: { nombaCheckoutResponse: order.raw } as Prisma.InputJsonValue,
      },
    });
  } catch (error) {
    await db.transaction.update({
      where: { id: transaction.id },
      data: {
        metadata: {
          checkoutError: error instanceof Error ? error.message : "Unable to create checkout order",
        },
      },
    });
    redirect(`/pay/button/${businessSlug}/error?reference=${reference}&reason=unavailable`);
  }

  if (!checkoutUrl || !isHttpUrl(checkoutUrl)) {
    redirect(`/pay/button/${businessSlug}/error?reference=${reference}&reason=missing-url`);
  }

  redirect(checkoutUrl);
}
