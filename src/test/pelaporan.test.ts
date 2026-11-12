import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PelaporanService, TanggapanLaporanService } from '@/services/pelaporan.service';
import { createClient } from '@/lib/supabase/server';

// Mock Supabase client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

describe('Pelaporan & Tanggapan Laporan Services', () => {
  let mockSupabase: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn(),
      maybeSingle: vi.fn(),
    };

    (createClient as any).mockResolvedValue(mockSupabase);
  });

  // ==========================================
  // 1. PelaporanService.submitLaporan
  // ==========================================
  describe('PelaporanService.submitLaporan', () => {
    it('harus throw error jika deskripsi laporan kosong', async () => {
      await expect(
        PelaporanService.submitLaporan('order-1', 'user-1', {
          deskripsi_laporan: '   ',
          kategori: ['Penipuan'],
          url_bukti: ['https://example.com/bukti.png'],
        })
      ).rejects.toThrow('Deskripsi laporan wajib diisi.');
    });

    it('harus throw error jika kategori laporan kosong atau bukan array', async () => {
      await expect(
        PelaporanService.submitLaporan('order-1', 'user-1', {
          deskripsi_laporan: 'Laporan masalah',
          kategori: [],
          url_bukti: ['https://example.com/bukti.png'],
        })
      ).rejects.toThrow('Pilih minimal 1 kategori laporan.');
    });

    // --- Pengujian Helper Private: validateUrlBukti ---
    it('harus throw error jika url_bukti kosong', async () => {
      await expect(
        PelaporanService.submitLaporan('order-1', 'user-1', {
          deskripsi_laporan: 'Laporan masalah',
          kategori: ['Kualitas Buruk'],
          url_bukti: [],
        })
      ).rejects.toThrow('Minimal sertakan 1 tautan atau lampiran bukti.');
    });

    it('harus throw error jika jumlah url_bukti lebih dari 3', async () => {
      await expect(
        PelaporanService.submitLaporan('order-1', 'user-1', {
          deskripsi_laporan: 'Laporan masalah',
          kategori: ['Kualitas Buruk'],
          url_bukti: [
            'https://example.com/1.png',
            'https://example.com/2.png',
            'https://example.com/3.png',
            'https://example.com/4.png',
          ],
        })
      ).rejects.toThrow('Maksimal 3 bukti yang dapat dilampirkan.');
    });

    it('harus throw error jika format URL bukti tidak valid (bukan HTTP/HTTPS/relatif uploads)', async () => {
      await expect(
        PelaporanService.submitLaporan('order-1', 'user-1', {
          deskripsi_laporan: 'Laporan masalah',
          kategori: ['Kualitas Buruk'],
          url_bukti: ['javascript:alert(1)'],
        })
      ).rejects.toThrow('Format URL pada bukti ke-1 tidak valid (javascript:alert(1)).');
    });

    it('harus throw error jika URL bukti lokal mengandung path traversal (..)', async () => {
      await expect(
        PelaporanService.submitLaporan('order-1', 'user-1', {
          deskripsi_laporan: 'Laporan masalah',
          kategori: ['Kualitas Buruk'],
          url_bukti: ['/uploads/../secret.png'],
        })
      ).rejects.toThrow('Format URL pada bukti ke-1 tidak valid (/uploads/../secret.png).');
    });

    // --- Logika Utama & Error Handling ---
    it('harus throw error jika pesanan tidak ditemukan', async () => {
      mockSupabase.single.mockResolvedValueOnce({ data: null, error: { message: 'Not Found' } });

      await expect(
        PelaporanService.submitLaporan('invalid-order', 'user-1', {
          deskripsi_laporan: 'Laporan masalah',
          kategori: ['Layanan Buruk'],
          url_bukti: ['https://example.com/bukti.png'],
        })
      ).rejects.toThrow('Pesanan tidak ditemukan.');
    });

    it('harus throw error jika user bukan pemesan atau penyedia pada pesanan tersebut', async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: { id_pengguna_jasa: 'client-1', id_penyedia_jasa: 'seller-1' },
      });

      await expect(
        PelaporanService.submitLaporan('order-1', 'other-user', {
          deskripsi_laporan: 'Laporan masalah',
          kategori: ['Layanan Buruk'],
          url_bukti: ['https://example.com/bukti.png'],
        })
      ).rejects.toThrow('Akses ditolak, pesanan ini bukan milik Anda.');
    });

    it('harus throw error jika user masih memiliki tiket laporan berstatus Diproses', async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: { id_pengguna_jasa: 'client-1', id_penyedia_jasa: 'seller-1' },
      });
      mockSupabase.maybeSingle.mockResolvedValueOnce({
        data: { id_tiket: 't-1', status_tiket: 'Diproses' },
        error: null,
      });

      await expect(
        PelaporanService.submitLaporan('order-1', 'client-1', {
          deskripsi_laporan: 'Laporan masalah',
          kategori: ['Layanan Buruk'],
          url_bukti: ['https://example.com/bukti.png'],
        })
      ).rejects.toThrow('Anda masih memiliki tiket laporan yang sedang diproses untuk pesanan ini.');
    });

    it('harus berhasil submit laporan jika user adalah pemesan (terlapor = penyedia)', async () => {
      const mockResult = { id_tiket: 'tiket-101', status_tiket: 'Diproses' };

      mockSupabase.single
        .mockResolvedValueOnce({ data: { id_pengguna_jasa: 'client-1', id_penyedia_jasa: 'seller-1' } })
        .mockResolvedValueOnce({ data: mockResult, error: null });

      mockSupabase.maybeSingle.mockResolvedValueOnce({ data: null, error: null });

      const res = await PelaporanService.submitLaporan('order-1', 'client-1', {
        deskripsi_laporan: 'Hasil tidak sesuai janji',
        kategori: ['Kualitas Buruk'],
        url_bukti: ['/uploads/bukti1.png', 'https://example.com/bukti2.jpg'],
      });

      expect(res).toEqual(mockResult);
      expect(mockSupabase.insert).toHaveBeenCalledWith([
        expect.objectContaining({
          id_pelapor: 'client-1',
          id_terlapor: 'seller-1',
          deskripsi_laporan: 'Hasil tidak sesuai janji',
        }),
      ]);
    });
  });

  // ==========================================
  // 2. PelaporanService.validasiOwnerPesanan
  // ==========================================
  describe('PelaporanService.validasiOwnerPesanan', () => {
    it('harus mengembalikan true jika user adalah penyedia jasa', async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: { id_pengguna_jasa: 'client-1', id_penyedia_jasa: 'seller-1' },
      });

      const res = await PelaporanService.validasiOwnerPesanan('order-1', 'seller-1');
      expect(res).toBe(true);
    });

    it('harus throw error jika pesanan tidak ditemukan', async () => {
      mockSupabase.single.mockResolvedValueOnce({ data: null });

      await expect(PelaporanService.validasiOwnerPesanan('order-x', 'seller-1')).rejects.toThrow(
        'Pesanan tidak ditemukan'
      );
    });
  });

  // ==========================================
  // 3. PelaporanService.getTicketsByUser & getDetailTiket
  // ==========================================
  describe('PelaporanService.getTicketsByUser & getDetailTiket', () => {
    it('getTicketsByUser harus mengembalikan daftar tiket milik user', async () => {
      const mockTiketList = [{ id_tiket: 't-1' }, { id_tiket: 't-2' }];
      mockSupabase.order.mockResolvedValueOnce({ data: mockTiketList, error: null });

      const res = await PelaporanService.getTicketsByUser('user-1');
      expect(res).toEqual(mockTiketList);
    });

    it('getDetailTiket harus throw error jika user bukan pelapor maupun terlapor', async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: { id_tiket: 't-1', id_pelapor: 'client-1', id_terlapor: 'seller-1' },
        error: null,
      });

      await expect(PelaporanService.getDetailTiket('t-1', 'other-user')).rejects.toThrow(
        'Akses ditolak. Anda tidak memiliki izin melihat tiket ini.'
      );
    });

    it('getDetailTiket mengembalikan detail tiket jika user adalah pelapor', async () => {
      const mockDetail = { id_tiket: 't-1', id_pelapor: 'client-1', id_terlapor: 'seller-1' };
      mockSupabase.single.mockResolvedValueOnce({ data: mockDetail, error: null });

      const res = await PelaporanService.getDetailTiket('t-1', 'client-1');
      expect(res).toEqual(mockDetail);
    });
  });

  // ==========================================
  // 4. TanggapanLaporanService (Admin Functions)
  // ==========================================
  describe('TanggapanLaporanService', () => {
    it('getAllTicketsForAdmin mengembalikan semua tiket laporan', async () => {
      const mockTikets = [{ id_tiket: 't-1' }];
      mockSupabase.order.mockResolvedValueOnce({ data: mockTikets, error: null });

      const res = await TanggapanLaporanService.getAllTicketsForAdmin();
      expect(res).toEqual(mockTikets);
    });

    it('getDetailTiketAdmin mengembalikan detail tiket tanpa mengecek user_id', async () => {
      const mockTiket = { id_tiket: 't-1', id_pelapor: 'u1' };
      mockSupabase.single.mockResolvedValueOnce({ data: mockTiket, error: null });

      const res = await TanggapanLaporanService.getDetailTiketAdmin('t-1');
      expect(res).toEqual(mockTiket);
    });

    describe('catatKeputusanTindakan', () => {
      it('harus throw error jika jenis_tindakan atau catatan_tanggapan kosong', async () => {
        await expect(
          TanggapanLaporanService.catatKeputusanTindakan({
            id_tiket: 't-1',
            id_admin: 'admin-1',
            jenis_tindakan: '' as any,
            catatan_tanggapan: 'Catatan',
          })
        ).rejects.toThrow('Jenis tindakan wajib dipilih.');

        await expect(
          TanggapanLaporanService.catatKeputusanTindakan({
            id_tiket: 't-1',
            id_admin: 'admin-1',
            jenis_tindakan: 'PERINGATAN',
            catatan_tanggapan: '   ',
          })
        ).rejects.toThrow('Catatan tanggapan wajib diisi.');
      });

      it('harus throw error jika tiket sudah berstatus Selesai', async () => {
        mockSupabase.single.mockResolvedValueOnce({
          data: { id_tiket: 't-1', status_tiket: 'Selesai' },
          error: null,
        });

        await expect(
          TanggapanLaporanService.catatKeputusanTindakan({
            id_tiket: 't-1',
            id_admin: 'admin-1',
            jenis_tindakan: 'PERINGATAN',
            catatan_tanggapan: 'Tindakan selesai',
          })
        ).rejects.toThrow('Tiket laporan ini sudah selesai ditangani sebelumnya.');
      });

      it('berhasil memproses tindakan PERINGATAN', async () => {
        const mockTiketData = {
          id_tiket: 't-1',
          id_terlapor: 'seller-1',
          status_tiket: 'Diproses',
          pesanan: { id_pesanan: 'p-1' },
        };
        const mockTanggapan = { id_tanggapan: 'tang-1' };

        mockSupabase.single
          .mockResolvedValueOnce({ data: mockTiketData, error: null }) // select tiket
          .mockResolvedValueOnce({ data: mockTanggapan, error: null }); // insert tanggapan

        mockSupabase.eq.mockReturnThis();

        const res = await TanggapanLaporanService.catatKeputusanTindakan({
          id_tiket: 't-1',
          id_admin: 'admin-1',
          jenis_tindakan: 'PERINGATAN',
          catatan_tanggapan: 'Diberikan peringatan pertama',
        });

        expect(res).toEqual(mockTanggapan);
        expect(mockSupabase.update).toHaveBeenCalledWith({ sanksi: 'PERINGATAN' });
        expect(mockSupabase.update).toHaveBeenCalledWith({ status_tiket: 'Selesai' });
      });

      it('berhasil memproses tindakan SUSPEND_AKUN', async () => {
        const mockTiketData = {
          id_tiket: 't-1',
          id_terlapor: 'seller-1',
          status_tiket: 'Diproses',
          pesanan: [{ id_pesanan: 'p-1' }], // format array pesanan
        };

        mockSupabase.single
          .mockResolvedValueOnce({ data: mockTiketData, error: null })
          .mockResolvedValueOnce({ data: { id_tanggapan: 'tang-2' }, error: null });

        mockSupabase.eq.mockReturnThis();

        await TanggapanLaporanService.catatKeputusanTindakan({
          id_tiket: 't-1',
          id_admin: 'admin-1',
          jenis_tindakan: 'SUSPEND_AKUN',
          catatan_tanggapan: 'Akun ditangguhkan karena melanggar',
        });

        expect(mockSupabase.update).toHaveBeenCalledWith({
          status_akun: false,
          sanksi: 'SUSPENDED',
        });
      });

      it('berhasil memproses tindakan LAPORAN_DITOLAK tanpa mengubah sanksi akun', async () => {
        const mockTiketData = {
          id_tiket: 't-1',
          id_terlapor: 'seller-1',
          status_tiket: 'Diproses',
          pesanan: { id_pesanan: 'p-1' },
        };

        mockSupabase.single
          .mockResolvedValueOnce({ data: mockTiketData, error: null })
          .mockResolvedValueOnce({ data: { id_tanggapan: 'tang-3' }, error: null });

        mockSupabase.eq.mockReturnThis();

        await TanggapanLaporanService.catatKeputusanTindakan({
          id_tiket: 't-1',
          id_admin: 'admin-1',
          jenis_tindakan: 'LAPORAN_DITOLAK',
          catatan_tanggapan: 'Bukti kurang kuat',
        });

        expect(mockSupabase.update).toHaveBeenCalledWith({ status_tiket: 'Selesai' });
      });
    });
  });
});
