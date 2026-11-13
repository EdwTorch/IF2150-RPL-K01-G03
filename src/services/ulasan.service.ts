
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { Ulasan, RatingAgregat } from "@/models/types";
import { getStorageService } from "@/services/storage";

const MAKS_BERKAS_ULASAN = 3;
const MAKS_UKURAN_BERKAS = 10 * 1024 * 1024;

const FORMAT_BERKAS_DIIZINKAN: Record<string, string[]> = {
    jpg: ["image/jpeg"],
    jpeg: ["image/jpeg"],
    png: ["image/png"],
    pdf: ["application/pdf"],
};

/** Secret key hanya di server: rating agregat dihitung dari SEMUA ulasan & ditulis ke penyedia_jasa/jasa (lintas user) */
function adminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error("Konfigurasi Supabase tidak lengkap");
    return createAdminClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}


export class UlasanService {
    // Mengambil ekstensi berkas
    private static getEkstensiBerkas(nama: string): string {
        return nama.split(".").pop()?.toLowerCase() || "";
    }

    // Validasi rating harus berupa angka 1 sampai 5
    static validasiRating(rating: number): void {
        if (
            typeof rating !== "number" ||
            !Number.isFinite(rating) ||
            rating < 1 ||
            rating > 5
        ) {
            throw new Error("Rating harus bernilai antara 1 sampai 5.");
        }
    }

    // Validasi dokumentasi ulasan
    static validasiDokumentasi(berkas: File[]): void {
        if (berkas.length > MAKS_BERKAS_ULASAN) {
            throw new Error(
                `Dokumentasi ulasan maksimal ${MAKS_BERKAS_ULASAN} berkas.`
            );
        }

        for (const file of berkas) {
            const ekstensi = this.getEkstensiBerkas(file.name);
            const tipeDiizinkan = FORMAT_BERKAS_DIIZINKAN[ekstensi];

            if (!tipeDiizinkan || !tipeDiizinkan.includes(file.type)) {
                throw new Error(
                    `Format berkas ${file.name} tidak didukung. Gunakan JPG, JPEG, PNG, atau PDF.`
                );
            }

            if (file.size <= 0) {
                throw new Error(
                    `Berkas ${file.name} kosong atau tidak valid.`
                );
            }

            if (file.size > MAKS_UKURAN_BERKAS) {
                throw new Error(
                    `Ukuran berkas ${file.name} maksimal 10 MB.`
                );
            }
        }
    }

    // Menghapus dokumentasi dari Storage
    private static async hapusDokumentasi(
        urls: string[]
    ): Promise<void> {
        if (urls.length === 0) return;

        const storage = getStorageService();

        const hasil = await Promise.allSettled(
            urls.map((url) => storage.delete(url))
        );

        hasil.forEach((item, index) => {
            if (
                item.status === "rejected" ||
                (item.status === "fulfilled" && !item.value)
            ) {
                console.error(
                    "Gagal menghapus dokumentasi ulasan:",
                    urls[index]
                );
            }
        });
    }

    // Perhitungan rating agregat dengan pembulatan 1 desimal
    static hitungRatingAgregat(
        daftar: (number | { rating: number })[]
    ): RatingAgregat {
        if (!daftar || daftar.length === 0) {
            return { rating_rata_rata: 0, total_ulasan: 0 };
        }

        let total = 0;

        for (const item of daftar) {
            const val = typeof item === "number" ? item : item?.rating;
            this.validasiRating(val);
            total += val;
        }

        return {
            rating_rata_rata: Number((total / daftar.length).toFixed(1)),
            total_ulasan: daftar.length,
        };
    }

    // Format rating untuk tampilan profil penyedia
    static formatRatingTampilan(
        rating: number | null | undefined,
        total_ulasan: number = 0
    ): {
        rating_teks: string;
        total_ulasan_teks: string;
        label: string;
    } {
        if (!rating || !total_ulasan || total_ulasan === 0) {
            return {
                rating_teks: "0.0",
                total_ulasan_teks: "0 ulasan",
                label: "Belum ada ulasan",
            };
        }

        return {
            rating_teks: rating.toFixed(1),
            total_ulasan_teks: `${total_ulasan} ulasan`,
            label: `★ ${rating.toFixed(1)} (${total_ulasan} ulasan)`,
        };
    }

