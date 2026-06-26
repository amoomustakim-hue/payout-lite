const transactions = [
  ["INV-1007", "INVOICE", "PAID", "NGN 120,000"],
  ["QR-8082", "SHOP_QR", "PAID", "NGN 8,500"],
  ["BTN-0441", "WEBSITE_BUTTON", "PENDING", "NGN 32,000"],
  ["VA-6001", "UNIQUE_ACCOUNT", "PAID", "NGN 250,000"],
];

export default function TransactionsPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-8">
      <h1 className="text-3xl font-bold text-slate-950">Transactions</h1>
      <p className="mt-2 text-slate-600">Confirmed, pending, and failed payments from all Payout Lite sources.</p>
      <section className="mt-6 overflow-x-auto rounded-lg border border-[var(--border)] bg-white p-5">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="py-3">Reference</th>
              <th>Source</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((row) => (
              <tr key={row[0]} className="border-t border-[var(--border)]">
                {row.map((cell) => <td key={cell} className="py-3 font-medium text-slate-700">{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
