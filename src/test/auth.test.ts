import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  validasiInputRegistrasi,
  MIN_PANJANG_PASSWORD,
  hasRelation,
  registrasi,
  login,
  loginAdmin,
  getSessionUser,
  type InputRegistrasi,
} from '../services/auth.service';

// ─── Mock modul luar ──────────────────────────────────────────────────────────
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}));

import { createClient as createServerClient } from '@/lib/supabase/server';
import { createClient as createAdminClientMock } from '@supabase/supabase-js';

// ─── Data helper ──────────────────────────────────────────────────────────────
const inputValid: InputRegistrasi = {
  nama: 'Budi Santoso',
  email: 'budi@example.com',
  password: 'password123',
  role: 'pengguna_jasa',
};

// ─── 1. validasiInputRegistrasi ───────────────────────────────────────────────
describe('validasiInputRegistrasi (AC-2: Validasi Input)', () => {
  it('menerima input yang valid tanpa melempar error', () => {
    expect(() => validasiInputRegistrasi(inputValid)).not.toThrow();
    expect(() => validasiInputRegistrasi({ ...inputValid, role: 'penyedia_jasa' })).not.toThrow();
  });

  it('menolak nama kosong atau hanya spasi', () => {
    expect(() => validasiInputRegistrasi({ ...inputValid, nama: '' })).toThrow('Nama');
    expect(() => validasiInputRegistrasi({ ...inputValid, nama: '   ' })).toThrow('Nama');
  });

  it('menolak email kosong', () => {
    expect(() => validasiInputRegistrasi({ ...inputValid, email: '' })).toThrow('Email');
  });

  it('menolak format email tidak valid', () => {
    expect(() => validasiInputRegistrasi({ ...inputValid, email: 'bukan-email' })).toThrow('Format email');
    expect(() => validasiInputRegistrasi({ ...inputValid, email: 'a@b' })).toThrow('Format email');
    expect(() => validasiInputRegistrasi({ ...inputValid, email: '@domain.com' })).toThrow('Format email');
  });

  it('menolak password kurang dari panjang minimum', () => {
    const pendek = 'x'.repeat(MIN_PANJANG_PASSWORD - 1);
    expect(() => validasiInputRegistrasi({ ...inputValid, password: pendek })).toThrow(
      `${MIN_PANJANG_PASSWORD} karakter`
    );
  });

  it('menerima password tepat di batas minimum', () => {
    const pas = 'x'.repeat(MIN_PANJANG_PASSWORD);
    expect(() => validasiInputRegistrasi({ ...inputValid, password: pas })).not.toThrow();
  });

  it('menolak role yang tidak dikenal', () => {
    expect(() =>
      validasiInputRegistrasi({ ...inputValid, role: 'admin' as never })
    ).toThrow('Role');
  });
});

// ─── 2. hasRelation ───────────────────────────────────────────────────────────
describe('hasRelation', () => {
  it('mengembalikan false untuk falsy value', () => {
    expect(hasRelation(null)).toBe(false);
    expect(hasRelation(undefined)).toBe(false);
    expect(hasRelation(false)).toBe(false);
    expect(hasRelation(0)).toBe(false);
  });

  it('mengembalikan false untuk array kosong', () => {
    expect(hasRelation([])).toBe(false);
  });

  it('mengembalikan true untuk array berisi elemen', () => {
    expect(hasRelation([{ id: '1' }])).toBe(true);
  });

  it('mengembalikan false untuk object kosong', () => {
    expect(hasRelation({})).toBe(false);
  });

  it('mengembalikan true untuk object berisi key', () => {
    expect(hasRelation({ id: '1' })).toBe(true);
  });
});

