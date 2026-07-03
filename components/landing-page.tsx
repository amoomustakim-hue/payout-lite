"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useRef } from "react";
import {
  ArrowRight,
  ChevronDown,
  Check,
  Zap,
  Shield,
  Lock,
  Fingerprint,
  Star,
} from "lucide-react";

// ─── Phone frame ───────────────────────────────────────────────────────────────

function PhoneFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative mx-auto w-[240px] sm:w-[270px] ${className}`}>
      <div className="relative overflow-hidden rounded-[2.8rem] bg-[#111] p-[10px] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.35)]">
        <div className="overflow-hidden rounded-[2.2rem] bg-white">
          {/* Dynamic island */}
          <div className="flex justify-center bg-[#111] pb-2 pt-2.5">
            <div className="h-[18px] w-[90px] rounded-full bg-black" />
          </div>
          <div className="min-h-[500px]">{children}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Phone screens ──────────────────────────────────────────────────────────────

function InvoiceScreen() {
  return (
    <div className="bg-[#F8FAFC] p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-bold text-[#0F172A]">New Invoice</span>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-semibold text-amber-600">Draft</span>
      </div>
      <div className="mb-3 rounded-xl bg-white p-3 shadow-sm">
        <p className="text-[9px] text-slate-400">Client</p>
        <p className="text-[11px] font-bold text-[#0F172A]">Ada Stores</p>
        <div className="mt-2 border-t border-slate-100 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-slate-400">Amount due</span>
            <span className="text-sm font-black text-[#0F172A]">₦45,000</span>
          </div>
        </div>
      </div>
      <div className="mb-3 space-y-1.5">
        <p className="text-[9px] font-semibold text-slate-400">ITEMS</p>
        {[
          { item: "Web design", qty: "1×", price: "₦45,000" },
        ].map((l) => (
          <div key={l.item} className="flex items-center justify-between rounded-lg bg-white p-2.5 shadow-sm">
            <div>
              <p className="text-[9px] font-semibold text-[#0F172A]">{l.item}</p>
              <p className="text-[8px] text-slate-400">{l.qty}</p>
            </div>
            <span className="text-[10px] font-semibold text-[#0F172A]">{l.price}</span>
          </div>
        ))}
      </div>
      <div className="mb-2 rounded-xl bg-[#2563EB] p-3 text-white">
        <p className="text-[9px] text-blue-200">Payment link</p>
        <p className="mt-0.5 text-[9px] font-semibold">payout-lite.vercel.app/pay/inv-042</p>
      </div>
      <button className="w-full rounded-xl bg-[#0F172A] py-2.5 text-[10px] font-bold text-white">
        Share link →
      </button>
    </div>
  );
}

function DashboardScreen() {
  return (
    <div className="bg-[#F8FAFC] p-4">
      <div className="mb-3 rounded-xl bg-[#2563EB] p-3 text-white">
        <p className="text-[9px] text-blue-200">Total received</p>
        <p className="text-xl font-black">₦482,000</p>
        <div className="mt-1 flex items-center gap-1">
          <span className="rounded bg-emerald-400/20 px-1.5 py-0.5 text-[8px] font-bold text-emerald-300">▲ +34%</span>
          <span className="text-[8px] text-blue-200">this month</span>
        </div>
        <div className="mt-3 h-10">
          <svg viewBox="0 0 200 30" className="h-full w-full" preserveAspectRatio="none">
            <path d="M0,25 C30,25 40,8 60,12 C80,16 100,20 120,14 C140,8 160,18 180,10 C195,4 200,12 200,8"
              fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      <p className="mb-2 text-[9px] font-semibold text-slate-400">RECENT</p>
      <div className="space-y-1.5">
        {[
          { name: "Invoice #INV-042", sub: "Ada Stores", amount: "+₦45,000", dot: "bg-emerald-500" },
          { name: "QR Walk-in", sub: "Mama Ngozi Foods", amount: "+₦1,500", dot: "bg-emerald-500" },
          { name: "Web button", sub: "Online store", amount: "+₦12,000", dot: "bg-emerald-500" },
        ].map((tx) => (
          <div key={tx.name} className="flex items-center gap-2 rounded-lg bg-white p-2.5 shadow-sm">
            <div className={`h-2 w-2 shrink-0 rounded-full ${tx.dot}`} />
            <div className="flex-1 min-w-0">
              <p className="truncate text-[9px] font-semibold text-[#0F172A]">{tx.name}</p>
              <p className="truncate text-[8px] text-slate-400">{tx.sub}</p>
            </div>
            <span className="text-[10px] font-bold text-emerald-600">{tx.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function QRScreen() {
  return (
    <div className="flex flex-col items-center bg-white p-5">
      <p className="mb-1 text-[10px] text-slate-400">Your shop QR</p>
      <p className="mb-5 text-[12px] font-bold text-[#0F172A]">Mama Ngozi Foods</p>
      <div className="mb-5 flex h-40 w-40 items-center justify-center rounded-2xl border-4 border-[#2563EB] bg-[#F0F7FF] p-3">
        <div className="grid grid-cols-7 gap-0.5">
          {Array.from({ length: 49 }).map((_, i) => {
            const filled = [0,1,2,3,4,5,6,7,13,14,20,21,27,28,34,35,41,42,43,44,45,46,48,8,12,22,26,36,40,15,19,29,33,9,11,23,25,37,39].includes(i);
            return <div key={i} className={`h-3 w-3 rounded-sm ${filled ? "bg-[#0F172A]" : ""}`} />;
          })}
        </div>
      </div>
      <p className="mb-5 text-center text-[9px] leading-relaxed text-slate-400">
        Customers scan this to pay<br />any amount directly to you
      </p>
      <button className="w-full rounded-xl bg-[#2563EB] py-2.5 text-[10px] font-bold text-white">
        Share QR code
      </button>
      <button className="mt-2 w-full rounded-xl border border-slate-200 py-2.5 text-[10px] font-semibold text-slate-500">
        Print / Download
      </button>
    </div>
  );
}

function AICFOScreen() {
  return (
    <div className="flex h-full flex-col bg-[#F8FAFC]">
      <div className="border-b border-slate-100 bg-white p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2563EB]">
            <span className="text-[9px] font-bold text-white">AI</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#0F172A]">AI CFO</p>
            <p className="text-[8px] text-emerald-500">● Online</p>
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-3 overflow-hidden p-3">
        <div className="flex justify-end">
          <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-[#2563EB] px-3 py-2 text-[9px] text-white">
            How much did I make this month?
          </div>
        </div>
        <div className="flex justify-start">
          <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-[9px] leading-relaxed text-[#0F172A] shadow-sm">
            You received <strong>₦482,000</strong> this month, up 34%. Top payer: Ada Stores with ₦120k across 3 invoices.
          </div>
        </div>
        <div className="flex justify-end">
          <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-[#2563EB] px-3 py-2 text-[9px] text-white">
            Best payment channel?
          </div>
        </div>
        <div className="flex justify-start">
          <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-[9px] leading-relaxed text-[#0F172A] shadow-sm">
            Invoices drive <strong>68%</strong> of revenue. Your QR code has the highest conversion at 94%.
          </div>
        </div>
      </div>
      <div className="border-t border-slate-100 bg-white p-3">
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
          <input className="flex-1 bg-transparent text-[9px] outline-none placeholder:text-slate-400" placeholder="Ask about your payments…" readOnly />
          <div className="h-5 w-5 rounded-full bg-[#2563EB]" />
        </div>
      </div>
    </div>
  );
}

// ─── Feature section ────────────────────────────────────────────────────────────

function FeatureSection({
  badge,
  title,
  body,
  checks,
  screen,
  flip = false,
  bg = "bg-white",
}: {
  badge: string;
  title: string;
  body: string;
  checks: string[];
  screen: React.ReactNode;
  flip?: boolean;
  bg?: string;
}) {
  return (
    <div className={`${bg} py-20 lg:py-28`}>
      <div className="mx-auto max-w-6xl px-5">
        <div className={`flex flex-col items-center gap-14 lg:flex-row lg:gap-20 ${flip ? "lg:flex-row-reverse" : ""}`}>
          {/* Text */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: flip ? 40 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="mb-4 inline-block rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-[#2563EB]">
              {badge}
            </span>
            <h2 className="mb-4 text-3xl font-black leading-tight text-[#0F172A] lg:text-4xl">{title}</h2>
            <p className="mb-7 text-base leading-relaxed text-slate-500">{body}</p>
            <ul className="space-y-3">
              {checks.map((c) => (
                <li key={c} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50">
                    <Check size={11} className="text-[#2563EB]" strokeWidth={3} />
                  </span>
                  <span className="text-sm text-slate-600">{c}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Phone */}
          <motion.div
            className="w-full max-w-[300px] flex-shrink-0 lg:w-auto"
            initial={{ opacity: 0, x: flip ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            >
              <PhoneFrame>{screen}</PhoneFrame>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ─── FAQ ────────────────────────────────────────────────────────────────────────

const faqs = [
  { q: "What is Payout Lite?", a: "Payout Lite is a payment hub for small Nigerian businesses. It lets you create invoices, generate QR codes, embed website payment buttons, and receive bank transfers — all confirmed by Nomba webhooks in real time." },
  { q: "How does invoice payment confirmation work?", a: "When a customer pays, Nomba sends an HMAC-verified webhook directly to Payout Lite. Your invoice status updates instantly — not based on a redirect URL that can be faked, but on a cryptographically signed server event." },
  { q: "Is my payment data secure?", a: "Yes. Every webhook is verified with an HMAC-SHA256 signature using your Nomba secret. We never store card data. Authentication is handled by Clerk with biometric and MFA support." },
  { q: "What banks are supported?", a: "Payout Lite uses Nomba's infrastructure which supports 50+ Nigerian banks for invoice payments, QR transfers, and virtual account deposits." },
  { q: "What is the AI CFO?", a: "The AI CFO is a chat interface powered by Groq and grounded in your real transaction data. Ask questions like 'which payment channel made the most money this month?' and get instant, data-backed answers." },
  { q: "Do I need technical knowledge to set up?", a: "No. The dashboard is fully self-serve. Creating invoices, generating QR codes, and embedding a website button takes under 5 minutes with no code required." },
  { q: "How do I get my unique virtual account?", a: "Once you create a business on Payout Lite, a virtual account is provisioned via Nomba. Any bank transfer to that account is automatically reconciled and recorded in your dashboard." },
];

function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-slate-100">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="pr-8 text-[15px] font-semibold text-[#0F172A]">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown size={18} className="shrink-0 text-slate-400" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-slate-500">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────────

export function LandingPage({ isSignedIn }: { isSignedIn: boolean }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-[#0F172A]">

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 z-50 w-full border-b border-[#030712]/[0.06] bg-[#030712]/95 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB]">
              <span className="text-xs font-black text-white">PL</span>
            </div>
            <span className="text-sm font-black text-white">Payout Lite</span>
          </Link>
          <nav className="hidden items-center gap-7 md:flex">
            {["Use Cases", "Features", "Security", "FAQ"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="text-sm text-slate-400 transition hover:text-white">
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2.5">
            {isSignedIn ? (
              <Link href="/dashboard"
                className="rounded-xl bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/sign-in"
                  className="rounded-xl border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10">
                  Sign in
                </Link>
                <Link href="/sign-up"
                  className="rounded-xl bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]">
                  Try it Out
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.header>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#030712] pb-0 pt-24"
      >
        {/* Glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-[-10%] h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-[#2563EB]/15 blur-[120px]" />
          <div className="absolute left-[20%] top-[30%] h-[300px] w-[300px] rounded-full bg-blue-600/8 blur-[80px]" />
          <div className="absolute right-[15%] top-[20%] h-[200px] w-[200px] rounded-full bg-cyan-500/6 blur-[60px]" />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 mx-auto w-full max-w-6xl px-5"
        >
          <div className="flex flex-col items-center lg:flex-row lg:items-end lg:gap-12">
            {/* Left text */}
            <div className="mb-16 flex-1 pt-4 text-center lg:mb-0 lg:pb-24 lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold text-blue-400">
                  <Zap size={11} />
                  Nomba Hackathon Build Track
                </span>
              </motion.div>

              <motion.h1
                className="mt-6 text-4xl font-black leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-6xl"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                Your Personal{" "}
                <span className="bg-gradient-to-br from-[#60a5fa] to-[#2563EB] bg-clip-text text-transparent">
                  Payment Hub
                </span>
                ,{" "}
                <br className="hidden lg:block" />
                Anytime, Anywhere
              </motion.h1>

              <motion.p
                className="mx-auto mt-5 max-w-md text-base leading-relaxed text-slate-400 lg:mx-0 lg:text-lg"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                Collect payments via invoices, QR codes, website buttons, and virtual accounts — every transaction confirmed by Nomba webhooks.
              </motion.p>

              <motion.div
                className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <Link
                  href={isSignedIn ? "/dashboard" : "/sign-up"}
                  className="group flex items-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-[#1D4ED8]"
                >
                  {isSignedIn ? "Open Dashboard" : "Try Payout Lite"}
                  <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                </Link>
              </motion.div>

              {/* Social proof avatars */}
              <motion.div
                className="mt-8 flex items-center justify-center gap-3 lg:justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.45 }}
              >
                <div className="flex -space-x-2">
                  {["AN", "OB", "CK", "MM"].map((init, i) => (
                    <div key={i}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#030712] bg-gradient-to-br from-blue-400 to-blue-600 text-[9px] font-bold text-white"
                      style={{ background: ["#3b82f6","#8b5cf6","#10b981","#f59e0b"][i] }}>
                      {init}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={11} className="fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-xs text-slate-400">Trusted by 100+ Nigerian businesses</p>
                </div>
              </motion.div>
            </div>

            {/* Right phone */}
            <motion.div
              className="relative flex-shrink-0"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Sent money notification */}
              <motion.div
                className="absolute -left-4 top-20 z-10 rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-md lg:-left-16"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <p className="text-[10px] font-semibold text-white">✅ Paid ₦45,000</p>
                <p className="text-[9px] text-slate-300">Ada Stores — Invoice #042</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}
              >
                <PhoneFrame>
                  <DashboardScreen />
                </PhoneFrame>
              </motion.div>

              {/* Bottom notification */}
              <motion.div
                className="absolute -right-4 bottom-20 z-10 rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-md lg:-right-16"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <p className="text-[10px] font-semibold text-white">🔔 Webhook confirmed</p>
                <p className="text-[9px] text-slate-300">HMAC verified by Nomba</p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom wave into white */}
        <div className="relative z-10 mt-0 w-full">
          <svg viewBox="0 0 1440 80" className="block w-full" preserveAspectRatio="none">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── Feature sections ─────────────────────────────────────────────── */}
      <div id="features">
        <FeatureSection
          badge="Invoices"
          title="Send invoices, stress-free"
          body="Create a professional invoice in seconds, share the payment link anywhere, and watch the status update automatically the moment your customer pays."
          checks={[
            "Hosted payment page — no setup needed",
            "Status confirmed by Nomba webhook, not redirect",
            "Track every invoice in real time",
          ]}
          screen={<InvoiceScreen />}
          bg="bg-white"
        />

        <FeatureSection
          badge="Dashboard"
          title="Know where your money goes"
          body="Every payment across every channel lands in one clean dashboard. Filter by source, date, or status and understand your business at a glance."
          checks={[
            "Invoices, QR, website button, virtual account — all in one view",
            "Webhook-confirmed balances only — no false positives",
            "Export transactions anytime",
          ]}
          screen={<DashboardScreen />}
          flip
          bg="bg-[#F8FAFC]"
        />

        <FeatureSection
          badge="Shop QR"
          title="Get paid without the wait"
          body="Print your QR code and stick it on the counter. Walk-in customers scan and pay any amount directly into your business account. No app, no friction."
          checks={[
            "Works with any bank app or payment app",
            "Customer pays any amount — no preset required",
            "Payment auto-reconciled to your dashboard",
          ]}
          screen={<QRScreen />}
          bg="bg-white"
        />

        <FeatureSection
          badge="AI CFO"
          title="It remembers, so you don't have to"
          body="Ask your AI CFO anything about your payments. It's grounded in your real Nomba transaction data — not guesswork, not templates. Real answers in seconds."
          checks={[
            "Powered by Groq for near-instant responses",
            "Grounded in your actual transaction history",
            "Revenue trends, top payers, channel breakdown",
          ]}
          screen={<AICFOScreen />}
          flip
          bg="bg-[#F8FAFC]"
        />
      </div>

      {/* ── Everyday usage cards ─────────────────────────────────────────── */}
      <div id="use-cases" className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-5">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-14 text-center"
          >
            <span className="mb-3 inline-block rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-[#2563EB]">
              Use Cases
            </span>
            <h2 className="text-3xl font-black text-[#0F172A] lg:text-4xl">Works for every business</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-500">
              From street vendors to freelancers — Payout Lite fits how Nigerian businesses actually work.
            </p>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                emoji: "🍛",
                bg: "from-orange-400 to-amber-500",
                title: "Street vendor",
                name: "Mama Ngozi Foods",
                amount: "₦1,500",
                desc: "QR scan at the counter",
              },
              {
                emoji: "💼",
                bg: "from-blue-500 to-indigo-600",
                title: "Freelancer",
                name: "Ada Creative Studio",
                amount: "₦45,000",
                desc: "Invoice paid online",
              },
              {
                emoji: "🛒",
                bg: "from-emerald-500 to-teal-600",
                title: "Online store",
                name: "Chukwuma Electronics",
                amount: "₦12,000",
                desc: "Website button purchase",
              },
              {
                emoji: "✂️",
                bg: "from-purple-500 to-pink-600",
                title: "Service shop",
                name: "Mike's Barbershop",
                amount: "₦2,500",
                desc: "Bank transfer auto-reconciled",
              },
            ].map(({ emoji, bg, title, name, amount, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                className="overflow-hidden rounded-2xl"
              >
                <div className={`bg-gradient-to-br ${bg} flex h-40 items-end p-4`}>
                  <span className="text-5xl">{emoji}</span>
                </div>
                <div className="border border-t-0 border-slate-100 rounded-b-2xl bg-white p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{title}</p>
                  <p className="mt-0.5 text-sm font-bold text-[#0F172A]">{name}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-black text-[#0F172A]">{amount}</span>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-semibold text-emerald-600">
                      ✓ Confirmed
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats band (dark) ────────────────────────────────────────────── */}
      <div className="bg-[#030712] py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid gap-12 text-center sm:grid-cols-3">
            {[
              { value: "6", label: "Payment channels", sub: "Invoice · QR · Button · Account · AI · Webhook" },
              { value: "50+", label: "Banks supported", sub: "Powered by Nomba infrastructure" },
              { value: "100%", label: "Webhook confirmed", sub: "HMAC-verified — no false positives" },
            ].map(({ value, label, sub }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <p className="text-5xl font-black text-white lg:text-6xl">{value}</p>
                <p className="mt-2 text-sm font-semibold text-slate-300">{label}</p>
                <p className="mt-1 text-xs text-slate-500">{sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Security ─────────────────────────────────────────────────────── */}
      <div id="security" className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-5">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-14 text-center"
          >
            <span className="mb-3 inline-block rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-[#2563EB]">
              Security
            </span>
            <h2 className="text-3xl font-black text-[#0F172A] lg:text-4xl">Your payments are protected</h2>
          </motion.div>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                icon: Shield,
                title: "HMAC Webhook Verification",
                body: "Every Nomba webhook is verified with a SHA-256 HMAC signature. Only genuine Nomba events update your payment status.",
              },
              {
                icon: Lock,
                title: "Clerk Authentication",
                body: "Sign in with email, passkey, or social auth. All merchant routes are protected. The /api/nomba/webhook endpoint stays public for Nomba.",
              },
              {
                icon: Fingerprint,
                title: "No Card Data Stored",
                body: "Payout Lite never touches card details. All card payments flow through Nomba Checkout — PCI-compliant, fully tokenized.",
              },
            ].map(({ icon: Icon, title, body }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                className="rounded-2xl border border-slate-100 p-7"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                  <Icon size={20} className="text-[#2563EB]" />
                </div>
                <h3 className="mb-2 font-bold text-[#0F172A]">{title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <div id="faq" className="bg-[#F8FAFC] py-24">
        <div className="mx-auto max-w-3xl px-5">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <span className="mb-3 inline-block rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-[#2563EB]">
              FAQ
            </span>
            <h2 className="text-3xl font-black text-[#0F172A] lg:text-4xl">Common questions</h2>
          </motion.div>
          <div className="rounded-2xl border border-slate-100 bg-white px-7">
            {faqs.map((faq, i) => (
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
      </div>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#030712] py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/15 blur-[120px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative z-10 mx-auto max-w-2xl px-5 text-center"
        >
          <h2 className="text-4xl font-black text-white lg:text-5xl">Ready to collect payments?</h2>
          <p className="mt-4 text-slate-400">
            Set up your business and start generating invoices, QR codes, and payment links in minutes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href={isSignedIn ? "/dashboard" : "/sign-up"}
              className="group flex items-center gap-2 rounded-xl bg-[#2563EB] px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-[#1D4ED8]"
            >
              {isSignedIn ? "Open Dashboard" : "Try Payout Lite"}
              <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </Link>
            <Link
              href="/onboarding"
              className="rounded-xl border border-white/15 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
            >
              Create business
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] bg-[#030712] py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 sm:flex-row">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2563EB]">
              <span className="text-[10px] font-black text-white">PL</span>
            </div>
            <span className="text-sm font-bold text-white">Payout Lite</span>
          </Link>
          <div className="flex items-center gap-6">
            {["Terms", "Privacy Policy", "Careers"].map((l) => (
              <a key={l} href="#" className="text-xs text-slate-500 transition hover:text-slate-300">{l}</a>
            ))}
          </div>
          <p className="text-xs text-slate-600">© 2026 Payout Lite · Nomba Hackathon</p>
        </div>
      </footer>
    </div>
  );
}
