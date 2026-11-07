
// Endpoint backend yang sudah ada di app/api (isi fungsi di bawah nanti memanggil ini; cek kontraknya dengan teman backend):
// getTransaksi/getPesananStatus/terima/tolakPesanan -> /api/pesanan
// getHasil/kirimHasil/konfirmasiSelesai/ajukanRevisi -> /api/deliverables
// validasi & unggah berkas -> /api/upload
// tiket/mediasi admin -> /api/mediasi
// loginAdmin -> /api/auth

// KONTRAK FRONTEND <-> BACKEND.
// Sekarang masih menggunakan MOCK.
// Backend tinggal mengganti isi fungsi dengan pemanggilan API (tanda tangan tetap).

// ID mock:
// hasil id "1" = revisi diminta
// hasil id "3" = kuota revisi habis
// lainnya = menunggu pemeriksaan.

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

export type Hasil = {
  id: string;
  judul: string;
  catatan: string;
  kuota: number;
  status: "menunggu" | "revisi";
  revisi?: string;
  berkas: {
    nama: string;
    info: string;
  }[];
};

// Ketentuan berkas untuk form pengumpulan C37.
export const FORMAT_BERKAS: string[] = ["jpg", "jpeg", "png", "pdf"];
export const MAX_MB = 10;

// true = tampilkan empty state dashboard admin.
export const MOCK = {
  tiketKosong: false,
};

export const rp = (n: number) =>
  "Rp " + n.toLocaleString("id-ID");

const wait = <T,>(value: T) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(value), 300));

// Validasi berkas.
export function validasiBerkas(files: File[]) {
  for (const file of files) {
    if (!/\.(jpe?g|png|pdf)$/i.test(file.name)) {
      return `${file.name} · format tidak didukung`;
    }

    if (file.size > MAX_MB * 1048576) {
      return `${file.name} · melebihi ${MAX_MB} MB`;
    }
  }

  return null;
}

const STATUS_TIKET = ["Belum", "Mediasi", "Selesai"] as const;

const T: Tiket[] = [1, 2, 3].map((i) => ({
  id: `TKT00${i}`,
  pelapor: "Budi",
  terlapor: "Sari",
  kategori: "Pekerjaan tidak sesuai kesepakatan",
  deskripsi: "Desainnya jelek",
  tanggal: "6/6/26",
  status: STATUS_TIKET[i - 1],
}));

// Mengambil daftar transaksi.
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

// Mengambil detail hasil pekerjaan.
export const getHasil = (id: string) =>
  wait<Hasil>({
    id,
    judul: "Desain logo & identitas brand",
    catatan:
      "Logo final 3 versi (warna, hitam-putih, ikon) beserta panduan.",
    kuota: id === "3" ? 0 : 3,
    status: id === "1" ? "revisi" : "menunggu",
    revisi:
      "Warna logo dibuat lebih hangat dan ikon diperbesar sedikit.",
    berkas: [
      {
        nama: "logo-final.zip",
        info: "Arsip ZIP · 8,4 MB",
      },
      {
        nama: "preview-logo.png",
        info: "Gambar · 1,2 MB",
      },
      {
        nama: "https://tautan-hasil",
        info: "Tautan eksternal",
      },
    ],
  });

// Konfirmasi pesanan.
export const terimaPesanan = (id: string) => wait(true);

export const tolakPesanan = (id: string) => wait(true);

// Mengirim hasil pekerjaan.
export const kirimHasil = (
  id: string,
  data: {
    deskripsi: string;
    tautan: string;
    files: File[];
  },
) => wait(true);

// Konfirmasi pekerjaan selesai.
export const konfirmasiSelesai = (id: string) =>
  wait(true);

// Mengajukan revisi.
export const ajukanRevisi = (
  id: string,
  data: {
    detail: string;
    pesan: string;
    files: File[];
  },
) => wait(true);

// Mengirim ulasan.
export const kirimUlasan = (
  id: string,
  data: {
    rating: number;
    komentar: string;
    files: File[];
  },
) => wait(true);

// Mengirim laporan.
export const kirimLaporan = (
  data: {
    penyedia: string;
    kategori: string;
    deskripsi: string;
    files: File[];
  },
) =>
  wait<Tiket>({
    id: "TKT001",
    pelapor: "Saya",
    terlapor: data.penyedia,
    kategori: data.kategori,
    deskripsi: data.deskripsi,
    tanggal: "hari ini",
    status: "Belum",
  });

// Login admin.
export const loginAdmin = async (
  email: string,
  pass: string,
) => {
  await wait(0);

  if (
    email !== "admin@carijasa.id" ||
    pass !== "admin123"
  ) {
    throw new Error(
      "Email atau kata sandi salah. Silakan coba lagi.",
    );
  }
};

// Mengambil daftar tiket.
export const getTiketList = () =>
  wait<Tiket[]>(MOCK.tiketKosong ? [] : T);

// Mengambil detail tiket.
export const getTiket = (id: string) =>
  wait<Tiket | null>(
    T.find((tiket) => tiket.id === id) ?? null,
  );

// Mengirim tanggapan admin.
export const kirimTanggapan = (
  id: string,
  data: {
    tanggapan: string;
    sanksi: string;
  },
) => wait(true);

// Mengajukan mediasi.
export const ajukanMediasi = (id: string) =>
  wait(true);
