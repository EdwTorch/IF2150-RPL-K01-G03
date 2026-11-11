import { describe, it, expect, vi, beforeEach } from "vitest";
import { UlasanService } from "../services/ulasan.service";

// Mock Supabase server client
const mockCreateClient = vi.fn();
vi.mock("../lib/supabase/server", () => ({
  createClient: () => mockCreateClient(),
}));

describe("UlasanService.validasiRating (AC-3: Validasi Rating)", () => {
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

describe("UlasanService.hitungRatingAgregat (AC-1 & AC-3: Perhitungan Rating & Pembulatan)", () => {
  it("mengembalikan default 0 dan 0 ulasan jika tidak ada ulasan", () => {
    const hasilKosong = UlasanService.hitungRatingAgregat([]);
    expect(hasilKosong).toEqual({
      rating_rata_rata: 0,
      total_ulasan: 0,
    });

    const hasilNull = UlasanService.hitungRatingAgregat(null as never);
    expect(hasilNull).toEqual({
      rating_rata_rata: 0,
      total_ulasan: 0,
    });
  });

  it("menghitung rata-rata dari daftar angka", () => {
    const hasil = UlasanService.hitungRatingAgregat([5, 4, 5, 4]);
    expect(hasil).toEqual({
      rating_rata_rata: 4.5,
      total_ulasan: 4,
    });
  });

  it("menghitung rata-rata dari daftar objek ulasan", () => {
    const hasil = UlasanService.hitungRatingAgregat([
      { rating: 5 },
      { rating: 3 },
    ]);
    expect(hasil).toEqual({
      rating_rata_rata: 4.0,
      total_ulasan: 2,
    });
  });

  it("menerapkan pembulatan konsisten ke satu angka desimal", () => {
    // 14 / 3 = 4.6666... -> 4.7
    const hasilBulatAtas = UlasanService.hitungRatingAgregat([5, 5, 4]);
    expect(hasilBulatAtas.rating_rata_rata).toBe(4.7);
    expect(hasilBulatAtas.total_ulasan).toBe(3);

    // 13 / 3 = 4.3333... -> 4.3
    const hasilBulatBawah = UlasanService.hitungRatingAgregat([4, 4, 5]);
    expect(hasilBulatBawah.rating_rata_rata).toBe(4.3);
    expect(hasilBulatBawah.total_ulasan).toBe(3);

    // 12 / 3 = 4.0 -> 4.0
    const hasilBulatPas = UlasanService.hitungRatingAgregat([5, 4, 3]);
    expect(hasilBulatPas.rating_rata_rata).toBe(4.0);
    expect(hasilBulatPas.total_ulasan).toBe(3);
  });

  it("menolak jika salah satu rating dalam daftar di luar rentang 1-5", () => {
    expect(() => UlasanService.hitungRatingAgregat([5, 6])).toThrow("Rating harus bernilai antara 1 sampai 5");
    expect(() => UlasanService.hitungRatingAgregat([5, 0])).toThrow("Rating harus bernilai antara 1 sampai 5");
    expect(() => UlasanService.hitungRatingAgregat([{ rating: 4 }, { rating: -2 }])).toThrow(
      "Rating harus bernilai antara 1 sampai 5"
    );
  });
});

describe("UlasanService.formatRatingTampilan (AC-1 & AC-2: Tampilan Profil I-03)", () => {
  it("menangani penyedia tanpa ulasan (rating 0 atau null) dengan benar", () => {
    const tampilanNol = UlasanService.formatRatingTampilan(0, 0);
    expect(tampilanNol).toEqual({
      rating_teks: "0.0",
      total_ulasan_teks: "0 ulasan",
      label: "Belum ada ulasan",
    });

    const tampilanNull = UlasanService.formatRatingTampilan(null, 0);
    expect(tampilanNull).toEqual({
      rating_teks: "0.0",
      total_ulasan_teks: "0 ulasan",
      label: "Belum ada ulasan",
    });
  });

  it("menampilkan rating dan jumlah ulasan dengan format yang rapi", () => {
    const tampilan = UlasanService.formatRatingTampilan(4.8, 15);
    expect(tampilan).toEqual({
      rating_teks: "4.8",
      total_ulasan_teks: "15 ulasan",
      label: "★ 4.8 (15 ulasan)",
    });
  });
});

describe("UlasanService.perbaruiRatingPenyedia (AC-2: Pembaruan Profil Otomatis)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("menolak jika ID penyedia jasa kosong", async () => {
    await expect(UlasanService.perbaruiRatingPenyedia("")).rejects.toThrow("ID penyedia jasa tidak valid");
    await expect(UlasanService.perbaruiRatingPenyedia("   ")).rejects.toThrow("ID penyedia jasa tidak valid");
  });

  it("menghitung ulang ulasan dan memperbarui tabel penyedia_jasa", async () => {
    const mockUpdate = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    mockCreateClient.mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === "pesanan") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: [{ id_pesanan: "p1" }, { id_pesanan: "p2" }],
                error: null,
              }),
            }),
          };
        }
        if (table === "ulasan") {
          return {
            select: vi.fn().mockReturnValue({
              in: vi.fn().mockResolvedValue({
                data: [{ rating: 5 }, { rating: 4 }],
                error: null,
              }),
            }),
          };
        }
        if (table === "penyedia_jasa") {
          return {
            update: mockUpdate,
          };
        }
        return {};
      }),
    });

    const hasil = await UlasanService.perbaruiRatingPenyedia("penyedia-123");
    expect(hasil).toEqual({
      rating_rata_rata: 4.5,
      total_ulasan: 2,
    });
    expect(mockUpdate).toHaveBeenCalledWith({ rating_rata_rata: 4.5 });
  });

  it("menetapkan rating default 0 jika penyedia belum memiliki ulasan", async () => {
    const mockUpdate = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    mockCreateClient.mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === "pesanan") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: [],
                error: null,
              }),
            }),
          };
        }
        if (table === "penyedia_jasa") {
          return {
            update: mockUpdate,
          };
        }
        return {};
      }),
    });

    const hasil = await UlasanService.perbaruiRatingPenyedia("penyedia-baru");
    expect(hasil).toEqual({
      rating_rata_rata: 0,
      total_ulasan: 0,
    });
    expect(mockUpdate).toHaveBeenCalledWith({ rating_rata_rata: 0 });
  });
});

