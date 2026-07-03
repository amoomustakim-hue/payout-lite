"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import type { LucideIcon } from "lucide-react";
import {
  FileText,
  Globe,
  QrCode,
  Landmark,
  Webhook,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  TrendingUp,
} from "lucide-react";

const features: { icon: LucideIcon; title: string; description: string; badge: string }[] = [
  { icon: FileText, title: "Invoices", description: "Create invoices and share hosted payment pages. Status updates automatically on webhook confirmation.", badge: "Auto-confirmed" },
  { icon: Globe, title: "Website Button", description: "Drop a payment button on any website. Customers click to pay via Nomba Checkout.", badge: "One-line embed" },
  { icon: QrCode, title: "Shop QR", description: "Print a QR code for your shop. Walk-in customers scan to pay any amount instantly.", badge: "No app needed" },
  { icon: Landmark, title: "Unique Account", description: "One virtual account per business. Reconcile transfers automatically from Nomba webhooks.", badge: "Auto-reconcile" },
  { icon: Webhook, title: "Webhook Confirmed", description: "Every payment status is confirmed by Nomba webhooks — not redirects. No false positives.", badge: "HMAC verified" },
  { icon: Sparkles, title: "AI CFO", description: "Groq-powered insights grounded in your real transaction data. Ask questions, get answers.", badge: "Groq-powered" },
];

const stats = [
  { value: "6", label: "Payment channels", sub: "Invoice · QR · Button · Account" },
  { value: "100%", label: "Webhook confirmed", sub: "HMAC-verified by Nomba" },
  { value: "< 1s", label: "Status updates", sub: "Real-time payment confirmation" },
];

const paymentMethods = [
  { flag: "🧾", label: "Invoice", value: "Share link · Pay online" },
  { flag: "🌐", label: "Website Button", value: "Embed · One-line script" },
  { flag: "📱", label: "Shop QR", value: "Scan · Any amount" },
  { flag: "🏦", label: "Virtual Account", value: "Transfer · Auto-reconcile" },
  { flag: "⚡", label: "Webhook", value: "HMAC · Instant confirm" },
  { flag: "🤖", label: "AI CFO", value: "Ask · Get insights" },
];

const pressLogos = ["Nomba", "Vercel", "Groq", "Prisma", "Next.js", "Clerk"];

