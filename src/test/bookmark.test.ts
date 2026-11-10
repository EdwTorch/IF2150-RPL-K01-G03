import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Bookmark, Jasa } from '../models/types';
import { PengontrolBookmark } from '../services/bookmark.service';
import { GET, POST, DELETE, responsGagal } from '../app/api/bookmark/route';
import { mockBookmarkList } from '../lib/mocks/bookmark.mock';

// --- MOCK SUPABASE & AUTH ---
let mockSessionUser: { id: string; email: string; nama: string; role: string; status_akun: boolean; isPenyediaJasa: boolean; isPenggunaJasa: boolean } | null = null;

vi.mock('@/services/auth.service', () => ({
  getSessionUser: vi.fn(async () => mockSessionUser),
}));

let mockDbJasa: Partial<Jasa> | null = null;
let mockDbInsertBookmark: Partial<Bookmark> | null = null;
let mockDbInsertError: { code: string; message: string } | null = null;
let mockDbDeleteData: { id_bookmark: string }[] | null = null;
let mockDbSelectBookmarks: Partial<Bookmark>[] = [];

const mockSupabase = {
  from: vi.fn((table: string) => {
    if (table === 'jasa') {
      return {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => ({
              maybeSingle: vi.fn(async () => ({ data: mockDbJasa, error: null })),
            })),
          })),
        })),
      };
    }
    if (table === 'bookmark') {
      return {
        select: vi.fn(() => ({
          eq: vi.fn((col1: string, val1: string) => ({
            order: vi.fn(async () => ({ data: mockDbSelectBookmarks, error: null })),
            eq: vi.fn((col2: string, val2: string) => ({
              maybeSingle: vi.fn(async () => {
                const found = mockDbSelectBookmarks.find(
                  (b: Record<string, unknown>) => b[col1] === val1 && b[col2] === val2,
                );
                return { data: found ? { id_bookmark: found.id_bookmark } : null, error: null };
              }),
            })),
          })),
        })),
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(async () => {
              if (mockDbInsertError) {
                return { data: null, error: mockDbInsertError };
              }
              return { data: mockDbInsertBookmark, error: null };
            }),
          })),
        })),
        delete: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => ({
              select: vi.fn(async () => ({ data: mockDbDeleteData, error: null })),
            })),
          })),
        })),
      };
    }
    return {};
  }),
};

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => mockSupabase),
}));

const jasa = (o: Partial<Jasa> & Pick<Jasa, 'id_jasa'>): Jasa => ({
  id_penyedia_jasa: 'p1',
  nama_jasa: 'Jasa Uji',
  deskripsi: 'Deskripsi jasa uji',
  kategori: 'Desain Grafis',
  harga: 200000,
  rating_rata_rata: 4.7,
  status_aktif: true,
  created_at: '2026-11-01T00:00:00Z',
  ...o,
});

const daftarJasa: Jasa[] = [
  jasa({ id_jasa: 'j1', nama_jasa: 'Desain Logo', harga: 250000 }),
  jasa({ id_jasa: 'j2', nama_jasa: 'Edit Video', harga: 150000 }),
  jasa({ id_jasa: 'j3', nama_jasa: 'Landing Page', harga: 1200000 }),
  jasa({ id_jasa: 'j4', nama_jasa: 'Jasa Nonaktif', status_aktif: false }),
];

const daftarAwal: Bookmark[] = [
  {
    id_bookmark: 'b1',
    id_pengguna_jasa: 'u1',
    id_jasa: 'j1',
    waktu_disimpan: '2026-11-05T10:00:00Z',
  },
  {
    id_bookmark: 'b2',
    id_pengguna_jasa: 'u1',
    id_jasa: 'j3',
    waktu_disimpan: '2026-11-06T12:00:00Z',
  },
  {
    id_bookmark: 'b3',
    id_pengguna_jasa: 'u1',
    id_jasa: 'j4', // jasa nonaktif
    waktu_disimpan: '2026-11-07T08:00:00Z',
  },
  {
    id_bookmark: 'b4',
    id_pengguna_jasa: 'u2',
    id_jasa: 'j2',
    waktu_disimpan: '2026-11-06T09:00:00Z',
  },
];