describe("UlasanService.getRatingDanUlasanPenyedia", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("menolak jika ID penyedia jasa kosong", async () => {
    await expect(UlasanService.getRatingDanUlasanPenyedia("")).rejects.toThrow("ID penyedia jasa tidak valid");
  });

  it("mengembalikan data rating dan ulasan penyedia jasa dengan benar", async () => {
    mockCreateClient.mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === "penyedia_jasa") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                maybeSingle: vi.fn().mockResolvedValue({
                  data: { rating_rata_rata: 4.8 },
                  error: null,
                }),
              }),
            }),
          };
        }
        if (table === "pesanan") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: [{ id_pesanan: "p1" }],
                error: null,
              }),
            }),
          };
        }
        if (table === "ulasan") {
          return {
            select: vi.fn().mockReturnValue({
              in: vi.fn().mockResolvedValue({
                count: 5,
                error: null,
              }),
            }),
          };
        }
        return {};
      }),
    });

    const result = await UlasanService.getRatingDanUlasanPenyedia("penyedia-1");
    expect(result).toEqual({
      id_penyedia_jasa: "penyedia-1",
      rating_rata_rata: 4.8,
      total_ulasan: 5,
      tampilan: {
        rating_teks: "4.8",
        total_ulasan_teks: "5 ulasan",
        label: "★ 4.8 (5 ulasan)",
      },
    });
  });
});

describe("UlasanService.getStatistikUlasanJasa", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("mengembalikan rating 0 jika tidak ada pesanan untuk jasa tersebut", async () => {
    mockCreateClient.mockReturnValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: [], error: null }),
        }),
      }),
    });

    const result = await UlasanService.getStatistikUlasanJasa("jasa-kosong");
    expect(result).toEqual({ rata_rata_rating: 0, total_ulasan: 0 });
  });

  it("menghitung statistik ulasan berdasarkan id_jasa", async () => {
    mockCreateClient.mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === "pesanan") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: [{ id_pesanan: "p1" }, { id_pesanan: "p2" }],
                error: null,
              }),
            }),
          };
        }
        if (table === "ulasan") {
          return {
            select: vi.fn().mockReturnValue({
              in: vi.fn().mockResolvedValue({
                data: [{ rating: 5 }, { rating: 3 }],
                error: null,
              }),
            }),
          };
        }
        return {};
      }),
    });

    const result = await UlasanService.getStatistikUlasanJasa("jasa-1");
    expect(result).toEqual({ rata_rata_rating: 4.0, total_ulasan: 2 });
  });
});

