import { api } from "@/lib/api";
import { unggahBerkas } from "@/lib/client/upload";

/** Sama dengan services/portofolio.service.ts */
export type KaryaPortofolio = {
  id_portofolio: string;
  judul: string;
  deskripsi: string | null;
  berkas_pendukung: string | null;
  created_at?: string;
};

export type DataPortofolio = {
  pengalaman: string[];
  prestasi: string[];
  daftar_karya: KaryaPortofolio[];
};

export type IsianPortofolio = {
  judul: string;
  deskripsi: string;
  pengalaman: string[];
  prestasi: string[];
  berkas_pendukung: File;
};

/** Sama dengan validasi /api/upload (folder "portofolio") dan DPPL I-03 */
export const FORMAT_BERKAS_PORTOFOLIO = ["jpg", "jpeg", "png", "pdf"];
export const MAKS_MB_PORTOFOLIO = 10;

type Respons<T> = { success: true; message: string; data: T };

/** tampilkanPortofolio() → GET /api/portofolio */
export async function ambilPortofolio() {
  return (await api<Respons<DataPortofolio>>("/api/portofolio")).data;
}

/**
 * kirimPortofolio(data) — Algo-0801:
 * 1) unggah berkas → POST /api/upload (folder "portofolio")
 * 2) simpan karya + pengalaman/prestasi → POST /api/portofolio
 */
export async function simpanPortofolio(isian: IsianPortofolio) {
  const { url } = await unggahBerkas(isian.berkas_pendukung, "portofolio");
  const respons = await api<Respons<DataPortofolio>>("/api/portofolio", {
    method: "POST",
    body: {
      judul: isian.judul.trim(),
      deskripsi: isian.deskripsi.trim(),
      berkas_pendukung: url,
      pengalaman: isian.pengalaman,
      prestasi: isian.prestasi,
    },
  });
  return respons.data;
}