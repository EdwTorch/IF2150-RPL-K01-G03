import { describe, it, expect, vi, beforeEach } from "vitest";
import { UlasanService } from "../services/ulasan.service";

// Mock Storage Service
const mockStorageDelete = vi.fn();
const mockStorageUpload = vi.fn();

vi.mock("../services/storage", () => ({
  getStorageService: () => ({
    delete: mockStorageDelete,
    upload: mockStorageUpload,
  }),
}));

// Mock Supabase client
const mockCreateClient = vi.fn();
vi.mock("../lib/supabase/server", () => ({
  createClient: () => mockCreateClient(),
}));
vi.mock("@supabase/supabase-js", () => ({
  createClient: () => mockCreateClient(),
}));

process.env.NEXT_PUBLIC_SUPABASE_URL = "https://mock.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY = "mock-service-role-key";

// Helper untuk membuat mock File
function buatMockFile(nama: string, tipe: string, ukuran: number): File {
  const blob = new Blob(["a".repeat(ukuran)], { type: tipe });
  return new File([blob], nama, { type: tipe });
}

describe("UlasanService.validasiRating", () => {
  it("menerima rating yang valid antara 1 sampai 5", () => {
    expect(() => UlasanService.validasiRating(1)).not.toThrow();
    expect(() => UlasanService.validasiRating(3)).not.toThrow();
    expect(() => UlasanService.validasiRating(5)).not.toThrow();
  });

  it("menolak rating kurang dari 1", () => {
    expect(() => UlasanService.validasiRating(0)).toThrow("Rating harus bernilai antara 1 sampai 5");
    expect(() => UlasanService.validasiRating(-1)).toThrow("Rating harus bernilai antara 1 sampai 5");
  });

  it("menolak rating lebih dari 5", () => {
    expect(() => UlasanService.validasiRating(6)).toThrow("Rating harus bernilai antara 1 sampai 5");
    expect(() => UlasanService.validasiRating(10)).toThrow("Rating harus bernilai antara 1 sampai 5");
  });

  it("menolak rating non-angka atau NaN", () => {
    expect(() => UlasanService.validasiRating(NaN)).toThrow("Rating harus bernilai antara 1 sampai 5");
    expect(() => UlasanService.validasiRating("5" as never)).toThrow("Rating harus bernilai antara 1 sampai 5");
  });
});

describe("UlasanService.validasiDokumentasi", () => {
  it("menerima berkas yang valid", () => {
    const fileValid = [buatMockFile("foto.jpg", "image/jpeg", 1024)];
    expect(() => UlasanService.validasiDokumentasi(fileValid)).not.toThrow();
  });

  it("menolak jika jumlah berkas melebihi batas maksimal", () => {
    const berkasBanyak = Array(4).fill(buatMockFile("foto.png", "image/png", 1024));
    expect(() => UlasanService.validasiDokumentasi(berkasBanyak)).toThrow("Dokumentasi ulasan maksimal 3 berkas.");
  });

  it("menolak ekstensi atau MIME type berkas yang tidak didukung", () => {
    const fileExe = [buatMockFile("skrip.exe", "application/x-msdownload", 1024)];
    expect(() => UlasanService.validasiDokumentasi(fileExe)).toThrow("Format berkas skrip.exe tidak didukung.");

    const fileMismatch = [buatMockFile("foto.jpg", "image/png", 1024)];
    expect(() => UlasanService.validasiDokumentasi(fileMismatch)).toThrow("Format berkas foto.jpg tidak didukung.");
  });

  it("menolak berkas yang kosong (size <= 0)", () => {
    const fileKosong = [buatMockFile("kosong.png", "image/png", 0)];
    expect(() => UlasanService.validasiDokumentasi(fileKosong)).toThrow("Berkas kosong.png kosong atau tidak valid.");
  });

  it("menolak berkas yang melebihi ukuran maksimal 10 MB", () => {
    const fileBesar = [buatMockFile("besar.pdf", "application/pdf", 11 * 1024 * 1024)];
    expect(() => UlasanService.validasiDokumentasi(fileBesar)).toThrow("Ukuran berkas besar.pdf maksimal 10 MB.");
  });
});

