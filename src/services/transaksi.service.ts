import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';
import type { MetodePembayaran, Pesanan, RiwayatTransaksi } from '@/models/types';

export interface HasilPembayaranDummy {
  transaksi: RiwayatTransaksi;
  pesanan: Pesanan;
}

const waktuTransaksi = (r: RiwayatTransaksi) => Date.parse(r.tanggal_transaksi ?? '') || 0;

export class PengontrolTransaksi {
  static normalisasiStatus(status?: string): string {
    return (status ?? '').trim().toUpperCase().replace(/\s+/g, '_');
  }

  // Inti murni C33 Algo-3301 (Q-3301): dapatkan detail metode pembayaran berdasarkan ID
  static dapatkanDetailMetodeDiMemori(
    daftar_metode: MetodePembayaran[],
    id_metode: string,
  ): MetodePembayaran {
    if (!id_metode?.trim()) throw new Error('ID metode pembayaran tidak valid');
    const metode = daftar_metode.find((m) => m.id_metode === id_metode.trim());
    if (!metode) throw new Error('Metode pembayaran tidak ditemukan');
    return { ...metode };
  }

  // Inti murni UC09 (Algo-3201, Algo-3202, Algo-3204, Algo-3205, Algo-3401): eksekusi pembayaran dummy instan
  static prosesPembayaranDummyDiMemori(
    daftar_pesanan: Pesanan[],
    daftar_metode: MetodePembayaran[],
    id_pesanan: string,
    id_metode: string,
    jumlah_bayar?: number,
  ): HasilPembayaranDummy {
    if (!id_pesanan?.trim() || !id_metode?.trim()) {
      throw new Error('Parameter pembayaran tidak valid');
    }

    const metode = this.dapatkanDetailMetodeDiMemori(daftar_metode, id_metode);
    const pesanan = daftar_pesanan.find((p) => p.id_pesanan === id_pesanan.trim());
    if (!pesanan) throw new Error('Pesanan tidak ditemukan');

    const statusPesanan = this.normalisasiStatus(pesanan.status_pesanan);
    const statusBayar = this.normalisasiStatus(pesanan.status_pembayaran);
    if (statusPesanan !== 'MENUNGGU_PEMBAYARAN' || statusBayar === 'LUNAS') {
      throw new Error('Pesanan tidak dalam status menunggu pembayaran');
    }

    if (jumlah_bayar !== undefined && jumlah_bayar !== null) {
      const nominal = Number(jumlah_bayar);
      if (!Number.isFinite(nominal) || nominal <= 0) {
        throw new Error('Nominal pembayaran tidak valid');
      }
      if (nominal !== Number(pesanan.total_biaya)) {
        throw new Error('Nominal pembayaran tidak sesuai dengan total biaya pesanan');
      }
    }

    const sekarang = new Date().toISOString();
    const pesananDiperbarui: Pesanan = {
      ...pesanan,
      id_metode_pembayaran: metode.id_metode,
      status_pembayaran: 'LUNAS',
      status_pesanan: 'DIPROSES',
      updated_at: sekarang,
    };

    const transaksi: RiwayatTransaksi = {
      id_riwayat: crypto.randomUUID(),
      id_pesanan: pesanan.id_pesanan,
      id_metode: metode.id_metode,
      total_biaya: Number(pesanan.total_biaya),
      tanggal_transaksi: sekarang,
      status_transaksi: 'BERHASIL',
      pesanan: pesananDiperbarui,
      metode_pembayaran: metode,
    };

    return { transaksi, pesanan: pesananDiperbarui };
  }

  // Inti murni pengambilan riwayat transaksi per pengguna & peran (UC09, UC10, Layar I-11)
  static ambilRiwayatTransaksiDiMemori(
    daftar_riwayat: RiwayatTransaksi[],
    daftar_pesanan: Pesanan[],
    daftar_metode: MetodePembayaran[],
    id_pengguna: string,
    peran: 'pengguna_jasa' | 'penyedia_jasa' = 'pengguna_jasa',
  ): RiwayatTransaksi[] {
    if (!id_pengguna?.trim()) throw new Error('ID pengguna tidak valid');
    if (peran !== 'pengguna_jasa' && peran !== 'penyedia_jasa') {
      throw new Error('Peran pengguna tidak valid');
    }

    const kolom = peran === 'pengguna_jasa' ? 'id_pengguna_jasa' : 'id_penyedia_jasa';
    return daftar_riwayat
      .map((r) => ({
        ...r,
        pesanan: r.pesanan ?? daftar_pesanan.find((p) => p.id_pesanan === r.id_pesanan),
        metode_pembayaran:
          r.metode_pembayaran ?? daftar_metode.find((m) => m.id_metode === r.id_metode),
      }))
      .filter((r) => r.pesanan && r.pesanan[kolom] === id_pengguna)
      .sort((a, b) => waktuTransaksi(b) - waktuTransaksi(a));
  }

  // Inti murni Algo-3203 (Q-3202): pencairan dana ke penyedia jasa saat pesanan selesai
  static setPencairanDanaDiMemori(
    daftar_pesanan: Pesanan[],
    id_pesanan: string,
    selesai: boolean,
  ): Pesanan {
    if (!id_pesanan?.trim()) throw new Error('ID pesanan tidak valid');
    if (!selesai) throw new Error('Pencairan dana hanya dapat dilakukan untuk pesanan selesai');

    const pesanan = daftar_pesanan.find((p) => p.id_pesanan === id_pesanan.trim());
    if (!pesanan) throw new Error('Pesanan tidak ditemukan');

    const sekarang = new Date().toISOString();
    return {
      ...pesanan,
      status_pencairan: true,
      waktu_pencairan: sekarang,
      updated_at: sekarang,
    };
  }

