"use client";

import { useState, useTransition } from "react";
import { RefreshCw, Loader2 } from "lucide-react";
import { createVirtualAccountAction } from "@/app/unique-account/actions";

export function CreateVirtualAccountButton() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleCreate() {
    startTransition(async () => {
      const result = await createVirtualAccountAction();
      if (result.error) setError(result.error);
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleCreate}
        disabled={isPending}
        className="flex items-center gap-1.5 rounded-lg bg-[var(--payout-blue)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--payout-blue-dark)] disabled:opacity-60"
      >
        {isPending ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
        {isPending ? "Creating…" : "Create virtual account"}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
