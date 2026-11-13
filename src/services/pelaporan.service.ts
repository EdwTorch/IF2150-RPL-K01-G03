
import { createClient } from "@/lib/supabase/server";
import { TanggapanLaporan, TiketLaporan } from "@/models/types";

export class PelaporanService {
  static async submitLaporan(
    id_pesanan: string,
    user_id: string,
    data: {
      deskripsi_laporan: string;
      kategori: string[];
      url_bukti: string[];
    }
  ): Promise<TiketLaporan> {
    // 1. Validasi input teks dan kategori
    if (!data.deskripsi_laporan || data.deskripsi_laporan.trim() === "") {
      throw new Error("Deskripsi laporan wajib diisi.");
    }

    if (!Array.isArray(data.kategori) || data.kategori.length === 0) {
      throw new Error("Pilih minimal 1 kategori laporan.");
    }

    // 2. Validasi banyak URL bukti
    const validatedUrls = this.validateUrlBukti(data.url_bukti);

    const supabase = await createClient();

    // DEBUG 1: Periksa identitas user dari session
    const {
      data: authData,
      error: authError,
    } = await supabase.auth.getUser();

    console.log("[DEBUG PELAPORAN]", {
      userIdDariService: user_id,
      authUid: authData.user?.id,
      authError: authError?.message,
      sama: user_id === authData.user?.id,
    });

    // 3. Cek pesanan sekaligus tentukan pelapor dan terlapor
    const { data: pesanan, error: errPesanan } = await supabase
      .from("pesanan")
      .select("id_pengguna_jasa, id_penyedia_jasa")
      .eq("id_pesanan", id_pesanan)
      .single();

    // DEBUG 2: Periksa kepemilikan pesanan
    console.log("[DEBUG KEPEMILIKAN PESANAN]", {
      idPesanan: id_pesanan,
      userId: user_id,
      idPenggunaJasa: pesanan?.id_pengguna_jasa,
      idPenyediaJasa: pesanan?.id_penyedia_jasa,
      cocokPengguna: pesanan?.id_pengguna_jasa === user_id,
      cocokPenyedia: pesanan?.id_penyedia_jasa === user_id,
      error: errPesanan?.message,
      errorCode: errPesanan?.code,
    });

    if (errPesanan || !pesanan) {
      throw new Error(
        `Pesanan tidak ditemukan atau tidak dapat diakses: ${
          errPesanan?.message ?? "Data pesanan kosong."
        }`
      );
    }

    let id_terlapor: string;

    if (pesanan.id_pengguna_jasa === user_id) {
      id_terlapor = pesanan.id_penyedia_jasa;
    } else if (pesanan.id_penyedia_jasa === user_id) {
      id_terlapor = pesanan.id_pengguna_jasa;
    } else {
      throw new Error("Akses ditolak, pesanan ini bukan milik Anda.");
    }

    // 4. Cek apakah masih ada tiket yang sedang diproses
    const { data: existingTiket, error: errCheck } = await supabase
      .from("tiket_laporan")
      .select("id_tiket, status_tiket")
      .eq("id_pesanan", id_pesanan)
      .eq("id_pelapor", user_id)
      .eq("status_tiket", "Diproses")
      .maybeSingle();

    if (errCheck) {
      throw new Error(
        `Gagal memeriksa riwayat laporan: ${errCheck.message}`
      );
    }

    if (existingTiket) {
      throw new Error(
        "Anda masih memiliki tiket laporan yang sedang diproses untuk pesanan ini."
      );
    }

    // 5. Simpan laporan ke database
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
      console.error("[DEBUG INSERT TIKET LAPORAN]", {
        idPesanan: id_pesanan,
        idPelapor: user_id,
        idTerlapor: id_terlapor,
        kategori: data.kategori,
        errorMessage: error.message,
        errorCode: error.code,
        errorDetails: error.details,
        errorHint: error.hint,
      });

      throw new Error(`Gagal mengirim laporan: ${error.message}`);
    }

