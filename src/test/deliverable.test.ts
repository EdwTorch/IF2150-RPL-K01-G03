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
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn(),
      maybeSingle: vi.fn(),
    };

    (createClient as any).mockResolvedValue(mockSupabase);
  });

  // ==========================================
  // 1. Test validasiOwnerPesanan
  // ==========================================
  describe('validasiOwnerPesanan', () => {
    it('harus mengembalikan true jika user adalah id_pengguna_jasa', async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: { id_pengguna_jasa: 'user-1', id_penyedia_jasa: 'user-2' },
      });

      const res = await DeliverablesService.validasiOwnerPesanan('order-1', 'user-1');
      expect(res).toBe(true);
    });

    it('harus melempar error jika pesanan tidak ditemukan', async () => {
      mockSupabase.single.mockResolvedValueOnce({ data: null });

      await expect(
        DeliverablesService.validasiOwnerPesanan('order-invalid', 'user-1')
      ).rejects.toThrow('Pesanan tidak ditemukan');
    });

    it('harus melempar error jika user bukan pemesan atau penyedia', async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: { id_pengguna_jasa: 'user-1', id_penyedia_jasa: 'user-2' },
      });

      await expect(
        DeliverablesService.validasiOwnerPesanan('order-1', 'user-3')
      ).rejects.toThrow('Akses ditolak, pesanan ini bukan milik anda');
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

      // Mock insert produk_akhir
      mockSupabase.single
        .mockResolvedValueOnce({ data: mockResult, error: null }) // insert result
        .mockResolvedValueOnce({ data: mockPesananData, error: null }); // update pesanan result

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
      mockSupabase.single
        .mockResolvedValueOnce({ data: { id: 'prod-1' }, error: null })
        .mockResolvedValueOnce({ data: null, error: { message: 'DB Error Pesanan' } });

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

      const mockData = { id_produk_akhir: 'p-1', id_pesanan: 'order-1' };
      mockSupabase.maybeSingle.mockResolvedValueOnce({ data: mockData, error: null });

      const result = await DeliverablesService.getDeliverableByPesanan('order-1', 'user-1');
      expect(result).toEqual(mockData);
    });

    it('harus throw error jika produk belum dikumpulkan', async () => {
      vi.spyOn(DeliverablesService, 'validasiOwnerPesanan').mockResolvedValueOnce(true);
      mockSupabase.maybeSingle.mockResolvedValueOnce({ data: null, error: null });

      await expect(
        DeliverablesService.getDeliverableByPesanan('order-1', 'user-1')
      ).rejects.toThrow('Hasil pekerjaan belum dikumpulkan.');
    });
  });

  // ==========================================
  // 4. Test requestRevision
  // ==========================================
  describe('requestRevision', () => {
    it('harus throw error jika deskripsi_revisi kosong', async () => {
      vi.spyOn(DeliverablesService, 'validasiOwnerPesanan').mockResolvedValueOnce(true);

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
      vi.spyOn(DeliverablesService, 'validasiOwnerPesanan').mockResolvedValueOnce(true);
      mockSupabase.single.mockResolvedValueOnce({ data: { id_pengguna_jasa: 'other-user' } });

      await expect(
        DeliverablesService.requestRevision({
          id_pesanan: 'order-1',
          deskripsi_revisi: 'Revisi warna',
          id_produk_akhir: 'prod-1',
          user_id: 'client-1',
        })
      ).rejects.toThrow('Akses ditolak. Hanya pengguna jasa yang dapat mengajukan revisi.');
    });

    it('harus throw error jika kuota revisi habis (<= 0)', async () => {
      vi.spyOn(DeliverablesService, 'validasiOwnerPesanan').mockResolvedValueOnce(true);

      // Select pesanan
      mockSupabase.single.mockResolvedValueOnce({ data: { id_pengguna_jasa: 'client-1' } });
      // Select kuota existingRevisi
      mockSupabase.maybeSingle.mockResolvedValueOnce({ data: { jml_revisi_tersedia: 0 } });

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
      vi.spyOn(DeliverablesService, 'validasiOwnerPesanan').mockResolvedValueOnce(true);

      mockSupabase.single
        .mockResolvedValueOnce({ data: { id_pengguna_jasa: 'client-1' } }) // check user
        .mockResolvedValueOnce({ data: { id_revisi: 'rev-1' }, error: null }) // insert revisi
        .mockResolvedValueOnce({
          data: { id_penyedia_jasa: 'seller-1', jasa: { nama_jasa: 'Web App' } },
          error: null,
        }); // update status pesanan

      mockSupabase.maybeSingle.mockResolvedValueOnce({ data: { jml_revisi_tersedia: 2 } }); // current kuota

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
  it('harus throw error jika pesanan sudah berstatus Selesai', async () => {
    vi.spyOn(DeliverablesService, 'validasiOwnerPesanan').mockResolvedValueOnce(true);
    
    mockSupabase.single.mockResolvedValueOnce({
      data: { id_penyedia_jasa: 'seller-1', total_biaya: 100000, status_pesanan: 'Selesai' },
      error: null,
    });

    await expect(
      DeliverablesService.confirmOrderComplete('order-1', 'client-1')
    ).rejects.toThrow('Pesanan ini sudah diselesaikan sebelumnya.');
  });

  it('harus mengupdate saldo penjual dan menyelesaikan pesanan', async () => {
    vi.spyOn(DeliverablesService, 'validasiOwnerPesanan').mockResolvedValueOnce(true);

    // Pastikan eq mengembalikan mockSupabase (this) agar bisa di-chain dengan .single()
    mockSupabase.eq.mockReturnThis();

    // 1. mock .single() untuk query SELECT pesanan pertama (line 326)
    mockSupabase.single.mockResolvedValueOnce({
      data: { id_penyedia_jasa: 'seller-1', total_biaya: 150000, status_pesanan: 'Menunggu Konfirmasi' },
      error: null,
    });

    // 2. mock .single() untuk query SELECT penyedia_jasa saldo (line 354)
    mockSupabase.single.mockResolvedValueOnce({ 
      data: { saldo: 50000 }, 
      error: null 
    });

    // 3. mock .single() untuk query UPDATE pesanan terakhir (line 371)
    mockSupabase.single.mockResolvedValueOnce({
      data: { id_penyedia_jasa: 'seller-1', jasa: { nama_jasa: 'Jasa Logo' } },
      error: null,
    });

    // 4. Mock query yang diakhiri tanpa .single() (seperti insert pencairan_dana & update saldo)
    mockSupabase.insert.mockResolvedValue({ error: null });

    await DeliverablesService.confirmOrderComplete('order-1', 'client-1');

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
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn(),
      maybeSingle: vi.fn(),
    };

    (createClient as any).mockResolvedValue(mockSupabase);
    mockSupabase.eq.mockReturnThis();
  });

  // 1. Coverage: getDeliverableByProdukAkhir
  describe("getDeliverableByProdukAkhir", () => {
    it("harus throw error jika produk akhir tidak ditemukan atau query error", async () => {
      mockSupabase.single.mockResolvedValueOnce({ data: null, error: { message: "Not found" } });

      await expect(
        DeliverablesService.getDeliverableByProdukAkhir("p-invalid", "user-1")
      ).rejects.toThrow("Hasil Pekerjaan tidak ditemukan");
    });

    it("harus mengembalikan produk akhir jika ditemukan dan user adalah owner", async () => {
      vi.spyOn(DeliverablesService, "validasiOwnerPesanan").mockResolvedValueOnce(true);

      const mockData = { id_produk_akhir: "p-1", id_pesanan: "order-1" };
      mockSupabase.single.mockResolvedValueOnce({ data: mockData, error: null });

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
      vi.spyOn(DeliverablesService, "validasiOwnerPesanan").mockResolvedValueOnce(true);
      mockSupabase.single.mockResolvedValueOnce({ data: null, error: { message: "Insert produk error" } });

      await expect(
        DeliverablesService.submitRevisionFix({
          id_pesanan: "order-1",
          deskripsi_produk: "Hasil revisi 1",
          user_id: "penyedia-1",
        })
      ).rejects.toThrow("Insert produk error");
    });

    it("berhasil mengumpulkan hasil perbaikan revisi dan update status pesanan & pengajuan revisi", async () => {
      vi.spyOn(DeliverablesService, "validasiOwnerPesanan").mockResolvedValueOnce(true);

      const mockProdukBaru = { id_produk_akhir: "prod-fix-1" };
      const mockLatestRevisi = { id_revisi: "rev-old" };
      const mockPesananUpdated = {
        id_pengguna_jasa: "klien-1",
        jasa: { nama_jasa: "Desain Logo" },
      };

      mockSupabase.single
        .mockResolvedValueOnce({ data: mockProdukBaru, error: null }) // insert produk_akhir
        .mockResolvedValueOnce({ data: mockPesananUpdated, error: null }); // update pesanan status 'Menunggu Konfirmasi'

      mockSupabase.maybeSingle.mockResolvedValueOnce({ data: mockLatestRevisi }); // get latest revisi

      const res = await DeliverablesService.submitRevisionFix({
        id_pesanan: "order-1",
        deskripsi_produk: "Hasil perbaikan logo",
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

  // 4. Coverage: confirmOrderComplete Error Branches (Line 371 & 381)
  describe("confirmOrderComplete Error Handling Branches", () => {
    it("harus throw error jika gagal menambahkan saldo ke dompet penjual (errSaldo)", async () => {
      vi.spyOn(DeliverablesService, "validasiOwnerPesanan").mockResolvedValueOnce(true);

      mockSupabase.single
        .mockResolvedValueOnce({ data: { id_penyedia_jasa: "p1", total_biaya: 100000, status_pesanan: "Menunggu" } }) // fetch pesanan
        .mockResolvedValueOnce({ data: { saldo: 50000 } }); // fetch penyedia

      mockSupabase.update
        .mockReturnValueOnce({ eq: vi.fn().mockResolvedValue({ error: null }) }) // update status pesanan
        .mockReturnValueOnce({ eq: vi.fn().mockResolvedValue({ error: { message: "Saldo DB Fail" } }) }); // update saldo (ERROR)

      mockSupabase.insert.mockResolvedValueOnce({ error: null }); // insert pencairan

      await expect(DeliverablesService.confirmOrderComplete("order-1", "user-1")).rejects.toThrow(
        "Gagal menambahkan saldo ke dompet penjual: Saldo DB Fail"
      );
    });

    it("harus throw error jika gagal mengupdate state pencairan di tabel pesanan (errUpdate)", async () => {
      vi.spyOn(DeliverablesService, "validasiOwnerPesanan").mockResolvedValueOnce(true);

      mockSupabase.single
        .mockResolvedValueOnce({ data: { id_penyedia_jasa: "p1", total_biaya: 100000, status_pesanan: "Menunggu" } }) // fetch pesanan
        .mockResolvedValueOnce({ data: { saldo: 50000 } }) // fetch penyedia
        .mockResolvedValueOnce({ data: null, error: { message: "Update state fail" } }); // update state pencairan pesanan (ERROR)

      mockSupabase.update
        .mockReturnValueOnce({ eq: vi.fn().mockResolvedValue({ error: null }) }) // update status pesanan
        .mockReturnValueOnce({ eq: vi.fn().mockResolvedValue({ error: null }) }); // update saldo

      mockSupabase.insert.mockResolvedValueOnce({ error: null }); // insert pencairan

      await expect(DeliverablesService.confirmOrderComplete("order-1", "user-1")).rejects.toThrow(
        "Gagal mengupdate state pencairan di tabel pesanan"
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
