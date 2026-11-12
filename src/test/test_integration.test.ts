import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NextRequest } from 'next/server';

import { DeliverablesService } from '@/services/deliverables.service';
import { PelaporanService, TanggapanLaporanService } from '@/services/pelaporan.service';
import { MediasiService } from '@/services/mediasi.service';
import { createClient } from '@/lib/supabase/server';
import { NotifikasiService } from '@/services/notifikasi.service';
import { ChatService } from '@/services/chat.service';
import { JasaController } from '@/services/jasa.service';
import { LayananPencarian, LayananPembandingJasa } from '@/services/pencarian.service';
import { PengontrolBookmark } from '@/services/bookmark.service';
import { PesananService } from '@/services/pesanan.service';
import { PengontrolTransaksi } from '@/services/transaksi.service';
import { UlasanService } from '@/services/ulasan.service';
import { getStorageService } from '@/services/storage';
import {
  AuthError,
  getSessionUser,
  login,
  loginAdmin,
  logout,
  registrasi,
} from '@/services/auth.service';
import { mockBookmarkList } from '@/lib/mocks/bookmark.mock';
import { mockJasaList } from '@/lib/mocks/jasa.mock';

// Route handlers
import * as adminLoginRoute from '@/app/api/admin/auth/login/route';
import * as adminLaporanRoute from '@/app/api/admin/laporan/route';
import * as adminLaporanDetailRoute from '@/app/api/admin/laporan/[id_tiket]/route';
import * as adminTanggapanRoute from '@/app/api/admin/laporan/[id_tiket]/tanggapan/route';
import * as adminMediasiRoute from '@/app/api/admin/mediasi/route';
import * as adminMediasiSelesaiRoute from '@/app/api/admin/mediasi/[id_sesi_mediasi]/selesai/route';
import * as authRoute from '@/app/api/auth/route';
import * as bookmarkRoute from '@/app/api/bookmark/route';
import * as chatRoute from '@/app/api/chat/route';
import * as chatRoomRoute from '@/app/api/chat/[id_chatroom]/route';
import * as jasaRoute from '@/app/api/jasa/route';
import * as jasaDetailRoute from '@/app/api/jasa/[id]/route';
import * as laporanRoute from '@/app/api/laporan/route';
import * as laporanDetailRoute from '@/app/api/laporan/[id_tiket]/route';
import * as mediasiRoute from '@/app/api/mediasi/route';
import * as mediasiDetailRoute from '@/app/api/mediasi/[id_sesi_mediasi]/route';
import * as notifikasiRoute from '@/app/api/notifikasi/route';
import * as revisiRoute from '@/app/api/pesanan/[id_pesanan]/deliverables/revisi/route';
import * as deliverablesRoute from '@/app/api/pesanan/[id_pesanan]/deliverables/route';
import * as deliverableUploadRoute from '@/app/api/pesanan/[id_pesanan]/deliverables/upload/route';
import * as pesananLaporanRoute from '@/app/api/pesanan/[id_pesanan]/laporan/route';
import * as pesananDetailRoute from '@/app/api/pesanan/[id_pesanan]/route';
import * as pesananRoute from '@/app/api/pesanan/route';
import * as transaksiDummyRoute from '@/app/api/transaksi/dummy/route';
import * as transaksiRoute from '@/app/api/transaksi/route';
import * as ulasanRoute from '@/app/api/ulasan/route';
import * as uploadRoute from '@/app/api/upload/route';

// =========================================================================
// Mock dependencies (batas luar sistem: Supabase, storage, sesi auth)
// =========================================================================
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('@/services/notifikasi.service', () => ({
  NotifikasiService: {
    kirimNotifikasi: vi.fn().mockResolvedValue(true),
    getNotifikasiUser: vi.fn(),
    tandaiSudahDibaca: vi.fn(),
  },
}));

vi.mock('@/services/storage', () => ({
  getStorageService: vi.fn(),
}));

// AuthError asli tetap dipakai agar pemetaan status code di route teruji sungguhan
vi.mock('@/services/auth.service', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/services/auth.service')>();
  return {
    ...actual,
    login: vi.fn(),
    logout: vi.fn(),
    registrasi: vi.fn(),
    loginAdmin: vi.fn(),
    getSessionUser: vi.fn(),
  };
});

const { mockSupabaseAdmin } = vi.hoisted(() => ({
  mockSupabaseAdmin: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn(),
    maybeSingle: vi.fn(),
    auth: { getUser: vi.fn() },
  },
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => mockSupabaseAdmin),
  AuthError: class AuthError extends Error {},
}));

// =========================================================================
// Helpers
// =========================================================================
const BASE = 'http://localhost:3000';

function req(
  path: string,
  init: { method?: string; body?: unknown; headers?: Record<string, string> } = {},
) {
  const { method = 'GET', body, headers = {} } = init;
  if (body instanceof FormData) {
    return new NextRequest(BASE + path, { method, body, headers });
  }
  return new NextRequest(BASE + path, {
    method,
    headers: { 'content-type': 'application/json', ...headers },
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  });
}

const ctx = <T extends Record<string, string>>(params: T) => ({ params: Promise.resolve(params) });

async function baca(res: Response) {
  return { status: res.status, body: await res.json() };
}

const file = (name: string, type: string, size = 16) =>
  new File([new Uint8Array(size)], name, { type });

let mockSupabase: any;

function loginSebagai(user: { id: string } | null, error: unknown = null) {
  mockSupabase.auth.getUser.mockResolvedValue({ data: { user }, error });
}

function jadiAdmin(id = 'admin-1') {
  loginSebagai({ id });
  mockSupabase.single.mockResolvedValueOnce({ data: { role: 'ADMIN' }, error: null });
}

function sesi(user: Record<string, unknown> | null) {
  vi.mocked(getSessionUser).mockResolvedValue(user as any);
}

function bearerValid(id: string) {
  mockSupabaseAdmin.auth.getUser.mockResolvedValueOnce({ data: { user: { id } }, error: null });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv('NEXT_PUBLIC_USE_MOCK', 'false');

  mockSupabase = {
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn(),
    maybeSingle: vi.fn(),
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) },
  };
  (createClient as any).mockResolvedValue(mockSupabase);

  mockSupabaseAdmin.auth.getUser.mockReset();
  mockSupabaseAdmin.auth.getUser.mockResolvedValue({
    data: { user: null },
    error: { message: 'invalid token' },
  });

  for (const fn of [getSessionUser, login, logout, registrasi, loginAdmin]) {
    vi.mocked(fn).mockReset();
  }
  vi.mocked(getSessionUser).mockResolvedValue(null);
  vi.mocked(NotifikasiService.getNotifikasiUser).mockReset();
  vi.mocked(NotifikasiService.tandaiSudahDibaca).mockReset();
  vi.mocked(getStorageService).mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

// =========================================================================
// AUTH
// =========================================================================
describe('API /api/auth', () => {
  describe('POST', () => {
    it('400 jika body bukan JSON', async () => {
      const { status, body } = await baca(await authRoute.POST(req('/api/auth', { method: 'POST', body: 'bukan-json' })));
      expect(status).toBe(400);
      expect(body).toEqual({ success: false, message: 'Body tidak valid (harus JSON)' });
    });

    it.each([
      ['array', [1, 2]],
      ['null', null],
      ['angka', 42],
    ])('400 jika body JSON berupa %s (bukan objek)', async (_label, payload) => {
      const { status, body } = await baca(
        await authRoute.POST(req('/api/auth', { method: 'POST', body: JSON.stringify(payload) })),
      );
      expect(status).toBe(400);
      expect(body.message).toBe('Body harus berupa objek JSON');
    });

    it('400 jika action tidak dikenal / tidak dikirim', async () => {
      for (const payload of [{ action: 'hack' }, {}]) {
        const { status, body } = await baca(await authRoute.POST(req('/api/auth', { method: 'POST', body: payload })));
        expect(status).toBe(400);
        expect(body.message).toBe('Action tidak dikenal');
      }
    });

    it('register: 201 dan meneruskan data ke service', async () => {
      vi.mocked(registrasi).mockResolvedValue({ id: 'u-1' } as any);
      const payload = { action: 'register', nama: 'Budi', email: 'budi@mail.com', password: 'rahasia123', role: 'pengguna_jasa' };

      const { status, body } = await baca(await authRoute.POST(req('/api/auth', { method: 'POST', body: payload })));

      expect(status).toBe(201);
      expect(body).toEqual({ success: true, message: 'Registrasi berhasil', data: { id: 'u-1' } });
      expect(registrasi).toHaveBeenCalledWith({ nama: 'Budi', email: 'budi@mail.com', password: 'rahasia123', role: 'pengguna_jasa' });
    });

    it('register: 400 jika ada field yang bukan teks (service tidak dipanggil)', async () => {
      const { status } = await baca(
        await authRoute.POST(req('/api/auth', { method: 'POST', body: { action: 'register', nama: 'Budi', email: 'a@b.c', password: 123, role: 'pengguna_jasa' } })),
      );
      expect(status).toBe(400);
      expect(registrasi).not.toHaveBeenCalled();
    });

    it.each([
      ['EMAIL_TAKEN', 409],
      ['WEAK_PASSWORD', 400],
      ['INVALID_EMAIL', 400],
      ['INVALID_ROLE', 400],
      ['EMPTY_INPUT', 400],
    ] as const)('register: AuthError %s dipetakan ke status %i', async (code, expected) => {
      vi.mocked(registrasi).mockRejectedValue(new AuthError(code, `error ${code}`));
      const { status, body } = await baca(
        await authRoute.POST(req('/api/auth', { method: 'POST', body: { action: 'register', nama: 'a', email: 'a@b.c', password: 'x', role: 'pengguna_jasa' } })),
      );
      expect(status).toBe(expected);
      expect(body).toEqual({ success: false, message: `error ${code}`, code });
    });

    it('login: 200 jika kredensial benar', async () => {
      vi.mocked(login).mockResolvedValue({ user: { id: 'u-1' } } as any);
      const { status, body } = await baca(
        await authRoute.POST(req('/api/auth', { method: 'POST', body: { action: 'login', email: 'a@b.c', password: 'rahasia123' } })),
      );
      expect(status).toBe(200);
      expect(body.result).toEqual({ user: { id: 'u-1' } });
      expect(login).toHaveBeenCalledWith('a@b.c', 'rahasia123');
    });

    it('login: 400 jika email/password bukan string', async () => {
      const { status } = await baca(await authRoute.POST(req('/api/auth', { method: 'POST', body: { action: 'login', email: 'a@b.c' } })));
      expect(status).toBe(400);
      expect(login).not.toHaveBeenCalled();
    });

    it.each([
      ['INVALID_CREDENTIALS', 401],
      ['ACCOUNT_SUSPENDED', 403],
      ['PROFILE_NOT_FOUND', 403],
    ] as const)('login: AuthError %s -> %i', async (code, expected) => {
      vi.mocked(login).mockRejectedValue(new AuthError(code, 'gagal'));
      const res = await authRoute.POST(req('/api/auth', { method: 'POST', body: { action: 'login', email: 'a@b.c', password: 'x' } }));
      expect(res.status).toBe(expected);
    });

    it('login: 500 dan pesan generik jika error bukan AuthError', async () => {
      vi.mocked(login).mockRejectedValue(new Error('koneksi DB putus'));
      const { status, body } = await baca(
        await authRoute.POST(req('/api/auth', { method: 'POST', body: { action: 'login', email: 'a@b.c', password: 'x' } })),
      );
      expect(status).toBe(500);
      expect(body.message).toBe('Terjadi kesalahan pada server.');
    });

    it('logout: 200 jika berhasil', async () => {
      vi.mocked(logout).mockResolvedValue(undefined as any);
      const { status, body } = await baca(await authRoute.POST(req('/api/auth', { method: 'POST', body: { action: 'logout' } })));
      expect(status).toBe(200);
      expect(body.message).toBe('Logout berhasil');
    });

    it('logout: LOGOUT_FAILED tidak terdaftar di peta status -> fallback 400', async () => {
      vi.mocked(logout).mockRejectedValue(new AuthError('LOGOUT_FAILED', 'gagal logout'));
      const res = await authRoute.POST(req('/api/auth', { method: 'POST', body: { action: 'logout' } }));
      expect(res.status).toBe(400);
    });

    it('me: 401 jika tidak ada sesi, 200 jika ada', async () => {
      const res = await authRoute.POST(req('/api/auth', { method: 'POST', body: { action: 'me' } }));
      expect(res.status).toBe(401);

      sesi({ id: 'u-1' });
      const { status, body } = await baca(await authRoute.POST(req('/api/auth', { method: 'POST', body: { action: 'me' } })));
      expect(status).toBe(200);
      expect(body.user).toEqual({ id: 'u-1' });
    });
  });

  describe('GET', () => {
    it('401 tanpa sesi', async () => {
      const { status, body } = await baca(await authRoute.GET());
      expect(status).toBe(401);
      expect(body.message).toBe('Tidak terautentikasi');
    });

    it('200 dengan sesi', async () => {
      sesi({ id: 'u-1', isPenggunaJasa: true });
      const { status, body } = await baca(await authRoute.GET());
      expect(status).toBe(200);
      expect(body.user.id).toBe('u-1');
    });
  });
});

