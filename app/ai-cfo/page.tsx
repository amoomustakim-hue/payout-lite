import { PageHeader } from "@/components/ui/page-header";
import { AiCfoChat } from "@/components/ai-cfo/chat";
import { requireOnboardedBusiness } from "@/lib/auth/require-onboarding";

export const dynamic = "force-dynamic";

export default async function AiCfoPage() {
  await requireOnboardedBusiness();
  return (
    <div>
      <PageHeader
        title="AI CFO"
        description="Groq-powered summaries grounded in your real business transaction data."
      />
      <AiCfoChat />
    </div>
  );
}
