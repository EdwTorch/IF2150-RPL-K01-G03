// src/lib/format.ts

/** 500000 -> "Rp 500.000" */
export function formatRupiah(n: number) {
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

/** 1258291 -> "1,2 MB" */
export function formatUkuranBerkas(byte: number) {
  if (byte < 1024) return `${byte} B`;
  if (byte < 1024 * 1024) {
    return `${(byte / 1024).toLocaleString("id-ID", { maximumFractionDigits: 0 })} KB`;
  }
  return `${(byte / (1024 * 1024)).toLocaleString("id-ID", { maximumFractionDigits: 1 })} MB`;
}

/** "500.000" / "Rp 500.000" -> 500000. Isian kosong -> 0 */
export function parseRupiah(teks: string) {
  const angka = teks.replace(/[^0-9]/g, "");
  return angka ? Number(angka) : 0;
}