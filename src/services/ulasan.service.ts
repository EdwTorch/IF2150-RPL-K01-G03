import { createClient } from "@/lib/supabase/server";
import { Ulasan } from "@/models/types";

export class UlasanService{
    
    static async getStatistikUlasan(id_jasa : string){
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


}