describe("UlasanService.hitungRatingAgregat", () => {
  it("mengembalikan default 0 dan 0 ulasan jika tidak ada ulasan", () => {
    expect(UlasanService.hitungRatingAgregat([])).toEqual({ rating_rata_rata: 0, total_ulasan: 0 });
    expect(UlasanService.hitungRatingAgregat(null as never)).toEqual({ rating_rata_rata: 0, total_ulasan: 0 });
  });

  it("menghitung rata-rata dari daftar angka", () => {
    expect(UlasanService.hitungRatingAgregat([5, 4, 5, 4])).toEqual({ rating_rata_rata: 4.5, total_ulasan: 4 });
  });

  it("menghitung rata-rata dari daftar objek ulasan", () => {
    expect(UlasanService.hitungRatingAgregat([{ rating: 5 }, { rating: 3 }])).toEqual({
      rating_rata_rata: 4.0,
      total_ulasan: 2,
    });
  });

  it("menerapkan pembulatan konsisten ke satu angka desimal", () => {
    expect(UlasanService.hitungRatingAgregat([5, 5, 4]).rating_rata_rata).toBe(4.7);
    expect(UlasanService.hitungRatingAgregat([4, 4, 5]).rating_rata_rata).toBe(4.3);
    expect(UlasanService.hitungRatingAgregat([5, 4, 3]).rating_rata_rata).toBe(4.0);
  });

  it("menolak jika salah satu rating dalam daftar di luar rentang 1-5", () => {
    expect(() => UlasanService.hitungRatingAgregat([5, 6])).toThrow("Rating harus bernilai antara 1 sampai 5");
    expect(() => UlasanService.hitungRatingAgregat([5, 0])).toThrow("Rating harus bernilai antara 1 sampai 5");
  });
});

describe("UlasanService.formatRatingTampilan", () => {
  it("menangani penyedia tanpa ulasan dengan benar", () => {
    expect(UlasanService.formatRatingTampilan(0, 0)).toEqual({
      rating_teks: "0.0",
      total_ulasan_teks: "0 ulasan",
      label: "Belum ada ulasan",
    });
    expect(UlasanService.formatRatingTampilan(null, 0)).toEqual({
      rating_teks: "0.0",
      total_ulasan_teks: "0 ulasan",
      label: "Belum ada ulasan",
    });
  });

  it("menampilkan rating dan jumlah ulasan dengan format rapi", () => {
    expect(UlasanService.formatRatingTampilan(4.8, 15)).toEqual({
      rating_teks: "4.8",
      total_ulasan_teks: "15 ulasan",
      label: "★ 4.8 (15 ulasan)",
    });
  });
});

describe("UlasanService.perbaruiRatingPenyedia & perbaruiRatingJasa", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("menolak jika ID penyedia atau jasa kosong", async () => {
    await expect(UlasanService.perbaruiRatingPenyedia("")).rejects.toThrow("ID penyedia jasa tidak valid");
    await expect(UlasanService.perbaruiRatingJasa("   ")).rejects.toThrow("ID jasa tidak valid");
  });

  it("memperbarui rating penyedia jasa ke database", async () => {
    const mockUpdate = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    mockCreateClient.mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === "pesanan") {
          return { select: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: [{ id_pesanan: "p1" }] }) }) };
        }
        if (table === "ulasan") {
          return { select: vi.fn().mockReturnValue({ in: vi.fn().mockResolvedValue({ data: [{ rating: 5 }] }) }) };
        }
        if (table === "penyedia_jasa") {
          return { update: mockUpdate };
        }
        return {};
      }),
    });

    const hasil = await UlasanService.perbaruiRatingPenyedia("penyedia-123");
    expect(hasil).toEqual({ rating_rata_rata: 5, total_ulasan: 1 });
    expect(mockUpdate).toHaveBeenCalledWith({ rating_rata_rata: 5 });
  });

  it("memperbarui rating jasa ke database", async () => {
    const mockUpdate = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    mockCreateClient.mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === "pesanan") {
          return { select: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: [{ id_pesanan: "p1" }] }) }) };
        }
        if (table === "ulasan") {
          return { select: vi.fn().mockReturnValue({ in: vi.fn().mockResolvedValue({ data: [{ rating: 4 }] }) }) };
        }
        if (table === "jasa") {
          return { update: mockUpdate };
        }
        return {};
      }),
    });

    const hasil = await UlasanService.perbaruiRatingJasa("jasa-123");
    expect(hasil).toEqual({ rating_rata_rata: 4, total_ulasan: 1 });
    expect(mockUpdate).toHaveBeenCalledWith({ rating_rata_rata: 4 });
  });

  it("lempar error jika database gagal meng-update rating penyedia / jasa", async () => {
    mockCreateClient.mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === "pesanan") {
          return { select: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: [] }) }) };
        }
        if (table === "penyedia_jasa" || table === "jasa") {
          return { update: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: { message: "DB Error" } }) }) };
        }
        return {};
      }),
    });

    await expect(UlasanService.perbaruiRatingPenyedia("p-1")).rejects.toThrow("Gagal memperbarui rata-rata rating penyedia jasa.");
    await expect(UlasanService.perbaruiRatingJasa("j-1")).rejects.toThrow("Gagal memperbarui rata-rata rating jasa.");
  });
});

