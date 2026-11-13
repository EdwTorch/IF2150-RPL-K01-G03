import { api } from "@/lib/api";

/**
 * Deliverables (C36–C41) → /api/pesanan/[id_pesanan]/deliverables
 * Dipakai halaman Hasil Pekerjaan (penyedia & pengguna), Pengumpulan, dan Request Revisi.
 */

/** Sama dengan models/types.ts → ProdukAkhir */
export type ProdukAkhir = {
  id_produk_akhir: string;
  id_pesanan: string;
  deskripsi_produk: string;
  file_url: string | null;
  berkas_hasil: string[] | null;
  output_path: string | null;
  status_pemeriksaan: boolean;
  created_at: string;
};

/** Sama dengan models/types.ts → PengajuanRevisi */
export type RevisiPesanan = {
  id_revisi: string;
  id_pesanan: string;
  id_produk_akhir: string | null;
  deskripsi_revisi: string;
  pesan_revisi: string | null;
  lampiran_revisi: string | null;
  status_pengerjaan: string;
  jml_revisi_tersedia: number;
  created_at: string;
};

/** Sama dengan HasilPekerjaan di services/deliverables.service.ts */
export type HasilPekerjaan = {
  pesanan: {
    id_pesanan: string;
    id_pengguna_jasa: string;
    id_penyedia_jasa: string;
    status_pesanan: string;
    total_biaya: number;
    brief?: string;
    created_at?: string;
    nama_jasa: string;
    kategori_jasa: string | null;
    nama_pemesan: string | null;
    nama_penyedia: string | null;
  };
  deliverable: ProdukAkhir | null;
  revisi: RevisiPesanan[];
  revisi_aktif: RevisiPesanan | null;
  kuota_revisi: { total: number; terpakai: number; tersisa: number };
};

export type Lampiran = {
  nama: string;
  keterangan: string;
  tipe: "berkas" | "gambar" | "tautan";
  url: string;
};

/** Format yang diterima bucket storage saat ini (jpeg/png/pdf) */
export const FORMAT_BERKAS_HASIL = ["jpg", "jpeg", "png", "pdf"];
export const MAKS_MB_BERKAS_HASIL = 50;

type Respons<T> = { success: true; message: string; data: T };

const dasar = (id_pesanan: string) => `/api/pesanan/${encodeURIComponent(id_pesanan)}/deliverables`;

/* ===================== baca ===================== */

/** GET /api/pesanan/[id]/deliverables */
export async function ambilHasilPekerjaan(id_pesanan: string) {
  const respons = await api<Respons<HasilPekerjaan>>(dasar(id_pesanan));
  return {
    ...respons.data,
    pesanan: { ...respons.data.pesanan, total_biaya: Number(respons.data.pesanan.total_biaya) },
  };
}

/* ===================== tulis ===================== */

/** POST /api/pesanan/[id]/deliverables/upload — satu berkas, kembalikan URL-nya */
export async function unggahBerkasHasil(id_pesanan: string, berkas: File) {
  const form_data = new FormData();
  form_data.append("berkas", berkas);
  const respons = await api<Respons<{ url: string }>>(`${dasar(id_pesanan)}/upload`, {
    method: "POST",
    body: form_data,
  });
  return respons.data.url;
}

/**
 * C37 kirimHasil() — penyedia mengirim hasil (kiriman pertama maupun perbaikan revisi).
 * Berkas diunggah satu per satu dulu, lalu URL-nya dikirim bersama deskripsi & tautan.
 */
export async function kirimHasilPekerjaan(
  id_pesanan: string,
  isian: { deskripsi: string; tautan?: string; berkas: File[] },
) {
  const berkas_hasil = await Promise.all(isian.berkas.map((b) => unggahBerkasHasil(id_pesanan, b)));

  const respons = await api<Respons<ProdukAkhir>>(dasar(id_pesanan), {
    method: "POST",
    body: {
      deskripsi_produk: isian.deskripsi.trim(),
      berkas_hasil,
      output_path: isian.tautan?.trim() || undefined,
    },
  });
  return respons.data;
}

/** C38 konfirmasiSelesai() — pemesan menyetujui hasil, dana diteruskan ke penyedia */
export async function konfirmasiSelesai(id_pesanan: string) {
  await api<{ success: true; message: string }>(dasar(id_pesanan), { method: "PATCH" });
}

/** C40 ajukanRevisi() — pemesan meminta revisi atas kiriman terakhir */
export async function ajukanRevisi(
  id_pesanan: string,
  isian: { detail: string; pesan?: string; lampiran?: File | null },
) {
  const lampiran_revisi = isian.lampiran ? await unggahBerkasHasil(id_pesanan, isian.lampiran) : undefined;

  const respons = await api<Respons<RevisiPesanan>>(`${dasar(id_pesanan)}/revisi`, {
    method: "POST",
    body: {
      deskripsi_revisi: isian.detail.trim(),
      pesan_revisi: isian.pesan?.trim() || undefined,
      lampiran_revisi,
    },
  });
  return respons.data;
}

/* ===================== tampilan lampiran ===================== */

const EKSTENSI_GAMBAR = /\.(png|jpe?g|webp|gif)$/i;

/** ".../deliverables-uploads/1731-123456-logo-final.png" → "logo-final.png" */
function namaDariUrl(url: string) {
  try {
    const terakhir = decodeURIComponent(new URL(url).pathname.split("/").pop() ?? "");
    return terakhir.replace(/^\d+-\d+-/, "") || url;
  } catch {
    return url;
  }
}

function keteranganBerkas(nama: string) {
  const ekstensi = nama.split(".").pop()?.toUpperCase() ?? "";
  if (EKSTENSI_GAMBAR.test(nama)) return `Gambar · ${ekstensi}`;
  if (ekstensi === "PDF") return "Dokumen PDF";
  if (ekstensi === "ZIP") return "Arsip ZIP";
  return ekstensi ? `Berkas ${ekstensi}` : "Berkas";
}

export function lampiranDariUrl(url: string): Lampiran {
  const nama = namaDariUrl(url);
  return {
    nama,
    keterangan: keteranganBerkas(nama),
    tipe: EKSTENSI_GAMBAR.test(nama) ? "gambar" : "berkas",
    url,
  };
}

/** Berkas + tautan sebuah kiriman, siap dipakai <LampiranBukti> */
export function lampiranKiriman(produk: ProdukAkhir): Lampiran[] {
  const daftar_url = produk.berkas_hasil?.length ? produk.berkas_hasil : produk.file_url ? [produk.file_url] : [];
  const lampiran = daftar_url.map(lampiranDariUrl);

  if (produk.output_path) {
    lampiran.push({
      nama: produk.output_path,
      keterangan: "Tautan eksternal",
      tipe: "tautan",
      url: produk.output_path,
    });
  }
  return lampiran;
}
