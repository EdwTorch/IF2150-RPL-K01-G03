import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Jasa } from '../models/types';
import {
  LayananPembandingJasa,
  LayananPencarian,
  normalisasiKeyword,
  MAKS_KOMPARASI_JASA,
  MAKS_LIMIT_PENCARIAN,
} from '../services/pencarian.service';
import { GET as getJasa } from '../app/api/jasa/route';

// Mock Supabase Server
let mockSupabaseSelectResult: { data: unknown; error: unknown } = { data: [], error: null };
let mockSupabaseInResult: { data: unknown; error: unknown } = { data: [], error: null };

const createMockSupabase = () => {
  const queryBuilder: Record<string, unknown> = {};
  queryBuilder.select = vi.fn().mockReturnValue(queryBuilder);
  queryBuilder.eq = vi.fn().mockReturnValue(queryBuilder);
  queryBuilder.or = vi.fn().mockReturnValue(queryBuilder);
  queryBuilder.ilike = vi.fn().mockReturnValue(queryBuilder);
  queryBuilder.gte = vi.fn().mockReturnValue(queryBuilder);
  queryBuilder.lte = vi.fn().mockReturnValue(queryBuilder);
  queryBuilder.in = vi.fn().mockImplementation(() => {
    return {
      eq: vi.fn().mockImplementation(() => Promise.resolve(mockSupabaseInResult)),
    };
  });
  queryBuilder.order = vi.fn().mockImplementation(() => Promise.resolve(mockSupabaseSelectResult));

  return {
    from: vi.fn().mockReturnValue(queryBuilder),
  };
};

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => createMockSupabase()),
}));

const jasa = (o: Partial<Jasa> & Pick<Jasa, 'id_jasa'>): Jasa => ({
  id_penyedia_jasa: 'p1',
  nama_jasa: 'Jasa',
  deskripsi: 'deskripsi',
  kategori: 'Desain Grafis',
  harga: 100000,
  rating_rata_rata: 0,
  status_aktif: true,
  created_at: '2026-11-01T00:00:00Z',
  ...o,
});

const data: Jasa[] = [
  jasa({ id_jasa: 'a', nama_jasa: 'Desain Logo', harga: 250000, rating_rata_rata: 4.8, created_at: '2026-11-01T00:00:00Z' }),
  jasa({ id_jasa: 'b', nama_jasa: 'Edit Video', deskripsi: 'bisa bonus logo animasi', kategori: 'Video', harga: 150000, rating_rata_rata: 4.5, created_at: '2026-11-02T00:00:00Z' }),
  jasa({ id_jasa: 'c', nama_jasa: 'Landing Page', kategori: 'Pemrograman', harga: 1200000, rating_rata_rata: 4.9, created_at: '2026-11-03T00:00:00Z' }),
  jasa({ id_jasa: 'd', nama_jasa: 'Logo Nonaktif', harga: 100000, status_aktif: false, created_at: '2026-11-04T00:00:00Z' }),
  jasa({ id_jasa: 'e', nama_jasa: 'SEO Copywriting', kategori: 'Penulisan', harga: 300000, rating_rata_rata: 4.2, created_at: '2026-11-05T00:00:00Z' }),
];
const ids = (l: Jasa[]) => l.map((j) => j.id_jasa);

describe('normalisasiKeyword', () => {
  it('membersihkan karakter khusus PostgREST [%,()*\\\\] dan merapikan spasi', () => {
    expect(normalisasiKeyword('%%logo%%')).toBe('logo');
    expect(normalisasiKeyword('logo (2D)')).toBe('logo 2D');
    expect(normalisasiKeyword('   desain   web   ')).toBe('desain web');
    expect(normalisasiKeyword('***')).toBeUndefined();
    expect(normalisasiKeyword(undefined)).toBeUndefined();
  });
});