describe("UlasanService.getRatingDanUlasanPenyedia & getStatistikUlasanJasa", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getRatingDanUlasanPenyedia menolak jika ID kosong", async () => {
    await expect(UlasanService.getRatingDanUlasanPenyedia("")).rejects.toThrow("ID penyedia jasa tidak valid");
  });

  it("getRatingDanUlasanPenyedia mengembalikan profil rating", async () => {
    mockCreateClient.mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === "penyedia_jasa") {
          return { select: vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ maybeSingle: vi.fn().mockResolvedValue({ data: { rating_rata_rata: 4.8 } }) }) }) };
        }
        if (table === "pesanan") {
          return { select: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: [{ id_pesanan: "p1" }] }) }) };
        }
        if (table === "ulasan") {
          return { select: vi.fn().mockReturnValue({ in: vi.fn().mockResolvedValue({ data: [{ rating: 5 }] }) }) };
        }
        return {};
      }),
    });

    const res = await UlasanService.getRatingDanUlasanPenyedia("penyedia-1");
    expect(res.rating_rata_rata).toBe(4.8);
    expect(res.total_ulasan).toBe(1);
  });

  it("lempar error jika query penyedia jasa gagal pada getRatingDanUlasanPenyedia", async () => {
    mockCreateClient.mockReturnValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ maybeSingle: vi.fn().mockResolvedValue({ error: { message: "Error DB" } }) }) }),
      }),
    });

    await expect(UlasanService.getRatingDanUlasanPenyedia("p-1")).rejects.toThrow("Error DB");
  });
});

describe("UlasanService.getUlasanbyJasa & getUlasanJasaById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("mengembalikan array kosong jika jasa tidak memiliki pesanan", async () => {
    mockCreateClient.mockReturnValue({
      from: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: [] }) }) }),
    });

    const res = await UlasanService.getUlasanbyJasa("jasa-tanpa-pesanan");
    expect(res).toEqual({ ulasan: [], total: 0 });
  });

  it("lempar error jika query pesanan atau ulasan gagal", async () => {
    mockCreateClient.mockReturnValue({
      from: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: { message: "Gagal pesanan" } }) }) }),
    });

    await expect(UlasanService.getUlasanbyJasa("j-1")).rejects.toThrow("Gagal pesanan");
  });

  it("lempar error umum jika query data ulasan bermasalah", async () => {
    mockCreateClient.mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === "pesanan") {
          return { select: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: [{ id_pesanan: "p1" }] }) }) };
        }
        if (table === "ulasan") {
          return { select: vi.fn().mockReturnValue({ in: vi.fn().mockReturnValue({ order: vi.fn().mockResolvedValue({ error: { message: "DB Error Ulasan" } }) }) }) };
        }
        return {};
      }),
    });

    await expect(UlasanService.getUlasanJasaById("j-1")).rejects.toThrow("Terjadi kesalahan saat mengambil data ulasan.");
  });
});