export function LandingPage({ isSignedIn }: { isSignedIn: boolean }) {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#030712] text-white">

      {/* ── Nav ── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 z-50 w-full border-b border-white/[0.06] bg-[#030712]/80 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB]">
              <span className="text-xs font-black text-white">PL</span>
            </div>
            <span className="text-sm font-black text-white">Payout Lite</span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {["Features", "Updates", "About", "Contact"].map((item) => (
              <a key={item} href="#" className="text-sm text-slate-400 transition hover:text-white">
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            {isSignedIn ? (
              <Link
                href="/dashboard"
                className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Switch Trainer
                </Link>
                <Link
                  href="/sign-up"
                  className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
                >
                  Buy Template
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.header>

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pb-16 pt-24"
      >
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[#2563EB]/18 blur-[140px]" />
          <div className="absolute left-1/4 top-1/3 h-[260px] w-[260px] rounded-full bg-blue-500/10 blur-[80px]" />
          <div className="absolute right-1/4 top-1/4 h-[180px] w-[180px] rounded-full bg-cyan-500/8 blur-[60px]" />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 mx-auto max-w-5xl px-5 text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400">
              <Zap size={11} />
              Nomba Hackathon Build Track
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="mt-6 text-5xl font-black leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Let your business{" "}
            <span className="bg-gradient-to-r from-[#2563EB] via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              collect
            </span>{" "}
            payments
          </motion.h1>

          {/* Sub */}
          <motion.p
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            The payment hub for small Nigerian businesses. Invoices, QR payments, website buttons, and virtual accounts — all confirmed by Nomba webhooks.
          </motion.p>

          {/* CTA */}
          <motion.div
            className="mt-8 flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Link
              href={isSignedIn ? "/dashboard" : "/sign-up"}
              className="group flex items-center gap-2 rounded-xl bg-[#2563EB] px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-[#1D4ED8] hover:shadow-blue-600/50"
            >
              {isSignedIn ? "Open dashboard" : "Download App"}
              <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto mt-16 max-w-4xl"
          >
            <div className="absolute -bottom-10 left-1/2 h-20 w-3/4 -translate-x-1/2 rounded-full bg-blue-600/25 blur-3xl" />

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            >
              <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/70">
                {/* Chrome bar */}
                <div className="flex items-center gap-3 border-b border-white/[0.07] bg-[#111827] px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="mx-auto max-w-xs flex-1 rounded-md border border-white/[0.07] bg-[#1f2937] px-3 py-1 text-center text-xs text-slate-500">
                    payout-lite.vercel.app/dashboard
                  </div>
                </div>

                {/* App body */}
                <div className="grid bg-[#0a0f1e] lg:grid-cols-[180px_1fr]">
                  {/* Sidebar */}
                  <div className="hidden border-r border-white/[0.05] bg-[#060b18] p-3 lg:block">
                    <div className="mb-4 flex items-center gap-2 px-2 py-1.5">
                      <div className="h-5 w-5 rounded bg-[#2563EB]" />
                      <span className="text-xs font-bold text-white">Payout Lite</span>
                    </div>
                    {["Dashboard", "Invoices", "Website Button", "Shop QR", "Transactions", "AI CFO"].map((item, i) => (
                      <div
                        key={item}
                        className={`mb-1 rounded-lg px-3 py-2 text-xs font-medium ${
                          i === 0 ? "bg-[#2563EB] text-white" : "text-slate-500"
                        }`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm font-bold text-white">Payment overview</span>
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                        All confirmed
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                      {[
                        { label: "Total received", value: "₦482,000", badge: "Webhook confirmed", color: "text-emerald-400" },
                        { label: "Pending", value: "₦120,000", badge: "Awaiting", color: "text-amber-400" },
                        { label: "Paid invoices", value: "8", badge: "This month", color: "text-slate-400" },
                        { label: "Payment links", value: "5", badge: "Active", color: "text-blue-400" },
                      ].map((s) => (
                        <div key={s.label} className="rounded-xl border border-white/[0.05] bg-white/[0.03] p-3">
                          <p className={`text-[10px] font-semibold ${s.color}`}>{s.badge}</p>
                          <p className="mt-1 text-base font-black text-white">{s.value}</p>
                          <p className="mt-0.5 text-[10px] text-slate-500">{s.label}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 h-14 overflow-hidden rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                      <svg viewBox="0 0 300 35" className="h-full w-full" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0,28 C30,28 40,8 70,12 C100,16 120,24 150,16 C180,8 200,20 230,12 C260,4 280,16 300,8"
                          fill="none"
                          stroke="#2563EB"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M0,28 C30,28 40,8 70,12 C100,16 120,24 150,16 C180,8 200,20 230,12 C260,4 280,16 300,8 L300,35 L0,35 Z"
                          fill="url(#chartGrad)"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Press logos ── */}
      <div className="border-y border-white/[0.06] bg-white/[0.02] py-8">
        <p className="mb-5 text-center text-[10px] font-semibold uppercase tracking-widest text-slate-600">
          Powered by
        </p>
        <div className="flex flex-wrap items-center justify-center gap-10">
          {pressLogos.map((logo) => (
            <span key={logo} className="text-sm font-bold text-slate-500 transition hover:text-slate-300">
              {logo}
            </span>
          ))}
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="mx-auto max-w-6xl px-5 py-28">
        <div className="grid gap-10 text-center sm:grid-cols-3">
          {stats.map(({ value, label, sub }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-5xl font-black tracking-tight lg:text-6xl">{value}</p>
              <p className="mt-2 text-base font-semibold text-slate-300">{label}</p>
              <p className="mt-1 text-sm text-slate-500">{sub}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Feature grid ── */}
      <div className="mx-auto max-w-6xl px-5 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-400">All-in-one</p>
          <h2 className="text-3xl font-black lg:text-4xl">Everything is in one place</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">
            Our multi-channel payment platform allows you to manage various payment methods and track live performance.
          </p>
        </motion.div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description, badge }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 transition-colors hover:border-blue-500/30 hover:bg-white/[0.05]"
            >
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: "radial-gradient(circle at 50% 0%, rgba(37,99,235,0.12), transparent 70%)" }}
              />
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <Icon size={18} strokeWidth={2} />
              </div>
              <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-blue-400">
                {badge}
              </span>
              <h3 className="mt-3 font-bold text-white">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Split feature highlight ── */}
      <div className="mx-auto max-w-6xl px-5 pb-28">
        <div className="grid gap-5 lg:grid-cols-2">
          {/* Left — invoice tracker mock */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-7"
          >
            <p className="text-xs font-semibold text-blue-400">Dynamic Invoice Tracking</p>
            <div className="mt-4 rounded-xl border border-white/[0.06] bg-[#060b18] p-5">
              <p className="text-xs text-slate-500">Main account</p>
              <p className="mt-1 text-3xl font-black text-white">₦19,850.36</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-400">▲ +3.23%</span>
                <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                  PAID
                </span>
              </div>
              <div className="mt-4 h-10">
                <svg viewBox="0 0 200 28" className="h-full w-full" preserveAspectRatio="none">
                  <path
                    d="M0,22 C20,22 30,6 50,10 C70,14 90,18 110,12 C130,6 150,14 170,8 C190,2 195,10 200,6"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="mt-3 flex gap-1.5">
                {["1H", "1W", "1M", "3M", "1Y", "ALL"].map((t, i) => (
                  <button
                    key={t}
                    className={`rounded px-2 py-0.5 text-[10px] font-medium ${
                      i === 2 ? "bg-blue-500/20 text-blue-400" : "text-slate-600 hover:text-slate-400"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-5 text-sm font-semibold text-white">Smart Notifications</p>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2.5">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={13} className="shrink-0 text-emerald-400" />
                  <span className="text-xs text-slate-300">Invoice #INV-042 paid</span>
                </div>
                <span className="text-[10px] text-slate-500">2m ago</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2.5">
                <div className="flex items-center gap-2.5">
                  <TrendingUp size={13} className="shrink-0 text-blue-400" />
                  <span className="text-xs text-slate-300">₦54,390 received via QR</span>
                </div>
                <span className="text-[10px] text-slate-500">14m ago</span>
              </div>
            </div>
          </motion.div>

          {/* Right — AI CFO + webhook */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-5"
          >
            <div className="flex-1 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-7">
              <p className="text-xs font-semibold text-blue-400">AI CFO Insights</p>
              <p className="mt-3 text-2xl font-black leading-tight text-white">
                Ask your data<br />anything.
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Groq-powered analysis grounded in your real Nomba transaction history. No guesswork.
              </p>
              <div className="mt-5 rounded-xl border border-white/[0.05] bg-[#060b18] p-4">
                <p className="mb-1.5 text-[10px] text-slate-500">AI response</p>
                <p className="text-sm leading-relaxed text-slate-300">
                  "Your invoice revenue grew 34% this month. Top payer: Ada Stores with ₦120,000 across 3 invoices."
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-7">
              <p className="text-xs font-semibold text-blue-400">Webhook Security</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                  <Shield size={18} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">HMAC-verified payments</p>
                  <p className="text-xs text-slate-500">Every status update signed by Nomba</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Multi-channel ticker ── */}
      <div className="border-y border-white/[0.06] bg-white/[0.02] py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-400">Features</p>
          <h2 className="text-3xl font-black lg:text-4xl">Multi Channel Payments</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">
            Overview of your payment balance, profit & loss during various time periods. See your invoices, QR, website buttons, and more.
          </p>
        </motion.div>
        <div className="mx-auto max-w-5xl px-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {paymentMethods.map(({ flag, label, value }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 text-center transition hover:border-blue-500/20 hover:bg-white/[0.05]"
              >
                <span className="text-2xl">{flag}</span>
                <p className="mt-2 text-xs font-bold text-white">{label}</p>
                <p className="mt-0.5 text-[10px] leading-snug text-slate-500">{value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/20 blur-[100px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative z-10 mx-auto max-w-2xl px-5 text-center"
        >
          <h2 className="text-4xl font-black lg:text-5xl">Ready to collect payments?</h2>
          <p className="mt-4 text-slate-400">
            Set up your business and start generating payment links, invoices, and QR codes in minutes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href={isSignedIn ? "/dashboard" : "/sign-up"}
              className="group flex items-center gap-2 rounded-xl bg-[#2563EB] px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-[#1D4ED8]"
            >
              {isSignedIn ? "Open dashboard" : "Get started free"}
              <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </Link>
            <Link
              href="/onboarding"
              className="rounded-xl border border-white/20 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
            >
              Create business
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.06] py-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5">
          <p className="text-xs text-slate-600">© 2025 Payout Lite · Nomba Hackathon</p>
          <p className="text-xs text-slate-600">Payments confirmed by Nomba webhooks</p>
        </div>
      </footer>
    </div>
  );
}
