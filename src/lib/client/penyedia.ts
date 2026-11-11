import { mockAmbilProfilPenyedia } from "@/lib/mock/penyedia";

/** Data "Tentang penyedia" di detail jasa (tabel pengguna + penyedia_jasa) */
export type ProfilPenyedia = {
  id: string;
  nama: string;
  pengalaman: string[];
  prestasi: string[];
};

/**
 * Backend BELUM punya endpoint profil penyedia → mock.
 * Kalau sudah ada (mis. GET /api/penyedia/[id]), ubah PROFIL_PENYEDIA_SUDAH_ADA = true.
 */
const PROFIL_PENYEDIA_SUDAH_ADA = false;

export async function ambilProfilPenyedia(id_penyedia_jasa: string): Promise<ProfilPenyedia> {
  if (!PROFIL_PENYEDIA_SUDAH_ADA) return mockAmbilProfilPenyedia(id_penyedia_jasa);
  throw new Error("Endpoint profil penyedia belum tersedia");
}