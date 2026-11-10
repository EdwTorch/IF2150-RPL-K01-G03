"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * OptionCard — kartu pilihan tunggal (radio), dua gaya dari Figma:
 *   gaya="peran" → C04 Registrasi (kartu terpilih penuh ungu)
 *   gaya="radio" → C29 Pembayaran (bulatan radio + logo di kiri)
 * Kartu dengan `name` yang sama membentuk satu grup.
 */
type Props = {
  name: string;
  value: string;
  terpilih: boolean;
  onPilih: (value: string) => void;
  judul: string;
  deskripsi?: string;
  gaya?: "peran" | "radio";
  /** Elemen di kiri teks untuk gaya "radio", mis. kotak logo "VA" */
  awalan?: ReactNode;
  disabled?: boolean;
  className?: string;
};

export function OptionCard({
  name,
  value,
  terpilih,
  onPilih,
  judul,
  deskripsi,
  gaya = "peran",
  awalan,
  disabled,
  className,
}: Props) {
  const input = (
    <input
      type="radio"
      name={name}
      value={value}
      checked={terpilih}
      disabled={disabled}
      onChange={() => onPilih(value)}
      className="peer sr-only"
    />
  );

  if (gaya === "peran") {
    return (
      <label
        className={cn(
          "flex flex-1 cursor-pointer flex-col items-start gap-1 rounded-field px-4 py-[14px] transition-colors",
          "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus",
          terpilih ? "border-2 border-brand bg-brand text-on-brand" : "border border-line-input bg-white hover:bg-canvas",
          disabled && "cursor-not-allowed opacity-60",
          className,
        )}
      >
        {input}
        <span className={cn("text-body-md font-bold", terpilih ? "text-on-brand" : "text-ink")}>{judul}</span>
        {deskripsi && (
          <span className={cn("text-helper", terpilih ? "text-on-brand" : "text-ink-muted")}>{deskripsi}</span>
        )}
      </label>
    );
  }

  return (
    <label
      className={cn(
        "flex w-full cursor-pointer items-center gap-[14px] rounded-lg border bg-surface px-[18px] py-4 transition-colors",
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus",
        terpilih ? "border-brand" : "border-line hover:bg-canvas",
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      {input}
      <span
        aria-hidden
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border-2",
          terpilih ? "border-brand" : "border-line-strong",
        )}
      >
        {terpilih && <span className="size-2.5 rounded-full bg-brand" />}
      </span>
      {awalan}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-label text-ink">{judul}</span>
        {deskripsi && <span className="text-caption text-ink-muted">{deskripsi}</span>}
      </span>
    </label>
  );
}

/** Kotak logo kecil untuk OptionCard gaya "radio" (Figma C29: "VA", "EW") */
export function LogoMetode({ teks }: { teks: string }) {
  return (
    <span className="flex h-8 w-12 shrink-0 items-center justify-center rounded-sm bg-canvas text-caption text-brand-text">
      {teks}
    </span>
  );
}
