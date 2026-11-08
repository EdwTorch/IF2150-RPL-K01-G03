import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * LampiranBukti — Figma "Lampiran Bukti" (78:241). Baris berkas/gambar/tautan
 * dengan tombol lihat (lime) dan unduh. Dipakai di I-14 Deliverables, I-18 Mediasi, chat.
 */
type Props = {
  tipe: "berkas" | "gambar" | "tautan";
  nama: string;
  /** mis. "Dokumen PDF · 1,2 MB" atau "fileURL · tautan eksternal" */
  keterangan?: string;
  /** Alamat untuk melihat (dibuka di tab baru) */
  hrefLihat: string;
  /** Alamat unduh. Tidak dipakai untuk tipe "tautan". Default sama dengan hrefLihat. */
  hrefUnduh?: string;
  className?: string;
};

const IKON = { berkas: "/icons/lampiran.svg", gambar: "/icons/gambar.svg", tautan: "/icons/tautan.svg" };

export function LampiranBukti({ tipe, nama, keterangan, hrefLihat, hrefUnduh, className }: Props) {
  return (
    <div
      className={cn(
        "flex w-full items-center gap-[14px] rounded-lg border border-line bg-surface px-[14px] py-3",
        className,
      )}
    >
      <span
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-field",
          tipe === "tautan" ? "bg-accent-subtle" : "bg-brand-subtle",
        )}
      >
        <Image src={IKON[tipe]} alt="" width={24} height={24} />
      </span>

      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-label text-ink">{nama}</span>
        {keterangan && <span className="truncate text-caption text-ink-muted">{keterangan}</span>}
      </span>

      <span className="flex shrink-0 items-start gap-2">
        <a
          href={hrefLihat}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Lihat ${nama}`}
          className="flex size-10 items-center justify-center rounded-field bg-accent hover:bg-accent-hover"
        >
          <Image src="/icons/lihat.svg" alt="" width={20} height={20} />
        </a>
        {tipe !== "tautan" && (
          <a
            href={hrefUnduh ?? hrefLihat}
            download
            aria-label={`Unduh ${nama}`}
            className="flex size-10 items-center justify-center rounded-field bg-canvas hover:bg-muted"
          >
            <Image src="/icons/unduh.svg" alt="" width={20} height={20} />
          </a>
        )}
      </span>
    </div>
  );
}
