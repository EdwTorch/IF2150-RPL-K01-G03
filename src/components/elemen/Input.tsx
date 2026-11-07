"use client";

import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Field, kelasKotak } from "./Field";

/**
 * Input — Figma "Input" (6:50). State Default · Focus · Error.
 * Contoh: <Input label="Email" type="email" error={fieldError.email} />
 */
type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helper?: string;
  error?: string;
  /** Teks/ikon di depan isian, mis. "Rp" */
  awalan?: ReactNode;
  wrapperClassName?: string;
};

export function Input({ label, helper, error, awalan, id, required, className, wrapperClassName, ...sisa }: Props) {
  const otomatis = useId();
  const idInput = id ?? otomatis;
  return (
    <Field id={idInput} label={label} helper={helper} error={error} wajib={required} className={wrapperClassName}>
      <div className="relative w-full">
        {awalan && (
          <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-body text-ink-muted">
            {awalan}
          </span>
        )}
        <input
          id={idInput}
          required={required}
          aria-invalid={!!error || undefined}
          aria-describedby={error || helper ? `${idInput}-pesan` : undefined}
          className={cn(kelasKotak(!!error), "h-12", awalan ? "pl-11" : undefined, className)}
          {...sisa}
        />
      </div>
    </Field>
  );
}
