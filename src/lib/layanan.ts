// Endpoint backend yang sudah ada di app/api (isi fungsi di bawah nanti memanggil ini; cek kontraknya dengan teman backend):
//  getTransaksi/getPesananStatus/terima/tolakPesanan -> /api/pesanan | getHasil/kirimHasil/konfirmasiSelesai/ajukanRevisi -> /api/deliverables
//  validasi & unggah berkas -> /api/upload | tiket/mediasi admin -> /api/mediasi | loginAdmin -> /api/auth
// KONTRAK FRONTEND <-> BACKEND. Sekarang berisi MOCK; backend tinggal mengganti isi fungsi (tanda tangan tetap).
// ID mock: hasil id "1" = revisi diminta, id "3" = kuota revisi habis, lainnya = menunggu pemeriksaan.

export type Transaksi = {
  id: string;
  judul: string;
  penyedia: string;
  harga: number;
  status: "berjalan" | "cek" | "selesai" | "dikembalikan";
  rating?: number;
};

export type Tiket = {
  id: string;
  pelapor: string;
  terlapor: string;
  kategori: string;
  deskripsi: string;
  tanggal: string;
  status: "Belum" | "Mediasi" | "Selesai";
};

export type TipeLampiran = "berkas" | "gambar" | "tautan";

export type Hasil = {
  id: string;
  judul: string;
  catatan: string;
  kuota: number;
  status: "menunggu" | "revisi" | "selesai";
  revisi?: string;
  berkas: {
    nama: string;
    info: string;
    tipe: TipeLampiran;
    url: string;
  }[];
};

// Data mock pengajuan revisi.
export type PengajuanRevisiMock = {
  idPesanan: string;
  detail: string;
  pesan: string;
  berkas: Hasil["berkas"];
  kuotaTersisa: number;
};

export const MAX_MB = 10; // TODO: isi sesuai ketentuan (desain masih "[UKURAN MAKS]")
export const FORMAT_BERKAS: string[] = ["jpg", "jpeg", "png", "pdf"];

export const MOCK = { tiketKosong: false }; // true = tampilkan empty state dashboard admin

export const rp = (n: number) => "Rp " + n.toLocaleString("id-ID");

const wait = <T,>(v: T) =>
  new Promise<T>((r) => setTimeout(() => r(v), 300));

export function validasiBerkas(f: File[]) {
  for (const x of f) {
    if (!/\.(jpe?g|png|pdf)$/i.test(x.name))
      return `${x.name} · format tidak didukung`;

    if (x.size > MAX_MB * 1048576)
      return `${x.name} · melebihi ${MAX_MB} MB`;
  }

  return null;
}

const S = ["Belum", "Mediasi", "Selesai"] as const;

// Data mock tiket laporan admin.
// Menggunakan let agar data tiket dapat diperbarui selama aplikasi berjalan.
let T: Tiket[] = [1, 2, 3].map((i) => ({
  id: `TKT00${i}`,
  pelapor: "Budi",
  terlapor: "Sari",
  kategori: "Pekerjaan tidak sesuai kesepakatan",
  deskripsi: "Desainnya jelek",
  tanggal: "6/6/26",
  status: S[i - 1],
}));

// Penyimpanan sementara hasil pekerjaan berdasarkan idPesanan.
// Data ini hanya bertahan selama aplikasi tidak di-refresh.
const penyimpananHasil = new Map<string, Hasil>();

// Penyimpanan sementara pengajuan revisi berdasarkan idPesanan.
// Data ini hanya bertahan selama aplikasi tidak di-refresh.
const penyimpananRevisi = new Map<string, PengajuanRevisiMock>();

// Membuat data mock awal untuk hasil pekerjaan.
function buatMockHasil(idPesanan: string): Hasil {
  return {
    id: idPesanan,
    judul: "Desain logo & identitas brand",
    catatan: "Logo final 3 versi (warna, hitam-putih, ikon) beserta panduan.",
    kuota: idPesanan === "3" ? 0 : 3,
    status: idPesanan === "1" ? "revisi" : "menunggu",
    revisi: "Warna logo dibuat lebih hangat dan ikon diperbesar sedikit.",
    berkas: [
      {
        nama: "logo-final.zip",
        info: "Arsip ZIP · 8,4 MB",
        tipe: "berkas",
        url: "#",
      },
      {
        nama: "preview-logo.png",
        info: "Gambar · 1,2 MB",
        tipe: "gambar",
        url: "#",
      },
      {
        nama: "https://tautan-hasil",
        info: "Tautan eksternal",
        tipe: "tautan",
        url: "https://tautan-hasil",
      },
    ],
  };
}

