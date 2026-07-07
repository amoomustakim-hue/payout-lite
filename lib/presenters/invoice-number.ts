/**
 * Derives a stable, human-friendly invoice number from a business-scoped
 * sequence index (1-based). Kept in one place so the same invoice always
 * renders the same number wherever it appears.
 */
export function invoiceNumber(sequence: number): string {
  return `#INV-${String(sequence).padStart(3, "0")}`;
}