describe('PengontrolBookmark - Logika Murni Memori', () => {
  it('validasiInput menolak id_pengguna_jasa atau target kosong/spasi', () => {
    expect(() => PengontrolBookmark.validasiInput('', 'j1')).toThrow('Parameter input tidak valid');
    expect(() => PengontrolBookmark.validasiInput('   ', 'j1')).toThrow('Parameter input tidak valid');
    expect(() => PengontrolBookmark.validasiInput('u1', '')).toThrow('Parameter input tidak valid');
    expect(() => PengontrolBookmark.validasiInput('u1', '  ')).toThrow('Parameter input tidak valid');
    expect(() => PengontrolBookmark.validasiInput('u1', undefined, false)).not.toThrow();
  });

  it('daftarDariMemori menyaring milik pengguna dan menyembunyikan jasa nonaktif', () => {
    const hasil = PengontrolBookmark.daftarDariMemori(daftarAwal, daftarJasa, 'u1');
    expect(hasil.map((b) => b.id_jasa)).toEqual(['j3', 'j1']);
    expect(hasil[0].jasa?.nama_jasa).toBe('Landing Page');
    expect(hasil[1].jasa?.nama_jasa).toBe('Desain Logo');
    expect(PengontrolBookmark.daftarDariMemori(daftarAwal, daftarJasa, 'u-baru')).toEqual([]);
  });

  it('tambahKeMemori berhasil menambahkan bookmark dan menolak duplikasi', () => {
    const baru = PengontrolBookmark.tambahKeMemori(daftarAwal, daftarJasa, 'u1', 'j2');
    expect(baru.id_bookmark).toBeTruthy();
    expect(baru.jasa?.nama_jasa).toBe('Edit Video');

    expect(() => PengontrolBookmark.tambahKeMemori(daftarAwal, daftarJasa, 'u1', 'j-tidak-ada')).toThrow(
      'Data jasa tidak ditemukan',
    );
    expect(() => PengontrolBookmark.tambahKeMemori(daftarAwal, daftarJasa, 'u2', 'j4')).toThrow(
      'Data jasa tidak ditemukan',
    );
    expect(() => PengontrolBookmark.tambahKeMemori(daftarAwal, daftarJasa, 'u1', 'j1')).toThrow(
      'Jasa sudah ada di dalam bookmark',
    );
  });

  it('hapusDariMemori berhasil menghapus bookmark berdasarkan id_jasa maupun id_bookmark', () => {
    const sisaByJasa = PengontrolBookmark.hapusDariMemori(daftarAwal, 'u1', 'j1');
    expect(sisaByJasa.find((b) => b.id_bookmark === 'b1')).toBeUndefined();

    const sisaById = PengontrolBookmark.hapusDariMemori(daftarAwal, 'u1', 'b2');
    expect(sisaById.find((b) => b.id_bookmark === 'b2')).toBeUndefined();

    expect(() => PengontrolBookmark.hapusDariMemori(daftarAwal, 'u1', 'j2')).toThrow('Data bookmark tidak ditemukan');
  });

  it('toggleDiMemori menambah saat belum ada, lalu menghapus saat dipanggil kembali', () => {
    const tambah = PengontrolBookmark.toggleDiMemori(daftarAwal, daftarJasa, 'u1', 'j2');
    expect(tambah.action).toBe('added');
    expect(tambah.data?.id_jasa).toBe('j2');

    const hapus = PengontrolBookmark.toggleDiMemori(tambah.daftar, daftarJasa, 'u1', 'j2');
    expect(hapus.action).toBe('removed');
    expect(hapus.data).toBeNull();
  });
});

