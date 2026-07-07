import { Globe, Code2, ExternalLink, CheckCircle2 } from "lucide-react";
import { CopySnippet } from "@/components/website-button/copy-snippet";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { getAppUrl } from "@/lib/app-url";
import { getCurrentBusiness } from "@/lib/auth/get-current-business";

export const dynamic = "force-dynamic";

export default async function WebsiteButtonPage() {
  const business = await getCurrentBusiness();
  const slug = business?.slug ?? "my-business";
  const appUrl = getAppUrl();
  const payUrl = `${appUrl}/pay/button/${slug}`;

  const snippetHtml = `<a href="${payUrl}" target="_blank" rel="noopener noreferrer" style="background:#256BFF;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;display:inline-block;font-family:sans-serif">
  Pay with Payout Lite
</a>`;

  const snippetIframe = `<iframe
  src="${payUrl}"
  width="100%"
  height="600"
  frameborder="0"
  style="border-radius:12px;border:1px solid #DCE6F5"
  title="Payout Lite Checkout"
></iframe>`;

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
            <p className="font-semibold text-[var(--foreground)]">Your Payment URL</p>
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

          <div className="mt-5">
            <p className="mb-2 text-xs font-medium text-[var(--muted)]">Button preview</p>
            <a
              href={payUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#256BFF",
                color: "#fff",
                padding: "11px 20px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "14px",
                display: "inline-block",
              }}
            >
              Pay with Payout Lite
            </a>
          </div>

          <div className="mt-5 space-y-2">
            {[
              "Customers click and land on a Nomba-powered checkout",
              "Supports card, bank transfer, and USSD",
              "Payment confirmed by webhook — not just a redirect",
            ].map((t) => (
              <div key={t} className="flex items-start gap-2 text-xs text-[var(--muted)]">
                <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-emerald-500" />
                {t}
              </div>
            ))}
          </div>
        </Card>

        {/* HTML snippet */}
        <div className="flex flex-col gap-4">
          <Card>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-[var(--payout-blue)]">
                  <Code2 size={14} />
                </div>
                <p className="font-semibold text-[var(--foreground)]">HTML button snippet</p>
              </div>
              <CopySnippet snippet={snippetHtml} />
            </div>
            <pre className="overflow-x-auto rounded-lg bg-[var(--payout-navy)] p-4 text-xs leading-relaxed text-slate-300 whitespace-pre-wrap">
              {snippetHtml}
            </pre>
            <p className="mt-2 text-xs text-[var(--muted)]">
              Paste inside your website&apos;s HTML. Works on any site — WordPress, Webflow, Wix, or plain HTML.
            </p>
          </Card>

          <Card>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-[var(--payout-blue)]">
                  <Code2 size={14} />
                </div>
                <p className="font-semibold text-[var(--foreground)]">Embed checkout (iframe)</p>
              </div>
              <CopySnippet snippet={snippetIframe} />
            </div>
            <pre className="overflow-x-auto rounded-lg bg-[var(--payout-navy)] p-4 text-xs leading-relaxed text-slate-300 whitespace-pre-wrap">
              {snippetIframe}
            </pre>
            <p className="mt-2 text-xs text-[var(--muted)]">
              Embed the full checkout experience directly on your page.
            </p>
          </Card>
        </div>
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
