"use client";

import QRCode from "react-qr-code";
import { Download } from "lucide-react";

export function QrDisplay({ url, businessName }: { url: string; businessName: string }) {
  function handleDownload() {
    const svg = document.getElementById("shop-qr-svg");
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      ctx?.drawImage(img, 0, 0, 512, 512);
      const link = document.createElement("a");
      link.download = `${businessName.replace(/\s+/g, "-").toLowerCase()}-qr.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgStr)))}`;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-xl border border-[var(--border)] bg-white p-4">
        <QRCode
          id="shop-qr-svg"
          value={url}
          size={176}
          fgColor="#0F172A"
          bgColor="#ffffff"
          level="M"
        />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-[var(--foreground)]">{businessName}</p>
        <p className="text-xs text-[var(--muted)]">Scan to pay</p>
      </div>
      <button
        onClick={handleDownload}
        className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--foreground)] transition hover:bg-slate-50"
      >
        <Download size={13} />
        Download PNG
      </button>
    </div>
  );
}