describe("UlasanService.simpanUlasan", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("menolak simpan ulasan jika ID pesanan kosong", async () => {
    await expect(
      UlasanService.simpanUlasan({ id_pesanan: "", id_pengguna_jasa: "user-1", rating: 5 })
    ).rejects.toThrow("ID pesanan tidak valid.");
  });

  it("menolak jika pesanan tidak milik pengguna", async () => {
    mockCreateClient.mockReturnValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: { id_pengguna_jasa: "user-lain", status_pesanan: "SELESAI" },
            }),
          }),
        }),
      }),
    });

    await expect(
      UlasanService.simpanUlasan({ id_pesanan: "p-1", id_pengguna_jasa: "user-1", rating: 5 })
    ).rejects.toThrow("Kamu tidak memiliki akses untuk mengulas pesanan ini.");
  });

  it("menolak jika pesanan belum selesai", async () => {
    mockCreateClient.mockReturnValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: { id_pengguna_jasa: "user-1", status_pesanan: "PROSES" },
            }),
          }),
        }),
      }),
    });

    await expect(
      UlasanService.simpanUlasan({ id_pesanan: "p-1", id_pengguna_jasa: "user-1", rating: 5 })
    ).rejects.toThrow("Pesanan harus selesai sebelum dapat diberi ulasan.");
  });

  it("menolak jika pesanan sudah diulas sebelumnya", async () => {
    mockCreateClient.mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === "pesanan") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                maybeSingle: vi.fn().mockResolvedValue({
                  data: { id_pesanan: "p-1", id_pengguna_jasa: "user-1", status_pesanan: "SELESAI" },
                }),
              }),
            }),
          };
        }
        if (table === "ulasan") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                maybeSingle: vi.fn().mockResolvedValue({ data: { id_ulasan: "u-lama" } }),
              }),
            }),
          };
        }
        return {};
      }),
    });

    await expect(
      UlasanService.simpanUlasan({ id_pesanan: "p-1", id_pengguna_jasa: "user-1", rating: 5 })
    ).rejects.toThrow("Pesanan ini sudah memiliki ulasan.");
  });

  it("berhasil mengunggah berkas dokumentasi dan menyimpan ulasan", async () => {
    mockStorageUpload.mockResolvedValue({ url: "https://storage/foto.jpg", error: null });

    const mockUlasanBaru = { id_ulasan: "u-1", rating: 5 };

    mockCreateClient.mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === "pesanan") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                maybeSingle: vi.fn().mockResolvedValue({
                  data: { id_pesanan: "p-1", id_pengguna_jasa: "user-1", status_pesanan: "SELESAI", id_penyedia_jasa: "penyedia-1" },
                }),
              }),
            }),
          };
        }
        if (table === "ulasan") {
          return {
            select: vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ maybeSingle: vi.fn().mockResolvedValue({ data: null }) }) }),
            insert: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ single: vi.fn().mockResolvedValue({ data: mockUlasanBaru }) }) }),
          };
        }
        return {};
      }),
    });

    const file = buatMockFile("foto.jpg", "image/jpeg", 1024);
    const hasil = await UlasanService.simpanUlasan({
      id_pesanan: "p-1",
      id_pengguna_jasa: "user-1",
      rating: 5,
      dokumentasi: [file],
    });

    expect(hasil).toEqual(mockUlasanBaru);
    expect(mockStorageUpload).toHaveBeenCalledWith(file, "ulasan");
  });

  it("menghapus berkas terunggah (rollback) jika penyimpanan database gagal", async () => {
    mockStorageUpload.mockResolvedValue({ url: "https://storage/foto1.jpg", error: null });
    mockStorageDelete.mockResolvedValue(true);

    mockCreateClient.mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === "pesanan") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                maybeSingle: vi.fn().mockResolvedValue({
                  data: { id_pesanan: "p-1", id_pengguna_jasa: "user-1", status_pesanan: "SELESAI" },
                }),
              }),
            }),
          };
        }
        if (table === "ulasan") {
          return {
            select: vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ maybeSingle: vi.fn().mockResolvedValue({ data: null }) }) }),
            insert: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ single: vi.fn().mockResolvedValue({ data: null, error: { message: "Gagal simpan DB" } }) }) }),
          };
        }
        return {};
      }),
    });

    const file = buatMockFile("foto1.jpg", "image/jpeg", 1024);

    await expect(
      UlasanService.simpanUlasan({ id_pesanan: "p-1", id_pengguna_jasa: "user-1", rating: 5, dokumentasi: [file] })
    ).rejects.toThrow("Gagal simpan DB");

    expect(mockStorageDelete).toHaveBeenCalledWith("https://storage/foto1.jpg");
  });
});

