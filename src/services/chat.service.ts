import { createClient } from "@/lib/supabase/server";
import { NotifikasiService } from "./notifikasi.service";

export class ChatService {
  /**
   * 1. Ambil daftar semua chatroom milik user yang sedang login (untuk halaman Inbox/Daftar Chat)
   */
   static async getDaftarChatroom(user_id: string) {
    const supabase = await createClient();

    // chatroom → pengguna_jasa / penyedia_jasa → pengguna (nama)
    const { data, error } = await supabase
      .from("chatroom")
      .select(`
        id_chatroom,
        id_pengguna_jasa,
        id_penyedia_jasa,
        created_at,
        pihak_pengguna:pengguna_jasa!id_pengguna_jasa ( pengguna ( id, nama ) ),
        pihak_penyedia:penyedia_jasa!id_penyedia_jasa ( pengguna ( id, nama ) )
      `)
      .or(`id_pengguna_jasa.eq.${user_id},id_penyedia_jasa.eq.${user_id}`)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Gagal memuat daftar obrolan: ${error.message}`);
    }

    // Ratakan supaya bentuk balasan tetap { pengguna_jasa: {id,nama}, penyedia_jasa: {id,nama} }
    type Relasi = { pengguna: { id: string; nama: string } | null } | null;
    return (data ?? []).map(({ pihak_pengguna, pihak_penyedia, ...room }) => ({
      ...room,
      pengguna_jasa: (pihak_pengguna as unknown as Relasi)?.pengguna ?? null,
      penyedia_jasa: (pihak_penyedia as unknown as Relasi)?.pengguna ?? null,
    }));
  }

  /**
   * 2. Cari atau buat chatroom baru antara pengguna_jasa dan penyedia_jasa
   */
  static async getOrCreateChatroom(id_pengguna_jasa: string, id_penyedia_jasa: string) {
    if (id_pengguna_jasa === id_penyedia_jasa) {
      throw new Error("Tidak dapat membuat ruang obrolan dengan diri sendiri.");
    }

    const supabase = await createClient();

    // Cek apakah room sudah pernah dibuat
    const { data: existing } = await supabase
      .from("chatroom")
      .select("*")
      .eq("id_pengguna_jasa", id_pengguna_jasa)
      .eq("id_penyedia_jasa", id_penyedia_jasa)
      .maybeSingle();

    if (existing) return existing;

    // Jika belum ada, buat baru
    const { data: created, error } = await supabase
      .from("chatroom")
      .insert([{ id_pengguna_jasa, id_penyedia_jasa }])
      .select()
      .single();

    if (error || !created) {
      throw new Error(`Gagal membuat ruang obrolan: ${error?.message}`);
    }

    return created;
  }

  /**
   * Helper internal: Validasi user adalah anggota chatroom & dapatkan ID lawan bicara
   */
  private static async validasiAksesChatroom(id_chatroom: string, user_id: string) {
    const supabase = await createClient();

    const { data: room, error } = await supabase
      .from("chatroom")
      .select("id_chatroom, id_pengguna_jasa, id_penyedia_jasa")
      .eq("id_chatroom", id_chatroom)
      .single();

    if (error || !room) {
      throw new Error("Ruang obrolan tidak ditemukan.");
    }

    const isPembeli = room.id_pengguna_jasa === user_id;
    const isPenyedia = room.id_penyedia_jasa === user_id;

    if (!isPembeli && !isPenyedia) {
      throw new Error("Akses ditolak. Anda bukan peserta ruang obrolan ini.");
    }

    const id_penerima = isPembeli ? room.id_penyedia_jasa : room.id_pengguna_jasa;
    return { room, id_penerima };
  }

  /**
   * 3. Ambil riwayat pesan dalam 1 chatroom
   */
  static async getRiwayatPesan(id_chatroom: string, user_id: string) {
    await this.validasiAksesChatroom(id_chatroom, user_id);
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("pesan_chat")
      .select(`
        id_pesan,
        id_chatroom,
        id_pengirim,
        isi_pesan,
        lampiran,
        waktu_dibuat,
        created_at,
        pengirim:pengguna!id_pengirim (id, nama)
      `)
      .eq("id_chatroom", id_chatroom)
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(`Gagal memuat pesan: ${error.message}`);
    }

    return data || [];
  }

  /**
   * 4. Kirim pesan baru ke chatroom + kirim notifikasi ke lawan bicara
   */
  static async kirimPesan(
    id_chatroom: string,
    user_id: string,
    isi_pesan: string,
    lampiran?: string | null
  ) {
    if ((!isi_pesan || isi_pesan.trim() === "") && !lampiran) {
      throw new Error("Isi pesan tidak boleh kosong.");
    }

    const { id_penerima } = await this.validasiAksesChatroom(id_chatroom, user_id);
    const supabase = await createClient();

    const { data: pesanBaru, error } = await supabase
      .from("pesan_chat")
      .insert([
        {
          id_chatroom,
          id_pengirim: user_id,
          isi_pesan: isi_pesan.trim(),
          lampiran: lampiran || null,
        },
      ])
      .select(`
        id_pesan,
        id_chatroom,
        id_pengirim,
        isi_pesan,
        lampiran,
        waktu_dibuat,
        created_at,
        pengirim:pengguna!id_pengirim (id, nama)
      `)
      .single();

    if (error || !pesanBaru) {
      throw new Error(`Gagal mengirim pesan: ${error?.message}`);
    }

    // Ambil nama pengirim dari hasil .select() pesanBaru di atas
    const namaPengirim = (pesanBaru.pengirim as any)?.nama || "Pengguna";
    const teksPesan = isi_pesan.trim();
    const previewPesan = teksPesan
      ? `${teksPesan.slice(0, 50)}${teksPesan.length > 50 ? "..." : ""}`
      : "Mengirimkan lampiran";

    // Trigger notifikasi ke lawan bicara (id_referensi diisi id_chatroom)
    if (id_penerima && id_penerima !== user_id) {
      await NotifikasiService.kirimNotifikasi({
        id_pengguna: id_penerima,
        judul: `${namaPengirim}: Pesan Baru`,
        pesan_notifikasi: previewPesan,
        id_referensi: id_chatroom,
      });
    }

    return pesanBaru;
  }
}