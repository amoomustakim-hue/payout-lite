"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink, MessageCircle } from "lucide-react";

export function ShareInvoice({
  url,
  customerName,
  compact = false,
}: {
  url: string;
  customerName?: string | null;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Older browsers / insecure context — fall back to a prompt
      window.prompt("Copy this payment link:", url);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const waText = encodeURIComponent(
    `Hi${customerName ? " " + customerName : ""}, here's your invoice. Pay securely here: ${url}`,
  );

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1 rounded-md border border-[var(--border)] px-2.5 py-1 text-xs font-medium text-[var(--muted)] transition hover:border-[var(--payout-blue)] hover:text-[var(--payout-blue)]"
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? "Copied" : "Copy link"}
        </button>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 rounded-md border border-[var(--border)] px-2.5 py-1 text-xs font-medium text-[var(--muted)] transition hover:border-[var(--payout-blue)] hover:text-[var(--payout-blue)]"
        >
          <ExternalLink size={11} />
          Open
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-white px-3 py-2.5">
        <input
          readOnly
          value={url}
          onFocus={(e) => e.currentTarget.select()}
          className="min-w-0 flex-1 bg-transparent text-sm text-[var(--foreground)] outline-none"
        />
        <button
          type="button"
          onClick={copy}
          className="flex shrink-0 items-center gap-1.5 rounded-md bg-[var(--payout-blue)] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[var(--payout-blue-dark)]"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-white px-3.5 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-slate-50"
        >
          <ExternalLink size={14} />
          Open payment page
        </a>
        <a
          href={`https://wa.me/?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
        >
          <MessageCircle size={14} />
          Send via WhatsApp
        </a>
      </div>
    </div>
  );
}
