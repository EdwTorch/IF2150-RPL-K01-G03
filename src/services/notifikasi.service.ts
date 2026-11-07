import { createClient } from "@/lib/supabase/server";

export interface CreateNotifikasiPayload {
  id_pengguna: string;
  pesan_notifikasi: string;
  id_pesanan?: string | null;
  id_referensi?: string | null; // Bisa diisi id_tiket atau id_pesan_chat
}

export class NotifikasiService {
  /**
   * 1. Helper internal untuk mengirim notifikasi dari modul lain (Laporan, Pesanan, Chat)
   */
  static async kirimNotifikasi(payload: CreateNotifikasiPayload) {
    const supabase = await createClient();

    const { error } = await supabase.from("notifikasi").insert([
      {
        id_pengguna: payload.id_pengguna,
        id_pesanan: payload.id_pesanan || null,
        id_referensi: payload.id_referensi || null,
        pesan_notifikasi: payload.pesan_notifikasi,
        is_read: false,
      },
    ]);

    if (error) {
      // Cukup log error agar tidak menggagalkan transaksi utama (misal submit laporan)
      console.error("Gagal mengirim notifikasi:", error.message);
    }
  }

  /**
   * 2. Ambil daftar notifikasi milik user yang sedang login + jumlah belum dibaca
   */
  static async getNotifikasiUser(user_id: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("notifikasi")
      .select("*")
      .eq("id_pengguna", user_id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      throw new Error(`Gagal memuat notifikasi: ${error.message}`);
    }

    const daftar = data || [];
    const unread_count = daftar.filter((item) => !item.is_read).length;

    return {
      notifikasi: daftar,
      unread_count,
    };
  }

  /**
   * 3. Tandai 1 notifikasi atau semua notifikasi sebagai sudah dibaca (is_read = true)
   */
  static async tandaiSudahDibaca(user_id: string, id_notifikasi?: string) {
    const supabase = await createClient();

    let query = supabase
      .from("notifikasi")
      .update({ is_read: true })
      .eq("id_pengguna", user_id);

    if (id_notifikasi) {
      query = query.eq("id_notifikasi", id_notifikasi);
    } else {
      query = query.eq("is_read", false);
    }

    const { error } = await query;

    if (error) {
      throw new Error(`Gagal memperbarui status notifikasi: ${error.message}`);
    }

    return true;
  }
}