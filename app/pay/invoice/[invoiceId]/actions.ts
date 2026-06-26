"use server";

import crypto from "node:crypto";
import { InvoiceStatus, TransactionSource, TransactionStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { getAppUrl } from "@/lib/app-url";
import { getDb } from "@/lib/db";
import { createNombaCheckoutOrder } from "@/lib/nomba";

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

  let checkoutUrl: string | undefined;

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

    await db.transaction.update({
      where: { id: transaction.id },
      data: {
        providerReference: order.orderReference,
        checkoutUrl: order.checkoutUrl,
        metadata: order.raw as object,
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

    redirect(`/pay/invoice/${invoice.id}/pending?reference=${reference}&checkout=unavailable`);
  }

  if (!checkoutUrl) {
    redirect(`/pay/invoice/${invoice.id}/pending?reference=${reference}&checkout=missing`);
  }

  redirect(checkoutUrl);
}
