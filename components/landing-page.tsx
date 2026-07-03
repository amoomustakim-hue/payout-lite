"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Check,
  Zap,
  Lock,
  Webhook,
  FileText,
  Sparkles,
  Menu,
  X,
  BadgeCheck,
  Landmark,
  TrendingUp,
  Copy,
} from "lucide-react";

// ─── Fade-in wrapper ─────────────────────────────────────────────────────────
function FadeIn({
  children,
  delay = 0,
  className = "",
  from = "bottom",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  from?: "bottom" | "left" | "right";
}) {
  const initial =
    from === "left" ? { opacity: 0, x: -32 } :
    from === "right" ? { opacity: 0, x: 32 } :
    { opacity: 0, y: 24 };
  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Phone frame ──────────────────────────────────────────────────────────────
function PhoneFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative mx-auto ${className}`} style={{ width: 240 }}>
      <div className="relative overflow-hidden rounded-[2.6rem] bg-[#0A0A0A] shadow-[0_40px_80px_-12px_rgba(0,0,0,0.28),0_0_0_1px_rgba(255,255,255,0.08)]"
        style={{ padding: 9 }}>
        <div className="overflow-hidden rounded-[2.1rem] bg-white">
          <div className="flex justify-center bg-[#0A0A0A] py-2">
            <div className="h-[17px] w-[88px] rounded-full bg-black" />
          </div>
          <div className="min-h-[480px]">{children}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Invoice ─────────────────────────────────────────────────────────
function InvoiceScreen() {
  return (
    <div className="bg-[#F8FAFC] p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-bold text-[#0F172A]">Invoice</span>
        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[9px] font-bold text-amber-600">Pending</span>
      </div>
      <div className="mb-3 rounded-xl bg-white p-3 shadow-sm">
        <p className="text-[8px] font-medium uppercase tracking-wide text-slate-400">Bill to</p>
        <p className="mt-0.5 text-[11px] font-bold text-[#0F172A]">Chukwuma Electronics</p>
        <div className="mt-3 border-t border-slate-100 pt-2.5">
          <div className="mb-1 flex justify-between text-[9px]">
            <span className="text-slate-400">Web design</span>
            <span className="font-semibold text-[#0F172A]">₦35,000</span>
          </div>
          <div className="flex justify-between text-[9px]">
            <span className="text-slate-400">Logo pack</span>
            <span className="font-semibold text-[#0F172A]">₦10,000</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2.5">
            <span className="text-[9px] font-semibold text-slate-500">Total</span>
            <span className="text-sm font-black text-[#0F172A]">₦45,000</span>
          </div>
        </div>
      </div>
      <div className="mb-3 rounded-xl bg-[#2563EB] p-2.5">
        <p className="text-[8px] text-blue-200">Payment link</p>
        <p className="mt-0.5 truncate text-[9px] font-medium text-white">payout-lite.vercel.app/pay/…</p>
      </div>
      <div className="flex gap-2">
        <button className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-[#0F172A] py-2 text-[9px] font-bold text-white">
          Share link
        </button>
        <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200">
          <Copy size={10} className="text-slate-400" />
        </button>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-2.5">
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        <p className="text-[8px] font-medium text-emerald-700">Webhook confirmed · ₦45,000 paid</p>
      </div>
    </div>
  );
}

// ─── Screen: Website button ───────────────────────────────────────────────────
function WebsiteButtonScreen() {
  return (
    <div className="bg-[#F8FAFC] p-4">
      <div className="mb-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
        <div className="mb-2.5 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600" />
          <div>
            <p className="text-[10px] font-bold text-[#0F172A]">Online Store</p>
            <p className="text-[8px] text-slate-400">mystore.ng</p>
          </div>
        </div>
        <div className="space-y-1.5">
          {[
            { name: "Blue Agbada Set", price: "₦18,000" },
            { name: "Delivery fee", price: "₦500" },
          ].map((i) => (
            <div key={i.name} className="flex items-center justify-between">
              <p className="text-[9px] text-slate-500">{i.name}</p>
              <p className="text-[9px] font-semibold text-[#0F172A]">{i.price}</p>
            </div>
          ))}
          <div className="border-t border-slate-100 pt-1.5">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-bold text-[#0F172A]">Total</p>
              <p className="text-[11px] font-black text-[#0F172A]">₦18,500</p>
            </div>
          </div>
        </div>
      </div>
      <button className="mb-2.5 w-full rounded-xl bg-[#2563EB] py-2.5 text-[10px] font-bold text-white">
        Pay with Payout Lite →
      </button>
      <div className="rounded-xl border border-slate-100 bg-white p-2.5">
        <p className="mb-1 text-[8px] font-semibold uppercase tracking-wide text-slate-400">Nomba Checkout</p>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-[9px] text-[#0F172A]">Secure · SSL encrypted</p>
        </div>
      </div>
      <div className="mt-2.5 flex items-center gap-1.5 rounded-xl bg-emerald-50 p-2.5">
        <BadgeCheck size={11} className="shrink-0 text-emerald-600" />
        <p className="text-[8px] font-medium text-emerald-700">₦18,500 confirmed via webhook</p>
      </div>
    </div>
  );
}

// ─── Screen: QR ──────────────────────────────────────────────────────────────
function QRScreen() {
  return (
    <div className="flex flex-col items-center bg-white p-5">
      <p className="mb-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-400">Shop QR</p>
      <p className="mb-4 text-[12px] font-black text-[#0F172A]">Ada Stores</p>
      <div className="mb-4 flex h-[148px] w-[148px] items-center justify-center rounded-2xl border-[3px] border-[#2563EB] bg-[#EFF6FF] p-3">
        <div className="grid grid-cols-7 gap-[2px]">
          {Array.from({ length: 49 }).map((_, i) => {
            const on = [0,1,2,3,4,5,6,7,13,14,20,21,27,28,34,35,41,42,43,44,45,46,48,8,12,22,26,36,40,15,19,29,33,9,11,23,25,37,39,16,18,30,32].includes(i);
            return <div key={i} className={`h-[9px] w-[9px] rounded-[2px] ${on ? "bg-[#0F172A]" : ""}`} />;
          })}
        </div>
      </div>
      <p className="mb-4 text-center text-[9px] leading-relaxed text-slate-400">
        Scan to pay any amount<br />directly to Ada Stores
      </p>
      <button className="mb-2 w-full rounded-xl bg-[#2563EB] py-2 text-[9px] font-bold text-white">
        Share QR code
      </button>
      <button className="w-full rounded-xl border border-slate-200 py-2 text-[9px] font-medium text-slate-500">
        Download PNG
      </button>
      <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2">
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        <p className="text-[8px] font-medium text-emerald-700">₦3,500 received · 2 min ago</p>
      </div>
    </div>
  );
}

// ─── Screen: AI CFO ──────────────────────────────────────────────────────────
function AICFOScreen() {
  return (
    <div className="flex h-full flex-col bg-[#F8FAFC]">
      <div className="border-b border-slate-100 bg-white px-3.5 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2563EB]">
            <Sparkles size={11} className="text-white" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#0F172A]">AI CFO</p>
            <p className="text-[8px] text-emerald-500">● Groq · Online</p>
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-2.5 overflow-hidden p-3.5">
        <div className="flex justify-end">
          <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-[#2563EB] px-3 py-2 text-[9px] text-white">
            How much did I make today?
          </div>
        </div>
        <div className="flex justify-start gap-1.5">
          <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50">
            <Sparkles size={9} className="text-[#2563EB]" />
          </div>
          <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-slate-100 bg-white px-3 py-2 text-[9px] leading-relaxed text-[#0F172A] shadow-sm">
            You collected <strong>₦115,000</strong> today from 4 confirmed payments. Website Button is your top source with ₦68,000.
          </div>
        </div>
        <div className="flex justify-end">
          <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-[#2563EB] px-3 py-2 text-[9px] text-white">
            Any unpaid invoices?
          </div>
        </div>
        <div className="flex justify-start gap-1.5">
          <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50">
            <Sparkles size={9} className="text-[#2563EB]" />
          </div>
          <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-slate-100 bg-white px-3 py-2 text-[9px] leading-relaxed text-[#0F172A] shadow-sm">
            <strong>3 invoices</strong> pending totalling ₦72,000. Oldest is 4 days overdue.
          </div>
        </div>
      </div>
      <div className="border-t border-slate-100 bg-white p-3">
        <div className="flex items-center gap-1.5 rounded-xl bg-slate-50 px-3 py-2">
          <span className="flex-1 text-[9px] text-slate-400">Ask about your payments…</span>
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2563EB]">
            <ArrowRight size={8} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Dashboard ───────────────────────────────────────────────────────
function DashboardScreen() {
  return (
    <div className="bg-[#F8FAFC] p-3.5">
      <div className="mb-3 rounded-xl bg-[#2563EB] p-3 text-white">
        <p className="text-[8px] font-medium text-blue-200">Total collected</p>
        <p className="mt-0.5 text-xl font-black">₦482,000</p>
        <div className="mt-1 flex items-center gap-1.5">
          <span className="rounded bg-white/20 px-1.5 py-0.5 text-[8px] font-bold text-white">▲ +34%</span>
          <span className="text-[8px] text-blue-200">this month</span>
        </div>
        <svg viewBox="0 0 200 28" className="mt-2 h-7 w-full" preserveAspectRatio="none">
          <path d="M0,24 C30,24 40,8 60,11 C80,14 100,18 120,12 C140,6 160,16 180,9 C195,4 200,10 200,7"
            fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <div className="mb-2.5 grid grid-cols-3 gap-1.5">
        {[
          { label: "Paid", value: "28", dot: "bg-emerald-500" },
          { label: "Pending", value: "4", dot: "bg-amber-400" },
          { label: "Failed", value: "1", dot: "bg-red-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg bg-white p-2 shadow-sm">
            <div className={`mb-1 h-1.5 w-1.5 rounded-full ${s.dot}`} />
            <p className="text-sm font-black text-[#0F172A]">{s.value}</p>
            <p className="text-[8px] text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>
      <p className="mb-1.5 text-[8px] font-semibold uppercase tracking-wide text-slate-400">Recent</p>
      <div className="space-y-1.5">
        {[
          { name: "Invoice #INV-042", sub: "Ada Stores", amount: "+₦45,000", dot: "bg-emerald-500" },
          { name: "QR Walk-in", sub: "Mama Ngozi", amount: "+₦1,500", dot: "bg-emerald-500" },
          { name: "Web button", sub: "Online store", amount: "+₦12,000", dot: "bg-emerald-500" },
        ].map((tx) => (
          <div key={tx.name} className="flex items-center gap-2 rounded-lg bg-white p-2 shadow-sm">
            <div className={`h-1.5 w-1.5 shrink-0 rounded-full ${tx.dot}`} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[9px] font-semibold text-[#0F172A]">{tx.name}</p>
              <p className="text-[7px] text-slate-400">{tx.sub}</p>
            </div>
            <span className="text-[9px] font-bold text-emerald-600">{tx.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Feature section ─────────────────────────────────────────────────────────
function FeatureSection({
  id,
  eyebrow,
  title,
  body,
  cta,
  ctaHref,
  screen,
  flip = false,
  bg = "bg-white",
}: {
  id?: string;
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  ctaHref: string;
  screen: React.ReactNode;
  flip?: boolean;
  bg?: string;
}) {
  return (
    <section id={id} className={`${bg} py-20 lg:py-28`}>
      <div className="mx-auto max-w-6xl px-5">
        <div className={`flex flex-col items-center gap-14 lg:flex-row lg:gap-24 ${flip ? "lg:flex-row-reverse" : ""}`}>
          <FadeIn from={flip ? "right" : "left"} className="flex-1">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#2563EB]">{eyebrow}</p>
            <h2 className="mb-4 text-3xl font-black leading-tight text-[#0F172A] lg:text-4xl">{title}</h2>
            <p className="mb-8 text-base leading-relaxed text-slate-500">{body}</p>
            <Link
              href={ctaHref}
              className="group inline-flex items-center gap-2 rounded-xl bg-[#0F172A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1e293b]"
            >
              {cta}
              <ArrowRight size={15} className="transition group-hover:translate-x-1" />
            </Link>
          </FadeIn>

          <FadeIn from={flip ? "left" : "right"} className="w-full max-w-[280px] flex-shrink-0 lg:w-auto">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            >
              <PhoneFrame>{screen}</PhoneFrame>
            </motion.div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "What is Payout Lite?",
    a: "Payout Lite is a Nomba-powered payment hub for small Nigerian businesses. It lets you create invoices, generate QR codes, embed website payment buttons, receive bank transfers — and track everything in one dashboard with webhook-confirmed accuracy.",
  },
  {
    q: "Is Payout Lite using Nomba?",
    a: "Yes. All payment checkout flows are powered by Nomba infrastructure. When a customer pays, Nomba sends an HMAC-verified webhook to Payout Lite, and the payment status updates server-side — not from a redirect URL that can be faked.",
  },
  {
    q: "Can customers pay without creating an account?",
    a: "Yes. All public payment routes — invoice links, shop QR, and website buttons — are fully accessible without any account or login. Only the merchant dashboard may require sign-in.",
  },
  {
    q: "What payment methods does it support?",
    a: "Payout Lite supports card payments, bank transfers, and mobile banking — all through Nomba Checkout. 50+ Nigerian banks are supported for transfers.",
  },
  {
    q: "What is the website payment button?",
    a: "It's an HTML snippet you paste into any website. When a customer clicks it, they land on a Nomba-powered checkout page and complete payment. No backend integration required on your end.",
  },
  {
    q: "What is Shop QR?",
    a: "Shop QR generates a scannable QR code linked to your business payment page. Print it, stick it on your counter or flyer, and walk-in customers can scan and pay any amount directly.",
  },
  {
    q: "How does webhook confirmation work?",
    a: "When a Nomba payment is completed, Nomba sends a signed webhook event to Payout Lite's /api/nomba/webhook endpoint. The signature is verified with HMAC-SHA256 before the payment status is updated. This means only genuine Nomba events can change a payment from pending to paid.",
  },
  {
    q: "Is AI CFO giving financial advice?",
    a: "No. AI CFO provides payment insights grounded in your actual transaction data — things like total collected, which channel performed best, and which invoices are unpaid. It is not financial, tax, or legal advice.",
  },
];

function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-8 py-5 text-left"
      >
        <span className="text-[15px] font-semibold text-[#0F172A]">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.22 }} className="shrink-0">
          <ChevronDown size={17} className="text-slate-400" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-slate-500">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function LandingPage({ isSignedIn }: { isSignedIn: boolean }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Use Cases", href: "#use-cases" },
    { label: "Features", href: "#features" },
    { label: "Security", href: "#security" },
    { label: "AI CFO", href: "#ai-cfo" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-[#0F172A]">

      {/* ── NAVIGATION ──────────────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="fixed top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-sm"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB]">
              <span className="text-[11px] font-black text-white">PL</span>
            </div>
            <span className="text-[15px] font-black text-[#0F172A]">Payout Lite</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map((l) => (
              <a key={l.label} href={l.href}
                className="text-sm text-slate-500 transition hover:text-[#0F172A]">
                {l.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-2.5 md:flex">
            {isSignedIn ? (
              <Link href="/dashboard"
                className="rounded-xl bg-[#0F172A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1e293b]">
                Open Dashboard
              </Link>
            ) : (
              <>
                <Link href="/sign-in"
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-[#0F172A] transition hover:bg-slate-50">
                  Sign in
                </Link>
                <Link href="/sign-up"
                  className="rounded-xl bg-[#0F172A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1e293b]">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-slate-100 bg-white"
            >
              <div className="mx-auto max-w-6xl px-5 pb-5 pt-3">
                <nav className="mb-4 flex flex-col gap-1">
                  {navLinks.map((l) => (
                    <a key={l.label} href={l.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-[#0F172A]">
                      {l.label}
                    </a>
                  ))}
                </nav>
                <div className="flex flex-col gap-2">
                  {isSignedIn ? (
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}
                      className="rounded-xl bg-[#0F172A] py-3 text-center text-sm font-semibold text-white">
                      Open Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}
                        className="rounded-xl border border-slate-200 py-3 text-center text-sm font-medium text-[#0F172A]">
                        Sign in
                      </Link>
                      <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}
                        className="rounded-xl bg-[#0F172A] py-3 text-center text-sm font-semibold text-white">
                        Get Started
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen overflow-hidden bg-white pt-20">
        {/* Subtle gradient wash */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-0 h-[80vh] w-[60vw] bg-gradient-to-bl from-blue-50/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 h-[40vh] w-[40vw] bg-gradient-to-tr from-slate-50/80 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl flex-col items-center px-5 pt-12 lg:flex-row lg:items-center lg:gap-8 lg:pt-0">
          {/* Left: text */}
          <div className="flex-1 pb-10 text-center lg:pb-0 lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-[#2563EB]">
                <Zap size={11} />
                Nomba-powered payment hub
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 text-[2.6rem] font-black leading-[1.05] tracking-tight text-[#0F172A] sm:text-5xl lg:text-[3.75rem]"
            >
              Collect payments from
              {" "}<br className="hidden sm:block" />
              <span className="text-[#2563EB]">any link, invoice,</span>
              {" "}<br className="hidden sm:block" />
              QR, or website.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.22 }}
              className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-slate-500 lg:mx-0 lg:text-[17px]"
            >
              Payout Lite helps small Nigerian businesses accept payments through invoices, website buttons, and shop QR — then track every transaction with webhook-confirmed Nomba checkout and AI CFO insights.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.34 }}
              className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start"
            >
              <Link
                href="/dashboard"
                className="group flex items-center gap-2 rounded-xl bg-[#0F172A] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-[#1e293b]"
              >
                Open Dashboard
                <ArrowRight size={15} className="transition group-hover:translate-x-1" />
              </Link>
              <Link
                href="/invoices"
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-[#0F172A] transition hover:border-slate-300 hover:bg-slate-50"
              >
                Create an Invoice
              </Link>
            </motion.div>

            <motion.a
              href="/invoices"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-4 block text-sm text-slate-400 underline-offset-4 hover:text-slate-600 hover:underline lg:inline"
            >
              View payment demo →
            </motion.a>
          </div>

          {/* Right: phone + floating cards */}
          <motion.div
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex-shrink-0 pb-10 lg:pb-0"
          >
            {/* Top-left floating card */}
            <motion.div
              className="absolute -left-4 top-10 z-10 min-w-[160px] rounded-2xl border border-slate-100 bg-white px-3.5 py-2.5 shadow-lg lg:-left-20"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.85 }}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                  <Check size={13} className="text-emerald-600" strokeWidth={3} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#0F172A]">Paid ₦20,000</p>
                  <p className="text-[9px] text-slate-400">Invoice #INV-001</p>
                </div>
              </div>
              <p className="mt-1.5 text-[8px] font-medium text-emerald-600">✓ Webhook confirmed</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}
            >
              <PhoneFrame><DashboardScreen /></PhoneFrame>
            </motion.div>

            {/* Bottom-right floating card: total */}
            <motion.div
              className="absolute -right-4 bottom-28 z-10 min-w-[152px] rounded-2xl border border-slate-100 bg-white px-3.5 py-2.5 shadow-lg lg:-right-20"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <p className="text-[8px] font-semibold uppercase tracking-wide text-slate-400">Collected today</p>
              <p className="mt-0.5 text-[15px] font-black text-[#0F172A]">₦115,000</p>
              <div className="mt-1 flex items-center gap-1">
                <TrendingUp size={9} className="text-emerald-500" />
                <span className="text-[8px] font-medium text-emerald-600">+18% vs yesterday</span>
              </div>
            </motion.div>

            {/* AI CFO chip */}
            <motion.div
              className="absolute -right-4 top-12 z-10 max-w-[172px] rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2.5 shadow-md lg:-right-20"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.15 }}
            >
              <div className="flex items-center gap-1.5">
                <Sparkles size={10} className="shrink-0 text-[#2563EB]" />
                <p className="text-[9px] font-semibold text-[#2563EB]">AI CFO</p>
              </div>
              <p className="mt-1 text-[8px] leading-snug text-slate-600">Website Button is your top source.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── TRUST BAR ────────────────────────────────────────────────────── */}
      <div className="border-y border-slate-100 bg-[#F8FAFC] py-5">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 sm:gap-x-14">
            {[
              { icon: Zap, label: "Nomba-powered checkout" },
              { icon: Webhook, label: "Webhook-confirmed payments" },
              { icon: FileText, label: "Invoice payment links" },
              { icon: Landmark, label: "Built for Nigerian SMEs" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 text-slate-500">
                <Icon size={15} className="shrink-0 text-[#2563EB]" />
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURE SECTIONS ─────────────────────────────────────────────── */}
      <div id="features">
        <FeatureSection
          eyebrow="Invoice Payments"
          title="Send invoices that customers can pay instantly."
          body="Create clean payment invoices, share a secure link, and let customers complete checkout through Nomba. Payout Lite tracks the status from pending to paid — no manual reconciliation needed."
          cta="Create invoice"
          ctaHref="/invoices"
          screen={<InvoiceScreen />}
          bg="bg-white"
        />

        <FeatureSection
          eyebrow="Website Button"
          title="Add checkout to any website without rebuilding your store."
          body="Generate a Payout button for your business website. Customers can click, review the amount, and complete payment through Nomba checkout. One snippet, zero backend work."
          cta="Get website button"
          ctaHref="/website-button"
          screen={<WebsiteButtonScreen />}
          flip
          bg="bg-[#F8FAFC]"
        />

        <FeatureSection
          eyebrow="Shop QR"
          title="Let walk-in customers scan and pay."
          body="Turn your shop counter, flyer, or WhatsApp status into a payment point. Customers scan your QR, enter details, and pay securely. No app download, no friction."
          cta="View Shop QR"
          ctaHref="/shop-qr"
          screen={<QRScreen />}
          bg="bg-white"
        />

        <FeatureSection
          id="ai-cfo"
          eyebrow="AI CFO"
          title="Understand your money after every payment."
          body="AI CFO summarizes what came in, what is pending, what failed, and which payment channel is performing best — grounded in your real Nomba transaction history, powered by Groq."
          cta="Ask AI CFO"
          ctaHref="/ai-cfo"
          screen={<AICFOScreen />}
          flip
          bg="bg-[#F8FAFC]"
        />
      </div>

      {/* ── SECURITY ─────────────────────────────────────────────────────── */}
      <section id="security" className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-5">
          <FadeIn className="mb-14 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#2563EB]">Security</p>
            <h2 className="mx-auto max-w-xl text-3xl font-black text-[#0F172A] lg:text-4xl">
              Built around verified payment status.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-500">
              Payout Lite does not just show a success screen. Payments move from pending to paid only after Nomba webhook confirmation and server-side status updates.
            </p>
          </FadeIn>

          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "Nomba checkout",
                body: "Customers complete payment through a secure Nomba-powered flow. No card data ever touches Payout Lite's servers.",
              },
              {
                icon: Webhook,
                title: "Webhook confirmation",
                body: "Payment status updates only after Nomba sends an HMAC-SHA256 signed webhook event that is verified server-side.",
              },
              {
                icon: Lock,
                title: "No exposed secrets",
                body: "API keys, webhook secrets, and credentials stay server-side. They are never placed in frontend code or client bundles.",
              },
            ].map(({ icon: Icon, title, body }, i) => (
              <FadeIn key={title} delay={i * 0.1}>
                <div className="h-full rounded-2xl border border-slate-100 p-7 transition hover:border-blue-100 hover:shadow-md">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                    <Icon size={19} className="text-[#2563EB]" />
                  </div>
                  <h3 className="mb-2 font-bold text-[#0F172A]">{title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── USE CASES ────────────────────────────────────────────────────── */}
      <section id="use-cases" className="bg-[#F8FAFC] py-24">
        <div className="mx-auto max-w-6xl px-5">
          <FadeIn className="mb-14 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#2563EB]">Use Cases</p>
            <h2 className="text-3xl font-black text-[#0F172A] lg:text-4xl">
              Where Payout Lite fits into everyday business.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-500">
              From freelancers to shop owners — Payout Lite fits how Nigerian businesses actually work.
            </p>
          </FadeIn>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                gradient: "from-blue-500 to-indigo-600",
                emoji: "💼",
                label: "Freelancer deposit",
                description: "Send a payment invoice for a design or development deposit.",
                badge: "Paid ₦50,000",
                badgeColor: "bg-emerald-100 text-emerald-700",
              },
              {
                gradient: "from-rose-500 to-pink-600",
                emoji: "🛍️",
                label: "Instagram vendor",
                description: "Share a payment link after confirming a custom order.",
                badge: "Pending ₦18,000",
                badgeColor: "bg-amber-100 text-amber-700",
              },
              {
                gradient: "from-orange-400 to-amber-500",
                emoji: "🏪",
                label: "Small shop counter",
                description: "Let customers scan your Shop QR and pay instantly.",
                badge: "QR payment",
                badgeColor: "bg-blue-100 text-blue-700",
              },
              {
                gradient: "from-emerald-500 to-teal-600",
                emoji: "🧑‍💻",
                label: "Service business",
                description: "Add a website button so customers can pay for bookings or packages.",
                badge: "Website checkout",
                badgeColor: "bg-purple-100 text-purple-700",
              },
            ].map(({ gradient, emoji, label, description, badge, badgeColor }, i) => (
              <FadeIn key={label} delay={i * 0.08}>
                <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                  <div className={`flex h-36 items-end bg-gradient-to-br ${gradient} p-4`}>
                    <span className="text-4xl">{emoji}</span>
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
                    <p className="mt-1.5 text-sm leading-snug text-[#0F172A]">{description}</p>
                    <div className="mt-3">
                      <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold ${badgeColor}`}>
                        {badge}
                      </span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ────────────────────────────────────────────── */}
      <section className="bg-[#050B1E] py-24">
        <div className="mx-auto max-w-6xl px-5">
          <FadeIn className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-400">Dashboard</p>
            <h2 className="text-3xl font-black text-white lg:text-4xl">Track every payment from one dashboard.</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-400">
              Every channel, every transaction, every confirmation — all in one clean view.
            </p>
          </FadeIn>

          <FadeIn>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-1">
              <div className="rounded-xl bg-[#0D1424] p-5">
                {/* Mock dashboard header */}
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-400">Good morning, Ada Stores</p>
                    <p className="text-lg font-black text-white">Payment Overview</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-xs text-slate-400">Live via Nomba webhooks</p>
                  </div>
                </div>

                {/* Stats row */}
                <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Total Collected", value: "₦482,000", delta: "+34%", color: "text-emerald-400" },
                    { label: "Pending", value: "₦72,000", delta: "4 invoices", color: "text-amber-400" },
                    { label: "Paid", value: "28 txns", delta: "this month", color: "text-blue-400" },
                    { label: "Failed", value: "1 txn", delta: "review needed", color: "text-red-400" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl bg-white/5 p-4">
                      <p className="text-[10px] font-medium text-slate-400">{s.label}</p>
                      <p className="mt-1 text-xl font-black text-white">{s.value}</p>
                      <p className={`mt-0.5 text-[10px] font-medium ${s.color}`}>{s.delta}</p>
                    </div>
                  ))}
                </div>

                {/* Two col: transactions + AI CFO */}
                <div className="grid gap-3 lg:grid-cols-[1fr_320px]">
                  {/* Transactions */}
                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Recent Transactions</p>
                    <div className="space-y-2.5">
                      {[
                        { name: "Chukwuma Electronics", channel: "Invoice", amount: "₦45,000", status: "Paid", dot: "bg-emerald-500" },
                        { name: "Mama Ngozi Foods", channel: "Shop QR", amount: "₦3,500", status: "Paid", dot: "bg-emerald-500" },
                        { name: "mystore.ng", channel: "Website Button", amount: "₦18,500", status: "Paid", dot: "bg-emerald-500" },
                        { name: "Ada Stores", channel: "Unique Account", amount: "₦50,000", status: "Pending", dot: "bg-amber-400" },
                      ].map((tx) => (
                        <div key={tx.name} className="flex items-center gap-3">
                          <div className={`h-2 w-2 shrink-0 rounded-full ${tx.dot}`} />
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-xs font-semibold text-white">{tx.name}</p>
                            <p className="text-[10px] text-slate-400">{tx.channel}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-white">{tx.amount}</p>
                            <p className="text-[10px] text-slate-400">{tx.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI CFO insight */}
                  <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/20">
                        <Sparkles size={12} className="text-blue-400" />
                      </div>
                      <p className="text-xs font-semibold text-blue-300">AI CFO Insight</p>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-300">
                      You collected <strong className="text-white">₦115,000</strong> today from 4 confirmed payments. Website Button generated the highest revenue at <strong className="text-white">₦68,000</strong>. You have <strong className="text-white">3 unpaid invoices</strong> totalling ₦72,000.
                    </p>
                    <Link href="/ai-cfo"
                      className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300">
                      Ask a question <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15} className="mt-8 text-center">
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-[#1D4ED8]"
            >
              Open Dashboard
              <ArrowRight size={15} className="transition group-hover:translate-x-1" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ── STATS BAND ───────────────────────────────────────────────────── */}
      <div className="border-y border-slate-100 bg-white py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid gap-10 text-center sm:grid-cols-3">
            {[
              { value: "5", label: "Payment channels", sub: "Invoice · QR · Button · Account · Webhook" },
              { value: "50+", label: "Banks supported", sub: "Via Nomba infrastructure" },
              { value: "100%", label: "Webhook-confirmed", sub: "HMAC-SHA256 verified — no false positives" },
            ].map(({ value, label, sub }, i) => (
              <FadeIn key={label} delay={i * 0.1}>
                <p className="text-5xl font-black text-[#0F172A] lg:text-6xl">{value}</p>
                <p className="mt-2 text-sm font-semibold text-slate-600">{label}</p>
                <p className="mt-1 text-xs text-slate-400">{sub}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section id="faq" className="bg-[#F8FAFC] py-24">
        <div className="mx-auto max-w-3xl px-5">
          <FadeIn className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#2563EB]">FAQ</p>
            <h2 className="text-3xl font-black text-[#0F172A] lg:text-4xl">Common questions</h2>
          </FadeIn>
          <div className="rounded-2xl border border-slate-100 bg-white px-6 sm:px-8">
            {FAQS.map((faq, i) => (
              <FaqItem
                key={i}
                q={faq.q}
                a={faq.a}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#050B1E] py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2563EB]/12 blur-[120px]" />
        </div>
        <FadeIn className="relative z-10 mx-auto max-w-2xl px-5 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-400">Get started</p>
          <h2 className="text-4xl font-black text-white lg:text-5xl">
            Start collecting payments the simple way.
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Use invoices, QR, and website buttons to collect payments while Payout Lite tracks everything in one dashboard.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/dashboard"
              className="group flex items-center gap-2 rounded-xl bg-[#2563EB] px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-[#1D4ED8]"
            >
              Open Dashboard
              <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </Link>
            <Link
              href="/invoices"
              className="flex items-center gap-2 rounded-xl border border-white/15 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
            >
              Create Invoice
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] bg-[#050B1E] py-10">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-8 flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
            <div>
              <Link href="/" className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB]">
                  <span className="text-[11px] font-black text-white">PL</span>
                </div>
                <span className="text-sm font-black text-white">Payout Lite</span>
              </Link>
              <p className="mt-2 text-xs text-slate-500">Built for Nomba Hackathon Build Track</p>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-2">
              {[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Invoices", href: "/invoices" },
                { label: "Website Button", href: "/website-button" },
                { label: "Shop QR", href: "/shop-qr" },
                { label: "AI CFO", href: "/ai-cfo" },
              ].map((l) => (
                <Link key={l.label} href={l.href}
                  className="text-xs text-slate-400 transition hover:text-white">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-2 border-t border-white/[0.06] pt-7 sm:flex-row">
            <p className="text-xs text-slate-600">© 2026 Payout Lite</p>
            <p className="text-xs text-slate-600">Powered by Nomba checkout infrastructure.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