    // Hitung ulang dan simpan rating agregat penyedia jasa
    static async perbaruiRatingPenyedia(
        id_penyedia_jasa: string
    ): Promise<RatingAgregat> {
        if (!id_penyedia_jasa?.trim()) {
            throw new Error("ID penyedia jasa tidak valid.");
        }

        const supabase = await createClient();

        const { data: pesananList, error: errPesanan } = await supabase
            .from("pesanan")
            .select("id_pesanan")
            .eq("id_penyedia_jasa", id_penyedia_jasa);

        if (errPesanan) throw new Error(errPesanan.message);

        const idsPesanan = (pesananList || []).map((p) => p.id_pesanan);

        let daftarUlasan: { rating: number }[] = [];

        if (idsPesanan.length > 0) {
            const { data: ulasanData, error: errUlasan } = await supabase
                .from("ulasan")
                .select("rating")
                .in("id_pesanan", idsPesanan);

            if (errUlasan) throw new Error(errUlasan.message);

            daftarUlasan = ulasanData || [];
        }

        const agregat = this.hitungRatingAgregat(daftarUlasan);

        const { error: errUpdate } = await supabase
            .from("penyedia_jasa")
            .update({ rating_rata_rata: agregat.rating_rata_rata })
            .eq("id", id_penyedia_jasa);

        if (errUpdate) {
            console.error(
                "Gagal memperbarui rating penyedia jasa:",
                errUpdate.message
            );
            throw new Error(
                "Gagal memperbarui rata-rata rating penyedia jasa."
            );
        }

        return agregat;
    }

    // Ambil rating agregat dan total ulasan penyedia jasa
    static async getRatingDanUlasanPenyedia(id_penyedia_jasa: string) {
        if (!id_penyedia_jasa?.trim()) {
            throw new Error("ID penyedia jasa tidak valid.");
        }

        const supabase = await createClient();

        const { data: penyedia, error: errPenyedia } = await supabase
            .from("penyedia_jasa")
            .select("rating_rata_rata")
            .eq("id", id_penyedia_jasa)
            .maybeSingle();

        if (errPenyedia) throw new Error(errPenyedia.message);

        const { data: pesananList, error: errPesanan } = await supabase
            .from("pesanan")
            .select("id_pesanan")
            .eq("id_penyedia_jasa", id_penyedia_jasa);

        if (errPesanan) throw new Error(errPesanan.message);

        const ids = (pesananList || []).map((p) => p.id_pesanan);
        let total_ulasan = 0;

        if (ids.length > 0) {
            const { count, error: errCount } = await supabase
                .from("ulasan")
                .select("id_ulasan", { count: "exact", head: true })
                .in("id_pesanan", ids);

            if (errCount) throw new Error(errCount.message);

            total_ulasan = count || 0;
        }

        const rating = penyedia?.rating_rata_rata ?? 0;

        return {
            id_penyedia_jasa,
            rating_rata_rata: rating,
            total_ulasan,
            tampilan: this.formatRatingTampilan(rating, total_ulasan),
        };
    }

    // Statistik ulasan berdasarkan jasa
    static async getStatistikUlasanJasa(id_jasa: string) {
        const supabase = await createClient();

        const { data: pesananJasa, error: errPesanan } = await supabase
            .from("pesanan")
            .select("id_pesanan")
            .eq("id_jasa", id_jasa);

        if (errPesanan) throw new Error(errPesanan.message);

        const ids = (pesananJasa || []).map((p) => p.id_pesanan);

        if (ids.length === 0) {
            return {
                rata_rata_rating: 0,
                total_ulasan: 0,
            };
        }

        const { data, error } = await supabase
            .from("ulasan")
            .select("rating")
            .in("id_pesanan", ids);

        if (error) throw new Error(error.message);

        const agregat = this.hitungRatingAgregat(data || []);

        return {
            rata_rata_rating: agregat.rating_rata_rata,
            total_ulasan: agregat.total_ulasan,
        };
    }

    // Ambil daftar ulasan berdasarkan jasa
    static async getUlasanJasaById(id_jasa: string) {
        const supabase = await createClient();

        const { data: pesananJasa, error: errPesanan } = await supabase
            .from("pesanan")
            .select("id_pesanan")
            .eq("id_jasa", id_jasa);

        if (errPesanan) throw new Error(errPesanan.message);

        const ids = (pesananJasa || []).map((p) => p.id_pesanan);

        if (ids.length === 0) {
            return { ulasan: [], total: 0 };
        }

        const { data, error, count } = await supabase
            .from("ulasan")
            .select(
                `
                id_ulasan,
                rating,
                komentar,
                created_at,
                id_pengguna_jasa
                `,
                { count: "exact" }
            )
            .in("id_pesanan", ids)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Gagal mengambil ulasan:", error.message);
            throw new Error(
                "Terjadi kesalahan saat mengambil data ulasan."
            );
        }

