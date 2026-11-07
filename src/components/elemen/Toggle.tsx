"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

/**
 * Toggle — Figma "Toggle" (18:67). Saklar on/off untuk pengaturan yang langsung berlaku
 * (mis. status aktif jasa). Pakai bersama label teks.
 */
type Props = {
  aktif: boolean;
  onUbah: (aktif: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
};

export function Toggle({ aktif, onUbah, label, disabled, className }: Props) {
  const id = useId();
  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={aktif}
        disabled={disabled}
        onClick={() => onUbah(!aktif)}
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed",
          aktif ? (disabled ? "bg-brand-disabled" : "bg-brand") : disabled ? "bg-disabled" : "bg-toggle-off",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "absolute top-[3px] left-[3px] size-[22px] rounded-full bg-white shadow-[0_1px_3px_rgba(28,17,69,0.2)] transition-transform",
            aktif && "translate-x-5",
          )}
        />
      </button>
      {label && (
        <label htmlFor={id} className={cn("text-label", disabled ? "text-ink-disabled" : "text-ink")}>
          {label}
        </label>
      )}
    </div>
  );
}
