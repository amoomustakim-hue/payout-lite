import { NextRequest, NextResponse } from "next/server";
import { TransactionStatus } from "@prisma/client";
import { getDb } from "@/lib/db";
import { fetchNombaTransaction, verifyNombaWebhook } from "@/lib/nomba";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type NombaWebhookPayload = {
  event?: string;
  eventType?: string;
  event_type?: string;
  id?: string;
  data?: Record<string, unknown>;
  reference?: string;
  paymentReference?: string;
  orderReference?: string;
  status?: string;
};

function pickString(...values: unknown[]) {
  const value = values.find((item) => typeof item === "string" && item.length > 0);
  return typeof value === "string" ? value : undefined;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function normalizeStatus(status?: string): TransactionStatus | null {
  const value = status?.toLowerCase();
  if (!value) {
    return null;
  }

  if (["paid", "successful", "success", "completed", "complete"].includes(value)) {
    return TransactionStatus.PAID;
  }

  if (["failed", "declined", "cancelled", "canceled", "abandoned"].includes(value)) {
    return TransactionStatus.FAILED;
  }

  return null;
}

/**
 * Nomba checkout webhooks don't carry a flat `status` field — success is
 * signalled by `event_type: "payment_success"` and/or the transaction
 * `responseCode` of "00". Fall back to any explicit status string too.
 */
function deriveStatus(
  eventType: string,
  responseCode?: string,
  providerStatus?: string,
): TransactionStatus | null {
  const explicit = normalizeStatus(providerStatus);
  if (explicit) return explicit;

  const evt = eventType.toLowerCase();
  if (evt.includes("success")) return TransactionStatus.PAID;
  if (evt.includes("fail") || evt.includes("declin") || evt.includes("revers") || evt.includes("cancel")) {
    return TransactionStatus.FAILED;
  }

  if (responseCode === "00") return TransactionStatus.PAID;
  if (responseCode && responseCode !== "00") return TransactionStatus.FAILED;

  return null;
}

async function verifySuccessfulPayment(reference: string) {
  try {
    const transaction = await fetchNombaTransaction(reference);
    return { verified: true, transaction };
  } catch (error) {
    // TODO: Confirm the exact Nomba verification response shape and make this strict before production.
    return {
      verified: false,
      error: error instanceof Error ? error.message : "Unable to verify Nomba transaction",
    };
  }
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature =
    request.headers.get("x-nomba-signature") ??
    request.headers.get("nomba-signature") ??
    request.headers.get("x-signature");
  const signatureValid = verifyNombaWebhook(rawBody, signature);

  console.info("[nomba-webhook] received", {
    bytes: rawBody.length,
    hasSignature: Boolean(signature),
    signatureValid,
  });

  let payload: NombaWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as NombaWebhookPayload;
  } catch {
    console.error("[nomba-webhook] invalid JSON payload");
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const db = getDb();
  const data = asRecord(payload.data);
  // Nomba nests the meaningful fields under data.transaction and data.order.
  const txData = asRecord(data.transaction);
  const orderData = asRecord(data.order);

  const eventType =
    pickString(payload.event, payload.eventType, payload.event_type, data.event, data.eventType) ??
    "nomba.webhook";

  const providerEventId = pickString(
    payload.id,
    data.id,
    data.eventId,
    txData.transactionId,
    txData.sessionId,
    orderData.orderId,
    data.transactionId,
    data.sessionId,
  );

  // Collect every reference Nomba might echo, across flat and nested shapes.
  // `merchantTxRef` / `orderReference` are what we stored as reference / providerReference.
  const referenceCandidates = [
    txData.merchantTxRef,
    orderData.orderReference,
    txData.transactionId,
    payload.paymentReference,
    payload.reference,
    payload.orderReference,
    data.paymentReference,
    data.reference,
    data.orderReference,
    data.merchantTxRef,
    data.transactionRef,
    data.transactionId,
  ].filter((v): v is string => typeof v === "string" && v.length > 0);

  const paymentReference = referenceCandidates[0];

  const responseCode = pickString(txData.responseCode, data.responseCode);
  const providerStatus = pickString(
    payload.status,
    data.status,
    data.paymentStatus,
    data.transactionStatus,
    txData.status,
  );
  const nextStatus = deriveStatus(eventType, responseCode, providerStatus);
  const verification =
    nextStatus === TransactionStatus.PAID && paymentReference
      ? await verifySuccessfulPayment(paymentReference)
      : null;

  const result = await db.$transaction(async (tx) => {
    const transaction = referenceCandidates.length
      ? await tx.transaction.findFirst({
          where: {
            OR: referenceCandidates.flatMap((r) => [
              { reference: r },
              { providerReference: r },
            ]),
          },
          include: { invoice: true },
        })
      : null;

    const existingEvent = providerEventId
      ? await tx.webhookEvent.findUnique({ where: { providerEventId } })
      : null;

    if (existingEvent?.processedAt) {
      return { duplicate: true, transactionUpdated: false };
    }

    const webhookEvent = existingEvent
      ? await tx.webhookEvent.update({
          where: { id: existingEvent.id },
          data: {
            transactionId: transaction?.id,
            paymentReference,
            signatureValid,
            payload: { payload, verification } as object,
          },
        })
      : await tx.webhookEvent.create({
          data: {
            providerEventId,
            eventType,
            paymentReference,
            signatureValid,
            payload: { payload, verification } as object,
            transactionId: transaction?.id,
          },
        });

    let transactionUpdated = false;

    if (transaction && nextStatus && transaction.status !== nextStatus) {
      await tx.transaction.update({
        where: { id: transaction.id },
        data: {
          status: nextStatus,
          providerReference:
            transaction.providerReference ??
            pickString(
              txData.transactionId,
              txData.sessionId,
              orderData.orderReference,
              data.providerReference,
              data.sessionId,
              data.transactionId,
              paymentReference,
            ),
          paidAt: nextStatus === TransactionStatus.PAID ? new Date() : transaction.paidAt,
          metadata: { payload, verification } as object,
        },
      });

      transactionUpdated = true;

      if (transaction.invoiceId && nextStatus === TransactionStatus.PAID) {
        await tx.invoice.update({
          where: { id: transaction.invoiceId },
          data: { status: "PAID" },
        });
      }

      if (transaction.invoiceId && nextStatus === TransactionStatus.FAILED) {
        await tx.invoice.update({
          where: { id: transaction.invoiceId },
          data: { status: "FAILED" },
        });
      }
    }

    await tx.webhookEvent.update({
      where: { id: webhookEvent.id },
      data: { processedAt: new Date() },
    });

    return { duplicate: false, transactionUpdated, matched: Boolean(transaction) };
  });

  console.info("[nomba-webhook] processed", {
    eventType,
    paymentReference,
    responseCode,
    providerStatus,
    nextStatus,
    ...result,
  });

  return NextResponse.json({
    ok: true,
    signatureValid,
    verification,
    ...result,
  });
}

export function GET() {
  return NextResponse.json({
    ok: true,
    route: "/api/nomba/webhook",
    message: "Send Nomba POST webhooks to this endpoint.",
  });
}
