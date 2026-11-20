import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getStorageService } from "@/services/storage";
import { NotifikasiService } from "@/services/notifikasi.service";
import { PesananService } from "@/services/pesanan.service";
import { DeliverablesService } from "@/services/deliverables.service";
import {
  PelaporanService,
  TanggapanLaporanService,
} from "@/services/pelaporan.service";
import { UlasanService } from "@/services/ulasan.service";

/* =========================================================================
 * DEKLARASI vi.mock() — hanya satu kali per modul (di-hoist oleh Vitest).
 * Perilaku tiap pengujian diatur lewat vi.mocked(...) di beforeEach masing-masing.
 * ========================================================================= */

// Supabase user client (server) — dipakai semua service.
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

// Supabase admin client — dipakai UlasanService dan MediasiService.
vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(),
}));

// Storage — dipakai UlasanService.
vi.mock("@/services/storage", () => ({
  getStorageService: vi.fn(() => ({
    upload: vi.fn(),
    delete: vi.fn(),
  })),
}));

// Notifikasi — dipakai DeliverablesService dan MediasiService.
vi.mock("@/services/notifikasi.service", () => ({
  NotifikasiService: {
    kirimNotifikasi: vi.fn().mockResolvedValue(undefined),
  },
}));

/* =========================================================================
 * RESET GLOBAL — dijalankan sebelum setiap test di seluruh file
 * ========================================================================= */

