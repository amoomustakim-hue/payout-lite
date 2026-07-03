import { PageHeader } from "@/components/ui/page-header";
import { AiCfoChat } from "@/components/ai-cfo/chat";

export default function AiCfoPage() {
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