        return {
            ulasan: data || [],
            total: count || 0,
        };
    }

    // Simpan ulasan baru beserta dokumentasi
    static async simpanUlasan(data: {
        id_pesanan: string;
        id_pengguna_jasa: string;
        rating: number;
        komentar?: string | null;
        dokumentasi?: File[];
    }): Promise<Ulasan> {
        this.validasiRating(data.rating);

        if (!data.id_pesanan?.trim()) {
            throw new Error("ID pesanan tidak valid.");
        }

        const berkas = data.dokumentasi || [];
        this.validasiDokumentasi(berkas);

        const supabase = await createClient();

        // Pastikan pesanan ditemukan, milik pengguna, dan sudah selesai
        const { data: pesanan, error: errPesanan } = await supabase
            .from("pesanan")
            .select(
                "id_pesanan, id_pengguna_jasa, id_penyedia_jasa, status_pesanan"
            )
            .eq("id_pesanan", data.id_pesanan)
            .maybeSingle();

        if (errPesanan) throw new Error(errPesanan.message);

        if (!pesanan) {
            throw new Error("Pesanan tidak ditemukan.");
        }

        if (pesanan.id_pengguna_jasa !== data.id_pengguna_jasa) {
            throw new Error(
                "Kamu tidak memiliki akses untuk mengulas pesanan ini."
            );
        }

        if (pesanan.status_pesanan !== "Selesai") {
            throw new Error(
                "Pesanan harus selesai sebelum dapat diberi ulasan."
            );
        }

        // Periksa apakah pesanan sudah memiliki ulasan
        const { data: ulasanLama, error: errUlasanLama } = await supabase
            .from("ulasan")
            .select("id_ulasan")
            .eq("id_pesanan", data.id_pesanan)
            .maybeSingle();

        if (errUlasanLama) throw new Error(errUlasanLama.message);

        if (ulasanLama) {
            throw new Error("Pesanan ini sudah memiliki ulasan.");
        }

        const storage = getStorageService();
        const urlDokumentasi: string[] = [];

        try {
            // Upload semua dokumentasi ke folder ulasan
            for (const file of berkas) {
                const hasil = await storage.upload(file, "ulasan");

                if (hasil.error || !hasil.url) {
                    throw new Error(
                        hasil.error || "Gagal mengunggah dokumentasi ulasan."
                    );
                }

                urlDokumentasi.push(hasil.url);
            }

            const id_ulasan = crypto.randomUUID();

            const { data: isiulasan, error } = await supabase
                .from("ulasan")
                .insert({
                    id_ulasan,
                    id_pesanan: data.id_pesanan,
                    id_pengguna_jasa: data.id_pengguna_jasa,
                    rating: data.rating,
                    komentar: data.komentar?.trim() || null,
                    dokumentasi_path: urlDokumentasi,
                })
                .select()
                .single();

            if (error) {
                if (error.code === "23505") {
                    throw new Error("Pesanan ini sudah memiliki ulasan.");
                }

                throw new Error(error.message);
            }

            // Perbarui rating penyedia setelah ulasan berhasil disimpan
            if (pesanan.id_penyedia_jasa) {
                try {
                    await this.perbaruiRatingPenyedia(
                        pesanan.id_penyedia_jasa
                    );
                } catch (err) {
                    console.error(
                        "Ulasan tersimpan, tetapi rating penyedia gagal diperbarui:",
                        err
                    );
                }
            }

            return isiulasan as Ulasan;
        } catch (err) {
            // Hapus berkas yang sudah terunggah jika penyimpanan ulasan gagal
            await this.hapusDokumentasi(urlDokumentasi);
            throw err;
        }
    }

    // Ambil ulasan jasa dengan batas jumlah data
    static async getUlasanbyJasa(
        id_jasa: string,
        limit: number
    ): Promise<{ ulasan: Ulasan[]; total: number }> {
        const supabase = await createClient();

        const { data: pesananJasa, error: errPesanan } = await supabase
            .from("pesanan")
            .select("id_pesanan")
            .eq("id_jasa", id_jasa);

        if (errPesanan) throw new Error(errPesanan.message);

        const ids = (pesananJasa || []).map((p) => p.id_pesanan);

        if (ids.length === 0) {
            return { ulasan: [], total: 0 };
        }

        const { data, error, count } = await supabase
            .from("ulasan")
            .select(
                `
                id_ulasan,
                rating,
                komentar,
                created_at,
                id_pengguna_jasa
                `,
                { count: "exact" }
            )
            .in("id_pesanan", ids)
            .order("created_at", { ascending: false })
            .limit(limit);

        if (error) {
            console.error("Gagal mengambil ulasan:", error.message);
            throw new Error(
                "Terjadi kesalahan saat mengambil data ulasan."
            );
        }

        return {
            ulasan: (data as Ulasan[]) || [],
            total: count || 0,
        };
    }

    // Memperbarui ulasan milik pengguna
    static async updateUlasan(
        id_ulasan: string,
        id_pengguna_jasa: string,
        data: {
            rating?: number;
            komentar?: string;
            dokumentasi_path?: string[];
        }
    ): Promise<void> {
        await this.validasiOwnerUlasan(id_ulasan, id_pengguna_jasa);

        if (data.rating !== undefined) {
            this.validasiRating(data.rating);
        }

        if (data.dokumentasi_path !== undefined) {
            if (data.dokumentasi_path.length > MAKS_BERKAS_ULASAN) {
                throw new Error(
                    `Dokumentasi ulasan maksimal ${MAKS_BERKAS_ULASAN} berkas.`
                );
            }
        }

        const supabase = await createClient();

        const { data: ulasanData, error: errUlasan } = await supabase
            .from("ulasan")
            .select("id_pesanan, dokumentasi_path")
            .eq("id_ulasan", id_ulasan)
            .single();

        if (errUlasan) throw new Error(errUlasan.message);

        const dokumentasiLama: string[] =
            ulasanData.dokumentasi_path || [];

        const updatePayload: Record<string, unknown> = {};

        if (data.rating !== undefined) {
            updatePayload.rating = data.rating;
        }

        if (data.komentar !== undefined) {
            updatePayload.komentar = data.komentar;
        }

        if (data.dokumentasi_path !== undefined) {
            // Pastikan dokumentasi baru berasal dari dokumentasi ulasan ini
            const pathTidakValid = data.dokumentasi_path.some(
                (url) => !dokumentasiLama.includes(url)
            );

            if (pathTidakValid) {
                throw new Error(
                    "Dokumentasi yang diperbarui tidak valid."
                );
            }

            updatePayload.dokumentasi_path = data.dokumentasi_path;
        }

        if (Object.keys(updatePayload).length === 0) {
            return;
        }

        const { error } = await supabase
            .from("ulasan")
            .update(updatePayload)
            .eq("id_ulasan", id_ulasan);

        if (error) {
            throw new Error(
                "Terjadi kesalahan saat memperbarui ulasan."
            );
        }

        // Hapus dokumentasi yang sudah tidak digunakan
        if (data.dokumentasi_path !== undefined) {
            const dokumentasiDihapus = dokumentasiLama.filter(
                (url) => !data.dokumentasi_path!.includes(url)
            );

            await this.hapusDokumentasi(dokumentasiDihapus);
        }

        const { data: pesanan } = await supabase
            .from("pesanan")
            .select("id_penyedia_jasa")
            .eq("id_pesanan", ulasanData.id_pesanan)
            .maybeSingle();

        if (data.rating !== undefined && pesanan?.id_penyedia_jasa) {
            await this.perbaruiRatingPenyedia(
                pesanan.id_penyedia_jasa
            );
        }
    }

    // Menghapus ulasan milik pengguna
    static async deleteUlasan(
        id_ulasan: string,
        id_pengguna_jasa: string
    ): Promise<void> {
        await this.validasiOwnerUlasan(id_ulasan, id_pengguna_jasa);

        const supabase = await createClient();

        const { data: ulasanData, error: errUlasan } = await supabase
            .from("ulasan")
            .select("id_pesanan, dokumentasi_path")
            .eq("id_ulasan", id_ulasan)
            .single();

        if (errUlasan) throw new Error(errUlasan.message);

        const { error } = await supabase
            .from("ulasan")
            .delete()
            .eq("id_ulasan", id_ulasan);

        if (error) {
            throw new Error(
                "Terjadi kesalahan saat menghapus ulasan."
            );
        }

        // Hapus dokumentasi setelah data ulasan berhasil dihapus
        await this.hapusDokumentasi(
            ulasanData.dokumentasi_path || []
        );

        const { data: pesanan } = await supabase
            .from("pesanan")
            .select("id_penyedia_jasa")
            .eq("id_pesanan", ulasanData.id_pesanan)
            .maybeSingle();

        if (pesanan?.id_penyedia_jasa) {
            await this.perbaruiRatingPenyedia(
                pesanan.id_penyedia_jasa
            );
        }
    }

    // Validasi kepemilikan ulasan
    static async validasiOwnerUlasan(
        id_ulasan: string,
        id_pengguna_jasa: string
    ): Promise<void> {
        const supabase = await createClient();

        const { data: ulasan, error } = await supabase
            .from("ulasan")
            .select("id_ulasan, id_pengguna_jasa")
            .eq("id_ulasan", id_ulasan)
            .maybeSingle();

        if (error) throw new Error(error.message);

        if (!ulasan || ulasan.id_pengguna_jasa !== id_pengguna_jasa) {
            throw new Error(
                "Ulasan tidak ditemukan atau bukan milik kamu."
            );
        }
    }
}
