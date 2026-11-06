import { createClient } from "@/lib/supabase/server";
import { TanggapanLaporan, TiketLaporan} from "@/models/types"; 

export class PelaporanService{

    static async submitLaporan(
        id_pesanan: string,
        user_id: string,
        data: {
        deskripsi_laporan: string;
        kategori : string[];
        url_bukti: string[];
        }
    ): Promise<TiketLaporan> {
        // 1. Validasi input teks & kategori
        if (!data.deskripsi_laporan || data.deskripsi_laporan.trim() === "") {
            throw new Error("Deskripsi laporan wajib diisi.");
        }
        if (!Array.isArray(data.kategori) || data.kategori.length === 0) {
            throw new Error("Pilih minimal 1 kategori laporan.");
        }
        // 2. Validasi banyak URL bukti
        const validatedUrls = this.validateUrlBukti(data.url_bukti);

        const supabase = await createClient();

        // 3. Cek pesanan sekaligus tentukan Pelapor & Terlapor secara otomatis
        const { data: pesanan, error: errPesanan } = await supabase
            .from("pesanan")
            .select("id_pengguna_jasa, id_penyedia_jasa")
            .eq("id_pesanan", id_pesanan)
            .single();

        if (errPesanan || !pesanan) {
            throw new Error("Pesanan tidak ditemukan.");
        }

        let id_terlapor: string;
        if (pesanan.id_pengguna_jasa === user_id) {
            id_terlapor = pesanan.id_penyedia_jasa;
        } else if (pesanan.id_penyedia_jasa === user_id) {
            id_terlapor = pesanan.id_pengguna_jasa;
        } else {
            throw new Error("Akses ditolak, pesanan ini bukan milik Anda.");
        }

        // 4. Simpan ke database
        const { data: result, error } = await supabase
        .from("tiket_laporan")
        .insert([
            {
            id_pesanan,
            id_pelapor: user_id,
            id_terlapor,
            kategori: data.kategori,
            deskripsi_laporan: data.deskripsi_laporan.trim(),
            url_bukti: validatedUrls,
            },
        ])
        .select()
        .single();

        if (error) {
        throw new Error(`Gagal mengirim laporan: ${error.message}`);
        }

        return result as TiketLaporan;
    }


    static async validasiOwnerPesanan(id_pesanan : string, user_id : string) : Promise<boolean>{
        const supabase = await createClient();
        const {data : pesanan} = await supabase
            .from("pesanan")
            .select("id_pengguna_jasa, id_penyedia_jasa")
            .eq("id_pesanan",id_pesanan)
            .single()

        if(!pesanan){
            throw new Error("Pesanan tidak ditemukan");
        }
        const is_owner = pesanan.id_pengguna_jasa == user_id || pesanan.id_penyedia_jasa == user_id;
        if (!is_owner){
            throw new Error("Akses ditolak, pesanan ini bukan milik anda");
        }
        return true;
    }

    private static validateUrlBukti(urls: unknown): string[] {
        // 1. Pastikan input berupa Array dan tidak kosong (jika bukti wajib)
        if (!Array.isArray(urls) || urls.length === 0) {
            throw new Error("Minimal sertakan 1 tautan atau lampiran bukti.");
        }

        // 2. Batasi jumlah maksimal bukti (opsional, misal maks 5 file/link)
        if (urls.length > 3) {
            throw new Error("Maksimal 3 bukti yang dapat dilampirkan.");
        }

        // 3. Cek setiap elemen di dalam array
        const validUrls = urls.map((item, index) => {
            if (typeof item !== "string" || item.trim() === "") {
            throw new Error(`Bukti ke-${index + 1} tidak boleh kosong.`);
            }

            try {
            const parsedUrl = new URL(item.trim());
            // Pastikan protokolnya hanya http atau https (mencegah 'javascript:alert(1)' dll)
            if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
                throw new Error();
            }
            return parsedUrl.toString();
            } catch {
            throw new Error(`Format URL pada bukti ke-${index + 1} tidak valid (${item}).`);
            }
        });

        return validUrls;
    }

    // 2. Ambil daftar semua tiket milik user (sebagai pelapor maupun terlapor)
  static async getTicketsByUser(user_id: string): Promise<TiketLaporan[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("tiket_laporan")
      .select("*")
      .or(`id_pelapor.eq.${user_id},id_terlapor.eq.${user_id}`)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Gagal memuat daftar laporan: ${error.message}`);
    }

    return (data as TiketLaporan[]) || [];
  }

  // 3. Ambil detail 1 tiket beserta tanggapan admin
  static async getDetailTiket(id_tiket: string, user_id: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("tiket_laporan")
      .select(`
        *,
        tanggapan_laporan (*)
      `)
      .eq("id_tiket", id_tiket)
      .single();

    if (error || !data) {
      throw new Error("Tiket laporan tidak ditemukan.");
    }

    if (data.id_pelapor !== user_id && data.id_terlapor !== user_id) {
      throw new Error("Akses ditolak. Anda tidak memiliki izin melihat tiket ini.");
    }

    return data;
  }
}