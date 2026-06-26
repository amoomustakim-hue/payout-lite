import { NextRequest, NextResponse } from "next/server";
import { TransactionStatus } from "@prisma/client";
import { getDb } from "@/lib/db";
import { fetchNombaTransaction, verifyNombaWebhook } from "@/lib/nomba";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type NombaWebhookPayload = {
  event?: string;
  eventType?: string;
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

  let payload: NombaWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as NombaWebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const db = getDb();
  const data = payload.data ?? {};
  const eventType = pickString(payload.event, payload.eventType, data.event, data.eventType) ?? "nomba.webhook";
  const providerEventId = pickString(payload.id, data.id, data.eventId, data.transactionId, data.sessionId);
  const paymentReference = pickString(
    payload.paymentReference,
    payload.reference,
    payload.orderReference,
    data.paymentReference,
    data.reference,
    data.orderReference,
    data.merchantTxRef,
    data.transactionRef,
  );
  const providerStatus = pickString(payload.status, data.status, data.paymentStatus, data.transactionStatus);
  const nextStatus = normalizeStatus(providerStatus);
  const verification = nextStatus === TransactionStatus.PAID && paymentReference ? await verifySuccessfulPayment(paymentReference) : null;

  const result = await db.$transaction(async (tx) => {
    const transaction = paymentReference
      ? await tx.transaction.findFirst({
          where: {
            OR: [{ reference: paymentReference }, { providerReference: paymentReference }],
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
          providerReference: pickString(data.providerReference, data.sessionId, data.transactionId, paymentReference),
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

    return { duplicate: false, transactionUpdated };
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
