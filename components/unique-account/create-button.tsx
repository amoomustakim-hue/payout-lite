"use client";

import { useState, useTransition } from "react";
import { RefreshCw, Loader2 } from "lucide-react";
import { createVirtualAccountAction } from "@/app/unique-account/actions";

export function CreateVirtualAccountButton() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<string | null>(null);

  function handleCreate() {
    setError(null);
    setDetail(null);
    startTransition(async () => {
      const result = await createVirtualAccountAction();
      if (result.error) {
        setError(result.error);
        setDetail(result.detail ?? null);
      }
    });
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleCreate}
        disabled={isPending}
        className="flex items-center gap-1.5 rounded-lg bg-[var(--payout-blue)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--payout-blue-dark)] disabled:opacity-60"
      >
        {isPending ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
        {isPending ? "Creating…" : "Create virtual account"}
      </button>
      {error && (
        <div className="mt-1 max-w-xs rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-left text-xs text-red-700">
          <p className="font-semibold">{error}</p>
          {detail && <p className="mt-1 font-mono break-all text-red-500">{detail}</p>}
        </div>
      )}
    </div>
  );
}
