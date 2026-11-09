import type { Jasa } from '@/models/types';

export type UrutanPencarian = 'terbaru' | 'harga_asc' | 'harga_desc' | 'rating_desc';

export interface FilterPencarian {
  keyword?: string;
  kategori?: string;
  harga_min?: number;
  harga_max?: number;
  rating_min?: number;
  rating_max?: number;
  urutkan?: UrutanPencarian;
  limit?: number;
}

export interface HasilKomparasiJasa {
  jasa: Jasa[];
  ringkasan: {
    id_termurah: string;
    id_termahal: string;
    selisih_harga: number;
    id_rating_tertinggi: string;
  };
}

export const BATAS_HASIL_PENCARIAN = 20; // LIMIT Q-1701
export const MIN_PANJANG_KEYWORD = 3; // Algo-1701 baris 1
export const MAKS_LIMIT_PENCARIAN = 100;
export const MAKS_KOMPARASI_JASA = 4;
export const DAFTAR_URUTAN: UrutanPencarian[] = ['terbaru', 'harga_asc', 'harga_desc', 'rating_desc'];

// Normalisasi keyword satu pintu: bersihkan karakter khusus PostgREST [%,()*\\] & rapikan spasi
export function normalisasiKeyword(raw?: string): string | undefined {
  if (raw === undefined || raw === null) return undefined;
  const bersih = raw.replace(/[%,()*\\]/g, ' ').replace(/\s+/g, ' ').trim();
  return bersih.length > 0 ? bersih : undefined;
}

const rating = (j: Jasa) => j.rating_rata_rata ?? 0;
const waktu = (j: Jasa) => Date.parse(j.created_at ?? '') || 0;
const cocok = (teks: string, kata: string) => teks.toLowerCase().includes(kata.toLowerCase());

// C17 LayananPencarian
export class LayananPencarian {
  // Algo-1701 baris 1 + validasi rentang untuk Algo-1702
  static validasiFilter(f: FilterPencarian): void {
    if (f.keyword !== undefined && f.keyword.trim().length > 0) {
      const bersih = normalisasiKeyword(f.keyword);
      if (!bersih || bersih.length < MIN_PANJANG_KEYWORD) {
        throw new Error(`Keyword Pencarian Minimal ${MIN_PANJANG_KEYWORD} karakter`);
      }
    }
    const { harga_min, harga_max, rating_min, rating_max, limit } = f;
    if ([harga_min, harga_max, rating_min, rating_max].some((n) => n !== undefined && !Number.isFinite(n))) {
      throw new Error('Rentang harga dan rating harus berupa angka');
    }
    if ((harga_min ?? 0) < 0 || (harga_max ?? 0) < 0 || (harga_min ?? 0) > (harga_max ?? Infinity)) {
      throw new Error('Rentang harga tidak valid');
    }
    if ((rating_min ?? 0) < 0 || (rating_max ?? 0) > 5 || (rating_min ?? 0) > (rating_max ?? 5)) {
      throw new Error('Rentang rating harus antara 0 hingga 5');
    }
    if (f.urutkan && !DAFTAR_URUTAN.includes(f.urutkan)) throw new Error('Urutan pencarian tidak valid');
    if (limit !== undefined) {
      if (typeof limit !== 'number' || !Number.isInteger(limit) || limit < 1 || limit > MAKS_LIMIT_PENCARIAN) {
        throw new Error('Batas jumlah hasil pencarian (limit) tidak valid');
      }
    }
  }

  // Inti logika murni (dipakai mode mock, post-proses hasil DB, dan unit test)
  static saringDanUrutkan(daftar: Jasa[], f: FilterPencarian = {}): Jasa[] {
    const keyword = normalisasiKeyword(f.keyword);
    const hasil = daftar.filter(
      (j) =>
        j.status_aktif !== false &&
        (!keyword || cocok(j.nama_jasa, keyword) || cocok(j.deskripsi, keyword)) &&
        (!f.kategori || j.kategori.toLowerCase() === f.kategori.toLowerCase()) &&
        j.harga >= (f.harga_min ?? 0) &&
        j.harga <= (f.harga_max ?? Infinity) &&
        rating(j) >= (f.rating_min ?? 0) &&
        rating(j) <= (f.rating_max ?? 5),
    );

    const urutan = f.urutkan ?? 'terbaru';
    const relevansi = (j: Jasa) => (keyword && !f.urutkan && cocok(j.nama_jasa, keyword) ? 0 : 1); // Q-1701 CASE WHEN
    hasil.sort((a, b) => {
      if (relevansi(a) !== relevansi(b)) return relevansi(a) - relevansi(b);
      if (urutan === 'harga_asc') return a.harga - b.harga;
      if (urutan === 'harga_desc') return b.harga - a.harga;
      if (urutan === 'rating_desc') return rating(b) - rating(a);
      return waktu(b) - waktu(a);
    });
    return hasil.slice(0, f.limit ?? BATAS_HASIL_PENCARIAN);
  }

