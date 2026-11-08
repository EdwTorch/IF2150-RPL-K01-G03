import crypto from 'crypto';
import type { Jasa, Pesanan } from '@/models/types';

export const MAKS_PESANAN_AKTIF = 2;

const STATUS_TERMINAL = new Set(['SELESAI', 'DITOLAK', 'DIKEMBALIKAN', 'DIBATALKAN']);

const TRANSISI_VALID: Record<string, string[]> = {
  MENUNGGU_PEMBAYARAN: ['MENUNGGU_KONFIRMASI', 'DIPROSES', 'DITOLAK'],
  MENUNGGU_KONFIRMASI: ['DIPROSES', 'DITOLAK', 'MENUNGGU_KONFIRMASI_SELESAI', 'SELESAI', 'KOMPLAIN'],
  DIPROSES: ['MENUNGGU_KONFIRMASI', 'MENUNGGU_KONFIRMASI_SELESAI', 'SELESAI', 'KOMPLAIN'],
  MENUNGGU_KONFIRMASI_SELESAI: ['SELESAI', 'DIPROSES', 'KOMPLAIN'],
  KOMPLAIN: ['DIPROSES', 'SELESAI', 'DITOLAK', 'DIKEMBALIKAN'],
  SELESAI: [],
  DITOLAK: [],
  DIKEMBALIKAN: [],
};

const waktu = (p: Pesanan) => Date.parse(p.created_at ?? '') || 0;

// C31 PengontrolPesanan (sekaligus operasi entitas C27 Pesanan & C02 terima/tolakPesanan)
export class PengontrolPesanan {
  static normalisasiStatus(status?: string): string {
    return (status ?? '').trim().toUpperCase().replace(/\s+/g, '_');
  }

  static apakahPesananAktif(status?: string): boolean {
    const norm = this.normalisasiStatus(status);
    return norm !== '' && !STATUS_TERMINAL.has(norm);
  }

  // Order State Machine: validasi transisi status deterministik (AGENTS.md 7.3 & Algo-3103)
  static validasiTransisiStatus(status_awal: string, status_baru: string): string {
    const awal = this.normalisasiStatus(status_awal);
    const tujuan = this.normalisasiStatus(status_baru);
    if (!awal || !tujuan) throw new Error('Status pesanan tidak valid');

    const diizinkan = TRANSISI_VALID[awal];
    if (!diizinkan || !diizinkan.includes(tujuan)) {
      throw new Error(`Transisi status pesanan dari ${status_awal} ke ${status_baru} tidak valid`);
    }
    return tujuan;
  }

  // Inti murni Algo-3102: hitung total biaya (snapshot harga) dari data jasa
  static hitungTotalBiayaDariJasa(daftar_jasa: Jasa[], id_jasa: string): number {
    if (!id_jasa?.trim()) throw new Error('ID jasa tidak valid');
    const jasa = daftar_jasa.find((j) => j.id_jasa === id_jasa && j.status_aktif !== false);
    if (!jasa) throw new Error('Data jasa tidak ditemukan');
    return Number(jasa.harga);
  }

  // Inti murni Algo-3101 & SKPL #13: buat pesanan baru dengan snapshot harga & batas maks 2 pesanan aktif
  static buatPesananDiMemori(
    daftar_pesanan: Pesanan[],
    daftar_jasa: Jasa[],
    id_pengguna_jasa: string,
    id_jasa: string,
    brief_kebutuhan: string,
  ): Pesanan {
    if (!id_pengguna_jasa?.trim() || !id_jasa?.trim()) {
      throw new Error('Parameter pemesanan tidak valid');
    }
    if (!brief_kebutuhan?.trim()) {
      throw new Error('Brief pemesanan wajib diisi');
    }

    const jasa = daftar_jasa.find((j) => j.id_jasa === id_jasa && j.status_aktif !== false);
    if (!jasa) throw new Error('Data jasa tidak ditemukan');

    if (jasa.id_penyedia_jasa === id_pengguna_jasa) {
      throw new Error('Tidak dapat memesan jasa milik sendiri');
    }

    const jumlah_aktif = daftar_pesanan.filter(
      (p) => p.id_pengguna_jasa === id_pengguna_jasa && this.apakahPesananAktif(p.status_pesanan),
    ).length;
    if (jumlah_aktif >= MAKS_PESANAN_AKTIF) {
      throw new Error(`Batas maksimal ${MAKS_PESANAN_AKTIF} pesanan aktif telah tercapai`);
    }

    const sekarang = new Date().toISOString();
    return {
      id_pesanan: crypto.randomUUID(),
      id_pengguna_jasa,
      id_penyedia_jasa: jasa.id_penyedia_jasa,
      id_jasa,
      brief: brief_kebutuhan.trim(),
      total_biaya: Number(jasa.harga),
      status_pembayaran: 'MENUNGGU_PEMBAYARAN',
      status_pesanan: 'MENUNGGU_PEMBAYARAN',
      status_pencairan: false,
      created_at: sekarang,
      updated_at: sekarang,
      jasa: { ...jasa },
    };
  }

