"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";

/** RatingRingkas — "★ 4.8 (120)" di kartu jasa dan detail jasa (Figma Card › Rating). */
export function RatingRingkas({ nilai, jumlah, className }: { nilai: number; jumlah?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <Image src="/icons/star.svg" alt="" width={16} height={16} />
      <span className="text-label text-ink">
        {nilai.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
        {jumlah !== undefined && ` (${jumlah})`}
      </span>
    </span>
  );
}

/**
 * RatingInput — 5 bintang besar untuk memberi nilai (Figma C47 Halaman Ulasan).
 * Contoh: <RatingInput nilai={rating} onUbah={setRating} />
 */
type InputProps = {
  nilai: number;
  onUbah: (nilai: number) => void;
  ukuran?: number;
  disabled?: boolean;
  className?: string;
};

export function RatingInput({ nilai, onUbah, ukuran = 40, disabled, className }: InputProps) {
  const [sorot, setSorot] = useState(0);
  const tampil = sorot || nilai;
  return (
    <div
      role="radiogroup"
      aria-label="Penilaian"
      className={cn("flex items-center gap-[5px]", className)}
      onMouseLeave={() => setSorot(0)}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={nilai === n}
          aria-label={`${n} bintang`}
          disabled={disabled}
          onClick={() => onUbah(n)}
          onMouseEnter={() => !disabled && setSorot(n)}
          className="rounded-sm disabled:cursor-not-allowed"
        >
          <Image
            src={n <= tampil ? "/icons/star.svg" : "/icons/star-outline.svg"}
            alt=""
            width={ukuran}
            height={ukuran}
            style={{ width: ukuran, height: ukuran }}
          />
        </button>
      ))}
    </div>
  );
}