describe('LayananPencarian.validasiFilter (Algo-1701/1702)', () => {
  it('menolak keyword < 3 karakter', () => {
    expect(() => LayananPencarian.validasiFilter({ keyword: 'ab' })).toThrow('Minimal 3 karakter');
  });
  it('menolak keyword dengan karakter PostgREST yang setelah dibersihkan < 3 karakter', () => {
    expect(() => LayananPencarian.validasiFilter({ keyword: '%%%' })).toThrow('Minimal 3 karakter');
    expect(() => LayananPencarian.validasiFilter({ keyword: '***' })).toThrow('Minimal 3 karakter');
    expect(() => LayananPencarian.validasiFilter({ keyword: 'ab%' })).toThrow('Minimal 3 karakter');
  });
  it('menerima keyword dengan simbol jika setelah dibersihkan >= 3 karakter', () => {
    expect(() => LayananPencarian.validasiFilter({ keyword: 'logo (2D)' })).not.toThrow();
  });
  it('menerima keyword kosong/undefined', () => {
    expect(() => LayananPencarian.validasiFilter({})).not.toThrow();
    expect(() => LayananPencarian.validasiFilter({ keyword: '  ' })).not.toThrow();
  });
  it('menolak rentang harga/rating tidak sah', () => {
    expect(() => LayananPencarian.validasiFilter({ harga_min: 500, harga_max: 100 })).toThrow('Rentang harga');
    expect(() => LayananPencarian.validasiFilter({ harga_min: -1 })).toThrow('Rentang harga');
    expect(() => LayananPencarian.validasiFilter({ harga_min: NaN })).toThrow('angka');
    expect(() => LayananPencarian.validasiFilter({ rating_min: 6 })).toThrow('Rentang rating');
    expect(() => LayananPencarian.validasiFilter({ rating_max: 6 })).toThrow('Rentang rating');
    expect(() => LayananPencarian.validasiFilter({ rating_min: 4, rating_max: 3 })).toThrow('Rentang rating');
  });
  it('menolak urutan tidak dikenal', () => {
    expect(() => LayananPencarian.validasiFilter({ urutkan: 'acak' as never })).toThrow('Urutan');
  });
  it('menolak limit tidak valid', () => {
    expect(() => LayananPencarian.validasiFilter({ limit: 0 })).toThrow('limit');
    expect(() => LayananPencarian.validasiFilter({ limit: -5 })).toThrow('limit');
    expect(() => LayananPencarian.validasiFilter({ limit: 101 })).toThrow('limit');
    expect(() => LayananPencarian.validasiFilter({ limit: NaN })).toThrow('limit');
    expect(() => LayananPencarian.validasiFilter({ limit: 1.5 })).toThrow('limit');
  });
  it('menerima limit valid 1 - 100', () => {
    expect(() => LayananPencarian.validasiFilter({ limit: 1 })).not.toThrow();
    expect(() => LayananPencarian.validasiFilter({ limit: 50 })).not.toThrow();
    expect(() => LayananPencarian.validasiFilter({ limit: MAKS_LIMIT_PENCARIAN })).not.toThrow();
  });
});

describe('LayananPencarian.saringDanUrutkan', () => {
  it('mengabaikan jasa nonaktif', () => {
    expect(ids(LayananPencarian.saringDanUrutkan(data))).not.toContain('d');
  });
  it('keyword cocok di nama atau deskripsi (case-insensitive), nama diutamakan', () => {
    expect(ids(LayananPencarian.saringDanUrutkan(data, { keyword: 'LOGO' }))).toEqual(['a', 'b']);
  });
  it('filter kategori', () => {
    expect(ids(LayananPencarian.saringDanUrutkan(data, { kategori: 'pemrograman' }))).toEqual(['c']);
  });
  it('filter harga min-max (inklusif)', () => {
    expect(ids(LayananPencarian.saringDanUrutkan(data, { harga_min: 150000, harga_max: 250000, urutkan: 'harga_asc' }))).toEqual(['b', 'a']);
  });
  it('filter rating minimum', () => {
    expect(ids(LayananPencarian.saringDanUrutkan(data, { rating_min: 4.8, urutkan: 'rating_desc' }))).toEqual(['c', 'a']);
  });
  it('sorting harga_asc, harga_desc, rating_desc, terbaru (default)', () => {
    expect(ids(LayananPencarian.saringDanUrutkan(data, { urutkan: 'harga_asc' }))).toEqual(['b', 'a', 'e', 'c']);
    expect(ids(LayananPencarian.saringDanUrutkan(data, { urutkan: 'harga_desc' }))).toEqual(['c', 'e', 'a', 'b']);
    expect(ids(LayananPencarian.saringDanUrutkan(data, { urutkan: 'rating_desc' }))).toEqual(['c', 'a', 'b', 'e']);
    expect(ids(LayananPencarian.saringDanUrutkan(data))).toEqual(['e', 'c', 'b', 'a']);
  });
  it('membatasi hasil (default 20, bisa diubah)', () => {
    expect(LayananPencarian.saringDanUrutkan(data, { limit: 2 })).toHaveLength(2);
    const banyak = Array.from({ length: 30 }, (_, i) => jasa({ id_jasa: `x${i}` }));
    expect(LayananPencarian.saringDanUrutkan(banyak)).toHaveLength(20);
  });
  it('mengembalikan array kosong jika tidak ada yang cocok', () => {
    expect(LayananPencarian.saringDanUrutkan(data, { keyword: 'tidakada' })).toEqual([]);
  });
});

