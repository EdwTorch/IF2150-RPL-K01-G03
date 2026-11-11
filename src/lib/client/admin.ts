
import { api } from "@/lib/api";

/** Data tiket laporan dari backend */
export type TiketAdmin = {
  id_tiket: string;
  id_pesanan: string;
  id_pelapor: string;
  id_terlapor: string;
  kategori: string[];
  deskripsi_laporan: string;
  url_bukti: string[];
  status_tiket: string;
  created_at: string;

  pelapor: {
    nama: string;
    email: string;
  };

  terlapor: {
    nama: string;
    email: string;
  };

  tanggapan_laporan: {
    jenis_tindakan: string;
    catatan_tanggapan: string;
  }[];
};

type Respons<T> = {
  success: true;
  message: string;
  data: T;
};

/** GET /api/mediasi → Mengambil seluruh tiket untuk dashboard Admin */
export async function ambilDaftarTiketAdmin(): Promise<TiketAdmin[]> {
  const respons = await api<Respons<TiketAdmin[]>>("/api/admin/laporan");

  return respons.data;
}
