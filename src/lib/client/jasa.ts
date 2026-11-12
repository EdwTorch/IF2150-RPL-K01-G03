import { api } from "@/lib/api";
import { sesiSaatIni } from "@/lib/client/auth";
import { mockUnggahJasa } from "@/lib/mock/jasa";

/** Kategori disimpan sebagai teks di kolom jasa.kategori — sepakati daftarnya dengan BE */
export const DAFTAR_KATEGORI = ["Desain Grafis", "Penulisan", "Pengembangan Web", "Video & Animasi"];

/** Sama dengan TIPE_BERKAS_DIIZINKAN & MAKS_UKURAN_BERKAS di services/jasa.service.ts */
export const FORMAT_BERKAS_JASA = ["jpg", "jpeg", "png", "webp", "gif", "mp4", "pdf"];
export const MAKS_MB_BERKAS_JASA = 10;

export type IsianJasa = {
  nama_jasa: string;
  kategori: string;

  harga: number;
  deskripsi: string;
  berkas: File[];
};

export type Jasa = {
  id_jasa: string;
  id_penyedia_jasa: string;
  nama_jasa: string;
  deskripsi: string;
  kategori: string;
  harga: number;
  berkas_pendukung: string[];
  status_aktif: boolean;
};

type Respons<T> = { success: true; message: string; data: T };

/** true = pakai mock frontend (tanpa login). false = POST /api/jasa asli (harus login) */
const PAKAI_MOCK = false;

/** klikUnggah() → POST /api/jasa → JasaController.simpanPenawaranJasa() */
export async function unggahJasa(isian: IsianJasa) {
  if (PAKAI_MOCK) return mockUnggahJasa(isian);

  // Sementara backend masih minta id_penyedia_jasa dari body (lihat komentar di app/api/jasa/route.ts)
  const { user } = await sesiSaatIni();

  const form_data = new FormData();
  form_data.append("id_penyedia_jasa", user.id);
  form_data.append("nama_jasa", isian.nama_jasa.trim());
  form_data.append("kategori", isian.kategori);
  form_data.append("harga", String(isian.harga));
  form_data.append("deskripsi", isian.deskripsi.trim());
  isian.berkas.forEach((file) => form_data.append("berkas", file));

  const respons = await api<Respons<Jasa>>("/api/jasa", { method: "POST", body: form_data });
  return respons.data;
}

/* ===================== Pencarian (I-05) ===================== */

/** Satu listing hasil GET /api/jasa (lihat models/types.ts → Jasa) */
export type JasaListing = Omit<Jasa, "berkas_pendukung" | "status_aktif"> & {
  rating_rata_rata?: number;
  berkas_pendukung?: string[];
  status_aktif?: boolean;
  created_at?: string;
};

/** Sama dengan FilterPencarian di services/pencarian.service.ts */
export type FilterPencarian = {
  keyword?: string;
  kategori?: string;
  harga_min?: number;
  harga_max?: number;
  rating_min?: number;
  sort?: "terbaru" | "harga_asc" | "harga_desc" | "rating_desc";
};

/** Sama dengan MIN_PANJANG_KEYWORD di services/pencarian.service.ts */
export const MIN_PANJANG_KEYWORD = 3;

/** klikCari() → GET /api/jasa → LayananPencarian.terapkanFilterPencarian() */
export async function cariJasa(filter: FilterPencarian = {}) {
  const params = new URLSearchParams();
  if (filter.keyword?.trim()) params.set("q", filter.keyword.trim());
  if (filter.kategori) params.set("kategori", filter.kategori);
  if (filter.harga_min) params.set("harga_min", String(filter.harga_min));
  if (filter.harga_max) params.set("harga_max", String(filter.harga_max));
  if (filter.rating_min) params.set("rating_min", String(filter.rating_min));
  if (filter.sort) params.set("sort", filter.sort);

  const query = params.toString();
  const respons = await api<Respons<JasaListing[]>>(`/api/jasa${query ? `?${query}` : ""}`);
  // harga & rating bertipe NUMERIC di Postgres — pastikan jadi number
  return respons.data.map((j) => ({ ...j, harga: Number(j.harga), rating_rata_rata: Number(j.rating_rata_rata ?? 0) }));
}

/* ===================== Detail jasa (I-06) ===================== */

/** GET /api/jasa/[id] → JasaController.ambilDetailJasa(). 404 (NOT_FOUND) kalau tidak ada */
export async function ambilDetailJasa(id_jasa: string) {
  const respons = await api<Respons<JasaListing>>(`/api/jasa/${encodeURIComponent(id_jasa)}`);
  const j = respons.data;
  return { ...j, harga: Number(j.harga), rating_rata_rata: Number(j.rating_rata_rata ?? 0) };
}