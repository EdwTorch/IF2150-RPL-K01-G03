import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import {
  validasiFolder,
  validasiBerkasUpload,
  FOLDER_DIIZINKAN,
  MAKS_UKURAN_UPLOAD,
  type FolderUpload,
} from '@/lib/upload.config';
import { POST } from '@/app/api/upload/route';
import * as AuthService from '@/services/auth.service';
import * as StorageModule from '@/services/storage';

describe('Upload Gateway (/api/upload & upload.config)', () => {
  const mockStorageUpload = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(StorageModule, 'getStorageService').mockReturnValue({
      upload: mockStorageUpload,
      delete: vi.fn(),
    });
  });

  describe('validasiFolder (Pencegahan Path Traversal)', () => {
    it('mengizinkan seluruh folder yang terdaftar pada FOLDER_DIIZINKAN', () => {
      for (const folder of FOLDER_DIIZINKAN) {
        expect(validasiFolder(folder)).toBe(true);
      }
    });

    it('menolak folder yang tidak terdaftar atau upaya path traversal', () => {
      const invalidFolders = ['../admin', 'root', 'etc/passwd', 'deliverables', '', ' '];
      for (const f of invalidFolders) {
        expect(validasiFolder(f)).toBe(false);
      }
    });
  });

  describe('validasiBerkasUpload (Ukuran, Ekstensi & MIME Type)', () => {
    it('menolak berkas yang melebihi batas MAKS_UKURAN_UPLOAD (10 MB)', () => {
      const largeFile = new File(['x'.repeat(100)], 'gambar.png', { type: 'image/png' });
      Object.defineProperty(largeFile, 'size', { value: MAKS_UKURAN_UPLOAD + 1 });

      const err = validasiBerkasUpload(largeFile, 'jasa');
      expect(err).toBe('Ukuran berkas gambar.png melebihi 10 MB.');
    });

    it('menolak ekstensi yang tidak diizinkan pada folder tujuan', () => {
      const exeFile = new File(['konten'], 'malware.exe', { type: 'image/png' });
      const err = validasiBerkasUpload(exeFile, 'jasa');
      expect(err).toContain('Format ekstensi berkas malware.exe tidak diizinkan');
    });

    it('menolak file video (.mp4) pada folder chat dan revisi', () => {
      const videoFile = new File(['video'], 'rekaman.mp4', { type: 'video/mp4' });
      expect(validasiBerkasUpload(videoFile, 'chat')).toContain('Format ekstensi berkas rekaman.mp4 tidak diizinkan');
      expect(validasiBerkasUpload(videoFile, 'revisi')).toContain('Format ekstensi berkas rekaman.mp4 tidak diizinkan');
    });

    it('mengizinkan file video (.mp4) pada folder jasa dan portofolio', () => {
      const videoFile = new File(['video'], 'demo.mp4', { type: 'video/mp4' });
      expect(validasiBerkasUpload(videoFile, 'jasa')).toBeNull();
      expect(validasiBerkasUpload(videoFile, 'portofolio')).toBeNull();
    });

    it('menolak tipe MIME yang tidak valid dengan fallback jika file.type kosong', () => {
      const untypedFile = new File(['teks'], 'dokumen.pdf', { type: '' });
      const err = validasiBerkasUpload(untypedFile, 'jasa');
      expect(err).toBe('Tipe berkas tidak diketahui tidak diizinkan untuk folder jasa.');
    });

    it('mengembalikan null jika berkas dan formatnya valid', () => {
      const validFiles: { name: string; type: string; folder: FolderUpload }[] = [
        { name: 'cover.jpg', type: 'image/jpeg', folder: 'jasa' },
        { name: 'screenshot.png', type: 'image/png', folder: 'chat' },
        { name: 'lampiran.pdf', type: 'application/pdf', folder: 'revisi' },
        { name: 'karya.webp', type: 'image/webp', folder: 'portofolio' },
      ];

      for (const item of validFiles) {
        const file = new File(['content'], item.name, { type: item.type });
        expect(validasiBerkasUpload(file, item.folder)).toBeNull();
      }
    });
  });

  describe('Route POST /api/upload', () => {
    it('mengembalikan 401 jika pengguna belum login', async () => {
      vi.spyOn(AuthService, 'getSessionUser').mockResolvedValueOnce(null);

      const req = new NextRequest('http://localhost:3000/api/upload', { method: 'POST' });
      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(401);
      expect(json.success).toBe(false);
      expect(json.message).toBe('Tidak terautentikasi');
    });

    it('mengembalikan 400 jika body request bukan multipart/form-data', async () => {
      vi.spyOn(AuthService, 'getSessionUser').mockResolvedValueOnce({
        id: 'user-1',
        email: 'user@test.com',
        nama: 'User',
        role: 'USER',
        status_akun: true,
        isPenyediaJasa: true,
        isPenggunaJasa: true,
      });

      const req = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder: 'jasa' }),
      });
      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.message).toContain('multipart/form-data');
    });

    it('mengembalikan 400 jika folder tujuan tidak sah atau path traversal', async () => {
      vi.spyOn(AuthService, 'getSessionUser').mockResolvedValueOnce({
        id: 'user-1',
        email: 'user@test.com',
        nama: 'User',
        role: 'USER',
        status_akun: true,
        isPenyediaJasa: true,
        isPenggunaJasa: true,
      });

      const form = new FormData();
      form.append('folder', '../injeksi');
      form.append('berkas', new File(['a'], 'logo.png', { type: 'image/png' }));

      const req = new NextRequest('http://localhost:3000/api/upload', { method: 'POST', body: form });
      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.message).toContain('Folder tidak valid. Pilihan:');
      for (const f of FOLDER_DIIZINKAN) {
        expect(json.message).toContain(f);
      }
    });

    it('mengembalikan 400 jika field berkas tidak ada atau ukuran 0', async () => {
      vi.spyOn(AuthService, 'getSessionUser').mockResolvedValueOnce({
        id: 'user-1',
        email: 'user@test.com',
        nama: 'User',
        role: 'USER',
        status_akun: true,
        isPenyediaJasa: true,
        isPenggunaJasa: true,
      });

      const form = new FormData();
      form.append('folder', 'jasa');
      form.append('berkas', new File([], 'kosong.png', { type: 'image/png' }));

      const req = new NextRequest('http://localhost:3000/api/upload', { method: 'POST', body: form });
      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.message).toContain('Berkas tidak ditemukan atau kosong');
    });

    it('mengembalikan 400 jika berkas melanggar aturan validasi ekstensi/tipe', async () => {
      vi.spyOn(AuthService, 'getSessionUser').mockResolvedValueOnce({
        id: 'user-1',
        email: 'user@test.com',
        nama: 'User',
        role: 'USER',
        status_akun: true,
        isPenyediaJasa: true,
        isPenggunaJasa: true,
      });

      const form = new FormData();
      form.append('folder', 'chat');
      form.append('berkas', new File(['malicious'], 'script.exe', { type: 'application/x-msdownload' }));

      const req = new NextRequest('http://localhost:3000/api/upload', { method: 'POST', body: form });
      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.message).toContain('Format ekstensi berkas');
    });

    it('mengembalikan 500 dengan pesan generik aman jika storage driver mengalami kegagalan', async () => {
      vi.spyOn(AuthService, 'getSessionUser').mockResolvedValueOnce({
        id: 'user-1',
        email: 'user@test.com',
        nama: 'User',
        role: 'USER',
        status_akun: true,
        isPenyediaJasa: true,
        isPenggunaJasa: true,
      });

      mockStorageUpload.mockResolvedValueOnce({
        url: '',
        error: 'Supabase secret bucket authentication failure: /root/key',
      });

      const form = new FormData();
      form.append('folder', 'jasa');
      form.append('berkas', new File(['img'], 'gambar.png', { type: 'image/png' }));

      const req = new NextRequest('http://localhost:3000/api/upload', { method: 'POST', body: form });
      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.success).toBe(false);
      // Pesan internal tidak boleh bocor ke response klien
      expect(json.message).toBe('Gagal mengunggah berkas');
      expect(json.message).not.toContain('secret bucket');
    });

    it('mengembalikan 201 dengan URL berkas jika unggah berhasil', async () => {
      vi.spyOn(AuthService, 'getSessionUser').mockResolvedValueOnce({
        id: 'user-1',
        email: 'user@test.com',
        nama: 'User',
        role: 'USER',
        status_akun: true,
        isPenyediaJasa: true,
        isPenggunaJasa: true,
      });

      mockStorageUpload.mockResolvedValueOnce({
        url: 'https://storage.supabase.co/jasa/logo.png',
      });

      const form = new FormData();
      form.append('folder', 'jasa');
      form.append('berkas', new File(['img'], 'logo.png', { type: 'image/png' }));

      const req = new NextRequest('http://localhost:3000/api/upload', { method: 'POST', body: form });
      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.data.url).toBe('https://storage.supabase.co/jasa/logo.png');
    });

    it('mengembalikan 500 jika terjadi kegagalan tak terduga (try/catch global)', async () => {
      vi.spyOn(AuthService, 'getSessionUser').mockRejectedValueOnce(new Error('Koneksi database terputus'));

      const req = new NextRequest('http://localhost:3000/api/upload', { method: 'POST' });
      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.success).toBe(false);
      expect(json.message).toBe('Terjadi kegagalan server internal');
    });
  });
});
