import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { AppShell } from "@/components/ui/app-shell";
import { BusinessBadge } from "@/components/ui/business-badge";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";
import { AddToHomeScreen } from "@/components/pwa/add-to-home-screen";
import { InactivityLogout } from "@/components/auth/inactivity-logout";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

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
      <html lang="en" className={plusJakarta.variable}>
        <body>
          <ServiceWorkerRegister />
          <AddToHomeScreen />
          <InactivityLogout />
          <AppShell businessBadge={<BusinessBadge />}>{children}</AppShell>
        </body>
      </html>
    </ClerkProvider>
  );
}