describe('LayananPembandingJasa.susunMatriks (Algo-1801)', () => {
  it('menghitung ringkasan perbandingan 3 jasa', () => {
    const r = LayananPembandingJasa.susunMatriks(data, ['a', 'b', 'c']);
    expect(ids(r.jasa)).toEqual(['a', 'b', 'c']);
    expect(r.ringkasan).toEqual({
      id_termurah: 'b',
      id_termahal: 'c',
      selisih_harga: 1050000,
      id_rating_tertinggi: 'c',
    });
  });
  it('menolak < 2 ID unik', () => {
    expect(() => LayananPembandingJasa.susunMatriks(data, ['a'])).toThrow('Minimal 2 ID');
    expect(() => LayananPembandingJasa.susunMatriks(data, ['a', 'a'])).toThrow('Minimal 2 ID');
  });
  it(`menolak > ${MAKS_KOMPARASI_JASA} ID unik`, () => {
    expect(() => LayananPembandingJasa.susunMatriks(data, ['a', 'b', 'c', 'd', 'e'])).toThrow(
      'Maksimal 4 jasa yang dapat dibandingkan secara bersamaan',
    );
  });
  it('menolak ID tidak ditemukan atau nonaktif', () => {
    expect(() => LayananPembandingJasa.susunMatriks(data, ['a', 'zzz'])).toThrow('tidak ditemukan');
    expect(() => LayananPembandingJasa.susunMatriks(data, ['a', 'd'])).toThrow('tidak aktif');
  });
});

describe('Route Handler GET /api/jasa (Pencarian & Komparasi)', () => {
  const prevMock = process.env.NEXT_PUBLIC_USE_MOCK;
  beforeEach(() => {
    process.env.NEXT_PUBLIC_USE_MOCK = 'true';
  });
  afterEach(() => {
    process.env.NEXT_PUBLIC_USE_MOCK = prevMock;
  });

  it('mengembalikan 400 jika limit bukan angka valid (?limit=abc atau ?limit=0)', async () => {
    const resAbc = await getJasa(new Request('http://localhost/api/jasa?limit=abc'));
    expect(resAbc.status).toBe(400);
    const jsonAbc = await resAbc.json();
    expect(jsonAbc.error_code).toBe('VALIDATION_ERROR');

    const resZero = await getJasa(new Request('http://localhost/api/jasa?limit=0'));
    expect(resZero.status).toBe(400);
  });

  it('mengembalikan 400 jika keyword berisi hanya karakter pemisah PostgREST (?q=%%%)', async () => {
    const res = await getJasa(new Request('http://localhost/api/jasa?q=%%%'));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error_code).toBe('VALIDATION_ERROR');
    expect(json.message).toContain('Minimal 3 karakter');
  });

  it('mengembalikan 400 jika komparasi melebihi batas maksimal 4 ID jasa', async () => {
    const res = await getJasa(new Request('http://localhost/api/jasa?compare=id1,id2,id3,id4,id5'));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error_code).toBe('VALIDATION_ERROR');
    expect(json.message).toContain('Maksimal 4 jasa');
  });

  it('mendukung mode non-mock untuk perbandingan jasa (?compare=id1,id2)', async () => {
    process.env.NEXT_PUBLIC_USE_MOCK = 'false';
    mockSupabaseInResult = {
      data: [
        jasa({ id_jasa: 'j1', nama_jasa: 'Jasa 1', harga: 100000, rating_rata_rata: 4.5 }),
        jasa({ id_jasa: 'j2', nama_jasa: 'Jasa 2', harga: 200000, rating_rata_rata: 4.8 }),
      ],
      error: null,
    };

    const res = await getJasa(new Request('http://localhost/api/jasa?compare=j1,j2'));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.ringkasan.id_termurah).toBe('j1');
    expect(json.data.ringkasan.id_termahal).toBe('j2');
  });

  it('mendukung mode non-mock untuk pencarian dengan filter', async () => {
    process.env.NEXT_PUBLIC_USE_MOCK = 'false';
    mockSupabaseSelectResult = {
      data: [
        jasa({ id_jasa: 'j1', nama_jasa: 'Desain Logo Unik', harga: 150000, kategori: 'Desain Grafis', rating_rata_rata: 4.5 }),
      ],
      error: null,
    };

    const res = await getJasa(new Request('http://localhost/api/jasa?q=Logo&kategori=Desain%20Grafis&harga_min=100000&harga_max=200000&rating_min=4&rating_max=5&sort=harga_asc&limit=10'));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data).toHaveLength(1);
    expect(json.message).toBe('Data penawaran jasa berhasil diambil');
  });

  it('mengembalikan pesan "Data jasa tidak ditemukan" jika hasil pencarian kosong pada mode non-mock', async () => {
    process.env.NEXT_PUBLIC_USE_MOCK = 'false';
    mockSupabaseSelectResult = { data: [], error: null };

    const res = await getJasa(new Request('http://localhost/api/jasa?q=TidakAda'));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data).toEqual([]);
    expect(json.message).toBe('Data jasa tidak ditemukan');
  });

  it('mengembalikan status 500 jika terjadi kegagalan basis data pada mode non-mock', async () => {
    process.env.NEXT_PUBLIC_USE_MOCK = 'false';
    mockSupabaseSelectResult = { data: null, error: { message: 'Database connection failed' } };

    const res = await getJasa(new Request('http://localhost/api/jasa?q=Logo'));
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error_code).toBe('DATABASE_ERROR');
  });
});

