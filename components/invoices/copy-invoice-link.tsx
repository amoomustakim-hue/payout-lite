"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CopyInvoiceLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      type="button"
      variant="secondary"
      className="px-3 py-2 text-xs"
      onClick={async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
      }}
    >
      {copied ? "Copied" : "Copy link"}
    </Button>
  );
}
