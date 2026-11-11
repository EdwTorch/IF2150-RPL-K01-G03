import { mockUnggahBerkas } from "@/lib/mock/upload";

/**
 * Unggah satu berkas, kembalikan URL-nya.
 * app/api/upload/route.ts masih KOSONG → mock. Kalau sudah ada, ubah UPLOAD_SUDAH_ADA = true
 * dan sesuaikan nama field/balasan dengan route backend.
 */
const UPLOAD_SUDAH_ADA = false;

export async function unggahBerkas(berkas: File): Promise<{ url: string; nama: string }> {
  if (!UPLOAD_SUDAH_ADA) return mockUnggahBerkas(berkas);
  throw new Error("Route upload belum tersedia");
}