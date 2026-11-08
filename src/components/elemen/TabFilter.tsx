"use client";

import { cn } from "@/lib/cn";

/**
 * TabFilter — tab status berbentuk pill (Figma C30: Semua · Berjalan · Selesai · Dikembalikan).
 * Contoh: <TabFilter opsi={["Semua","Berjalan"]} nilai={tab} onUbah={setTab} />
 */
type Props<T extends string> = {
  opsi: readonly T[];
  nilai: T;
  onUbah: (nilai: T) => void;
  label?: string;
  className?: string;
};

export function TabFilter<T extends string>({ opsi, nilai, onUbah, label = "Filter", className }: Props<T>) {
  return (
    <div role="tablist" aria-label={label} className={cn("flex flex-wrap items-start gap-2", className)}>
      {opsi.map((o) => {
        const aktif = o === nilai;
        return (
          <button
            key={o}
            type="button"
            role="tab"
            aria-selected={aktif}
            onClick={() => onUbah(o)}
            className={cn(
              "rounded-full px-4 py-2 text-label whitespace-nowrap transition-colors",
              aktif ? "bg-brand text-on-brand" : "border border-line bg-surface text-ink hover:bg-canvas",
            )}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}