beforeEach(() => {
  vi.clearAllMocks();

  // Pastikan tidak ada implementasi client yang bocor dari test sebelumnya.
  vi.mocked(createClient).mockReset();
  vi.mocked(createAdminClient).mockReset();

  // Kembalikan default mock storage dan notifikasi.
  vi.mocked(getStorageService)
    .mockReset()
    .mockReturnValue({ upload: vi.fn(), delete: vi.fn() } as never);
  vi.mocked(NotifikasiService.kirimNotifikasi)
    .mockReset()
    .mockResolvedValue(true);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

/* =========================================================================
 * HELPER 1 — Mock Supabase berbasis antrean global (I-11 dan I-12)
 * Metode order/single/maybeSingle bersifat terminal dan mengambil response
 * berikutnya dari antrean, tanpa memperhatikan nama tabel.
 * ========================================================================= */

type ResponsePesanan = {
  data: unknown;
  error: { message: string } | null;
};

const stateSupabasePesanan = {
  responseQueue: [] as ResponsePesanan[],
  updateCalls: 0,
};

function buatSupabasePesananMock() {
  return {
    from: vi.fn(() => {
      const query: Record<string, any> = {};

      query.select = vi.fn(() => query);
      query.eq = vi.fn(() => query);
      query.update = vi.fn(() => {
        stateSupabasePesanan.updateCalls += 1;
        return query;
      });
      query.order = vi.fn(
        async () =>
          stateSupabasePesanan.responseQueue.shift() ?? {
            data: [],
            error: null,
          },
      );
      query.maybeSingle = vi.fn(
        async () =>
          stateSupabasePesanan.responseQueue.shift() ?? {
            data: null,
            error: null,
          },
      );
      query.single = vi.fn(
        async () =>
          stateSupabasePesanan.responseQueue.shift() ?? {
            data: null,
            error: null,
          },
      );

      return query;
    }),
  };
}

/* =========================================================================
 * HELPER 2 — Mock Supabase berbasis antrean per pemanggilan from() (I-13 s.d. I-15)
 * Response diambil saat from() dipanggil; insert/update dicatat pada spy global.
 * ========================================================================= */

type ResponseDeliverables = {
  data: any;
  error: { message: string } | null;
};

const mockDeliverables = {
  responseQueue: [] as ResponseDeliverables[],
  from: vi.fn(),
  insert: vi.fn(),
  update: vi.fn(),
};

const mockRpc = vi.fn();

function buatQueryMock(response: ResponseDeliverables) {
  const query: Record<string, any> = {};

  query.select = vi.fn(() => query);
  query.insert = vi.fn((payload: unknown) => {
    mockDeliverables.insert(payload);
    return query;
  });
  query.update = vi.fn((payload: unknown) => {
    mockDeliverables.update(payload);
    return query;
  });
  query.eq = vi.fn(() => query);
  query.is = vi.fn(() => query);
  query.order = vi.fn(() => query);
  query.limit = vi.fn(() => query);
  query.single = vi.fn(async () => response);
  query.maybeSingle = vi.fn(async () => response);
  query.then = (
    resolve: (value: typeof response) => unknown,
    reject?: (reason: unknown) => unknown,
  ) => Promise.resolve(response).then(resolve, reject);

  return query;
}

function siapkanSupabaseDeliverables() {
  mockDeliverables.responseQueue.length = 0;
  mockDeliverables.from.mockImplementation((table: string) => {
    void table;
    const response = mockDeliverables.responseQueue.shift() ?? {
      data: null,
      error: null,
    };
    return buatQueryMock(response);
  });
  mockRpc.mockResolvedValue({ error: null });

  vi.mocked(createClient).mockResolvedValue({
    from: mockDeliverables.from,
    rpc: mockRpc,
  } as never);
}

/* =========================================================================
 * HELPER 3 — Mock Supabase berbasis antrean per tabel, catatan {tabel, metode, nilai}
 * (I-16 dan I-17)
 * ========================================================================= */

type HasilQuery = {
  data?: any;
  error?: { message: string; code?: string } | null;
  count?: number | null;
};

function buatSupabaseMock(hasil: Record<string, HasilQuery[]>) {
  const antrean: Record<string, HasilQuery[]> = Object.fromEntries(
    Object.entries(hasil).map(([tabel, daftar]) => [tabel, [...daftar]]),
  );

  const panggilan: { tabel: string; metode: string; nilai?: unknown }[] = [];

  const supabase = {
    from: vi.fn((tabel: string) => {
      const builder: Record<string, any> = {};

      const ambilHasil = () => {
        const daftar = antrean[tabel] ?? [];
        return daftar.shift() ?? { data: null, error: null };
      };

      for (const method of [
        "select",
        "eq",
        "in",
        "or",
        "order",
        "limit",
        "insert",
        "update",
        "delete",
      ]) {
        builder[method] = vi.fn((nilai?: unknown) => {
          panggilan.push({ tabel, metode: method, nilai });
          return builder;
        });
      }

      builder.single = vi.fn(async () => ambilHasil());
      builder.maybeSingle = vi.fn(async () => ambilHasil());
      builder.then = (
        resolve: (value: HasilQuery) => unknown,
        reject?: (reason: unknown) => unknown,
      ) => Promise.resolve(ambilHasil()).then(resolve, reject);

      return builder;
    }),
  };

  return { supabase, panggilan };
}

/* =========================================================================
 * HELPER 4 — Mock Supabase berbasis antrean per tabel, catatan {tabel, operasi, argumen}
 * dan mendukung rpc (I-18 dan I-19)
 * ========================================================================= */

type HasilQueryOperasi = {
  data?: any;
  error?: any;
};

function buatSupabaseMockOperasi(
  hasilPerTabel: Record<string, HasilQueryOperasi[]>,
) {
  const panggilan: Array<{
    tabel: string;
    operasi: string;
    argumen: any[];
  }> = [];

  const supabase = {
    from: vi.fn((tabel: string) => {
      let operasi = "select";

      const ambilHasil = () => {
        const antrean = hasilPerTabel[tabel] ?? [];
        const hasil = antrean.shift() ?? { data: null, error: null };
        return hasil;
      };

      const builder: any = {
        select: vi.fn((...args: any[]) => {
          operasi = "select";
          panggilan.push({ tabel, operasi, argumen: args });
          return builder;
        }),
        insert: vi.fn((...args: any[]) => {
          operasi = "insert";
          panggilan.push({ tabel, operasi, argumen: args });
          return builder;
        }),
        update: vi.fn((...args: any[]) => {
          operasi = "update";
          panggilan.push({ tabel, operasi, argumen: args });
          return builder;
        }),
        delete: vi.fn((...args: any[]) => {
          operasi = "delete";
          panggilan.push({ tabel, operasi, argumen: args });
          return builder;
        }),
        eq: vi.fn((...args: any[]) => {
          panggilan.push({ tabel, operasi: "eq", argumen: args });
          return builder;
        }),
        order: vi.fn((...args: any[]) => {
          panggilan.push({ tabel, operasi: "order", argumen: args });
          return builder;
        }),
        single: vi.fn(() => Promise.resolve(ambilHasil())),
        maybeSingle: vi.fn(() => Promise.resolve(ambilHasil())),
        then: (
          resolve: (value: HasilQueryOperasi) => unknown,
          reject: (reason: any) => unknown,
        ) => Promise.resolve(ambilHasil()).then(resolve, reject),
      };

      return builder;
    }),
    rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
  };

  return { supabase, panggilan };
}

/* =========================================================================
 * I-11 — PesananService.ambilDaftarPesanan
 * ========================================================================= */

const pesananPengguna = [
  {
    id_pesanan: "ord-001",
    id_pengguna_jasa: "user-001",
    id_penyedia_jasa: "provider-001",
    id_jasa: "jasa-001",
    brief: "Desain logo",
    total_biaya: 250000,
    status_pesanan: "DIPROSES",
    created_at: "2026-11-19T10:00:00.000Z",
    ulasan: null,
    penyedia_jasa: {
      id: "provider-001",
      pengguna: { id: "account-001", nama: "Penyedia Satu" },
    },
    pemesan: { pengguna: { nama: "Pengguna Satu" } },
  },
  {
    id_pesanan: "ord-002",
    id_pengguna_jasa: "user-001",
    id_penyedia_jasa: "provider-002",
    id_jasa: "jasa-002",
    brief: "Edit video",
    total_biaya: 150000,
    status_pesanan: "SELESAI",
    created_at: "2026-11-18T10:00:00.000Z",
    ulasan: [{ id_ulasan: "review-001", rating: 5 }],
    penyedia_jasa: {
      id: "provider-002",
      pengguna: { id: "account-002", nama: "Penyedia Dua" },
    },
    pemesan: { pengguna: { nama: "Pengguna Satu" } },
  },
];

describe("Pengujian Integrasi I-11 — PesananService.ambilDaftarPesanan", () => {
  beforeEach(() => {
    stateSupabasePesanan.responseQueue.length = 0;
    stateSupabasePesanan.updateCalls = 0;
    vi.mocked(createClient).mockResolvedValue(
      buatSupabasePesananMock() as never,
    );
  });

  it("INT-TC11-1: mengembalikan seluruh pesanan milik pengguna beserta statusnya", async () => {
    stateSupabasePesanan.responseQueue.push({
      data: pesananPengguna,
      error: null,
    });

    const hasil = await PesananService.ambilDaftarPesanan(
      "user-001",
      "pengguna_jasa",
    );

    expect(hasil).toHaveLength(2);
    expect(hasil.map((pesanan) => pesanan.id_pesanan)).toEqual([
      "ord-001",
      "ord-002",
    ]);
    expect(hasil.map((pesanan) => pesanan.status_pesanan)).toEqual([
      "DIPROSES",
      "SELESAI",
    ]);
    expect(hasil[0].sudah_diulas).toBe(false);
    expect(hasil[1].sudah_diulas).toBe(true);
    expect(hasil[1].rating_ulasan).toBe(5);
  });

  it("INT-TC11-2: mengembalikan daftar kosong jika pengguna belum memiliki pesanan", async () => {
    stateSupabasePesanan.responseQueue.push({ data: [], error: null });

    const hasil = await PesananService.ambilDaftarPesanan(
      "user-baru",
      "pengguna_jasa",
    );

    expect(hasil).toEqual([]);
  });
});

/* =========================================================================
 * I-12 — PesananService.respondOrder
 * ========================================================================= */

describe("Pengujian Integrasi I-12 — PesananService.respondOrder", () => {
  beforeEach(() => {
    stateSupabasePesanan.responseQueue.length = 0;
    stateSupabasePesanan.updateCalls = 0;
    vi.mocked(createClient).mockResolvedValue(
      buatSupabasePesananMock() as never,
    );
  });

  it("INT-TC12-1: menerima pesanan dan memperbarui status menjadi DIPROSES", async () => {
    stateSupabasePesanan.responseQueue.push(
      {
        data: {
          id_pesanan: "ord-003",
          id_pengguna_jasa: "user-001",
          id_penyedia_jasa: "provider-001",
          id_jasa: "jasa-001",
          brief: "Desain logo",
          total_biaya: 250000,
          status_pembayaran: "LUNAS",
          status_pesanan: "MENUNGGU_KONFIRMASI",
        },
        error: null,
      },
      {
        data: {
          id_pesanan: "ord-003",
          status_pesanan: "DIPROSES",
          status_pembayaran: "LUNAS",
        },
        error: null,
      },
    );

    const hasil = await PesananService.respondOrder({
      id_pesanan: "ord-003",
      user_id: "provider-001",
      action: "Diterima",
    });

    expect(hasil.id_pesanan).toBe("ord-003");
    expect(hasil.status_pesanan).toBe("DIPROSES");
    expect(stateSupabasePesanan.updateCalls).toBe(1);
  });

  it("INT-TC12-2: menolak pesanan yang sudah DIPROSES dan tidak memperbarui data", async () => {
    stateSupabasePesanan.responseQueue.push({
      data: {
        id_pesanan: "ord-004",
        id_pengguna_jasa: "user-001",
        id_penyedia_jasa: "provider-001",
        id_jasa: "jasa-001",
        brief: "Desain logo",
        total_biaya: 250000,
        status_pembayaran: "LUNAS",
        status_pesanan: "DIPROSES",
      },
      error: null,
    });

    await expect(
      PesananService.respondOrder({
        id_pesanan: "ord-004",
        user_id: "provider-001",
        action: "Diterima",
      }),
    ).rejects.toThrow("Pesanan ini sudah diproses sebelumnya");

    expect(stateSupabasePesanan.updateCalls).toBe(0);
  });
});

/* =========================================================================
 * I-13 — DeliverablesService.submitDeliverable
 * ========================================================================= */

describe("Pengujian Integrasi I-13 — DeliverablesService.submitDeliverable", () => {
  beforeEach(() => {
    siapkanSupabaseDeliverables();
  });

  it("INT-TC13-1: menyimpan hasil pekerjaan dan memperbarui status pesanan", async () => {
    const produkAkhir = {
      id_produk_akhir: "produk-akhir-001",
      id_pesanan: "pesanan-001",
      deskripsi_produk: "Hasil desain logo",
      file_url: "https://storage.example/hasil-logo.pdf",
      status_pemeriksaan: false,
    };

    mockDeliverables.responseQueue.push(
      { data: produkAkhir, error: null },
      { data: null, error: null },
      {
        data: {
          id_pengguna_jasa: "pengguna-001",
          jasa: { nama_jasa: "Desain Logo" },
        },
        error: null,
      },
    );

    const hasil = await DeliverablesService.submitDeliverable({
      id_pesanan: "pesanan-001",
      deskripsi_produk: "  Hasil desain logo  ",
      file_url: "https://storage.example/hasil-logo.pdf",
    });

    expect(hasil).toMatchObject(produkAkhir);
    expect(mockDeliverables.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        id_pesanan: "pesanan-001",
        deskripsi_produk: "Hasil desain logo",
        file_url: "https://storage.example/hasil-logo.pdf",
        status_pemeriksaan: false,
      }),
    );
    expect(mockDeliverables.update).toHaveBeenCalledWith({
      status_pesanan: "MENUNGGU_KONFIRMASI_SELESAI",
    });
  });

  it("INT-TC13-2: menolak pengumpulan jika berkas dan tautan sama-sama kosong", async () => {
    await expect(
      DeliverablesService.submitDeliverable({
        id_pesanan: "pesanan-002",
        deskripsi_produk: "Hasil pekerjaan tanpa lampiran",
      }),
    ).rejects.toThrow("Unggah berkas atau sertakan tautan hasil pekerjaan.");

    expect(mockDeliverables.insert).not.toHaveBeenCalled();
    expect(mockDeliverables.update).not.toHaveBeenCalled();
  });
});

