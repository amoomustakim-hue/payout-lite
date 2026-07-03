"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopySnippet({ snippet }: { snippet: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs font-medium text-[var(--payout-blue)] hover:underline"
    >
      {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
