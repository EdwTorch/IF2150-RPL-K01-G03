import { api } from "@/lib/api";
import type { Pesanan } from "@/lib/client/pesanan";

/** Sama dengan models/types.ts → MetodePembayaran (C33) */
export type MetodePembayaran = {
  id_metode: string;
  nama_metode: string;
  nomor_rekening_va?: string | null;
};

export type HasilPembayaran = {
  transaksi: { id_riwayat: string; id_pesanan: string; id_metode: string; total_biaya: number; status_transaksi: string };
  pesanan: Pesanan;
};

type Respons<T> = { success: true; message: string; data: T };

/** tampilkanPilihanPembayaran() → GET /api/transaksi?type=metode */
export async function ambilDaftarMetode() {
  return (await api<Respons<MetodePembayaran[]>>("/api/transaksi?type=metode")).data;
}

/**
 * tombolBayarTerklik() → POST /api/transaksi/dummy
 * → PengontrolTransaksi.prosesPembayaranDummy(): validasi, status LUNAS/DIPROSES, catat riwayat
 */
export async function bayarPesanan(id_pesanan: string, id_metode: string, jumlah_bayar: number) {
  return (
    await api<Respons<HasilPembayaran>>("/api/transaksi/dummy", {
      method: "POST",
      body: { id_pesanan, id_metode, jumlah_bayar },
    })
  ).data;
}