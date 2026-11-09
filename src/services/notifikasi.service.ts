import { createClient } from "@/lib/supabase/server";

export interface CreateNotifikasiPayload {
  id_pengguna: string;
  judul : string,
  pesan_notifikasi: string;
  id_pesanan?: string | null;
  id_referensi?: string | null; // Bisa diisi id_tiket atau id_pesan_chat
}

export class NotifikasiService {
  /**
   * 1. Helper internal untuk mengirim notifikasi dari modul lain (Laporan, Pesanan, Chat)
   */
  static async kirimNotifikasi(payload: CreateNotifikasiPayload) {
    if (!payload.id_pengguna || payload.id_pengguna.trim() === "") {
      console.error("Gagal mengirim notifikasi: id_pengguna kosong");
      return false;
  }
  
    const supabase = await createClient();

    const { error } = await supabase.from("notifikasi").insert([
      {
        id_pengguna: payload.id_pengguna,
        id_pesanan: payload.id_pesanan || null,
        id_referensi: payload.id_referensi || null,
        judul : payload.judul,
        pesan_notifikasi: payload.pesan_notifikasi,
        is_read: false,
      },
    ]);

    if (error) {
      // Cukup log error agar tidak menggagalkan transaksi utama (misal submit laporan)
      console.error("Gagal mengirim notifikasi:", error.message);
    }
    return true;
  }

  /**
   * 2. Ambil daftar notifikasi milik user yang sedang login + jumlah belum dibaca
   */
  static async getNotifikasiUser(user_id: string) {
  // 1. Guard clause: Cegah query ke database jika user_id kosong/tidak valid
    if (!user_id || user_id.trim() === "") {
      return {
        notifikasi: [],
        unread_count: 0,
      };
    }

    const supabase = await createClient();

    // 2. Jalankan 2 query secara paralel (gunakan select("id_notifikasi") agar lebih ringan daripada "*")
    const [notifResult, unreadResult] = await Promise.all([
      supabase
        .from("notifikasi")
        .select("id_notifikasi, id_pesanan, id_referensi, judul, pesan_notifikasi, is_read, created_at")
        .eq("id_pengguna", user_id)
        .order("created_at", { ascending: false })
        .limit(20),

      supabase
        .from("notifikasi")
        .select("id_notifikasi", { count: "exact", head: true })
        .eq("id_pengguna", user_id)
        .eq("is_read", false),
    ]);

    if (notifResult.error) {
      throw new Error(`Gagal memuat notifikasi: ${notifResult.error.message}`);
    }

    if (unreadResult.error) {
      throw new Error(`Gagal menghitung notifikasi belum dibaca: ${unreadResult.error.message}`);
    }

    return {
      notifikasi: notifResult.data ?? [],
      unread_count: unreadResult.count ?? 0,
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