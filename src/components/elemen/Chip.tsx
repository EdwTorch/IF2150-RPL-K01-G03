import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Chip — pilihan filter (Figma C15: "≤ 1 hari", "★ 4+").
 * Terpilih: latar ungu muda + garis ungu.
 */
type Props = ButtonHTMLAttributes<HTMLButtonElement> & { terpilih?: boolean };

export function Chip({ terpilih, className, children, type = "button", ...sisa }: Props) {
  return (
    <button
      type={type}
      aria-pressed={terpilih}
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border-[1.5px] px-[14px] py-[9px] text-label leading-normal whitespace-nowrap transition-colors",
        terpilih
          ? "border-brand bg-brand-subtle text-brand-text"
          : "border-line-input bg-white text-ink hover:border-line-strong hover:bg-canvas",
        className,
      )}
      {...sisa}
    >
      {children}
    </button>
  );
}
