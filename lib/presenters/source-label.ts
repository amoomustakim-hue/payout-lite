/**
 * Human-readable labels for the TransactionSource enum.
 * Shared across dashboard, transactions and webhooks views.
 */
const SOURCE_LABELS: Record<string, string> = {
  INVOICE: "Invoice",
  WEBSITE_BUTTON: "Website Button",
  SHOP_QR: "Shop QR",
  UNIQUE_ACCOUNT: "Unique Account",
};

export function sourceLabel(source: string): string {
  return SOURCE_LABELS[source] ?? source;
}
