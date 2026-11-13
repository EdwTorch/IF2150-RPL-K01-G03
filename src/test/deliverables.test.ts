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

vi.mock('@/services/notifikasi.service', () => ({
  NotifikasiService: {
    kirimNotifikasi: vi.fn().mockResolvedValue(undefined),
  },
}));

describe('Integrasi Storage Deliverables (DeliverablesService & Upload Route)', () => {
  const mockStorageUpload = vi.fn();
  const mockGetUser = vi.fn();
  const mockFrom = vi.fn();
  const mockRpc = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(StorageModule, 'getStorageService').mockReturnValue({
      upload: mockStorageUpload,
      delete: vi.fn(),
    });

    vi.spyOn(SupabaseServer, 'createClient').mockResolvedValue({
      auth: { getUser: mockGetUser },
      from: mockFrom,
      rpc: mockRpc,
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
            maybeSingle: vi.fn().mockResolvedValueOnce({ data: null, error: null }),
          }),
        }),
      });

      await expect(
        DeliverablesService.validasiOwnerPesanan('pesanan-none', 'user-1')
      ).rejects.toThrow('Pesanan tidak ditemukan.');
    });

    it('melempar error jika user bukan pemesan maupun penyedia', async () => {
      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            maybeSingle: vi.fn().mockResolvedValueOnce({
              data: { id_pengguna_jasa: 'klien-1', id_penyedia_jasa: 'penyedia-1' },
              error: null,
            }),
          }),
        }),
      });

      await expect(
        DeliverablesService.validasiOwnerPesanan('pesanan-1', 'user-asing')
      ).rejects.toThrow('Akses ditolak. Pesanan ini bukan milik Anda.');
    });

    it('mengembalikan true jika user adalah pengguna jasa (pemesan)', async () => {
      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            maybeSingle: vi.fn().mockResolvedValueOnce({
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
            maybeSingle: vi.fn().mockResolvedValueOnce({
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

  // ─── getRevisionHistory (line 148: return data || []) ────────────────────────
  describe('DeliverablesService.getRevisionHistory', () => {
    const mockValidasiOwner = () => {
      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            maybeSingle: vi.fn().mockResolvedValueOnce({
              data: { id_pengguna_jasa: 'klien-1', id_penyedia_jasa: 'penyedia-1' },
              error: null,
            }),
          }),
        }),
      });
    };

    it('mengembalikan array kosong jika tidak ada riwayat revisi (line 148)', async () => {
      mockValidasiOwner();
      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            order: vi.fn().mockResolvedValueOnce({ data: null, error: null }),
          }),
        }),
      });

      const result = await DeliverablesService.getRevisionHistory('pesanan-1', 'klien-1');
      expect(result).toEqual([]);
    });

    it('mengembalikan data riwayat revisi jika ada', async () => {
      mockValidasiOwner();
      const mockRevisi = [{ id_revisi: 'rev-1', deskripsi_revisi: 'Tolong diperbaiki' }];
      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            order: vi.fn().mockResolvedValueOnce({ data: mockRevisi, error: null }),
          }),
        }),
      });

      const result = await DeliverablesService.getRevisionHistory('pesanan-1', 'klien-1');
      expect(result).toEqual(mockRevisi);
    });

    it('melempar error jika query revisi gagal', async () => {
      mockValidasiOwner();
      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            order: vi.fn().mockResolvedValueOnce({ data: null, error: { message: 'DB error' } }),
          }),
        }),
      });

      await expect(
        DeliverablesService.getRevisionHistory('pesanan-1', 'klien-1')
      ).rejects.toThrow('Gagal mengambil riwayat revisi');
    });
  });

  // ─── requestRevision ────────────────────────────────────────────────────────
  describe('DeliverablesService.requestRevision', () => {
    const baseData = {
      id_pesanan: 'pesanan-1',
      deskripsi_revisi: 'Mohon diperbaiki bagian ini',
      id_produk_akhir: 'produk-1',
      user_id: 'klien-1',
    };

    const mockValidasiPengguna = (idPengguna = 'klien-1') => {
      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            maybeSingle: vi.fn().mockResolvedValueOnce({
              data: { id_pengguna_jasa: idPengguna },
              error: null,
            }),
          }),
        }),
      });
    };

    const mockProdukAkhirValid = () => {
      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            eq: vi.fn().mockReturnValueOnce({
              maybeSingle: vi.fn().mockResolvedValueOnce({
                data: { id_produk_akhir: 'produk-1' },
                error: null,
              }),
            }),
          }),
        }),
      });
    };

    it('melempar error jika deskripsi revisi kosong', async () => {
      mockValidasiPengguna();
      await expect(
        DeliverablesService.requestRevision({ ...baseData, deskripsi_revisi: '' })
      ).rejects.toThrow('Deskripsi revisi wajib diisi.');
    });

    it('melempar error jika user bukan pengguna jasa pesanan (line 173)', async () => {
      mockValidasiPengguna('klien-lain');

      await expect(
        DeliverablesService.requestRevision(baseData)
      ).rejects.toThrow('Hanya pengguna jasa pemilik pesanan yang dapat melakukan tindakan ini');
    });

    it('melempar error jika kuota revisi habis (line 188)', async () => {
      mockValidasiPengguna();
      mockProdukAkhirValid();
      // kuota revisi = 0
      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            order: vi.fn().mockReturnValueOnce({
              limit: vi.fn().mockReturnValueOnce({
                maybeSingle: vi.fn().mockResolvedValueOnce({
                  data: {
                    id_revisi: 'rev-prev',
                    jml_revisi_tersedia: 0,
                    status_pengerjaan: 'Revisi Dikumpulkan',
                  },
                  error: null,
                }),
              }),
            }),
          }),
        }),
      });

      await expect(
        DeliverablesService.requestRevision(baseData)
      ).rejects.toThrow('Kuota revisi untuk pesanan ini sudah habis.');
    });

    it('melempar error jika update status pesanan gagal setelah insert revisi (line 221)', async () => {
      mockValidasiPengguna();
      mockProdukAkhirValid();
      // kuota revisi = 2
      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            order: vi.fn().mockReturnValueOnce({
              limit: vi.fn().mockReturnValueOnce({
                maybeSingle: vi.fn().mockResolvedValueOnce({
                  data: {
                    id_revisi: 'rev-prev',
                    jml_revisi_tersedia: 2,
                    status_pengerjaan: 'Revisi Dikumpulkan',
                  },
                  error: null,
                }),
              }),
            }),
          }),
        }),
      });
      // insert pengajuan_revisi sukses
      mockFrom.mockReturnValueOnce({
        insert: vi.fn().mockReturnValueOnce({
          select: vi.fn().mockReturnValueOnce({
            single: vi.fn().mockResolvedValueOnce({
              data: { id_revisi: 'rev-new' },
              error: null,
            }),
          }),
        }),
      });
      // update status pesanan GAGAL
      mockFrom.mockReturnValueOnce({
        update: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockResolvedValueOnce({
            error: { message: 'Koneksi DB terputus' },
          }),
        }),
      });

      await expect(
        DeliverablesService.requestRevision(baseData)
      ).rejects.toThrow('gagal memperbarui status pesanan');
    });

    it('berhasil insert revisi dan kirim notifikasi (happy path)', async () => {
      mockValidasiPengguna();
      mockProdukAkhirValid();
      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            order: vi.fn().mockReturnValueOnce({
              limit: vi.fn().mockReturnValueOnce({
                maybeSingle: vi.fn().mockResolvedValueOnce({ data: null, error: null }),
              }),
            }),
          }),
        }),
      });
      mockFrom.mockReturnValueOnce({
        insert: vi.fn().mockReturnValueOnce({
          select: vi.fn().mockReturnValueOnce({
            single: vi.fn().mockResolvedValueOnce({
              data: { id_revisi: 'rev-new', deskripsi_revisi: 'Fix ini' },
              error: null,
            }),
          }),
        }),
      });
      mockFrom.mockReturnValueOnce({
        update: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockResolvedValueOnce({ error: null }),
        }),
      });
      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            maybeSingle: vi.fn().mockResolvedValueOnce({
              data: { id_penyedia_jasa: 'penyedia-1', jasa: { nama_jasa: 'Desain Logo' } },
              error: null,
            }),
          }),
        }),
      });

      const result = await DeliverablesService.requestRevision(baseData);
      expect(result).toMatchObject({ id_revisi: 'rev-new' });
    });
  });

  // ─── submitRevisionFix ──────────────────────────────────────────────────────
  describe('DeliverablesService.submitRevisionFix', () => {
    const baseData = {
      id_pesanan: 'pesanan-1',
      deskripsi_produk: 'Perbaikan sudah dilakukan',
      file_urls: ['https://cdn.example.com/hasil-fix.pdf'],
      user_id: 'penyedia-1',
    };

    const mockValidasiPenyedia = () => {
      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            maybeSingle: vi.fn().mockResolvedValueOnce({
              data: { id_penyedia_jasa: 'penyedia-1' },
              error: null,
            }),
          }),
        }),
      });
    };

    const mockLatestRevisi = () => {
      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            eq: vi.fn().mockReturnValueOnce({
              order: vi.fn().mockReturnValueOnce({
                limit: vi.fn().mockReturnValueOnce({
                  maybeSingle: vi.fn().mockResolvedValueOnce({
                    data: { id_revisi: 'rev-latest' },
                    error: null,
                  }),
                }),
              }),
            }),
          }),
        }),
      });
    };

    it('melempar error jika insert produk_akhir gagal (line 268)', async () => {
      mockValidasiPenyedia();
      mockLatestRevisi();
      mockFrom.mockReturnValueOnce({
        insert: vi.fn().mockReturnValueOnce({
          select: vi.fn().mockResolvedValueOnce({
            data: null,
            error: { message: 'Duplikat key' },
          }),
        }),
      });

      await expect(
        DeliverablesService.submitRevisionFix(baseData)
      ).rejects.toThrow('Duplikat key');
    });

    it('melempar error jika update status pesanan gagal (line 298–300)', async () => {
      mockValidasiPenyedia();
      mockLatestRevisi();
      // insert produk_akhir sukses
      mockFrom.mockReturnValueOnce({
        insert: vi.fn().mockReturnValueOnce({
          select: vi.fn().mockResolvedValueOnce({
            data: [{ id_produk_akhir: 'prod-new' }],
            error: null,
          }),
        }),
      });
      // update pengajuan_revisi sukses
      mockFrom.mockReturnValueOnce({
        update: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            eq: vi.fn().mockReturnValueOnce({
              select: vi.fn().mockReturnValueOnce({
                maybeSingle: vi.fn().mockResolvedValueOnce({
                  data: { id_revisi: 'rev-latest' },
                  error: null,
                }),
              }),
            }),
          }),
        }),
      });
      // update pesanan status GAGAL
      mockFrom.mockReturnValueOnce({
        update: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            eq: vi.fn().mockReturnValueOnce({
              select: vi.fn().mockReturnValueOnce({
                maybeSingle: vi.fn().mockResolvedValueOnce({
                  data: null,
                  error: { message: 'Gagal update' },
                }),
              }),
            }),
          }),
        }),
      });

      await expect(
        DeliverablesService.submitRevisionFix(baseData)
      ).rejects.toThrow('status pesanan gagal diperbarui');
    });

    it('berhasil submit revision fix dengan latest revisi & kirim notifikasi (line 280–314)', async () => {
      mockValidasiPenyedia();
      mockLatestRevisi();
      // insert produk_akhir
      mockFrom.mockReturnValueOnce({
        insert: vi.fn().mockReturnValueOnce({
          select: vi.fn().mockResolvedValueOnce({
            data: [{ id_produk_akhir: 'prod-fix', id_pesanan: 'pesanan-1' }],
            error: null,
          }),
        }),
      });
      // update pengajuan_revisi status
      mockFrom.mockReturnValueOnce({
        update: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            eq: vi.fn().mockReturnValueOnce({
              select: vi.fn().mockReturnValueOnce({
                maybeSingle: vi.fn().mockResolvedValueOnce({
                  data: { id_revisi: 'rev-latest' },
                  error: null,
                }),
              }),
            }),
          }),
        }),
      });
      // update pesanan status sukses
      mockFrom.mockReturnValueOnce({
        update: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            eq: vi.fn().mockReturnValueOnce({
              select: vi.fn().mockReturnValueOnce({
                maybeSingle: vi.fn().mockResolvedValueOnce({
                  data: { id_pesanan: 'pesanan-1' },
                  error: null,
                }),
              }),
            }),
          }),
        }),
      });
      // fetch pesanan untuk notifikasi
      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            maybeSingle: vi.fn().mockResolvedValueOnce({
              data: { id_pengguna_jasa: 'klien-1', jasa: { nama_jasa: 'Desain Logo' } },
              error: null,
            }),
          }),
        }),
      });

      const result = await DeliverablesService.submitRevisionFix(baseData);
      expect(result[0]).toMatchObject({ id_produk_akhir: 'prod-fix' });
    });
  });

  // ─── confirmOrderComplete ───────────────────────────────────────────────────
  describe('DeliverablesService.confirmOrderComplete', () => {
    const mockValidasiPengguna = (idPengguna = 'klien-1') => {
      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            maybeSingle: vi.fn().mockResolvedValueOnce({
              data: { id_pengguna_jasa: idPengguna },
              error: null,
            }),
          }),
        }),
      });
    };

    it('melempar error jika user bukan pengguna jasa pesanan (line 328)', async () => {
      mockValidasiPengguna('klien-lain');

      await expect(
        DeliverablesService.confirmOrderComplete('pesanan-1', 'klien-1')
      ).rejects.toThrow('Hanya pengguna jasa pemilik pesanan yang dapat melakukan tindakan ini');
    });

    it('melempar error jika pesanan tidak ditemukan (line 329)', async () => {
      mockValidasiPengguna();
      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            single: vi.fn().mockResolvedValueOnce({ data: null, error: { message: 'Not found' } }),
          }),
        }),
      });

      await expect(
        DeliverablesService.confirmOrderComplete('pesanan-1', 'klien-1')
      ).rejects.toThrow('Pesanan tidak ditemukan');
    });

    it('melempar error jika RPC konfirmasi_pesanan_selesai gagal (line 371)', async () => {
      mockValidasiPengguna();
      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            single: vi.fn().mockResolvedValueOnce({
              data: { id_penyedia_jasa: 'penyedia-1', total_biaya: 100000, jasa: { nama_jasa: 'Logo' } },
              error: null,
            }),
          }),
        }),
      });
      mockRpc.mockResolvedValueOnce({ error: { message: 'DB locked' } });

      await expect(
        DeliverablesService.confirmOrderComplete('pesanan-1', 'klien-1')
      ).rejects.toThrow('Gagal mengonfirmasi pesanan dan mencairkan dana: DB locked');
    });

    it('melempar error jika validasi pengguna jasa gagal mengambil pesanan (line 381)', async () => {
      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            maybeSingle: vi.fn().mockResolvedValueOnce({
              data: null,
              error: { message: 'Constraint error' },
            }),
          }),
        }),
      });

      await expect(
        DeliverablesService.confirmOrderComplete('pesanan-1', 'klien-1')
      ).rejects.toThrow('Constraint error');
    });

    it('berhasil menyelesaikan pesanan, memanggil rpc, dan kirim notifikasi (happy path)', async () => {
      mockValidasiPengguna();
      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            single: vi.fn().mockResolvedValueOnce({
              data: { id_penyedia_jasa: 'penyedia-1', total_biaya: 200000, jasa: { nama_jasa: 'Desain Logo' } },
              error: null,
            }),
          }),
        }),
      });
      mockRpc.mockResolvedValueOnce({ error: null });

      await expect(
        DeliverablesService.confirmOrderComplete('pesanan-1', 'klien-1')
      ).resolves.toBeUndefined();
      expect(mockRpc).toHaveBeenCalledWith('konfirmasi_pesanan_selesai', {
        p_id_pesanan: 'pesanan-1',
      });
    });
  });

  // ─── Route upload ──────────────────────────────────────────────────────────────
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
      expect(json.message).toContain('Akses ditolak');
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
      expect(json.message).toBe('Terjadi kesalahan pada sistem. Silakan coba beberapa saat lagi.');
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
