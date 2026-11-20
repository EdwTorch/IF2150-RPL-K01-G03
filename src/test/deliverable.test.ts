import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  DeliverablesService,
  FOLDER_DELIVERABLE,
  MAKS_UKURAN_DELIVERABLE,
} from "@/services/deliverables.service";
import { createClient } from "@/lib/supabase/server";
import { NotifikasiService } from "@/services/notifikasi.service";
import { SupabaseStorageService } from "@/services/storage/supabase.storage";
import { getStorageService } from "@/services/storage";

// 1. Mock External Dependencies
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("@/services/notifikasi.service", () => ({
  NotifikasiService: {
    kirimNotifikasi: vi.fn().mockResolvedValue(true),
  },
}));

vi.mock("@/services/storage", () => ({
  getStorageService: vi.fn(),
}));

vi.mock("@/services/storage/supabase.storage", () => {
  return {
    SupabaseStorageService: vi.fn(),
  };
});

describe("DeliverablesService", () => {
  let mockSupabase: any;
  let mockStorageService: any;

  beforeEach(() => {
    vi.clearAllMocks();

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

    mockStorageService = {
      buatSignedUrlProdukAkhir: vi
        .fn()
        .mockResolvedValue("https://storage.local/signed-view.png"),
      buatSignedUrlUnduhProdukAkhir: vi
        .fn()
        .mockResolvedValue("https://storage.local/signed-download.png"),
    };

    // Menggunakan regular function agar dapat dipanggil dengan 'new SupabaseStorageService()'
    (SupabaseStorageService as any).mockImplementation(function () {
      return mockStorageService;
    });
  });

  // ==========================================
  // 1. Test validasiOwnerPesanan
  // ==========================================
  describe("validasiOwnerPesanan", () => {
    it("harus mengembalikan true jika user adalah id_pengguna_jasa", async () => {
      mockSupabase.maybeSingle.mockResolvedValueOnce({
        data: { id_pengguna_jasa: "user-1", id_penyedia_jasa: "user-2" },
        error: null,
      });

      const res = await DeliverablesService.validasiOwnerPesanan("order-1", "user-1");
      expect(res).toBe(true);
    });

    it("harus mengembalikan true jika user adalah id_penyedia_jasa", async () => {
      mockSupabase.maybeSingle.mockResolvedValueOnce({
        data: { id_pengguna_jasa: "user-1", id_penyedia_jasa: "user-2" },
        error: null,
      });

      const res = await DeliverablesService.validasiOwnerPesanan("order-1", "user-2");
      expect(res).toBe(true);
    });

    it("harus melempar error jika query Supabase error", async () => {
      mockSupabase.maybeSingle.mockResolvedValueOnce({
        data: null,
        error: { message: "DB Error Validasi" },
      });

      await expect(
        DeliverablesService.validasiOwnerPesanan("order-1", "user-1")
      ).rejects.toThrow("Gagal memvalidasi pesanan: DB Error Validasi");
    });

    it("harus melempar error jika pesanan tidak ditemukan", async () => {
      mockSupabase.maybeSingle.mockResolvedValueOnce({ data: null, error: null });

      await expect(
        DeliverablesService.validasiOwnerPesanan("order-invalid", "user-1")
      ).rejects.toThrow("Pesanan tidak ditemukan.");
    });

    it("harus melempar error jika user bukan pemesan atau penyedia", async () => {
      mockSupabase.maybeSingle.mockResolvedValueOnce({
        data: { id_pengguna_jasa: "user-1", id_penyedia_jasa: "user-2" },
        error: null,
      });

      await expect(
        DeliverablesService.validasiOwnerPesanan("order-1", "user-3")
      ).rejects.toThrow("Akses ditolak. Pesanan ini bukan milik Anda.");
    });
  });

  // ==========================================
  // 2. Test validasiPenggunaJasa
  // ==========================================
  describe("validasiPenggunaJasa", () => {
    it("harus mengembalikan true jika user adalah pengguna jasa pemilik pesanan", async () => {
      mockSupabase.maybeSingle.mockResolvedValueOnce({
        data: { id_pengguna_jasa: "client-1" },
        error: null,
      });

      const res = await DeliverablesService.validasiPenggunaJasa("order-1", "client-1");
      expect(res).toBe(true);
    });

    it("harus melempar error jika query database gagal", async () => {
      mockSupabase.maybeSingle.mockResolvedValueOnce({
        data: null,
        error: { message: "Koneksi terputus" },
      });

      await expect(
        DeliverablesService.validasiPenggunaJasa("order-1", "client-1")
      ).rejects.toThrow("Gagal memvalidasi pesanan: Koneksi terputus");
    });

    it("harus melempar error jika pesanan tidak ditemukan", async () => {
      mockSupabase.maybeSingle.mockResolvedValueOnce({ data: null, error: null });

      await expect(
        DeliverablesService.validasiPenggunaJasa("order-404", "client-1")
      ).rejects.toThrow("Pesanan tidak ditemukan.");
    });

    it("harus melempar error jika user bukan pengguna jasa pesanan", async () => {
      mockSupabase.maybeSingle.mockResolvedValueOnce({
        data: { id_pengguna_jasa: "client-lain" },
        error: null,
      });

      await expect(
        DeliverablesService.validasiPenggunaJasa("order-1", "client-1")
      ).rejects.toThrow(
        "Akses ditolak. Hanya pengguna jasa pemilik pesanan yang dapat melakukan tindakan ini."
      );
    });
  });

  // ==========================================
  // 3. Test validasiPenyediaJasa
  // ==========================================
  describe("validasiPenyediaJasa", () => {
    it("harus mengembalikan true jika user adalah penyedia jasa pemilik pesanan", async () => {
      mockSupabase.maybeSingle.mockResolvedValueOnce({
        data: { id_penyedia_jasa: "seller-1" },
        error: null,
      });

      const res = await DeliverablesService.validasiPenyediaJasa("order-1", "seller-1");
      expect(res).toBe(true);
    });

    it("harus melempar error jika query database gagal", async () => {
      mockSupabase.maybeSingle.mockResolvedValueOnce({
        data: null,
        error: { message: "Timeout" },
      });

      await expect(
        DeliverablesService.validasiPenyediaJasa("order-1", "seller-1")
      ).rejects.toThrow("Gagal memvalidasi pesanan: Timeout");
    });

    it("harus melempar error jika pesanan tidak ditemukan", async () => {
      mockSupabase.maybeSingle.mockResolvedValueOnce({ data: null, error: null });

      await expect(
        DeliverablesService.validasiPenyediaJasa("order-404", "seller-1")
      ).rejects.toThrow("Pesanan tidak ditemukan.");
    });

    it("harus melempar error jika user bukan penyedia jasa pesanan", async () => {
      mockSupabase.maybeSingle.mockResolvedValueOnce({
        data: { id_penyedia_jasa: "seller-lain" },
        error: null,
      });

      await expect(
        DeliverablesService.validasiPenyediaJasa("order-1", "seller-1")
      ).rejects.toThrow(
        "Akses ditolak. Hanya penyedia jasa pemilik pesanan yang dapat melakukan tindakan ini."
      );
    });
  });

  // ==========================================
  // 4. Test submitDeliverable
  // ==========================================
  describe("submitDeliverable", () => {
    it("harus throw error jika deskripsi_produk kosong", async () => {
      await expect(
        DeliverablesService.submitDeliverable({
          id_pesanan: "order-1",
          deskripsi_produk: "",
          file_url: "http://example.com/file.pdf",
        })
      ).rejects.toThrow("Deskripsi hasil pekerjaan tidak boleh kosong.");
    });

    it("harus throw error jika file_url dan output_path keduanya kosong", async () => {
      await expect(
        DeliverablesService.submitDeliverable({
          id_pesanan: "order-1",
          deskripsi_produk: "Deskripsi valid",
        })
      ).rejects.toThrow("Unggah berkas atau sertakan tautan hasil pekerjaan.");
    });

    it("harus melempar error jika insert produk_akhir gagal", async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: { message: "Insert error" },
      });

      await expect(
        DeliverablesService.submitDeliverable({
          id_pesanan: "order-1",
          deskripsi_produk: "Hasil Desain",
          file_url: "http://example.com/logo.png",
        })
      ).rejects.toThrow("Gagal menyimpan hasil pekerjaan: Insert error");
    });

    it("harus throw error jika pembaruan status pesanan gagal", async () => {
      mockSupabase.single.mockResolvedValueOnce({ data: { id: "prod-1" }, error: null });
      mockSupabase.update.mockReturnValueOnce({
        eq: vi.fn().mockResolvedValueOnce({ error: { message: "DB Error Pesanan" } }),
      });

      await expect(
        DeliverablesService.submitDeliverable({
          id_pesanan: "order-1",
          deskripsi_produk: "Desain",
          file_url: "http://example.com/file.png",
        })
      ).rejects.toThrow("Gagal memperbarui status pesanan: DB Error Pesanan");
    });

    it("harus berhasil submit deliverable dan mengirim notifikasi jika pengguna jasa ada", async () => {
      const mockResult = { id_produk_akhir: "prod-1", id_pesanan: "order-1" };
      const mockPesananData = {
        id_pesanan: "order-1",
        id_pengguna_jasa: "client-1",
        jasa: { nama_jasa: "Desain Logo" },
      };

      mockSupabase.single.mockResolvedValueOnce({ data: mockResult, error: null });
      mockSupabase.maybeSingle.mockResolvedValueOnce({ data: mockPesananData, error: null });

      const res = await DeliverablesService.submitDeliverable({
        id_pesanan: "order-1",
        deskripsi_produk: "Hasil Desain Final",
        file_url: "http://example.com/logo.png",
      });

      expect(res).toEqual(mockResult);
      expect(NotifikasiService.kirimNotifikasi).toHaveBeenCalledWith(
        expect.objectContaining({
          id_pengguna: "client-1",
          id_pesanan: "order-1",
        })
      );
    });

    it("harus berhasil submit deliverable tanpa kirim notifikasi jika pengguna jasa tidak ada", async () => {
      const mockResult = { id_produk_akhir: "prod-1", id_pesanan: "order-1" };

      mockSupabase.single.mockResolvedValueOnce({ data: mockResult, error: null });
      mockSupabase.maybeSingle.mockResolvedValueOnce({ data: null, error: null });

      const res = await DeliverablesService.submitDeliverable({
        id_pesanan: "order-1",
        deskripsi_produk: "Hasil Desain",
        output_path: "storage-path.zip",
      });

      expect(res).toEqual(mockResult);
      expect(NotifikasiService.kirimNotifikasi).not.toHaveBeenCalled();
    });
  });

  // ==========================================
  // 5. Test getDeliverableByPesanan
  // ==========================================
  describe("getDeliverableByPesanan", () => {
    it("harus melempar error jika query produk_akhir gagal", async () => {
      vi.spyOn(DeliverablesService, "validasiOwnerPesanan").mockResolvedValueOnce(true);
      mockSupabase.maybeSingle.mockResolvedValueOnce({
        data: null,
        error: { message: "Query produk error" },
      });

      await expect(
        DeliverablesService.getDeliverableByPesanan("order-1", "user-1")
      ).rejects.toThrow("Query produk error");
    });

    it("harus mengembalikan null jika produk belum dikumpulkan", async () => {
      vi.spyOn(DeliverablesService, "validasiOwnerPesanan").mockResolvedValueOnce(true);
      mockSupabase.maybeSingle.mockResolvedValueOnce({ data: null, error: null });

      const result = await DeliverablesService.getDeliverableByPesanan("order-1", "user-1");
      expect(result).toBeNull();
    });

    it("harus mengembalikan produk akhir jika file_url berupa HTTP/HTTPS direct link", async () => {
      vi.spyOn(DeliverablesService, "validasiOwnerPesanan").mockResolvedValueOnce(true);

      const mockData = {
        id_produk_akhir: "p-1",
        id_pesanan: "order-1",
        file_url: "https://example.com/file.png",
      };
      mockSupabase.maybeSingle.mockResolvedValueOnce({ data: mockData, error: null });

      const result = await DeliverablesService.getDeliverableByPesanan("order-1", "user-1");
      expect(result).toEqual({
        ...mockData,
        file_download_url: "https://example.com/file.png",
      });
    });

    it("harus mengembalikan signed URL jika file_url berupa path storage", async () => {
      vi.spyOn(DeliverablesService, "validasiOwnerPesanan").mockResolvedValueOnce(true);

      const mockData = {
        id_produk_akhir: "p-1",
        id_pesanan: "order-1",
        file_url: "deliverables-uploads/file.png",
      };
      mockSupabase.maybeSingle.mockResolvedValueOnce({ data: mockData, error: null });

      const result = await DeliverablesService.getDeliverableByPesanan("order-1", "user-1");

      expect(result).toEqual({
        ...mockData,
        file_url: "https://storage.local/signed-view.png",
        file_download_url: "https://storage.local/signed-download.png",
      });
    });

    it("harus melempar error jika pembuatan signed URL gagal", async () => {
      vi.spyOn(DeliverablesService, "validasiOwnerPesanan").mockResolvedValueOnce(true);

      mockStorageService.buatSignedUrlProdukAkhir.mockResolvedValueOnce("");
      const mockData = {
        id_produk_akhir: "p-1",
        id_pesanan: "order-1",
        file_url: "deliverables-uploads/file.png",
      };
      mockSupabase.maybeSingle.mockResolvedValueOnce({ data: mockData, error: null });

      await expect(
        DeliverablesService.getDeliverableByPesanan("order-1", "user-1")
      ).rejects.toThrow("Gagal membuat URL hasil pekerjaan.");
    });
  });

  // ==========================================
  // 6. Test getDeliverableByProdukAkhir
  // ==========================================
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

  // ==========================================
  // 7. Test getRevisionHistory
  // ==========================================
  describe("getRevisionHistory", () => {
    it("harus throw error jika query riwayat revisi gagal di Supabase", async () => {
      vi.spyOn(DeliverablesService, "validasiOwnerPesanan").mockResolvedValueOnce(true);
      mockSupabase.order.mockResolvedValueOnce({ data: null, error: { message: "DB Error History" } });

      await expect(
        DeliverablesService.getRevisionHistory("order-1", "user-1")
      ).rejects.toThrow("Gagal mengambil riwayat revisi: DB Error History");
    });

    it("harus mengembalikan array kosong jika data dari database null", async () => {
      vi.spyOn(DeliverablesService, "validasiOwnerPesanan").mockResolvedValueOnce(true);
      mockSupabase.order.mockResolvedValueOnce({ data: null, error: null });

      const res = await DeliverablesService.getRevisionHistory("order-1", "user-1");
      expect(res).toEqual([]);
    });

    it("harus mengembalikan daftar riwayat revisi", async () => {
      vi.spyOn(DeliverablesService, "validasiOwnerPesanan").mockResolvedValueOnce(true);
      const mockHistory = [{ id_revisi: "rev-1", deskripsi_revisi: "Perbaiki warna" }];
      mockSupabase.order.mockResolvedValueOnce({ data: mockHistory, error: null });

      const res = await DeliverablesService.getRevisionHistory("order-1", "user-1");
      expect(res).toEqual(mockHistory);
    });
  });

  // ==========================================
  // 8. Test getRevisionAttachments
  // ==========================================
  describe("getRevisionAttachments", () => {
    it("harus melempar error jika query database gagal", async () => {
      vi.spyOn(DeliverablesService, "validasiOwnerPesanan").mockResolvedValueOnce(true);
      mockSupabase.order.mockResolvedValueOnce({
        data: null,
        error: { message: "Query Lampiran Error" },
      });

      await expect(
        DeliverablesService.getRevisionAttachments("order-1", "user-1")
      ).rejects.toThrow("Gagal mengambil hasil revisi: Query Lampiran Error");
    });

    it("harus memproses berkas dengan URL HTTP/HTTPS secara langsung", async () => {
      vi.spyOn(DeliverablesService, "validasiOwnerPesanan").mockResolvedValueOnce(true);
      const mockRows = [
        { id_produk_akhir: "p-1", file_url: "https://example.com/rev.png" },
      ];
      mockSupabase.order.mockResolvedValueOnce({ data: mockRows, error: null });

      const result = await DeliverablesService.getRevisionAttachments("order-1", "user-1");
      expect(result).toEqual([
        {
          id_produk_akhir: "p-1",
          file_url: "https://example.com/rev.png",
          file_download_url: "https://example.com/rev.png",
        },
      ]);
    });

    it("harus membuat signed URL untuk berkas bertipe path Storage", async () => {
      vi.spyOn(DeliverablesService, "validasiOwnerPesanan").mockResolvedValueOnce(true);
      const mockRows = [
        { id_produk_akhir: "p-2", file_url: "folder/rev2.png" },
      ];
      mockSupabase.order.mockResolvedValueOnce({ data: mockRows, error: null });

      const result = await DeliverablesService.getRevisionAttachments("order-1", "user-1");
      expect(result).toEqual([
        {
          id_produk_akhir: "p-2",
          file_url: "https://storage.local/signed-view.png",
          file_download_url: "https://storage.local/signed-download.png",
        },
      ]);
    });

    it("harus melempar error jika pembuatan signed URL gagal", async () => {
      vi.spyOn(DeliverablesService, "validasiOwnerPesanan").mockResolvedValueOnce(true);
      mockStorageService.buatSignedUrlProdukAkhir.mockResolvedValueOnce(null);

      const mockRows = [{ id_produk_akhir: "p-err", file_url: "folder/file.png" }];
      mockSupabase.order.mockResolvedValueOnce({ data: mockRows, error: null });

      await expect(
        DeliverablesService.getRevisionAttachments("order-1", "user-1")
      ).rejects.toThrow("Gagal membuat URL hasil revisi: p-err");
    });
  });

  // ==========================================
  // 9. Test getRevisionRequestAttachments
  // ==========================================
  describe("getRevisionRequestAttachments", () => {
    it("harus melempar error jika query database gagal", async () => {
      vi.spyOn(DeliverablesService, "validasiOwnerPesanan").mockResolvedValueOnce(true);
      mockSupabase.order.mockResolvedValueOnce({
        data: null,
        error: { message: "Gagal fetch pengajuan" },
      });

      await expect(
        DeliverablesService.getRevisionRequestAttachments("order-1", "user-1")
      ).rejects.toThrow("Gagal mengambil lampiran pengajuan revisi: Gagal fetch pengajuan");
    });

    it("harus mengembalikan array kosong jika data revisi null", async () => {
      vi.spyOn(DeliverablesService, "validasiOwnerPesanan").mockResolvedValueOnce(true);
      mockSupabase.order.mockResolvedValueOnce({ data: null, error: null });

      const res = await DeliverablesService.getRevisionRequestAttachments("order-1", "user-1");
      expect(res).toEqual([]);
    });

    it("harus memproses lampiran_revisi berbentuk array & string serta memilah HTTP vs storage path", async () => {
      vi.spyOn(DeliverablesService, "validasiOwnerPesanan").mockResolvedValueOnce(true);

      const mockData = [
        {
          id_revisi: "rev-1",
          lampiran_revisi: ["https://example.com/item1.pdf?v=1", "folder/item2.zip"],
          created_at: "2026-01-01T00:00:00Z",
        },
        {
          id_revisi: "rev-2",
          lampiran_revisi: "folder/single-item.png",
          created_at: null,
        },
      ];
      mockSupabase.order.mockResolvedValueOnce({ data: mockData, error: null });

      const res = await DeliverablesService.getRevisionRequestAttachments("order-1", "user-1");

      expect(res).toEqual([
        {
          id_revisi: "rev-1",
          nama_file: "item1.pdf",
          file_url: "https://example.com/item1.pdf?v=1",
          file_download_url: "https://example.com/item1.pdf?v=1",
          created_at: "2026-01-01T00:00:00Z",
        },
        {
          id_revisi: "rev-1",
          nama_file: "item2.zip",
          file_url: "https://storage.local/signed-view.png",
          file_download_url: "https://storage.local/signed-download.png",
          created_at: "2026-01-01T00:00:00Z",
        },
        {
          id_revisi: "rev-2",
          nama_file: "single-item.png",
          file_url: "https://storage.local/signed-view.png",
          file_download_url: "https://storage.local/signed-download.png",
          created_at: undefined,
        },
      ]);
    });

    it("harus melempar error jika pembuatan signed URL lampiran gagal", async () => {
      vi.spyOn(DeliverablesService, "validasiOwnerPesanan").mockResolvedValueOnce(true);
      mockStorageService.buatSignedUrlProdukAkhir.mockResolvedValueOnce(null);

      const mockData = [
        {
          id_revisi: "rev-1",
          lampiran_revisi: ["path/fail.png"],
        },
      ];
      mockSupabase.order.mockResolvedValueOnce({ data: mockData, error: null });

      await expect(
        DeliverablesService.getRevisionRequestAttachments("order-1", "user-1")
      ).rejects.toThrow("Gagal membuat URL lampiran revisi: fail.png");
    });
  });

  // ==========================================
  // 10. Test requestRevision
  // ==========================================
  describe("requestRevision", () => {
    it("harus throw error jika deskripsi_revisi kosong", async () => {
      vi.spyOn(DeliverablesService, "validasiPenggunaJasa").mockResolvedValueOnce(true);

      await expect(
        DeliverablesService.requestRevision({
          id_pesanan: "order-1",
          deskripsi_revisi: "   ",
          id_produk_akhir: "prod-1",
          user_id: "client-1",
        })
      ).rejects.toThrow("Deskripsi revisi wajib diisi.");
    });

    it("harus throw error jika validasiPenggunaJasa gagal", async () => {
      vi.spyOn(DeliverablesService, "validasiPenggunaJasa").mockRejectedValueOnce(
        new Error("Akses ditolak. Hanya pengguna jasa pemilik pesanan yang dapat melakukan tindakan ini.")
      );

      await expect(
        DeliverablesService.requestRevision({
          id_pesanan: "order-1",
          deskripsi_revisi: "Revisi warna",
          id_produk_akhir: "prod-1",
          user_id: "client-1",
        })
      ).rejects.toThrow("Akses ditolak. Hanya pengguna jasa pemilik pesanan yang dapat melakukan tindakan ini.");
    });

    it("harus melempar error jika query produk akhir error", async () => {
      vi.spyOn(DeliverablesService, "validasiPenggunaJasa").mockResolvedValueOnce(true);
      mockSupabase.maybeSingle.mockResolvedValueOnce({
        data: null,
        error: { message: "Query error produk" },
      });

      await expect(
        DeliverablesService.requestRevision({
          id_pesanan: "order-1",
          deskripsi_revisi: "Perbaiki tombol",
          id_produk_akhir: "prod-1",
          user_id: "client-1",
        })
      ).rejects.toThrow("Gagal memvalidasi hasil pekerjaan: Query error produk");
    });

    it("harus melempar error jika produk akhir tidak ditemukan pada pesanan", async () => {
      vi.spyOn(DeliverablesService, "validasiPenggunaJasa").mockResolvedValueOnce(true);
      mockSupabase.maybeSingle.mockResolvedValueOnce({ data: null, error: null });

      await expect(
        DeliverablesService.requestRevision({
          id_pesanan: "order-1",
          deskripsi_revisi: "Perbaiki tombol",
          id_produk_akhir: "prod-invalid",
          user_id: "client-1",
        })
      ).rejects.toThrow("Hasil pekerjaan tidak ditemukan pada pesanan ini.");
    });

    it("harus melempar error jika query riwayat revisi error", async () => {
      vi.spyOn(DeliverablesService, "validasiPenggunaJasa").mockResolvedValueOnce(true);
      mockSupabase.maybeSingle
        .mockResolvedValueOnce({ data: { id_produk_akhir: "prod-1" }, error: null })
        .mockResolvedValueOnce({ data: null, error: { message: "DB error revisi" } });

      await expect(
        DeliverablesService.requestRevision({
          id_pesanan: "order-1",
          deskripsi_revisi: "Perbaiki tombol",
          id_produk_akhir: "prod-1",
          user_id: "client-1",
        })
      ).rejects.toThrow("Gagal memeriksa riwayat revisi: DB error revisi");
    });

    it("harus melempar error jika revisi sebelumnya masih berstatus 'Sedang Direvisi'", async () => {
      vi.spyOn(DeliverablesService, "validasiPenggunaJasa").mockResolvedValueOnce(true);
      mockSupabase.maybeSingle
        .mockResolvedValueOnce({ data: { id_produk_akhir: "prod-1" }, error: null })
        .mockResolvedValueOnce({
          data: { status_pengerjaan: "Sedang Direvisi", jml_revisi_tersedia: 2 },
          error: null,
        });

      await expect(
        DeliverablesService.requestRevision({
          id_pesanan: "order-1",
          deskripsi_revisi: "Perbaiki tombol",
          id_produk_akhir: "prod-1",
          user_id: "client-1",
        })
      ).rejects.toThrow("Revisi sebelumnya masih dikerjakan penyedia jasa.");
    });

    it("harus melempar error jika revisi sebelumnya belum berstatus 'Revisi Dikumpulkan'", async () => {
      vi.spyOn(DeliverablesService, "validasiPenggunaJasa").mockResolvedValueOnce(true);
      mockSupabase.maybeSingle
        .mockResolvedValueOnce({ data: { id_produk_akhir: "prod-1" }, error: null })
        .mockResolvedValueOnce({
          data: { status_pengerjaan: "Dibatalkan", jml_revisi_tersedia: 2 },
          error: null,
        });

      await expect(
        DeliverablesService.requestRevision({
          id_pesanan: "order-1",
          deskripsi_revisi: "Perbaiki tombol",
          id_produk_akhir: "prod-1",
          user_id: "client-1",
        })
      ).rejects.toThrow("Pengajuan revisi baru belum dapat dilakukan karena status revisi sebelumnya belum memungkinkan pengajuan ulang.");
    });

    it("harus throw error jika kuota revisi habis (<= 0)", async () => {
      vi.spyOn(DeliverablesService, "validasiPenggunaJasa").mockResolvedValueOnce(true);

      mockSupabase.maybeSingle
        .mockResolvedValueOnce({ data: { id_produk_akhir: "prod-1" }, error: null })
        .mockResolvedValueOnce({
          data: {
            id_revisi: "rev-prev",
            jml_revisi_tersedia: 0,
            status_pengerjaan: "Revisi Dikumpulkan",
          },
          error: null,
        });

      await expect(
        DeliverablesService.requestRevision({
          id_pesanan: "order-1",
          deskripsi_revisi: "Ubah font",
          id_produk_akhir: "prod-1",
          user_id: "client-1",
        })
      ).rejects.toThrow("Kuota revisi untuk pesanan ini sudah habis.");
    });

    it("harus melempar error jika insert pengajuan revisi error", async () => {
      vi.spyOn(DeliverablesService, "validasiPenggunaJasa").mockResolvedValueOnce(true);
      mockSupabase.maybeSingle
        .mockResolvedValueOnce({ data: { id_produk_akhir: "prod-1" }, error: null })
        .mockResolvedValueOnce({ data: null, error: null });

      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: { message: "Insert revisi fail" },
      });

      await expect(
        DeliverablesService.requestRevision({
          id_pesanan: "order-1",
          deskripsi_revisi: "Ubah font",
          id_produk_akhir: "prod-1",
          user_id: "client-1",
        })
      ).rejects.toThrow("Gagal mengajukan revisi: Insert revisi fail");
    });

    it("harus melempar error jika insert pengajuan revisi mengembalikan data null tanpa error", async () => {
      vi.spyOn(DeliverablesService, "validasiPenggunaJasa").mockResolvedValueOnce(true);
      mockSupabase.maybeSingle
        .mockResolvedValueOnce({ data: { id_produk_akhir: "prod-1" }, error: null })
        .mockResolvedValueOnce({ data: null, error: null });

      mockSupabase.single.mockResolvedValueOnce({ data: null, error: null });

      await expect(
        DeliverablesService.requestRevision({
          id_pesanan: "order-1",
          deskripsi_revisi: "Ubah font",
          id_produk_akhir: "prod-1",
          user_id: "client-1",
        })
      ).rejects.toThrow("Data pengajuan revisi tidak berhasil disimpan.");
    });

    it("harus melempar error jika update status pesanan gagal", async () => {
      vi.spyOn(DeliverablesService, "validasiPenggunaJasa").mockResolvedValueOnce(true);
      mockSupabase.maybeSingle
        .mockResolvedValueOnce({ data: { id_produk_akhir: "prod-1" }, error: null })
        .mockResolvedValueOnce({ data: null, error: null });

      mockSupabase.single.mockResolvedValueOnce({
        data: { id_revisi: "rev-1" },
        error: null,
      });

      mockSupabase.update.mockReturnValueOnce({
        eq: vi.fn().mockResolvedValueOnce({ error: { message: "Pesanan update error" } }),
      });

      await expect(
        DeliverablesService.requestRevision({
          id_pesanan: "order-1",
          deskripsi_revisi: "Ubah font",
          id_produk_akhir: "prod-1",
          user_id: "client-1",
        })
      ).rejects.toThrow("Revisi berhasil disimpan, tetapi gagal memperbarui status pesanan: Pesanan update error");
    });

    it("harus berhasil mengajukan revisi dan mengurangi kuota", async () => {
      vi.spyOn(DeliverablesService, "validasiPenggunaJasa").mockResolvedValueOnce(true);

      mockSupabase.maybeSingle
        .mockResolvedValueOnce({ data: { id_produk_akhir: "prod-1" }, error: null })
        .mockResolvedValueOnce({
          data: {
            id_revisi: "rev-prev",
            jml_revisi_tersedia: 2,
            status_pengerjaan: "Revisi Dikumpulkan",
          },
          error: null,
        })
        .mockResolvedValueOnce({
          data: { id_penyedia_jasa: "seller-1", jasa: { nama_jasa: "Web App" } },
          error: null,
        });

      mockSupabase.single.mockResolvedValueOnce({ data: { id_revisi: "rev-1" }, error: null });

      const res = await DeliverablesService.requestRevision({
        id_pesanan: "order-1",
        deskripsi_revisi: "Perbaiki tombol",
        lampiran_revisi: ["file1.png"],
        id_produk_akhir: "prod-1",
        user_id: "client-1",
      });

      expect(res).toEqual({ id_revisi: "rev-1" });
      expect(NotifikasiService.kirimNotifikasi).toHaveBeenCalledWith(
        expect.objectContaining({
          id_pengguna: "seller-1",
        })
      );
    });
  });

  // ==========================================
  // 11. Test submitRevisionFix
  // ==========================================
  describe("submitRevisionFix", () => {
    it("harus melempar error jika deskripsi_produk kosong", async () => {
      vi.spyOn(DeliverablesService, "validasiPenyediaJasa").mockResolvedValueOnce(true);

      await expect(
        DeliverablesService.submitRevisionFix({
          id_pesanan: "order-1",
          deskripsi_produk: "   ",
          file_urls: ["https://example.com/fix.png"],
          user_id: "seller-1",
        })
      ).rejects.toThrow("Deskripsi hasil revisi wajib diisi.");
    });

    it("harus melempar error jika file_urls kosong", async () => {
      vi.spyOn(DeliverablesService, "validasiPenyediaJasa").mockResolvedValueOnce(true);

      await expect(
        DeliverablesService.submitRevisionFix({
          id_pesanan: "order-1",
          deskripsi_produk: "Fix bug",
          file_urls: [],
          user_id: "seller-1",
        })
      ).rejects.toThrow("Unggah berkas atau sertakan tautan hasil revisi.");
    });

    it("harus melempar error jika query latest revisi error", async () => {
      vi.spyOn(DeliverablesService, "validasiPenyediaJasa").mockResolvedValueOnce(true);
      mockSupabase.maybeSingle.mockResolvedValueOnce({
        data: null,
        error: { message: "DB Error Revision" },
      });

      await expect(
        DeliverablesService.submitRevisionFix({
          id_pesanan: "order-1",
          deskripsi_produk: "Hasil perbaikan",
          file_urls: ["https://example.com/fix.png"],
          user_id: "seller-1",
        })
      ).rejects.toThrow("Gagal memeriksa pengajuan revisi: DB Error Revision");
    });

    it("harus melempar error jika tidak ada pengajuan revisi yang sedang dikerjakan", async () => {
      vi.spyOn(DeliverablesService, "validasiPenyediaJasa").mockResolvedValueOnce(true);
      mockSupabase.maybeSingle.mockResolvedValueOnce({ data: null, error: null });

      await expect(
        DeliverablesService.submitRevisionFix({
          id_pesanan: "order-1",
          deskripsi_produk: "Hasil perbaikan",
          file_urls: ["https://example.com/fix.png"],
          user_id: "seller-1",
        })
      ).rejects.toThrow("Tidak ada pengajuan revisi yang sedang dikerjakan.");
    });

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
      ).rejects.toThrow("Gagal menyimpan hasil revisi: Insert produk error");
    });

    it("harus melempar error jika update status pengajuan revisi gagal", async () => {
      vi.spyOn(DeliverablesService, "validasiPenyediaJasa").mockResolvedValueOnce(true);
      mockSupabase.maybeSingle.mockResolvedValueOnce({ data: { id_revisi: "rev-old" }, error: null });
      mockSupabase.insert.mockReturnValueOnce({
        select: vi.fn().mockResolvedValueOnce({ data: [{ id_produk_akhir: "p-1" }], error: null }),
      });
      mockSupabase.update.mockReturnValueOnce({
        eq: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            select: vi.fn().mockReturnValueOnce({
              maybeSingle: vi.fn().mockResolvedValueOnce({ data: null, error: { message: "Update revisi fail" } }),
            }),
          }),
        }),
      });

      await expect(
        DeliverablesService.submitRevisionFix({
          id_pesanan: "order-1",
          deskripsi_produk: "Hasil revisi 1",
          file_urls: ["https://example.com/fix1.png"],
          user_id: "penyedia-1",
        })
      ).rejects.toThrow("Gagal memperbarui status revisi: Update revisi fail");
    });

    it("harus melempar error jika update status pesanan gagal", async () => {
      vi.spyOn(DeliverablesService, "validasiPenyediaJasa").mockResolvedValueOnce(true);
      mockSupabase.maybeSingle.mockResolvedValueOnce({ data: { id_revisi: "rev-old" }, error: null });
      mockSupabase.insert.mockReturnValueOnce({
        select: vi.fn().mockResolvedValueOnce({ data: [{ id_produk_akhir: "p-1" }], error: null }),
      });

      // Update pengajuan_revisi sukses
      mockSupabase.update.mockReturnValueOnce({
        eq: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            select: vi.fn().mockReturnValueOnce({
              maybeSingle: vi.fn().mockResolvedValueOnce({ data: { id_revisi: "rev-old" }, error: null }),
            }),
          }),
        }),
      });

      // Update pesanan fail
      mockSupabase.update.mockReturnValueOnce({
        eq: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            select: vi.fn().mockReturnValueOnce({
              maybeSingle: vi.fn().mockResolvedValueOnce({ data: null, error: { message: "Update pesanan fail" } }),
            }),
          }),
        }),
      });

      await expect(
        DeliverablesService.submitRevisionFix({
          id_pesanan: "order-1",
          deskripsi_produk: "Hasil revisi 1",
          file_urls: ["https://example.com/fix1.png"],
          user_id: "penyedia-1",
        })
      ).rejects.toThrow("Revisi berhasil disimpan, tetapi status pesanan gagal diperbarui: Update pesanan fail");
    });

    it("berhasil mengumpulkan hasil perbaikan revisi lebih dari 1 file dan mengirim notifikasi", async () => {
      vi.spyOn(DeliverablesService, "validasiPenyediaJasa").mockResolvedValueOnce(true);

      const mockProdukBaru = [
        { id_produk_akhir: "prod-fix-1" },
        { id_produk_akhir: "prod-fix-2" },
      ];
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
        file_urls: ["https://example.com/fix1.png", "https://example.com/fix2.png"],
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

  // ==========================================
  // 12. Test confirmOrderComplete
  // ==========================================
  describe("confirmOrderComplete", () => {
    it("harus throw error jika user bukan pengguna jasa pemilik pesanan", async () => {
      mockSupabase.maybeSingle.mockResolvedValueOnce({
        data: { id_pengguna_jasa: "other-client" },
        error: null,
      });

      await expect(
        DeliverablesService.confirmOrderComplete("order-1", "client-1")
      ).rejects.toThrow("Akses ditolak. Hanya pengguna jasa pemilik pesanan yang dapat melakukan tindakan ini.");
    });

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

    it("harus memanggil rpc konfirmasi_pesanan_selesai dan mengirim notifikasi", async () => {
      vi.spyOn(DeliverablesService, "validasiPenggunaJasa").mockResolvedValueOnce(true);

      mockSupabase.single.mockResolvedValueOnce({
        data: { id_penyedia_jasa: "seller-1", total_biaya: 150000, jasa: { nama_jasa: "Jasa Logo" } },
        error: null,
      });
      mockSupabase.rpc.mockResolvedValueOnce({ error: null });

      await DeliverablesService.confirmOrderComplete("order-1", "client-1");

      expect(mockSupabase.rpc).toHaveBeenCalledWith("konfirmasi_pesanan_selesai", {
        p_id_pesanan: "order-1",
      });
      expect(NotifikasiService.kirimNotifikasi).toHaveBeenCalledWith(
        expect.objectContaining({
          id_pengguna: "seller-1",
        })
      );
    });
  });

  // ==========================================
  // 13. Test unggahBerkasDeliverable
  // ==========================================
  describe("unggahBerkasDeliverable", () => {
    it("harus throw error jika ukuran file melebihi 50 MB", async () => {
      const largeFile = new File(["a".repeat(100)], "large.pdf", { type: "application/pdf" });
      Object.defineProperty(largeFile, "size", { value: MAKS_UKURAN_DELIVERABLE + 1 });

      await expect(DeliverablesService.unggahBerkasDeliverable(largeFile)).rejects.toThrow(
        "Ukuran berkas melebihi batas maksimum 50 MB"
      );
    });

    it("harus throw error jika tipe file tidak diizinkan", async () => {
      const invalidFile = new File(["hello"], "script.exe", { type: "application/x-msdownload" });

      await expect(DeliverablesService.unggahBerkasDeliverable(invalidFile)).rejects.toThrow(
        "Tipe berkas application/x-msdownload tidak diizinkan untuk deliverable"
      );
    });

    it("harus melempar error jika Storage Service mengembalikan error", async () => {
      const mockUpload = vi.fn().mockResolvedValue({ url: null, error: "Storage driver full" });
      (getStorageService as any).mockReturnValue({ upload: mockUpload });

      const validFile = new File(["content"], "doc.pdf", { type: "application/pdf" });

      await expect(DeliverablesService.unggahBerkasDeliverable(validFile)).rejects.toThrow(
        "Storage driver full"
      );
    });

    it("harus melempar error jika Storage Service mengembalikan URL kosong", async () => {
      const mockUpload = vi.fn().mockResolvedValue({ url: "", error: null });
      (getStorageService as any).mockReturnValue({ upload: mockUpload });

      const validFile = new File(["content"], "doc.pdf", { type: "application/pdf" });

      await expect(DeliverablesService.unggahBerkasDeliverable(validFile)).rejects.toThrow(
        "Gagal mengunggah berkas deliverable."
      );
    });

    it("harus mengembalikan URL berkas ketika unggah berhasil", async () => {
      const mockUpload = vi.fn().mockResolvedValue({ url: "https://storage.com/file.png", error: null });
      (getStorageService as any).mockReturnValue({ upload: mockUpload });

      const validFile = new File(["image-content"], "test.png", { type: "image/png" });
      const url = await DeliverablesService.unggahBerkasDeliverable(validFile);

      expect(url).toBe("https://storage.com/file.png");
      expect(mockUpload).toHaveBeenCalledWith(validFile, FOLDER_DELIVERABLE);
    });
  });
});