/* =========================================================================
 * I-14 — DeliverablesService (konfirmasi selesai dan ambil deliverable)
 * ========================================================================= */

describe("Pengujian Integrasi I-14 — DeliverablesService", () => {
  beforeEach(() => {
    siapkanSupabaseDeliverables();
  });

  it("INT-TC14-1: mengonfirmasi pesanan selesai dan memanggil RPC pencairan dana", async () => {
    mockDeliverables.responseQueue.push(
      {
        data: { id_pengguna_jasa: "pengguna-001" },
        error: null,
      },
      {
        data: {
          id_penyedia_jasa: "penyedia-001",
          total_biaya: 200000,
          jasa: { nama_jasa: "Desain Logo" },
        },
        error: null,
      },
    );

    await expect(
      DeliverablesService.confirmOrderComplete("pesanan-003", "pengguna-001"),
    ).resolves.toBeUndefined();

    expect(mockRpc).toHaveBeenCalledWith("konfirmasi_pesanan_selesai", {
      p_id_pesanan: "pesanan-003",
    });
  });

  it("INT-TC14-2: mengembalikan null jika hasil pekerjaan belum dikumpulkan", async () => {
    mockDeliverables.responseQueue.push(
      {
        data: {
          id_pengguna_jasa: "pengguna-001",
          id_penyedia_jasa: "penyedia-001",
        },
        error: null,
      },
      { data: null, error: null },
    );

    const hasil = await DeliverablesService.getDeliverableByPesanan(
      "pesanan-004",
      "pengguna-001",
    );

    expect(hasil).toBeNull();
  });
});

