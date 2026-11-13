import { api } from "@/lib/api";
import { sesiSaatIni } from "@/lib/client/auth";
import type { JasaListing } from "@/lib/client/jasa";

/** Sama dengan models/types.ts → Pesanan */
export type Pesanan = {
  id_pesanan: string;
  id_pengguna_jasa: string;
  id_penyedia_jasa: string;
  id_jasa: string;
  brief: string;
  total_biaya: number;
  id_metode_pembayaran?: string | null;
  status_pembayaran?: string;
  status_pesanan: string;
  created_at?: string;
  jasa?: JasaListing;

  penyedia_jasa?: {
    id: string;
    pengguna: {
      id: string;
      nama: string;
    } | null;
  } | null;

  sudah_diulas?: boolean;
  rating_ulasan?: number | null;

  /** Diisi backend untuk daftar pesanan (Pesanan Masuk penyedia) */
  nama_pemesan?: string | null;
};

export type PesananDetail = Pesanan & {
  penyedia_jasa: {
    id: string;
    pengguna: {
      id: string;
      nama: string;
    } | null;
  } | null;
  pengguna_jasa: {
    id: string;
    pengguna: {
      id: string;
      nama: string;
    } | null;
  } | null;
};

/** Sama dengan MAKS_PESANAN_AKTIF di services/pesanan.service.ts */
export const MAKS_PESANAN_AKTIF = 2;

/** Default kuota revisi di services/deliverables.service.ts */
export const KUOTA_REVISI_DEFAULT = 3;

type Respons<T> = {
  success: true;
  message: string;
  data: T;
};

type ResponsAksiPesanan = {
  success: boolean;
  message: string;
  data?: Pesanan;
};

/**
 * C31 — membuat pesanan baru
 * POST /api/pesanan
 */
export async function buatPesanan(id_jasa: string, brief: string) {
  const { user } = await sesiSaatIni();

  const respons = await api<Respons<Pesanan>>("/api/pesanan", {
    method: "POST",
    body: {
      id_pengguna_jasa: user.id,
      id_jasa,
      brief: brief.trim(),
    },
  });

  return {
    ...respons.data,
    total_biaya: Number(respons.data.total_biaya),
  };
}

/**
 * C35 — mengambil detail pesanan
 * GET /api/pesanan/[id_pesanan]
 */
export async function ambilDetailPesanan(idPesanan: string) {
  const respons = await api<Respons<PesananDetail>>(
    `/api/pesanan/${encodeURIComponent(idPesanan)}`
  );

  const p = respons.data;

  return {
    ...p,
    total_biaya: Number(p.total_biaya),
    jasa: p.jasa
      ? { ...p.jasa, harga: Number(p.jasa.harga) }
      : undefined,
  };
}

/**
 * C30 — mengambil daftar pesanan pengguna jasa
 * GET /api/pesanan?id_pengguna=...&peran=pengguna_jasa
 */
export async function ambilDaftarPesanan() {
  const { user } = await sesiSaatIni();

  if (!user.isPenggunaJasa) {
    throw new Error("Akun ini bukan pengguna jasa.");
  }

  const respons = await api<Respons<Pesanan[]>>(
    `/api/pesanan?id_pengguna=${encodeURIComponent(user.id)}&peran=pengguna_jasa`
  );

  return respons.data.map((p) => ({
    ...p,
    total_biaya: Number(p.total_biaya),
    sudah_diulas: p.sudah_diulas ?? false,
    rating_ulasan: p.rating_ulasan ?? null,
    jasa: p.jasa
      ? { ...p.jasa, harga: Number(p.jasa.harga) }
      : undefined,
  }));
}

/**
 * C35 — menerima pesanan
 * PATCH