  // Algo-1701 / Q-1701
  static async cariJasaBerdasarkanKeyword(keyword: string): Promise<Jasa[]> {
    const bersih = normalisasiKeyword(keyword);
    if (!bersih || bersih.length < MIN_PANJANG_KEYWORD) {
      throw new Error(`Keyword Pencarian Minimal ${MIN_PANJANG_KEYWORD} karakter`);
    }
    return this.terapkanFilterPencarian({ keyword: bersih });
  }

  // Algo-1702 / Q-1701 (Tabel 5.17.2)
  static async terapkanFilterPencarian(f: FilterPencarian): Promise<Jasa[]> {
    this.validasiFilter(f);
    const { createClient } = await import('@/lib/supabase/server'); // lazy: unit test tidak butuh next/headers
    const supabase = await createClient();

    let query = supabase.from('jasa').select('*').eq('status_aktif', true);
    const keyword = normalisasiKeyword(f.keyword);
    if (keyword) query = query.or(`nama_jasa.ilike.%${keyword}%,deskripsi.ilike.%${keyword}%`);
    if (f.kategori) query = query.ilike('kategori', f.kategori);
    if (f.harga_min !== undefined) query = query.gte('harga', f.harga_min);
    if (f.harga_max !== undefined) query = query.lte('harga', f.harga_max);
    if (f.rating_min !== undefined) query = query.gte('rating_rata_rata', f.rating_min);
    if (f.rating_max !== undefined) query = query.lte('rating_rata_rata', f.rating_max);

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    // ponytail: relevansi (CASE WHEN) tidak didukung PostgREST -> urut + LIMIT di memori
    return this.saringDanUrutkan((data ?? []) as Jasa[], { ...f, keyword });
  }
}

// C18 LayananPembandingJasa
export class LayananPembandingJasa {
  // Inti logika murni: susun matriks dari jasa yang sudah diambil
  static susunMatriks(daftar: Jasa[], id_jasa_list: string[]): HasilKomparasiJasa {
    const ids = [...new Set(id_jasa_list)];
    if (ids.length < 2) throw new Error('Minimal 2 ID jasa diperlukan untuk komparasi');
    if (ids.length > MAKS_KOMPARASI_JASA) {
      throw new Error(`Maksimal ${MAKS_KOMPARASI_JASA} jasa yang dapat dibandingkan secara bersamaan`);
    }

    const jasa = ids.map((id) => daftar.find((j) => j.id_jasa === id && j.status_aktif !== false));
    if (jasa.some((j) => !j)) throw new Error('Data jasa tidak ditemukan atau tidak aktif');
    const hasil = jasa as Jasa[];

    const termurah = hasil.reduce((a, b) => (b.harga < a.harga ? b : a));
    const termahal = hasil.reduce((a, b) => (b.harga > a.harga ? b : a));
    const terbaik = hasil.reduce((a, b) => (rating(b) > rating(a) ? b : a));
    return {
      jasa: hasil,
      ringkasan: {
        id_termurah: termurah.id_jasa,
        id_termahal: termahal.id_jasa,
        selisih_harga: termahal.harga - termurah.harga,
        id_rating_tertinggi: terbaik.id_jasa,
      },
    };
  }

  // Algo-1801 / Q-1801 (diperluas dari 2 ID menjadi 2 s.d 4 ID)
  static async bandingkanSpesifikasiJasa(id_jasa_list: string[]): Promise<HasilKomparasiJasa> {
    const ids = [...new Set(id_jasa_list)];
    if (ids.length < 2) throw new Error('Minimal 2 ID jasa diperlukan untuk komparasi');
    if (ids.length > MAKS_KOMPARASI_JASA) {
      throw new Error(`Maksimal ${MAKS_KOMPARASI_JASA} jasa yang dapat dibandingkan secara bersamaan`);
    }
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data, error } = await supabase.from('jasa').select('*').in('id_jasa', ids).eq('status_aktif', true);
    if (error) throw new Error(error.message);
    return this.susunMatriks((data ?? []) as Jasa[], ids);
  }
}
