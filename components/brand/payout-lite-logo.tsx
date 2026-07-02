import Link from "next/link";

export function PayoutLiteLogo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--payout-blue)]">
        <span className="text-xs font-black text-white">PL</span>
      </div>
      <div className="leading-tight">
        <p className="text-sm font-black text-[var(--foreground)]">Payout Lite</p>
        <p className="text-[11px] text-[var(--muted)]">Nomba powered</p>
      </div>
    </Link>
  );
}
