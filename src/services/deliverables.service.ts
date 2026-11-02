// src/services/deliverable.service.ts
import { createClient } from "@/lib/supabase/server";
import { ProdukAkhir, PengajuanRevisi } from "@/models/types";

export class DeliverablesService {
  
  // 1. Penyedia Jasa mengumpulkan hasil pekerjaan pertama kali (C36 & C54)
  static async submitDeliverable(data: {
    id_pesanan: string;
    deskripsi_produk: string;
    file_url?: string;
    outputpath?: string;
  }): Promise<ProdukAkhir> {
    const supabase = await createClient();

    if (!data.deskripsi_produk || data.deskripsi_produk.trim() === "") {
      throw new Error("Deskripsi hasil pekerjaan tidak boleh kosong.");
    }
    if (!data.file_url && !data.outputpath) {
      throw new Error("Unggah berkas atau sertakan tautan hasil pekerjaan.");
    }

    const { data: result, error } = await supabase
      .from("produk_akhir")
      .insert([
        {
          id_pesanan: data.id_pesanan,
          deskripsi_produk: data.deskripsi_produk,
          file_url: data.file_url || null,
          outputpath: data.outputpath || null,
          status_pemeriksaan: false,
        },
      ])
      .select() // ambil data yang telah disimpan barusan
      .single(); // Bentuk kembaliannya jadi satu objek tunggal

    if (error) throw new Error(error.message);

    // Update status pesanan di database menjadi 'Menunggu Konfirmasi'
    await supabase
      .from("pesanan")
      .update({ status_pesanan: "Menunggu Konfirmasi" })
      .eq("id_pesanan", data.id_pesanan);

    return result as ProdukAkhir;
  }

  // 2. Ambil detail hasil pekerjaan untuk diperiksa oleh Pengguna Jasa (C36)
  static async getDeliverableByPesanan(idPesanan: string, userId : string): Promise<ProdukAkhir> {
    
    await this.validasiOwnerPesanan(idPesanan,userId);
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("produk_akhir")
      .select("*")
      .eq("id_pesanan", idPesanan)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
        throw new Error(error.message);
    }
    if (!data) { 
        throw new Error("Hasil pekerjaan belum dikumpulkan.");
    }
    

    return data as ProdukAkhir;
  }

  // 3. Pengguna Jasa mengajukan revisi (C39 & C41)
  static async requestRevision(data: {
    id_pesanan: string;
    deskripsi_revisi: string;
    lampiran_revisi?: string;
    userId : string
  }): Promise<PengajuanRevisi> {
    await this.validasiOwnerPesanan(data.id_pesanan,data.userId);
    const supabase = await createClient();

    if (!data.deskripsi_revisi || data.deskripsi_revisi.trim() === "") {
      throw new Error("Deskripsi revisi wajib diisi.");
    }

    // Cek kuota revisi
    const { data: existingRevisi } = await supabase
      .from("pengajuan_revisi")
      .select("jml_revisi_tersedia")
      .eq("id_pesanan", data.id_pesanan)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let currentKuota = existingRevisi ? existingRevisi.jml_revisi_tersedia : 2;

    if (currentKuota <= 0) {
      throw new Error("Kuota revisi untuk pesanan ini sudah habis.");
    }

    const sisaKuota = currentKuota - 1;

    const { data: result, error } = await supabase
      .from("pengajuan_revisi")
      .insert([
        {
          id_pesanan: data.id_pesanan,
          deskripsi_revisi: data.deskripsi_revisi,
          lampiran_revisi: data.lampiran_revisi || null,
          jml_revisi_tersedia: sisaKuota,
          status_pengerjaan: "Sedang Direvisi",
        },
      ])
      .select()
      .single();

    if (error) throw new Error(error.message);

    // Kembalikan status pesanan jadi 'Diproses' (karena sedang direvisi)
    await supabase
      .from("pesanan")
      .update({ status_pesanan: "Diproses" })
      .eq("id_pesanan", data.id_pesanan);

    return result as PengajuanRevisi;
  }

  // 4. Penyedia Jasa mengumpulkan hasil perbaikan revisi (C02 - Algo-0209)
  static async submitRevisionFix(idPesanan: string, userId :string): Promise<void> {
    await this.validasiOwnerPesanan(idPesanan,userId);
    const supabase = await createClient();

    await supabase
      .from("pengajuan_revisi")
      .update({ status_pengerjaan: "Revisi Dikumpulkan" })
      .eq("id_pesanan", idPesanan);

    await supabase
      .from("pesanan")
      .update({ status_pesanan: "Menunggu Konfirmasi" })
      .eq("id_pesanan", idPesanan);
  }

  // 5. Pengguna Jasa menyetujui / konfirmasi selesai hasil kerja (C38 - Algo-3801)
  static async confirmOrderComplete(idPesanan: string,userId : string): Promise<void> {
    await this.validasiOwnerPesanan(idPesanan,userId);
    const supabase = await createClient();

    // Ubah status pesanan di database menjadi 'Selesai'
    const { error } = await supabase
      .from("pesanan")
      .update({ status_pesanan: "Selesai" })
      .eq("id_pesanan", idPesanan);

    if (error) throw new Error(error.message);

    // Tandai pencairan dana selesai
    await supabase
      .from("pencairan_dana")
      .insert([{ id_pesanan: idPesanan, state_pencairan_dana: true }]);
  }
  static async validasiOwnerPesanan(idPesanan : string, userId : string) : Promise<boolean>{
    const supabase = await createClient();
    const {data : pesanan} = await supabase
        .from("pesanan")
        .select("id_pengguna_jasa, id_penyedia_jasa")
        .eq("id_pesanan",idPesanan)
        .single()

    if(!pesanan){
        throw new Error("Pesanan tidak ditemukan");
    }
    const isOwner = pesanan.id_pengguna_jasa == userId || pesanan.id_penyedia_jasa == userId;
    if (!isOwner){
        throw new Error("Akses ditolak, pesanan ini bukan milik anda");
    }
    return true;
  }
}