
import { api } from "@/lib/api";

export const MAX_MB = 10;
export const FORMAT_BERKAS = ["jpg", "jpeg", "png", "pdf"];

type ResponsProdukAkhir = {
  success: boolean;
  message: string;
  data: {
    id_produk_akhir: string;
    id_pesanan: string;
    deskripsi_produk: string;
    file_url: string;
    status_pemeriksaan: boolean;
    created_at: string;
  }[];
};

function normalisasiTautan(input: string): string {
  const nilai = input.trim();

  if (!nilai) return "";

  return /^[a-z][a-z\d+.-]*:\/\//i.test(nilai)
    ? nilai
    : `https://${nilai}`;
}

export function validasiBerkas(files: File[]) {
  if (files.length > 3) {
    return "Maksimal 3 berkas yang dapat diunggah.";
  }

  for (const file of files) {
    if (!/\.(jpe?g|png|pdf)$/i.test(file.name)) {
      return `${file.name} · format tidak didukung`;
    }

    if (file.size > MAX_MB * 1024 * 1024) {
      return `${file.name} · melebihi ${MAX_MB} MB`;
    }
  }

  return null;
}

export async function kirimHasil(
  idPesanan: string,
  d: {
    deskripsi: string;
    tautan: string;
    files: File[];
  }
) {
  const errorBerkas = validasiBerkas(d.files);

  if (errorBerkas) {
    throw new Error(errorBerkas);
  }

  const formData = new FormData();

  formData.append("deskripsi", d.deskripsi.trim());

  if (d.tautan.trim()) {
    formData.append("tautan", normalisasiTautan(d.tautan));
  }

  for (const file of d.files) {
    formData.append("berkas", file);
  }

  const respons = await api<ResponsProdukAkhir>(
    `/api/pesanan/${encodeURIComponent(idPesanan)}/produk-akhir`,
    {
      method: "POST",
      body: formData,
    }
  );

  return respons.success;
}