describe('LayananPencarian & LayananPembandingJasa Integrasi Supabase (Algo-1701, 1702, 1801)', () => {
  it('cariJasaBerdasarkanKeyword melempar error jika keyword kurang dari 3 karakter setelah dinormalisasi', async () => {
    await expect(LayananPencarian.cariJasaBerdasarkanKeyword('ab')).rejects.toThrow('Keyword Pencarian Minimal 3 karakter');
    await expect(LayananPencarian.cariJasaBerdasarkanKeyword('   %a%  ')).rejects.toThrow('Keyword Pencarian Minimal 3 karakter');
  });

  it('cariJasaBerdasarkanKeyword berhasil memanggil terapkanFilterPencarian dan mengembalikan data', async () => {
    mockSupabaseSelectResult = {
      data: [jasa({ id_jasa: 'j1', nama_jasa: 'Desain Logo Modern', rating_rata_rata: 4.7 })],
      error: null,
    };

    const hasil = await LayananPencarian.cariJasaBerdasarkanKeyword('Logo');
    expect(hasil).toHaveLength(1);
    expect(hasil[0].id_jasa).toBe('j1');
  });

  it('terapkanFilterPencarian melempar error jika query supabase gagal', async () => {
    mockSupabaseSelectResult = {
      data: null,
      error: { message: 'Koneksi database terputus' },
    };

    await expect(LayananPencarian.terapkanFilterPencarian({ keyword: 'Logo' })).rejects.toThrow('Koneksi database terputus');
  });

  it('bandingkanSpesifikasiJasa memvalidasi jumlah ID jasa yang diberikan', async () => {
    await expect(LayananPembandingJasa.bandingkanSpesifikasiJasa(['j1'])).rejects.toThrow('Minimal 2 ID');
    await expect(LayananPembandingJasa.bandingkanSpesifikasiJasa(['j1', 'j2', 'j3', 'j4', 'j5'])).rejects.toThrow('Maksimal 4 jasa');
  });

  it('bandingkanSpesifikasiJasa melempar error jika query supabase gagal', async () => {
    mockSupabaseInResult = {
      data: null,
      error: { message: 'Gagal mengambil data komparasi' },
    };

    await expect(LayananPembandingJasa.bandingkanSpesifikasiJasa(['j1', 'j2'])).rejects.toThrow('Gagal mengambil data komparasi');
  });

  it('bandingkanSpesifikasiJasa berhasil menyusun matriks dari database', async () => {
    mockSupabaseInResult = {
      data: [
        jasa({ id_jasa: 'j1', nama_jasa: 'Logo Murah', harga: 50000, rating_rata_rata: 4.2 }),
        jasa({ id_jasa: 'j2', nama_jasa: 'Logo Premium', harga: 500000, rating_rata_rata: 4.9 }),
      ],
      error: null,
    };

    const hasil = await LayananPembandingJasa.bandingkanSpesifikasiJasa(['j1', 'j2']);
    expect(hasil.ringkasan.id_termurah).toBe('j1');
    expect(hasil.ringkasan.id_termahal).toBe('j2');
    expect(hasil.ringkasan.selisih_harga).toBe(450000);
    expect(hasil.ringkasan.id_rating_tertinggi).toBe('j2');
  });
});