describe('PengontrolBookmark - Metode Supabase Database', () => {
  beforeEach(() => {
    mockDbJasa = { id_jasa: 'j1', nama_jasa: 'Jasa Test', status_aktif: true };
    mockDbInsertBookmark = { id_bookmark: 'bm-1', id_pengguna_jasa: 'u1', id_jasa: 'j1' };
    mockDbInsertError = null;
    mockDbDeleteData = [{ id_bookmark: 'bm-1' }];
    mockDbSelectBookmarks = [];
  });

  it('tambahDataBookmark berhasil menyimpan data jika jasa aktif', async () => {
    const hasil = await PengontrolBookmark.tambahDataBookmark('u1', 'j1');
    expect(hasil.id_bookmark).toBe('bm-1');
  });

  it('tambahDataBookmark melempar error jika jasa tidak ditemukan', async () => {
    mockDbJasa = null;
    await expect(PengontrolBookmark.tambahDataBookmark('u1', 'j-non')).rejects.toThrow(
      'Data jasa tidak ditemukan',
    );
  });

  it('tambahDataBookmark melempar error duplikasi saat Postgres error 23505', async () => {
    mockDbInsertError = { code: '23505', message: 'duplicate key' };
    await expect(PengontrolBookmark.tambahDataBookmark('u1', 'j1')).rejects.toThrow(
      'Jasa sudah ada di dalam bookmark',
    );
  });

  it('hapusDataBookmark berhasil menghapus dan melempar error jika tidak ada', async () => {
    mockDbDeleteData = [{ id_bookmark: 'bm-1' }];
    const sukses = await PengontrolBookmark.hapusDataBookmark('u1', 'j1');
    expect(sukses).toBe(true);

    mockDbDeleteData = [];
    await expect(PengontrolBookmark.hapusDataBookmark('u1', 'j1')).rejects.toThrow(
      'Data bookmark tidak ditemukan',
    );
  });

  it('ambilDaftarBookmarkPengguna mengembalikan daftar dan menyaring jasa nonaktif', async () => {
    mockDbSelectBookmarks = [
      { id_bookmark: 'b1', id_pengguna_jasa: 'u1', id_jasa: 'j1', jasa: { status_aktif: true } as Jasa },
      { id_bookmark: 'b2', id_pengguna_jasa: 'u1', id_jasa: 'j2', jasa: { status_aktif: false } as Jasa },
    ];
    const hasil = await PengontrolBookmark.ambilDaftarBookmarkPengguna('u1');
    expect(hasil).toHaveLength(1);
    expect(hasil[0].id_bookmark).toBe('b1');
  });

  it('toggleBookmark menghapus jika sudah ada, atau menambah jika belum ada', async () => {
    // Kasus 1: Sudah ada -> hapus
    mockDbSelectBookmarks = [{ id_bookmark: 'bm-ada', id_pengguna_jasa: 'u1', id_jasa: 'j1' }];
    mockDbDeleteData = [{ id_bookmark: 'bm-ada' }];
    const hasilHapus = await PengontrolBookmark.toggleBookmark('u1', 'j1');
    expect(hasilHapus.action).toBe('removed');
    expect(hasilHapus.data).toBeNull();

    // Kasus 2: Belum ada -> tambah
    mockDbSelectBookmarks = [];
    mockDbJasa = { id_jasa: 'j1', status_aktif: true };
    mockDbInsertBookmark = { id_bookmark: 'bm-baru', id_pengguna_jasa: 'u1', id_jasa: 'j1' };
    const hasilTambah = await PengontrolBookmark.toggleBookmark('u1', 'j1');
    expect(hasilTambah.action).toBe('added');
    expect(hasilTambah.data?.id_bookmark).toBe('bm-baru');
  });

  it('toggleBookmark menangani race condition double-click saat insert bentrok 23505', async () => {
    mockDbSelectBookmarks = []; // awal cek: belum ada
    mockDbJasa = { id_jasa: 'j1', status_aktif: true };
    mockDbInsertError = { code: '23505', message: 'duplicate key' }; // saat insert: ternyata request bersamaan sudah nambah
    mockDbDeleteData = [{ id_bookmark: 'bm-1' }]; // maka otomatis un-bookmark

    const hasil = await PengontrolBookmark.toggleBookmark('u1', 'j1');
    expect(hasil.action).toBe('removed');
    expect(hasil.data).toBeNull();
  });
});