// Mengubah ukuran file menjadi format yang mudah dibaca.
function formatUkuran(size: number) {
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

// Mengubah file hasil upload menjadi data lampiran.
function ubahKeLampiran(files: File[]): Hasil["berkas"] {
  return files.map((file) => {
    const gambar = file.type.startsWith("image/");

    return {
      nama: file.name,
      info: `${gambar ? "Gambar" : "Berkas"} · ${formatUkuran(file.size)}`,
      tipe: gambar ? "gambar" : "berkas",
      url: URL.createObjectURL(file),
    };
  });
}

// Data transaksi
export const getTransaksi = () =>
  wait<Transaksi[]>([
    {
      id: "1",
      judul: "Desain logo & identitas brand",
      penyedia: "Sari",
      harga: 500000,
      status: "berjalan",
    },
    {
      id: "2",
      judul: "Les matematika SMA (4 sesi)",
      penyedia: "Andi",
      harga: 400000,
      status: "cek",
    },
    {
      id: "3",
      judul: "Servis & cuci AC rumah",
      penyedia: "Joko",
      harga: 150000,
      status: "selesai",
    },
    {
      id: "4",
      judul: "Foto produk katalog",
      penyedia: "Rani",
      harga: 350000,
      status: "selesai",
      rating: 5,
    },
    {
      id: "5",
      judul: "Website toko UMKM",
      penyedia: "Dewi",
      harga: 1500000,
      status: "dikembalikan",
    },
  ]);

// Mengambil hasil pekerjaan berdasarkan idPesanan.
export const getHasil = async (idPesanan: string) => {
  const data =
    penyimpananHasil.get(idPesanan) ?? buatMockHasil(idPesanan);

  penyimpananHasil.set(idPesanan, data);

  return wait<Hasil>(data);
};

// Menerima data hasil pekerjaan dari halaman Pengumpulan.
export const kirimHasil = async (
  idPesanan: string,
  d: { deskripsi: string; tautan: string; files: File[] }
) => {
  const hasilSebelumnya =
    penyimpananHasil.get(idPesanan) ?? buatMockHasil(idPesanan);

  // Mengubah file yang diunggah menjadi lampiran.
  const lampiranFile = ubahKeLampiran(d.files);

  // Menambahkan tautan jika pengguna mengisi tautan hasil.
  const lampiranTautan = d.tautan.trim()
    ? [
        {
          nama: d.tautan.trim(),
          info: "Tautan eksternal",
          tipe: "tautan" as const,
          url: d.tautan.trim(),
        },
      ]
    : [];

  // Menyimpan hasil pekerjaan sementara.
  const hasilBaru: Hasil = {
    ...hasilSebelumnya,
    id: idPesanan,
    catatan: d.deskripsi,
    status: "menunggu",
    revisi: undefined,
    berkas: [...lampiranFile, ...lampiranTautan],
  };

  penyimpananHasil.set(idPesanan, hasilBaru);

  return wait(true);
};

export const terimaPesanan = (id: string) => wait(true);
export const tolakPesanan = (id: string) => wait(true);

// Mengonfirmasi penyelesaian pekerjaan oleh pengguna.
export const konfirmasiSelesai = async (idPesanan: string) => {
  const hasil = penyimpananHasil.get(idPesanan);

  if (!hasil) {
    throw new Error("Data hasil pekerjaan tidak ditemukan.");
  }

  // Mengubah status hasil pekerjaan menjadi selesai.
  penyimpananHasil.set(idPesanan, {
    ...hasil,
    status: "selesai",
  });

  return wait(true);
};

// Mengajukan revisi dari halaman Request Revisi.
export const ajukanRevisi = async (
  idPesanan: string,
  d: { detail: string; pesan: string; files: File[] }
) => {
  const hasilSebelumnya =
    penyimpananHasil.get(idPesanan) ?? buatMockHasil(idPesanan);

  // Validasi detail revisi.
  if (!d.detail.trim()) {
    throw new Error("Detail revisi wajib diisi.");
  }

  // Memastikan kuota revisi masih tersedia.
  if (hasilSebelumnya.kuota <= 0) {
    throw new Error("Kuota revisi untuk pesanan ini sudah habis.");
  }

  // Validasi format dan ukuran lampiran.
  const errorBerkas = validasiBerkas(d.files);

  if (errorBerkas) {
    throw new Error(errorBerkas);
  }

  // Mengurangi kuota revisi sebanyak satu.
  const kuotaTersisa = hasilSebelumnya.kuota - 1;

  // Mengubah file lampiran menjadi data lampiran mock.
  const lampiran = ubahKeLampiran(d.files);

  // Menyimpan data pengajuan revisi sementara.
  const revisiBaru: PengajuanRevisiMock = {
    idPesanan,
    detail: d.detail.trim(),
    pesan: d.pesan.trim(),
    berkas: lampiran,
    kuotaTersisa,
  };

  penyimpananRevisi.set(idPesanan, revisiBaru);

  // Memperbarui status dan kuota pada hasil pekerjaan.
  const hasilBaru: Hasil = {
    ...hasilSebelumnya,
    kuota: kuotaTersisa,
    status: "revisi",
    revisi: d.detail.trim(),
  };

  penyimpananHasil.set(idPesanan, hasilBaru);

  return wait(true);
};

// Mengambil data pengajuan revisi berdasarkan idPesanan.
export const getPengajuanRevisi = async (idPesanan: string) => {
  const data = penyimpananRevisi.get(idPesanan) ?? null;

  return wait<PengajuanRevisiMock | null>(data);
};

export const kirimUlasan = (
  id: string,
  d: { rating: number; komentar: string; files: File[] }
) => wait(true);

// Mengirim laporan pengguna dan menambahkan tiket baru ke mock admin.
export const kirimLaporan = async (
  d: { penyedia: string; kategori: string; deskripsi: string; files: File[] }
) => {
  const nomor = T.reduce((max, tiket) => {
    const angka = Number(tiket.id.replace("TKT", ""));
    return Math.max(max, angka);
  }, 0) + 1;

  const tiketBaru: Tiket = {
    id: `TKT${String(nomor).padStart(3, "0")}`,
    pelapor: "Saya",
    terlapor: d.penyedia,
    kategori: d.kategori,
    deskripsi: d.deskripsi,
    tanggal: "hari ini",
    status: "Belum",
  };

  T = [...T, tiketBaru];

  return wait<Tiket>({ ...tiketBaru });
};

export const loginAdmin = async (email: string, pass: string) => {
  await wait(0);

  if (email !== "admin@carijasa.id" || pass !== "admin123")
    throw new Error("Email atau kata sandi salah. Silakan coba lagi.");
};

// Mengambil seluruh tiket laporan untuk Dashboard Admin.
export const getTiketList = () =>
  wait<Tiket[]>(MOCK.tiketKosong ? [] : T.map((t) => ({ ...t })));

// Mengambil detail tiket berdasarkan idTiket.
export const getTiket = (idTiket: string) => {
  const tiket = T.find((t) => t.id === idTiket);

  return wait<Tiket | null>(tiket ? { ...tiket } : null);
};

// Mengirim tanggapan admin dan mengubah status tiket menjadi Selesai.
export const kirimTanggapan = async (
  idTiket: string,
  d: { tanggapan: string; sanksi: string }
) => {
  const index = T.findIndex((t) => t.id === idTiket);

  if (index === -1) {
    throw new Error("Tiket tidak ditemukan.");
  }

  T[index] = {
    ...T[index],
    status: "Selesai",
  };

  return wait(true);
};

// Mengajukan mediasi dan mengubah status tiket menjadi Mediasi.
export const ajukanMediasi = async (idTiket: string) => {
  const index = T.findIndex((t) => t.id === idTiket);

  if (index === -1) {
    throw new Error("Tiket tidak ditemukan.");
  }

  if (T[index].status === "Selesai") {
    throw new Error("Tiket sudah selesai.");
  }

  T[index] = {
    ...T[index],
    status: "Mediasi",
  };

  return wait(true);
};