/* =========================================================================
 * I-15 — DeliverablesService.requestRevision
 * ========================================================================= */

describe("Pengujian Integrasi I-15 — DeliverablesService.requestRevision", () => {
  const dataRevisi = {
    id_pesanan: "pesanan-005",
    deskripsi_revisi: "Mohon perbaiki bagian warna",
    id_produk_akhir: "produk-akhir-005",
    user_id: "pengguna-001",
  };

  beforeEach(() => {
    siapkanSupabaseDeliverables();
  });

  it("INT-TC15-1: menyimpan pengajuan revisi dan mengurangi kuota menjadi 2", async () => {
    const revisiBaru = {
      id_revisi: "revisi-005",
      id_produk_akhir: "produk-akhir-005",
      id_pesanan: "pesanan-005",
      deskripsi_revisi: "Mohon perbaiki bagian warna",
      jml_revisi_tersedia: 2,
      status_pengerjaan: "Sedang Direvisi",
    };

    mockDeliverables.responseQueue.push(
      { data: { id_pengguna_jasa: "pengguna-001" }, error: null },
      { data: { id_produk_akhir: "produk-akhir-005" }, error: null },
      { data: null, error: null },
      { data: revisiBaru, error: null },
      { data: null, error: null },
      {
        data: {
          id_penyedia_jasa: "penyedia-001",
          jasa: { nama_jasa: "Desain Logo" },
        },
        error: null,
      },
    );

    const hasil = await DeliverablesService.requestRevision(dataRevisi);

    expect(hasil).toMatchObject({
      id_revisi: "revisi-005",
      jml_revisi_tersedia: 2,
      status_pengerjaan: "Sedang Direvisi",
    });
    expect(mockDeliverables.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        id_pesanan: "pesanan-005",
        id_produk_akhir: "produk-akhir-005",
        jml_revisi_tersedia: 2,
        status_pengerjaan: "Sedang Direvisi",
      }),
    );
  });

  it("INT-TC15-2: menolak pengajuan jika kuota revisi sudah habis", async () => {
    mockDeliverables.responseQueue.push(
      { data: { id_pengguna_jasa: "pengguna-001" }, error: null },
      { data: { id_produk_akhir: "produk-akhir-005" }, error: null },
      {
        data: {
          id_revisi: "revisi-sebelumnya",
          jml_revisi_tersedia: 0,
          status_pengerjaan: "Revisi Dikumpulkan",
        },
        error: null,
      },
    );

    await expect(
      DeliverablesService.requestRevision(dataRevisi),
    ).rejects.toThrow("Kuota revisi untuk pesanan ini sudah habis.");

    expect(mockDeliverables.insert).not.toHaveBeenCalled();
  });
});

