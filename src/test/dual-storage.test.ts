import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import path from 'path';
import fs from 'fs/promises';
import { LocalStorageService } from '@/services/storage/local.storage';
import { SupabaseStorageService } from '@/services/storage/supabase.storage';
import { createClient } from '@supabase/supabase-js';

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}));

describe('Dual Storage Adapter (LocalStorageService & SupabaseStorageService)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-anon-key';
  });

  describe('1. LocalStorageService', () => {
    const service = new LocalStorageService();

    it('berhasil mengunggah berkas ke direktori lokal dan mengembalikan URL publik', async () => {
      vi.spyOn(fs, 'mkdir').mockResolvedValueOnce(undefined as any);
      vi.spyOn(fs, 'writeFile').mockResolvedValueOnce(undefined);

      const file = new File(['konten-gambar'], 'avatar profil.png', { type: 'image/png' });
      const res = await service.upload(file, 'avatars');

      expect(res.error).toBeUndefined();
      expect(res.url).toMatch(/^\/uploads\/avatars\/\d+-\d+-avatar_profil\.png$/);
      expect(fs.mkdir).toHaveBeenCalledWith(expect.stringContaining('avatars'), { recursive: true });
      expect(fs.writeFile).toHaveBeenCalled();
    });

    it('menolak upaya path traversal pada folder tujuan saat unggah berkas', async () => {
      const file = new File(['konten'], 'secret.txt', { type: 'text/plain' });
      const res = await service.upload(file, '../../etc');

      expect(res.url).toBe('');
      expect(res.error).toBe('Akses folder tidak valid.');
      expect(fs.writeFile).not.toHaveBeenCalled();
    });

    it('menangani kegagalan penulisan berkas ke disk (misal permission denied)', async () => {
      vi.spyOn(fs, 'mkdir').mockResolvedValueOnce(undefined as any);
      vi.spyOn(fs, 'writeFile').mockRejectedValueOnce(new Error('EACCES: permission denied'));

      const file = new File(['konten'], 'file.pdf', { type: 'application/pdf' });
      const res = await service.upload(file, 'dokumen');

      expect(res.url).toBe('');
      expect(res.error).toContain('permission denied');
    });

    it('berhasil menghapus berkas yang valid dari direktori uploads', async () => {
      vi.spyOn(fs, 'unlink').mockResolvedValueOnce(undefined);

      const success = await service.delete('/uploads/avatars/foto.png');
      expect(success).toBe(true);
      expect(fs.unlink).toHaveBeenCalledWith(expect.stringContaining(path.join('uploads', 'avatars', 'foto.png')));
    });

    it('menolak penghapusan berkas dengan path kosong', async () => {
      const success = await service.delete('');
      expect(success).toBe(false);
      expect(fs.unlink).not.toHaveBeenCalled();
    });

    it('mencegah penghapusan berkas di luar folder uploads (anti path-traversal)', async () => {
      const success = await service.delete('/uploads/../../package.json');
      expect(success).toBe(false);
      expect(fs.unlink).not.toHaveBeenCalled();
    });

    it('mengembalikan false jika unlink gagal (misal berkas tidak ditemukan)', async () => {
      vi.spyOn(fs, 'unlink').mockRejectedValueOnce(new Error('ENOENT: no such file or directory'));

      const success = await service.delete('/uploads/avatars/tidak-ada.png');
      expect(success).toBe(false);
    });
  });

  describe('2. SupabaseStorageService', () => {
    const mockUpload = vi.fn();
    const mockGetPublicUrl = vi.fn();
    const mockRemove = vi.fn();

    const mockStorageClient = {
      from: vi.fn(() => ({
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl,
        remove: mockRemove,
      })),
    };

    beforeEach(() => {
      vi.mocked(createClient).mockReturnValue({
        storage: mockStorageClient,
      } as any);
    });

    it('berhasil mengunggah berkas ke Supabase Bucket dan mengembalikan public URL', async () => {
      const service = new SupabaseStorageService();

      mockUpload.mockResolvedValueOnce({
        data: { path: 'jasa/12345-cover.png' },
        error: null,
      });
      mockGetPublicUrl.mockReturnValueOnce({
        data: { publicUrl: 'https://mock.supabase.co/storage/v1/object/public/public/jasa/12345-cover.png' },
      });

      const file = new File(['gambar'], 'cover.png', { type: 'image/png' });
      const res = await service.upload(file, 'jasa');

      expect(res.error).toBeUndefined();
      expect(res.url).toContain('https://mock.supabase.co/storage/v1/object/public/public/jasa/12345-cover.png');
      expect(mockUpload).toHaveBeenCalledWith(
        expect.stringMatching(/^jasa\/\d+-\d+-cover\.png$/),
        expect.any(Buffer),
        { contentType: 'image/png', upsert: false }
      );
    });

    it('mengembalikan pesan error jika Supabase storage upload gagal', async () => {
      const service = new SupabaseStorageService();

      mockUpload.mockResolvedValueOnce({
        data: null,
        error: { message: 'The resource already exists' },
      });

      const file = new File(['gambar'], 'duplicate.png', { type: 'image/png' });
      const res = await service.upload(file, 'jasa');

      expect(res.url).toBe('');
      expect(res.error).toBe('The resource already exists');
    });

    it('berhasil menghapus berkas menggunakan path relatif', async () => {
      const service = new SupabaseStorageService();

      mockRemove.mockResolvedValueOnce({
        data: [{ name: 'file.png' }],
        error: null,
      });

      const success = await service.delete('jasa/12345-file.png');
      expect(success).toBe(true);
      expect(mockRemove).toHaveBeenCalledWith(['jasa/12345-file.png']);
    });

    it('berhasil mengekstrak path relatif dari full URL publik Supabase lalu menghapusnya', async () => {
      const service = new SupabaseStorageService();

      mockRemove.mockResolvedValueOnce({
        data: [{ name: 'dokumen.pdf' }],
        error: null,
      });

      const fullUrl = 'https://mock.supabase.co/storage/v1/object/public/public/deliverables/hasil.pdf';
      const success = await service.delete(fullUrl);

      expect(success).toBe(true);
      expect(mockRemove).toHaveBeenCalledWith(['deliverables/hasil.pdf']);
    });

    it('mengembalikan false jika URL tidak memiliki prefix bucket yang sesuai', async () => {
      const service = new SupabaseStorageService();

      const foreignUrl = 'https://other-cloud.com/assets/logo.png';
      const success = await service.delete(foreignUrl);

      expect(success).toBe(false);
      expect(mockRemove).not.toHaveBeenCalled();
    });

    it('mengembalikan false jika fungsi remove Supabase menghasilkan galat', async () => {
      const service = new SupabaseStorageService();

      mockRemove.mockResolvedValueOnce({
        data: null,
        error: new Error('Database permission error'),
      });

      const success = await service.delete('jasa/berkas.pdf');
      expect(success).toBe(false);
    });
  });

  describe('3. Storage Factory (getStorageService)', () => {
    it('mengembalikan implementasi yang sesuai dan konsisten sesuai driver', async () => {
      // Inisialisasi LocalStorageService
      const local = new LocalStorageService();
      expect(local).toBeInstanceOf(LocalStorageService);

      // Inisialisasi SupabaseStorageService
      const supabaseService = new SupabaseStorageService();
      expect(supabaseService).toBeInstanceOf(SupabaseStorageService);
    });

    it('mengembalikan LocalStorageService jika STORAGE_DRIVER=local (line 13–14)', async () => {
      // Reset singleton via dynamic import trick
      vi.resetModules();
      process.env.STORAGE_DRIVER = 'local';

      const { getStorageService } = await import('@/services/storage/index');
      const service = getStorageService();
      expect(service.constructor.name).toBe('LocalStorageService');

      delete process.env.STORAGE_DRIVER;
    });

    it('mengembalikan SupabaseStorageService jika STORAGE_DRIVER=supabase (default, line 15–17)', async () => {
      vi.resetModules();
      process.env.STORAGE_DRIVER = 'supabase';
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-key';

      const { getStorageService } = await import('@/services/storage/index');
      const service = getStorageService();
      expect(service.constructor.name).toBe('SupabaseStorageService');

      delete process.env.STORAGE_DRIVER;
    });

    it('mengembalikan instance yang sama (singleton) pada pemanggilan berulang (line 8–18)', async () => {
      vi.resetModules();
      process.env.STORAGE_DRIVER = 'local';

      const { getStorageService } = await import('@/services/storage/index');
      const s1 = getStorageService();
      const s2 = getStorageService();
      expect(s1).toBe(s2);

      delete process.env.STORAGE_DRIVER;
    });

    it('mengembalikan SupabaseStorageService jika env STORAGE_DRIVER tidak diset (default, line 10)', async () => {
      vi.resetModules();
      delete process.env.STORAGE_DRIVER;
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-key';

      const { getStorageService } = await import('@/services/storage/index');
      const service = getStorageService();
      expect(service.constructor.name).toBe('SupabaseStorageService');
    });
  });
});