describe("UlasanService.updateUlasan", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("menolak jika jumlah `dokumentasi_path` baru melebihi limit", async () => {
    vi.spyOn(UlasanService, "validasiOwnerUlasan").mockResolvedValue();

    await expect(
      UlasanService.updateUlasan("u-1", "user-1", {
        dokumentasi_path: ["url1", "url2", "url3", "url4"],
      })
    ).rejects.toThrow("Dokumentasi ulasan maksimal 3 berkas.");
  });

  it("menolak jika `dokumentasi_path` berisi URL yang tidak ada di ulasan lama", async () => {
    vi.spyOn(UlasanService, "validasiOwnerUlasan").mockResolvedValue();

    mockCreateClient.mockReturnValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id_pesanan: "p-1", dokumentasi_path: ["https://storage/lama.jpg"] },
            }),
          }),
        }),
      }),
    });

    await expect(
      UlasanService.updateUlasan("u-1", "user-1", {
        dokumentasi_path: ["https://storage/bukan-milik-ulasan.jpg"],
      })
    ).rejects.toThrow("Dokumentasi yang diperbarui tidak valid.");
  });

  it("menghapus dokumentasi lama yang dibuang saat update", async () => {
    vi.spyOn(UlasanService, "validasiOwnerUlasan").mockResolvedValue();
    mockStorageDelete.mockResolvedValue(true);

    mockCreateClient.mockReturnValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id_pesanan: "p-1", dokumentasi_path: ["https://storage/1.jpg", "https://storage/2.jpg"] },
            }),
          }),
        }),
        update: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) }),
      }),
    });

    await UlasanService.updateUlasan("u-1", "user-1", {
      dokumentasi_path: ["https://storage/1.jpg"],
    });

    expect(mockStorageDelete).toHaveBeenCalledWith("https://storage/2.jpg");
  });

  it("lempar error jika update ke database gagal", async () => {
    vi.spyOn(UlasanService, "validasiOwnerUlasan").mockResolvedValue();

    mockCreateClient.mockReturnValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({ single: vi.fn().mockResolvedValue({ data: { id_pesanan: "p-1" } }) }),
        }),
        update: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: { message: "Error Update" } }) }),
      }),
    });

    await expect(
      UlasanService.updateUlasan("u-1", "user-1", { komentar: "Ubah" })
    ).rejects.toThrow("Terjadi kesalahan saat memperbarui ulasan.");
  });
});

describe("UlasanService.deleteUlasan", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("menghapus dokumentasi dan ulasan dari DB", async () => {
    vi.spyOn(UlasanService, "validasiOwnerUlasan").mockResolvedValue();
    mockStorageDelete.mockResolvedValue(true);

    mockCreateClient.mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === "pesanan") {
          return { select: vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ maybeSingle: vi.fn().mockResolvedValue({ data: null }) }) }) };
        }
        return {
          select: vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ single: vi.fn().mockResolvedValue({ data: { id_pesanan: "p1", dokumentasi_path: ["https://storage/1.jpg"] } }) }) }),
          delete: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) }),
        };
      }),
    });

    await UlasanService.deleteUlasan("u-1", "user-1");
    expect(mockStorageDelete).toHaveBeenCalledWith("https://storage/1.jpg");
  });

  it("lempar error jika penghapusan di database gagal", async () => {
    vi.spyOn(UlasanService, "validasiOwnerUlasan").mockResolvedValue();

    mockCreateClient.mockReturnValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ single: vi.fn().mockResolvedValue({ data: { id_pesanan: "p1" } }) }) }),
        delete: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: { message: "Gagal Delete" } }) }),
      }),
    });

    await expect(UlasanService.deleteUlasan("u-1", "user-1")).rejects.toThrow("Terjadi kesalahan saat menghapus ulasan.");
  });
});