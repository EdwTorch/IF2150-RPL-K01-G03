import { api } from "@/lib/api";
import { unggahBerkasHasil } from "@/lib/client/deliverables";

/** Sama dengan select di UlasanService.getUlasanJasaById() */
export type UlasanJasa = {
  id_ulasan: string;
  rating: number;
  komentar?: string | null;
  created_at: string;
  id_pengguna_jasa: string;
  nama_pengguna?: string; // BELUM dikirim backend
};

type Respons<T> = { success: true; data: T };

/** GET /api/ulasan?id_jasa= → { ulasan, total } */
export async function ambilUlasanJasa(id_jasa: string) {
  const respons = await api<Respons<{ ulasan: UlasanJasa[]; total: number }>>(
    `/api/ulasan?id_jasa=${encodeURIComponent(id_jasa)}`,
  );
  return respons.data;
}


/**
 * C47 kirimUlasan() → POST /api/ulasan
 * Dokumentasi (opsional, 1 berkas) diunggah dulu ke folder pesanan ini.
 */
export async function kirimUlasan(
  id_pesanan: string,
  isian: { rating: number; komentar?: string; dokumentasi?: File | null },
) {
  const dokumentasi_url = isian.dokumentasi ? await unggahBerkasHasil(id_pesanan, isian.dokumentasi) : undefined;

  await api("/api/ulasan", {
    method: "POST",
    body: {
      id_pesanan,
      rating: isian.rating,
      komentar: isian.komentar?.trim() || undefined,
      dokumentasi_url,
    },
  });
}