import crypto from 'crypto';
import type { Bookmark, Jasa } from '@/models/types';

export interface HasilToggleBookmark {
  action: 'added' | 'removed';
  data: Bookmark | null;
}

const waktu = (b: Bookmark) => Date.parse(b.waktu_disimpan ?? b.created_at ?? '') || 0;

// C22 PengontrolBookmark (sekaligus operasi entitas C20 Bookmark)
export class PengontrolBookmark {
  // Algo-2201, Algo-2202, Algo-2203 baris 1-2: pastikan parameter tidak kosong
  static validasiInput(id_pengguna_jasa?: string, target_id?: string, wajib_target = true): void {
    if (!id_pengguna_jasa?.trim() || (wajib_target && !target_id?.trim())) {
      throw new Error('Parameter input tidak valid');
    }
  }

  // Inti murni Algo-2203 / Q-2003 (dipakai mode mock & unit test): saring milik pengguna, pasangkan jasa aktif, urut terbaru
  static daftarDariMemori(daftar_bookmark: Bookmark[], daftar_jasa: Jasa[], id_pengguna_jasa: string): Bookmark[] {
    this.validasiInput(id_pengguna_jasa, undefined, false);
    return daftar_bookmark
      .filter((b) => b.id_pengguna_jasa === id_pengguna_jasa)
      .map((b) => ({ ...b, jasa: b.jasa ?? daftar_jasa.find((j) => j.id_jasa === b.id_jasa) }))
      .filter((b) => b.jasa && b.jasa.status_aktif !== false)
      .sort((a, b) => waktu(b) - waktu(a));
  }

  // Inti murni Algo-2201 / Algo-2001: validasi jasa aktif & cegah duplikasi sebelum membuat bookmark
  static tambahKeMemori(
    daftar_bookmark: Bookmark[],
    daftar_jasa: Jasa[],
    id_pengguna_jasa: string,
    id_jasa: string,
  ): Bookmark {
    this.validasiInput(id_pengguna_jasa, id_jasa);
    const jasa = daftar_jasa.find((j) => j.id_jasa === id_jasa && j.status_aktif !== false);
    if (!jasa) throw new Error('Data jasa tidak ditemukan');

    const sudah_ada = daftar_bookmark.some(
      (b) => b.id_pengguna_jasa === id_pengguna_jasa && b.id_jasa === id_jasa,
    );
    if (sudah_ada) throw new Error('Jasa sudah ada di dalam bookmark');

    const sekarang = new Date().toISOString();
    return {
      id_bookmark: crypto.randomUUID(),
      id_pengguna_jasa,
      id_jasa,
      waktu_disimpan: sekarang,
      created_at: sekarang,
      jasa,
    };
  }

  // Inti murni Algo-2202 / Algo-2002: hapus berdasarkan (id_pengguna_jasa, id_jasa | id_bookmark)
  static hapusDariMemori(
    daftar_bookmark: Bookmark[],
    id_pengguna_jasa: string,
    id_jasa_atau_bookmark: string,
  ): Bookmark[] {
    this.validasiInput(id_pengguna_jasa, id_jasa_atau_bookmark);
    const sisa = daftar_bookmark.filter(
      (b) =>
        !(
          b.id_pengguna_jasa === id_pengguna_jasa &&
          (b.id_jasa === id_jasa_atau_bookmark || b.id_bookmark === id_jasa_atau_bookmark)
        ),
    );
    if (sisa.length === daftar_bookmark.length) throw new Error('Data bookmark tidak ditemukan');
    return sisa;
  }

  // Inti murni toggle ikon bookmark (I-06 O-05 & I-07 O-02)
  static toggleDiMemori(
    daftar_bookmark: Bookmark[],
    daftar_jasa: Jasa[],
    id_pengguna_jasa: string,
    id_jasa: string,
  ): HasilToggleBookmark & { daftar: Bookmark[] } {
    this.validasiInput(id_pengguna_jasa, id_jasa);
    const ada = daftar_bookmark.some((b) => b.id_pengguna_jasa === id_pengguna_jasa && b.id_jasa === id_jasa);
    if (ada) {
      const daftar = this.hapusDariMemori(daftar_bookmark, id_pengguna_jasa, id_jasa);
      return { action: 'removed', data: null, daftar };
    }
    const baru = this.tambahKeMemori(daftar_bookmark, daftar_jasa, id_pengguna_jasa, id_jasa);
    return { action: 'added', data: baru, daftar: [baru, ...daftar_bookmark] };
  }