    return result as TiketLaporan;
  }

  static async validasiOwnerPesanan(
    id_pesanan: string,
    user_id: string
  ): Promise<boolean> {
    const supabase = await createClient();

    const { data: pesanan, error } = await supabase
      .from("pesanan")
      .select("id_pengguna_jasa, id_penyedia_jasa")
      .eq("id_pesanan", id_pesanan)
      .single();

    if (error || !pesanan) {
      throw new Error(
        `Pesanan tidak ditemukan: ${error?.message ?? "Data kosong."}`
      );
    }

    const is_owner =
      pesanan.id_pengguna_jasa === user_id ||
      pesanan.id_penyedia_jasa === user_id;

    if (!is_owner) {
      throw new Error("Akses ditolak, pesanan ini bukan milik Anda.");
    }

    return true;
  }

  private static validateUrlBukti(urls: unknown): string[] {
    // 1. Pastikan input berupa array dan tidak kosong
    if (!Array.isArray(urls) || urls.length === 0) {
      throw new Error("Minimal sertakan 1 tautan atau lampiran bukti.");
    }

    // 2. Batasi jumlah maksimal bukti
    if (urls.length > 3) {
      throw new Error("Maksimal 3 bukti yang dapat dilampirkan.");
    }

    // 3. Validasi setiap elemen
    const validUrls = urls.map((item, index) => {
      if (typeof item !== "string" || item.trim() === "") {
        throw new Error(`Bukti ke-${index + 1} tidak boleh kosong.`);
      }

      const trimmedItem = item.trim();

      // Guard untuk path relatif lokal dari LocalStorageService
      if (
        trimmedItem.startsWith("/uploads/") &&
        !trimmedItem.includes("..")
      ) {
        return trimmedItem;
      }

      try {
        const parsedUrl = new URL(trimmedItem);

        if (
          parsedUrl.protocol !== "http:" &&
          parsedUrl.protocol !== "https:"
        ) {
          throw new Error();
        }

        return parsedUrl.toString();
      } catch {
        throw new Error(
          `Format URL pada bukti ke-${index + 1} tidak valid (${item}).`
        );
      }
    });

    return validUrls;
  }

  // 6. Ambil daftar tiket milik user sebagai pelapor maupun terlapor
  static async getTicketsByUser(
    user_id: string
  ): Promise<TiketLaporan[]> {
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

  // 7. Ambil detail tiket beserta tanggapan admin
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

    if (
      data.id_pelapor !== user_id &&
      data.id_terlapor !== user_id
    ) {
      throw new Error(
        "Akses ditolak. Anda tidak memiliki izin melihat tiket ini."
      );
    }

    return data;
  }
}

/* ==============================
   TANGGAPAN LAPORAN (ADMIN)
================================ */

export type JenisTindakan =
  | "PERINGATAN"
  | "SUSPEND_AKUN"
  | "LAPORAN_DITOLAK";

export class TanggapanLaporanService {
  // 1. Ambil semua tiket laporan untuk dashboard admin
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
      throw new Error(
        `Gagal memuat daftar laporan admin: ${error.message}`
      );
    }

    return data || [];
  }

  // 2. Ambil detail tiket untuk admin
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

  // 3. Simpan keputusan tindakan dan catatan admin
  static async catatKeputusanTindakan(data: {
    id_tiket: string;
    id_admin: string;
    jenis_tindakan: JenisTindakan;
    catatan_tanggapan: string;
  }) {
    if (!data.jenis_tindakan || data.jenis_tindakan.trim() === "") {
      throw new Error("Jenis tindakan wajib dipilih.");
    }

    if (
      !data.catatan_tanggapan ||
      data.catatan_tanggapan.trim() === ""
    ) {
      throw new Error("Catatan tanggapan wajib diisi.");
    }

    const supabase = await createClient();

    // 1. Ambil tiket beserta pesanan terkait
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
      throw new Error(
        "Tiket laporan ini sudah selesai ditangani sebelumnya."
      );
    }

    const pesanan = Array.isArray(tiket.pesanan)
      ? tiket.pesanan[0]
      : tiket.pesanan;

    if (!pesanan) {
      throw new Error(
        "Data pesanan terkait tiket ini tidak ditemukan."
      );
    }

    // 2. Eksekusi tindakan berdasarkan pilihan admin
    switch (data.jenis_tindakan) {
      case "SUSPEND_AKUN": {
        if (!tiket.id_terlapor) {
          throw new Error("ID terlapor tidak tercatat pada tiket ini.");
        }

        const { error: errSuspend } = await supabase
          .from("pengguna")
          .update({
            status_akun: false,
            sanksi: "SUSPENDED",
          })
          .eq("id", tiket.id_terlapor);

        if (errSuspend) {
          throw new Error(
            `Gagal menangguhkan akun terlapor: ${errSuspend.message}`
          );
        }

        break;
      }

      case "PERINGATAN": {
        if (!tiket.id_terlapor) {
          throw new Error("ID terlapor tidak tercatat pada tiket ini.");
        }

        const { error: errPeringatan } = await supabase
          .from("pengguna")
          .update({
            sanksi: "PERINGATAN",
          })
          .eq("id", tiket.id_terlapor);

        if (errPeringatan) {
          throw new Error(
            `Gagal mencatat sanksi peringatan: ${errPeringatan.message}`
          );
        }

        break;
      }

      case "LAPORAN_DITOLAK":
        // Tidak ada perubahan status pesanan maupun sanksi akun
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
          jenis_tindakan: data.jenis_tindakan,
          catatan_tanggapan: data.catatan_tanggapan.trim(),
        },
      ])
      .select()
      .single();

    if (errInsert) {
      throw new Error(
        `Gagal menyimpan catatan tanggapan: ${errInsert.message}`
      );
    }

    // 4. Perbarui status tiket menjadi Selesai
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
