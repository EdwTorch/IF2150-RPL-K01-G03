import { ApiError } from "@/lib/api";
import type { DataPortofolio, IsianPortofolio } from "@/lib/client/portofolio";

/**
 * MOCK SEMENTARA — hapus kalau backend portofolio sudah ada.
 * Data fiktif. Skenario uji:
 *   judul "error"   → error server
 *   tanpa berkas    → "Berkas pendukung wajib diunggah"
 *   berkas > 10 MB  → "Ukuran berkas maksimal 10 MB"
 *   format selain JPG/PNG/PDF → "Format berkas harus JPG, PNG, atau PDF"
 */

const FORMAT_DIIZINKAN = ["image/jpeg", "image/png", "application/pdf"];
const MAKS_BYTE = 10 * 1024 * 1024;

let data_mock: DataPortofolio = {
  pengalaman: "Desainer grafis lepas, 2023–sekarang\nStaf desain di [Studio Fiktif], 2021–2023",
  prestasi: "Juara 2 lomba desain poster [Kampus Fiktif] 2024",
  daftar_karya: [
    {
      id: "karya-1",
      judul: "Logo kedai kopi [Fiktif]",
      deskripsi: "Logo dan panduan warna untuk kedai kopi lokal.",
      berkas_pendukung: { nama: "logo-kedai.png", ukuran: 1_250_000, tipe: "image/png", url: "#" },
    },
  ],
};

const tunggu = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function mockAmbilPortofolio(): Promise<DataPortofolio> {
  await tunggu(500);
  return structuredClone(data_mock);
}

export async function mockSimpanPortofolio(isian: IsianPortofolio): Promise<DataPortofolio> {
  await tunggu(800);

  if (isian.judul.trim().toLowerCase() === "error")
    throw new ApiError(500, "SERVER", "Gagal menyimpan portofolio. Coba lagi.");
  if (!isian.judul.trim())
    throw new ApiError(400, "EMPTY_INPUT", "Judul karya wajib diisi", { judul: "Judul karya wajib diisi" });

  const berkas = isian.berkas_pendukung;
  if (!berkas)
    throw new ApiError(400, "INVALID_FILE", "Berkas pendukung wajib diunggah");
  if (!FORMAT_DIIZINKAN.includes(berkas.type))
    throw new ApiError(400, "INVALID_FILE", "Format berkas harus JPG, PNG, atau PDF");
  if (berkas.size > MAKS_BYTE)
    throw new ApiError(400, "INVALID_FILE", "Ukuran berkas maksimal 10 MB");

  data_mock = {
    pengalaman: isian.pengalaman,
    prestasi: isian.prestasi,
    daftar_karya: [
      {
        id: `karya-${Date.now()}`,
        judul: isian.judul.trim(),
        deskripsi: isian.deskripsi.trim(),
        berkas_pendukung: {
          nama: berkas.name,
          ukuran: berkas.size,
          tipe: berkas.type,
          url: URL.createObjectURL(berkas), // hanya bisa dibuka di tab ini
        },
      },
      ...data_mock.daftar_karya,
    ],
  };
  return structuredClone(data_mock);
}