  // Inti murni UC10 (Algo-0205 terimaPesanan & Algo-0206 tolakPesanan)
  static konfirmasiPesananDiMemori(
    daftar_pesanan: Pesanan[],
    id_pesanan: string,
    id_penyedia_jasa: string,
    tindakan: 'terima' | 'tolak',
  ): Pesanan {
    if (!id_pesanan?.trim() || !id_penyedia_jasa?.trim()) {
      throw new Error('Identitas pesanan tidak valid');
    }
    if (tindakan !== 'terima' && tindakan !== 'tolak') {
      throw new Error('Tindakan konfirmasi tidak valid');
    }

    const pesanan = daftar_pesanan.find((p) => p.id_pesanan === id_pesanan);
    if (!pesanan) throw new Error('Pesanan tidak ditemukan');

    if (pesanan.id_penyedia_jasa !== id_penyedia_jasa) {
      throw new Error('Akses ditolak. Hanya penyedia jasa yang dapat memproses pesanan ini');
    }

    const status_norm = this.normalisasiStatus(pesanan.status_pesanan);
    if (status_norm !== 'MENUNGGU_KONFIRMASI' && status_norm !== 'MENUNGGU_PEMBAYARAN') {
      throw new Error('Pesanan ini sudah diproses sebelumnya');
    }

    const status_baru = tindakan === 'terima' ? 'DIPROSES' : 'DITOLAK';
    const status_bayar =
      tindakan === 'tolak' && this.normalisasiStatus(pesanan.status_pembayaran) === 'LUNAS'
        ? 'DIKEMBALIKAN'
        : pesanan.status_pembayaran;

    return {
      ...pesanan,
      status_pesanan: status_baru,
      status_pembayaran: status_bayar,
      updated_at: new Date().toISOString(),
    };
  }

  // Inti murni daftar pesanan per peran & filter status (I-11 O-01)
  static ambilDaftarPesananDiMemori(
    daftar_pesanan: Pesanan[],
    daftar_jasa: Jasa[],
    id_pengguna: string,
    peran: 'pengguna_jasa' | 'penyedia_jasa',
    filter_status?: string,
  ): Pesanan[] {
    if (!id_pengguna?.trim()) throw new Error('ID pengguna tidak valid');
    if (peran !== 'pengguna_jasa' && peran !== 'penyedia_jasa') {
      throw new Error('Peran pengguna tidak valid');
    }

    const filter_norm = this.normalisasiStatus(filter_status);
    return daftar_pesanan
      .filter((p) => (peran === 'pengguna_jasa' ? p.id_pengguna_jasa === id_pengguna : p.id_penyedia_jasa === id_pengguna))
      .filter((p) => {
        if (!filter_norm || filter_norm === 'SEMUA') return true;
        const st = this.normalisasiStatus(p.status_pesanan);
        if (filter_norm === 'BERJALAN') return this.apakahPesananAktif(st);
        if (filter_norm === 'DIKEMBALIKAN') return st === 'DITOLAK' || st === 'DIKEMBALIKAN';
        return st === filter_norm;
      })
      .map((p) => ({ ...p, jasa: p.jasa ?? daftar_jasa.find((j) => j.id_jasa === p.id_jasa) }))
      .sort((a, b) => waktu(b) - waktu(a));
  }