/* =========================================================================
 * I-16 — PelaporanService.submitLaporan
 * ========================================================================= */

describe("Pengujian Integrasi I-16 — PelaporanService.submitLaporan", () => {
  it("INT-TC16-1: menyimpan laporan dan menentukan terlapor berdasarkan pesanan", async () => {
    const dataTiket = {
      id_tiket: "tiket-001",
      id_pesanan: "pesanan-001",
      id_pelapor: "pengguna-001",
      id_terlapor: "penyedia-001",
      kategori: ["Kualitas layanan"],
      deskripsi_laporan: "Hasil pekerjaan tidak sesuai kesepakatan",
      url_bukti: ["https://contoh.com/bukti.png"],
    };

    const { supabase } = buatSupabaseMock({
      pesanan: [
        {
          data: {
            id_pengguna_jasa: "pengguna-001",
            id_penyedia_jasa: "penyedia-001",
          },
          error: null,
        },
      ],
      tiket_laporan: [
        { data: null, error: null },
        { data: dataTiket, error: null },
      ],
    });

    vi.mocked(createClient).mockResolvedValue(supabase as never);

    const hasil = await PelaporanService.submitLaporan(
      "pesanan-001",
      "pengguna-001",
      {
        deskripsi_laporan: " Hasil pekerjaan tidak sesuai kesepakatan ",
        kategori: ["Kualitas layanan"],
        url_bukti: ["https://contoh.com/bukti.png"],
      },
    );

    expect(hasil).toEqual(dataTiket);
    expect(supabase.from).toHaveBeenCalledWith("pesanan");
    expect(supabase.from).toHaveBeenCalledWith("tiket_laporan");
  });

  it("INT-TC16-2: menolak laporan jika tautan atau lampiran bukti kosong", async () => {
    await expect(
      PelaporanService.submitLaporan("pesanan-001", "pengguna-001", {
        deskripsi_laporan: "Saya ingin mengajukan laporan",
        kategori: ["Kualitas layanan"],
        url_bukti: [],
      }),
    ).rejects.toThrow("Minimal sertakan 1 tautan atau lampiran bukti.");

    expect(createClient).not.toHaveBeenCalled();
  });
});

