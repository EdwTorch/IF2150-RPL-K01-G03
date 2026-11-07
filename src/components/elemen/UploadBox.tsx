"use client";

import Image from "next/image";
import { useId, useRef, useState, type DragEvent } from "react";
import { cn } from "@/lib/cn";
import { formatUkuranBerkas } from "@/lib/format";

/**
 * UploadBox — Figma "Upload Box" (6:101). Klik atau tarik-lepas berkas.
 * Validasi format & ukuran dilakukan di sini (sisi klien); server tetap memvalidasi ulang.
 *
 * Contoh (portofolio, maks. 5 berkas × 20 MB):
 *   const [berkas, setBerkas] = useState<File[]>([]);
 *   <UploadBox label="Berkas pendukung" format={["jpg","jpeg","png","pdf"]}
 *              maksMB={20} maksBerkas={5} berkas={berkas} onUbah={setBerkas} />
 */
type Props = {
  berkas: File[];
  onUbah: (berkas: File[]) => void;
  /** Ekstensi tanpa titik, huruf kecil. Contoh: ["jpg","jpeg","png","pdf"] */
  format: string[];
  maksMB: number;
  maksBerkas?: number;
  label?: string;
  judul?: string;
  /** Teks kecil di bawah judul. Default dibuat dari format & maksMB. */
  petunjuk?: string;
  /** Error dari server/form (mis. "Wajib mengunggah berkas") */
  error?: string;
  wajib?: boolean;
  disabled?: boolean;
  className?: string;
};

function teksFormat(format: string[]) {
  const unik = Array.from(new Set(format.map((f) => (f === "jpeg" ? "jpg" : f).toUpperCase())));
  if (unik.length <= 1) return unik.join("");
  return `${unik.slice(0, -1).join(", ")}, atau ${unik[unik.length - 1]}`;
}

export function UploadBox({
  berkas,
  onUbah,
  format,
  maksMB,
  maksBerkas = 1,
  label,
  judul = "Tarik berkas ke sini atau pilih berkas",
  petunjuk,
  error,
  wajib,
  disabled,
  className,
}: Props) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [seret, setSeret] = useState(false);
  const [errorLokal, setErrorLokal] = useState("");

  const accept = format.map((f) => `.${f}`).join(",");
  const teksPetunjuk = petunjuk ?? `${teksFormat(format)} · maks. ${maksMB} MB${maksBerkas > 1 ? ` · maks. ${maksBerkas} berkas` : ""}`;
  const penuh = berkas.length >= maksBerkas;

  function tambah(daftar: FileList | null) {
    if (!daftar || daftar.length === 0) return;
    setErrorLokal("");
    const baru: File[] = [];
    for (const f of Array.from(daftar)) {
      const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
      if (!format.includes(ext)) {
        setErrorLokal(`Format "${f.name}" tidak didukung. Gunakan ${teksFormat(format)}.`);
        continue;
      }
      if (f.size > maksMB * 1024 * 1024) {
        setErrorLokal(`"${f.name}" terlalu besar. Maksimal ${maksMB} MB.`);
        continue;
      }
      baru.push(f);
    }
    const gabung = maksBerkas === 1 ? baru.slice(0, 1) : [...berkas, ...baru];
    if (gabung.length > maksBerkas) setErrorLokal(`Maksimal ${maksBerkas} berkas.`);
    if (baru.length > 0) onUbah(gabung.slice(0, maksBerkas));
    if (inputRef.current) inputRef.current.value = "";
  }

  function onDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setSeret(false);
    if (!disabled) tambah(e.dataTransfer.files);
  }

  const pesan = error || errorLokal;

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      {label && (
        <span className="text-label leading-normal text-ink">
          {label}
          {wajib && <span className="text-danger"> *</span>}
        </span>
      )}

      {!(penuh && maksBerkas > 1) && (
        <label
          htmlFor={id}
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setSeret(true);
          }}
          onDragLeave={() => setSeret(false)}
          onDrop={onDrop}
          className={cn(
            "flex h-[168px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-field border-[1.5px] border-dashed px-6 text-center transition-colors",
            seret ? "border-brand bg-muted" : "border-line-upload bg-brand-subtle hover:bg-muted",
            pesan && "border-danger",
            disabled && "cursor-not-allowed opacity-60",
          )}
        >
          <Image src="/icons/upload.svg" alt="" width={28} height={28} />
          <span className="text-body-md font-semibold text-ink">{judul}</span>
          <span className="text-helper font-normal text-ink-muted">{teksPetunjuk}</span>
          <input
            ref={inputRef}
            id={id}
            type="file"
            accept={accept}
            multiple={maksBerkas > 1}
            disabled={disabled}
            onChange={(e) => tambah(e.target.files)}
            className="sr-only"
          />
        </label>
      )}

      {berkas.length > 0 && (
        <ul className="flex w-full flex-col gap-2">
          {berkas.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="flex items-center gap-3 rounded-lg border border-line bg-surface px-[14px] py-3"
            >
              <Image src="/icons/lampiran.svg" alt="" width={20} height={20} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-label text-ink">{f.name}</span>
                <span className="block text-caption text-ink-muted">{formatUkuranBerkas(f.size)}</span>
              </span>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onUbah(berkas.filter((_, j) => j !== i))}
                className="rounded-sm px-2 py-1 text-label text-danger hover:bg-danger-subtle"
              >
                Hapus
              </button>
            </li>
          ))}
        </ul>
      )}

      {pesan && (
        <p role="alert" className="text-helper text-danger">
          {pesan}
        </p>
      )}
    </div>
  );
}
