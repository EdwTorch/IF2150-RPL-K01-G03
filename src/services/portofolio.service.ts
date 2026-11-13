import crypto from 'crypto';

// Tabel portofolio (C09)
export interface Portofolio {
  id_portofolio: string;
  id_penyedia_jasa: string;
  judul: string;
  deskripsi: string | null;
  berkas_pendukung: string | null;
  created_at?: string;
}

// Gabungan yang ditampilkan di I-03: pengalaman & prestasi (penyedia_jasa, C02) + daftar karya (portofolio, C09)
export interface DataPortofolio {
  pengalaman: string[];
  prestasi: string[];
  daftar_karya: Portofolio[];
}

export interface InputPortofolio {
  judul: string;
  deskripsi?: string | null;
  berkas_pendukung: string; // URL hasil POST /api/upload (folder "portofolio")
  pengalaman?: string[];
  prestasi?: string[];
}

export const MAKS_PANJANG_JUDUL = 255; // VARCHAR(255) di DDL
export const MAKS_PANJANG_URL = 500; // VARCHAR(500) di DDL
export const MAKS_ITEM_DAFTAR = 20;
export const MAKS_PANJANG_ITEM = 200;

const KOLOM_PORTOFOLIO = 'id_portofolio, id_penyedia_jasa, judul, deskripsi, berkas_pendukung, created_at';
const waktu = (p: Portofolio) => Date.parse(p.created_at ?? '') || 0;

// C10 PengontrolPortofolio (sekaligus operasi entitas C09 Portofolio & isiPortofolio C02)
export class PengontrolPortofolio {
  // Rapikan pengalaman/prestasi: terima array atau teks per baris, buang kosong & duplikat, batasi jumlah
  static rapikanDaftar(nilai: unknown): string[] {
    const mentah = Array.isArray(nilai) ? nilai : typeof nilai === 'string' ? nilai.split('\n') : [];
    const bersih = mentah
      .filter((v): v is string => typeof v === 'string')
      .map((v) => v.trim())
      .filter(Boolean);
    if (bersih.some((v) => v.length > MAKS_PANJANG_ITEM)) {
      throw new Error(`Setiap pengalaman/prestasi maksimal ${MAKS_PANJANG_ITEM} karakter`);
    }
    return [...new Set(bersih)].slice(0, MAKS_ITEM_DAFTAR);
  }

  // Algo-1001: data & berkas pendukung wajib ada (format/ukuran berkas sudah divalidasi /api/upload)
  static validasiInputBerkas(data?: Partial<InputPortofolio> | null): boolean {
    if (!data || !data.judul?.trim() || !data.berkas_pendukung?.trim()) return false;
    const url = data.berkas_pendukung.trim();
    return url.length <= MAKS_PANJANG_URL && (/^https?:\/\//i.test(url) || url.startsWith('/'));
  }

  // Validasi lengkap + normalisasi input, dipakai route & mode mock
  static normalisasiInput(data?: Partial<InputPortofolio> | null): InputPortofolio {
    if (!this.validasiInputBerkas(data)) throw new Error('Data portofolio tidak lengkap atau berkas tidak valid');
    const judul = data!.judul!.trim();
    if (judul.length > MAKS_PANJANG_JUDUL) throw new Error(`Judul karya maksimal ${MAKS_PANJANG_JUDUL} karakter`);
    return {
      judul,
      deskripsi: data!.deskripsi?.trim() || null,
      berkas_pendukung: data!.berkas_pendukung!.trim(),
      pengalaman: data!.pengalaman === undefined ? undefined : this.rapikanDaftar(data!.pengalaman),
      prestasi: data!.prestasi === undefined ? undefined : this.rapikanDaftar(data!.prestasi),
    };
  }

  // Inti murni untuk mode mock & unit test
  static simpanDiMemori(state: DataPortofolio, id_penyedia_jasa: string, input: InputPortofolio): DataPortofolio {
    if (!id_penyedia_jasa?.trim()) throw new Error('ID penyedia jasa tidak valid');
    const karya: Portofolio = {
      id_portofolio: crypto.randomUUID(),
      id_penyedia_jasa,
      judul: input.judul,
      deskripsi: input.deskripsi ?? null,
      berkas_pendukung: input.berkas_pendukung,
      created_at: new Date().toISOString(),
    };
    return {
      pengalaman: input.pengalaman ?? state.pengalaman,
      prestasi: input.prestasi ?? state.prestasi,
      daftar_karya: [karya, ...state.daftar_karya].sort((a, b) => waktu(b) - waktu(a)),
    };
  }

  // tampilkanPortofolio(): pengalaman & prestasi + daftar karya milik penyedia
  static async ambilPortofolio(id_penyedia_jasa: string): Promise<DataPortofolio> {
    if (!id_penyedia_jasa?.trim()) throw new Error('ID penyedia jasa tidak valid');
    const { createClient } = await import('@/lib/supabase/server'); // lazy: unit test tidak butuh next/headers
    const supabase = await createClient();

    const [penyedia, karya] = await Promise.all([
      supabase.from('penyedia_jasa').select('pengalaman, prestasi').eq('id', id_penyedia_jasa).maybeSingle(),
      supabase
        .from('portofolio')
        .select(KOLOM_PORTOFOLIO)
        .eq('id_penyedia_jasa', id_penyedia_jasa)
        .order('created_at', { ascending: false }),
    ]);

    if (penyedia.error) throw new Error(penyedia.error.message);
    if (!penyedia.data) throw new Error('Data penyedia jasa tidak ditemukan');
    if (karya.error) throw new Error(karya.error.message);

    return {
      pengalaman: penyedia.data.pengalaman ?? [],
      prestasi: penyedia.data.prestasi ?? [],
      daftar_karya: (karya.data ?? []) as Portofolio[],
    };
  }

  // Algo-1002 / Algo-0901 (Q-0901) + isiPortofolio (Q-0201): simpan karya & perbarui pengalaman/prestasi
  static async simpanPortofolio(id_penyedia_jasa: string, data: Partial<InputPortofolio>): Promise<DataPortofolio> {
    if (!id_penyedia_jasa?.trim()) throw new Error('ID penyedia jasa tidak valid');
    const input = this.normalisasiInput(data);

    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const { data: karya, error } = await supabase
      .from('portofolio')
      .insert({
        id_penyedia_jasa,
        judul: input.judul,
        deskripsi: input.deskripsi,
        berkas_pendukung: input.berkas_pendukung,
      })
      .select('id_portofolio')
      .single();
    if (error || !karya) throw new Error('Gagal menyimpan portofolio ke database');

    const perubahan: { pengalaman?: string[]; prestasi?: string[] } = {};
    if (input.pengalaman !== undefined) perubahan.pengalaman = input.pengalaman;
    if (input.prestasi !== undefined) perubahan.prestasi = input.prestasi;

    if (Object.keys(perubahan).length > 0) {
      const { data: diperbarui, error: errUpdate } = await supabase
        .from('penyedia_jasa')
        .update(perubahan)
        .eq('id', id_penyedia_jasa)
        .select('id')
        .maybeSingle();
      if (errUpdate || !diperbarui) {
        // Rollback agar karya tidak tersimpan setengah jalan
        await supabase.from('portofolio').delete().eq('id_portofolio', karya.id_portofolio);
        throw new Error('Gagal memperbarui pengalaman dan prestasi penyedia jasa');
      }
    }

    return this.ambilPortofolio(id_penyedia_jasa);
  }
}