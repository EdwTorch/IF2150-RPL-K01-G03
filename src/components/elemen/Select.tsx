"use client";

import Image from "next/image";
import { useId, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { Field, kelasKotak } from "./Field";

/**
 * Select — Figma "Select" (6:88). Memakai <select> bawaan browser supaya aksesibel.
 * Contoh:
 *   <Select label="Kategori" placeholder="Pilih kategori"
 *           opsi={[{ value: "desain", label: "Desain Grafis" }]} />
 */
export type OpsiSelect = { value: string; label: string };

type Props = Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  label?: string;
  helper?: string;
  error?: string;
  placeholder?: string;
  opsi: OpsiSelect[];
  wrapperClassName?: string;
};

export function Select({
  label,
  helper,
  error,
  placeholder,
  opsi,
  id,
  required,
  className,
  wrapperClassName,
  value,
  defaultValue,
  ...sisa
}: Props) {
  const otomatis = useId();
  const idInput = id ?? otomatis;
  const terkontrol = value !== undefined;
  return (
    <Field id={idInput} label={label} helper={helper} error={error} wajib={required} className={wrapperClassName}>
      <div className="relative w-full">
        <select
          id={idInput}
          required={required}
          aria-invalid={!!error || undefined}
          aria-describedby={error || helper ? `${idInput}-pesan` : undefined}
          {...(terkontrol ? { value } : { defaultValue: defaultValue ?? (placeholder ? "" : undefined) })}
          className={cn(
            kelasKotak(!!error),
            "h-12 cursor-pointer appearance-none pr-11 invalid:text-ink-placeholder",
            className,
          )}
          {...sisa}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {opsi.map((o) => (
            <option key={o.value} value={o.value} className="text-ink">
              {o.label}
            </option>
          ))}
        </select>
        <Image
          src="/icons/chevron-down.svg"
          alt=""
          width={20}
          height={20}
          className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2"
        />
      </div>
    </Field>
  );
}
