import { SupportForm } from "@/components/support/support-form";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Mail, MessageSquare, Clock, Headphones } from "lucide-react";

export default function SupportPage() {
  return (
    <div>
      <PageHeader
        title="Support"
        description="Need help? Send us a message and we'll get back to you as soon as possible."
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        {/* Form */}
        <Card>
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-[var(--payout-blue)]">
              <MessageSquare size={14} />
            </div>
            <p className="font-semibold text-[var(--foreground)]">Send a message</p>
          </div>
          <SupportForm />
        </Card>

        {/* Sidebar info */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--payout-blue)] p-5 text-white">
            <Headphones size={22} className="mb-3 opacity-90" />
            <p className="font-bold text-base">We&apos;re here to help</p>
            <p className="mt-1 text-sm leading-relaxed opacity-85">
              Every message goes directly to our team. We aim to respond within 24 hours.
            </p>
          </div>

          {[
            {
              icon: Mail,
              title: "Email support",
              desc: "twizrrapp@gmail.com",
            },
            {
              icon: Clock,
              title: "Response time",
              desc: "Usually within 24 hours on business days.",
            },
            {
              icon: MessageSquare,
              title: "What to include",
              desc: "Describe your issue clearly, including any error messages or steps to reproduce.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-slate-50 p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white border border-[var(--border)]">
                <Icon size={14} className="text-[var(--payout-blue)]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--foreground)]">{title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-[var(--muted)]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
