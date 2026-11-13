import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import {
  login,
  logout,
  getSessionUser,
  AuthError,
  hasRelation,
} from '@/services/auth.service';
import { POST, GET } from '@/app/api/auth/route';
import * as SupabaseServer from '@/lib/supabase/server';
import * as AuthService from '@/services/auth.service';

describe('Autentikator & Sesi Pengguna (auth.service & /api/auth)', () => {
  const mockSignInWithPassword = vi.fn();
  const mockSignOut = vi.fn();
  const mockGetUser = vi.fn();
  const mockFrom = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(SupabaseServer, 'createClient').mockResolvedValue({
      auth: {
        signInWithPassword: mockSignInWithPassword,
        signOut: mockSignOut,
        getUser: mockGetUser,
      },
      from: mockFrom,
    } as any);
  });

  describe('hasRelation helper', () => {
    it('mengembalikan false untuk null, undefined, array kosong, dan object kosong', () => {
      expect(hasRelation(null)).toBe(false);
      expect(hasRelation(undefined)).toBe(false);
      expect(hasRelation([])).toBe(false);
      expect(hasRelation({})).toBe(false);
    });

    it('mengembalikan true untuk array atau objek terisi', () => {
      expect(hasRelation([{ id: '1' }])).toBe(true);
      expect(hasRelation({ id: '1' })).toBe(true);
    });
  });

  describe('auth.service - login', () => {
    it('menolak email atau password kosong / hanya spasi', async () => {
      await expect(login('', 'password123')).rejects.toMatchObject({
        code: 'EMPTY_INPUT',
      });
      await expect(login('   ', 'password123')).rejects.toMatchObject({
        code: 'EMPTY_INPUT',
      });
      await expect(login('user@test.com', '')).rejects.toMatchObject({
        code: 'EMPTY_INPUT',
      });
      await expect(login('user@test.com', '   ')).rejects.toMatchObject({
        code: 'EMPTY_INPUT',
      });
    });

    it('melempar INVALID_CREDENTIALS jika Supabase auth gagal atau user tidak ada', async () => {
      mockSignInWithPassword.mockResolvedValueOnce({
        data: { user: null },
        error: new Error('Invalid login credentials'),
      });

      await expect(login('user@test.com', 'wrongpass')).rejects.toMatchObject({
        code: 'INVALID_CREDENTIALS',
        message: 'Kredensial tidak valid',
      });
    });

    it('melempar ACCOUNT_SUSPENDED dan melakukan signOut jika akun ditangguhkan', async () => {
      mockSignInWithPassword.mockResolvedValueOnce({
        data: { user: { id: 'user-suspended', email: 'banned@test.com' } },
        error: null,
      });

      // Mock profil pengguna dari tabel 'pengguna'
      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            maybeSingle: vi.fn().mockResolvedValueOnce({
              data: {
                id: 'user-suspended',
                nama: 'User Banned',
                email: 'banned@test.com',
                role: 'USER',
                status_akun: false,
                sanksi: 'SUSPENDED',
                penyedia_jasa: [],
                pengguna_jasa: [],
              },
              error: null,
            }),
          }),
        }),
      });

      await expect(login('banned@test.com', 'validpass123')).rejects.toMatchObject({
        code: 'ACCOUNT_SUSPENDED',
        message: 'Akun Anda ditangguhkan',
      });
      expect(mockSignOut).toHaveBeenCalled();
    });

    it('berhasil login, mengupdate status_online = true, dan mengembalikan data profil', async () => {
      mockSignInWithPassword.mockResolvedValueOnce({
        data: { user: { id: 'user-1', email: 'aktif@test.com' } },
        error: null,
      });

      // Profil aktif
      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            maybeSingle: vi.fn().mockResolvedValueOnce({
              data: {
                id: 'user-1',
                nama: 'Pengguna Aktif',
                email: 'aktif@test.com',
                role: 'PENYEDIA_JASA',
                status_akun: true,
                sanksi: null,
              },
              error: null,
            }),
          }),
        }),
      });

      // Update status online
      const mockUpdate = vi.fn().mockReturnValueOnce({
        eq: vi.fn().mockResolvedValueOnce({ error: null }),
      });
      mockFrom.mockReturnValueOnce({ update: mockUpdate });

      const result = await login('Aktif@Test.com', 'password123');

      expect(result.user).toEqual({
        id: 'user-1',
        email: 'aktif@test.com',
        nama: 'Pengguna Aktif',
        role: 'PENYEDIA_JASA',
        isPenyediaJasa: true,
        isPenggunaJasa: false,
      });
      expect(mockUpdate).toHaveBeenCalledWith({ status_online: true });
    });
  });

  describe('auth.service - logout', () => {
    it('mengubah status_online = false jika ada user login dan memanggil signOut', async () => {
      mockGetUser.mockResolvedValueOnce({
        data: { user: { id: 'user-1' } },
        error: null,
      });

      const mockUpdate = vi.fn().mockReturnValueOnce({
        eq: vi.fn().mockResolvedValueOnce({ error: null }),
      });
      mockFrom.mockReturnValueOnce({ update: mockUpdate });
      mockSignOut.mockResolvedValueOnce({ error: null });

      await logout();

      expect(mockUpdate).toHaveBeenCalledWith({ status_online: false });
      expect(mockSignOut).toHaveBeenCalled();
    });

    it('melempar LOGOUT_FAILED jika signOut Supabase menghasilkan error', async () => {
      mockGetUser.mockResolvedValueOnce({
        data: { user: null },
        error: null,
      });
      mockSignOut.mockResolvedValueOnce({ error: new Error('Network error') });

      await expect(logout()).rejects.toMatchObject({
        code: 'LOGOUT_FAILED',
        message: 'Gagal keluar dari akun',
      });
    });
  });

  describe('auth.service - getSessionUser', () => {
    it('mengembalikan null jika tidak ada sesi user di Supabase', async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: null }, error: new Error('No session') });

      const session = await getSessionUser();
      expect(session).toBeNull();
    });

    it('mengembalikan profil terautentikasi lengkap saat sesi valid', async () => {
      mockGetUser.mockResolvedValueOnce({
        data: { user: { id: 'u-1', email: 'session@test.com' } },
        error: null,
      });

      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            maybeSingle: vi.fn().mockResolvedValueOnce({
              data: {
                id: 'u-1',
                nama: 'Session User',
                email: 'session@test.com',
                role: 'PENGGUNA_JASA',
                status_akun: true,
                sanksi: null,
              },
              error: null,
            }),
          }),
        }),
      });

      const session = await getSessionUser();
      expect(session).toEqual({
        id: 'u-1',
        email: 'session@test.com',
        nama: 'Session User',
        role: 'PENGGUNA_JASA',
        status_akun: true,
        isPenyediaJasa: false,
        isPenggunaJasa: true,
      });
    });
  });

  describe('Route POST & GET /api/auth', () => {
    const postJson = (body: unknown) =>
      new NextRequest('http://localhost:3000/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: typeof body === 'string' ? body : JSON.stringify(body),
      });

    it('mengembalikan 400 jika body request rusak (bukan format JSON)', async () => {
      const req = postJson('{"broken_json":');
      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.message).toContain('Body tidak valid');
    });

    it('mengembalikan 400 jika body bukan objek JSON (misal array)', async () => {
      const req = postJson([1, 2, 3]);
      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.message).toContain('Body harus berupa objek JSON');
    });

    it('mengembalikan 400 jika action tidak dikenal', async () => {
      const req = postJson({ action: 'unknown_action' });
      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.message).toBe('Action tidak dikenal');
    });

    it('POST action=login mengembalikan 400 jika email atau password bukan string', async () => {
      const req = postJson({ action: 'login', email: 123, password: null });
      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.message).toContain('Email dan password harus berupa teks');
    });

    it('POST action=login mengembalikan 401 saat kredensial salah', async () => {
      vi.spyOn(AuthService, 'login').mockRejectedValueOnce(
        new AuthError('INVALID_CREDENTIALS', 'Kredensial tidak valid')
      );

      const req = postJson({ action: 'login', email: 'user@test.com', password: 'wrong' });
      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(401);
      expect(json.success).toBe(false);
      expect(json.code).toBe('INVALID_CREDENTIALS');
    });

    it('POST action=login mengembalikan 200 saat login berhasil', async () => {
      vi.spyOn(AuthService, 'login').mockResolvedValueOnce({
        user: {
          id: 'u-1',
          email: 'user@test.com',
          nama: 'User',
          role: 'USER',
          isPenyediaJasa: true,
          isPenggunaJasa: true,
        },
      });

      const req = postJson({ action: 'login', email: 'user@test.com', password: 'password123' });
      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.message).toBe('login berhasil');
      expect(json.result.user.id).toBe('u-1');
    });

    it('POST action=logout mengembalikan 200 saat logout berhasil', async () => {
      vi.spyOn(AuthService, 'logout').mockResolvedValueOnce();

      const req = postJson({ action: 'logout' });
      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.message).toBe('Logout berhasil');
    });

    it('GET /api/auth mengembalikan 401 jika pengguna belum login', async () => {
      vi.spyOn(AuthService, 'getSessionUser').mockResolvedValueOnce(null);

      const res = await GET();
      const json = await res.json();

      expect(res.status).toBe(401);
      expect(json.success).toBe(false);
      expect(json.message).toBe('Tidak terautentikasi');
    });

    it('GET /api/auth mengembalikan 200 dengan data user saat terautentikasi', async () => {
      vi.spyOn(AuthService, 'getSessionUser').mockResolvedValueOnce({
        id: 'u-1',
        email: 'user@test.com',
        nama: 'User Aktif',
        role: 'USER',
        status_akun: true,
        isPenyediaJasa: true,
        isPenggunaJasa: false,
      });

      const res = await GET();
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.user.nama).toBe('User Aktif');
    });
  });
});