describe('API POST /api/admin/auth/login', () => {
  const panggil = (body: unknown) =>
    adminLoginRoute.POST(req('/api/admin/auth/login', { method: 'POST', body }));

  it('200 jika login admin berhasil', async () => {
    vi.mocked(loginAdmin).mockResolvedValue({ user: { id: 'admin-1' } } as any);
    const { status, body } = await baca(await panggil({ email: 'admin@mail.com', password: 'admin123' }));
    expect(status).toBe(200);
    expect(body).toEqual({ success: true, message: 'login Admin berhasil', result: { user: { id: 'admin-1' } } });
  });

  it.each([
    ['email kosong', { password: 'x' }],
    ['password angka', { email: 'a@b.c', password: 123 }],
    ['body null', null],
  ])('400 jika %s', async (_label, payload) => {
    const { status, body } = await baca(await panggil(JSON.stringify(payload)));
    expect(status).toBe(400);
    expect(body.message).toBe('Email dan password harus berupa teks');
    expect(loginAdmin).not.toHaveBeenCalled();
  });

  it.each([
    ['EMPTY_INPUT', 400],
    ['INVALID_CREDENTIALS', 401],
    ['ACCOUNT_SUSPENDED', 403],
    ['PROFILE_NOT_FOUND', 403],
    ['FORBIDDEN', 403],
    ['LOGOUT_FAILED', 500],
    ['INTERNAL_ERROR', 400],
  ] as const)('AuthError %s -> %i', async (code, expected) => {
    vi.mocked(loginAdmin).mockRejectedValue(new AuthError(code, 'gagal'));
    const { status, body } = await baca(await panggil({ email: 'a@b.c', password: 'x' }));
    expect(status).toBe(expected);
    expect(body.code).toBe(code);
  });

  it('500 jika body bukan JSON atau error tak terduga', async () => {
    expect((await panggil('{rusak')).status).toBe(500);

    vi.mocked(loginAdmin).mockRejectedValue(new Error('boom'));
    const { status, body } = await baca(await panggil({ email: 'a@b.c', password: 'x' }));
    expect(status).toBe(500);
    expect(body.message).toBe('Terjadi kesalahan pada server.');
  });
});

// =========================================================================
// ADMIN - LAPORAN (verifyAdmin asli dijalankan)
// =========================================================================
describe('API Admin Laporan', () => {
  describe('GET /api/admin/laporan', () => {
    it('200 dan mengembalikan seluruh tiket untuk admin', async () => {
      jadiAdmin();
      const spy = vi.spyOn(TanggapanLaporanService, 'getAllTicketsForAdmin').mockResolvedValue([{ id_tiket: 't-1' }] as any);

      const { status, body } = await baca(await adminLaporanRoute.GET());

      expect(status).toBe(200);
      expect(body.data).toEqual([{ id_tiket: 't-1' }]);
      expect(spy).toHaveBeenCalledOnce();
      expect(mockSupabase.from).toHaveBeenCalledWith('pengguna');
    });

    it('401 jika belum login', async () => {
      const spy = vi.spyOn(TanggapanLaporanService, 'getAllTicketsForAdmin');
      const { status, body } = await baca(await adminLaporanRoute.GET());
      expect(status).toBe(401);
      expect(body.message).toBe('Unauthorized');
      expect(spy).not.toHaveBeenCalled();
    });

    it('401 jika supabase mengembalikan error auth', async () => {
      loginSebagai({ id: 'x' }, { message: 'jwt expired' });
      expect((await adminLaporanRoute.GET()).status).toBe(401);
    });

    it('403 jika role bukan ADMIN', async () => {
      loginSebagai({ id: 'u-1' });
      mockSupabase.single.mockResolvedValueOnce({ data: { role: 'PENGGUNA_JASA' }, error: null });
      const { status, body } = await baca(await adminLaporanRoute.GET());
      expect(status).toBe(403);
      expect(body.message).toBe('Akses khusus Admin');
    });

    it('403 jika profil tidak ditemukan', async () => {
      loginSebagai({ id: 'u-1' });
      mockSupabase.single.mockResolvedValueOnce({ data: null, error: { message: 'no rows' } });
      expect((await adminLaporanRoute.GET()).status).toBe(403);
    });

    it('400 jika service gagal', async () => {
      jadiAdmin();
      vi.spyOn(TanggapanLaporanService, 'getAllTicketsForAdmin').mockRejectedValue(new Error('DB error'));
      const { status, body } = await baca(await adminLaporanRoute.GET());
      expect(status).toBe(400);
      expect(body.message).toBe('DB error');
    });
  });

  describe('GET /api/admin/laporan/[id_tiket]', () => {
    it('200 dan meneruskan id_tiket dari params', async () => {
      jadiAdmin();
      const spy = vi.spyOn(TanggapanLaporanService, 'getDetailTiketAdmin').mockResolvedValue({ id_tiket: 't-9' } as any);

      const { status, body } = await baca(await adminLaporanDetailRoute.GET(req('/api/admin/laporan/t-9'), ctx({ id_tiket: 't-9' })));

      expect(status).toBe(200);
      expect(body.data).toEqual({ id_tiket: 't-9' });
      expect(spy).toHaveBeenCalledWith('t-9');
    });

    it('401 tanpa login & 403 non-admin', async () => {
      expect((await adminLaporanDetailRoute.GET(req('/x'), ctx({ id_tiket: 't' }))).status).toBe(401);

      loginSebagai({ id: 'u-1' });
      mockSupabase.single.mockResolvedValueOnce({ data: { role: 'PENYEDIA_JASA' }, error: null });
      expect((await adminLaporanDetailRoute.GET(req('/x'), ctx({ id_tiket: 't' }))).status).toBe(403);
    });

    it('400 jika tiket tidak ditemukan', async () => {
      jadiAdmin();
      vi.spyOn(TanggapanLaporanService, 'getDetailTiketAdmin').mockRejectedValue(new Error('Tiket tidak ditemukan'));
      const { status, body } = await baca(await adminLaporanDetailRoute.GET(req('/x'), ctx({ id_tiket: 'nope' })));
      expect(status).toBe(400);
      expect(body.message).toBe('Tiket tidak ditemukan');
    });
  });

  describe('POST /api/admin/laporan/[id_tiket]/tanggapan', () => {
    const kirim = (body: unknown) =>
      adminTanggapanRoute.POST(req('/api/admin/laporan/t-1/tanggapan', { method: 'POST', body }), ctx({ id_tiket: 't-1' }));

    it('200 dan memakai id admin dari sesi (bukan dari body)', async () => {
      jadiAdmin('admin-77');
      const spy = vi.spyOn(TanggapanLaporanService, 'catatKeputusanTindakan').mockResolvedValue({ id_tanggapan: 'tg-1' } as any);

      const { status, body } = await baca(
        await kirim({ jenis_tindakan: 'PERINGATAN', catatan_tanggapan: 'Peringatan keras', id_admin: 'palsu' }),
      );

      expect(status).toBe(200);
      expect(body.data).toEqual({ id_tanggapan: 'tg-1' });
      expect(spy).toHaveBeenCalledWith({
        id_tiket: 't-1',
        id_admin: 'admin-77',
        jenis_tindakan: 'PERINGATAN',
        catatan_tanggapan: 'Peringatan keras',
      });
    });

    it('401 / 403 tanpa hak admin', async () => {
      const spy = vi.spyOn(TanggapanLaporanService, 'catatKeputusanTindakan');
      expect((await kirim({})).status).toBe(401);

      loginSebagai({ id: 'u-1' });
      mockSupabase.single.mockResolvedValueOnce({ data: { role: 'PENGGUNA_JASA' }, error: null });
      expect((await kirim({})).status).toBe(403);
      expect(spy).not.toHaveBeenCalled();
    });

    it('400 jika validasi service gagal', async () => {
      jadiAdmin();
      vi.spyOn(TanggapanLaporanService, 'catatKeputusanTindakan').mockRejectedValue(new Error('Jenis tindakan tidak valid'));
      const { status, body } = await baca(await kirim({ jenis_tindakan: 'HUKUMAN_MATI' }));
      expect(status).toBe(400);
      expect(body.message).toBe('Jenis tindakan tidak valid');
    });

    it('400 jika body bukan JSON', async () => {
      jadiAdmin();
      expect((await kirim('{rusak')).status).toBe(400);
    });
  });
});

// =========================================================================
// ADMIN - MEDIASI
// =========================================================================
describe('API Admin Mediasi', () => {
  describe('POST /api/admin/mediasi (kirim pesan mediasi)', () => {
    const kirim = (body: unknown, headers?: Record<string, string>) =>
      adminMediasiRoute.POST(req('/api/admin/mediasi', { method: 'POST', body, headers }), ctx({ id_sesi_mediasi: 'sesi-1' }));

    it('201 dengan id_pengirim dari Bearer token', async () => {
      bearerValid('admin-1');
      const spy = vi.spyOn(MediasiService, 'kirimPesanMediasi').mockResolvedValue({ id_pesan: 'm-1' } as any);

      const { status, body } = await baca(await kirim({ isi_pesan: 'Halo' }, { authorization: 'Bearer token-ok' }));

      expect(status).toBe(201);
      expect(body.data).toEqual({ id_pesan: 'm-1' });
      expect(mockSupabaseAdmin.auth.getUser).toHaveBeenCalledWith('token-ok');
      expect(spy).toHaveBeenCalledWith('sesi-1', 'admin-1', 'Halo');
    });

    it('201 dengan fallback id_pengirim dari body saat token tidak valid', async () => {
      const spy = vi.spyOn(MediasiService, 'kirimPesanMediasi').mockResolvedValue({ id_pesan: 'm-2' } as any);
      const res = await kirim({ isi_pesan: 'Halo', id_pengirim: 'user-9' }, { authorization: 'Bearer rusak' });
      expect(res.status).toBe(201);
      expect(spy).toHaveBeenCalledWith('sesi-1', 'user-9', 'Halo');
    });

    it.each([
      ['isi_pesan kosong', { id_pengirim: 'u-1', isi_pesan: '' }],
      ['tanpa pengirim', { isi_pesan: 'Halo' }],
    ])('400 jika %s', async (_label, payload) => {
      const spy = vi.spyOn(MediasiService, 'kirimPesanMediasi');
      const { status, body } = await baca(await kirim(payload));
      expect(status).toBe(400);
      expect(body.message).toBe('id_pengirim dan isi_pesan wajib diisi.');
      expect(spy).not.toHaveBeenCalled();
    });

    it('403 jika pengirim bukan peserta mediasi', async () => {
      vi.spyOn(MediasiService, 'kirimPesanMediasi').mockRejectedValue(new Error('Akses ditolak: bukan peserta'));
      expect((await kirim({ id_pengirim: 'asing', isi_pesan: 'x' })).status).toBe(403);
    });

    it('400 jika sesi sudah selesai / error lain', async () => {
      vi.spyOn(MediasiService, 'kirimPesanMediasi').mockRejectedValue(new Error('Sesi mediasi sudah selesai'));
      const { status, body } = await baca(await kirim({ id_pengirim: 'u', isi_pesan: 'x' }));
      expect(status).toBe(400);
      expect(body.message).toBe('Sesi mediasi sudah selesai');
    });

    it('400 dengan pesan default jika error tanpa message', async () => {
      vi.spyOn(MediasiService, 'kirimPesanMediasi').mockRejectedValue(new Error(''));
      const { body } = await baca(await kirim({ id_pengirim: 'u', isi_pesan: 'x' }));
      expect(body.message).toBe('Gagal mengirim pesan');
    });
  });

  describe('PATCH /api/admin/mediasi/[id_sesi_mediasi]/selesai', () => {
    const selesai = (body?: unknown, headers?: Record<string, string>) =>
      adminMediasiSelesaiRoute.PATCH(
        req('/api/admin/mediasi/sesi-1/selesai', { method: 'PATCH', body, headers }),
        ctx({ id_sesi_mediasi: 'sesi-1' }),
      );

    it('200 dengan admin dari Bearer token', async () => {
      bearerValid('admin-1');
      const spy = vi.spyOn(MediasiService, 'selesaikanMediasi').mockResolvedValue({ status_sesi: 'SELESAI' } as any);

      const { status, body } = await baca(await selesai(undefined, { authorization: 'Bearer ok' }));

      expect(status).toBe(200);
      expect(body.data.status_sesi).toBe('SELESAI');
      expect(spy).toHaveBeenCalledWith('sesi-1', 'admin-1');
    });

    it('200 dengan fallback id_admin dari body', async () => {
      const spy = vi.spyOn(MediasiService, 'selesaikanMediasi').mockResolvedValue({} as any);
      expect((await selesai({ id_admin: 'admin-2' })).status).toBe(200);
      expect(spy).toHaveBeenCalledWith('sesi-1', 'admin-2');
    });

    it('401 jika tanpa token dan tanpa body', async () => {
      const spy = vi.spyOn(MediasiService, 'selesaikanMediasi');
      const { status, body } = await baca(await selesai());
      expect(status).toBe(401);
      expect(body.message).toContain('id_admin wajib');
      expect(spy).not.toHaveBeenCalled();
    });

    it('400 jika sesi tidak bisa diakhiri', async () => {
      vi.spyOn(MediasiService, 'selesaikanMediasi').mockRejectedValue(new Error('Sesi sudah berakhir'));
      const { status, body } = await baca(await selesai({ id_admin: 'admin-1' }));
      expect(status).toBe(400);
      expect(body.message).toBe('Sesi sudah berakhir');
    });
  });
});

