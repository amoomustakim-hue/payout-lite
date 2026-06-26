import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

const variants = {
  primary: "bg-[var(--payout-blue)] text-white shadow-[0_14px_30px_rgba(33,107,255,0.24)] hover:bg-[var(--payout-blue-dark)]",
  secondary: "border border-[var(--border)] bg-white text-slate-800 hover:border-blue-200 hover:bg-blue-50",
  ghost: "text-slate-600 hover:bg-blue-50 hover:text-[var(--payout-blue)]",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={clsx("inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-bold transition", variants[variant], className)}
      {...props}
    />
  );
}

export function ButtonLink({
  href,
  children,
  className,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: keyof typeof variants;
}) {
  return (
    <Link href={href} className={clsx("inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-bold transition", variants[variant], className)}>
      {children}
    </Link>
  );
}