  // Algo-2201 / Algo-2001 (Q-2001): simpan bookmark baru ke basis data
  static async tambahDataBookmark(id_pengguna_jasa: string, id_jasa: string): Promise<Bookmark> {
    this.validasiInput(id_pengguna_jasa, id_jasa);
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

    const waktu_disimpan = new Date().toISOString();
    const { data, error } = await supabase
      .from('bookmark')
      .insert({ id_pengguna_jasa, id_jasa, waktu_disimpan })
      .select('*, jasa(*)')
      .single();

    if (error) {
      if (error.code === '23505') throw new Error('Jasa sudah ada di dalam bookmark');
      throw new Error(error.message);
    }
    return data as Bookmark;
  }

  // Algo-2202 / Algo-2002 (Q-2002): hapus bookmark milik pengguna
  static async hapusDataBookmark(id_pengguna_jasa: string, id_jasa: string, id_bookmark?: string): Promise<boolean> {
    const target = id_bookmark || id_jasa;
    this.validasiInput(id_pengguna_jasa, target);
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const kolom = id_bookmark ? 'id_bookmark' : 'id_jasa';
    const { data, error } = await supabase
      .from('bookmark')
      .delete()
      .eq('id_pengguna_jasa', id_pengguna_jasa)
      .eq(kolom, target)
      .select('id_bookmark');

    if (error) throw new Error(error.message);
    if (!data?.length) throw new Error('Data bookmark tidak ditemukan');
    return true;
  }

  // Algo-2203 / Algo-2003 (Q-2003): ambil daftar bookmark pengguna beserta detail jasa aktif
  static async ambilDaftarBookmarkPengguna(id_pengguna_jasa: string): Promise<Bookmark[]> {
    this.validasiInput(id_pengguna_jasa, undefined, false);
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('bookmark')
      .select('*, jasa(*)')
      .eq('id_pengguna_jasa', id_pengguna_jasa)
      .order('waktu_disimpan', { ascending: false });

    if (error) throw new Error(error.message);
    return ((data ?? []) as Bookmark[]).filter((b) => b.jasa && b.jasa.status_aktif !== false);
  }

  // Toggle bookmark di basis data: hapus jika sudah ada, tambah jika belum ada
  static async toggleBookmark(id_pengguna_jasa: string, id_jasa: string): Promise<HasilToggleBookmark> {
    this.validasiInput(id_pengguna_jasa, id_jasa);
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const { data: ada, error } = await supabase
      .from('bookmark')
      .select('id_bookmark')
      .eq('id_pengguna_jasa', id_pengguna_jasa)
      .eq('id_jasa', id_jasa)
      .maybeSingle();
    if (error) throw new Error(error.message);

    if (ada) {
      try {
        await this.hapusDataBookmark(id_pengguna_jasa, id_jasa, ada.id_bookmark);
      } catch (err: unknown) {
        const pesan = err instanceof Error ? err.message : '';
        if (!pesan.includes('tidak ditemukan')) throw err;
      }
      return { action: 'removed', data: null };
    }

    try {
      const data = await this.tambahDataBookmark(id_pengguna_jasa, id_jasa);
      return { action: 'added', data };
    } catch (err: unknown) {
      const pesan = err instanceof Error ? err.message : '';
      const kode = typeof err === 'object' && err !== null && 'code' in err ? (err as { code: string }).code : '';
      if (pesan.includes('sudah ada') || kode === '23505') {
        // Race condition: double click cepat saat penambahan, hapus kembali agar semantik toggle terpenuhi
        try {
          await this.hapusDataBookmark(id_pengguna_jasa, id_jasa);
        } catch {
          // Abaikan jika sudah terhapus
        }
        return { action: 'removed', data: null };
      }
      throw err;
    }
  }
}
