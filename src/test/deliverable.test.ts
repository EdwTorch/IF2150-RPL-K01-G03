import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DeliverablesService, FOLDER_DELIVERABLE, MAKS_UKURAN_DELIVERABLE } from '../services/deliverables.service';
import { createClient } from '@/lib/supabase/server';
import { NotifikasiService } from '../services/notifikasi.service';
import { getStorageService } from '@/services/storage';

// 1. Mocking Dependencies
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('@/services/notifikasi.service', () => ({
  NotifikasiService: {
    kirimNotifikasi: vi.fn().mockResolvedValue(true),
  },
}));

// Tambahkan juga mock path relative untuk mengantisipasi resolution Vitest:
vi.mock('../services/notifikasi.service', () => ({
  NotifikasiService: {
    kirimNotifikasi: vi.fn().mockResolvedValue(true),
  },
}));

vi.mock('@/services/storage', () => ({
  getStorageService: vi.fn(),
}));

describe('DeliverablesService', () => {
  let mockSupabase: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mock Supabase chained methods
    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      is: vi.fn().mockReturnThis(),
      not: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn(),
      maybeSingle: vi.fn(),
      rpc: vi.fn().mockResolvedValue({ error: null }),
    };

    (createClient as any).mockResolvedValue(mockSupabase);
  });

  // ==========================================
  // 1. Test validasiOwnerPesanan
  // ==========================================
  describe('validasiOwnerPesanan', () => {
    it('harus mengembalikan true jika user adalah id_pengguna_jasa', async () => {
      mockSupabase.maybeSingle.mockResolvedValueOnce({
        data: { id_pengguna_jasa: 'user-1', id_penyedia_jasa: 'user-2' },
        error: null,
      });

      const res = await DeliverablesService.validasiOwnerPesanan('order-1', 'user-1');
      expect(res).toBe(true);
    });

    it('harus melempar error jika pesanan tidak ditemukan', async () => {
      mockSupabase.maybeSingle.mockResolvedValueOnce({ data: null, error: null });

      await expect(
        DeliverablesService.validasiOwnerPesanan('order-invalid', 'user-1')
      ).rejects.toThrow('Pesanan tidak ditemukan.');
    });

    it('harus melempar error jika user bukan pemesan atau penyedia', async () => {
      mockSupabase.maybeSingle.mockResolvedValueOnce({
        data: { id_pengguna_jasa: 'user-1', id_penyedia_jasa: 'user-2' },
        error: null,
      });

      await expect(
        DeliverablesService.validasiOwnerPesanan('order-1', 'user-3')
      ).rejects.toThrow('Akses ditolak. Pesanan ini bukan milik Anda.');
    });
  });

  // ==========================================
  // 2. Test submitDeliverable
  // ==========================================
  describe('submitDeliverable', () => {
    it('harus throw error jika deskripsi_produk kosong', async () => {
      await expect(
        DeliverablesService.submitDeliverable({
          id_pesanan: 'order-1',
          deskripsi_produk: '',
          file_url: 'http://example.com/file.pdf',
        })
      ).rejects.toThrow('Deskripsi hasil pekerjaan tidak boleh kosong.');
    });

    it('harus throw error jika file_url dan output_path keduanya kosong', async () => {
      await expect(
        DeliverablesService.submitDeliverable({
          id_pesanan: 'order-1',
          deskripsi_produk: 'Deskripsi valid',
        })
      ).rejects.toThrow('Unggah berkas atau sertakan tautan hasil pekerjaan.');
    });

    it('harus berhasil submit deliverable dan mengirm notifikasi', async () => {
      const mockResult = { id_produk_akhir: 'prod-1', id_pesanan: 'order-1' };
      const mockPesananData = {
        id_pesanan: 'order-1',
        id_pengguna_jasa: 'client-1',
        jasa: { nama_jasa: 'Desain Logo' },
      };

      // Mock insert produk_akhir & fetch pesanan notification info
      mockSupabase.single.mockResolvedValueOnce({ data: mockResult, error: null });
      mockSupabase.maybeSingle.mockResolvedValueOnce({ data: mockPesananData, error: null });

      const res = await DeliverablesService.submitDeliverable({
        id_pesanan: 'order-1',
        deskripsi_produk: 'Hasil Desain Final',
        file_url: 'http://example.com/logo.png',
      });

      expect(res).toEqual(mockResult);
      expect(NotifikasiService.kirimNotifikasi).toHaveBeenCalledWith(
        expect.objectContaining({
          id_pengguna: 'client-1',
          id_pesanan: 'order-1',
        })
      );
    });

    it('harus throw error jika pembaruan status pesanan gagal', async () => {
      mockSupabase.single.mockResolvedValueOnce({ data: { id: 'prod-1' }, error: null });
      mockSupabase.update.mockReturnValueOnce({
        eq: vi.fn().mockResolvedValueOnce({ error: { message: 'DB Error Pesanan' } }),
      });

      await expect(
        DeliverablesService.submitDeliverable({
          id_pesanan: 'order-1',
          deskripsi_produk: 'Desain',
          file_url: 'http://example.com/file.png',
        })
      ).rejects.toThrow('Gagal memperbarui status pesanan: DB Error Pesanan');
    });
  });

  // ==========================================
  // 3. Test getDeliverableByPesanan & getDeliverableByProdukAkhir
  // ==========================================
  describe('getDeliverableByPesanan', () => {
    it('harus mengembalikan produk akhir jika ditemukan', async () => {
      // Mock validasi owner
      vi.spyOn(DeliverablesService, 'validasiOwnerPesanan').mockResolvedValueOnce(true);

      const mockData = {
        id_produk_akhir: 'p-1',
        id_pesanan: 'order-1',
        file_url: 'https://example.com/file.png',
      };
      mockSupabase.maybeSingle.mockResolvedValueOnce({ data: mockData, error: null });

      const result = await DeliverablesService.getDeliverableByPesanan('order-1', 'user-1');
      expect(result).toEqual({
        ...mockData,
        file_download_url: 'https://example.com/file.png',
      });
    });

    it('harus mengembalikan null jika produk belum dikumpulkan', async () => {
      vi.spyOn(DeliverablesService, 'validasiOwnerPesanan').mockResolvedValueOnce(true);
      mockSupabase.maybeSingle.mockResolvedValueOnce({ data: null, error: null });

      const result = await DeliverablesService.getDeliverableByPesanan('order-1', 'user-1');
      expect(result).toBeNull();
    });
  });

  // ==========================================
  // 4. Test requestRevision
  // ==========================================
  describe('requestRevision', () => {
    it('harus throw error jika deskripsi_revisi kosong', async () => {
      vi.spyOn(DeliverablesService, 'validasiPenggunaJasa').mockResolvedValueOnce(true);

      await expect(
        DeliverablesService.requestRevision({
          id_pesanan: 'order-1',
          deskripsi_revisi: '   ',
          id_produk_akhir: 'prod-1',
          user_id: 'client-1',
        })
      ).rejects.toThrow('Deskripsi revisi wajib diisi.');
    });

    it('harus throw error jika user_id bukan id_pengguna_jasa pesanan', async () => {
      mockSupabase.maybeSingle.mockResolvedValueOnce({
        data: { id_pengguna_jasa: 'other-user' },
        error: null,
      });

      await expect(
        DeliverablesService.requestRevision({
          id_pesanan: 'order-1',
          deskripsi_revisi: 'Revisi warna',
          id_produk_akhir: 'prod-1',
          user_id: 'client-1',
        })
      ).rejects.toThrow('Akses ditolak. Hanya pengguna jasa pemilik pesanan yang dapat melakukan tindakan ini.');
    });

    it('harus throw error jika kuota revisi habis (<= 0)', async () => {
      vi.spyOn(DeliverablesService, 'validasiPenggunaJasa').mockResolvedValueOnce(true);

      mockSupabase.maybeSingle
        .mockResolvedValueOnce({ data: { id_produk_akhir: 'prod-1' }, error: null })
        .mockResolvedValueOnce({
          data: {
            id_revisi: 'rev-prev',
            jml_revisi_tersedia: 0,
            status_pengerjaan: 'Revisi Dikumpulkan',
          },
          error: null,
        });

      await expect(
        DeliverablesService.requestRevision({
          id_pesanan: 'order-1',
          deskripsi_revisi: 'Ubah font',
          id_produk_akhir: 'prod-1',
          user_id: 'client-1',
        })
      ).rejects.toThrow('Kuota revisi untuk pesanan ini sudah habis.');
    });

    it('harus berhasil mengajukan revisi dan mengurangi kuota', async () => {
      vi.spyOn(DeliverablesService, 'validasiPenggunaJasa').mockResolvedValueOnce(true);

      mockSupabase.maybeSingle
        .mockResolvedValueOnce({ data: { id_produk_akhir: 'prod-1' }, error: null })
        .mockResolvedValueOnce({
          data: {
            id_revisi: 'rev-prev',
            jml_revisi_tersedia: 2,
            status_pengerjaan: 'Revisi Dikumpulkan',
          },
          error: null,
        })
        .mockResolvedValueOnce({
          data: { id_penyedia_jasa: 'seller-1', jasa: { nama_jasa: 'Web App' } },
          error: null,
        });

      mockSupabase.single.mockResolvedValueOnce({ data: { id_revisi: 'rev-1' }, error: null });

      const res = await DeliverablesService.requestRevision({
        id_pesanan: 'order-1',
        deskripsi_revisi: 'Perbaiki tombol',
        id_produk_akhir: 'prod-1',
        user_id: 'client-1',
      });

      expect(res).toEqual({ id_revisi: 'rev-1' });
      expect(NotifikasiService.kirimNotifikasi).toHaveBeenCalledWith(
        expect.objectContaining({
          id_pengguna: 'seller-1',
        })
      );
    });
  });

  // ==========================================
  // 5. Test confirmOrderComplete
  // ==========================================
