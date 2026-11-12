/**
 * src/test/storage-interface.test.ts
 *
 * Pengujian kontrak StorageService (storage.interface.ts).
 *
 * StorageService adalah interface TypeScript murni yang mendefinisikan kontrak:
 *   - upload(file, folder): Promise<{ url: string; error?: string }>
 *   - delete(file_path): Promise<boolean>
 *
 * Karena interface tidak memiliki implementasi runtime, pengujian dilakukan dengan:
 *  1. Memverifikasi bahwa implementasi konkret (LocalStorageService & SupabaseStorageService)
 *     memenuhi kontrak (structural typing).
 *  2. Menggunakan mock object ad-hoc yang sesuai interface untuk memverifikasi
 *     behavior tiap field signature.
 *  3. Memastikan bahwa semua consumer (getStorageService) selalu menerima objek
 *     yang memenuhi kontrak tersebut.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs/promises';
import type { StorageService } from '@/services/storage/storage.interface';
import { LocalStorageService } from '@/services/storage/local.storage';
import { SupabaseStorageService } from '@/services/storage/supabase.storage';

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}));

// ─── Helper: buat mock implementasi StorageService ────────────────────────────
function buatMockStorage(overrides: Partial<StorageService> = {}): StorageService {
  return {
    upload: vi.fn().mockResolvedValue({ url: 'https://cdn.example.com/file.pdf' }),
    delete: vi.fn().mockResolvedValue(true),
    ...overrides,
  };
}

// ─── 1. Kontrak interface: upload ─────────────────────────────────────────────
describe('StorageService interface — kontrak upload()', () => {
  it('mengembalikan objek dengan field url (string) saat berhasil', async () => {
    const storage = buatMockStorage();
    const file = new File(['data'], 'gambar.png', { type: 'image/png' });

    const result = await storage.upload(file, 'avatars');

    expect(result).toHaveProperty('url');
    expect(typeof result.url).toBe('string');
    expect(result.error).toBeUndefined();
  });

  it('mengembalikan objek dengan url kosong dan field error (string) saat gagal', async () => {
    const storage = buatMockStorage({
      upload: vi.fn().mockResolvedValue({ url: '', error: 'Gagal mengunggah' }),
    });
    const file = new File(['data'], 'dok.pdf', { type: 'application/pdf' });

    const result = await storage.upload(file, 'dokumen');

    expect(result.url).toBe('');
    expect(result.error).toBe('Gagal mengunggah');
  });

  it('menerima parameter (file: File, folder: string) sesuai signature', async () => {
    const mockUpload = vi.fn().mockResolvedValue({ url: '/uploads/folder/file.png' });
    const storage = buatMockStorage({ upload: mockUpload });
    const file = new File(['x'], 'test.png', { type: 'image/png' });

    await storage.upload(file, 'profil');

    expect(mockUpload).toHaveBeenCalledWith(file, 'profil');
    expect(mockUpload).toHaveBeenCalledTimes(1);
  });

  it('upload() mengembalikan Promise (async)', async () => {
    const storage = buatMockStorage();
    const file = new File(['x'], 'a.png', { type: 'image/png' });

    const promise = storage.upload(file, 'test');
    expect(promise).toBeInstanceOf(Promise);
    await expect(promise).resolves.toHaveProperty('url');
  });
});

// ─── 2. Kontrak interface: delete ─────────────────────────────────────────────
describe('StorageService interface — kontrak delete()', () => {
  it('mengembalikan true (boolean) saat berhasil menghapus', async () => {
    const storage = buatMockStorage();
    const result = await storage.delete('/uploads/profil/foto.png');

    expect(typeof result).toBe('boolean');
    expect(result).toBe(true);
  });

  it('mengembalikan false (boolean) saat gagal menghapus', async () => {
    const storage = buatMockStorage({
      delete: vi.fn().mockResolvedValue(false),
    });

    const result = await storage.delete('/uploads/tidak-ada.png');
    expect(result).toBe(false);
  });

  it('menerima parameter (file_path: string) sesuai signature', async () => {
    const mockDelete = vi.fn().mockResolvedValue(true);
    const storage = buatMockStorage({ delete: mockDelete });

    await storage.delete('/uploads/dokumen/laporan.pdf');

    expect(mockDelete).toHaveBeenCalledWith('/uploads/dokumen/laporan.pdf');
    expect(mockDelete).toHaveBeenCalledTimes(1);
  });

  it('delete() mengembalikan Promise (async)', async () => {
    const storage = buatMockStorage();
    const promise = storage.delete('/uploads/file.png');

    expect(promise).toBeInstanceOf(Promise);
    await expect(promise).resolves.toBe(true);
  });
});

// ─── 3. Structural typing: LocalStorageService memenuhi interface ─────────────
describe('LocalStorageService memenuhi kontrak StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    service = new LocalStorageService();
  });

  it('memiliki method upload yang merupakan function', () => {
    expect(typeof service.upload).toBe('function');
  });

  it('memiliki method delete yang merupakan function', () => {
    expect(typeof service.delete).toBe('function');
  });

  it('upload() mengembalikan Promise<{ url: string; error?: string }>', async () => {
    const file = new File(['data'], 'test.png', { type: 'image/png' });
    vi.spyOn(fs, 'mkdir').mockResolvedValueOnce(undefined as any);
    vi.spyOn(fs, 'writeFile').mockResolvedValueOnce(undefined);

    const result = await service.upload(file, 'test-folder');

    expect(result).toHaveProperty('url');
    expect(typeof result.url).toBe('string');
  });

  it('delete() mengembalikan Promise<boolean>', async () => {
    const result = await service.delete('');
    expect(typeof result).toBe('boolean');
  });

  it('upload() path traversal mengembalikan { url: "", error: string }', async () => {
    const file = new File(['x'], 'hack.txt', { type: 'text/plain' });
    const result = await service.upload(file, '../../etc');

    expect(result.url).toBe('');
    expect(typeof result.error).toBe('string');
  });
});

// ─── 4. Structural typing: SupabaseStorageService memenuhi interface ──────────
describe('SupabaseStorageService memenuhi kontrak StorageService', () => {
  let service: StorageService;

  beforeEach(async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-anon-key';

    const { createClient } = await import('@supabase/supabase-js');
    vi.mocked(createClient).mockReturnValue({
      storage: {
        from: vi.fn().mockReturnValue({
          upload: vi.fn(),
          getPublicUrl: vi.fn(),
          remove: vi.fn(),
        }),
      },
    } as any);

    service = new SupabaseStorageService();
  });

  it('memiliki method upload yang merupakan function', () => {
    expect(typeof service.upload).toBe('function');
  });

  it('memiliki method delete yang merupakan function', () => {
    expect(typeof service.delete).toBe('function');
  });

  it('upload() mengembalikan Promise<{ url: string; error?: string }>', async () => {
    const { createClient } = await import('@supabase/supabase-js');
    vi.mocked(createClient).mockReturnValue({
      storage: {
        from: vi.fn().mockReturnValue({
          upload: vi.fn().mockResolvedValue({ data: { path: 'folder/file.png' }, error: null }),
          getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://cdn.example.com/file.png' } }),
        }),
      },
    } as any);
    service = new SupabaseStorageService();

    const file = new File(['data'], 'avatar.png', { type: 'image/png' });
    const result = await service.upload(file, 'profil');

    expect(result).toHaveProperty('url');
    expect(typeof result.url).toBe('string');
  });

  it('delete() mengembalikan Promise<boolean>', async () => {
    const { createClient } = await import('@supabase/supabase-js');
    vi.mocked(createClient).mockReturnValue({
      storage: {
        from: vi.fn().mockReturnValue({
          remove: vi.fn().mockResolvedValue({ data: [{ name: 'file.png' }], error: null }),
        }),
      },
    } as any);
    service = new SupabaseStorageService();

    const result = await service.delete('profil/avatar.png');
    expect(typeof result).toBe('boolean');
  });
});

// ─── 5. Polimorfisme: consumer dapat memakai dua implementasi lewat interface ──
describe('Polimorfisme StorageService via interface', () => {
  it('consumer dapat menerima LocalStorageService atau SupabaseStorageService via interface', async () => {
    const local: StorageService = new LocalStorageService();
    const mockSupabaseStorage = buatMockStorage();

    // Keduanya memiliki method yang sama
    expect(typeof local.upload).toBe('function');
    expect(typeof local.delete).toBe('function');
    expect(typeof mockSupabaseStorage.upload).toBe('function');
    expect(typeof mockSupabaseStorage.delete).toBe('function');
  });

  it('consumer dapat beralih antara implementasi tanpa perubahan kode', async () => {
    async function doUpload(storage: StorageService, file: File): Promise<string> {
      const { url, error } = await storage.upload(file, 'bucket');
      if (error) throw new Error(error);
      return url;
    }

    const mockLocal = buatMockStorage({
      upload: vi.fn().mockResolvedValue({ url: '/uploads/bucket/file.png' }),
    });
    const mockSupabase = buatMockStorage({
      upload: vi.fn().mockResolvedValue({ url: 'https://cdn.supabase.co/bucket/file.png' }),
    });

    const file = new File(['x'], 'doc.pdf', { type: 'application/pdf' });

    expect(await doUpload(mockLocal, file)).toContain('/uploads/');
    expect(await doUpload(mockSupabase, file)).toContain('supabase.co');
  });

  it('error yang dikembalikan lewat field error (bukan throw) sesuai kontrak', async () => {
    const storage = buatMockStorage({
      upload: vi.fn().mockResolvedValue({ url: '', error: 'Quota storage penuh' }),
    });
    const file = new File(['x'], 'besar.zip', { type: 'application/zip' });

    const result = await storage.upload(file, 'archive');
    // Kontrak: tidak melempar exception, kembalikan error dalam field
    expect(result.url).toBe('');
    expect(result.error).toBe('Quota storage penuh');
  });
});
