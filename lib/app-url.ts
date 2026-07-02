export function getAppUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL ?? "https://payout-lite.vercel.app").replace(/\/$/, "");
}
