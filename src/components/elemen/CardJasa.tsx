"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { formatRupiah } from "@/lib/format";
import { RatingRingkas } from "./Rating";

/**
 * CardJasa — Figma "Card" Type=Jasa (18:91). Listing jasa di I-05 Pencarian dan I-07 Bookmark.
 * Bookmark disembunyikan jika onBookmark tidak diisi (mis. untuk Penyedia Jasa).
 */
type Props = {
  href: string;
  judul: string;
  kategori: string;
  namaPenyedia: string;
  harga: number;
  rating?: number;
  jumlahUlasan?: number;
  gambarUrl?: string;
  avatarUrl?: string;
  bookmarked?: boolean;
  onBookmark?: () => void;
  className?: string;
};

export function CardJasa({
  href,
  judul,
  kategori,
  namaPenyedia,
  harga,
  rating,
  jumlahUlasan,
  gambarUrl,
  avatarUrl,
  bookmarked,
  onBookmark,
  className,
}: Props) {
  return (
    <article
      className={cn(
        "relative flex w-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-shadow hover:shadow-[0_8px_24px_rgba(28,17,69,0.08)]",
        className,
      )}
    >
      <Link href={href} className="flex flex-col">
        <div className="relative h-[168px] w-full bg-brand-subtle">
          {gambarUrl && <Image src={gambarUrl} alt="" fill sizes="(max-width: 768px) 100vw, 300px" className="object-cover" />}
        </div>
        <div className="flex flex-col gap-2 p-4">
          <span className="self-start rounded-full bg-accent-subtle px-[10px] py-1 text-caption text-on-accent">
            {kategori}
          </span>
          <h3 className="line-clamp-2 text-h4 text-ink">{judul}</h3>
          <span className="flex items-center gap-2">
            <Image
              src={avatarUrl || "/icons/avatar-kecil.svg"}
              alt=""
              width={24}
              height={24}
              className="size-6 rounded-full object-cover"
            />
            <span className="truncate text-body-sm text-ink-muted">{namaPenyedia}</span>
          </span>
          <span className="flex items-center justify-between pt-1">
            {rating !== undefined ? <RatingRingkas nilai={rating} jumlah={jumlahUlasan} /> : <span />}
            <span className="text-h4 text-brand-text">{formatRupiah(harga)}</span>
          </span>
        </div>
      </Link>

      {onBookmark && (
        <button
          type="button"
          onClick={onBookmark}
          aria-pressed={bookmarked}
          aria-label={bookmarked ? "Hapus dari bookmark" : "Simpan ke bookmark"}
          className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-surface hover:bg-canvas"
        >
          <Image
            src={bookmarked ? "/icons/card-bookmark-aktif.svg" : "/icons/card-bookmark.svg"}
            alt=""
            width={18}
            height={18}
          />
        </button>
      )}
    </article>
  );
}
