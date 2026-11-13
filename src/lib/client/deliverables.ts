
import { api } from "@/lib/api";

export type DetailPesananDeliverables = {
  id_pesanan: string;
  id_pengguna_jasa: string;
  id_penyedia_jasa: string;
  status_pesanan: string;
  total_biaya: number;
};

type ResponsDetailPesanan = {
  success: boolean;
  message: string;
  data: DetailPesananDeliverables;
};

type ResponsKonfirmasi = {
  success: boolean;
  message: string;
};

// GET: Mengambil detail pesanan
export async function ambilDetailPesananDeliverables(
  idPesanan: string
): Promise<DetailPesananDeliverables> {
  const respons = await api<ResponsDetailPesanan>(
    `/api/pesanan/${encodeURIComponent(idPesanan)}`
  );

  return respons.data;
}

// PATCH: Konfirmasi pesanan selesai
export async function konfirmasiPesananSelesai(
  idPesanan: string
): Promise<ResponsKonfirmasi> {
  return api<ResponsKonfirmasi>(
    `/api/pesanan/${encodeURIComponent(idPesanan)}/deliverables`,
    {
      method: "PATCH",
    }
  );
}
