import { createClient } from "@/lib/supabase/server";
import { Ulasan } from "@/models/types";

export class UlasanService{
    
    static async getStatistikUlasanJasa(id_jasa : string){
        const supabase = await createClient();

        const { data: rawData, error, count } = await supabase
        .from("ulasan")
        .select("rating", { count: "exact" })
        .eq("id_jasa", id_jasa);

        // Pastikan data selalu berupa Array, jika null otomatis jadi []
        const data = rawData || [];

        if (data.length === 0) {
        return {
            rata_rata_rating: 0,
            total_ulasan: 0,
        };
        }
        const total_rating = data.reduce((acc, curr) => acc + curr.rating, 0);
        const rata_rata_rating = total_rating/data.length;

        return {
            rata_rata_rating: Number(rata_rata_rating.toFixed(1)),
            total_ulasan: data.length,
        };
        
    }
    static async getUlasanJasaById(id_jasa : string){
        const supabase = await createClient();

        const {data,error,count} = await supabase
        .from("ulasan")
        .select(`
            id_ulasan,
            rating,
            komentar,
            created_at,
            id_pengguna_jasa
            `, {count : "exact"}) 
        .eq("id_jasa",id_jasa)
        .order("created_at", {ascending : false});


        if (error){
            console.error("Gagal mengambil ulasan :", error.message);
            throw new Error("Terjadi kesalahan saat mengambil data ulasan.");
        }

    return {
        ulasan: data || [],
        total: count || 0
    };
    }
    
    static async simpanUlasan(data : {id_pesanan : string; id_pengguna_jasa : string; rating : number; komentar?: string; dokumentasi?: string}) : Promise<Ulasan>{
        const supabase = await createClient();

        if(data.rating <1 || data.rating>5){
            throw new Error("Rating Harus antara 1-5");
        }
        const id_ulasan = crypto.randomUUID();

        const{data : isiulasan, error} = await supabase
        .from("ulasan")
        .insert([
            {
                id_ulasan,
                id_pesanan : data.id_pesanan,
                id_pengguna_jasa : data.id_pengguna_jasa,
                rating : data.rating,
                komentar : data.komentar || null,
                dokumentasi_path : data.dokumentasi || null,

            },
        ])
        .select()
        .single();

        if(error){
            throw new Error(error.message);
        }
        
        return isiulasan as Ulasan;
    }
    
    static async getUlasanbyJasa(id_jasa : string,  limit : number):Promise<{ulasan : Ulasan[]; total: number}>
    {
        const supabase = await createClient();

        const {data,error,count} = await supabase
        .from("ulasan")
        .select(`
            id_ulasan,
            rating,
            komentar,
            created_at,
            id_pengguna_jasa
            `, {count : "exact"}) 
        .eq("id_jasa",id_jasa)
        .order("created_at", {ascending : false})
        .limit(limit);


        if (error){
            console.error("Gagal mengambil ulasan :", error.message);
            throw new Error("Terjadi kesalahan saat mengambil data ulasan.");
        }

    return {
        ulasan: (data as Ulasan[])|| [],
        total: count || 0
    };
    }

    static async updateUlasan(id_ulasan : string, id_pengguna_jasa : string, data : {rating? : number, komentar? : string, dokumentasi_path?: string }) : Promise<void>{
        
        await this.validasiOwnerUlasan(id_ulasan, id_pengguna_jasa);
        const supabase = await createClient();
        
        if(data.rating !== undefined && (data.rating <1 || data.rating > 5)){
            throw new Error("Rating Harus antara 1-5");
        }

        const updatePayload: Record<string, any> = {};
        if (data.rating !== undefined) updatePayload.rating = data.rating;
        if (data.komentar !== undefined) updatePayload.komentar = data.komentar;
        if (data.dokumentasi_path !== undefined) updatePayload.dokumentasi = data.dokumentasi_path; // sesuaikan nama kolom DB

        

        // 4. Eksekusi update & tangkap error
        const { error } = await supabase
            .from("ulasan")
            .update(updatePayload)
            .eq("id_ulasan", id_ulasan);

        if (error) {
            console.error("Gagal memperbarui ulasan:", error.message);
            throw new Error("Terjadi kesalahan saat memperbarui ulasan.");
        }
        
    }
    
    static async deleteUlasan(id_ulasan : string, id_pengguna_jasa : string){
        const supabase = await createClient();

        this.validasiOwnerUlasan(id_ulasan,id_pengguna_jasa);

        const { error } = await supabase
        .from("ulasan")
        .delete()
        .eq("id_ulasan", id_ulasan);

        // 3. Tangkap error jika operasi database gagal
        if (error) {
            console.error("Gagal menghapus ulasan:", error.message);
            throw new Error("Terjadi kesalahan saat menghapus ulasan.");
        }
    }

    static async validasiOwnerUlasan(id_ulasan : string, id_pengguna_jasa : string): Promise<void>{
        const supabase = await createClient();

        const{data : pesanan} = await supabase
        .from("ulasan")
        .select("id_ulasan, id_pengguna_jasa")
        .eq("id_ulasan",id_ulasan)
        .single()

        if(id_pengguna_jasa == pesanan?.id_pengguna_jasa){
            return;
        }
        throw new Error("Bukan Ulasan milik anda\n");
    }

}