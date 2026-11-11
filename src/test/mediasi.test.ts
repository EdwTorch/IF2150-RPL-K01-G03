import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MediasiService } from '@/services/mediasi.service';
import { NotifikasiService } from '@/services/notifikasi.service';

// Mock NotifikasiService
vi.mock('@/services/notifikasi.service', () => ({
  NotifikasiService: {
    kirimNotifikasi: vi.fn().mockResolvedValue(true),
  },
}));

// 2. Gunakan vi.hoisted agar mockSupabaseAdmin dideklarasikan SEBELUM vi.mock dijalankan
const { mockSupabaseAdmin } = vi.hoisted(() => {
  const mock = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn(),
    maybeSingle: vi.fn(),
  };

  return { mockSupabaseAdmin: mock };
});

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => mockSupabaseAdmin),
}));

describe('MediasiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockSupabaseAdmin.from.mockReturnThis();
    mockSupabaseAdmin.select.mockReturnThis();
    mockSupabaseAdmin.insert.mockReturnThis();
    mockSupabaseAdmin.update.mockReturnThis();
    mockSupabaseAdmin.delete.mockReturnThis();
    mockSupabaseAdmin.eq.mockReturnThis();
    mockSupabaseAdmin.order.mockReturnThis();
  });

  // ==========================================
  // 1. Test mulaiMediasi
  // ==========================================
  describe('mulaiMediasi', () => {
    it('harus throw error jika tiket laporan tidak ditemukan', async () => {
      mockSupabaseAdmin.single.mockResolvedValueOnce({ data: null, error: { message: 'Not Found' } });

      await expect(MediasiService.mulaiMediasi('tiket-invalid', 'admin-1')).rejects.toThrow(
        'Tiket laporan tidak ditemukan.'
      );
    });

    it('harus throw error jika tiket tidak memiliki id_terlapor', async () => {
      mockSupabaseAdmin.single.mockResolvedValueOnce({
        data: { id_tiket: 't-1', id_terlapor: null },
        error: null,
      });

      await expect(MediasiService.mulaiMediasi('t-1', 'admin-1')).rejects.toThrow(
        'Tiket laporan ini tidak memiliki pihak terlapor untuk dimediasi.'
      );
    });

    it('harus throw error jika id_admin tidak valid', async () => {
      mockSupabaseAdmin.single
        .mockResolvedValueOnce({ data: { id_tiket: 't-1', id_terlapor: 'user-2' }, error: null })
        .mockResolvedValueOnce({ data: null, error: { message: 'Admin not found' } });

      await expect(MediasiService.mulaiMediasi('t-1', 'fake-admin')).rejects.toThrow(
        'Akses ditolak: User bukan admin yang valid.'
      );
    });

    it('harus mengembalikan sesi yang sudah ada jika status_sesi masih BERLANGSUNG', async () => {
      const mockTiket = { id_tiket: 't-1', id_terlapor: 'user-2' };
      const mockAdmin = { id: 'admin-1' };
      const mockExistingSesi = { id_sesi_mediasi: 'sesi-1', status_sesi: 'BERLANGSUNG' };

      mockSupabaseAdmin.single
        .mockResolvedValueOnce({ data: mockTiket, error: null })
        .mockResolvedValueOnce({ data: mockAdmin, error: null });

      mockSupabaseAdmin.maybeSingle.mockResolvedValueOnce({ data: mockExistingSesi, error: null });

      const res = await MediasiService.mulaiMediasi('t-1', 'admin-1');

      expect(res).toEqual({
        is_new: false,
        sesi: mockExistingSesi,
      });
      expect(mockSupabaseAdmin.insert).not.toHaveBeenCalled();
    });

    it('harus melakukan rollback sesi_mediasi jika pesan pembuka gagal dibuat', async () => {
      const mockTiket = { id_tiket: 't-1', id_pesanan: 'p-1', id_pelapor: 'u-1', id_terlapor: 'u-2' };
      const mockAdmin = { id: 'admin-1' };
      const mockSesiBaru = { id_sesi_mediasi: 'sesi-new' };

      mockSupabaseAdmin.single
        .mockResolvedValueOnce({ data: mockTiket, error: null }) // select tiket
        .mockResolvedValueOnce({ data: mockAdmin, error: null }) // select admin
        .mockResolvedValueOnce({ data: mockSesiBaru, error: null }) // insert sesi_mediasi
        .mockResolvedValueOnce({ data: null, error: { message: 'Pesan insert error' } }); // insert pesan_mediasi (GAGAL)

      mockSupabaseAdmin.maybeSingle.mockResolvedValueOnce({ data: null, error: null });

      await expect(MediasiService.mulaiMediasi('t-1', 'admin-1')).rejects.toThrow(
        'Gagal membuat pesan awal mediasi: Pesan insert error'
      );

      // Pastikan rollback delete terpanggil
      expect(mockSupabaseAdmin.delete).toHaveBeenCalled();
      expect(mockSupabaseAdmin.eq).toHaveBeenCalledWith('id_sesi_mediasi', 'sesi-new');
    });

    it('harus berhasil memulai mediasi baru dan mengirimkan notifikasi', async () => {
      const mockTiket = { id_tiket: 't-1', id_pesanan: 'p-1', id_pelapor: 'u-1', id_terlapor: 'u-2' };
      const mockAdmin = { id: 'admin-1' };
      const mockSesiBaru = { id_sesi_mediasi: 'sesi-new', status_sesi: 'BERLANGSUNG' };
      const mockPesanAwal = { id_pesan: 'msg-1', isi_pesan: 'Halo' };

      mockSupabaseAdmin.single
        .mockResolvedValueOnce({ data: mockTiket, error: null })
        .mockResolvedValueOnce({ data: mockAdmin, error: null })
        .mockResolvedValueOnce({ data: mockSesiBaru, error: null })
        .mockResolvedValueOnce({ data: mockPesanAwal, error: null });

      mockSupabaseAdmin.maybeSingle.mockResolvedValueOnce({ data: null, error: null });

      const res = await MediasiService.mulaiMediasi('t-1', 'admin-1');

      expect(res).toEqual({
        is_new: true,
        sesi: mockSesiBaru,
        pesan_awal: mockPesanAwal,
      });
      expect(NotifikasiService.kirimNotifikasi).toHaveBeenCalledTimes(2);
    });
  });

  // ==========================================
  // 2. Test kirimPesanMediasi
  // ==========================================
  describe('kirimPesanMediasi', () => {
    it('harus throw error jika isi_pesan kosong', async () => {
      await expect(MediasiService.kirimPesanMediasi('sesi-1', 'u-1', '   ')).rejects.toThrow(
        'Isi pesan tidak boleh kosong.'
      );
    });

    it('harus throw error jika sesi mediasi tidak ditemukan', async () => {
      mockSupabaseAdmin.single.mockResolvedValueOnce({ data: null, error: { message: 'Not found' } });

      await expect(MediasiService.kirimPesanMediasi('sesi-invalid', 'u-1', 'Halo')).rejects.toThrow(
        'Sesi mediasi tidak ditemukan.'
      );
    });

    it('harus throw error jika sesi mediasi sudah selesai', async () => {
      mockSupabaseAdmin.single.mockResolvedValueOnce({
        data: { id_sesi_mediasi: 's-1', status_sesi: 'SELESAI' },
        error: null,
      });

      await expect(MediasiService.kirimPesanMediasi('s-1', 'u-1', 'Halo')).rejects.toThrow(
        'Sesi mediasi telah selesai. Tidak dapat mengirim pesan lagi.'
      );
    });

    it('harus throw error jika pengirim bukan salah satu peserta mediasi', async () => {
      const mockSesi = {
        id_sesi_mediasi: 's-1',
        id_admin: 'admin-1',
        status_sesi: 'BERLANGSUNG',
        tiket_laporan: { id_pelapor: 'u-1', id_terlapor: 'u-2' },
      };
      mockSupabaseAdmin.single.mockResolvedValueOnce({ data: mockSesi, error: null });

      await expect(MediasiService.kirimPesanMediasi('s-1', 'stranger-user', 'Halo')).rejects.toThrow(
        'Akses ditolak: Anda bukan peserta dalam sesi mediasi ini.'
      );
    });

    it('harus berhasil mengirim pesan dan memotong preview notifikasi > 80 karakter', async () => {
      const mockSesi = {
        id_sesi_mediasi: 's-1',
        id_admin: 'admin-1',
        status_sesi: 'BERLANGSUNG',
        tiket_laporan: { id_pesanan: 'p-1', id_pelapor: 'u-1', id_terlapor: 'u-2' },
      };
      const longMessage = 'A'.repeat(90);
      const mockPesanBaru = {
        id_pesan: 'msg-99',
        isi_pesan: longMessage,
        pengguna: { nama: 'Budi' },
      };

      mockSupabaseAdmin.single
        .mockResolvedValueOnce({ data: mockSesi, error: null })
        .mockResolvedValueOnce({ data: mockPesanBaru, error: null });

      const res = await MediasiService.kirimPesanMediasi('s-1', 'u-1', longMessage);

      expect(res).toEqual(mockPesanBaru);
      expect(NotifikasiService.kirimNotifikasi).toHaveBeenCalledWith(
        expect.objectContaining({
          pesan_notifikasi: `${longMessage.substring(0, 80)}...`,
        })
      );
    });
  });

  // ==========================================
  // 3. Test getDaftarMediasiUser
  // ==========================================
  describe('getDaftarMediasiUser', () => {
    it('harus memfilter sesi mediasi sesuai peserta dan mengurutkan pesan terakhir', async () => {
      const mockSesiList = [
        {
          id_sesi_mediasi: 's-1',
          id_admin: 'admin-1',
          waktu_mulai: '2026-01-01',
          tiket_laporan: { id_pelapor: 'u-1', id_terlapor: 'u-2' },
          pesan_mediasi: [
            { isi_pesan: 'Pesan Lama', waktu_kirim: '2026-01-01T10:00:00Z' },
            { isi_pesan: 'Pesan Baru', waktu_kirim: '2026-01-01T12:00:00Z' },
          ],
        },
        {
          id_sesi_mediasi: 's-2',
          id_admin: 'admin-2',
          waktu_mulai: '2026-01-01',
          tiket_laporan: { id_pelapor: 'other-1', id_terlapor: 'other-2' },
        },
      ];

      mockSupabaseAdmin.order.mockResolvedValueOnce({ data: mockSesiList, error: null });

      const res = await MediasiService.getDaftarMediasiUser('u-1');

      expect(res).toHaveLength(1);
      expect(res[0].id_sesi_mediasi).toBe('s-1');
      expect(res[0].pesan_terakhir).toBe('Pesan Baru');
      expect(res[0].waktu_pesan_terakhir).toBe('2026-01-01T12:00:00Z');
    });

    it('harus throw error jika query DB gagal', async () => {
      mockSupabaseAdmin.order.mockResolvedValueOnce({ data: null, error: { message: 'Fetch error' } });

      await expect(MediasiService.getDaftarMediasiUser('u-1')).rejects.toThrow(
        'Gagal mengambil daftar sesi mediasi: Fetch error'
      );
    });
  });

  // ==========================================
  // 4. Test getDetailDanPesanMediasi
  // ==========================================
  describe('getDetailDanPesanMediasi', () => {
    it('harus throw error jika user bukan peserta sah', async () => {
      const mockSesi = {
        id_sesi_mediasi: 's-1',
        id_admin: 'admin-1',
        tiket_laporan: { id_pelapor: 'u-1', id_terlapor: 'u-2' },
      };

      mockSupabaseAdmin.single.mockResolvedValueOnce({ data: mockSesi, error: null });

      await expect(MediasiService.getDetailDanPesanMediasi('s-1', 'stranger')).rejects.toThrow(
        'Akses ditolak: Anda tidak memiliki akses ke ruang mediasi ini.'
      );
    });

    it('harus memformat pesan dengan peran_di_mediasi (ADMIN, PELAPOR, TERLAPOR)', async () => {
      const mockSesi = {
        id_sesi_mediasi: 's-1',
        id_admin: 'admin-1',
        tiket_laporan: { id_pelapor: 'u-pelapor', id_terlapor: 'u-terlapor' },
      };

      const mockPesanList = [
        { id_pesan: '1', id_pengirim: 'admin-1', isi_pesan: 'Pesan Admin', pengirim: { nama: 'Admin' } },
        { id_pesan: '2', id_pengirim: 'u-pelapor', isi_pesan: 'Pesan Pelapor', pengirim: { nama: 'Pelapor' } },
        { id_pesan: '3', id_pengirim: 'u-terlapor', isi_pesan: 'Pesan Terlapor', pengirim: { nama: 'Terlapor' } },
      ];

      mockSupabaseAdmin.single.mockResolvedValueOnce({ data: mockSesi, error: null });
      mockSupabaseAdmin.order.mockResolvedValueOnce({ data: mockPesanList, error: null });

      const res = await MediasiService.getDetailDanPesanMediasi('s-1', 'u-pelapor');

      expect(res.pesan[0].peran_di_mediasi).toBe('ADMIN');
      expect(res.pesan[1].peran_di_mediasi).toBe('PELAPOR');
      expect(res.pesan[2].peran_di_mediasi).toBe('TERLAPOR');
    });
  });

  // ==========================================
  // 5. Test selesaikanMediasi
  // ==========================================
  describe('selesaikanMediasi', () => {
    it('harus throw error jika gagal memperbarui status sesi atau sesi sudah selesai', async () => {
      mockSupabaseAdmin.single.mockResolvedValueOnce({ data: null, error: { message: 'Update failed' } });

      await expect(MediasiService.selesaikanMediasi('s-1', 'admin-1')).rejects.toThrow(
        'Gagal menutup sesi mediasi atau sesi sudah selesai.'
      );
    });

    it('harus mengubah status sesi menjadi SELESAI dan mengirim pesan penutup otomatis', async () => {
      const mockSesiUpdated = { id_sesi_mediasi: 's-1', status_sesi: 'SELESAI' };
      mockSupabaseAdmin.single.mockResolvedValueOnce({ data: mockSesiUpdated, error: null });

      const res = await MediasiService.selesaikanMediasi('s-1', 'admin-1');

      expect(res).toEqual(mockSesiUpdated);
      expect(mockSupabaseAdmin.insert).toHaveBeenCalledWith({
        id_sesi_mediasi: 's-1',
        id_pengirim: 'admin-1',
        isi_pesan: 'Sesi mediasi telah diakhiri oleh Admin.',
      });
    });
  });
});
