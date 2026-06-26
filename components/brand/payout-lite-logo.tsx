import Link from "next/link";

export function PayoutLiteLogo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 font-bold text-slate-950">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--payout-blue)] text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(33,107,255,0.22)]">
        PL
      </span>
      <span className="leading-tight">
        <span className="block text-base">Payout Lite</span>
        <span className="block text-xs font-semibold text-[var(--payout-blue)]">Nomba powered</span>
      </span>
    </Link>
  );
}
