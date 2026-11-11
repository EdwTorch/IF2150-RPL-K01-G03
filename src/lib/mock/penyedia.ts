import type { ProfilPenyedia } from "@/lib/client/penyedia";

/** MOCK SEMENTARA — data fiktif. Hapus kalau backend profil penyedia sudah ada. */
const tunggu = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function mockAmbilProfilPenyedia(id_penyedia_jasa: string): Promise<ProfilPenyedia> {
  await tunggu(300);
  return {
    id: id_penyedia_jasa,
    nama: "Budi Santoso",
    pengalaman: ["Desainer grafis lepas, 2023–sekarang", "Staf desain di [Studio Fiktif], 2021–2023"],
    prestasi: ["Juara 2 lomba desain poster [Kampus Fiktif] 2024"],
  };
}