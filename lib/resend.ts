import "server-only";
import { Resend } from "resend";

let client: Resend | null = null;

export function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!client) client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

export function getFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL ?? "invoices@payoutlite.app";
}
