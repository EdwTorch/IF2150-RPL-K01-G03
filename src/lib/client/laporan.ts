import { api } from "@/lib/api";
import { unggahBerkasHasil } from "@/lib/client/deliverables";

/** Sama dengan models/types.ts → TiketLaporan */
export type TiketLaporan = {
  id_tiket: string;
  id_pesanan: string;
  id_pelapor: string;
  id_terlapor: string | null;
  kategori: string[];
  deskripsi_laporan: string;
  url_bukti: string[];
  status_tiket: string;
  tanggapan_admin?: string | null;
  created_at: string;
};

/** Batas di PelaporanService.validateUrlBukti() */
export const MAKS_BUKTI_LAPORAN = 3;

type Respons<T> = { success: true; message: string; data: T };

/**
 * C44 kirimLaporan() → POST /api/pesanan/[id_pesanan]/laporan
 * Bukti diunggah dulu (folder deliverables pesanan ini), lalu URL-nya dikirim.
 */
export async function kirimLaporan(
  id_pesanan: string,
  isian: { kategori: string; deskripsi: string; bukti: File[] },
) {
  const url_bukti = await Promise.all(isian.bukti.map((b) => unggahBerkasHasil(id_pesanan, b)));

  const respons = await api<Respons<TiketLaporan>>(`/api/pesanan/${encodeURIComponent(id_pesanan)}/laporan`, {
    method: "POST",
    body: {
      kategori: [isian.kategori],
      deskripsi_laporan: isian.deskripsi.trim(),
      url_bukti,
    },
  });
  return respons.data;
}