// =========================================================================
// MEDIASI (peserta)
// =========================================================================
describe('API Mediasi', () => {
  describe('GET /api/mediasi', () => {
    it('200 dengan user dari Bearer token', async () => {
      bearerValid('u-1');
      const spy = vi.spyOn(MediasiService, 'getDaftarMediasiUser').mockResolvedValue([{ id_sesi_mediasi: 's-1' }] as any);
      const { status, body } = await baca(await mediasiRoute.GET(req('/api/mediasi', { headers: { authorization: 'Bearer ok' } })));
      expect(status).toBe(200);
      expect(body.data).toHaveLength(1);
      expect(spy).toHaveBeenCalledWith('u-1');
    });

    it('200 dengan fallback query ?id_pengguna', async () => {
      const spy = vi.spyOn(MediasiService, 'getDaftarMediasiUser').mockResolvedValue([] as any);
      expect((await mediasiRoute.GET(req('/api/mediasi?id_pengguna=u-2'))).status).toBe(200);
      expect(spy).toHaveBeenCalledWith('u-2');
    });

    it('401 tanpa identitas apapun', async () => {
      expect((await mediasiRoute.GET(req('/api/mediasi'))).status).toBe(401);
    });

    it('400 jika service gagal', async () => {
      vi.spyOn(MediasiService, 'getDaftarMediasiUser').mockRejectedValue(new Error('DB'));
      expect((await mediasiRoute.GET(req('/api/mediasi?id_pengguna=u'))).status).toBe(400);
    });
  });

  describe('GET /api/mediasi/[id_sesi_mediasi]', () => {
    const detail = (q = '', headers?: Record<string, string>) =>
      mediasiDetailRoute.GET(req(`/api/mediasi/s-1${q}`, { headers }), ctx({ id_sesi_mediasi: 's-1' }));

    it('200 dan meneruskan sesi + pengguna', async () => {
      const spy = vi.spyOn(MediasiService, 'getDetailDanPesanMediasi').mockResolvedValue({ pesan: [] } as any);
      const { status, body } = await baca(await detail('?id_pengguna=u-1'));
      expect(status).toBe(200);
      expect(body.data).toEqual({ pesan: [] });
      expect(spy).toHaveBeenCalledWith('s-1', 'u-1');
    });

    it('401 tanpa identitas', async () => {
      expect((await detail()).status).toBe(401);
    });

    it.each([
      ['Akses ditolak: bukan peserta', 403],
      ['Sesi mediasi tidak ditemukan', 404],
      ['Kesalahan lain', 400],
    ])('error "%s" -> %i', async (msg, expected) => {
      vi.spyOn(MediasiService, 'getDetailDanPesanMediasi').mockRejectedValue(new Error(msg));
      expect((await detail('?id_pengguna=u-1')).status).toBe(expected);
    });
  });

  describe('POST /api/mediasi/[id_sesi_mediasi] (mulai mediasi)', () => {
    const mulai = (body: unknown, headers?: Record<string, string>) =>
      mediasiDetailRoute.POST(req('/api/mediasi/x', { method: 'POST', body, headers }));

    it('201 jika sesi baru dibuat', async () => {
      const spy = vi.spyOn(MediasiService, 'mulaiMediasi').mockResolvedValue({ is_new: true } as any);
      const { status, body } = await baca(await mulai({ id_tiket: 't-1', id_admin: 'admin-1' }));
      expect(status).toBe(201);
      expect(body.message).toBe('Sesi mediasi berhasil dibuat.');
      expect(spy).toHaveBeenCalledWith('t-1', 'admin-1');
    });

    it('200 jika sesi aktif sudah ada (idempoten)', async () => {
      bearerValid('admin-1');
      vi.spyOn(MediasiService, 'mulaiMediasi').mockResolvedValue({ is_new: false } as any);
      const { status, body } = await baca(await mulai({ id_tiket: 't-1' }, { authorization: 'Bearer ok' }));
      expect(status).toBe(200);
      expect(body.message).toBe('Sesi mediasi yang aktif sudah tersedia.');
    });

    it('400 jika id_tiket atau id_admin kosong', async () => {
      expect((await mulai({ id_admin: 'a' })).status).toBe(400);
      expect((await mulai({ id_tiket: 't' })).status).toBe(400);
    });

    it('400 jika tiket tidak valid', async () => {
      vi.spyOn(MediasiService, 'mulaiMediasi').mockRejectedValue(new Error('Tiket tidak ditemukan'));
      const { status, body } = await baca(await mulai({ id_tiket: 'x', id_admin: 'a' }));
      expect(status).toBe(400);
      expect(body.message).toBe('Tiket tidak ditemukan');
    });
  });
});

