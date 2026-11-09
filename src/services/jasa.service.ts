import { createClient } from '@/lib/supabase/server';
import { getStorageService } from '@/services/storage';
import type { Jasa } from '@/models/types';

// Input pembuatan jasa: kolom yang diisi DB otomatis tidak ikut
export type DataJasaBaru = Pick<Jasa, 'id_penyedia_jasa' | 'nama_jasa' | 'deskripsi' | 'kategori' | 'harga' | 'berkas_pendukung'>;
// Kolom yang boleh diubah (Q-1203 + berkas_pendukung)
export type DataJasaUpdate = Partial<Pick<Jasa, 'nama_jasa' | 'deskripsi' | 'kategori' | 'harga' | 'status_aktif' | 'berkas_pendukung'>>;

const KOLOM_UPDATE = ['nama_jasa', 'deskripsi', 'kategori', 'harga', 'status_aktif', 'berkas_pendukung'] as const;

export const MAKS_UKURAN_BERKAS = 10 * 1024 * 1024; // 10 MB
const TIPE_BERKAS_DIIZINKAN = /^(image\/(png|jpe?g|webp|gif)|video\/mp4|application\/pdf)$/;

// C14 JasaController (sekaligus operasi entitas C12 Jasa)
export class JasaController {
  // Katalog: semua jasa aktif, terbaru dulu
  static async ambilSemuaJasa(): Promise<Jasa[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('jasa')
      .select('*')
      .eq('status_aktif', true)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []) as Jasa[];
  }

  // Algo-1401 / Algo-1202 (Q-1202)
  static async ambilDetailJasa(id_jasa: string): Promise<Jasa> {
    if (!id_jasa || typeof id_jasa !== 'string' || !id_jasa.trim()) {
      throw new Error('ID Jasa tidak valid');
    }

    const supabase = await createClient();
    const { data, error } = await supabase.from('jasa').select('*').eq('id_jasa', id_jasa).maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) throw new Error('Data jasa tidak ditemukan');
    return data as Jasa;
  }

  // Algo-1402 (+ deskripsi: kolom NOT NULL di DDL)
  static validasiDataJasa(data?: Partial<DataJasaBaru>): boolean {
    if (!data) return false;
    if (
      typeof data.nama_jasa !== 'string' || !data.nama_jasa.trim() ||
      typeof data.deskripsi !== 'string' || !data.deskripsi.trim() ||
      typeof data.kategori !== 'string' || !data.kategori.trim() ||
      data.harga == null
    ) {
      return false;
    }
    return typeof data.harga === 'number' && Number.isFinite(data.harga) && data.harga > 0;
  }

  // Validasi format & ukuran berkas sebelum diunggah (padanan validasiFormatUkuran C11)
  static validasiBerkas(berkas: File[]): string | null {
    for (const file of berkas) {
      if (!TIPE_BERKAS_DIIZINKAN.test(file.type)) return `Format berkas ${file.name} tidak didukung`;
      if (file.size > MAKS_UKURAN_BERKAS) return `Ukuran berkas ${file.name} melebihi 10 MB`;
    }
    return null;
  }

  // Unggah berkas via C11 LayananUploadFile, kembalikan daftar URL
  static async unggahBerkas(berkas: File[]): Promise<string[]> {
    const pesan_error = this.validasiBerkas(berkas);
    if (pesan_error) throw new Error(pesan_error);

    const storage = getStorageService();
    const hasil = await Promise.all(berkas.map((file) => storage.upload(file, 'jasa')));
    const gagal = hasil.find((h) => h.error);
    if (gagal) throw new Error(gagal.error);
    return hasil.map((h) => h.url);
  }

  // Bersihkan berkas yang sudah diunggah jika operasi DB gagal (pencegahan orphan files)
  private static async bersihkanBerkas(urls: string[]): Promise<void> {
    if (!urls || urls.length === 0) return;
    try {
      const storage = getStorageService();
      await Promise.allSettled(urls.map((u) => storage.delete(u)));
    } catch {
      // Ignore cleanup error
    }
  }

  // Algo-1403. Relasi ke penyedia cukup lewat FK id_penyedia_jasa
  static async simpanPenawaranJasa(data: DataJasaBaru, berkas: File[] = []): Promise<Jasa> {
    if (!this.validasiDataJasa(data)) throw new Error('Data penawaran jasa tidak valid atau tidak lengkap');

    const url_berkas = berkas.length ? await this.unggahBerkas(berkas) : [];
    const { id_penyedia_jasa, nama_jasa, deskripsi, kategori, harga } = data;

    try {
      const supabase = await createClient();
      const { data: jasa, error } = await supabase
        .from('jasa')
        .insert({
          id_penyedia_jasa,
          nama_jasa: nama_jasa.trim(),
          deskripsi: deskripsi.trim(),
          kategori: kategori.trim(),
          harga,
          berkas_pendukung: [...(data.berkas_pendukung ?? []), ...url_berkas],
          status_aktif: true,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return jasa as Jasa;
    } catch (err) {
      if (url_berkas.length > 0) {
        await this.bersihkanBerkas(url_berkas);
      }
      throw err;
    }
  }

  // Algo-1203 (Q-1203). Berkas baru ditambahkan ke daftar yang sudah ada
  static async perbaruiJasa(id_jasa: string, data: DataJasaUpdate, berkas: File[] = []): Promise<Jasa> {
    if (!id_jasa || typeof id_jasa !== 'string' || !id_jasa.trim()) {
      throw new Error('ID Jasa tidak valid');
    }

    // Validasi field string jika disertakan di data
    if (data.nama_jasa !== undefined && (typeof data.nama_jasa !== 'string' || !data.nama_jasa.trim())) {
      throw new Error('Nama jasa tidak valid atau kosong');
    }
    if (data.deskripsi !== undefined && (typeof data.deskripsi !== 'string' || !data.deskripsi.trim())) {
      throw new Error('Deskripsi jasa tidak valid atau kosong');
    }
    if (data.kategori !== undefined && (typeof data.kategori !== 'string' || !data.kategori.trim())) {
      throw new Error('Kategori jasa tidak valid atau kosong');
    }

    if (data.harga !== undefined && (typeof data.harga !== 'number' || !Number.isFinite(data.harga) || data.harga <= 0)) {
      throw new Error('Harga harus lebih dari 0');
    }

    // Hanya kolom yang boleh diubah; field lain (mis. id_penyedia_jasa) diabaikan
    const payload = Object.fromEntries(
      KOLOM_UPDATE.filter((k) => data[k] !== undefined).map((k) => [
        k,
        typeof data[k] === 'string' ? (data[k] as string).trim() : data[k]
      ]),
    ) as DataJasaUpdate;

    if (Object.keys(payload).length === 0 && berkas.length === 0) {
      throw new Error('Data pembaruan jasa tidak valid atau kosong');
    }

    // Pastikan jasa ada SEBELUM mengunggah berkas
    const jasaLama = await this.ambilDetailJasa(id_jasa);

    let url_berkas_baru: string[] = [];
    if (berkas.length) {
      url_berkas_baru = await this.unggahBerkas(berkas);
      const daftarLama = data.berkas_pendukung ?? jasaLama.berkas_pendukung ?? [];
      payload.berkas_pendukung = [...daftarLama, ...url_berkas_baru];
    }

    try {
      const supabase = await createClient();
      const { data: jasa, error } = await supabase
        .from('jasa')
        .update(payload)
        .eq('id_jasa', id_jasa)
        .select()
        .maybeSingle();

      if (error) throw new Error('Gagal memperbarui data jasa');
      if (!jasa) throw new Error('Data jasa tidak ditemukan');
      return jasa as Jasa;
    } catch (err) {
      if (url_berkas_baru.length > 0) {
        await this.bersihkanBerkas(url_berkas_baru);
      }
      throw err;
    }
  }

  // Algo-1204 (Q-1204): soft delete
  static async hapusJasa(id_jasa: string): Promise<void> {
    if (!id_jasa || typeof id_jasa !== 'string' || !id_jasa.trim()) {
      throw new Error('ID Jasa tidak valid');
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('jasa')
      .update({ status_aktif: false })
      .eq('id_jasa', id_jasa)
      .select('id_jasa')
      .maybeSingle();

    if (error) throw new Error('Gagal menonaktifkan penawaran jasa');
    if (!data) throw new Error('Data jasa tidak ditemukan');
  }
}
