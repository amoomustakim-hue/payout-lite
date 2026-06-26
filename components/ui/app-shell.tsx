"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { PayoutLiteLogo } from "@/components/brand/payout-lite-logo";

const navItems = [
  ["Dashboard", "/dashboard"],
  ["Invoices", "/invoices"],
  ["Button", "/website-button"],
  ["Shop QR", "/shop-qr"],
  ["Account", "/unique-account"],
  ["Transactions", "/transactions"],
  ["AI CFO", "/ai-cfo"],
];

function isPublicRoute(pathname: string) {
  return pathname.startsWith("/pay/") || pathname === "/offline" || pathname.startsWith("/sign-");
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (isPublicRoute(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r border-[var(--border)] bg-white/86 px-5 py-6 backdrop-blur lg:block">
        <PayoutLiteLogo />
        <nav className="mt-8 grid gap-1 text-sm font-semibold text-slate-600">
          {navItems.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                "rounded-xl px-4 py-3 transition hover:bg-blue-50 hover:text-[var(--payout-blue)]",
                pathname === href && "bg-blue-50 text-[var(--payout-blue)]",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div>
        <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-white/82 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
            <div className="lg:hidden">
              <PayoutLiteLogo />
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-bold text-slate-950">Merchant workspace</p>
              <p className="text-xs text-slate-500">Payments confirmed by Nomba webhooks</p>
            </div>
            <Link href="/invoices" className="rounded-xl bg-[var(--payout-blue)] px-4 py-2 text-sm font-bold text-white shadow-[0_12px_28px_rgba(33,107,255,0.22)]">
              New invoice
            </Link>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
