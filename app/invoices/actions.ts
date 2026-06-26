"use server";

import { InvoiceStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAppUrl } from "@/lib/app-url";
import { getDb } from "@/lib/db";
import { getDemoBusiness } from "@/lib/demo-business";

function requiredString(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${key} is required`);
  }
  return value.trim();
}

export async function createInvoiceAction(formData: FormData) {
  const customerName = requiredString(formData, "customerName");
  const customerEmail = requiredString(formData, "customerEmail");
  const amount = Number(requiredString(formData, "amount"));
  const description = requiredString(formData, "description");
  const dueDateValue = formData.get("dueDate");

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("amount must be greater than zero");
  }

  const db = getDb();
  const business = await getDemoBusiness();
  const invoice = await db.invoice.create({
    data: {
      businessId: business.id,
      customerName,
      customerEmail,
      amount,
      description,
      dueDate: typeof dueDateValue === "string" && dueDateValue ? new Date(dueDateValue) : null,
      status: InvoiceStatus.UNPAID,
    },
  });

  const paymentUrl = `${getAppUrl()}/pay/invoice/${invoice.id}`;
  await db.invoice.update({
    where: { id: invoice.id },
    data: { paymentUrl },
  });

  revalidatePath("/invoices");
  redirect(`/invoices?created=${invoice.id}`);
}
