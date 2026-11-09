import { createClient } from "@/lib/supabase/server";

export class PesananService {
  /**
   * Penyedia Jasa menerima atau menolak pesanan masuk
   */
  static async respondOrder(data: {
    id_pesanan: string;
    user_id: string;
    action: "Diterima" | "Ditolak";
  }): Promise<void> {
    const supabase = await createClient();

    // 1. Ambil data pesanan untuk pengecekan validasi
    const { data: pesanan, error: fetchError } = await supabase
      .from("pesanan")
      .select("id_penyedia_jasa, status_pesanan")
      .eq("id_pesanan", data.id_pesanan)
      .single();

    if (fetchError || !pesanan) {
      throw new Error("Pesanan tidak ditemukan.");
    }

    // 2. Validasi Hak Akses: Hanya Penyedia Jasa yang boleh menanggapi
    if (pesanan.id_penyedia_jasa !== data.user_id) {
      throw new Error("Akses ditolak. Hanya penyedia jasa yang dapat memproses pesanan ini.");
    }

    // 3. Validasi Status: Hanya pesanan berstatus 'Menunggu Konfirmasi' yang bisa ditanggapi
    if (pesanan.status_pesanan !== "Menunggu Konfirmasi") {
      throw new Error("Pesanan ini sudah diproses sebelumnya.");
    }

    // 4. Tentukan status baru berdasarkan aksi
    const newStatus = data.action === "Diterima" ? "Diproses" : "Ditolak";

    // 5. Update status pesanan di database
    const { error: updateError } = await supabase
      .from("pesanan")
      .update({
        status_pesanan: newStatus,
      })
      .eq("id_pesanan", data.id_pesanan);

    if (updateError) {
      throw new Error(updateError.message);
    }
  }
}