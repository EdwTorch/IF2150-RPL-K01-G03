import { api } from "@/lib/api";

/** Sama dengan ProfilPenyedia di services/penyedia.service.ts */
export type ProfilPenyedia = {
  id: string;
  nama: string;
  pengalaman: string[];
  prestasi: string[];
  rating_rata_rata: number;
};

type Respons<T> = { success: true; message: string; data: T };

/** GET /api/penyedia/[id] — dipakai detail jasa, pemesanan, pembayaran */
export async function ambilProfilPenyedia(id_penyedia_jasa: string) {
  return (await api<Respons<ProfilPenyedia>>(`/api/penyedia/${encodeURIComponent(id_penyedia_jasa)}`)).data;
}