// =========================================================================
// BOOKMARK
// =========================================================================
describe('API /api/bookmark', () => {
  describe('GET', () => {
    it('200 menggunakan id dari sesi', async () => {
      sesi({ id: 'u-1' });
      const spy = vi.spyOn(PengontrolBookmark, 'ambilDaftarBookmarkPengguna').mockResolvedValue([{ id_bookmark: 'b-1' }] as any);
      const { status, body } = await baca(await bookmarkRoute.GET(req('/api/bookmark')));
      expect(status).toBe(200);
      expect(body.message).toBe('Daftar bookmark berhasil diambil');
      expect(spy).toHaveBeenCalledWith('u-1');
    });

    it('200 dengan pesan "Bookmark kosong" jika tidak ada data', async () => {
      sesi({ id: 'u-1' });
      vi.spyOn(PengontrolBookmark, 'ambilDaftarBookmarkPengguna').mockResolvedValue([]);
      const { body } = await baca(await bookmarkRoute.GET(req('/api/bookmark?id_pengguna_jasa=u-1')));
      expect(body).toEqual({ success: true, message: 'Bookmark kosong', data: [] });
    });

    it('403 jika mencoba membaca bookmark pengguna lain (IDOR)', async () => {
      sesi({ id: 'u-1' });
      const spy = vi.spyOn(PengontrolBookmark, 'ambilDaftarBookmarkPengguna');
      const { status, body } = await baca(await bookmarkRoute.GET(req('/api/bookmark?id_pengguna_jasa=u-lain')));
      expect(status).toBe(403);
      expect(body.error_code).toBe('FORBIDDEN');
      expect(spy).not.toHaveBeenCalled();
    });

    it('401 tanpa sesi dan tanpa id', async () => {
      const { status, body } = await baca(await bookmarkRoute.GET(req('/api/bookmark')));
      expect(status).toBe(401);
      expect(body.error_code).toBe('UNAUTHORIZED');
    });

    it('fallback ke id query (di-trim) jika tidak ada sesi', async () => {
      const spy = vi.spyOn(PengontrolBookmark, 'ambilDaftarBookmarkPengguna').mockResolvedValue([]);
      await bookmarkRoute.GET(req('/api/bookmark?id_pengguna_jasa=%20u-5%20'));
      expect(spy).toHaveBeenCalledWith('u-5');
    });

    it('500 DATABASE_ERROR jika service gagal tanpa pola khusus', async () => {
      sesi({ id: 'u-1' });
      vi.spyOn(PengontrolBookmark, 'ambilDaftarBookmarkPengguna').mockRejectedValue(new Error('connection reset'));
      const { status, body } = await baca(await bookmarkRoute.GET(req('/api/bookmark')));
      expect(status).toBe(500);
      expect(body.error_code).toBe('DATABASE_ERROR');
    });
  });

  describe('POST', () => {
    it('400 jika body JSON rusak', async () => {
      const { status, body } = await baca(await bookmarkRoute.POST(req('/api/bookmark', { method: 'POST', body: '{x' })));
      expect(status).toBe(400);
      expect(body.message).toBe('Format body JSON tidak valid');
    });

    it('201 tambah bookmark', async () => {
      sesi({ id: 'u-1' });
      const spy = vi.spyOn(PengontrolBookmark, 'tambahDataBookmark').mockResolvedValue({ id_bookmark: 'b-1' } as any);
      const { status, body } = await baca(await bookmarkRoute.POST(req('/api/bookmark', { method: 'POST', body: { id_jasa: 'j-1' } })));
      expect(status).toBe(201);
      expect(body.data).toEqual({ id_bookmark: 'b-1' });
      expect(spy).toHaveBeenCalledWith('u-1', 'j-1');
    });

    it('toggle: 201 jika ditambahkan, 200 jika dihapus', async () => {
      sesi({ id: 'u-1' });
      const spy = vi
        .spyOn(PengontrolBookmark, 'toggleBookmark')
        .mockResolvedValueOnce({ action: 'added', data: { id_bookmark: 'b-1' } } as any)
        .mockResolvedValueOnce({ action: 'removed', data: null } as any);

      const r1 = await baca(await bookmarkRoute.POST(req('/api/bookmark', { method: 'POST', body: { id_jasa: 'j-1', toggle: true } })));
      const r2 = await baca(await bookmarkRoute.POST(req('/api/bookmark', { method: 'POST', body: { id_jasa: 'j-1', action: 'toggle' } })));

      expect(r1.status).toBe(201);
      expect(r1.body.message).toBe('Bookmark berhasil disimpan');
      expect(r2.status).toBe(200);
      expect(r2.body.message).toBe('Bookmark berhasil dihapus');
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it.each([
      ['Jasa sudah ada di dalam bookmark', 409, 'CONFLICT'],
      ['Data jasa tidak ditemukan', 404, 'NOT_FOUND'],
      ['Parameter input tidak valid', 400, 'VALIDATION_ERROR'],
    ])('error "%s" -> %i %s', async (msg, expected, code) => {
      sesi({ id: 'u-1' });
      vi.spyOn(PengontrolBookmark, 'tambahDataBookmark').mockRejectedValue(new Error(msg));
      const { status, body } = await baca(await bookmarkRoute.POST(req('/api/bookmark', { method: 'POST', body: { id_jasa: 'j' } })));
      expect(status).toBe(expected);
      expect(body.error_code).toBe(code);
    });

    it('403 jika menambah bookmark atas nama pengguna lain', async () => {
      sesi({ id: 'u-1' });
      const res = await bookmarkRoute.POST(req('/api/bookmark', { method: 'POST', body: { id_pengguna_jasa: 'u-2', id_jasa: 'j' } }));
      expect(res.status).toBe(403);
    });
  });

  describe('DELETE', () => {
    it('200 menghapus via query string', async () => {
      sesi({ id: 'u-1' });
      const spy = vi.spyOn(PengontrolBookmark, 'hapusDataBookmark').mockResolvedValue(true);
      const { status, body } = await baca(
        await bookmarkRoute.DELETE(req('/api/bookmark?id_pengguna_jasa=u-1&id_jasa=j-1', { method: 'DELETE' })),
      );
      expect(status).toBe(200);
      expect(body.data).toBeNull();
      expect(spy).toHaveBeenCalledWith('u-1', 'j-1', undefined);
    });

    it('200 menghapus via body JSON (id_bookmark)', async () => {
      sesi({ id: 'u-1' });
      const spy = vi.spyOn(PengontrolBookmark, 'hapusDataBookmark').mockResolvedValue(true);
      await bookmarkRoute.DELETE(req('/api/bookmark', { method: 'DELETE', body: { id_bookmark: 'b-9' } }));
      expect(spy).toHaveBeenCalledWith('u-1', '', 'b-9');
    });

    it('401 tanpa sesi & tanpa id', async () => {
      expect((await bookmarkRoute.DELETE(req('/api/bookmark', { method: 'DELETE' }))).status).toBe(401);
    });

    it('404 jika bookmark tidak ditemukan', async () => {
      sesi({ id: 'u-1' });
      vi.spyOn(PengontrolBookmark, 'hapusDataBookmark').mockRejectedValue(new Error('Bookmark tidak ditemukan'));
      expect((await bookmarkRoute.DELETE(req('/api/bookmark?id_jasa=j', { method: 'DELETE' }))).status).toBe(404);
    });
  });

  describe('mode mock (NEXT_PUBLIC_USE_MOCK=true)', () => {
    beforeEach(() => vi.stubEnv('NEXT_PUBLIC_USE_MOCK', 'true'));

    it('GET 400 jika id_pengguna_jasa tidak dikirim', async () => {
      const { status, body } = await baca(await bookmarkRoute.GET(req('/api/bookmark')));
      expect(status).toBe(400);
      expect(body.error_code).toBe('VALIDATION_ERROR');
    });

    it('GET 200 membaca data mock dan tidak menyentuh sesi', async () => {
      const id = mockBookmarkList[0].id_pengguna_jasa;
      const { status, body } = await baca(await bookmarkRoute.GET(req(`/api/bookmark?id_pengguna_jasa=${id}`)));
      expect(status).toBe(200);
      expect(body.data.length).toBeGreaterThan(0);
      expect(body.data.every((b: any) => b.id_pengguna_jasa === id)).toBe(true);
      expect(getSessionUser).not.toHaveBeenCalled();
    });

    it('POST 409 jika jasa sudah dibookmark', async () => {
      const { id_pengguna_jasa, id_jasa } = mockBookmarkList[0];
      const { status, body } = await baca(
        await bookmarkRoute.POST(req('/api/bookmark', { method: 'POST', body: { id_pengguna_jasa, id_jasa } })),
      );
      expect(status).toBe(409);
      expect(body.error_code).toBe('CONFLICT');
    });

    it('POST 404 jika jasa tidak ada', async () => {
      const res = await bookmarkRoute.POST(
        req('/api/bookmark', { method: 'POST', body: { id_pengguna_jasa: 'u-x', id_jasa: 'tidak-ada' } }),
      );
      expect(res.status).toBe(404);
    });
  });
});

// =========================================================================
// CHAT
// =========================================================================
describe('API Chat', () => {
  describe('GET /api/chat', () => {
    it('200 daftar chatroom user', async () => {
      loginSebagai({ id: 'u-1' });
      const spy = vi.spyOn(ChatService, 'getDaftarChatroom').mockResolvedValue([{ id_chatroom: 'c-1' }] as any);
      const { status, body } = await baca(await chatRoute.GET());
      expect(status).toBe(200);
      expect(body.data).toEqual([{ id_chatroom: 'c-1' }]);
      expect(spy).toHaveBeenCalledWith('u-1');
    });

    it('401 tanpa login', async () => {
      expect((await chatRoute.GET()).status).toBe(401);
    });

    it('400 jika service gagal', async () => {
      loginSebagai({ id: 'u-1' });
      vi.spyOn(ChatService, 'getDaftarChatroom').mockRejectedValue(new Error('DB'));
      const { status, body } = await baca(await chatRoute.GET());
      expect(status).toBe(400);
      expect(body).toEqual({ status: false, message: 'DB' });
    });
  });

  describe('POST /api/chat (buka/buat room)', () => {
    const buka = (body: unknown) => chatRoute.POST(req('/api/chat', { method: 'POST', body }));

    it('200 dan default id_pengguna_jasa = user login', async () => {
      loginSebagai({ id: 'u-1' });
      const spy = vi.spyOn(ChatService, 'getOrCreateChatroom').mockResolvedValue({ id_chatroom: 'c-1' } as any);
      const { status, body } = await baca(await buka({ id_penyedia_jasa: 'p-1' }));
      expect(status).toBe(200);
      expect(body.data).toEqual({ id_chatroom: 'c-1' });
      expect(spy).toHaveBeenCalledWith('u-1', 'p-1');
    });

    it('200 jika user login adalah penyedia di room tersebut', async () => {
      loginSebagai({ id: 'p-1' });
      vi.spyOn(ChatService, 'getOrCreateChatroom').mockResolvedValue({} as any);
      expect((await buka({ id_pengguna_jasa: 'u-1', id_penyedia_jasa: 'p-1' })).status).toBe(200);
    });

    it('401 tanpa login', async () => {
      expect((await buka({ id_penyedia_jasa: 'p' })).status).toBe(401);
    });

    it('400 body rusak', async () => {
      loginSebagai({ id: 'u-1' });
      expect((await buka('{x')).status).toBe(400);
    });

    it('400 jika id_penyedia_jasa kosong', async () => {
      loginSebagai({ id: 'u-1' });
      const { status, body } = await baca(await buka({}));
      expect(status).toBe(400);
      expect(body.message).toContain('wajib diisi');
    });

    it('400 jika membuat room dengan diri sendiri', async () => {
      loginSebagai({ id: 'u-1' });
      const { status, body } = await baca(await buka({ id_penyedia_jasa: 'u-1' }));
      expect(status).toBe(400);
      expect(body.message).toContain('diri sendiri');
    });

    it('403 jika membuat room untuk dua akun lain', async () => {
      loginSebagai({ id: 'u-1' });
      const spy = vi.spyOn(ChatService, 'getOrCreateChatroom');
      expect((await buka({ id_pengguna_jasa: 'a', id_penyedia_jasa: 'b' })).status).toBe(403);
      expect(spy).not.toHaveBeenCalled();
    });

    it('400 jika service gagal', async () => {
      loginSebagai({ id: 'u-1' });
      vi.spyOn(ChatService, 'getOrCreateChatroom').mockRejectedValue(new Error('Penyedia tidak ditemukan'));
      expect((await buka({ id_penyedia_jasa: 'p' })).status).toBe(400);
    });
  });

  describe('/api/chat/[id_chatroom]', () => {
    const c = ctx({ id_chatroom: 'room-1' });

    it('GET 200 riwayat pesan', async () => {
      loginSebagai({ id: 'u-1' });
      const spy = vi.spyOn(ChatService, 'getRiwayatPesan').mockResolvedValue([{ id_pesan: 'm-1' }] as any);
      const { status, body } = await baca(await chatRoomRoute.GET(req('/api/chat/room-1'), c));
      expect(status).toBe(200);
      expect(body.data).toHaveLength(1);
      expect(spy).toHaveBeenCalledWith('room-1', 'u-1');
    });

    it('GET juga menerima params non-Promise', async () => {
      loginSebagai({ id: 'u-1' });
      const spy = vi.spyOn(ChatService, 'getRiwayatPesan').mockResolvedValue([]);
      await chatRoomRoute.GET(req('/x'), { params: { id_chatroom: 'room-2' } });
      expect(spy).toHaveBeenCalledWith('room-2', 'u-1');
    });

    it('GET 401 / 403 / 400', async () => {
      expect((await chatRoomRoute.GET(req('/x'), c)).status).toBe(401);

      loginSebagai({ id: 'u-1' });
      vi.spyOn(ChatService, 'getRiwayatPesan')
        .mockRejectedValueOnce(new Error('Akses ditolak: bukan anggota room'))
        .mockRejectedValueOnce(new Error('Room tidak ditemukan'));
      expect((await chatRoomRoute.GET(req('/x'), c)).status).toBe(403);
      expect((await chatRoomRoute.GET(req('/x'), c)).status).toBe(400);
    });

    it('POST 201 kirim pesan + default lampiran null', async () => {
      loginSebagai({ id: 'u-1' });
      const spy = vi.spyOn(ChatService, 'kirimPesan').mockResolvedValue({ id_pesan: 'm-2' } as any);
      const { status, body } = await baca(
        await chatRoomRoute.POST(req('/x', { method: 'POST', body: { isi_pesan: 'Halo' } }), c),
      );
      expect(status).toBe(201);
      expect(body.data).toEqual({ id_pesan: 'm-2' });
      expect(spy).toHaveBeenCalledWith('room-1', 'u-1', 'Halo', null);
    });

    it('POST meneruskan isi_pesan kosong sebagai "" (validasi diserahkan ke service)', async () => {
      loginSebagai({ id: 'u-1' });
      const spy = vi.spyOn(ChatService, 'kirimPesan').mockRejectedValue(new Error('Pesan tidak boleh kosong'));
      const { status, body } = await baca(
        await chatRoomRoute.POST(req('/x', { method: 'POST', body: { lampiran: 'https://f/x.png' } }), c),
      );
      expect(spy).toHaveBeenCalledWith('room-1', 'u-1', '', 'https://f/x.png');
      expect(status).toBe(400);
      expect(body.message).toBe('Pesan tidak boleh kosong');
    });

    it('POST 400 body rusak, 401 tanpa login, 403 bukan anggota', async () => {
      expect((await chatRoomRoute.POST(req('/x', { method: 'POST', body: {} }), c)).status).toBe(401);

      loginSebagai({ id: 'u-1' });
      expect((await chatRoomRoute.POST(req('/x', { method: 'POST', body: '{x' }), c)).status).toBe(400);

      vi.spyOn(ChatService, 'kirimPesan').mockRejectedValue(new Error('Akses ditolak'));
      expect((await chatRoomRoute.POST(req('/x', { method: 'POST', body: { isi_pesan: 'a' } }), c)).status).toBe(403);
    });
  });
});

// =========================================================================
// JASA
// =========================================================================
describe('API Jasa', () => {
  describe('GET /api/jasa', () => {
    it('200 dan memetakan query param ke filter pencarian', async () => {
      const spy = vi.spyOn(LayananPencarian, 'terapkanFilterPencarian').mockResolvedValue([{ id_jasa: 'j-1' }] as any);
      const { status, body } = await baca(
        await jasaRoute.GET(req('/api/jasa?q=desain&kategori=Grafis&harga_min=1000&harga_max=50000&rating_min=4&sort=harga_asc&limit=10')),
      );
      expect(status).toBe(200);
      expect(body.message).toBe('Data penawaran jasa berhasil diambil');
      expect(spy).toHaveBeenCalledWith({
        keyword: 'desain',
        kategori: 'Grafis',
        harga_min: 1000,
        harga_max: 50000,
        rating_min: 4,
        rating_max: undefined,
        urutkan: 'harga_asc',
        limit: 10,
      });
    });

    it('200 dengan pesan "Data jasa tidak ditemukan" jika hasil kosong', async () => {
      vi.spyOn(LayananPencarian, 'terapkanFilterPencarian').mockResolvedValue([]);
      const { status, body } = await baca(await jasaRoute.GET(req('/api/jasa?keyword=zzz')));
      expect(status).toBe(200);
      expect(body.message).toBe('Data jasa tidak ditemukan');
    });

    it('compare: memanggil pembanding dengan id yang sudah dibersihkan', async () => {
      const spy = vi.spyOn(LayananPembandingJasa, 'bandingkanSpesifikasiJasa').mockResolvedValue({ jasa: [] } as any);
      const { status } = await baca(await jasaRoute.GET(req('/api/jasa?compare=j-1,%20j-2,,')));
      expect(status).toBe(200);
      expect(spy).toHaveBeenCalledWith(['j-1', 'j-2']);
    });

    it.each([
      ['Keyword Pencarian Minimal 3 karakter', 400, 'VALIDATION_ERROR'],
      ['Jasa tidak ditemukan', 404, 'NOT_FOUND'],
      ['relation "jasa" does not exist', 500, 'DATABASE_ERROR'],
    ])('error "%s" -> %i', async (msg, expected, code) => {
      vi.spyOn(LayananPencarian, 'terapkanFilterPencarian').mockRejectedValue(new Error(msg));
      const { status, body } = await baca(await jasaRoute.GET(req('/api/jasa?q=ab')));
      expect(status).toBe(expected);
      expect(body.error_code).toBe(code);
    });

    describe('mode mock (validasi filter asli)', () => {
      beforeEach(() => vi.stubEnv('NEXT_PUBLIC_USE_MOCK', 'true'));

      it.each([
        ['keyword terlalu pendek', '?q=ab'],
        ['harga bukan angka', '?harga_min=abc'],
        ['harga_min > harga_max', '?harga_min=500&harga_max=100'],
        ['rating di luar 0-5', '?rating_max=9'],
        ['urutan tidak dikenal', '?sort=acak'],
        ['limit melebihi batas', '?limit=1000'],
      ])('400 jika %s', async (_label, q) => {
        const { status, body } = await baca(await jasaRoute.GET(req(`/api/jasa${q}`)));
        expect(status).toBe(400);
        expect(body.error_code).toBe('VALIDATION_ERROR');
      });

      it('200 dan hasil terurut harga_asc', async () => {
        const { status, body } = await baca(await jasaRoute.GET(req('/api/jasa?sort=harga_asc')));
        expect(status).toBe(200);
        const harga = body.data.map((j: any) => j.harga);
        expect(harga).toEqual([...harga].sort((a, b) => a - b));
      });
    });
  });

  describe('POST /api/jasa', () => {
    const valid = { nama_jasa: 'Desain Logo', deskripsi: 'Logo profesional', kategori: 'Grafis', harga: 150000 };

    it('201 dan id_penyedia_jasa dipaksa dari sesi', async () => {
      sesi({ id: 'p-1', isPenyediaJasa: true });
      const spy = vi.spyOn(JasaController, 'simpanPenawaranJasa').mockResolvedValue({ id_jasa: 'j-1' } as any);
      const { status, body } = await baca(await jasaRoute.POST(req('/api/jasa', { method: 'POST', body: valid })));
      expect(status).toBe(201);
      expect(body.data).toEqual({ id_jasa: 'j-1' });
      expect(spy).toHaveBeenCalledWith({ ...valid, id_penyedia_jasa: 'p-1' }, []);
    });

    it('201 via multipart: harga dikonversi ke number & berkas diteruskan', async () => {
      sesi({ id: 'p-1', isPenyediaJasa: true });
      const spy = vi.spyOn(JasaController, 'simpanPenawaranJasa').mockResolvedValue({} as any);
      const form = new FormData();
      form.set('nama_jasa', 'Logo');
      form.set('deskripsi', 'Desc');
      form.set('kategori', 'Grafis');
      form.set('harga', '75000');
      form.append('berkas', file('contoh.png', 'image/png'));
      form.append('berkas', file('kosong.png', 'image/png', 0)); // berkas kosong diabaikan

      const res = await jasaRoute.POST(req('/api/jasa', { method: 'POST', body: form }));

      expect(res.status).toBe(201);
      const [data, berkas] = spy.mock.calls[0];
      expect(data.harga).toBe(75000);
      expect(berkas).toHaveLength(1);
      expect(berkas![0].name).toBe('contoh.png');
    });

    it('401 tanpa sesi', async () => {
      const { status, body } = await baca(await jasaRoute.POST(req('/api/jasa', { method: 'POST', body: valid })));
      expect(status).toBe(401);
      expect(body.error_code).toBe('UNAUTHORIZED');
    });

    it('403 jika bukan penyedia jasa', async () => {
      sesi({ id: 'u-1', isPenyediaJasa: false });
      expect((await jasaRoute.POST(req('/api/jasa', { method: 'POST', body: valid }))).status).toBe(403);
    });

    it('403 jika membuat jasa atas nama penyedia lain', async () => {
      sesi({ id: 'p-1', isPenyediaJasa: true });
      const spy = vi.spyOn(JasaController, 'simpanPenawaranJasa');
      const res = await jasaRoute.POST(req('/api/jasa', { method: 'POST', body: { ...valid, id_penyedia_jasa: 'p-2' } }));
      expect(res.status).toBe(403);
      expect(spy).not.toHaveBeenCalled();
    });

    it.each([
      ['nama kosong', { ...valid, nama_jasa: '   ' }],
      ['harga nol', { ...valid, harga: 0 }],
      ['harga negatif', { ...valid, harga: -10 }],
      ['harga string', { ...valid, harga: '1000' }],
      ['kategori hilang', { nama_jasa: 'a', deskripsi: 'b', harga: 10 }],
    ])('400 jika data tidak valid: %s', async (_label, payload) => {
      sesi({ id: 'p-1', isPenyediaJasa: true });
      const { status, body } = await baca(await jasaRoute.POST(req('/api/jasa', { method: 'POST', body: payload })));
      expect(status).toBe(400);
      expect(body.error_code).toBe('VALIDATION_ERROR');
    });

    it('400 jika body JSON rusak', async () => {
      const { status, body } = await baca(await jasaRoute.POST(req('/api/jasa', { method: 'POST', body: '{x' })));
      expect(status).toBe(400);
      expect(body.message).toBe('Format body JSON tidak valid');
    });

    it('500 jika penyimpanan DB gagal', async () => {
      sesi({ id: 'p-1', isPenyediaJasa: true });
      vi.spyOn(JasaController, 'simpanPenawaranJasa').mockRejectedValue(new Error('insert failed'));
      expect((await jasaRoute.POST(req('/api/jasa', { method: 'POST', body: valid }))).status).toBe(500);
    });
  });

  describe('/api/jasa/[id]', () => {
    const c = ctx({ id: 'j-1' });

    it('GET 200 detail jasa', async () => {
      const spy = vi.spyOn(JasaController, 'ambilDetailJasa').mockResolvedValue({ id_jasa: 'j-1' } as any);
      const { status, body } = await baca(await jasaDetailRoute.GET(req('/api/jasa/j-1'), c));
      expect(status).toBe(200);
      expect(body.data.id_jasa).toBe('j-1');
      expect(spy).toHaveBeenCalledWith('j-1');
    });

    it('GET 404 jika jasa tidak ada', async () => {
      vi.spyOn(JasaController, 'ambilDetailJasa').mockRejectedValue(new Error('Data jasa tidak ditemukan'));
      expect((await jasaDetailRoute.GET(req('/x'), c)).status).toBe(404);
    });

    it('PATCH 200 oleh pemilik', async () => {
      sesi({ id: 'p-1' });
      vi.spyOn(JasaController, 'ambilDetailJasa').mockResolvedValue({ id_penyedia_jasa: 'p-1' } as any);
      const spy = vi.spyOn(JasaController, 'perbaruiJasa').mockResolvedValue({ harga: 99000 } as any);
      const { status, body } = await baca(await jasaDetailRoute.PATCH(req('/x', { method: 'PATCH', body: { harga: 99000 } }), c));
      expect(status).toBe(200);
      expect(body.data.harga).toBe(99000);
      expect(spy).toHaveBeenCalledWith('j-1', { harga: 99000 }, []);
    });

    it('PATCH 401 tanpa sesi, 403 bukan pemilik', async () => {
      expect((await jasaDetailRoute.PATCH(req('/x', { method: 'PATCH', body: {} }), c)).status).toBe(401);

      sesi({ id: 'p-2' });
      vi.spyOn(JasaController, 'ambilDetailJasa').mockResolvedValue({ id_penyedia_jasa: 'p-1' } as any);
      const spy = vi.spyOn(JasaController, 'perbaruiJasa');
      const { status, body } = await baca(await jasaDetailRoute.PATCH(req('/x', { method: 'PATCH', body: { harga: 1 } }), c));
      expect(status).toBe(403);
      expect(body.message).toContain('bukan pemilik');
      expect(spy).not.toHaveBeenCalled();
    });

    it('PATCH 400 jika service menolak data', async () => {
      sesi({ id: 'p-1' });
      vi.spyOn(JasaController, 'ambilDetailJasa').mockResolvedValue({ id_penyedia_jasa: 'p-1' } as any);
      vi.spyOn(JasaController, 'perbaruiJasa').mockRejectedValue(new Error('Harga harus lebih dari 0'));
      expect((await jasaDetailRoute.PATCH(req('/x', { method: 'PATCH', body: { harga: -1 } }), c)).status).toBe(400);
    });

    it('DELETE 200 (soft delete) oleh pemilik', async () => {
      sesi({ id: 'p-1' });
      vi.spyOn(JasaController, 'ambilDetailJasa').mockResolvedValue({ id_penyedia_jasa: 'p-1' } as any);
      const spy = vi.spyOn(JasaController, 'hapusJasa').mockResolvedValue();
      const { status, body } = await baca(await jasaDetailRoute.DELETE(req('/x', { method: 'DELETE' }), c));
      expect(status).toBe(200);
      expect(body.message).toBe('Penawaran jasa berhasil dinonaktifkan');
      expect(spy).toHaveBeenCalledWith('j-1');
    });

    it('DELETE 401 / 403 / 404', async () => {
      expect((await jasaDetailRoute.DELETE(req('/x', { method: 'DELETE' }), c)).status).toBe(401);

      sesi({ id: 'p-2' });
      const detail = vi.spyOn(JasaController, 'ambilDetailJasa').mockResolvedValueOnce({ id_penyedia_jasa: 'p-1' } as any);
      expect((await jasaDetailRoute.DELETE(req('/x', { method: 'DELETE' }), c)).status).toBe(403);

      detail.mockRejectedValueOnce(new Error('Data jasa tidak ditemukan'));
      expect((await jasaDetailRoute.DELETE(req('/x', { method: 'DELETE' }), c)).status).toBe(404);
    });

    describe('mode mock', () => {
      beforeEach(() => vi.stubEnv('NEXT_PUBLIC_USE_MOCK', 'true'));

      it('GET 200 untuk id mock & 404 untuk id asing', async () => {
        const id = mockJasaList[0].id_jasa;
        expect((await jasaDetailRoute.GET(req('/x'), ctx({ id }))).status).toBe(200);
        expect((await jasaDetailRoute.GET(req('/x'), ctx({ id: 'asing' }))).status).toBe(404);
      });

      it.each([
        ['body kosong', {}],
        ['nama kosong', { nama_jasa: '  ' }],
        ['harga tidak valid', { harga: 0 }],
      ])('PATCH 400 jika %s', async (_label, payload) => {
        const id = mockJasaList[0].id_jasa;
        const res = await jasaDetailRoute.PATCH(req('/x', { method: 'PATCH', body: payload }), ctx({ id }));
        expect(res.status).toBe(400);
      });

      it('PATCH/DELETE 404 untuk id asing', async () => {
        expect((await jasaDetailRoute.PATCH(req('/x', { method: 'PATCH', body: { harga: 1 } }), ctx({ id: 'asing' }))).status).toBe(404);
        expect((await jasaDetailRoute.DELETE(req('/x', { method: 'DELETE' }), ctx({ id: 'asing' }))).status).toBe(404);
      });
    });
  });
});

// =========================================================================
// LAPORAN (pengguna)
// =========================================================================
describe('API Laporan', () => {
  it('GET /api/laporan 200 / 401 / 400', async () => {
    expect((await laporanRoute.GET(req('/api/laporan'))).status).toBe(401);

    loginSebagai({ id: 'u-1' });
    const spy = vi
      .spyOn(PelaporanService, 'getTicketsByUser')
      .mockResolvedValueOnce([{ id_tiket: 't-1' }] as any)
      .mockRejectedValueOnce(new Error(''));

    const ok = await baca(await laporanRoute.GET(req('/api/laporan')));
    expect(ok.status).toBe(200);
    expect(ok.body.data).toHaveLength(1);
    expect(spy).toHaveBeenCalledWith('u-1');

    const gagal = await baca(await laporanRoute.GET(req('/api/laporan')));
    expect(gagal.status).toBe(400);
    expect(gagal.body.message).toBe('Gagal mengambil daftar tiket.');
  });

  it('GET /api/laporan/[id_tiket] 200 / 401 / 400 (bukan pemilik tiket)', async () => {
    const c = ctx({ id_tiket: 't-1' });
    expect((await laporanDetailRoute.GET(req('/x'), c)).status).toBe(401);

    loginSebagai({ id: 'u-1' });
    const spy = vi
      .spyOn(PelaporanService, 'getDetailTiket')
      .mockResolvedValueOnce({ id_tiket: 't-1' } as any)
      .mockRejectedValueOnce(new Error('Akses ditolak'));

    const ok = await baca(await laporanDetailRoute.GET(req('/x'), c));
    expect(ok.status).toBe(200);
    expect(spy).toHaveBeenCalledWith('t-1', 'u-1');

    const gagal = await baca(await laporanDetailRoute.GET(req('/x'), c));
    expect(gagal.status).toBe(400);
    expect(gagal.body.message).toBe('Akses ditolak');
  });

  describe('POST /api/pesanan/[id_pesanan]/laporan', () => {
    const lapor = (body: unknown) =>
      pesananLaporanRoute.POST(req('/x', { method: 'POST', body }), ctx({ id_pesanan: 'o-1' }));

    const payload = { kategori: ['Hasil Tidak Sesuai'], deskripsi_laporan: 'Tidak sesuai brief', url_bukti: ['https://b/1.png'] };

    it('200 tiket dibuat', async () => {
      sesi({ id: 'u-1', isPenggunaJasa: true });
      const spy = vi.spyOn(PelaporanService, 'submitLaporan').mockResolvedValue({ id_tiket: 't-1' } as any);
      const { status, body } = await baca(await lapor(payload));
      expect(status).toBe(200);
      expect(body.data.id_tiket).toBe('t-1');
      expect(spy).toHaveBeenCalledWith('o-1', 'u-1', payload);
    });

    it('401 tanpa sesi', async () => {
      expect((await lapor(payload)).status).toBe(401);
    });

    it('403 jika bukan pengguna jasa', async () => {
      sesi({ id: 'p-1', isPenggunaJasa: false, isPenyediaJasa: true });
      const spy = vi.spyOn(PelaporanService, 'submitLaporan');
      expect((await lapor(payload)).status).toBe(403);
      expect(spy).not.toHaveBeenCalled();
    });

    it('400 jika laporan duplikat / validasi gagal', async () => {
      sesi({ id: 'u-1', isPenggunaJasa: true });
      vi.spyOn(PelaporanService, 'submitLaporan').mockRejectedValue(new Error('Pesanan ini sudah memiliki laporan aktif'));
      const { status, body } = await baca(await lapor(payload));
      expect(status).toBe(400);
      expect(body.message).toBe('Pesanan ini sudah memiliki laporan aktif');
    });
  });
});

// =========================================================================
// NOTIFIKASI
// =========================================================================
describe('API /api/notifikasi', () => {
  it('GET 200 notifikasi user', async () => {
    loginSebagai({ id: 'u-1' });
    vi.mocked(NotifikasiService.getNotifikasiUser).mockResolvedValue({ notifications: [], unreadCount: 3 } as any);
    const { status, body } = await baca(await notifikasiRoute.GET());
    expect(status).toBe(200);
    expect(body.result.unreadCount).toBe(3);
    expect(NotifikasiService.getNotifikasiUser).toHaveBeenCalledWith('u-1');
  });

  it('GET 401 / 500', async () => {
    expect((await notifikasiRoute.GET()).status).toBe(401);

    loginSebagai({ id: 'u-1' });
    vi.mocked(NotifikasiService.getNotifikasiUser).mockRejectedValue(new Error('DB'));
    const { status, body } = await baca(await notifikasiRoute.GET());
    expect(status).toBe(500);
    expect(body.message).toBe('DB');
  });

  it('PATCH 200 menandai notifikasi milik user sebagai dibaca', async () => {
    loginSebagai({ id: 'u-1' });
    vi.mocked(NotifikasiService.tandaiSudahDibaca).mockResolvedValue(undefined as any);
    const { status } = await baca(await notifikasiRoute.PATCH(req('/x', { method: 'PATCH', body: { id_notifikasi: 'n-1' } })));
    expect(status).toBe(200);
    // Kontrak service: tandaiSudahDibaca(user_id, id_notifikasi?)
    expect(NotifikasiService.tandaiSudahDibaca).toHaveBeenCalledWith('u-1', 'n-1');
  });

  it('PATCH 400 jika id_notifikasi kosong, 401 tanpa login', async () => {
    expect((await notifikasiRoute.PATCH(req('/x', { method: 'PATCH', body: {} }))).status).toBe(401);

    loginSebagai({ id: 'u-1' });
    const { status, body } = await baca(await notifikasiRoute.PATCH(req('/x', { method: 'PATCH', body: {} })));
    expect(status).toBe(400);
    expect(body.message).toBe('id_notifikasi wajib disertakan');
  });

  it('PATCH 500 jika service gagal atau body rusak', async () => {
    loginSebagai({ id: 'u-1' });
    vi.mocked(NotifikasiService.tandaiSudahDibaca).mockRejectedValue(new Error('DB'));
    const { status, body } = await baca(await notifikasiRoute.PATCH(req('/x', { method: 'PATCH', body: { id_notifikasi: 'n' } })));
    expect(status).toBe(500);
    expect(body).toEqual({ error: 'DB' });

    expect((await notifikasiRoute.PATCH(req('/x', { method: 'PATCH', body: '{x' }))).status).toBe(500);
  });
});

// =========================================================================
// DELIVERABLES & REVISI
// =========================================================================
describe('API Deliverables', () => {
  const c = ctx({ id_pesanan: 'o-1' });

  describe('GET /api/pesanan/[id_pesanan]/deliverables', () => {
    it('200 detail hasil pekerjaan', async () => {
      loginSebagai({ id: 'u-1' });
      const spy = vi.spyOn(DeliverablesService, 'getDeliverableByPesanan').mockResolvedValue({ id_produk_akhir: 'pa-1' } as any);
      const { status, body } = await baca(await deliverablesRoute.GET(req('/x'), c));
      expect(status).toBe(200);
      expect(body.deliverable.id_produk_akhir).toBe('pa-1');
      expect(spy).toHaveBeenCalledWith('o-1', 'u-1');
    });

    it('401 tanpa login', async () => {
      const { status, body } = await baca(await deliverablesRoute.GET(req('/x'), c));
      expect(status).toBe(401);
      expect(body.message).toBe('Anda belum login');
    });

    it.each([
      ['Akses ditolak: bukan pihak pesanan', 403, 'Akses ditolak: bukan pihak pesanan'],
      ['Hasil Pekerjaan tidak ditemukan', 404, 'Hasil Pekerjaan tidak ditemukan'],
      ['Pesanan tidak ditemukan', 404, 'Pesanan tidak ditemukan'],
      ['insert violates foreign key constraint "fk"', 404, 'Data pesanan tidak ditemukan di sistem.'],
      ['null value violates not-null constraint', 400, 'Data yang dikirimkan kurang lengkap.'],
      ['ECONNRESET', 500, 'Terjadi kesalahan pada sistem. Silakan coba beberapa saat lagi.'],
    ])('error "%s" -> %i (pesan disanitasi)', async (raw, expected, msg) => {
      loginSebagai({ id: 'u-1' });
      vi.spyOn(DeliverablesService, 'getDeliverableByPesanan').mockRejectedValue(new Error(raw));
      const { status, body } = await baca(await deliverablesRoute.GET(req('/x'), c));
      expect(status).toBe(expected);
      expect(body.message).toBe(msg);
    });
  });

  describe('POST /api/pesanan/[id_pesanan]/deliverables', () => {
    const payload = { deskripsi_produk: 'Final', file_url: 'https://f/final.zip', output_path: 'out/final.zip' };

    it('201 validasi pemilik lalu submit', async () => {
      loginSebagai({ id: 'p-1' });
      const owner = vi.spyOn(DeliverablesService, 'validasiOwnerPesanan').mockResolvedValue(true);
      const submit = vi.spyOn(DeliverablesService, 'submitDeliverable').mockResolvedValue({ id_produk_akhir: 'pa-1' } as any);

      const { status, body } = await baca(await deliverablesRoute.POST(req('/x', { method: 'POST', body: payload }), c));

      expect(status).toBe(201);
      expect(body.data.id_produk_akhir).toBe('pa-1');
      expect(owner).toHaveBeenCalledWith('o-1', 'p-1');
      expect(submit).toHaveBeenCalledWith({ id_pesanan: 'o-1', ...payload });
    });

    it('403 jika bukan pihak pesanan (submit tidak dipanggil)', async () => {
      loginSebagai({ id: 'asing' });
      vi.spyOn(DeliverablesService, 'validasiOwnerPesanan').mockRejectedValue(new Error('Akses ditolak'));
      const submit = vi.spyOn(DeliverablesService, 'submitDeliverable');
      expect((await deliverablesRoute.POST(req('/x', { method: 'POST', body: payload }), c)).status).toBe(403);
      expect(submit).not.toHaveBeenCalled();
    });

    it.each([
      ['Deskripsi produk tidak boleh kosong'],
      ['Unggah berkas hasil pekerjaan terlebih dahulu'],
    ])('400 validasi bisnis: %s', async (msg) => {
      loginSebagai({ id: 'p-1' });
      vi.spyOn(DeliverablesService, 'validasiOwnerPesanan').mockResolvedValue(true);
      vi.spyOn(DeliverablesService, 'submitDeliverable').mockRejectedValue(new Error(msg));
      const { status, body } = await baca(await deliverablesRoute.POST(req('/x', { method: 'POST', body: {} }), c));
      expect(status).toBe(400);
      expect(body.message).toBe(msg);
    });

    it('401 tanpa login', async () => {
      expect((await deliverablesRoute.POST(req('/x', { method: 'POST', body: payload }), c)).status).toBe(401);
    });
  });

  describe('PATCH /api/pesanan/[id_pesanan]/deliverables (konfirmasi selesai)', () => {
    it('200 konfirmasi selesai', async () => {
      loginSebagai({ id: 'u-1' });
      const spy = vi.spyOn(DeliverablesService, 'confirmOrderComplete').mockResolvedValue();
      const { status, body } = await baca(await deliverablesRoute.PATCH(req('/x', { method: 'PATCH' }), c));
      expect(status).toBe(200);
      expect(body.message).toContain('dana telah dicairkan');
      expect(spy).toHaveBeenCalledWith('o-1', 'u-1');
    });

    it.each([
      ['Pesanan sudah diselesaikan sebelumnya', 400],
      ['Hasil pekerjaan belum dikumpulkan', 400],
      ['Akses ditolak: hanya pengguna jasa', 403],
    ])('error "%s" -> %i', async (msg, expected) => {
      loginSebagai({ id: 'u-1' });
      vi.spyOn(DeliverablesService, 'confirmOrderComplete').mockRejectedValue(new Error(msg));
      expect((await deliverablesRoute.PATCH(req('/x', { method: 'PATCH' }), c)).status).toBe(expected);
    });

    it('401 tanpa login', async () => {
      expect((await deliverablesRoute.PATCH(req('/x', { method: 'PATCH' }), c)).status).toBe(401);
    });
  });

  describe('POST /api/pesanan/[id_pesanan]/deliverables/upload', () => {
    const unggah = (body: unknown) => deliverableUploadRoute.POST(req('/x', { method: 'POST', body }), c);
    const formBerkas = (f?: File) => {
      const form = new FormData();
      if (f) form.append('berkas', f);
      return form;
    };

    it('201 mengunggah berkas dan mengembalikan url', async () => {
      loginSebagai({ id: 'p-1' });
      vi.spyOn(DeliverablesService, 'validasiOwnerPesanan').mockResolvedValue(true);
      const spy = vi.spyOn(DeliverablesService, 'unggahBerkasDeliverable').mockResolvedValue('https://s/final.zip');
      const { status, body } = await baca(await unggah(formBerkas(file('final.zip', 'application/zip'))));
      expect(status).toBe(201);
      expect(body.data.url).toBe('https://s/final.zip');
      expect((spy.mock.calls[0][0] as File).name).toBe('final.zip');
    });

    it('401 tanpa login', async () => {
      expect((await unggah(formBerkas(file('a.png', 'image/png')))).status).toBe(401);
    });

    it('403 jika bukan pihak pesanan', async () => {
      loginSebagai({ id: 'asing' });
      vi.spyOn(DeliverablesService, 'validasiOwnerPesanan').mockRejectedValue(new Error('x'));
      const { status, body } = await baca(await unggah(formBerkas(file('a.png', 'image/png'))));
      expect(status).toBe(403);
      expect(body.message).toBe('Akses ditolak');
    });

    it('400 jika body bukan multipart', async () => {
      loginSebagai({ id: 'p-1' });
      vi.spyOn(DeliverablesService, 'validasiOwnerPesanan').mockResolvedValue(true);
      expect((await unggah({ berkas: 'x' })).status).toBe(400);
    });

    it('400 jika berkas tidak ada atau kosong', async () => {
      loginSebagai({ id: 'p-1' });
      vi.spyOn(DeliverablesService, 'validasiOwnerPesanan').mockResolvedValue(true);
      expect((await unggah(formBerkas())).status).toBe(400);
      expect((await unggah(formBerkas(file('a.png', 'image/png', 0)))).status).toBe(400);
    });

    it.each([
      ['Ukuran berkas melebihi 50 MB', 400],
      ['Tipe berkas tidak diizinkan', 400],
      ['Storage bucket not found', 500],
    ])('error upload "%s" -> %i', async (msg, expected) => {
      loginSebagai({ id: 'p-1' });
      vi.spyOn(DeliverablesService, 'validasiOwnerPesanan').mockResolvedValue(true);
      vi.spyOn(DeliverablesService, 'unggahBerkasDeliverable').mockRejectedValue(new Error(msg));
      expect((await unggah(formBerkas(file('a.png', 'image/png')))).status).toBe(expected);
    });
  });

  describe('/api/pesanan/[id_pesanan]/deliverables/revisi', () => {
    it('GET 200 riwayat revisi + deliverable aktif', async () => {
      loginSebagai({ id: 'u-1' });
      vi.spyOn(DeliverablesService, 'getRevisionHistory').mockResolvedValue([{ id_revisi: 'r-1' }]);
      vi.spyOn(DeliverablesService, 'getDeliverableByPesanan').mockResolvedValue({ id_produk_akhir: 'pa-1' } as any);
      const { status, body } = await baca(await revisiRoute.GET(req('/x'), c));
      expect(status).toBe(200);
      expect(body.data).toEqual({ revisi: [{ id_revisi: 'r-1' }], deliverable_aktif: { id_produk_akhir: 'pa-1' } });
    });

    it('GET 401 / 400', async () => {
      expect((await revisiRoute.GET(req('/x'), c)).status).toBe(401);

      loginSebagai({ id: 'u-1' });
      vi.spyOn(DeliverablesService, 'getRevisionHistory').mockResolvedValue([]);
      vi.spyOn(DeliverablesService, 'getDeliverableByPesanan').mockRejectedValue(new Error('Hasil Pekerjaan tidak ditemukan'));
      expect((await revisiRoute.GET(req('/x'), c)).status).toBe(400);
    });

    it('POST (pembeli) 200 mengajukan revisi', async () => {
      loginSebagai({ id: 'u-1' });
      const spy = vi.spyOn(DeliverablesService, 'requestRevision').mockResolvedValue({ id_revisi: 'r-2' } as any);
      const payload = { deskripsi_revisi: 'Ganti warna', lampiran_revisi: ['https://l/1.png'], id_produk_akhir: 'pa-1' };
      const { status, body } = await baca(await revisiRoute.POST(req('/x', { method: 'POST', body: payload }), c));
      expect(status).toBe(200);
      expect(body.message).toBe('Pengajuan revisi berhasil dikirim.');
      expect(spy).toHaveBeenCalledWith({ id_pesanan: 'o-1', user_id: 'u-1', ...payload });
    });

    it('POST (penjual, action=submit_revision) 200 mengirim perbaikan', async () => {
      loginSebagai({ id: 'p-1' });
      const fix = vi.spyOn(DeliverablesService, 'submitRevisionFix').mockResolvedValue({ id_produk_akhir: 'pa-2' } as any);
      const ajukan = vi.spyOn(DeliverablesService, 'requestRevision');
      const payload = { action: 'submit_revision', deskripsi_produk: 'V2', file_url: 'https://f/v2.png', output_path: 'o/v2.png' };
      const { status, body } = await baca(await revisiRoute.POST(req('/x', { method: 'POST', body: payload }), c));
      expect(status).toBe(200);
      expect(body.message).toBe('Hasil perbaikan revisi berhasil dikumpulkan.');
      expect(fix).toHaveBeenCalledWith({ id_pesanan: 'o-1', deskripsi_produk: 'V2', file_url: 'https://f/v2.png', output_path: 'o/v2.png', user_id: 'p-1' });
      expect(ajukan).not.toHaveBeenCalled();
    });

    it('POST 400 jika jatah revisi habis / body rusak, 401 tanpa login', async () => {
      expect((await revisiRoute.POST(req('/x', { method: 'POST', body: {} }), c)).status).toBe(401);

      loginSebagai({ id: 'u-1' });
      vi.spyOn(DeliverablesService, 'requestRevision').mockRejectedValue(new Error('Jatah revisi sudah habis'));
      const { status, body } = await baca(await revisiRoute.POST(req('/x', { method: 'POST', body: { deskripsi_revisi: 'x' } }), c));
      expect(status).toBe(400);
      expect(body.message).toBe('Jatah revisi sudah habis');

      expect((await revisiRoute.POST(req('/x', { method: 'POST', body: '{x' }), c)).status).toBe(400);
    });
  });
});

// =========================================================================
// PESANAN
// =========================================================================
describe('API Pesanan', () => {
  describe('GET /api/pesanan', () => {
    it('200 dan peran otomatis penyedia_jasa saat id_penyedia_jasa dikirim', async () => {
      const spy = vi.spyOn(PesananService, 'ambilDaftarPesanan').mockResolvedValue([{ id_pesanan: 'o-1' }] as any);
      const { status, body } = await baca(await pesananRoute.GET(req('/api/pesanan?id_penyedia_jasa=p-1&status=DIPROSES')));
      expect(status).toBe(200);
      expect(body.message).toBe('Daftar pesanan berhasil diambil');
      expect(spy).toHaveBeenCalledWith('p-1', 'penyedia_jasa', 'DIPROSES');
    });

    it('default peran pengguna_jasa & pesan "Daftar pesanan kosong"', async () => {
      const spy = vi.spyOn(PesananService, 'ambilDaftarPesanan').mockResolvedValue([]);
      const { body } = await baca(await pesananRoute.GET(req('/api/pesanan?id_pengguna=u-1')));
      expect(body.message).toBe('Daftar pesanan kosong');
      expect(spy).toHaveBeenCalledWith('u-1', 'pengguna_jasa', undefined);
    });

    it.each([
      ['ID pengguna tidak valid', 400, 'VALIDATION_ERROR'],
      ['Akses ditolak', 403, 'FORBIDDEN'],
      ['Pengguna tidak ditemukan', 404, 'NOT_FOUND'],
      ['timeout', 500, 'DATABASE_ERROR'],
    ])('error "%s" -> %i', async (msg, expected, code) => {
      vi.spyOn(PesananService, 'ambilDaftarPesanan').mockRejectedValue(new Error(msg));
      const { status, body } = await baca(await pesananRoute.GET(req('/api/pesanan')));
      expect(status).toBe(expected);
      expect(body.error_code).toBe(code);
    });
  });

  describe('POST /api/pesanan', () => {
    it('201 dan mendukung alias brief_kebutuhan', async () => {
      const spy = vi.spyOn(PesananService, 'buatPesananBaru').mockResolvedValue({ id_pesanan: 'o-1' } as any);
      const { status, body } = await baca(
        await pesananRoute.POST(req('/api/pesanan', { method: 'POST', body: { id_pengguna_jasa: 'u-1', id_jasa: 'j-1', brief_kebutuhan: 'Logo' } })),
      );
      expect(status).toBe(201);
      expect(body.data.id_pesanan).toBe('o-1');
      expect(spy).toHaveBeenCalledWith('u-1', 'j-1', 'Logo');
    });

    it('field kosong diteruskan sebagai string kosong ke service', async () => {
      const spy = vi.spyOn(PesananService, 'buatPesananBaru').mockRejectedValue(new Error('Brief kebutuhan wajib diisi'));
      const { status } = await baca(await pesananRoute.POST(req('/api/pesanan', { method: 'POST', body: {} })));
      expect(spy).toHaveBeenCalledWith('', '', '');
      expect(status).toBe(400);
    });

    it.each([
      ['Batas maksimal pesanan aktif tercapai', 400],
      ['Tidak dapat memesan jasa milik sendiri', 400],
      ['Data jasa tidak ditemukan', 404],
    ])('error "%s" -> %i', async (msg, expected) => {
      vi.spyOn(PesananService, 'buatPesananBaru').mockRejectedValue(new Error(msg));
      expect((await pesananRoute.POST(req('/api/pesanan', { method: 'POST', body: { id_jasa: 'j' } }))).status).toBe(expected);
    });

    it('500 jika body JSON rusak (SyntaxError tidak dipetakan khusus)', async () => {
      const { status, body } = await baca(await pesananRoute.POST(req('/api/pesanan', { method: 'POST', body: '{x' })));
      expect(status).toBe(500);
      expect(body.error_code).toBe('DATABASE_ERROR');
    });
  });

  describe('/api/pesanan/[id_pesanan]', () => {
    const c = ctx({ id_pesanan: 'o-1' });
    const respon = (body: unknown) => pesananDetailRoute.PATCH(req('/x', { method: 'PATCH', body }), c);

    it.each(['terima', 'Diterima', 'TERIMA'])('PATCH 200 aksi "%s" -> diterima', async (action) => {
      loginSebagai({ id: 'p-1' });
      const spy = vi.spyOn(PesananService, 'respondOrder').mockResolvedValue(undefined as any);
      const { status, body } = await baca(await respon({ action }));
      expect(status).toBe(200);
      expect(body.message).toBe('Pesanan berhasil diterima.');
      expect(spy).toHaveBeenCalledWith({ id_pesanan: 'o-1', user_id: 'p-1', action });
    });

    it('PATCH 200 aksi tolak', async () => {
      loginSebagai({ id: 'p-1' });
      vi.spyOn(PesananService, 'respondOrder').mockResolvedValue(undefined as any);
      const { body } = await baca(await respon({ action: 'tolak' }));
      expect(body.message).toBe('Pesanan ditolak.');
    });

    it.each([[{}], [{ action: 'batal' }], [{ action: '' }]])('PATCH 400 aksi tidak valid %j', async (payload) => {
      const spy = vi.spyOn(PesananService, 'respondOrder');
      const { status, body } = await baca(await respon(payload));
      expect(status).toBe(400);
      expect(body.message).toContain('Aksi tidak valid');
      expect(spy).not.toHaveBeenCalled();
    });

    it('PATCH 401 tanpa login', async () => {
      expect((await respon({ action: 'terima' })).status).toBe(401);
    });

    it.each([
      ['Pesanan tidak ditemukan', 404],
      ['Akses ditolak: bukan penyedia pesanan ini', 403],
      ['Pesanan sudah diproses', 400],
      ['deadlock detected', 500],
    ])('PATCH error "%s" -> %i', async (msg, expected) => {
      loginSebagai({ id: 'p-1' });
      vi.spyOn(PesananService, 'respondOrder').mockRejectedValue(new Error(msg));
      expect((await respon({ action: 'terima' })).status).toBe(expected);
    });

    it('PATCH 500 jika body JSON rusak', async () => {
      expect((await respon('{x')).status).toBe(500);
    });

    it('GET 200 detail pesanan', async () => {
      const spy = vi.spyOn(PesananService, 'ambilDetailPesanan').mockResolvedValue({ id_pesanan: 'o-1' } as any);
      const { status, body } = await baca(await pesananDetailRoute.GET(req('/x'), c));
      expect(status).toBe(200);
      expect(body.data.id_pesanan).toBe('o-1');
      expect(spy).toHaveBeenCalledWith('o-1');
    });

    it.each([
      ['Pesanan tidak ditemukan', 404],
      ['ID pesanan tidak valid', 400],
      ['DB down', 500],
    ])('GET error "%s" -> %i', async (msg, expected) => {
      vi.spyOn(PesananService, 'ambilDetailPesanan').mockRejectedValue(new Error(msg));
      expect((await pesananDetailRoute.GET(req('/x'), c)).status).toBe(expected);
    });

    describe('mode mock', () => {
      beforeEach(() => vi.stubEnv('NEXT_PUBLIC_USE_MOCK', 'true'));

      it('GET 404 untuk pesanan yang tidak ada', async () => {
        expect((await pesananDetailRoute.GET(req('/x'), ctx({ id_pesanan: 'tidak-ada' }))).status).toBe(404);
      });
    });
  });
});

// =========================================================================
// TRANSAKSI
// =========================================================================
describe('API Transaksi', () => {
  describe('POST /api/transaksi/dummy', () => {
    const bayar = (body: unknown) => transaksiDummyRoute.POST(req('/x', { method: 'POST', body }));

    it('201 pembayaran berhasil', async () => {
      const spy = vi.spyOn(PengontrolTransaksi, 'prosesPembayaranDummy').mockResolvedValue({ transaksi: { id: 't' } } as any);
      const { status, body } = await baca(await bayar({ id_pesanan: 'o-1', id_metode: 'm-1', jumlah_bayar: 250000 }));
      expect(status).toBe(201);
      expect(body.message).toBe('Pembayaran dummy berhasil diproses');
      expect(spy).toHaveBeenCalledWith('o-1', 'm-1', 250000);
    });

    it('mendukung alias id_metode_pembayaran & total_biaya', async () => {
      const spy = vi.spyOn(PengontrolTransaksi, 'prosesPembayaranDummy').mockResolvedValue({} as any);
      await bayar({ id_pesanan: 'o-1', id_metode_pembayaran: 'm-2', total_biaya: 100 });
      expect(spy).toHaveBeenCalledWith('o-1', 'm-2', 100);
    });

    it('400 jika body JSON rusak', async () => {
      const { status, body } = await baca(await bayar('{x'));
      expect(status).toBe(400);
      expect(body.message).toBe('Format body JSON tidak valid');
    });

    it.each([
      ['Pesanan sudah lunas', 400],
      ['Jumlah bayar tidak sesuai', 400],
      ['Status pesanan bukan menunggu pembayaran', 400],
      ['Metode pembayaran tidak ditemukan', 404],
      ['gateway timeout', 500],
    ])('error "%s" -> %i', async (msg, expected) => {
      vi.spyOn(PengontrolTransaksi, 'prosesPembayaranDummy').mockRejectedValue(new Error(msg));
      expect((await bayar({ id_pesanan: 'o' })).status).toBe(expected);
    });
  });

  describe('GET /api/transaksi', () => {
    it('detail metode via ?id_metode', async () => {
      const spy = vi.spyOn(PengontrolTransaksi, 'dapatkanDetailMetode').mockResolvedValue({ id_metode: 'm-1' } as any);
      const { status, body } = await baca(await transaksiRoute.GET(req('/api/transaksi?id_metode=m-1')));
      expect(status).toBe(200);
      expect(body.message).toBe('Detail metode pembayaran berhasil diambil');
      expect(spy).toHaveBeenCalledWith('m-1');
    });

    it('daftar metode via ?type=metode', async () => {
      vi.spyOn(PengontrolTransaksi, 'ambilDaftarMetode').mockResolvedValue([{ id_metode: 'm-1' }] as any);
      const { body } = await baca(await transaksiRoute.GET(req('/api/transaksi?type=metode')));
      expect(body.message).toBe('Daftar metode pembayaran berhasil diambil');
      expect(body.data).toHaveLength(1);
    });

    it('riwayat transaksi penyedia & pesan kosong', async () => {
      const spy = vi.spyOn(PengontrolTransaksi, 'ambilRiwayatTransaksi').mockResolvedValue([]);
      const { body } = await baca(await transaksiRoute.GET(req('/api/transaksi?id_penyedia_jasa=p-1')));
      expect(body.message).toBe('Daftar riwayat transaksi kosong');
      expect(spy).toHaveBeenCalledWith('p-1', 'penyedia_jasa');
    });

    it.each([
      ['Metode pembayaran tidak ditemukan', 404],
      ['ID metode tidak valid', 400],
      ['DB', 500],
    ])('error "%s" -> %i', async (msg, expected) => {
      vi.spyOn(PengontrolTransaksi, 'dapatkanDetailMetode').mockRejectedValue(new Error(msg));
      expect((await transaksiRoute.GET(req('/api/transaksi?id_metode=x'))).status).toBe(expected);
    });

    describe('mode mock', () => {
      beforeEach(() => vi.stubEnv('NEXT_PUBLIC_USE_MOCK', 'true'));

      it('daftar metode dari data mock tanpa menyentuh DB', async () => {
        const spy = vi.spyOn(PengontrolTransaksi, 'ambilDaftarMetode');
        const { status, body } = await baca(await transaksiRoute.GET(req('/api/transaksi?type=metode')));
        expect(status).toBe(200);
        expect(Array.isArray(body.data)).toBe(true);
        expect(spy).not.toHaveBeenCalled();
      });

      it('404 untuk id_metode yang tidak ada', async () => {
        expect((await transaksiRoute.GET(req('/api/transaksi?id_metode=tidak-ada'))).status).toBe(404);
      });
    });
  });
});

// =========================================================================
// ULASAN
// =========================================================================
describe('API /api/ulasan', () => {
  describe('POST', () => {
    const kirim = (body: unknown) => ulasanRoute.POST(req('/api/ulasan', { method: 'POST', body }));

    it('201 dan field opsional default null', async () => {
      loginSebagai({ id: 'u-1' });
      const spy = vi.spyOn(UlasanService, 'simpanUlasan').mockResolvedValue({ id_ulasan: 'ul-1' } as any);
      const { status, body } = await baca(await kirim({ id_pesanan: 'o-1', rating: '5' }));
      expect(status).toBe(201);
      expect(body.data.id_ulasan).toBe('ul-1');
      expect(spy).toHaveBeenCalledWith({ id_pesanan: 'o-1', id_pengguna_jasa: 'u-1', rating: 5, komentar: null, dokumentasi: null });
    });

    it('401 tanpa login', async () => {
      expect((await kirim({ id_pesanan: 'o', rating: 5 })).status).toBe(401);
    });

    it.each([
      ['tanpa id_pesanan', { rating: 4 }],
      ['tanpa rating', { id_pesanan: 'o' }],
      ['rating null', { id_pesanan: 'o', rating: null }],
    ])('400 jika %s', async (_label, payload) => {
      loginSebagai({ id: 'u-1' });
      const { status, body } = await baca(await kirim(payload));
      expect(status).toBe(400);
      expect(body.message).toBe('ID pesanan dan penilaian (rating) wajib diisi.');
    });

    it.each([0, 6, -1, 'abc'])('400 jika rating di luar rentang 1-5 (%s)', async (rating) => {
      loginSebagai({ id: 'u-1' });
      const spy = vi.spyOn(UlasanService, 'simpanUlasan');
      const { status, body } = await baca(await kirim({ id_pesanan: 'o', rating }));
      expect(status).toBe(400);
      expect(body.message).toBe('Rating harus bernilai antara 1 sampai 5');
      expect(spy).not.toHaveBeenCalled();
    });

    it.each([1, 5])('batas rating %i diterima', async (rating) => {
      loginSebagai({ id: 'u-1' });
      vi.spyOn(UlasanService, 'simpanUlasan').mockResolvedValue({} as any);
      expect((await kirim({ id_pesanan: 'o', rating })).status).toBe(201);
    });

    it('400 jika ulasan duplikat / pesanan belum selesai', async () => {
      loginSebagai({ id: 'u-1' });
      vi.spyOn(UlasanService, 'simpanUlasan').mockRejectedValue(new Error('Pesanan sudah diulas'));
      const { status, body } = await baca(await kirim({ id_pesanan: 'o', rating: 4 }));
      expect(status).toBe(400);
      expect(body.message).toBe('Pesanan sudah diulas');
    });
  });

  describe('GET', () => {
    it('200 rating penyedia (prioritas di atas id_jasa)', async () => {
      const spyP = vi.spyOn(UlasanService, 'getRatingDanUlasanPenyedia').mockResolvedValue({ rata_rata: 4.5 } as any);
      const spyJ = vi.spyOn(UlasanService, 'getUlasanJasaById');
      const { status, body } = await baca(await ulasanRoute.GET(req('/api/ulasan?id_penyedia_jasa=p-1&id_jasa=j-1')));
      expect(status).toBe(200);
      expect(body.data.rata_rata).toBe(4.5);
      expect(spyP).toHaveBeenCalledWith('p-1');
      expect(spyJ).not.toHaveBeenCalled();
    });

    it('200 ulasan per jasa', async () => {
      const spy = vi.spyOn(UlasanService, 'getUlasanJasaById').mockResolvedValue([{ rating: 5 }] as any);
      const { status, body } = await baca(await ulasanRoute.GET(req('/api/ulasan?id_jasa=j-1')));
      expect(status).toBe(200);
      expect(body.data).toHaveLength(1);
      expect(spy).toHaveBeenCalledWith('j-1');
    });

    it('400 tanpa parameter', async () => {
      const { status, body } = await baca(await ulasanRoute.GET(req('/api/ulasan')));
      expect(status).toBe(400);
      expect(body.message).toBe('Parameter id_jasa atau id_penyedia wajib diisi.');
    });

    it('400 jika service gagal', async () => {
      vi.spyOn(UlasanService, 'getUlasanJasaById').mockRejectedValue(new Error('DB'));
      expect((await ulasanRoute.GET(req('/api/ulasan?id_jasa=j'))).status).toBe(400);
    });
  });
});

// =========================================================================
// UPLOAD UMUM
// =========================================================================
describe('API POST /api/upload', () => {
  let upload: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    upload = vi.fn().mockResolvedValue({ url: 'https://s/jasa/a.png', error: null });
    vi.mocked(getStorageService).mockReturnValue({ upload } as any);
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  const form = (folder: string | null, berkas?: Blob | File) => {
    const f = new FormData();
    if (folder !== null) f.set('folder', folder);
    if (berkas) f.append('berkas', berkas);
    return f;
  };
  const kirim = (body: unknown) => uploadRoute.POST(req('/api/upload', { method: 'POST', body }));

  it('201 berkas valid terunggah', async () => {
    sesi({ id: 'u-1' });
    const { status, body } = await baca(await kirim(form(' jasa ', file('a.png', 'image/png'))));
    expect(status).toBe(201);
    expect(body.data.url).toBe('https://s/jasa/a.png');
    expect(upload).toHaveBeenCalledWith(expect.any(File), 'jasa');
  });

  it('401 tanpa sesi (storage tidak disentuh)', async () => {
    expect((await kirim(form('jasa', file('a.png', 'image/png')))).status).toBe(401);
    expect(upload).not.toHaveBeenCalled();
  });

  it('400 jika body bukan multipart', async () => {
    sesi({ id: 'u-1' });
    const { status, body } = await baca(await kirim({ folder: 'jasa' }));
    expect(status).toBe(400);
    expect(body.message).toBe('Body harus berupa multipart/form-data');
  });

  it.each([['../../etc'], ['JASA'], [''], [null]])('400 folder tidak diizinkan: %s', async (folder) => {
    sesi({ id: 'u-1' });
    const { status, body } = await baca(await kirim(form(folder, file('a.png', 'image/png'))));
    expect(status).toBe(400);
    expect(body.message).toContain('Folder tidak valid');
  });

  it('400 jika berkas tidak ada / kosong', async () => {
    sesi({ id: 'u-1' });
    expect((await kirim(form('jasa'))).status).toBe(400);
    expect((await kirim(form('jasa', file('a.png', 'image/png', 0)))).status).toBe(400);
  });

  it('400 jika ukuran melebihi 10 MB', async () => {
    sesi({ id: 'u-1' });
    const { status, body } = await baca(await kirim(form('jasa', file('besar.png', 'image/png', 10 * 1024 * 1024 + 1))));
    expect(status).toBe(400);
    expect(body.message).toContain('melebihi 10 MB');
  });

  it('400 jika ekstensi tidak diizinkan untuk folder', async () => {
    sesi({ id: 'u-1' });
    // mp4 boleh untuk jasa, tapi tidak untuk chat
    const { status, body } = await baca(await kirim(form('chat', file('video.mp4', 'video/mp4'))));
    expect(status).toBe(400);
    expect(body.message).toContain('Format ekstensi');
  });

  it('400 jika MIME tidak cocok meski ekstensi benar (spoofing)', async () => {
    sesi({ id: 'u-1' });
    const { status, body } = await baca(await kirim(form('jasa', file('a.png', 'application/x-msdownload'))));
    expect(status).toBe(400);
    expect(body.message).toContain('Tipe berkas');
  });

  it('500 jika storage mengembalikan error', async () => {
    sesi({ id: 'u-1' });
    upload.mockResolvedValue({ url: null, error: 'bucket penuh' });
    const { status, body } = await baca(await kirim(form('jasa', file('a.png', 'image/png'))));
    expect(status).toBe(500);
    expect(body.message).toBe('Gagal mengunggah berkas');
  });

  it('500 jika terjadi exception tak terduga', async () => {
    sesi({ id: 'u-1' });
    upload.mockRejectedValue(new Error('network'));
    const { status, body } = await baca(await kirim(form('jasa', file('a.png', 'image/png'))));
    expect(status).toBe(500);
    expect(body.message).toBe('Terjadi kegagalan server internal');
  });
});

// =========================================================================
// ALUR UTAMA LINTAS SERVICE (service asli + Supabase mock)
// =========================================================================
describe('Pengujian Alur Utama Sistem (Integration Flow Test)', () => {
  // ALUR 1: Pengumpulan Pekerjaan -> Revisi -> Penyelesaian Pesanan & Dana
  it('Alur Utama 1: Penyedia submit deliverable -> Klien ajukan revisi -> Klien konfirmasi selesai', async () => {
    // 1. Penyedia submit hasil pekerjaan pertama kali
    mockSupabase.single
      .mockResolvedValueOnce({ data: { id_produk_akhir: 'prod-1' }, error: null }) // insert produk
      .mockResolvedValueOnce({
        data: { id_pesanan: 'order-101', id_pengguna_jasa: 'klien-1', jasa: { nama_jasa: 'Desain Banner' } },
        error: null,
      }); // update pesanan status 'Menunggu Konfirmasi'

    const submitRes = await DeliverablesService.submitDeliverable({
      id_pesanan: 'order-101',
      deskripsi_produk: 'Desain awal banner',
      file_url: 'https://storage.com/banner-v1.png',
    });

    expect(submitRes).toBeDefined();
    expect(NotifikasiService.kirimNotifikasi).toHaveBeenCalledWith(
      expect.objectContaining({ id_pengguna: 'klien-1' })
    );

    // 2. Klien mengajukan revisi
    vi.spyOn(DeliverablesService, 'validasiOwnerPesanan').mockResolvedValue(true);

    mockSupabase.single
      .mockResolvedValueOnce({ data: { id_pengguna_jasa: 'klien-1' } }) // check user
      .mockResolvedValueOnce({ data: { id_revisi: 'rev-1' }, error: null }) // insert revisi
      .mockResolvedValueOnce({
        data: { id_penyedia_jasa: 'penyedia-1', jasa: { nama_jasa: 'Desain Banner' } },
        error: null,
      }); // update status pesanan 'Diproses'

    mockSupabase.maybeSingle.mockResolvedValueOnce({ data: { jml_revisi_tersedia: 2 } });

    const revRes = await DeliverablesService.requestRevision({
      id_pesanan: 'order-101',
      deskripsi_revisi: 'Ubah latar belakang jadi biru',
      id_produk_akhir: 'prod-1',
      user_id: 'klien-1',
    });

    expect(revRes).toEqual({ id_revisi: 'rev-1' });

    // 3. Klien mengonfirmasi pesanan selesai & pencairan dana
    mockSupabase.single
      .mockResolvedValueOnce({
        data: { id_penyedia_jasa: 'penyedia-1', total_biaya: 250000, status_pesanan: 'Menunggu Konfirmasi' },
        error: null,
      }) // check status pesanan
      .mockResolvedValueOnce({ data: { saldo: 100000 } }) // get saldo penyedia
      .mockResolvedValueOnce({
        data: { id_penyedia_jasa: 'penyedia-1', jasa: { nama_jasa: 'Desain Banner' } },
        error: null,
      }); // update state pencairan

    mockSupabase.insert.mockResolvedValueOnce({ error: null });

    await DeliverablesService.confirmOrderComplete('order-101', 'klien-1');

    expect(NotifikasiService.kirimNotifikasi).toHaveBeenCalledWith(
      expect.objectContaining({ id_pengguna: 'penyedia-1' })
    );
  });

  // ALUR 2: Pengajuan Laporan Masalah -> Mediasi Admin -> Keputusan Sanksi
  it('Alur Utama 2: Pengajuan laporan masalah -> Admin mulai mediasi -> Admin berikan peringatan', async () => {
    // 1. Klien mengajukan laporan pesanan bermasalah
    mockSupabase.single
      .mockResolvedValueOnce({ data: { id_pengguna_jasa: 'klien-1', id_penyedia_jasa: 'penyedia-1' } }) // check owner
      .mockResolvedValueOnce({ data: { id_tiket: 'tiket-55', status_tiket: 'Diproses' }, error: null }); // insert tiket

    mockSupabase.maybeSingle.mockResolvedValueOnce({ data: null, error: null });

    const laporanRes = await PelaporanService.submitLaporan('order-101', 'klien-1', {
      deskripsi_laporan: 'Pekerjaan tidak sesuai pesanan dan penyedia tidak merespons',
      kategori: ['Hasil Tidak Sesuai'],
      url_bukti: ['https://example.com/bukti1.png'],
    });

    expect(laporanRes.id_tiket).toBe('tiket-55');

    // 2. Admin membuka sesi mediasi
    const mockTiket = { id_tiket: 'tiket-55', id_pesanan: 'order-101', id_pelapor: 'klien-1', id_terlapor: 'penyedia-1' };
    const mockAdmin = { id: 'admin-1' };
    const mockSesiBaru = { id_sesi_mediasi: 'sesi-77', status_sesi: 'BERLANGSUNG' };
    const mockPesanAwal = { id_pesan: 'msg-1', isi_pesan: 'Pesan pembuka' };

    mockSupabaseAdmin.single
      .mockResolvedValueOnce({ data: mockTiket, error: null })
      .mockResolvedValueOnce({ data: mockAdmin, error: null })
      .mockResolvedValueOnce({ data: mockSesiBaru, error: null })
      .mockResolvedValueOnce({ data: mockPesanAwal, error: null });

    mockSupabaseAdmin.maybeSingle.mockResolvedValueOnce({ data: null, error: null });

    const mediasiRes = await MediasiService.mulaiMediasi('tiket-55', 'admin-1');
    expect(mediasiRes.is_new).toBe(true);

    // 3. Admin mencatat keputusan sanksi PERINGATAN ke penyedia
    const mockTiketData = {
      id_tiket: 'tiket-55',
      id_terlapor: 'penyedia-1',
      status_tiket: 'Diproses',
      pesanan: { id_pesanan: 'order-101' },
    };
    const mockTanggapan = { id_tanggapan: 'tanggapan-1' };

    mockSupabase.single
      .mockResolvedValueOnce({ data: mockTiketData, error: null })
      .mockResolvedValueOnce({ data: mockTanggapan, error: null });

    const keputusanRes = await TanggapanLaporanService.catatKeputusanTindakan({
      id_tiket: 'tiket-55',
      id_admin: 'admin-1',
      jenis_tindakan: 'PERINGATAN',
      catatan_tanggapan: 'Diberikan sanksi peringatan keras ke penyedia jasa',
    });

    expect(keputusanRes).toEqual(mockTanggapan);
  });
});