/* =========================================================================
 * I-17 — UlasanService.simpanUlasan
 * ========================================================================= */

describe("Pengujian Integrasi I-17 — UlasanService.simpanUlasan", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://contoh.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-role-test");
  });

  it("INT-TC17-1: menyimpan ulasan dan memperbarui rating penyedia serta jasa", async () => {
    const dataUlasan = {
      id_ulasan: "ulasan-001",
      id_pesanan: "pesanan-001",
      id_pengguna_jasa: "pengguna-001",
      rating: 5,
      komentar: "Pelayanan sangat baik",
      dokumentasi_path: [],
    };

    const { supabase: supabaseUser } = buatSupabaseMock({
      pesanan: [
        {
          data: {
            id_pesanan: "pesanan-001",
            id_pengguna_jasa: "pengguna-001",
            id_penyedia_jasa: "penyedia-001",
            id_jasa: "jasa-001",
            status_pesanan: "Selesai",
          },
          error: null,
        },
      ],
      ulasan: [
        { data: null, error: null },
        { data: dataUlasan, error: null },
      ],
    });

    const { supabase: supabaseAdmin, panggilan: panggilanAdmin } =
      buatSupabaseMock({
        pesanan: [
          { data: [{ id_pesanan: "pesanan-001" }], error: null },
          { data: [{ id_pesanan: "pesanan-001" }], error: null },
        ],
        ulasan: [
          { data: [{ rating: 5 }], error: null },
          { data: [{ rating: 5 }], error: null },
        ],
        penyedia_jasa: [{ data: null, error: null }],
        jasa: [{ data: null, error: null }],
      });

    vi.mocked(createClient).mockResolvedValue(supabaseUser as never);
    vi.mocked(createAdminClient).mockReturnValue(supabaseAdmin as never);

    const storageMock = {
      upload: vi.fn(),
      delete: vi.fn(),
    };
    vi.mocked(getStorageService).mockReturnValue(storageMock as never);

    const hasil = await UlasanService.simpanUlasan({
      id_pesanan: "pesanan-001",
      id_pengguna_jasa: "pengguna-001",
      rating: 5,
      komentar: " Pelayanan sangat baik ",
    });

    expect(hasil).toEqual(dataUlasan);
    expect(supabaseUser.from).toHaveBeenCalledWith("pesanan");
    expect(supabaseUser.from).toHaveBeenCalledWith("ulasan");

    expect(supabaseAdmin.from).toHaveBeenCalledWith("pesanan");
    expect(supabaseAdmin.from).toHaveBeenCalledWith("ulasan");
    expect(supabaseAdmin.from).toHaveBeenCalledWith("penyedia_jasa");
    expect(supabaseAdmin.from).toHaveBeenCalledWith("jasa");

    const updatePenyedia = panggilanAdmin.find(
      (panggilan) =>
        panggilan.tabel === "penyedia_jasa" && panggilan.metode === "update",
    );
    const updateJasa = panggilanAdmin.find(
      (panggilan) => panggilan.tabel === "jasa" && panggilan.metode === "update",
    );

    expect(updatePenyedia?.nilai).toEqual({ rating_rata_rata: 5 });
    expect(updateJasa?.nilai).toEqual({ rating_rata_rata: 5 });
  });

  it("INT-TC17-2: menolak ulasan jika rating berada di luar rentang 1 sampai 5", async () => {
    await expect(
      UlasanService.simpanUlasan({
        id_pesanan: "pesanan-001",
        id_pengguna_jasa: "pengguna-001",
        rating: 0,
        komentar: "Pelayanan kurang baik",
      }),
    ).rejects.toThrow("Rating harus bernilai antara 1 sampai 5.");

    expect(createClient).not.toHaveBeenCalled();
    expect(createAdminClient).not.toHaveBeenCalled();
  });
});

