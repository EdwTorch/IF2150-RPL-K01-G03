import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Kelas bersama untuk kotak Input/Select/Textarea — Figma Input (6:50) */
export const kelasKotak = (error?: boolean) =>
  cn(
    "w-full rounded-field border bg-white px-4 text-body text-ink placeholder:text-ink-placeholder",
    "transition-shadow focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-netral-50 disabled:text-ink-disabled",
    error
      ? "border-danger shadow-[inset_0_0_0_1px_var(--color-danger)]"
      : "border-line-input focus:border-brand focus:shadow-[inset_0_0_0_1px_var(--color-brand)]",
  );

type FieldProps = {
  id: string;
  label?: string;
  /** Teks bantuan abu-abu di bawah kotak */
  helper?: string;
  /** Pesan error merah di bawah kotak (menggantikan helper) */
  error?: string;
  wajib?: boolean;
  className?: string;
  children: ReactNode;
};

/** Pembungkus label + kotak + teks bantuan/error. Dipakai Input, Textarea, Select. */
export function Field({ id, label, helper, error, wajib, className, children }: FieldProps) {
  return (
    <div className={cn("flex w-full flex-col items-start gap-2", className)}>
      {label && (
        <label htmlFor={id} className="text-label leading-normal text-ink">
          {label}
          {wajib && <span className="text-danger"> *</span>}
        </label>
      )}
      {children}
      {error ? (
        <p id={`${id}-pesan`} className="text-helper text-danger">
          {error}
        </p>
      ) : helper ? (
        <p id={`${id}-pesan`} className="text-helper text-ink-muted">
          {helper}
        </p>
      ) : null}
    </div>
  );
}
