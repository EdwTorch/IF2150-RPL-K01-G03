
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

const T: Tiket[] = [1, 2, 3].map((i) => ({
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

export const ajukanRevisi = (
  id: string,
  d: { detail: string; pesan: string; files: File[] }
) => wait(true);

export const kirimUlasan = (
  id: string,
  d: { rating: number; komentar: string; files: File[] }
) => wait(true);

export const kirimLaporan = (
  d: { penyedia: string; kategori: string; deskripsi: string; files: File[] }
) =>
  wait<Tiket>({
    id: "TKT001",
    pelapor: "Saya",
    terlapor: d.penyedia,
    kategori: d.kategori,
    deskripsi: d.deskripsi,
    tanggal: "hari ini",
    status: "Belum",
  });

export const loginAdmin = async (email: string, pass: string) => {
  await wait(0);

  if (email !== "admin@carijasa.id" || pass !== "admin123")
    throw new Error("Email atau kata sandi salah. Silakan coba lagi.");
};

export const getTiketList = () =>
  wait<Tiket[]>(MOCK.tiketKosong ? [] : T);

export const getTiket = (id: string) =>
  wait<Tiket | null>(T.find((t) => t.id === id) ?? null);

export const kirimTanggapan = (
  id: string,
  d: { tanggapan: string; sanksi: string }
) => wait(true);

export const ajukanMediasi = (id: string) => wait(true);