// ─── 3. registrasi ────────────────────────────────────────────────────────────
describe('registrasi', () => {
  const mockCreateUser = vi.fn();
  const mockDeleteUser = vi.fn();
  const mockAdminFrom = vi.fn();

  const mockAdminClient = {
    auth: {
      admin: {
        createUser: mockCreateUser,
        deleteUser: mockDeleteUser,
      },
    },
    from: mockAdminFrom,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateUser.mockReset();
    mockDeleteUser.mockReset().mockResolvedValue({});
    mockAdminFrom.mockReset();

    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-anon-key';
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    vi.mocked(createAdminClientMock).mockReturnValue(mockAdminClient as any);
  });

  afterEach(() => {
  });

  it('berhasil mendaftarkan pengguna baru dengan role pengguna_jasa (line 185)', async () => {
    mockCreateUser.mockResolvedValueOnce({
      data: { user: { id: 'uid-123' } },
      error: null,
    });

    const mockInsert = vi.fn().mockResolvedValueOnce({ error: null }); // insert pengguna
    const mockInsertTurunan = vi.fn().mockResolvedValueOnce({ error: null }); // insert pengguna_jasa

    mockAdminFrom
      .mockReturnValueOnce({ insert: mockInsert })
      .mockReturnValueOnce({ insert: mockInsertTurunan });

    const result = await registrasi(inputValid);

    expect(result.id).toBe('uid-123');
    expect(result.email).toBe('budi@example.com');
    expect(result.nama).toBe('Budi Santoso');
    expect(result.role).toBe('PENGGUNA_JASA');
  });

  it('berhasil mendaftarkan pengguna baru dengan role penyedia_jasa (line 185)', async () => {
    mockCreateUser.mockResolvedValueOnce({
      data: { user: { id: 'uid-456' } },
      error: null,
    });

    const mockInsert = vi.fn().mockResolvedValueOnce({ error: null });
    const mockInsertTurunan = vi.fn().mockResolvedValueOnce({ error: null });

    mockAdminFrom
      .mockReturnValueOnce({ insert: mockInsert })
      .mockReturnValueOnce({ insert: mockInsertTurunan });

    const result = await registrasi({ ...inputValid, role: 'penyedia_jasa' });

    expect(result.role).toBe('PENYEDIA_JASA');
  });

  it('melempar EMAIL_TAKEN jika email sudah terdaftar (line 153)', async () => {
    mockCreateUser.mockResolvedValueOnce({
      data: null,
      error: { message: 'User already registered' },
    });

    await expect(registrasi(inputValid)).rejects.toMatchObject({
      code: 'EMAIL_TAKEN',
    });
  });

  it('melempar INTERNAL_ERROR jika createUser gagal tanpa pesan email (line 155)', async () => {
    mockCreateUser.mockResolvedValueOnce({
      data: null,
      error: { message: 'Server timeout' },
    });

    await expect(registrasi(inputValid)).rejects.toMatchObject({
      code: 'INTERNAL_ERROR',
    });
  });

  it('rollback deleteUser & melempar INTERNAL_ERROR jika insert profil gagal (line 170–172)', async () => {
    mockCreateUser.mockResolvedValueOnce({
      data: { user: { id: 'uid-789' } },
      error: null,
    });

    // Insert pengguna gagal
    mockAdminFrom.mockReturnValueOnce({
      insert: vi.fn().mockResolvedValueOnce({ error: { message: 'DB error' } }),
    });

    await expect(registrasi(inputValid)).rejects.toMatchObject({
      code: 'INTERNAL_ERROR',
      message: expect.stringContaining('profil pengguna'),
    });

    expect(mockDeleteUser).toHaveBeenCalledWith('uid-789');
  });

  it('rollback deleteUser+profil & melempar INTERNAL_ERROR jika insert tabel turunan gagal (line 178–182)', async () => {
    mockCreateUser.mockResolvedValueOnce({
      data: { user: { id: 'uid-aaa' } },
      error: null,
    });

    const mockDelete = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({}),
    });

    // insert pengguna sukses, insert turunan gagal
    mockAdminFrom
      .mockReturnValueOnce({ insert: vi.fn().mockResolvedValueOnce({ error: null }) })
      .mockReturnValueOnce({ insert: vi.fn().mockResolvedValueOnce({ error: { message: 'FK violation' } }) })
      .mockReturnValueOnce({ delete: mockDelete }); // rollback delete pengguna

    await expect(registrasi(inputValid)).rejects.toMatchObject({
      code: 'INTERNAL_ERROR',
      message: expect.stringContaining('peran pengguna'),
    });
    expect(mockDeleteUser).toHaveBeenCalledWith('uid-aaa');
  });
});

