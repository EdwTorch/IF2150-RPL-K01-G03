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
};

/** Sama dengan MAKS_PESANAN_AKTIF di services/pesanan.service.ts */
export const MAKS_PESANAN_AKTIF = 2;
/** Default kuota revisi di services/deliverables.service.ts */
export const KUOTA_REVISI_DEFAULT = 2;

type Respons<T> = { success: true; message: string; data: T };

/**
 * tombolPesanTerklik() → POST /api/pesanan → PengontrolPesanan.buatPesananBaru()
 * Backend masih minta id_pengguna_jasa di body → diambil dari sesi login.
 */
export async function buatPesanan(id_jasa: string, brief: string) {
  const { user } = await sesiSaatIni();
  const respons = await api<Respons<Pesanan>>("/api/pesanan", {
    method: "POST",
    body: { id_pengguna_jasa: user.id, id_jasa, brief: brief.trim() },
  });
  return { ...respons.data, total_biaya: Number(respons.data.total_biaya) };
}

/** getDetailPesanan() → GET /api/pesanan/[id_pesanan] (beserta jasa) */
export async function ambilDetailPesanan(id_pesanan: string) {
  const respons = await api<Respons<Pesanan>>(`/api/pesanan/${encodeURIComponent(id_pesanan)}`);
  const p = respons.data;
  return {
    ...p,
    total_biaya: Number(p.total_biaya),
    jasa: p.jasa ? { ...p.jasa, harga: Number(p.jasa.harga) } : undefined,
  };
}