describe("UlasanService.getUlasanJasaById & getUlasanbyJasa", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getUlasanJasaById mengembalikan daftar ulasan dan totalnya", async () => {
    const mockUlasanList = [
      { id_ulasan: "u1", rating: 5, komentar: "Bagus", created_at: "2026-01-01", id_pengguna_jasa: "user1" },
    ];

    mockCreateClient.mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === "pesanan") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ data: [{ id_pesanan: "p1" }] }),
            }),
          };
        }
        if (table === "ulasan") {
          return {
            select: vi.fn().mockReturnValue({
              in: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({ data: mockUlasanList, error: null, count: 1 }),
              }),
            }),
          };
        }
        return {};
      }),
    });

    const res = await UlasanService.getUlasanJasaById("jasa-1");
    expect(res).toEqual({ ulasan: mockUlasanList, total: 1 });
  });

  it("getUlasanbyJasa membatasi jumlah data sesuai parameter limit", async () => {
    const mockUlasanList = [
      { id_ulasan: "u1", rating: 5, komentar: "Sangat Puas", created_at: "2026-01-01", id_pengguna_jasa: "user1" },
    ];

    mockCreateClient.mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === "pesanan") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ data: [{ id_pesanan: "p1" }] }),
            }),
          };
        }
        if (table === "ulasan") {
          return {
            select: vi.fn().mockReturnValue({
              in: vi.fn().mockReturnValue({
                order: vi.fn().mockReturnValue({
                  limit: vi.fn().mockResolvedValue({ data: mockUlasanList, error: null, count: 1 }),
                }),
              }),
            }),
          };
        }
        return {};
      }),
    });

    const res = await UlasanService.getUlasanbyJasa("jasa-1", 1);
    expect(res).toEqual({ ulasan: mockUlasanList, total: 1 });
  });
});

describe("UlasanService.simpanUlasan", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("harus throw error jika pesanan tidak ditemukan", async () => {
    mockCreateClient.mockReturnValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { message: "Not found" } }),
          }),
        }),
      }),
    });

    await expect(
      UlasanService.simpanUlasan({
        id_pesanan: "invalid-p",
        id_pengguna_jasa: "user-1",
        rating: 5,
      })
    ).rejects.toThrow("Pesanan tidak ditemukan.");
  });

  it("berhasil menyimpan ulasan baru dan memicu perbaruiRatingPenyedia", async () => {
    const mockCreatedUlasan = {
      id_ulasan: "u-new",
      id_pesanan: "p-1",
      id_pengguna_jasa: "user-1",
      rating: 5,
      komentar: "Hebat",
    };

    vi.spyOn(UlasanService, "perbaruiRatingPenyedia").mockResolvedValue({
      rating_rata_rata: 5.0,
      total_ulasan: 1,
    });

    mockCreateClient.mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === "pesanan") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: { id_penyedia_jasa: "seller-1" } }),
              }),
            }),
          };
        }
        if (table === "ulasan") {
          return {
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: mockCreatedUlasan, error: null }),
              }),
            }),
          };
        }
        return {};
      }),
    });

    const res = await UlasanService.simpanUlasan({
      id_pesanan: "p-1",
      id_pengguna_jasa: "user-1",
      rating: 5,
      komentar: "Hebat",
    });

    expect(res).toEqual(mockCreatedUlasan);
    expect(UlasanService.perbaruiRatingPenyedia).toHaveBeenCalledWith("seller-1");
  });
});

describe("UlasanService.validasiOwnerUlasan, updateUlasan & deleteUlasan", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("validasiOwnerUlasan menolak pengguna yang bukan pemilik ulasan", async () => {
    mockCreateClient.mockReturnValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { id_pengguna_jasa: "pemilik-asli" } }),
          }),
        }),
      }),
    });

    await expect(
      UlasanService.validasiOwnerUlasan("ulasan-1", "bukan-pemilik")
    ).rejects.toThrow("Bukan Ulasan milik anda");
  });

  it("updateUlasan memperbarui ulasan dan pemicu pembaruan rating", async () => {
    vi.spyOn(UlasanService, "validasiOwnerUlasan").mockResolvedValue();
    vi.spyOn(UlasanService, "perbaruiRatingPenyedia").mockResolvedValue({ rating_rata_rata: 4.0, total_ulasan: 1 });

    mockCreateClient.mockReturnValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id_pesanan: "p1", pesanan: { id_penyedia_jasa: "seller-1" } },
            }),
          }),
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      }),
    });

    await expect(
      UlasanService.updateUlasan("u-1", "pemilik", { rating: 4, komentar: "Diubah" })
    ).resolves.not.toThrow();

    expect(UlasanService.perbaruiRatingPenyedia).toHaveBeenCalledWith("seller-1");
  });

  it("deleteUlasan menghapus ulasan dan memicu pembaruan rating", async () => {
    vi.spyOn(UlasanService, "validasiOwnerUlasan").mockResolvedValue();
    vi.spyOn(UlasanService, "perbaruiRatingPenyedia").mockResolvedValue({ rating_rata_rata: 0, total_ulasan: 0 });

    mockCreateClient.mockReturnValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id_pesanan: "p1", pesanan: { id_penyedia_jasa: "seller-1" } },
            }),
          }),
        }),
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      }),
    });

    await expect(UlasanService.deleteUlasan("u-1", "pemilik")).resolves.not.toThrow();

    expect(UlasanService.perbaruiRatingPenyedia).toHaveBeenCalledWith("seller-1");
  });
});