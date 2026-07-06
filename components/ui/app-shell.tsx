"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  FileText,
  Globe,
  QrCode,
  Landmark,
  ArrowLeftRight,
  Sparkles,
  Settings2,
  Search,
  Plus,
  Shield,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { UserButton } from "@clerk/nextjs";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Invoices", href: "/invoices", icon: FileText },
  { label: "Website Button", href: "/website-button", icon: Globe },
  { label: "Shop QR", href: "/shop-qr", icon: QrCode },
  { label: "Unique Account", href: "/unique-account", icon: Landmark },
  { label: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { label: "AI CFO", href: "/ai-cfo", icon: Sparkles },
  { label: "Settings", href: "/onboarding", icon: Settings2 },
];

function isPublicRoute(pathname: string) {
  return (
    pathname === "/" ||
    pathname.startsWith("/pay/") ||
    pathname === "/offline" ||
    pathname.startsWith("/sign-")
  );
}

function Sidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="flex h-full w-full flex-col bg-white">
      {/* Logo */}
      <div className="border-b border-[var(--border)] px-5 py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--payout-blue)]">
            <span className="text-xs font-black text-white">PL</span>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-black text-[var(--foreground)]">Payout Lite</p>
            <p className="text-[11px] text-[var(--muted)]">Business Management</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-[var(--payout-blue)] text-white"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
              )}
            >
              <Icon size={16} strokeWidth={active ? 2.5 : 2} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-[var(--border)] px-5 py-4">
        <p className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
          <Shield size={12} />
          Nomba powered
        </p>
      </div>
    </aside>
  );
}

export function AppShell({
  children,
  businessBadge,
}: {
  children: React.ReactNode;
  businessBadge?: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (isPublicRoute(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      {/* Desktop sidebar */}
      <div className="fixed inset-y-0 left-0 hidden w-[var(--sidebar-width)] border-r border-[var(--border)] lg:flex">
        <Sidebar pathname={pathname} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative z-50 h-full w-[var(--sidebar-width)] border-r border-[var(--border)] shadow-xl">
            <Sidebar pathname={pathname} />
          </div>
        </div>
      )}

      {/* Main area */}
      <div className="flex flex-1 flex-col lg:ml-[var(--sidebar-width)]">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[var(--border)] bg-white px-5 py-3">
          {/* Mobile menu button */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-slate-500 hover:bg-slate-50 lg:hidden"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu size={16} />
          </button>

          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              placeholder="Search transactions, payments..."
              className="w-full rounded-lg border border-[var(--border)] bg-slate-50 py-2 pl-9 pr-4 text-sm text-[var(--foreground)] placeholder:text-slate-400 focus:border-[var(--payout-blue)] focus:ring-2 focus:ring-[var(--payout-blue)]/10"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Business selector */}
            {businessBadge}

            {/* Create Invoice CTA */}
            <Link
              href="/invoices#create-invoice"
              className="flex items-center gap-1.5 rounded-lg bg-[var(--payout-blue)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--payout-blue-dark)]"
            >
              <Plus size={15} />
              Create Invoice
            </Link>

            {/* User */}
            <UserButton />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden px-5 py-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