  // C33 Algo-3301 (Q-3301): ambil detail 1 metode pembayaran dari Supabase
  static async dapatkanDetailMetode(id_metode: string): Promise<MetodePembayaran> {
    if (!id_metode?.trim()) throw new Error('ID metode pembayaran tidak valid');
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('metode_pembayaran')
      .select('id_metode, nama_metode, nomor_rekening_va, created_at')
      .eq('id_metode', id_metode.trim())
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) throw new Error('Metode pembayaran tidak ditemukan');
    return data as MetodePembayaran;
  }

  // Ambil seluruh daftar metode pembayaran yang tersedia
  static async ambilDaftarMetode(): Promise<MetodePembayaran[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('metode_pembayaran')
      .select('id_metode, nama_metode, nomor_rekening_va, created_at')
      .order('nama_metode', { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as MetodePembayaran[];
  }

  // UC09 (Algo-3201, Algo-3202, Algo-3204, Algo-3205, Algo-3401): eksekusi pembayaran dummy di Supabase
  static async prosesPembayaranDummy(
    id_pesanan: string,
    id_metode: string,
    jumlah_bayar?: number,
  ): Promise<HasilPembayaranDummy> {
    if (!id_pesanan?.trim() || !id_metode?.trim()) {
      throw new Error('Parameter pembayaran tidak valid');
    }

    const metode = await this.dapatkanDetailMetode(id_metode);
    const supabase = await createClient();

    const { data: pesananData, error: errPesanan } = await supabase
      .from('pesanan')
      .select('*')
      .eq('id_pesanan', id_pesanan.trim())
      .maybeSingle();
    if (errPesanan) throw new Error(errPesanan.message);
    if (!pesananData) throw new Error('Pesanan tidak ditemukan');

    const hasilMemori = this.prosesPembayaranDummyDiMemori(
      [pesananData as Pesanan],
      [metode],
      id_pesanan,
      id_metode,
      jumlah_bayar,
    );

    const { data: pesananUpdated, error: errUpdate } = await supabase
      .from('pesanan')
      .update({
        id_metode_pembayaran: hasilMemori.pesanan.id_metode_pembayaran,
        status_pembayaran: hasilMemori.pesanan.status_pembayaran,
        status_pesanan: hasilMemori.pesanan.status_pesanan,
        updated_at: hasilMemori.pesanan.updated_at,
      })
      .eq('id_pesanan', id_pesanan.trim())
      .select('*')
      .single();
    if (errUpdate) throw new Error(errUpdate.message);

    const { data: riwayatBaru, error: errRiwayat } = await supabase
      .from('riwayat_transaksi')
      .insert({
        id_pesanan: hasilMemori.transaksi.id_pesanan,
        id_metode: hasilMemori.transaksi.id_metode,
        total_biaya: hasilMemori.transaksi.total_biaya,
        tanggal_transaksi: hasilMemori.transaksi.tanggal_transaksi,
        status_transaksi: hasilMemori.transaksi.status_transaksi,
      })
      .select('*, pesanan(*), metode_pembayaran(*)')
      .single();
    if (errRiwayat) throw new Error(errRiwayat.message);

    return {
      transaksi: riwayatBaru as RiwayatTransaksi,
      pesanan: pesananUpdated as Pesanan,
    };
  }

  // Ambil daftar riwayat transaksi pengguna berdasarkan peran di Supabase
  static async ambilRiwayatTransaksi(
    id_pengguna: string,
    peran: 'pengguna_jasa' | 'penyedia_jasa' = 'pengguna_jasa',
  ): Promise<RiwayatTransaksi[]> {
    if (!id_pengguna?.trim()) throw new Error('ID pengguna tidak valid');
    if (peran !== 'pengguna_jasa' && peran !== 'penyedia_jasa') {
      throw new Error('Peran pengguna tidak valid');
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('riwayat_transaksi')
      .select('*, pesanan(*), metode_pembayaran(*)')
      .order('tanggal_transaksi', { ascending: false });
    if (error) throw new Error(error.message);

    return this.ambilRiwayatTransaksiDiMemori(
      (data ?? []) as RiwayatTransaksi[],
      [],
      [],
      id_pengguna,
      peran,
    );
  }

  // Algo-3203 (Q-3202): pencairan dana ke penyedia jasa di Supabase
  static async setPencairanDana(id_pesanan: string, selesai: boolean): Promise<boolean> {
    if (!id_pesanan?.trim() || !selesai) return false;
    const supabase = await createClient();
    const sekarang = new Date().toISOString();

    const { data, error } = await supabase
      .from('pesanan')
      .update({
        status_pencairan: true,
        waktu_pencairan: sekarang,
        updated_at: sekarang,
      })
      .eq('id_pesanan', id_pesanan.trim())
      .select('id_pesanan')
      .maybeSingle();
    if (error) throw new Error(error.message);
    return Boolean(data?.id_pesanan);
  }
}

export { PengontrolTransaksi as TransaksiService };
