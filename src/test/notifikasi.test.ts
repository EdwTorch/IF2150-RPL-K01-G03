import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotifikasiService } from '@/services/notifikasi.service';
import { createClient } from '@/lib/supabase/server';

// Mock Supabase client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

describe('NotifikasiService', () => {
  let mockSupabase: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mock chainable Supabase methods
    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
    };

    (createClient as any).mockResolvedValue(mockSupabase);
  });

  // ==========================================
  // 1. Test kirimNotifikasi
  // ==========================================
  describe('kirimNotifikasi', () => {
    it('harus mengembalikan false dan mencetak error jika id_pengguna kosong atau hanya spasi', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const resEmpty = await NotifikasiService.kirimNotifikasi({
        id_pengguna: '',
        judul: 'Test Judul',
        pesan_notifikasi: 'Test Pesan',
      });

      const resSpaces = await NotifikasiService.kirimNotifikasi({
        id_pengguna: '   ',
        judul: 'Test Judul',
        pesan_notifikasi: 'Test Pesan',
      });

      expect(resEmpty).toBe(false);
      expect(resSpaces).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Gagal mengirim notifikasi: id_pengguna kosong');
      expect(createClient).not.toHaveBeenCalled();
    });

    it('harus berhasil mengirim notifikasi dengan data lengkap', async () => {
      mockSupabase.insert.mockResolvedValueOnce({ error: null });

      const payload = {
        id_pengguna: 'user-123',
        judul: 'Pesanan Baru',
        pesan_notifikasi: 'Anda mendapatkan pesanan baru',
        id_pesanan: 'order-1',
        id_referensi: 'ref-1',
      };

      const res = await NotifikasiService.kirimNotifikasi(payload);

      expect(res).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith('notifikasi');
      expect(mockSupabase.insert).toHaveBeenCalledWith([
        {
          id_pengguna: 'user-123',
          id_pesanan: 'order-1',
          id_referensi: 'ref-1',
          judul: 'Pesanan Baru',
          pesan_notifikasi: 'Anda mendapatkan pesanan baru',
          is_read: false,
        },
      ]);
    });

    it('harus mengisi id_pesanan dan id_referensi dengan null jika opsional tidak diberikan', async () => {
      mockSupabase.insert.mockResolvedValueOnce({ error: null });

      await NotifikasiService.kirimNotifikasi({
        id_pengguna: 'user-123',
        judul: 'Info Sistem',
        pesan_notifikasi: 'Update sistem',
      });

      expect(mockSupabase.insert).toHaveBeenCalledWith([
        expect.objectContaining({
          id_pesanan: null,
          id_referensi: null,
        }),
      ]);
    });

    it('harus mencetak console.error dan tidak throw exception jika insert Supabase gagal', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockSupabase.insert.mockResolvedValueOnce({ error: { message: 'Database insert failure' } });

      const res = await NotifikasiService.kirimNotifikasi({
        id_pengguna: 'user-123',
        judul: 'Gagal Kirim',
        pesan_notifikasi: 'Pesan',
      });

      expect(res).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith('Gagal mengirim notifikasi:', 'Database insert failure');
    });
  });

  // ==========================================
  // 2. Test getNotifikasiUser
  // ==========================================
  // ==========================================
  // 2. Test getNotifikasiUser
  // ==========================================
  describe('getNotifikasiUser', () => {
    it('harus mengembalikan array kosong dan unread_count 0 jika user_id kosong atau spasi', async () => {
      const resNull = await NotifikasiService.getNotifikasiUser('');
      const resSpaces = await NotifikasiService.getNotifikasiUser('   ');

      expect(resNull).toEqual({ notifikasi: [], unread_count: 0 });
      expect(resSpaces).toEqual({ notifikasi: [], unread_count: 0 });
      expect(createClient).not.toHaveBeenCalled();
    });

    it('harus mengambil daftar notifikasi dan jumlah yang belum dibaca secara paralel', async () => {
      const mockNotifikasiData = [
        {
          id_notifikasi: 'n1',
          id_pesanan: 'p1',
          id_referensi: null,
          judul: 'Judul 1',
          pesan_notifikasi: 'Pesan 1',
          is_read: false,
          created_at: '2026-01-01',
        },
      ];

      mockSupabase.from.mockImplementation((table: string) => {
        return {
          select: vi.fn().mockImplementation((_, opts) => {
            if (opts?.count === 'exact') {
              return {
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockResolvedValue({ count: 3, error: null }),
                }),
              };
            }
            return {
              eq: vi.fn().mockReturnValue({
                order: vi.fn().mockReturnValue({
                  limit: vi.fn().mockResolvedValue({ data: mockNotifikasiData, error: null }),
                }),
              }),
            };
          }),
        };
      });

      const result = await NotifikasiService.getNotifikasiUser('user-123');

      expect(result).toEqual({
        notifikasi: mockNotifikasiData,
        unread_count: 3,
      });
    });

    it('harus melempar error jika query memuat notifikasi gagal', async () => {
      mockSupabase.from.mockImplementation((table: string) => {
        return {
          select: vi.fn().mockImplementation((_, opts) => {
            if (opts?.count === 'exact') {
              return {
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockResolvedValue({ count: 0, error: null }),
                }),
              };
            }
            return {
              eq: vi.fn().mockReturnValue({
                order: vi.fn().mockReturnValue({
                  limit: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB Notif Error' } }),
                }),
              }),
            };
          }),
        };
      });

      await expect(NotifikasiService.getNotifikasiUser('user-123')).rejects.toThrow(
        'Gagal memuat notifikasi: DB Notif Error'
      );
    });

    it('harus melempar error jika query menghitung unread count gagal', async () => {
      mockSupabase.from.mockImplementation((table: string) => {
        return {
          select: vi.fn().mockImplementation((_, opts) => {
            if (opts?.count === 'exact') {
              return {
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockResolvedValue({ count: null, error: { message: 'DB Count Error' } }),
                }),
              };
            }
            return {
              eq: vi.fn().mockReturnValue({
                order: vi.fn().mockReturnValue({
                  limit: vi.fn().mockResolvedValue({ data: [], error: null }),
                }),
              }),
            };
          }),
        };
      });

      await expect(NotifikasiService.getNotifikasiUser('user-123')).rejects.toThrow(
        'Gagal menghitung notifikasi belum dibaca: DB Count Error'
      );
    });
  });

  // ==========================================
  // 3. Test tandaiSudahDibaca
  // ==========================================
  // ==========================================
  // 3. Test tandaiSudahDibaca
  // ==========================================
  describe('tandaiSudahDibaca', () => {
    it('harus menandai 1 notifikasi spesifik sebagai sudah dibaca', async () => {
      // Mock agar .eq() mengembalikan objek yang bisa di-chain kembali ke .eq()
      const mockQueryChain = {
        eq: vi.fn().mockResolvedValue({ error: null }),
      };
      mockSupabase.update.mockReturnValue({
        eq: vi.fn().mockReturnValue(mockQueryChain),
      });

      const res = await NotifikasiService.tandaiSudahDibaca('user-123', 'notif-99');

      expect(res).toBe(true);
      expect(mockSupabase.update).toHaveBeenCalledWith({ is_read: true });
    });

    it('harus menandai semua notifikasi belum dibaca milik user sebagai sudah dibaca jika id_notifikasi tidak diisi', async () => {
      const mockQueryChain = {
        eq: vi.fn().mockResolvedValue({ error: null }),
      };
      mockSupabase.update.mockReturnValue({
        eq: vi.fn().mockReturnValue(mockQueryChain),
      });

      const res = await NotifikasiService.tandaiSudahDibaca('user-123');

      expect(res).toBe(true);
      expect(mockSupabase.update).toHaveBeenCalledWith({ is_read: true });
    });

    it('harus melempar error jika pembaruan status di Supabase gagal', async () => {
      const mockQueryChain = {
        eq: vi.fn().mockResolvedValue({ error: { message: 'Update error' } }),
      };
      mockSupabase.update.mockReturnValue({
        eq: vi.fn().mockReturnValue(mockQueryChain),
      });

      await expect(NotifikasiService.tandaiSudahDibaca('user-123')).rejects.toThrow(
        'Gagal memperbarui status notifikasi: Update error'
      );
    });
  });
});