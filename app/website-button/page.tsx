import { Globe, Copy, Code2, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { getAppUrl } from "@/lib/app-url";

export default function WebsiteButtonPage() {
  const appUrl = getAppUrl();
  const payUrl = `${appUrl}/pay/button/ada-stores`;
  const snippet = `<a href="${payUrl}" style="background:#2563EB;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;display:inline-block">Pay with Payout Lite</a>`;

  return (
    <div>
      <PageHeader
        title="Website Button"
        description="Give customers a payment button for any website. One link, Nomba-powered checkout."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Payment URL */}
        <Card>
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-[var(--payout-blue)]">
              <Globe size={14} />
            </div>
            <p className="font-semibold text-[var(--foreground)]">Payment URL</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-slate-50 px-3 py-3">
            <p className="flex-1 truncate text-sm font-medium text-[var(--payout-blue)]">{payUrl}</p>
            <a
              href={payUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-slate-400 hover:text-slate-600"
            >
              <ExternalLink size={14} />
            </a>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-[var(--muted)]">Button preview</p>
            <a
              href={payUrl}
              style={{
                background: "#2563EB",
                color: "#fff",
                padding: "10px 18px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "14px",
                display: "inline-block",
              }}
            >
              Pay with Payout Lite
            </a>
          </div>
        </Card>

        {/* HTML snippet */}
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-[var(--payout-blue)]">
                <Code2 size={14} />
              </div>
              <p className="font-semibold text-[var(--foreground)]">HTML snippet</p>
            </div>
            <button className="flex items-center gap-1.5 text-xs font-medium text-[var(--payout-blue)] hover:underline">
              <Copy size={12} />
              Copy
            </button>
          </div>
          <pre className="overflow-x-auto rounded-lg bg-[var(--payout-navy)] p-4 text-xs leading-relaxed text-slate-300">
            {snippet}
          </pre>
        </Card>
      </div>

      <div className="mt-5 rounded-xl border border-[var(--border)] bg-slate-50 p-5">
        <p className="text-sm font-semibold text-[var(--foreground)]">How it works</p>
        <ol className="mt-3 grid gap-2 text-sm text-[var(--muted)] sm:grid-cols-3">
          {[
            "Customer clicks the button on your website or social media.",
            "They land on a Nomba Checkout page and complete payment.",
            "Your dashboard updates automatically when the webhook confirms.",
          ].map((step, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--payout-blue)] text-[10px] font-bold text-white">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
