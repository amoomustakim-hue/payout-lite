const questions = [
  "How much did I receive today?",
  "Which payment source performed best?",
  "Which invoices are unpaid?",
  "Summarize my payments this week.",
];

export default function AiCfoPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-8">
      <h1 className="text-3xl font-bold text-slate-950">AI CFO</h1>
      <p className="mt-2 text-slate-600">Groq-powered summaries grounded only in the business transaction data.</p>
      <section className="mt-6 rounded-lg border border-[var(--border)] bg-white p-5">
        <div className="grid gap-3 md:grid-cols-2">
          {questions.map((question) => (
            <button key={question} className="rounded-md border border-[var(--border)] px-4 py-3 text-left font-medium text-slate-700 hover:border-[var(--payout-blue)]">
              {question}
            </button>
          ))}
        </div>
        <textarea className="mt-5 min-h-32 w-full rounded-md border border-[var(--border)] px-4 py-3" placeholder="Ask about your payments..." />
        <button className="mt-3 rounded-md bg-[var(--payout-blue)] px-4 py-3 font-semibold text-white">Ask AI CFO</button>
      </section>
    </main>
  );
}
