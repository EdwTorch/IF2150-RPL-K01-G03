import { api } from "@/lib/api";
import { sesiSaatIni } from "@/lib/client/auth";
import { mockUnggahJasa } from "@/lib/mock/jasa";

/** Kategori disimpan sebagai teks di kolom jasa.kategori — sepakati daftarnya dengan BE */
export const DAFTAR_KATEGORI = ["Desain Grafis", "Penulisan", "Pengembangan Web", "Video & Animasi", "Penerjemahan"];

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