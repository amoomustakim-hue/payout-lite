import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/ui/app-shell";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";
import "./globals.css";

export const metadata: Metadata = {
  title: "Payout Lite",
  description: "Nomba-powered payment tracking for small businesses",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Payout Lite",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563EB",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ServiceWorkerRegister />
          <AppShell>{children}</AppShell>
        </body>
      </html>
    </ClerkProvider>
  );
}