describe('confirmOrderComplete', () => {
  it('harus throw error jika user bukan pengguna jasa pemilik pesanan', async () => {
    mockSupabase.maybeSingle.mockResolvedValueOnce({
      data: { id_pengguna_jasa: 'other-client' },
      error: null,
    });

    await expect(
      DeliverablesService.confirmOrderComplete('order-1', 'client-1')
    ).rejects.toThrow('Akses ditolak. Hanya pengguna jasa pemilik pesanan yang dapat melakukan tindakan ini.');
  });

  it('harus memanggil rpc konfirmasi_pesanan_selesai dan mengirim notifikasi', async () => {
    vi.spyOn(DeliverablesService, 'validasiPenggunaJasa').mockResolvedValueOnce(true);

    mockSupabase.single.mockResolvedValueOnce({
      data: { id_penyedia_jasa: 'seller-1', total_biaya: 150000, jasa: { nama_jasa: 'Jasa Logo' } },
      error: null,
    });
    mockSupabase.rpc.mockResolvedValueOnce({ error: null });

    await DeliverablesService.confirmOrderComplete('order-1', 'client-1');

    expect(mockSupabase.rpc).toHaveBeenCalledWith('konfirmasi_pesanan_selesai', {
      p_id_pesanan: 'order-1',
    });
    expect(NotifikasiService.kirimNotifikasi).toHaveBeenCalled();
  });
});

  // ==========================================
  // 6. Test unggahBerkasDeliverable
  // ==========================================
  describe('unggahBerkasDeliverable', () => {
    it('harus throw error jika ukuran file melebihi 50 MB', async () => {
      const largeFile = new File(['a'.repeat(51 * 1024 * 1024)], 'large.pdf', { type: 'application/pdf' });

      await expect(DeliverablesService.unggahBerkasDeliverable(largeFile)).rejects.toThrow(
        'Ukuran berkas melebihi batas maksimum 50 MB'
      );
    });

    it('harus throw error jika tipe file tidak diizinkan', async () => {
      const invalidFile = new File(['hello'], 'script.exe', { type: 'application/x-msdownload' });

      await expect(DeliverablesService.unggahBerkasDeliverable(invalidFile)).rejects.toThrow(
        'Tipe berkas application/x-msdownload tidak diizinkan untuk deliverable'
      );
    });

    it('harus mengembalikan URL berkas ketika unggah berhasil', async () => {
      const mockUpload = vi.fn().mockResolvedValue({ url: 'https://storage.com/file.png', error: null });
      (getStorageService as any).mockReturnValue({ upload: mockUpload });

      const validFile = new File(['image-content'], 'test.png', { type: 'image/png' });
      const url = await DeliverablesService.unggahBerkasDeliverable(validFile);

      expect(url).toBe('https://storage.com/file.png');
      expect(mockUpload).toHaveBeenCalledWith(validFile, FOLDER_DELIVERABLE);
    });
  });
  // =========================================================================