describe('Route Handler /api/bookmark (HTTP, Autentikasi, IDOR & Mock State)', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_USE_MOCK = 'true';
    mockSessionUser = null;
  });

  it('POST /api/bookmark menolak format body JSON yang rusak dengan 400', async () => {
    const req = new Request('http://localhost/api/bookmark', {
      method: 'POST',
      body: 'invalid-json{',
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error_code).toBe('VALIDATION_ERROR');
    expect(body.message).toContain('Format body JSON tidak valid');
  });

  it('Mode Mock: POST (tambah) memutasi mockBookmarkList di memori dan GET membacanya', async () => {
    const idBaru = 'a0000000-0000-4000-8000-000000000002'; // Jasa 2 dari mockJasaList
    const reqPost = new Request('http://localhost/api/bookmark', {
      method: 'POST',
      body: JSON.stringify({ id_pengguna_jasa: 'u-tester', id_jasa: idBaru }),
      headers: { 'Content-Type': 'application/json' },
    });
    const resPost = await POST(reqPost);
    expect(resPost.status).toBe(201);

    // Verifikasi GET membaca state yang telah diperbarui
    const reqGet = new Request('http://localhost/api/bookmark?id_pengguna_jasa=u-tester');
    const resGet = await GET(reqGet);
    const bodyGet = await resGet.json();
    expect(resGet.status).toBe(200);
    expect(bodyGet.data.some((b: Bookmark) => b.id_jasa === idBaru)).toBe(true);

    // Verifikasi DELETE juga memutasi mockBookmarkList
    const reqDel = new Request(`http://localhost/api/bookmark?id_pengguna_jasa=u-tester&id_jasa=${idBaru}`, {
      method: 'DELETE',
    });
    const resDel = await DELETE(reqDel);
    expect(resDel.status).toBe(200);

    const resGet2 = await GET(new Request('http://localhost/api/bookmark?id_pengguna_jasa=u-tester'));
    const bodyGet2 = await resGet2.json();
    expect(bodyGet2.data.some((b: Bookmark) => b.id_jasa === idBaru)).toBe(false);
  });

  it('Mode Mock: duplikasi bookmark mengembalikan status 409 CONFLICT', async () => {
    const idJasa = 'a0000000-0000-4000-8000-000000000001';
    // mockBookmarkList sudah punya item ini untuk PENGGUNA_JASA_1
    const idPengguna = mockBookmarkList[0].id_pengguna_jasa;
    const req = new Request('http://localhost/api/bookmark', {
      method: 'POST',
      body: JSON.stringify({ id_pengguna_jasa: idPengguna, id_jasa: idJasa }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error_code).toBe('CONFLICT');
    expect(body.message).toContain('Jasa sudah ada di dalam bookmark');
  });

  it('Mode Non-Mock: menolak akses jika tidak terautentikasi (401)', async () => {
    process.env.NEXT_PUBLIC_USE_MOCK = 'false';
    mockSessionUser = null;

    const req = new Request('http://localhost/api/bookmark');
    const res = await GET(req);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error_code).toBe('UNAUTHORIZED');
  });

  it('Mode Non-Mock: mencegah IDOR (403) jika id_pengguna_jasa beda dengan user login', async () => {
    process.env.NEXT_PUBLIC_USE_MOCK = 'false';
    mockSessionUser = {
      id: 'user-asli',
      email: 'user@test.com',
      nama: 'User Asli',
      role: 'USER',
      status_akun: true,
      isPenyediaJasa: false,
      isPenggunaJasa: true,
    };

    const reqGet = new Request('http://localhost/api/bookmark?id_pengguna_jasa=user-korban');
    const resGet = await GET(reqGet);
    expect(resGet.status).toBe(403);
    const bodyGet = await resGet.json();
    expect(bodyGet.error_code).toBe('FORBIDDEN');
    expect(bodyGet.message).toContain('Akses ditolak');

    const reqPost = new Request('http://localhost/api/bookmark', {
      method: 'POST',
      body: JSON.stringify({ id_pengguna_jasa: 'user-korban', id_jasa: 'j1' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const resPost = await POST(reqPost);
    expect(resPost.status).toBe(403);
  });
});

describe('responsGagal mapping status kode', () => {
  it('memetakan berbagai pesan galat ke status HTTP yang presisi', async () => {
    const resConflict = responsGagal(new Error('Jasa sudah ada di dalam bookmark'));
    expect(resConflict.status).toBe(409);

    const resNotFound = responsGagal(new Error('Data bookmark tidak ditemukan'));
    expect(resNotFound.status).toBe(404);

    const resForbidden = responsGagal(new Error('Akses ditolak: tidak dapat mengakses'));
    expect(resForbidden.status).toBe(403);

    const resUnauthorized = responsGagal(new Error('Autentikasi diperlukan: silakan login'));
    expect(resUnauthorized.status).toBe(401);

    const resValidation = responsGagal(new Error('Parameter input tidak valid'));
    expect(resValidation.status).toBe(400);

    const resDatabase = responsGagal(new Error('Koneksi timeout'));
    expect(resDatabase.status).toBe(500);
  });
});
