export function StatCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white/92 p-5 shadow-[0_20px_60px_rgba(15,37,68,0.08)]">
      <div className="mb-4 h-1.5 w-12 rounded-full bg-[var(--payout-blue)]" />
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{helper}</p>
    </div>
  );
}
