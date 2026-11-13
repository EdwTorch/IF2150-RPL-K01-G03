
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


/** Sama dengan JenisTindakan di services/pelaporan.service.ts */
export type JenisTindakan = "PERINGATAN" | "SUSPEND_AKUN" | "LAPORAN_DITOLAK";

/** GET /api/admin/laporan/[id_tiket] → detail tiket untuk C50 */
export async function ambilDetailTiketAdmin(id_tiket: string): Promise<TiketAdmin> {
  const respons = await api<Respons<TiketAdmin>>(`/api/admin/laporan/${encodeURIComponent(id_tiket)}`);
  return respons.data;
}

/** POST /api/admin/laporan/[id_tiket]/tanggapan → keputusan + catatan, tiket jadi Selesai */
export async function kirimTanggapanAdmin(
  id_tiket: string,
  isian: { jenis_tindakan: JenisTindakan; catatan_tanggapan: string },
) {
  await api(`/api/admin/laporan/${encodeURIComponent(id_tiket)}/tanggapan`, {
    method: "POST",
    body: { jenis_tindakan: isian.jenis_tindakan, catatan_tanggapan: isian.catatan_tanggapan.trim() },
  });
}

/** POST /api/admin/laporan/[id_tiket]/mediasi → buka sesi mediasi, tiket jadi Mediasi */
export async function mulaiMediasiAdmin(id_tiket: string) {
  await api(`/api/admin/laporan/${encodeURIComponent(id_tiket)}/mediasi`, { method: "POST" });
}
