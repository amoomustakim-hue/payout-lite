"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight, ChevronDown, Check, Zap, FileText,
  Sparkles, Menu, X, Landmark, TrendingUp, Copy,
  QrCode, BarChart3, Code2, Receipt, Shield, Bot,
  Users, Clock, CheckCircle2, Server,
} from "lucide-react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const B = "#256BFF";   // payout blue
const N = "#0B1736";   // deep navy
const M = "#5C6B85";   // muted text
const BR = "#DCE6F5";  // border
const SB = "#F4F8FF";  // soft blue bg
const LG = "#F7F9FC";  // light gray
const GR = "#16C784";  // green
const AM = "#F5A623";  // amber

// ─── Fade-in wrapper ─────────────────────────────────────────────────────────
function FadeIn({
  children, delay = 0, className = "", from = "bottom",
}: {
  children: React.ReactNode; delay?: number; className?: string;
  from?: "bottom" | "left" | "right";
}) {
  const initial = from === "left" ? { opacity: 0, x: -28 }
    : from === "right" ? { opacity: 0, x: 28 }
    : { opacity: 0, y: 20 };
  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
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
      <div className="relative overflow-hidden rounded-[2.6rem] bg-[#0A0A0A] shadow-[0_40px_80px_-12px_rgba(0,0,0,0.28),0_0_0_1px_rgba(255,255,255,0.08)]" style={{ padding: 9 }}>
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

// ─── Browser frame ────────────────────────────────────────────────────────────
function BrowserFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 20px 60px rgba(11,23,54,.12)", border: `1px solid ${BR}`, overflow: "hidden" }}>
      <div style={{ background: LG, padding: "10px 14px", display: "flex", alignItems: "center", gap: 6, borderBottom: `1px solid ${BR}` }}>
        <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#E5484D" }} />
        <div style={{ width: 9, height: 9, borderRadius: "50%", background: AM }} />
        <div style={{ width: 9, height: 9, borderRadius: "50%", background: GR }} />
      </div>
      {children}
    </div>
  );
}

