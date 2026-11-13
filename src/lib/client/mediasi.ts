import { api } from "@/lib/api";

export type PeranMediasi = "ADMIN" | "PELAPOR" | "TERLAPOR";

type Orang = { id: string; nama: string } | null;

export type PesanMediasi = {
  id_pesan: string;
  id_sesi_mediasi: string;
  id_pengirim: string;
  nama_pengirim: string;
  peran_di_mediasi: PeranMediasi;
  isi_pesan: string;
  waktu_kirim: string;
};

export type SesiMediasi = {
  id_sesi_mediasi: string;
  id_tiket: string;
  id_admin: string;
  status_sesi: "BERLANGSUNG" | "SELESAI" | string;
  waktu_mulai: string;
  waktu_selesai: string | null;
  nama_admin: string;
  tiket_laporan: {
    id_tiket: string;
    id_pesanan: string;
    id_pelapor: string;
    id_terlapor: string | null;
    deskripsi_laporan: string;
    status_tiket?: string;
    pelapor: Orang;
    terlapor: Orang;
  } | null;
};

export type RingkasanMediasi = SesiMediasi & {
  pesan_terakhir: string | null;
  waktu_pesan_terakhir: string;
};

export type DetailMediasi = {
  sesi: SesiMediasi;
  pesan: PesanMediasi[];
  peran_saya: PeranMediasi;
};

type Respons<T> = { success: true; message: string; data: T };

/** GET /api/mediasi — ruang mediasi yang diikuti user login */
export async function ambilDaftarMediasi() {
  const respons = await api<Respons<RingkasanMediasi[]>>("/api/mediasi");
  return respons.data;
}

/** GET /api/mediasi/[id] — detail sesi & riwayat pesan */
export async function ambilDetailMediasi(id_sesi_mediasi: string) {
  const respons = await api<Respons<DetailMediasi>>(`/api/mediasi/${encodeURIComponent(id_sesi_mediasi)}`);
  return respons.data;
}

/** POST /api/mediasi/[id] — kirim pesan ke ruang mediasi */
export async function kirimPesanMediasi(id_sesi_mediasi: string, isi_pesan: string) {
  await api(`/api/mediasi/${encodeURIComponent(id_sesi_mediasi)}`, {
    method: "POST",
    body: { isi_pesan: isi_pesan.trim() },
  });
}

/** POST /api/admin/laporan/[id_tiket]/mediasi — admin membuka (atau membuka kembali) ruang mediasi */
export async function mulaiMediasi(id_tiket: string) {
  const respons = await api<Respons<{ is_new: boolean; sesi: { id_sesi_mediasi: string } }>>(
    `/api/admin/laporan/${encodeURIComponent(id_tiket)}/mediasi`,
    { method: "POST" },
  );
  return respons.data.sesi.id_sesi_mediasi;
}

/** PATCH /api/admin/mediasi/[id]/selesai — admin mengakhiri mediasi */
export async function akhiriMediasi(id_sesi_mediasi: string) {
  await api(`/api/admin/mediasi/${encodeURIComponent(id_sesi_mediasi)}/selesai`, { method: "PATCH" });
}