  // Inti murni Algo-3104 (Q-3102): ambil detail 1 pesanan
  static ambilDetailPesananDiMemori(
    daftar_pesanan: Pesanan[],
    daftar_jasa: Jasa[],
    id_pesanan: string,
  ): Pesanan {
    if (!id_pesanan?.trim()) throw new Error('ID pesanan tidak valid');
    const pesanan = daftar_pesanan.find((p) => p.id_pesanan === id_pesanan);
    if (!pesanan) throw new Error('Pesanan tidak ditemukan');
    return {
      ...pesanan,
      jasa: pesanan.jasa ?? daftar_jasa.find((j) => j.id_jasa === pesanan.id_jasa),
    };
  }

  // Inti murni Algo-3103 (Q-2701..2703): ubah status pesanan via state machine
  static updateStatusPesananDiMemori(
    daftar_pesanan: Pesanan[],
    id_pesanan: string,
    status_baru: string,
  ): Pesanan {
    if (!id_pesanan?.trim()) throw new Error('ID pesanan tidak valid');
    const pesanan = daftar_pesanan.find((p) => p.id_pesanan === id_pesanan);
    if (!pesanan) throw new Error('Pesanan tidak ditemukan');

    const status_valid = this.validasiTransisiStatus(pesanan.status_pesanan, status_baru);
    return {
      ...pesanan,
      status_pesanan: status_valid,
      updated_at: new Date().toISOString(),
    };
  }