// ─── Phone screens ────────────────────────────────────────────────────────────
function InvoiceScreen() {
  return (
    <div className="bg-[#F4F8FF] p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-bold" style={{ color: N }}>Invoice</span>
        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[9px] font-bold text-amber-600">Pending</span>
      </div>
      <div className="mb-3 rounded-xl bg-white p-3 shadow-sm">
        <p className="text-[8px] font-medium uppercase tracking-wide text-slate-400">Bill to</p>
        <p className="mt-0.5 text-[11px] font-bold" style={{ color: N }}>Chukwuma Electronics</p>
        <div className="mt-3 border-t border-slate-100 pt-2.5">
          <div className="mb-1 flex justify-between text-[9px]">
            <span className="text-slate-400">Web design</span>
            <span className="font-semibold" style={{ color: N }}>₦35,000</span>
          </div>
          <div className="flex justify-between text-[9px]">
            <span className="text-slate-400">Logo pack</span>
            <span className="font-semibold" style={{ color: N }}>₦10,000</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2.5">
            <span className="text-[9px] font-semibold text-slate-500">Total</span>
            <span className="text-sm font-black" style={{ color: N }}>₦45,000</span>
          </div>
        </div>
      </div>
      <div className="mb-3 rounded-xl p-2.5" style={{ background: B }}>
        <p className="text-[8px] text-blue-200">Payment link</p>
        <p className="mt-0.5 truncate text-[9px] font-medium text-white">payoutlite.app/pay/…</p>
      </div>
      <div className="flex gap-2">
        <button className="flex flex-1 items-center justify-center gap-1 rounded-xl py-2 text-[9px] font-bold text-white" style={{ background: N }}>
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

function QRScreen() {
  return (
    <div className="flex flex-col items-center bg-white p-5">
      <p className="mb-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-400">Shop QR</p>
      <p className="mb-4 text-[12px] font-black" style={{ color: N }}>Ada Stores</p>
      <div className="mb-4 flex h-[148px] w-[148px] items-center justify-center rounded-2xl p-3" style={{ border: `3px solid ${B}`, background: SB }}>
        <div className="grid grid-cols-7 gap-[2px]">
          {Array.from({ length: 49 }).map((_, i) => {
            const on = [0,1,2,3,4,5,6,7,13,14,20,21,27,28,34,35,41,42,43,44,45,46,48,8,12,22,26,36,40,15,19,29,33,9,11,23,25,37,39,16,18,30,32].includes(i);
            return <div key={i} className={`h-[9px] w-[9px] rounded-[2px]`} style={{ background: on ? N : "transparent" }} />;
          })}
        </div>
      </div>
      <p className="mb-4 text-center text-[9px] leading-relaxed text-slate-400">
        Scan to pay any amount<br />directly to Ada Stores
      </p>
      <button className="mb-2 w-full rounded-xl py-2 text-[9px] font-bold text-white" style={{ background: B }}>Share QR code</button>
      <button className="w-full rounded-xl border border-slate-200 py-2 text-[9px] font-medium text-slate-500">Download PNG</button>
      <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2">
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        <p className="text-[8px] font-medium text-emerald-700">₦3,500 received · 2 min ago</p>
      </div>
    </div>
  );
}

function AICFOScreen() {
  return (
    <div className="flex h-full flex-col bg-[#F4F8FF]">
      <div className="border-b border-slate-100 bg-white px-3.5 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full" style={{ background: B }}>
            <Sparkles size={11} className="text-white" />
          </div>
          <div>
            <p className="text-[10px] font-bold" style={{ color: N }}>AI CFO</p>
            <p className="text-[8px] text-emerald-500">● Groq · Online</p>
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-2.5 overflow-hidden p-3.5">
        <div className="flex justify-end">
          <div className="max-w-[80%] rounded-2xl rounded-tr-sm px-3 py-2 text-[9px] text-white" style={{ background: B }}>
            How much did I make today?
          </div>
        </div>
        <div className="flex justify-start gap-1.5">
          <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50">
            <Sparkles size={9} style={{ color: B }} />
          </div>
          <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-slate-100 bg-white px-3 py-2 text-[9px] leading-relaxed shadow-sm" style={{ color: N }}>
            You collected <strong>₦115,000</strong> today from 4 confirmed payments. Website Button is your top source.
          </div>
        </div>
        <div className="flex justify-end">
          <div className="max-w-[80%] rounded-2xl rounded-tr-sm px-3 py-2 text-[9px] text-white" style={{ background: B }}>
            Any unpaid invoices?
          </div>
        </div>
        <div className="flex justify-start gap-1.5">
          <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50">
            <Sparkles size={9} style={{ color: B }} />
          </div>
          <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-slate-100 bg-white px-3 py-2 text-[9px] leading-relaxed shadow-sm" style={{ color: N }}>
            <strong>3 invoices</strong> pending totalling ₦72,000. Oldest is 4 days overdue.
          </div>
        </div>
      </div>
      <div className="border-t border-slate-100 bg-white p-3">
        <div className="flex items-center gap-1.5 rounded-xl bg-slate-50 px-3 py-2">
          <span className="flex-1 text-[9px] text-slate-400">Ask about your payments…</span>
          <div className="flex h-5 w-5 items-center justify-center rounded-full" style={{ background: B }}>
            <ArrowRight size={8} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: Code2, title: "Website Payment Button", desc: "Add a hosted payment button to any website and start accepting payments in minutes — no code required." },
  { icon: Receipt, title: "Invoice & Payment Links", desc: "Create professional invoices and share payment links via email or WhatsApp. Customers pay with one click." },
  { icon: QrCode, title: "Shop QR Code", desc: "Generate a QR code for your store. Walk-in customers scan, enter an amount, and pay instantly." },
  { icon: Landmark, title: "Virtual Bank Account", desc: "Get a dedicated Nomba bank account. Customers send transfers and payments reconcile automatically." },
  { icon: Sparkles, title: "AI CFO Insights", desc: "Ask your AI CFO anything about your business — revenue trends, top customers, payment patterns." },
  { icon: BarChart3, title: "Unified Dashboard", desc: "Track all payment channels in one place. See totals, transactions, and statuses in real time." },
];

const STEPS = [
  { n: "1", title: "Create your account", desc: "Sign up in 30 seconds. No credit card, no paperwork required." },
  { n: "2", title: "Set up your business", desc: "Add your business name, email, and Nomba credentials to activate payments." },
  { n: "3", title: "Share your payment link", desc: "Create an invoice, generate a QR code, or embed a button on your website." },
  { n: "4", title: "Get paid & track it all", desc: "Payments are confirmed by webhook and appear in your dashboard instantly." },
];

const BENEFITS = [
  { icon: Zap, title: "5-Minute Setup", desc: "Sign up, set up your business profile, and start accepting payments — no developer needed." },
  { icon: Shield, title: "Webhook-Verified Payments", desc: "Every payment is confirmed by Nomba's webhook, not just a redirect. No false positives." },
  { icon: Bot, title: "AI-Powered Decisions", desc: "Ask your AI CFO questions about your business in plain English and get instant answers." },
  { icon: Users, title: "Multi-Channel Collection", desc: "Invoices, QR, website button, and bank transfer — all in one dashboard with no switching." },
];

const PRICING_FEATURES = [
  "Invoice payments with auto email delivery",
  "Shop QR code for walk-in customers",
  "Website payment button (embeddable)",
  "Dedicated virtual bank account",
  "Real-time transaction dashboard",
  "AI CFO for business insights",
  "Webhook-verified payment confirmations",
  "Progressive Web App (install on mobile)",
];

const FAQS = [
  {
    q: "What is Payout Lite?",
    a: "Payout Lite is a payment management platform for Nigerian small businesses. It lets you accept payments via website buttons, invoices, QR codes, and virtual bank accounts — all tracked in one dashboard with AI-powered insights.",
  },
  {
    q: "Is Payout Lite using Nomba?",
    a: "Yes. All payment checkout flows are powered by Nomba infrastructure. When a customer pays, Nomba sends an HMAC-verified webhook to Payout Lite, and the payment status updates server-side — not from a redirect URL that can be faked.",
  },
  {
    q: "Can customers pay without creating an account?",
    a: "Yes. All public payment routes — invoice links, shop QR, and website buttons — are fully accessible without any account or login. Only the merchant dashboard requires sign-in.",
  },
  {
    q: "What payment methods does it support?",
    a: "Payout Lite supports card payments, bank transfers, and mobile banking — all through Nomba Checkout. 50+ Nigerian banks are supported.",
  },
  {
    q: "What does the AI CFO do?",
    a: "The AI CFO analyses your real transaction and invoice data to answer questions like 'How much did I make this week?' or 'Which channel brings the most revenue?' — powered by Groq.",
  },
  {
    q: "Is there a setup fee?",
    a: "No. Payout Lite is completely free to start. You only pay Nomba's standard processing fee when you receive payments.",
  },
  {
    q: "How does webhook confirmation work?",
    a: "When a Nomba payment is completed, Nomba sends a signed event to Payout Lite's webhook endpoint. The signature is verified with HMAC-SHA256 before the payment status moves from pending to paid — only genuine Nomba events can change a payment's status.",
  },
  {
    q: "Is AI CFO giving financial advice?",
    a: "No. AI CFO provides payment insights grounded in your actual transaction data. It is not financial, tax, or legal advice.",
  },
];

// ─── Main component ───────────────────────────────────────────────────────────
export function LandingPage({ isSignedIn }: { isSignedIn: boolean }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dashboardHref = isSignedIn ? "/dashboard" : "/sign-up";
  const signInHref = isSignedIn ? "/dashboard" : "/sign-in";

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "AI CFO", href: "#ai-cfo" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <div style={{ fontFamily: "var(--font-plus-jakarta, inherit)", color: N, background: "#fff", overflowX: "hidden" }}>

      {/* ── NAVBAR ──────────────────────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "sticky", top: 0, zIndex: 1000,
          background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)",
          boxShadow: "0 1px 10px rgba(11,23,54,0.05)", padding: "0",
          borderBottom: `1px solid ${BR}`,
        }}
      >
        <div className="mx-auto max-w-[1200px] px-6 flex items-center justify-between" style={{ height: 68 }}>
          <Link href="/" style={{ fontWeight: 800, fontSize: 22, color: N, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: B, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 900, color: "#fff" }}>PL</span>
            </div>
            Payout <span style={{ color: B }}>Lite</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map(l => (
              <a key={l.label} href={l.href} style={{ fontSize: 15, fontWeight: 500, color: M, transition: "color .2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = B)}
                onMouseLeave={e => (e.currentTarget.style.color = M)}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href={signInHref} style={{
              padding: "9px 22px", borderRadius: 8, fontWeight: 600, fontSize: 14,
              border: `1px solid ${BR}`, color: N, background: "transparent", transition: "all .2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = B; e.currentTarget.style.color = B; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = BR; e.currentTarget.style.color = N; }}>
              {isSignedIn ? "Dashboard" : "Sign In"}
            </Link>
            <Link href={dashboardHref} style={{
              padding: "9px 22px", borderRadius: 8, fontWeight: 700, fontSize: 14,
              background: B, color: "#fff", transition: "all .2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#1a5ce6"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = B; e.currentTarget.style.transform = "none"; }}>
              Get Started
            </Link>
          </div>

          <button className="md:hidden" onClick={() => setMobileMenuOpen(o => !o)}
            style={{ background: "none", border: `1px solid ${BR}`, borderRadius: 8, color: N, padding: "6px 8px", display: "flex", alignItems: "center" }}>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              style={{ borderTop: `1px solid ${BR}`, background: "#fff", overflow: "hidden" }}
            >
              <div className="px-6 py-4 flex flex-col gap-3">
                {navLinks.map(l => (
                  <a key={l.label} href={l.href} onClick={() => setMobileMenuOpen(false)}
                    style={{ fontSize: 15, fontWeight: 500, color: M }}>{l.label}</a>
                ))}
                <Link href={signInHref} style={{ fontWeight: 600, fontSize: 15, color: N }}>{isSignedIn ? "Dashboard" : "Sign In"}</Link>
                <Link href={dashboardHref} style={{
                  padding: "11px 0", borderRadius: 8, fontWeight: 700, fontSize: 15,
                  background: B, color: "#fff", textAlign: "center",
                }}>Get Started</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 0 100px", background: `linear-gradient(180deg, #fff 0%, ${SB} 100%)` }}>
        <div className="mx-auto max-w-[1200px] px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 text-center lg:text-left"
          >
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: SB, border: `1px solid ${BR}`, borderRadius: 100,
                padding: "6px 14px", fontSize: 13, fontWeight: 600, color: B, marginBottom: 20,
              }}>
              <Zap size={12} />
              Nomba-powered payment hub
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontSize: "clamp(34px,5vw,56px)", fontWeight: 800, lineHeight: 1.12,
                letterSpacing: "-0.02em", marginBottom: 20, color: N,
              }}
            >
              Accept Payments.{" "}<br className="hidden sm:block" />
              Send Invoices.{" "}<br className="hidden sm:block" />
              Grow <span style={{ color: B }}>Smarter</span>.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ fontSize: 17, color: M, marginBottom: 36, maxWidth: 480, lineHeight: 1.7 }}
              className="mx-auto lg:mx-0"
            >
              Payout Lite helps merchants accept payments through website buttons, invoices, QR codes, and unique accounts — tracked in one dashboard with AI-powered insights.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-5"
            >
              <Link href={dashboardHref}
                className="group flex items-center justify-center gap-2"
                style={{ padding: "13px 28px", borderRadius: 8, fontWeight: 700, fontSize: 16, background: B, color: "#fff", transition: "all .2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#1a5ce6"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = B; e.currentTarget.style.transform = "none"; }}>
                Get Started
                <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </Link>
              <a href="#how-it-works"
                style={{ padding: "13px 28px", borderRadius: 8, fontWeight: 600, fontSize: 16, color: B, border: `1px solid ${B}`, background: "transparent", textAlign: "center", transition: "all .2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = SB; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                See How It Works
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="flex items-center justify-center lg:justify-start gap-2"
              style={{ fontSize: 13, color: M }}
            >
              <Shield size={14} color={B} />
              <span>Fast, simple, secure payments. Powered by Nomba.</span>
            </motion.div>
          </motion.div>

          {/* Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 w-full max-w-[540px]"
          >
            <BrowserFrame>
              <div className="flex" style={{ minHeight: 380 }}>
                {/* Sidebar */}
                <div style={{ width: 56, background: N, padding: "18px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                  {[
                    { icon: BarChart3, active: true },
                    { icon: FileText },
                    { icon: QrCode },
                    { icon: Code2 },
                    { icon: Landmark },
                    { icon: Sparkles },
                  ].map(({ icon: Icon, active }, i) => (
                    <div key={i} style={{ width: 28, height: 28, borderRadius: 6, background: active ? B : "rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={12} color="#fff" />
                    </div>
                  ))}
                </div>
                {/* Main */}
                <div style={{ flex: 1, padding: 16 }}>
                  <div className="grid grid-cols-2 gap-2.5 mb-3">
                    {[
                      { label: "Total Revenue", value: "₦1,245,800", delta: "↑ 18%", color: GR },
                      { label: "Payments", value: "156", delta: "↑ 12%", color: GR },
                    ].map(c => (
                      <div key={c.label} style={{ background: LG, borderRadius: 10, padding: 12 }}>
                        <div style={{ fontSize: 10, color: M, marginBottom: 4, fontWeight: 500 }}>{c.label}</div>
                        <div style={{ fontSize: 17, fontWeight: 800, color: N }}>{c.value}</div>
                        <div style={{ fontSize: 10, color: c.color, marginTop: 3, fontWeight: 600 }}>{c.delta} this week</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: LG, borderRadius: 10, padding: 12 }}>
                    <div style={{ fontSize: 10, color: M, marginBottom: 8, fontWeight: 500 }}>Recent Transactions</div>
                    {[
                      { icon: FileText, color: B, name: "Invoice #1024", time: "Today, 2:45 PM", amount: "+₦45,000" },
                      { icon: QrCode, color: GR, name: "QR Payment", time: "Today, 1:30 PM", amount: "+₦12,500" },
                      { icon: Landmark, color: AM, name: "Bank Transfer", time: "Yesterday", amount: "+₦78,000" },
                    ].map(row => (
                      <div key={row.name} className="flex items-center justify-between" style={{ padding: "6px 0", borderBottom: `1px solid ${BR}` }}>
                        <div className="flex items-center gap-2">
                          <div style={{ width: 24, height: 24, borderRadius: 5, background: row.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <row.icon size={10} color="#fff" />
                          </div>
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 600, color: N }}>{row.name}</div>
                            <div style={{ fontSize: 9, color: M }}>{row.time}</div>
                          </div>
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: GR }}>{row.amount}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </BrowserFrame>
          </motion.div>
        </div>
      </section>

      {/* ── TRUST BAR ───────────────────────────────────────────────────────── */}
      <div style={{ background: "#fff", padding: "28px 0", borderBottom: `1px solid ${BR}` }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {[
              { icon: Zap, label: "Fast Setup" },
              { icon: Shield, label: "Secure Payments" },
              { icon: Receipt, label: "Easy Invoicing" },
              { icon: QrCode, label: "QR Payments" },
              { icon: Sparkles, label: "AI Insights" },
              { icon: Server, label: "Nomba-Powered" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 justify-center lg:justify-start" style={{ fontSize: 13, fontWeight: 500, color: M }}>
                <Icon size={16} color={B} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURES ────────────────────────────────────────────────────────── */}
      <section id="features" style={{ padding: "100px 0", background: "#fff" }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <FadeIn className="text-center mb-14">
            <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 16, color: N }}>
              Everything You Need to Get Paid
            </h2>
            <p style={{ fontSize: 18, color: M, maxWidth: 600, margin: "0 auto", lineHeight: 1.7 }}>
              Payout Lite provides all the tools small businesses need to accept payments, track transactions, and make smarter decisions.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 0.06}>
                <div style={{ background: "#fff", border: `1px solid ${BR}`, borderRadius: 16, padding: 30, height: "100%", transition: "all .3s", cursor: "default" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-5px)"; el.style.boxShadow = "0 10px 30px rgba(11,23,54,.08)"; el.style.borderColor = B; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "none"; el.style.boxShadow = "none"; el.style.borderColor = BR; }}>
                  <div style={{ width: 52, height: 52, background: SB, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                    <Icon size={22} color={B} />
                  </div>
                  <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 10, color: N, letterSpacing: "-0.01em" }}>{title}</h3>
                  <p style={{ fontSize: 14, color: M, lineHeight: 1.65 }}>{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT SHOWCASE ─────────────────────────────────────────────────── */}
      <section style={{ padding: "100px 0", background: SB }}>
        <div className="mx-auto max-w-[1200px] px-6 flex flex-col gap-24">

          {/* Invoice */}
          <div className="flex flex-col lg:flex-row items-center gap-14">
            <FadeIn from="left" className="flex-1">
              <h2 style={{ fontSize: "clamp(26px,3.5vw,38px)", fontWeight: 800, marginBottom: 18, letterSpacing: "-0.02em", color: N }}>
                Create & Send Invoices in Seconds
              </h2>
              <p style={{ fontSize: 16, color: M, marginBottom: 22, lineHeight: 1.7 }}>
                Fill in customer name, email, amount — we generate a branded payment link, email it automatically, and update status the moment they pay.
              </p>
              <ul style={{ listStyle: "none", padding: 0, marginBottom: 30 }}>
                {["Automatic email delivery via Resend", "Unique payment link per invoice", "Webhook-confirmed PAID status", "Due date tracking & overdue alerts"].map(t => (
                  <li key={t} className="flex items-start gap-3 mb-3" style={{ fontSize: 15, fontWeight: 500, color: N }}>
                    <CheckCircle2 size={17} color={B} style={{ marginTop: 2, flexShrink: 0 }} />
                    {t}
                  </li>
                ))}
              </ul>
              <Link href={dashboardHref}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 26px", borderRadius: 8, fontWeight: 700, fontSize: 15, background: B, color: "#fff" }}
                className="group"
                onMouseEnter={e => { e.currentTarget.style.background = "#1a5ce6"; }}
                onMouseLeave={e => { e.currentTarget.style.background = B; }}>
                Create your first invoice
                <ArrowRight size={15} className="transition group-hover:translate-x-1" />
              </Link>
            </FadeIn>
            <FadeIn from="right" className="flex-1 w-full max-w-[460px]">
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}>
                <PhoneFrame><InvoiceScreen /></PhoneFrame>
              </motion.div>
            </FadeIn>
          </div>

          {/* QR */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-14">
            <FadeIn from="right" className="flex-1">
              <h2 style={{ fontSize: "clamp(26px,3.5vw,38px)", fontWeight: 800, marginBottom: 18, letterSpacing: "-0.02em", color: N }}>
                Accept Walk-In Payments with QR
              </h2>
              <p style={{ fontSize: 16, color: M, marginBottom: 22, lineHeight: 1.7 }}>
                Display your QR code at your shop. Customers scan, enter the amount they owe, and complete payment in under a minute — no POS terminal required.
              </p>
              <ul style={{ listStyle: "none", padding: 0, marginBottom: 30 }}>
                {["Instant QR code generation", "Customer enters any amount", "No hardware or POS machine needed", "Works on any smartphone camera"].map(t => (
                  <li key={t} className="flex items-start gap-3 mb-3" style={{ fontSize: 15, fontWeight: 500, color: N }}>
                    <CheckCircle2 size={17} color={B} style={{ marginTop: 2, flexShrink: 0 }} />
                    {t}
                  </li>
                ))}
              </ul>
              <Link href={dashboardHref}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 26px", borderRadius: 8, fontWeight: 700, fontSize: 15, background: B, color: "#fff" }}
                className="group"
                onMouseEnter={e => { e.currentTarget.style.background = "#1a5ce6"; }}
                onMouseLeave={e => { e.currentTarget.style.background = B; }}>
                Generate your QR code
                <ArrowRight size={15} className="transition group-hover:translate-x-1" />
              </Link>
            </FadeIn>
            <FadeIn from="left" className="flex-1 w-full max-w-[320px]">
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 0.5 }}>
                <PhoneFrame><QRScreen /></PhoneFrame>
              </motion.div>
            </FadeIn>
          </div>

          {/* AI CFO */}
          <div className="flex flex-col lg:flex-row items-center gap-14">
            <FadeIn from="left" className="flex-1">
              <h2 style={{ fontSize: "clamp(26px,3.5vw,38px)", fontWeight: 800, marginBottom: 18, letterSpacing: "-0.02em", color: N }}>
                Your AI CFO Understands Your Money
              </h2>
              <p style={{ fontSize: 16, color: M, marginBottom: 22, lineHeight: 1.7 }}>
                Ask anything about your business in plain English. Your AI CFO analyses your real payment data and gives instant, accurate answers — powered by Groq.
              </p>
              <ul style={{ listStyle: "none", padding: 0, marginBottom: 30 }}>
                {["Revenue analysis by channel", "Identify unpaid invoices instantly", "Cash flow & trend summaries", "No spreadsheets, no manual reports"].map(t => (
                  <li key={t} className="flex items-start gap-3 mb-3" style={{ fontSize: 15, fontWeight: 500, color: N }}>
                    <CheckCircle2 size={17} color={B} style={{ marginTop: 2, flexShrink: 0 }} />
                    {t}
                  </li>
                ))}
              </ul>
              <Link href="/ai-cfo"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 26px", borderRadius: 8, fontWeight: 700, fontSize: 15, background: B, color: "#fff" }}
                className="group"
                onMouseEnter={e => { e.currentTarget.style.background = "#1a5ce6"; }}
                onMouseLeave={e => { e.currentTarget.style.background = B; }}>
                Ask your AI CFO
                <ArrowRight size={15} className="transition group-hover:translate-x-1" />
              </Link>
            </FadeIn>
            <FadeIn from="right" className="flex-1 w-full max-w-[320px]">
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}>
                <PhoneFrame><AICFOScreen /></PhoneFrame>
              </motion.div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: "100px 0", background: "#fff" }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <FadeIn className="text-center mb-14">
            <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 16, color: N }}>
              Up and Running in 4 Steps
            </h2>
            <p style={{ fontSize: 18, color: M, maxWidth: 600, margin: "0 auto", lineHeight: 1.7 }}>
              From sign-up to first payment — it takes less than 5 minutes.
            </p>
          </FadeIn>
          <div className="relative">
            <div className="hidden lg:block absolute" style={{ top: 40, left: "12%", right: "12%", height: 2, background: BR }} />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {STEPS.map(({ n, title, desc }, i) => (
                <FadeIn key={n} delay={i * 0.1} className="flex flex-col items-center text-center">
                  <div style={{ width: 80, height: 80, background: "#fff", border: `2px solid ${B}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: B, marginBottom: 20, position: "relative", zIndex: 1 }}>
                    {n}
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: N }}>{title}</h3>
                  <p style={{ fontSize: 14, color: M, lineHeight: 1.6 }}>{desc}</p>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── AI CFO DARK SECTION ─────────────────────────────────────────────── */}
      <section id="ai-cfo" style={{ padding: "100px 0", background: N, color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-50%", left: "-20%", width: "70%", height: "200%", background: `radial-gradient(ellipse, rgba(37,107,255,.15) 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-50%", right: "-20%", width: "60%", height: "200%", background: `radial-gradient(ellipse, rgba(37,107,255,.08) 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div className="mx-auto max-w-[1200px] px-6 relative">
          <FadeIn className="text-center mb-14">
            <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 16, color: "#fff" }}>
              Meet Your AI CFO
            </h2>
            <p style={{ fontSize: 18, color: "rgba(255,255,255,.65)", maxWidth: 600, margin: "0 auto", lineHeight: 1.7 }}>
              Ask anything about your business in plain English. Your AI CFO analyses your real payment data and gives instant answers.
            </p>
          </FadeIn>
          <div className="flex flex-col lg:flex-row gap-14 items-center">
            <FadeIn from="left" className="flex-1 flex flex-col gap-6">
              {[
                { icon: TrendingUp, title: "Revenue Analysis", desc: "Ask 'How much did I make this month?' and get a breakdown by payment channel instantly." },
                { icon: Users, title: "Customer Insights", desc: "Identify your top customers and see which ones have unpaid invoices waiting." },
                { icon: Clock, title: "Cash Flow Forecasting", desc: "Understand your pending vs confirmed revenue to make smarter decisions." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <div style={{ width: 46, height: 46, background: "rgba(37,107,255,.2)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={19} color={B} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: 17, fontWeight: 700, marginBottom: 5, color: "#fff" }}>{title}</h4>
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,.6)", lineHeight: 1.6 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </FadeIn>
            <FadeIn from="right" className="flex-1 w-full max-w-[460px]">
              <div style={{ background: "rgba(255,255,255,.05)", borderRadius: 16, border: "1px solid rgba(255,255,255,.1)", padding: 24, backdropFilter: "blur(10px)" }}>
                <div className="flex items-center gap-3 mb-5">
                  <div style={{ width: 40, height: 40, background: SB, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Sparkles size={18} color={B} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: "#fff" }}>AI CFO</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)" }}>Powered by Groq · Llama 3.3</div>
                  </div>
                </div>
                <div style={{ background: "rgba(255,255,255,.05)", borderRadius: 10, padding: 16, borderLeft: `4px solid ${B}`, marginBottom: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 5 }}>Weekly Revenue Summary</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: B, marginBottom: 8 }}>₦1,245,800</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", lineHeight: 1.5 }}>Up 18% from last week. Invoice payments lead at 62%, followed by QR at 23% and bank transfers at 15%.</div>
                </div>
                <div style={{ background: "rgba(255,255,255,.05)", borderRadius: 10, padding: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", marginBottom: 10 }}>AI Suggestions</div>
                  {[
                    "Send reminders to 3 customers with overdue invoices — ₦285,000 pending.",
                    "QR payments are growing — consider printing a larger code for your storefront.",
                    "Your busiest payment day is Friday. Schedule promotions accordingly.",
                  ].map((s, i) => (
                    <div key={i} className="flex items-start gap-3 mb-3" style={{ fontSize: 12, color: "rgba(255,255,255,.55)", lineHeight: 1.5 }}>
                      <div style={{ width: 18, height: 18, background: B, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                        <span style={{ color: "#fff", fontSize: 9, fontWeight: 800 }}>{i + 1}</span>
                      </div>
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── WHY PAYOUT LITE ─────────────────────────────────────────────────── */}
      <section style={{ padding: "100px 0", background: "#fff" }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <FadeIn className="text-center mb-14">
            <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 16, color: N }}>
              Why Choose Payout Lite?
            </h2>
            <p style={{ fontSize: 18, color: M, maxWidth: 600, margin: "0 auto", lineHeight: 1.7 }}>
              Built specifically for Nigerian small businesses — fast, affordable, and powerful.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {BENEFITS.map(({ icon: Icon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 0.08}>
                <div className="flex items-start gap-5"
                  style={{ background: SB, borderRadius: 16, padding: 30, height: "100%", transition: "all .3s", cursor: "default" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-3px)"; el.style.boxShadow = `0 8px 24px rgba(37,107,255,.08)`; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "none"; el.style.boxShadow = "none"; }}>
                  <div style={{ width: 46, height: 46, background: "#fff", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 8px rgba(37,107,255,.1)" }}>
                    <Icon size={19} color={B} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 7, color: N }}>{title}</h3>
                    <p style={{ fontSize: 14, color: M, lineHeight: 1.65 }}>{desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAND ───────────────────────────────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${BR}`, borderBottom: `1px solid ${BR}`, background: SB, padding: "60px 0" }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid gap-10 text-center sm:grid-cols-3">
            {[
              { value: "5", label: "Payment channels", sub: "Invoice · QR · Button · Account · Webhook" },
              { value: "50+", label: "Banks supported", sub: "Via Nomba infrastructure" },
              { value: "100%", label: "Webhook-confirmed", sub: "HMAC-SHA256 verified — no false positives" },
            ].map(({ value, label, sub }, i) => (
              <FadeIn key={label} delay={i * 0.1}>
                <p style={{ fontSize: "clamp(44px,7vw,60px)", fontWeight: 800, color: N, letterSpacing: "-0.03em" }}>{value}</p>
                <p style={{ marginTop: 6, fontSize: 14, fontWeight: 600, color: N }}>{label}</p>
                <p style={{ marginTop: 3, fontSize: 12, color: M }}>{sub}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* ── PRICING ─────────────────────────────────────────────────────────── */}
      <section id="pricing" style={{ padding: "100px 0", background: "#fff" }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <FadeIn className="text-center mb-4">
            <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 16, color: N }}>
              Simple, Transparent Pricing
            </h2>
            <p style={{ fontSize: 18, color: M, maxWidth: 600, margin: "0 auto", lineHeight: 1.7 }}>
              No monthly fees. No hidden charges. You only pay Nomba&apos;s standard processing fee when you receive payments.
            </p>
          </FadeIn>
          <div style={{ maxWidth: 480, margin: "56px auto 0", background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 20px 60px rgba(11,23,54,.1)", border: `1px solid ${BR}` }}>
            <div style={{ background: B, padding: "28px 32px", textAlign: "center", color: "#fff" }}>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Free Forever Plan</h3>
              <p style={{ fontSize: 14, opacity: 0.9 }}>Everything you need to run your payment operations</p>
            </div>
            <div style={{ padding: 32 }}>
              <div className="text-center mb-7">
                <span style={{ fontSize: 22, fontWeight: 600, color: N, verticalAlign: "top", lineHeight: 1.5 }}>₦</span>
                <span style={{ fontSize: 54, fontWeight: 800, color: N, letterSpacing: "-0.03em" }}>0</span>
                <span style={{ fontSize: 15, color: M }}> / month</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, marginBottom: 28 }}>
                {PRICING_FEATURES.map(f => (
                  <li key={f} className="flex items-center gap-3 mb-3" style={{ fontSize: 14, fontWeight: 500, color: N }}>
                    <Check size={16} color={B} style={{ flexShrink: 0 }} strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={dashboardHref}
                style={{ display: "block", width: "100%", padding: "13px 0", background: B, color: "#fff", textAlign: "center", borderRadius: 8, fontWeight: 700, fontSize: 15, transition: "background .2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#1a5ce6"; }}
                onMouseLeave={e => { e.currentTarget.style.background = B; }}>
                Start for Free →
              </Link>
            </div>
          </div>
          <p className="text-center mt-5" style={{ fontSize: 13, color: M }}>
            Nomba processing fees apply per transaction. No subscription. No credit card required.
          </p>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <section id="faq" style={{ padding: "100px 0", background: SB }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <FadeIn className="text-center mb-14">
            <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 16, color: N }}>
              Frequently Asked Questions
            </h2>
            <p style={{ fontSize: 18, color: M, maxWidth: 600, margin: "0 auto", lineHeight: 1.7 }}>
              Everything you need to know before getting started.
            </p>
          </FadeIn>
          <div style={{ maxWidth: 800, margin: "0 auto", background: "#fff", borderRadius: 16, border: `1px solid ${BR}`, padding: "0 32px" }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ borderBottom: i < FAQS.length - 1 ? `1px solid ${BR}` : "none" }}>
                <button className="w-full flex items-center justify-between gap-4 text-left"
                  style={{ padding: "22px 0", background: "none", border: "none", cursor: "pointer" }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: openFaq === i ? B : N, transition: "color .2s" }}>{faq.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.22 }} style={{ flexShrink: 0 }}>
                    <ChevronDown size={17} color={B} />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <p style={{ paddingBottom: 22, fontSize: 14, color: M, lineHeight: 1.7 }}>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section style={{ padding: "100px 0", background: "#fff" }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <FadeIn>
            <div style={{
              background: `linear-gradient(135deg, ${B} 0%, #1a5ce6 100%)`,
              borderRadius: 24, padding: "clamp(48px,8vw,80px) clamp(24px,6vw,60px)",
              textAlign: "center", color: "#fff", position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: "-50%", left: "-20%", width: "70%", height: "200%", background: "radial-gradient(ellipse, rgba(255,255,255,.1) 0%, transparent 70%)", pointerEvents: "none" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 800, marginBottom: 14, letterSpacing: "-0.02em" }}>
                  Ready to Get Paid Faster?
                </h2>
                <p style={{ fontSize: 17, opacity: 0.9, marginBottom: 36, maxWidth: 580, marginLeft: "auto", marginRight: "auto", lineHeight: 1.7 }}>
                  Join merchants already using Payout Lite to accept payments, send invoices, and grow smarter. Free to start, forever.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href={dashboardHref}
                    style={{ padding: "13px 34px", borderRadius: 8, fontWeight: 700, fontSize: 16, background: "#fff", color: B, display: "inline-block", transition: "all .2s" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}>
                    Get Started for Free
                  </Link>
                  <a href="#how-it-works"
                    style={{ padding: "13px 34px", borderRadius: 8, fontWeight: 600, fontSize: 16, color: "#fff", border: "1px solid rgba(255,255,255,.3)", background: "transparent", display: "inline-block" }}>
                    See How It Works
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer style={{ background: N, color: "#fff", padding: "72px 0 36px" }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div>
              <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: 7, background: B, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 10, fontWeight: 900, color: "#fff" }}>PL</span>
                </div>
                Payout <span style={{ color: B }}>Lite</span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,.55)", marginBottom: 20, lineHeight: 1.65, maxWidth: 260 }}>
                The simplest way for Nigerian small businesses to accept payments, send invoices, and understand their money.
              </p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,.35)" }}>Built for Nomba Hackathon</p>
            </div>

            {[
              {
                title: "Product",
                links: [
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "Invoices", href: "/invoices" },
                  { label: "Shop QR", href: "/shop-qr" },
                  { label: "Website Button", href: "/website-button" },
                  { label: "Unique Account", href: "/unique-account" },
                  { label: "AI CFO", href: "/ai-cfo" },
                ],
              },
              {
                title: "Platform",
                links: [
                  { label: "Features", href: "#features" },
                  { label: "How It Works", href: "#how-it-works" },
                  { label: "Pricing", href: "#pricing" },
                  { label: "FAQ", href: "#faq" },
                ],
              },
              {
                title: "Account",
                links: [
                  { label: "Sign In", href: "/sign-in" },
                  { label: "Get Started", href: "/sign-up" },
                  { label: "Onboarding", href: "/onboarding" },
                ],
              },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: "#fff" }}>{col.title}</h4>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {col.links.map(l => (
                    <li key={l.label} style={{ marginBottom: 10 }}>
                      <Link href={l.href} style={{ fontSize: 13, color: "rgba(255,255,255,.55)", transition: "color .2s" }}
                        onMouseEnter={e => (e.currentTarget.style.color = B)}
                        onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,.55)")}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-7" style={{ borderTop: "1px solid rgba(255,255,255,.08)" }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,.35)" }}>
              © {new Date().getFullYear()} Payout Lite. All rights reserved.
            </p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,.35)" }}>
              Powered by Nomba checkout infrastructure.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
