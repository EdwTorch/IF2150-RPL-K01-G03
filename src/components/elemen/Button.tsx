import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Button — Figma "Button" (18:58)
 * Style: Primary (aksi utama, 1 per layar) · Secondary (aksi pendamping)
 *        Accent (CTA pencarian/promosi) · Ghost (aksi ringan)
 * State: Default · Hover · Disabled (+ loading, tambahan untuk kode)
 */
export type ButtonVariant = "primary" | "secondary" | "accent" | "ghost";

const GAYA: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-on-brand hover:bg-brand-hover disabled:bg-disabled disabled:text-ink-disabled",
  secondary:
    "border border-line-strong bg-surface text-ink hover:bg-muted disabled:border-line disabled:bg-surface disabled:text-ink-disabled",
  accent:
    "bg-accent text-on-accent hover:bg-accent-hover disabled:bg-disabled disabled:text-ink-disabled",
  ghost: "bg-transparent text-brand-text hover:bg-brand-subtle disabled:bg-transparent disabled:text-ink-disabled",
};

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  children: ReactNode;
  variant?: ButtonVariant;
  /** Isi selebar wadah (mis. tombol di panel kanan) */
  fullWidth?: boolean;
  /** Tampilkan putaran loading dan nonaktifkan tombol */
  loading?: boolean;
  /** Jika diisi, tombol dirender sebagai link Next.js */
  href?: string;
  /** Ikon di kiri teks (mis. dari lucide-react) */
  ikon?: ReactNode;
};

export function Button({
  children,
  variant = "primary",
  fullWidth,
  loading,
  href,
  ikon,
  disabled,
  className,
  type = "button",
  ...sisa
}: Props) {
  const kelas = cn(
    "inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-md px-6 text-button whitespace-nowrap transition-colors",
    "disabled:cursor-not-allowed",
    GAYA[variant],
    fullWidth && "w-full",
    className,
  );

  const isi = (
    <>
      {loading ? (
        <span
          aria-hidden
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : (
        ikon
      )}
      {children}
    </>
  );

  if (href && !disabled && !loading) {
    return (
      <Link href={href} className={kelas}>
        {isi}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled || loading} aria-busy={loading || undefined} className={kelas} {...sisa}>
      {isi}
    </button>
  );
}