/* =========================================================================
 * I-18 — TanggapanLaporanService dan MediasiService
 * ========================================================================= */

describe("Pengujian Integrasi I-18 — Tanggapan Laporan dan Mediasi", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://contoh.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-role-test");
  });

  it("INT-TC18-1: menyimpan keputusan tindakan admin dan memperbarui status tiket", async () => {
    const tiket = {
      id_tiket: "tiket-001",
      id_pesanan: "pesanan-001",
      id_pelapor: "user-001",
      id_terlapor: "user-002",
      status_tiket: "Diproses",
    };
    const tanggapan = {
      id_tanggapan: "tanggapan-001",
      id_tiket: "tiket-001",
      jenis_tindakan: "PERINGATAN",
      catatan_tanggapan: "Berikan peringatan kepada terlapor.",
    };

    const { supabase, panggilan } = buatSupabaseMockOperasi({
      tiket_laporan: [
        { data: tiket, error: null },
        { data: null, error: null },
      ],
      tanggapan_laporan: [{ data: tanggapan, error: null }],
    });
    vi.mocked(createClient).mockResolvedValue(supabase as never);

    const hasil = await TanggapanLaporanService.catatKeputusanTindakan({
      id_tiket: "tiket-001",
      id_admin: "admin-001",
      jenis_tindakan: "PERINGATAN",
      catatan_tanggapan: "  Berikan peringatan kepada terlapor.  ",
    });

    expect(hasil).toEqual(tanggapan);
    expect(supabase.rpc).toHaveBeenCalledWith("admin_beri_sanksi", {
      p_id_pengguna: "user-002",
      p_jenis_tindakan: "PERINGATAN",
    });
    expect(panggilan).toContainEqual({
      tabel: "tanggapan_laporan",
      operasi: "insert",
      argumen: [
        [
          {
            id_tiket: "tiket-001",
            jenis_tindakan: "PERINGATAN",
            catatan_tanggapan: "Berikan peringatan kepada terlapor.",
          },
        ],
      ],
    });
    expect(panggilan).toContainEqual({
      tabel: "tiket_laporan",
      operasi: "update",
      argumen: [{ status_tiket: "Selesai" }],
    });
  });

  it("INT-TC18-2: membuat sesi mediasi dan pesan pembuka serta mengirim notifikasi ke kedua pihak", async () => {
    const tiket = {
      id_tiket: "tiket-001",
      id_pesanan: "pesanan-001",
      id_pelapor: "user-001",
      id_terlapor: "user-002",
      status_tiket: "Diproses",
    };
    const sesi = {
      id_sesi_mediasi: "sesi-001",
      id_tiket: "tiket-001",
      id_admin: "admin-001",
      status_sesi: "BERLANGSUNG",
    };
    const pesan = {
      id_pesan: "pesan-001",
      id_sesi_mediasi: "sesi-001",
      id_pengirim: "admin-001",
      isi_pesan:
        "Halo, sesi mediasi untuk tiket laporan #tiket-001 telah dibuka oleh Admin. Silakan sampaikan kronologi dan bukti masing-masing secara jelas.",
    };

    const { supabase, panggilan } = buatSupabaseMockOperasi({
      tiket_laporan: [{ data: tiket, error: null }],
      admin: [{ data: { id: "admin-001" }, error: null }],
      sesi_mediasi: [
        { data: null, error: null },
        { data: sesi, error: null },
      ],
      pesan_mediasi: [{ data: pesan, error: null }],
    });
    vi.mocked(createAdminClient).mockReturnValue(supabase as never);

    // MediasiService membuat admin client saat modul dimuat,
    // sehingga modul harus diimpor ulang setelah mock disiapkan.
    vi.resetModules();
    const { MediasiService } = await import("@/services/mediasi.service");

    const hasil = await MediasiService.mulaiMediasi("tiket-001", "admin-001");

    expect(hasil).toEqual({
      is_new: true,
      sesi,
      pesan_awal: pesan,
    });
    expect(panggilan).toContainEqual({
      tabel: "sesi_mediasi",
      operasi: "insert",
      argumen: [
        {
          id_tiket: "tiket-001",
          id_admin: "admin-001",
          status_sesi: "BERLANGSUNG",
        },
      ],
    });
    expect(panggilan).toContainEqual({
      tabel: "pesan_mediasi",
      operasi: "insert",
      argumen: [
        {
          id_sesi_mediasi: "sesi-001",
          id_pengirim: "admin-001",
          isi_pesan: expect.stringContaining("telah dibuka oleh Admin"),
        },
      ],
    });
    expect(NotifikasiService.kirimNotifikasi).toHaveBeenCalledTimes(2);
    expect(NotifikasiService.kirimNotifikasi).toHaveBeenCalledWith(
      expect.objectContaining({
        id_pengguna: "user-001",
        id_referensi: "sesi-001",
      }),
    );
    expect(NotifikasiService.kirimNotifikasi).toHaveBeenCalledWith(
      expect.objectContaining({
        id_pengguna: "user-002",
        id_referensi: "sesi-001",
      }),
    );
  });

  it("INT-TC18-3: menggunakan sesi mediasi yang masih berlangsung tanpa membuat sesi baru", async () => {
    const sesiAktif = {
      id_sesi_mediasi: "sesi-aktif",
      id_tiket: "tiket-001",
      id_admin: "admin-001",
      status_sesi: "BERLANGSUNG",
    };

    const { supabase, panggilan } = buatSupabaseMockOperasi({
      tiket_laporan: [
        {
          data: {
            id_tiket: "tiket-001",
            id_pesanan: "pesanan-001",
            id_pelapor: "user-001",
            id_terlapor: "user-002",
            status_tiket: "Diproses",
          },
          error: null,
        },
      ],
      admin: [{ data: { id: "admin-001" }, error: null }],
      sesi_mediasi: [{ data: sesiAktif, error: null }],
    });
    vi.mocked(createAdminClient).mockReturnValue(supabase as never);

    vi.resetModules();
    const { MediasiService } = await import("@/services/mediasi.service");

    const hasil = await MediasiService.mulaiMediasi("tiket-001", "admin-001");

    expect(hasil).toEqual({ is_new: false, sesi: sesiAktif });
    expect(
      panggilan.some(
        (p) => p.tabel === "sesi_mediasi" && p.operasi === "insert",
      ),
    ).toBe(false);
    expect(supabase.from).not.toHaveBeenCalledWith("pesan_mediasi");
    expect(NotifikasiService.kirimNotifikasi).not.toHaveBeenCalled();
  });
});

