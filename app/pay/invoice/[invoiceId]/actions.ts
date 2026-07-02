"use server";

import crypto from "node:crypto";
import { InvoiceStatus, Prisma, TransactionSource, TransactionStatus } from "@prisma/client";
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

export async function startInvoicePaymentAction(formData: FormData) {
  const invoiceId = formData.get("invoiceId");
  if (typeof invoiceId !== "string" || !invoiceId) {
    throw new Error("invoiceId is required");
  }

  const db = getDb();
  const invoice = await db.invoice.findUnique({
    where: { id: invoiceId },
    include: { business: true },
  });

  if (!invoice) {
    redirect("/invoices");
  }

  if (invoice.status === InvoiceStatus.PAID) {
    redirect(`/pay/invoice/${invoice.id}/success`);
  }

  const reference = `pl_inv_${invoice.id}_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
  const transaction = await db.transaction.create({
    data: {
      businessId: invoice.businessId,
      invoiceId: invoice.id,
      source: TransactionSource.INVOICE,
      status: TransactionStatus.PENDING,
      amount: invoice.amount,
      currency: invoice.currency,
      customerName: invoice.customerName,
      customerEmail: invoice.customerEmail,
      reference,
      metadata: {
        invoiceId: invoice.id,
        businessName: invoice.business.name,
      },
    },
  });

  const missingNombaEnvVars = getMissingNombaCheckoutEnvVars();
  if (missingNombaEnvVars.length > 0) {
    await db.transaction.update({
      where: { id: transaction.id },
      data: {
        metadata: {
          checkoutError: "Missing Nomba checkout environment variables",
          missingEnvVars: missingNombaEnvVars,
        } as Prisma.InputJsonValue,
      },
    });

    redirect(`/pay/invoice/${invoice.id}/checkout-error?reference=${reference}&reason=nomba-config`);
  }

  let checkoutUrl: string | undefined;
  let checkoutUrlField: string | undefined;

  try {
    const order = await createNombaCheckoutOrder({
      amount: Number(invoice.amount),
      currency: invoice.currency,
      reference,
      customerEmail: invoice.customerEmail,
      customerName: invoice.customerName,
      callbackUrl: `${getAppUrl()}/pay/invoice/${invoice.id}/pending?reference=${reference}`,
      description: invoice.description,
      subAccountId: invoice.business.nombaSubAccountId,
      metadata: {
        invoiceId: invoice.id,
        transactionId: transaction.id,
        source: TransactionSource.INVOICE,
      },
    });

    checkoutUrl = order.checkoutUrl;
    checkoutUrlField = order.checkoutUrlField;

    console.info("Payout Lite invoice checkout result", {
      invoiceId: invoice.id,
      transactionId: transaction.id,
      reference,
      checkoutUrlField: checkoutUrlField ?? null,
      hasCheckoutUrl: Boolean(checkoutUrl),
    });

    await db.transaction.update({
      where: { id: transaction.id },
      data: {
        providerReference: order.orderReference,
        checkoutUrl: order.checkoutUrl,
        metadata: {
          nombaCheckoutResponse: order.raw,
          checkoutUrlField: order.checkoutUrlField ?? null,
        } as Prisma.InputJsonValue,
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

    const message = error instanceof Error ? error.message : "Unable to create checkout order";
    const reason = message.includes("NOMBA_")
      ? "nomba-config"
      : message.includes("Nomba auth failed")
        ? "nomba-auth"
        : "unavailable";
    redirect(`/pay/invoice/${invoice.id}/checkout-error?reference=${reference}&reason=${reason}`);
  }

  if (!checkoutUrl) {
    redirect(`/pay/invoice/${invoice.id}/checkout-error?reference=${reference}&reason=missing-url`);
  }

  if (!isHttpUrl(checkoutUrl)) {
    redirect(`/pay/invoice/${invoice.id}/checkout-error?reference=${reference}&reason=invalid-url`);
  }

  redirect(checkoutUrl);
}




