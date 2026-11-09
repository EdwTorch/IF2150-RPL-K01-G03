"use client";

import { useId, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { Field, kelasKotak } from "./Field";

/**
 * Textarea — Figma "Textarea" (6:66). Dipakai untuk brief, deskripsi, komentar.
 * Isi `penghitung` untuk menampilkan jumlah karakter/kata di kanan bawah.
 */
type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  helper?: string;
  error?: string;
  /** Teks penghitung, mis. "120/300 kata" */
  penghitung?: string;
  wrapperClassName?: string;
};

export function Textarea({ label, helper, error, penghitung, id, required, className, wrapperClassName, rows = 4, ...sisa }: Props) {
  const otomatis = useId();
  const idInput = id ?? otomatis;
  return (
    <Field id={idInput} label={label} helper={helper} error={error} wajib={required} className={wrapperClassName}>
      <textarea
        id={idInput}
        rows={rows}
        required={required}
        aria-invalid={!!error || undefined}
        aria-describedby={error || helper ? `${idInput}-pesan` : undefined}
        className={cn(kelasKotak(!!error), "min-h-[120px] resize-y py-[14px]", className)}
        {...sisa}
      />
      {penghitung && <span className="self-end text-helper text-ink-muted">{penghitung}</span>}
    </Field>
  );
}