// TEST CASE TAMBAHAN UNTUK MENUTUP BARIS 97, 109–148, 221, 248–314, 371, 381
// =========================================================================

describe("DeliverablesService Additional Coverage", () => {
  let mockSupabase: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      is: vi.fn().mockReturnThis(),
      not: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn(),
      maybeSingle: vi.fn(),
      rpc: vi.fn().mockResolvedValue({ error: null }),
    };

    (createClient as any).mockResolvedValue(mockSupabase);
    mockSupabase.eq.mockReturnThis();
  });

  // 1. Coverage: getDeliverableByProdukAkhir
  describe("getDeliverableByProdukAkhir", () => {
    it("harus throw error jika produk akhir tidak ditemukan atau query error", async () => {
      mockSupabase.maybeSingle.mockResolvedValueOnce({ data: null, error: null });

      await expect(
        DeliverablesService.getDeliverableByProdukAkhir("p-invalid", "user-1")
      ).rejects.toThrow("Hasil pekerjaan tidak ditemukan.");
    });

    it("harus mengembalikan produk akhir jika ditemukan dan user adalah owner", async () => {
      vi.spyOn(DeliverablesService, "validasiOwnerPesanan").mockResolvedValueOnce(true);

      const mockData = { id_produk_akhir: "p-1", id_pesanan: "order-1" };
      mockSupabase.maybeSingle.mockResolvedValueOnce({ data: mockData, error: null });

      const res = await DeliverablesService.getDeliverableByProdukAkhir("p-1", "user-1");
      expect(res).toEqual(mockData);
      expect(DeliverablesService.validasiOwnerPesanan).toHaveBeenCalledWith("order-1", "user-1");
    });
  });

  // 2. Coverage: getRevisionHistory
  describe("getRevisionHistory", () => {
    it("harus throw error jika query riwayat revisi gagal di Supabase", async () => {
      vi.spyOn(DeliverablesService, "validasiOwnerPesanan").mockResolvedValueOnce(true);
      mockSupabase.order.mockResolvedValueOnce({ data: null, error: { message: "DB Error History" } });

      await expect(
        DeliverablesService.getRevisionHistory("order-1", "user-1")
      ).rejects.toThrow("Gagal mengambil riwayat revisi: DB Error History");
    });

    it("harus mengembalikan daftar riwayat revisi", async () => {
      vi.spyOn(DeliverablesService, "validasiOwnerPesanan").mockResolvedValueOnce(true);
      const mockHistory = [{ id_revisi: "rev-1", deskripsi_revisi: "Perbaiki warna" }];
      mockSupabase.order.mockResolvedValueOnce({ data: mockHistory, error: null });

      const res = await DeliverablesService.getRevisionHistory("order-1", "user-1");
      expect(res).toEqual(mockHistory);
    });
  });

  // 3. Coverage: submitRevisionFix
  describe("submitRevisionFix", () => {
    it("harus throw error jika insert produk akhir perbaikan gagal", async () => {
      vi.spyOn(DeliverablesService, "validasiPenyediaJasa").mockResolvedValueOnce(true);
      mockSupabase.maybeSingle.mockResolvedValueOnce({ data: { id_revisi: "rev-old" }, error: null });
      mockSupabase.insert.mockReturnValueOnce({
        select: vi.fn().mockResolvedValueOnce({ data: null, error: { message: "Insert produk error" } }),
      });

      await expect(
        DeliverablesService.submitRevisionFix({
          id_pesanan: "order-1",
          deskripsi_produk: "Hasil revisi 1",
          file_urls: ["https://example.com/fix1.png"],
          user_id: "penyedia-1",
        })
      ).rejects.toThrow("Insert produk error");
    });

    it("berhasil mengumpulkan hasil perbaikan revisi dan update status pesanan & pengajuan revisi", async () => {
      vi.spyOn(DeliverablesService, "validasiPenyediaJasa").mockResolvedValueOnce(true);

      const mockProdukBaru = [{ id_produk_akhir: "prod-fix-1" }];
      const mockLatestRevisi = { id_revisi: "rev-old" };
      const mockPesananUpdated = {
        id_pengguna_jasa: "klien-1",
        jasa: { nama_jasa: "Desain Logo" },
      };

      mockSupabase.maybeSingle
        .mockResolvedValueOnce({ data: mockLatestRevisi, error: null })
        .mockResolvedValueOnce({ data: { id_revisi: "rev-old" }, error: null })
        .mockResolvedValueOnce({ data: { id_pesanan: "order-1" }, error: null })
        .mockResolvedValueOnce({ data: mockPesananUpdated, error: null });

      mockSupabase.insert.mockReturnValueOnce({
        select: vi.fn().mockResolvedValueOnce({ data: mockProdukBaru, error: null }),
      });

      const res = await DeliverablesService.submitRevisionFix({
        id_pesanan: "order-1",
        deskripsi_produk: "Hasil perbaikan logo",
        file_urls: ["https://example.com/fix1.png"],
        user_id: "penyedia-1",
      });

      expect(res).toEqual(mockProdukBaru);
      expect(mockSupabase.update).toHaveBeenCalledWith(
        expect.objectContaining({ status_pengerjaan: "Revisi Dikumpulkan" })
      );
      expect(NotifikasiService.kirimNotifikasi).toHaveBeenCalledWith(
        expect.objectContaining({ id_pengguna: "klien-1" })
      );
    });
  });

  // 4. Coverage: confirmOrderComplete Error Branches
  describe("confirmOrderComplete Error Handling Branches", () => {
    it("harus throw error jika gagal mengambil data pesanan", async () => {
      vi.spyOn(DeliverablesService, "validasiPenggunaJasa").mockResolvedValueOnce(true);

      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: { message: "Pesanan fail" },
      });

      await expect(DeliverablesService.confirmOrderComplete("order-1", "user-1")).rejects.toThrow(
        "Pesanan tidak ditemukan: Pesanan fail"
      );
    });

    it("harus throw error jika RPC konfirmasi_pesanan_selesai gagal", async () => {
      vi.spyOn(DeliverablesService, "validasiPenggunaJasa").mockResolvedValueOnce(true);

      mockSupabase.single.mockResolvedValueOnce({
        data: { id_penyedia_jasa: "p1", total_biaya: 100000, jasa: { nama_jasa: "Jasa" } },
        error: null,
      });
      mockSupabase.rpc.mockResolvedValueOnce({ error: { message: "RPC DB Fail" } });

      await expect(DeliverablesService.confirmOrderComplete("order-1", "user-1")).rejects.toThrow(
        "Gagal mengonfirmasi pesanan dan mencairkan dana: RPC DB Fail"
      );
    });
  });

  // 5. Coverage: unggahBerkasDeliverable
  describe("unggahBerkasDeliverable", () => {
    it("harus throw error jika ukuran berkas melebihi 50 MB", async () => {
      const bigFile = new File(["a".repeat(100)], "big.png", { type: "image/png" });
      Object.defineProperty(bigFile, "size", { value: 51 * 1024 * 1024 });

      await expect(DeliverablesService.unggahBerkasDeliverable(bigFile)).rejects.toThrow(
        "Ukuran berkas melebihi batas maksimum 50 MB"
      );
    });

    it("harus throw error jika tipe berkas tidak diizinkan", async () => {
      const invalidFile = new File(["test"], "exe.exe", { type: "application/x-msdownload" });

      await expect(DeliverablesService.unggahBerkasDeliverable(invalidFile)).rejects.toThrow(
        "Tipe berkas application/x-msdownload tidak diizinkan untuk deliverable"
      );
    });
  });
});
});
