import { ApiError } from "@/lib/api";
import type { IsianJasa, Jasa } from "@/lib/client/jasa";

/** MOCK FRONTEND — untuk mengerjakan tampilan tanpa login. Nama jasa "error" → error server */
const tunggu = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function mockUnggahJasa(isian: IsianJasa): Promise<Jasa> {
  await tunggu(800);
  if (isian.nama_jasa.trim().toLowerCase() === "error")
    throw new ApiError(500, "DATABASE_ERROR", "Penawaran jasa gagal diunggah. Coba lagi.");
  return {
    id_jasa: `jasa-${Date.now()}`,
    id_penyedia_jasa: "penyedia-mock",
    nama_jasa: isian.nama_jasa,
    deskripsi: isian.deskripsi,
    kategori: isian.kategori,
    harga: isian.harga,
    berkas_pendukung: [],
    status_aktif: true,
  };
}