/* =========================================================================
 * I-19 — Dashboard Admin (TanggapanLaporanService)
 * ========================================================================= */

describe("Pengujian Integrasi I-19 — Dashboard Admin", () => {
  it("INT-TC19-1: mengambil seluruh tiket laporan untuk dashboard admin", async () => {
    const daftarTiket = [
      { id_tiket: "tiket-001", status_tiket: "Diproses" },
      { id_tiket: "tiket-002", status_tiket: "Selesai" },
    ];
    const { supabase, panggilan } = buatSupabaseMockOperasi({
      tiket_laporan: [{ data: daftarTiket, error: null }],
    });
    vi.mocked(createClient).mockResolvedValue(supabase as never);

    const hasil = await TanggapanLaporanService.getAllTicketsForAdmin();

    expect(hasil).toEqual(daftarTiket);
    expect(supabase.from).toHaveBeenCalledWith("tiket_laporan");
    expect(panggilan).toContainEqual({
      tabel: "tiket_laporan",
      operasi: "order",
      argumen: ["created_at", { ascending: false }],
    });
  });

  it("INT-TC19-2: mengambil detail tiket laporan berdasarkan ID untuk admin", async () => {
    const detailTiket = {
      id_tiket: "tiket-001",
      status_tiket: "Diproses",
      tanggapan_laporan: [],
      pesanan: {
        id_pesanan: "pesanan-001",
        total_biaya: 150000,
        status_pesanan: "SELESAI",
      },
    };
    const { supabase } = buatSupabaseMockOperasi({
      tiket_laporan: [{ data: detailTiket, error: null }],
    });
    vi.mocked(createClient).mockResolvedValue(supabase as never);

    const hasil =
      await TanggapanLaporanService.getDetailTiketAdmin("tiket-001");

    expect(hasil).toEqual(detailTiket);
    expect(supabase.from).toHaveBeenCalledWith("tiket_laporan");
  });
});