// ─── 4. getSessionUser ────────────────────────────────────────────────────────
describe('getSessionUser', () => {
  let mockSupabase: any;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-anon-key';

    mockSupabase = {
      auth: {
        getUser: vi.fn(),
        signOut: vi.fn().mockResolvedValue({}),
      },
      from: vi.fn(),
    };
    vi.mocked(createServerClient).mockResolvedValue(mockSupabase as any);
  });

  it('mengembalikan null jika error atau user tidak ada (line 241)', async () => {
    mockSupabase.auth.getUser.mockResolvedValueOnce({ data: { user: null }, error: new Error('No session') });

    const result = await getSessionUser();
    expect(result).toBeNull();
  });

  it('mengembalikan null jika getValidProfil melempar error (line 255–257)', async () => {
    mockSupabase.auth.getUser.mockResolvedValueOnce({ data: { user: { id: 'uid-1' } }, error: null });

    // Profil query error → getValidProfil throws → catch returns null
    mockSupabase.from.mockReturnValueOnce({
      select: vi.fn().mockReturnValueOnce({
        eq: vi.fn().mockReturnValueOnce({
          maybeSingle: vi.fn().mockResolvedValueOnce({ data: null, error: { message: 'DB error' } }),
        }),
      }),
    });

    const result = await getSessionUser();
    expect(result).toBeNull();
  });

  it('mengembalikan null jika profil null setelah query (line 122–123 getValidProfil)', async () => {
    mockSupabase.auth.getUser.mockResolvedValueOnce({ data: { user: { id: 'uid-2' } }, error: null });

    // getValidProfil: profilError=null tapi profil=null → PROFILE_NOT_FOUND
    mockSupabase.from.mockReturnValueOnce({
      select: vi.fn().mockReturnValueOnce({
        eq: vi.fn().mockReturnValueOnce({
          maybeSingle: vi.fn().mockResolvedValueOnce({ data: null, error: null }),
        }),
      }),
    });

    // signOut dipanggil dalam getValidProfil
    const result = await getSessionUser();
    expect(result).toBeNull();
    expect(mockSupabase.auth.signOut).toHaveBeenCalled();
  });

  it('mengembalikan data sesi jika profil valid (line 246–254)', async () => {
    mockSupabase.auth.getUser.mockResolvedValueOnce({ data: { user: { id: 'uid-3' } }, error: null });

    const mockProfil = {
      id: 'uid-3',
      nama: 'Citra',
      email: 'citra@example.com',
      role: 'PENGGUNA_JASA',
      status_akun: true,
      sanksi: null,
      penyedia_jasa: null,
      pengguna_jasa: { id: 'pj-1' },
    };

    mockSupabase.from.mockReturnValueOnce({
      select: vi.fn().mockReturnValueOnce({
        eq: vi.fn().mockReturnValueOnce({
          maybeSingle: vi.fn().mockResolvedValueOnce({ data: mockProfil, error: null }),
        }),
      }),
    });

    const result = await getSessionUser();
    expect(result).not.toBeNull();
    expect(result?.id).toBe('uid-3');
    expect(result?.isPenggunaJasa).toBe(true);
    expect(result?.isPenyediaJasa).toBe(false);
  });
});

// ─── 5. loginAdmin ────────────────────────────────────────────────────────────
describe('loginAdmin', () => {
  let mockSupabase: any;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-anon-key';

    mockSupabase = {
      auth: {
        signInWithPassword: vi.fn(),
        signOut: vi.fn().mockResolvedValue({}),
        getUser: vi.fn(),
      },
      from: vi.fn(),
    };
    vi.mocked(createServerClient).mockResolvedValue(mockSupabase as any);
  });

  const makeMockProfilQuery = (mockSupabase: any, profil: any) => {
    mockSupabase.from.mockReturnValueOnce({
      select: vi.fn().mockReturnValueOnce({
        eq: vi.fn().mockReturnValueOnce({
          maybeSingle: vi.fn().mockResolvedValueOnce({ data: profil, error: null }),
        }),
      }),
    });
    // update status_online
    mockSupabase.from.mockReturnValueOnce({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({}),
      }),
    });
  };

  it('melempar FORBIDDEN dan sign out jika role bukan ADMIN (line 264–268)', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: { id: 'uid-user', email: 'user@example.com' } },
      error: null,
    });

    makeMockProfilQuery(mockSupabase, {
      id: 'uid-user',
      nama: 'Biasa',
      email: 'user@example.com',
      role: 'PENGGUNA_JASA',
      status_akun: true,
      sanksi: null,
      penyedia_jasa: null,
      pengguna_jasa: { id: 'pj-1' },
    });

    // update status_online false setelah FORBIDDEN
    mockSupabase.from.mockReturnValueOnce({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({}),
      }),
    });

    await expect(loginAdmin('user@example.com', 'password123')).rejects.toMatchObject({
      code: 'FORBIDDEN',
    });
    expect(mockSupabase.auth.signOut).toHaveBeenCalled();
  });

  it('mengembalikan hasil login jika role ADMIN (line 271)', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: { id: 'uid-admin', email: 'admin@example.com' } },
      error: null,
    });

    makeMockProfilQuery(mockSupabase, {
      id: 'uid-admin',
      nama: 'Admin',
      email: 'admin@example.com',
      role: 'ADMIN',
      status_akun: true,
      sanksi: null,
      penyedia_jasa: null,
      pengguna_jasa: null,
    });

    const result = await loginAdmin('admin@example.com', 'password123');
    expect(result.user.role).toBe('ADMIN');
  });
});
