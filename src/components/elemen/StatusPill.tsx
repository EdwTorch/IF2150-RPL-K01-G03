import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * StatusPill — pill status di header halaman (Figma: "Status", mis. C38 "Menunggu konfirmasimu").
 * Nada warna:
 *   accent  → lime (menunggu tindakanmu)       warning → amber (revisi diminta)
 *   neutral → lavender (menunggu pihak lain)    success → hijau (selesai)
 *   danger  → merah (ditolak/gagal)             brand   → ungu (diproses)
 */
export type NadaStatus = "accent" | "warning" | "neutral" | "success" | "danger" | "brand";

const NADA: Record<NadaStatus, string> = {
  accent: "bg-accent text-on-accent",
  warning: "bg-warning-subtle text-warning",
  neutral: "bg-canvas text-ink",
  success: "bg-success-subtle text-success",
  danger: "bg-danger-subtle text-danger",
  brand: "bg-brand text-on-brand",
};

export function StatusPill({ nada = "accent", children, className }: { nada?: NadaStatus; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-caption whitespace-nowrap",
        NADA[nada],
        className,
      )}
    >
      <span aria-hidden className="size-2 rounded-full bg-current" />
      {children}
    </span>
  );
}
