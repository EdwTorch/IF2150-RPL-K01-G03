import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * PageHero — header ungu di atas halaman (Figma: "Header Halaman", mis. C38 Hasil Pekerjaan).
 * Contoh:
 *   <PageHero judul="Hasil Pekerjaan" subjudul="#PSN-001 · Desain logo"
 *             status={<StatusPill nada="accent">Menunggu konfirmasimu</StatusPill>} />
 */
type Props = {
  judul: string;
  subjudul?: ReactNode;
  /** Ditaruh di kanan bawah, sejajar dasar hero (biasanya <StatusPill>) */
  status?: ReactNode;
  /** Konten tambahan di dalam hero, mis. search bar di halaman pencarian */
  children?: ReactNode;
  className?: string;
  penuh?: boolean;
};

export function PageHero({ judul, subjudul, status, children, className, penuh = false }: Props) {
  return (
    <div className={cn("flex w-full items-end justify-between gap-6", className)}>
      <div className={cn(
        "flex flex-1 flex-col gap-5 rounded-xl bg-brand px-12 py-11 text-on-brand",
        penuh ? "max-w-none" : "max-w-[872px]"
      )}>
        <div className="flex flex-col gap-2">
          <h1 className="text-h2">{judul}</h1>
          {subjudul && <p className="text-body">{subjudul}</p>}
        </div>
        {children}
      </div>
      {status}
    </div>
  );
}