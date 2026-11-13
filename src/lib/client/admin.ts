import { api } from "@/lib/api";

/** Data tiket laporan dari backend */
export type TiketAdmin = {
  id_tiket: string;
  id_pesanan: string;
  id_pelapor: string;
  id_terlapor: string | null;
  kategori: string[];
  deskripsi_laporan: string;
  url_bukti: string[];
  status_tiket: string;
  created_at: string;

  pelapor: {
    nama: string;
    email: string;
  } | null;

  terlapor: {
    nama: string;
    email: string;
  } | null;

  pesanan?: {
    id_pesanan: string;
    total_biaya: number;
    status_pesanan: string;
  } | null;

  tanggapan_laporan: {
    id_tanggapan?: string;
    jenis_tindakan: string;
    catatan_tanggapan: string;
    created_at?: string;
  }[];
};

type Respons<T> = {
  success: true;
  message: string;
  data: T;
};

/** GET /api/admin/laporan */
export async function ambilDaftarTiketAdmin(): Promise<TiketAdmin[]> {
  const respons = await api<Respons<TiketAdmin[]>>(
    "/api/admin/laporan"
  );

  return respons.data;
}

/** GET /api/admin/laporan/[id_tiket] */
export async function ambilDetailTiketAdmin(
  idTiket: string
): Promise<TiketAdmin> {
  const respons = await api<Respons<TiketAdmin>>(
    `/api/admin/laporan/${encodeURIComponent(idTiket)}`
  );

  return respons.data;
}

/** POST /api/admin/laporan/[id_tiket]/tanggapan */
export async function kirimKeputusanAdmin(
  idTiket: string,
  data: {
    jenis_tindakan: "PERINGATAN" | "SUSPEND_AKUN" | "LAPORAN_DITOLAK";
    catatan_tanggapan: string;
  }
) {
  return api(
    `/api/admin/laporan/${encodeURIComponent(idTiket)}/tanggapan`,
    {
      method: "POST",
      body: data,
    }
  );
}
