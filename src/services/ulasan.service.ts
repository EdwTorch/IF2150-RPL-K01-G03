import { createClient } from "@/lib/supabase/server";
import { Ulasan, RatingAgregat } from "@/models/types";

export class UlasanService {
    // Validasi rating harus berupa angka 1 sampai 5
    static validasiRating(rating: number): void {
        if (typeof rating !== "number" || !Number.isFinite(rating) || rating < 1 || rating > 5) {
            throw new Error("Rating harus bernilai antara 1 sampai 5");
        }
    }

    // Ambil profil rating agregat dan total ulasan penyedia jasa untuk tampilan profil (I-03)
    static async getRatingDanUlasanPenyedia(id_penyedia_jasa: string): Promise<{
        id_penyedia_jasa: string;
        rating_rata_rata: number;
        total_ulasan: number;
        tampilan: { rating_teks: string; total_ulasan_teks: string; label: string };
    }> {
        if (!id_penyedia_jasa?.trim()) {
            throw new Error("ID penyedia jasa tidak valid");
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

            if (!errCount) total_ulasan = count || 0;
        }

        const rating = penyedia?.rating_rata_rata ?? 0;
        return {
            id_penyedia_jasa,
            rating_rata_rata: rating,
            total_ulasan,
            tampilan: this.formatRatingTampilan(rating, total_ulasan),
        };
    }

    static async getStatistikUlasanJasa(id_jasa: string) {
        const supabase = await createClient();

        // Cari ulasan lewat pesanan jasa terkait
        const { data: pesananJasa } = await supabase
            .from("pesanan")
            .select("id_pesanan")
            .eq("id_jasa", id_jasa);

        const ids = (pesananJasa || []).map((p) => p.id_pesanan);
        if (ids.length === 0) {
            return {
                rata_rata_rating: 0,
                total_ulasan: 0,
            };
        }

        const { data: rawData } = await supabase
            .from("ulasan")
            .select("rating")
            .in("id_pesanan", ids);

        const data = rawData || [];
        const agregat = this.hitungRatingAgregat(data);

        return {
            rata_rata_rating: agregat.rating_rata_rata,
            total_ulasan: agregat.total_ulasan,
        };
    }

    static async getUlasanJasaById(id_jasa: string) {
        const supabase = await createClient();

        const { data: pesananJasa } = await supabase
            .from("pesanan")
            .select("id_pesanan")
            .eq("id_jasa", id_jasa);

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
            console.error("Gagal mengambil ulasan :", error.message);
            throw new Error("Terjadi kesalahan saat mengambil data ulasan.");
        }

        return {
            ulasan: data || [],
            total: count || 0,
        };
    }

    // Simpan ulasan baru dan perbarui otomatis rating agregat penyedia jasa
    static async simpanUlasan(data: {
        id_pesanan: string;
        id_pengguna_jasa: string;
        rating: number;
        komentar?: string;
        dokumentasi?: string;
    }): Promise<Ulasan> {
        this.validasiRating(data.rating);

        const supabase = await createClient();

        // Q-4804: Ambil id_penyedia_jasa dari pesanan
        const { data: pesanan, error: errPesanan } = await supabase
            .from("pesanan")
            .select("id_penyedia_jasa")
            .eq("id_pesanan", data.id_pesanan)
            .single();

        if (errPesanan || !pesanan) {
            throw new Error("Pesanan tidak ditemukan.");
        }

        const id_ulasan = crypto.randomUUID();

        const { data: isiulasan, error } = await supabase
            .from("ulasan")
            .insert([
                {
                    id_ulasan,
                    id_pesanan: data.id_pesanan,
                    id_pengguna_jasa: data.id_pengguna_jasa,
                    rating: data.rating,
                    komentar: data.komentar || null,
                    dokumentasi_path: data.dokumentasi || null,
                },
            ])
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        // Otomatis perbarui rating agregat penyedia jasa
        if (pesanan.id_penyedia_jasa) {
            await this.perbaruiRatingPenyedia(pesanan.id_penyedia_jasa);
        }

        return isiulasan as Ulasan;
    }

    static async getUlasanbyJasa(id_jasa: string, limit: number): Promise<{ ulasan: Ulasan[]; total: number }> {
        const supabase = await createClient();

        const { data: pesananJasa } = await supabase
            .from("pesanan")
            .select("id_pesanan")
            .eq("id_jasa", id_jasa);

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
            console.error("Gagal mengambil ulasan :", error.message);
            throw new Error("Terjadi kesalahan saat mengambil data ulasan.");
        }

        return {
            ulasan: (data as Ulasan[]) || [],
            total: count || 0,
        };
    }

    static async updateUlasan(
        id_ulasan: string,
        id_pengguna_jasa: string,
        data: { rating?: number; komentar?: string; dokumentasi_path?: string }
    ): Promise<void> {
        await this.validasiOwnerUlasan(id_ulasan, id_pengguna_jasa);

        if (data.rating !== undefined) {
            this.validasiRating(data.rating);
        }

        const supabase = await createClient();

        // Dapatkan data pesanan terkait untuk update rating
        const { data: ulasanData } = await supabase
            .from("ulasan")
            .select("id_pesanan, pesanan(id_penyedia_jasa)")
            .eq("id_ulasan", id_ulasan)
            .single();

        const updatePayload: Record<string, any> = {};
        if (data.rating !== undefined) updatePayload.rating = data.rating;
        if (data.komentar !== undefined) updatePayload.komentar = data.komentar;
        if (data.dokumentasi_path !== undefined) updatePayload.dokumentasi_path = data.dokumentasi_path;

        const { error } = await supabase
            .from("ulasan")
            .update(updatePayload)
            .eq("id_ulasan", id_ulasan);

        if (error) {
            console.error("Gagal memperbarui ulasan:", error.message);
            throw new Error("Terjadi kesalahan saat memperbarui ulasan.");
        }

        // Perbarui rating agregat jika rating berubah
        const idPenyedia = (ulasanData?.pesanan as any)?.id_penyedia_jasa;
        if (data.rating !== undefined && idPenyedia) {
            await this.perbaruiRatingPenyedia(idPenyedia).catch(() => {});
        }
    }

    static async deleteUlasan(id_ulasan: string, id_pengguna_jasa: string): Promise<void> {
        const supabase = await createClient();

        await this.validasiOwnerUlasan(id_ulasan, id_pengguna_jasa);

        const { data: ulasanData } = await supabase
            .from("ulasan")
            .select("id_pesanan, pesanan(id_penyedia_jasa)")
            .eq("id_ulasan", id_ulasan)
            .single();

        const { error } = await supabase
            .from("ulasan")
            .delete()
            .eq("id_ulasan", id_ulasan);

        if (error) {
            console.error("Gagal menghapus ulasan:", error.message);
            throw new Error("Terjadi kesalahan saat menghapus ulasan.");
        }

        const idPenyedia = (ulasanData?.pesanan as any)?.id_penyedia_jasa;
        if (idPenyedia) {
            await this.perbaruiRatingPenyedia(idPenyedia).catch(() => {});
        }
    }

    static async validasiOwnerUlasan(id_ulasan: string, id_pengguna_jasa: string): Promise<void> {
        const supabase = await createClient();

        const { data: ulasan } = await supabase
            .from("ulasan")
            .select("id_ulasan, id_pengguna_jasa")
            .eq("id_ulasan", id_ulasan)
            .single();

        if (id_pengguna_jasa === ulasan?.id_pengguna_jasa) {
            return;
        }
        throw new Error("Bukan Ulasan milik anda\n");
    }
}
