import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/invoices(.*)",
  "/transactions(.*)",
  "/webhooks(.*)",
  "/support(.*)",
  "/ai-cfo(.*)",
  "/website-button(.*)",
  "/shop-qr(.*)",
  "/unique-account(.*)",
  "/onboarding(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jte?|tsx?|ts?|map|json|png|jpg|jpeg|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webp|webm|wav|mp3|mp4|txt|rtf)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
