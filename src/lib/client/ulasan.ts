
import { api } from "@/lib/api";

/** Sama dengan select di UlasanService.getUlasanJasaById() */
export type UlasanJasa = {
    id_ulasan: string;
    rating: number;
    komentar?: string | null;
    created_at: string;
    id_pengguna_jasa: string;
    nama_pengguna?: string;
};

type Respons<T> = {
    success: true;
    data: T;
};

/** GET /api/ulasan?id_jasa= → { ulasan, total } */
export async function ambilUlasanJasa(id_jasa: string) {
    const respons = await api<
        Respons<{ ulasan: UlasanJasa[]; total: number }>
    >(
        `/api/ulasan?id_jasa=${encodeURIComponent(id_jasa)}`
    );

    return respons.data;
}

/** Data yang dikirim saat pengguna memberikan ulasan */
export type IsianUlasan = {
    rating: number;
    komentar?: string;
    berkas?: File[];
};

/**
 * POST /api/ulasan
 * Mengirim ulasan beserta dokumentasi menggunakan FormData.
 */
export async function kirimUlasan(
    idPesanan: string,
    isian: IsianUlasan
) {
    if (!idPesanan?.trim()) {
        throw new Error("ID pesanan tidak ditemukan.");
    }

    if (isian.berkas && isian.berkas.length > 3) {
        throw new Error("Dokumentasi ulasan maksimal 3 berkas.");
    }

    const formData = new FormData();

    formData.append("id_pesanan", idPesanan);
    formData.append("rating", String(isian.rating));
    formData.append("komentar", isian.komentar?.trim() || "");

    (isian.berkas || []).forEach((file) => {
        formData.append("berkas", file);
    });

    const respons = await api<
        Respons<{
            id_ulasan: string;
            id_pesanan: string;
            rating: number;
            komentar: string | null;
            dokumentasi_path: string[];
        }>
    >("/api/ulasan", {
        method: "POST",
        body: formData,
    });

    return respons.data;
}
