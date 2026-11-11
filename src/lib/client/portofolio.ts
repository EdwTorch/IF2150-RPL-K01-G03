import { api } from "@/lib/api";
import { mockAmbilPortofolio, mockSimpanPortofolio } from "@/lib/mock/portofolio";

/** DRAF — samakan dengan backend kalau route portofolio sudah dibuat */
export type BerkasKarya = {
  nama: string;
  ukuran: number; // byte
  tipe: string; // mime type, mis. "image/png"
  url: string;
};

export type KaryaPortofolio = {
  id: string;
  judul: string;
  deskripsi: string;
  berkas_pendukung: BerkasKarya;
};

export type DataPortofolio = {
  pengalaman: string; // satu baris = satu pengalaman
  prestasi: string; // satu baris = satu prestasi
  daftar_karya: KaryaPortofolio[];
};

export type IsianPortofolio = {
  judul: string;
  deskripsi: string;
  pengalaman: string;
  prestasi: string;
  berkas_pendukung: File | null;
};

const PORTOFOLIO_SUDAH_ADA = false; // ubah jadi true kalau backend sudah siap

/** tampilkanPortofolio() — ambil data portofolio penyedia yang sedang login */
export function ambilPortofolio() {
  if (!PORTOFOLIO_SUDAH_ADA) return mockAmbilPortofolio();
  return api<DataPortofolio>("/api/portofolio");
}

/** kirimPortofolio(data) — dikirim sebagai FormData karena ada berkas */
export function simpanPortofolio(isian: IsianPortofolio) {
  if (!PORTOFOLIO_SUDAH_ADA) return mockSimpanPortofolio(isian);

  const form_data = new FormData();
  form_data.append("judul", isian.judul);
  form_data.append("deskripsi", isian.deskripsi);
  form_data.append("pengalaman", isian.pengalaman);
  form_data.append("prestasi", isian.prestasi);
  if (isian.berkas_pendukung) form_data.append("berkas_pendukung", isian.berkas_pendukung);

  return api<DataPortofolio>("/api/portofolio", { method: "POST", body: form_data });
}