const DEFAULT_APP_URL = "https://payout-lite.vercel.app";

/**
 * Absolute base URL for the app, used to build payment links, QR codes and
 * the Nomba checkout callback/redirect URLs.
 *
 * Note: we deliberately do NOT use `??` here — NEXT_PUBLIC_APP_URL can be set
 * to an empty string in the environment, which `??` would happily return,
 * producing relative callback URLs that Nomba cannot reach. Treat blank as unset.
 */
export function getAppUrl() {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();
  const base = raw && raw.length > 0 ? raw : DEFAULT_APP_URL;
  return base.replace(/\/$/, "");
}