  // Algo-3102: hitung total biaya (harga snapshot) dari basis data
  static async hitungTotalBiaya(id_jasa: string): Promise<number> {
    if (!id_jasa?.trim()) throw new Error('ID jasa tidak valid');
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const { data: jasa, error } = await supabase
      .from('jasa')
      .select('harga, status_aktif')
      .eq('id_jasa', id_jasa)
      .eq('status_aktif', true)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!jasa) throw new Error('Data jasa tidak ditemukan');
    return Number(jasa.harga);
  }

  // UC09, Algo-3101 (Q-3101): buat pesanan baru di basis data
  static async buatPesananBaru(
    id_pengguna_jasa: string,
    id_jasa: string,
    brief_kebutuhan: string,
  ): Promise<Pesanan> {
    if (!id_pengguna_jasa?.trim() || !id_jasa?.trim()) {
      throw new Error('Parameter pemesanan tidak valid');
    }
    if (!brief_kebutuhan?.trim()) {
      throw new Error('Brief pemesanan wajib diisi');
    }

    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const { data: jasa, error: err_jasa } = await supabase
      .from('jasa')
      .select('*')
      .eq('id_jasa', id_jasa)
      .eq('status_aktif', true)
      .maybeSingle();
    if (err_jasa) throw new Error(err_jasa.message);
    if (!jasa) throw new Error('Data jasa tidak ditemukan');

    if (jasa.id_penyedia_jasa === id_pengguna_jasa) {
      throw new Error('Tidak dapat memesan jasa milik sendiri');
    }

    const { data: pesanan_pengguna, error: err_aktif } = await supabase
      .from('pesanan')
      .select('status_pesanan')
      .eq('id_pengguna_jasa', id_pengguna_jasa);
    if (err_aktif) throw new Error(err_aktif.message);

    const jumlah_aktif = (pesanan_pengguna ?? []).filter((p) =>
      this.apakahPesananAktif(p.status_pesanan),
    ).length;
    if (jumlah_aktif >= MAKS_PESANAN_AKTIF) {
      throw new Error(`Batas maksimal ${MAKS_PESANAN_AKTIF} pesanan aktif telah tercapai`);
    }

    const { data, error } = await supabase
      .from('pesanan')
      .insert({
        id_pengguna_jasa,
        id_penyedia_jasa: jasa.id_penyedia_jasa,
        id_jasa,
        brief: brief_kebutuhan.trim(),
        total_biaya: Number(jasa.harga),
        status_pembayaran: 'MENUNGGU_PEMBAYARAN',
        status_pesanan: 'MENUNGGU_PEMBAYARAN',
      })
      .select('*, jasa(*)')
      .single();

    if (error) throw new Error(error.message);
    return data as Pesanan;
  }

  // UC10, Algo-0205 (Q-0205) & Algo-0206 (Q-0206): konfirmasi terima/tolak oleh penyedia jasa
  static async konfirmasiPesanan(
    id_pesanan: string,
    id_penyedia_jasa: string,
    tindakan: 'terima' | 'tolak',
  ): Promise<Pesanan> {
    if (!id_pesanan?.trim() || !id_penyedia_jasa?.trim()) {
      throw new Error('Identitas pesanan tidak valid');
    }
    if (tindakan !== 'terima' && tindakan !== 'tolak') {
      throw new Error('Tindakan konfirmasi tidak valid');
    }

    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const { data: pesanan, error: err_fetch } = await supabase
      .from('pesanan')
      .select('*')
      .eq('id_pesanan', id_pesanan)
      .maybeSingle();

    if (err_fetch) throw new Error(err_fetch.message);
    if (!pesanan) throw new Error('Pesanan tidak ditemukan');

    if (pesanan.id_penyedia_jasa !== id_penyedia_jasa) {
      throw new Error('Akses ditolak. Hanya penyedia jasa yang dapat memproses pesanan ini');
    }

    const status_norm = this.normalisasiStatus(pesanan.status_pesanan);
    if (status_norm !== 'MENUNGGU_KONFIRMASI' && status_norm !== 'MENUNGGU_PEMBAYARAN') {
      throw new Error('Pesanan ini sudah diproses sebelumnya');
    }

    const status_baru = tindakan === 'terima' ? 'DIPROSES' : 'DITOLAK';
    const payload_update: Record<string, unknown> = {
      status_pesanan: status_baru,
      updated_at: new Date().toISOString(),
    };
    if (tindakan === 'tolak' && this.normalisasiStatus(pesanan.status_pembayaran) === 'LUNAS') {
      payload_update.status_pembayaran = 'DIKEMBALIKAN';
    }

    const { data, error } = await supabase
      .from('pesanan')
      .update(payload_update)
      .eq('id_pesanan', id_pesanan)
      .eq('id_penyedia_jasa', id_penyedia_jasa)
      .select('*, jasa(*)')
      .single();

    if (error) throw new Error(error.message);
    return data as Pesanan;
  }

  // Ambil daftar pesanan berdasarkan peran pengguna & filter status opsional
  static async ambilDaftarPesanan(
    id_pengguna: string,
    peran: 'pengguna_jasa' | 'penyedia_jasa',
    filter_status?: string,
  ): Promise<Pesanan[]> {
    if (!id_pengguna?.trim()) throw new Error('ID pengguna tidak valid');
    if (peran !== 'pengguna_jasa' && peran !== 'penyedia_jasa') {
      throw new Error('Peran pengguna tidak valid');
    }

    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const kolom_peran = peran === 'pengguna_jasa' ? 'id_pengguna_jasa' : 'id_penyedia_jasa';
    const { data, error } = await supabase
      .from('pesanan')
      .select('*, jasa(*)')
      .eq(kolom_peran, id_pengguna)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return this.ambilDaftarPesananDiMemori((data ?? []) as Pesanan[], [], id_pengguna, peran, filter_status);
  }

  // Algo-3104 (Q-3102): ambil detail pesanan berdasarkan ID
  static async ambilDetailPesanan(id_pesanan: string): Promise<Pesanan> {
    if (!id_pesanan?.trim()) throw new Error('ID pesanan tidak valid');
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('pesanan')
      .select('*, jasa(*)')
      .eq('id_pesanan', id_pesanan)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) throw new Error('Pesanan tidak ditemukan');
    return data as Pesanan;
  }

  // Algo-3103 (Q-2701..2703): update status pesanan melalui validasi Order State Machine
  static async updateStatusPesanan(id_pesanan: string, status_baru: string): Promise<Pesanan> {
    const pesanan = await this.ambilDetailPesanan(id_pesanan);
    const status_valid = this.validasiTransisiStatus(pesanan.status_pesanan, status_baru);

    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('pesanan')
      .update({
        status_pesanan: status_valid,
        updated_at: new Date().toISOString(),
      })
      .eq('id_pesanan', id_pesanan)
      .select('*, jasa(*)')
      .single();

    if (error) throw new Error(error.message);
    return data as Pesanan;
  }

  // Kompatibilitas method eksisting pada branch development
  static async respondOrder(data: {
    id_pesanan: string;
    user_id: string;
    action: 'Diterima' | 'Ditolak';
  }): Promise<void> {
    await this.konfirmasiPesanan(
      data.id_pesanan,
      data.user_id,
      data.action === 'Diterima' ? 'terima' : 'tolak',
    );
  }
}

export { PengontrolPesanan as PesananService };
