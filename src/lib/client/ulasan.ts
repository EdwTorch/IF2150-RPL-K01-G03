import { api } from "@/lib/api";

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