import { Sparkles, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

const QUICK_QUESTIONS = [
  "How much did I receive today?",
  "Which payment source performed best?",
  "Which invoices are unpaid?",
  "Summarize my payments this week.",
];

export default function AiCfoPage() {
  return (
    <div>
      <PageHeader
        title="AI CFO"
        description="Groq-powered summaries grounded in your real business transaction data."
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        {/* Main chat area */}
        <div className="flex flex-col gap-4">
          <Card className="flex-1">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-[var(--payout-blue)]">
                <Sparkles size={14} />
              </div>
              <p className="font-semibold text-[var(--foreground)]">Ask your AI CFO</p>
            </div>

            {/* Empty chat state */}
            <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-slate-50/60 py-12 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[var(--payout-blue)]">
                <Sparkles size={22} strokeWidth={1.5} />
              </div>
              <p className="font-semibold text-[var(--foreground)]">Ask anything about your payments</p>
              <p className="mt-1.5 max-w-xs text-sm text-[var(--muted)]">
                Insights are grounded in your real transaction data. Connect a database to unlock live answers.
              </p>
            </div>

            {/* Input */}
            <div className="mt-4 flex items-center gap-2">
              <input
                className="flex-1 rounded-lg border border-[var(--border)] bg-slate-50 px-4 py-2.5 text-sm placeholder:text-slate-400 focus:border-[var(--payout-blue)] focus:ring-2 focus:ring-[var(--payout-blue)]/10"
                placeholder="Ask about your payments..."
              />
              <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--payout-blue)] text-white transition hover:bg-[var(--payout-blue-dark)]">
                <Send size={15} />
              </button>
            </div>
          </Card>
        </div>

        {/* Quick questions */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Quick questions</p>
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              className="rounded-xl border border-[var(--border)] bg-white p-4 text-left text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--payout-blue)] hover:bg-blue-50/50"
            >
              {q}
            </button>
          ))}

          <div className="mt-2 rounded-xl border border-[var(--border)] bg-[var(--payout-blue)] p-4 text-white">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-200">Powered by</p>
            <p className="mt-1 font-bold">Groq AI</p>
            <p className="mt-1 text-xs leading-relaxed text-blue-100">
              Ultra-fast inference grounded in your Nomba transaction history.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
