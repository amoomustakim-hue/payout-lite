"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { askAiCfoAction } from "@/app/ai-cfo/actions";

type Message = { role: "user" | "ai"; content: string };

const QUICK_QUESTIONS = [
  "How much did I receive this month?",
  "Which payment channel performed best?",
  "Which invoices are unpaid?",
  "Summarize my payments this week.",
];

export function AiCfoChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPending]);

  function ask(question: string) {
    if (!question.trim() || isPending) return;
    const q = question.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: q }]);
    startTransition(async () => {
      const { answer, error } = await askAiCfoAction(q);
      setMessages((prev) => [...prev, { role: "ai", content: error ?? answer }]);
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    ask(input);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
      {/* Chat */}
      <div className="flex flex-col gap-0 overflow-hidden rounded-xl border border-[var(--border)] bg-white">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-[var(--border)] px-5 py-3.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-[var(--payout-blue)]">
            <Sparkles size={14} />
          </div>
          <p className="font-semibold text-[var(--foreground)]">Ask your AI CFO</p>
          <span className="ml-auto flex items-center gap-1 text-xs text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Groq · llama-3.3-70b
          </span>
        </div>

        {/* Messages */}
        <div className="flex min-h-[360px] flex-1 flex-col gap-4 overflow-y-auto p-5">
          {messages.length === 0 && (
            <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[var(--payout-blue)]">
                <Sparkles size={22} strokeWidth={1.5} />
              </div>
              <p className="font-semibold text-[var(--foreground)]">Ask anything about your payments</p>
              <p className="mt-1.5 max-w-xs text-sm text-[var(--muted)]">
                Answers are grounded in your real Nomba transaction data.
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "ai" && (
                <div className="mr-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50">
                  <Sparkles size={11} className="text-[var(--payout-blue)]" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "rounded-tr-sm bg-[var(--payout-blue)] text-white"
                    : "rounded-tl-sm border border-[var(--border)] bg-slate-50 text-[var(--foreground)]"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isPending && (
            <div className="flex justify-start">
              <div className="mr-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50">
                <Sparkles size={11} className="text-[var(--payout-blue)]" />
              </div>
              <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-[var(--border)] bg-slate-50 px-4 py-2.5">
                <Loader2 size={13} className="animate-spin text-[var(--payout-blue)]" />
                <span className="text-sm text-[var(--muted)]">Analysing your data…</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-[var(--border)] p-4">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isPending}
              placeholder="Ask about your payments…"
              className="flex-1 rounded-lg border border-[var(--border)] bg-slate-50 px-4 py-2.5 text-sm placeholder:text-slate-400 focus:border-[var(--payout-blue)] focus:outline-none focus:ring-2 focus:ring-[var(--payout-blue)]/10 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isPending || !input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--payout-blue)] text-white transition hover:bg-[var(--payout-blue-dark)] disabled:opacity-50"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>

      {/* Quick questions */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Quick questions</p>
        {QUICK_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => ask(q)}
            disabled={isPending}
            className="rounded-xl border border-[var(--border)] bg-white p-4 text-left text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--payout-blue)] hover:bg-blue-50/50 disabled:opacity-50"
          >
            {q}
          </button>
        ))}
        <div className="mt-2 rounded-xl bg-[var(--payout-blue)] p-4 text-white">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-200">Powered by</p>
          <p className="mt-1 font-bold">Groq AI</p>
          <p className="mt-1 text-xs leading-relaxed text-blue-100">
            Ultra-fast inference grounded in your real Nomba transaction history.
          </p>
        </div>
      </div>
    </div>
  );
}
