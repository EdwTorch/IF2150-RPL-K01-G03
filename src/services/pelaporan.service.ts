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
        const { data: existingTiket, error: errCheck } = await supabase
            .from("tiket_laporan")
            .select("id_tiket, status_tiket")
            .eq("id_pesanan", id_pesanan)
            .eq("id_pelapor", user_id)
            .eq("status_tiket", "Diproses")
            .maybeSingle();

        if (errCheck) {
            throw new Error(`Gagal memeriksa riwayat laporan: ${errCheck.message}`);
        }

        if (existingTiket) {
            throw new Error("Anda masih memiliki tiket laporan yang sedang diproses untuk pesanan ini.");
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
        pelapor:pengguna!id_pelapor (nama, email),
        terlapor:pengguna!id_terlapor (nama, email),
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
/* Bagian Atmint*/

export type JenisTindakan =
  | "PERINGATAN"
  | "SUSPEND_AKUN"
  | "LAPORAN_DITOLAK";

export class TanggapanLaporanService {
  // 1. Ambil semua tiket laporan untuk dashboard Admin
  static async getAllTicketsForAdmin() {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("tiket_laporan")
      .select(`
        *,
        pelapor:pengguna!id_pelapor (nama, email),
        terlapor:pengguna!id_terlapor (nama, email),
        tanggapan_laporan (*)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Gagal memuat daftar laporan admin: ${error.message}`);
    }

    return data || [];
  }

  // 2. Ambil detail 1 tiket untuk Admin (tanpa batasan kepemilikan pelapor/terlapor)
  static async getDetailTiketAdmin(id_tiket: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("tiket_laporan")
      .select(`
        *,
        pelapor:pengguna!id_pelapor (nama, email),
        terlapor:pengguna!id_terlapor (nama, email),
        pesanan (id_pesanan, total_biaya, status_pesanan),
        tanggapan_laporan (*)
      `)
      .eq("id_tiket", id_tiket)
      .single();

    if (error || !data) {
      throw new Error("Tiket laporan tidak ditemukan.");
    }

    return data;
  }

  // 3. Simpan Keputusan Tindakan & Catatan Admin, lalu ubah status tiket menjadi 'Selesai'


  static async catatKeputusanTindakan(data: {
    id_tiket: string;
    id_admin: string;
    jenis_tindakan: JenisTindakan;
    catatan_tanggapan: string;
  }) {
    if (!data.jenis_tindakan || data.jenis_tindakan.trim() === "") {
      throw new Error("Jenis tindakan wajib dipilih.");
    }
    if (!data.catatan_tanggapan || data.catatan_tanggapan.trim() === "") {
      throw new Error("Catatan tanggapan wajib diisi.");
    }

    const supabase = await createClient();

    // 1. Ambil data tiket beserta detail pesanan yang terkait
    const { data: tiket, error: errTiket } = await supabase
      .from("tiket_laporan")
      .select(`
        id_tiket,
        id_pesanan,
        id_pelapor,
        id_terlapor,
        status_tiket,
        pesanan (
          id_pesanan,
          id_pengguna_jasa,
          id_penyedia_jasa,
          total_biaya,
          status_pesanan
        )
      `)
      .eq("id_tiket", data.id_tiket)
      .single();

    if (errTiket || !tiket) {
      throw new Error("Tiket laporan tidak ditemukan.");
    }

    if (tiket.status_tiket === "Selesai") {
      throw new Error("Tiket laporan ini sudah selesai ditangani sebelumnya.");
    }

    const pesanan = Array.isArray(tiket.pesanan)
      ? tiket.pesanan[0]
      : tiket.pesanan;

    if (!pesanan) {
      throw new Error("Data pesanan terkait tiket ini tidak ditemukan.");
    }

    // 2. Eksekusi Side Effects berdasarkan 4 pilihan tindakan
    switch (data.jenis_tindakan) {
      case "SUSPEND_AKUN": {
        if (!tiket.id_terlapor) {
          throw new Error("ID terlapor tidak tercatat pada tiket ini.");
        }

        const { error: errSuspend } = await supabase
          .from("penyedia_jasa")
          .update({ status_akun: "SUSPENDED" })
          .eq("id_penyedia_jasa", tiket.id_terlapor); 

        if (errSuspend) {
          throw new Error(`Gagal menangguhkan akun terlapor: ${errSuspend.message}`);
        }
        break;
      }

      case "PERINGATAN":
      case "LAPORAN_DITOLAK":
        break;

      default:
        throw new Error("Jenis tindakan tidak valid.");
    }

    // 3. Simpan keputusan ke tabel tanggapan_laporan
    const { data: tanggapanBaru, error: errInsert } = await supabase
      .from("tanggapan_laporan")
      .insert([
        {
          id_tiket: data.id_tiket,
          id_admin: data.id_admin,
          jenis_tindakan: data.jenis_tindakan,
          catatan_tanggapan: data.catatan_tanggapan.trim(),
        },
      ])
      .select()
      .single();

    if (errInsert) {
      throw new Error(`Gagal menyimpan catatan tanggapan: ${errInsert.message}`);
    }

    // 4. Perbarui status_tiket menjadi 'Selesai'
    const { error: errUpdateTiket } = await supabase
      .from("tiket_laporan")
      .update({ status_tiket: "Selesai" })
      .eq("id_tiket", data.id_tiket);

    if (errUpdateTiket) {
      throw new Error(
        `Keputusan berhasil dijalankan, namun gagal memperbarui status tiket: ${errUpdateTiket.message}`
      );
    }

    return tanggapanBaru;
  }
}


