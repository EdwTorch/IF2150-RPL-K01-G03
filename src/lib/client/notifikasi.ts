import { api } from "@/lib/api";

/** Sama dengan select di services/notifikasi.service.ts → getNotifikasiUser() */
export type Notifikasi = {
  id_notifikasi: string;
  id_pesanan: string | null;
  id_referensi: string | null;
  judul: string;
  pesan_notifikasi: string;
  is_read: boolean;
  created_at: string;
};

type ResponsDaftar = { result: { notifikasi: Notifikasi[]; unread_count: number } };

/** GET /api/notifikasi → 20 notifikasi terbaru + jumlah belum dibaca */
export async function ambilNotifikasi() {
  const { result } = await api<ResponsDaftar>("/api/notifikasi");
  return { notifikasi: result.notifikasi ?? [], jumlah_belum_dibaca: result.unread_count ?? 0 };
}

/** PATCH /api/notifikasi → tandai satu notifikasi sudah dibaca */
export async function tandaiDibaca(id_notifikasi: string) {
  await api("/api/notifikasi", { method: "PATCH", body: { id_notifikasi } });
}