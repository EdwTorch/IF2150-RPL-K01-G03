import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import {
  DeliverablesService,
  FOLDER_DELIVERABLE,
  MAKS_UKURAN_DELIVERABLE,
} from '@/services/deliverables.service';
import { POST } from '@/app/api/pesanan/[id_pesanan]/deliverables/upload/route';
import * as StorageModule from '@/services/storage';
import * as SupabaseServer from '@/lib/supabase/server';

describe('Integrasi Storage Deliverables (DeliverablesService & Upload Route)', () => {
  const mockStorageUpload = vi.fn();
  const mockGetUser = vi.fn();
  const mockFrom = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(StorageModule, 'getStorageService').mockReturnValue({
      upload: mockStorageUpload,
      delete: vi.fn(),
    });

    vi.spyOn(SupabaseServer, 'createClient').mockResolvedValue({
      auth: { getUser: mockGetUser },
      from: mockFrom,
    } as any);
  });

  describe('DeliverablesService.unggahBerkasDeliverable', () => {
    it('menolak berkas yang ukurannya melebihi 50 MB', async () => {
      const largeFile = new File(['x'.repeat(100)], 'large.pdf', { type: 'application/pdf' });
      Object.defineProperty(largeFile, 'size', { value: MAKS_UKURAN_DELIVERABLE + 1 });

      await expect(DeliverablesService.unggahBerkasDeliverable(largeFile)).rejects.toThrow(
        /Ukuran berkas melebihi batas maksimum 50 MB/
      );
      expect(mockStorageUpload).not.toHaveBeenCalled();
    });

    it('menolak berkas dengan tipe MIME yang tidak diizinkan', async () => {
      const exeFile = new File(['bin'], 'malware.exe', { type: 'application/x-msdownload' });

      await expect(DeliverablesService.unggahBerkasDeliverable(exeFile)).rejects.toThrow(
        /tidak diizinkan untuk deliverable/
      );
      expect(mockStorageUpload).not.toHaveBeenCalled();
    });

    it('menerima berkas dengan format yang diizinkan (PNG, PDF, MP4, ZIP, HTML)', async () => {
      const allowedTypes = [
        { name: 'hasil.png', type: 'image/png' },
        { name: 'dokumen.pdf', type: 'application/pdf' },
        { name: 'video.mp4', type: 'video/mp4' },
        { name: 'archive.zip', type: 'application/zip' },
        { name: 'preview.html', type: 'text/html' },
      ];

      for (const item of allowedTypes) {
        mockStorageUpload.mockResolvedValueOnce({
          url: `http://storage.local/${FOLDER_DELIVERABLE}/${item.name}`,
        });

        const file = new File(['content'], item.name, { type: item.type });
        const url = await DeliverablesService.unggahBerkasDeliverable(file);

        expect(url).toContain(item.name);
        expect(mockStorageUpload).toHaveBeenCalledWith(file, FOLDER_DELIVERABLE);
      }
    });

    it('melempar error jika Storage Service mengembalikan pesan galat', async () => {
      mockStorageUpload.mockResolvedValueOnce({
        url: '',
        error: 'Koneksi ke storage driver timeout',
      });

      const file = new File(['data'], 'hasil.pdf', { type: 'application/pdf' });
      await expect(DeliverablesService.unggahBerkasDeliverable(file)).rejects.toThrow(
        'Koneksi ke storage driver timeout'
      );
    });

    it('melempar error jika Storage Service mengembalikan URL kosong tanpa pesan galat', async () => {
      mockStorageUpload.mockResolvedValueOnce({ url: '' });

      const file = new File(['data'], 'hasil.pdf', { type: 'application/pdf' });
      await expect(DeliverablesService.unggahBerkasDeliverable(file)).rejects.toThrow(
        'Gagal mengunggah berkas deliverable'
      );
    });
  });

  describe('DeliverablesService.validasiOwnerPesanan', () => {
    it('melempar error jika pesanan tidak ditemukan di database', async () => {
      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            single: vi.fn().mockResolvedValueOnce({ data: null, error: null }),
          }),
        }),
      });

      await expect(
        DeliverablesService.validasiOwnerPesanan('pesanan-none', 'user-1')
      ).rejects.toThrow('Pesanan tidak ditemukan');
    });

    it('melempar error jika user bukan pemesan maupun penyedia', async () => {
      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            single: vi.fn().mockResolvedValueOnce({
              data: { id_pengguna_jasa: 'klien-1', id_penyedia_jasa: 'penyedia-1' },
              error: null,
            }),
          }),
        }),
      });

      await expect(
        DeliverablesService.validasiOwnerPesanan('pesanan-1', 'user-asing')
      ).rejects.toThrow('Akses ditolak, pesanan ini bukan milik anda');
    });

    it('mengembalikan true jika user adalah pengguna jasa (pemesan)', async () => {
      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            single: vi.fn().mockResolvedValueOnce({
              data: { id_pengguna_jasa: 'klien-1', id_penyedia_jasa: 'penyedia-1' },
              error: null,
            }),
          }),
        }),
      });

      const valid = await DeliverablesService.validasiOwnerPesanan('pesanan-1', 'klien-1');
      expect(valid).toBe(true);
    });

    it('mengembalikan true jika user adalah penyedia jasa', async () => {
      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            single: vi.fn().mockResolvedValueOnce({
              data: { id_pengguna_jasa: 'klien-1', id_penyedia_jasa: 'penyedia-1' },
              error: null,
            }),
          }),
        }),
      });

      const valid = await DeliverablesService.validasiOwnerPesanan('pesanan-1', 'penyedia-1');
      expect(valid).toBe(true);
    });
  });

  describe('Route POST /api/pesanan/[id_pesanan]/deliverables/upload', () => {
    const makeParams = (id: string) => ({ params: Promise.resolve({ id_pesanan: id }) });

    it('mengembalikan 401 jika pengguna belum terautentikasi', async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: null }, error: new Error('Unauthorized') });

      const req = new NextRequest('http://localhost:3000/api/pesanan/p-1/deliverables/upload', {
        method: 'POST',
      });
      const res = await POST(req, makeParams('p-1'));
      const json = await res.json();

      expect(res.status).toBe(401);
      expect(json.success).toBe(false);
      expect(json.message).toContain('belum login');
    });

    it('mengembalikan 403 jika pengguna bukan pemilik pesanan terkait', async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: { id: 'intruder' } }, error: null });
      vi.spyOn(DeliverablesService, 'validasiOwnerPesanan').mockRejectedValueOnce(
        new Error('Akses ditolak, pesanan ini bukan milik anda')
      );

      const req = new NextRequest('http://localhost:3000/api/pesanan/p-1/deliverables/upload', {
        method: 'POST',
      });
      const res = await POST(req, makeParams('p-1'));
      const json = await res.json();

      expect(res.status).toBe(403);
      expect(json.success).toBe(false);
      expect(json.message).toBe('Akses ditolak');
    });

    it('mengembalikan 400 jika body bukan multipart/form-data', async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: { id: 'penyedia-1' } }, error: null });
      vi.spyOn(DeliverablesService, 'validasiOwnerPesanan').mockResolvedValueOnce(true);

      const req = new NextRequest('http://localhost:3000/api/pesanan/p-1/deliverables/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ berkas: 'bukan-file' }),
      });
      const res = await POST(req, makeParams('p-1'));
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.message).toContain('multipart/form-data');
    });

    it('mengembalikan 400 jika field berkas kosong atau bukan File', async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: { id: 'penyedia-1' } }, error: null });
      vi.spyOn(DeliverablesService, 'validasiOwnerPesanan').mockResolvedValueOnce(true);

      const form = new FormData();
      form.append('berkas', '');

      const req = new NextRequest('http://localhost:3000/api/pesanan/p-1/deliverables/upload', {
        method: 'POST',
        body: form,
      });
      const res = await POST(req, makeParams('p-1'));
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.message).toContain('Berkas tidak ditemukan atau kosong');
    });

    it('mengembalikan 400 jika validasi ukuran atau tipe berkas gagal', async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: { id: 'penyedia-1' } }, error: null });
      vi.spyOn(DeliverablesService, 'validasiOwnerPesanan').mockResolvedValueOnce(true);
      vi.spyOn(DeliverablesService, 'unggahBerkasDeliverable').mockRejectedValueOnce(
        new Error('Ukuran berkas melebihi batas maksimum 50 MB')
      );

      const form = new FormData();
      form.append('berkas', new File(['x'], 'large.pdf', { type: 'application/pdf' }));

      const req = new NextRequest('http://localhost:3000/api/pesanan/p-1/deliverables/upload', {
        method: 'POST',
        body: form,
      });
      const res = await POST(req, makeParams('p-1'));
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.message).toContain('melebihi');
    });

    it('mengembalikan 500 jika terjadi kegagalan internal saat proses penyimpanan berkas', async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: { id: 'penyedia-1' } }, error: null });
      vi.spyOn(DeliverablesService, 'validasiOwnerPesanan').mockResolvedValueOnce(true);
      vi.spyOn(DeliverablesService, 'unggahBerkasDeliverable').mockRejectedValueOnce(
        new Error('Koneksi storage terputus')
      );

      const form = new FormData();
      form.append('berkas', new File(['valid'], 'hasil.zip', { type: 'application/zip' }));

      const req = new NextRequest('http://localhost:3000/api/pesanan/p-1/deliverables/upload', {
        method: 'POST',
        body: form,
      });
      const res = await POST(req, makeParams('p-1'));
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.success).toBe(false);
      expect(json.message).toBe('Koneksi storage terputus');
    });

    it('mengembalikan 201 dengan URL berkas saat unggahan berhasil', async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: { id: 'penyedia-1' } }, error: null });
      vi.spyOn(DeliverablesService, 'validasiOwnerPesanan').mockResolvedValueOnce(true);
      vi.spyOn(DeliverablesService, 'unggahBerkasDeliverable').mockResolvedValueOnce(
        'https://storage.supabase.co/deliverables-uploads/final.zip'
      );

      const form = new FormData();
      form.append('berkas', new File(['data'], 'final.zip', { type: 'application/zip' }));

      const req = new NextRequest('http://localhost:3000/api/pesanan/p-1/deliverables/upload', {
        method: 'POST',
        body: form,
      });
      const res = await POST(req, makeParams('p-1'));
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.data.url).toBe('https://storage.supabase.co/deliverables-uploads/final.zip');
    });
  });
});
