// src/services/deliverable.service.ts
import { createClient } from "@/lib/supabase/server";
import { ProdukAkhir, PengajuanRevisi } from "@/models/types";
import { getStorageService } from "@/services/storage";

export const FOLDER_DELIVERABLE = "deliverables-uploads";
export const MAKS_UKURAN_DELIVERABLE = 50 * 1024 * 1024; // 50 MB
export const TIPE_DELIVERABLE = /^(image\/(png|jpe?g|webp|gif)|video\/mp4|application\/(pdf|zip)|text\/(plain|html))$/;

export class DeliverablesService {
  
  // 1. Penyedia Jasa mengumpulkan hasil pekerjaan pertama kali (C36 & C54)
  static async submitDeliverable(data: {
    id_pesanan: string;
    deskripsi_produk: string;
    file_url?: string;
    output_path?: string;
  }): Promise<ProdukAkhir> {
    const supabase = await createClient();
    
    if (!data.deskripsi_produk || data.deskripsi_produk.trim() === "") {
      throw new Error("Deskripsi hasil pekerjaan tidak boleh kosong.");
    }
    if (!data.file_url && !data.output_path) {
      throw new Error("Unggah berkas atau sertakan tautan hasil pekerjaan.");
    }

    const id_produk_akhir = crypto.randomUUID();

    const { data: result, error } = await supabase
      .from("produk_akhir")
      .insert([
        {
          id_produk_akhir,
          id_pesanan: data.id_pesanan,
          deskripsi_produk: data.deskripsi_produk,
          file_url: data.file_url || null,
          output_path: data.output_path || null,
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
  static async getDeliverableByPesanan(id_pesanan: string, user_id : string): Promise<ProdukAkhir> {
    
    await this.validasiOwnerPesanan(id_pesanan,user_id);
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("produk_akhir")
      .select("*")
      .eq("id_pesanan", id_pesanan)
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
  
  static async getDeliverableByProdukAkhir(id_produk_akhir : string, user_id : string){
    
    const supabase = await createClient();
    
    const {data, error} = await supabase
    .from("produk_akhir")
    .select("*")
    .eq("id_produk_akhir",id_produk_akhir)
    .single()

    if(error || !data){
      throw new Error("Hasil Pekerjaan tidak ditemukan");
    }
    
    await this.validasiOwnerPesanan(data.id_pesanan,user_id);
    
    return data as ProdukAkhir;

  }

  static async getRevisionHistory(id_pesanan: string, user_id: string): Promise<any[]> {
    await this.validasiOwnerPesanan(id_pesanan, user_id);
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("pengajuan_revisi")
      .select(`
        *,
        produk_akhir (
          id_produk_akhir,
          deskripsi_produk,
          file_url,
          output_path,
          created_at
        )
      `)
      .eq("id_pesanan", id_pesanan)
      .order("created_at", { ascending: false });

    if (error) throw new Error(`Gagal mengambil riwayat revisi: ${error.message}`);

    return data || [];
  }

  // 3. Pengguna Jasa mengajukan revisi (C39 & C41)
  static async requestRevision(data: {
    id_pesanan: string;
    deskripsi_revisi: string;
    lampiran_revisi?: string;
    id_produk_akhir : string;
    user_id : string
  }): Promise<PengajuanRevisi> {
    await this.validasiOwnerPesanan(data.id_pesanan,data.user_id);
    const supabase = await createClient();

    if (!data.deskripsi_revisi || data.deskripsi_revisi.trim() === "") {
      throw new Error("Deskripsi revisi wajib diisi.");
    }

    const { data: pesanan } = await supabase
      .from("pesanan")
      .select("id_pengguna_jasa")
      .eq("id_pesanan", data.id_pesanan)
      .single();

    if (!pesanan || pesanan.id_pengguna_jasa !== data.user_id) {
      throw new Error("Akses ditolak. Hanya pengguna jasa yang dapat mengajukan revisi.");
    }

    // Cek kuota revisi
    const { data: existingRevisi } = await supabase
      .from("pengajuan_revisi")
      .select("jml_revisi_tersedia")
      .eq("id_pesanan", data.id_pesanan)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let current_kuota = existingRevisi ? existingRevisi.jml_revisi_tersedia : 2;

    if (current_kuota <= 0) {
      throw new Error("Kuota revisi untuk pesanan ini sudah habis.");
    }

    const id_revisi = crypto.randomUUID();

    const { data: result, error } = await supabase
      .from("pengajuan_revisi")
      .insert([
        {
          id_revisi,
          id_produk_akhir: data.id_produk_akhir,
          id_pesanan: data.id_pesanan,
          deskripsi_revisi: data.deskripsi_revisi,
          lampiran_revisi: data.lampiran_revisi || null,
          jml_revisi_tersedia: current_kuota-1,
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
    static async submitRevisionFix(data: {
    id_pesanan: string;
    deskripsi_produk: string;
    file_url?: string;
    output_path?: string;
    user_id: string;
  }): Promise<ProdukAkhir> {
    await this.validasiOwnerPesanan(data.id_pesanan, data.user_id);
    const supabase = await createClient();

    // A. Buat record produk_akhir versi baru di database
    const id_produk_akhir = crypto.randomUUID();
    const { data: result, error: errProduk } = await supabase
      .from("produk_akhir")
      .insert([
        {
          id_produk_akhir,
          id_pesanan: data.id_pesanan,
          deskripsi_produk: data.deskripsi_produk,
          file_url: data.file_url || null,
          output_path: data.output_path || null,
          status_pemeriksaan: false,
        },
      ])
      .select()
      .single();

    if (errProduk) throw new Error(errProduk.message);

    // B. Cari pengajuan revisi paling baru yang statusnya "Sedang Direvisi"
    const { data: latestRevisi } = await supabase
      .from("pengajuan_revisi")
      .select("id_revisi")
      .eq("id_pesanan", data.id_pesanan)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // C. Update status revisi tersebut menjadi "Revisi Dikumpulkan" & tautkan ID produk perbaikannya
    if (latestRevisi) {
      await supabase
        .from("pengajuan_revisi")
        .update({
          status_pengerjaan: "Revisi Dikumpulkan",
          id_produk_akhir: id_produk_akhir,
        })
        .eq("id_revisi", latestRevisi.id_revisi);
    }

    // D. Kembalikan status pesanan utama menjadi 'Menunggu Konfirmasi'
    await supabase
      .from("pesanan")
      .update({ status_pesanan: "Menunggu Konfirmasi" })
      .eq("id_pesanan", data.id_pesanan);

    return result as ProdukAkhir;
  }

  // 5. Pengguna Jasa menyetujui / konfirmasi selesai hasil kerja (C38 - Algo-3801)
  static async confirmOrderComplete(id_pesanan: string,user_id : string): Promise<void> {
    await this.validasiOwnerPesanan(id_pesanan,user_id);
    const supabase = await createClient();

    const { data: pesanan, error: errFetch } = await supabase
    .from("pesanan")
    .select("id_penyedia_jasa, total_biaya, status_pesanan")
    .eq("id_pesanan", id_pesanan)
    .single();

    if (errFetch || !pesanan) throw new Error("Pesanan tidak ditemukan.");
    if (pesanan.status_pesanan === "Selesai") throw new Error("Pesanan ini sudah diselesaikan sebelumnya.");

    // Ubah status pesanan di database menjadi 'Selesai'
    const { error } = await supabase
      .from("pesanan")
      .update({ status_pesanan: "Selesai" })
      .eq("id_pesanan", id_pesanan);

    if (error) throw new Error(error.message);

    // Tandai pencairan dana selesai
    const id_pencairan = crypto.randomUUID();
    const { error: errPencairan } = await supabase
    .from("pencairan_dana")
    .insert([
      {
        id_pencairan,
        id_pesanan: id_pesanan,
        id_penyedia_jasa: pesanan.id_penyedia_jasa,
        jumlah_pencairan: pesanan.total_biaya,
        state_pencairan_dana: true, 
      },
    ]);

    if (errPencairan) throw new Error(errPencairan.message);
    
    const { data: penyedia } = await supabase
      .from("penyedia_jasa") // ganti dengan nama tabel user Anda (misal: 'users' / 'profiles')
      .select("saldo")
      .eq("id", pesanan.id_penyedia_jasa)
      .single();

    const saldoSekarang = penyedia?.saldo || 0;
    const saldoBaru = saldoSekarang + pesanan.total_biaya;

    // Update saldo baru ke database
    const { error: errSaldo } = await supabase
      .from("penyedia_jasa")
      .update({ saldo: saldoBaru })
      .eq("id", pesanan.id_penyedia_jasa);

    const {error: errUpdate} = await supabase
      .from("pesanan")
      .update({status_pencairan : true})
      .eq("id_pesanan",id_pesanan)

    if (errUpdate){
      throw new Error("Gagal mengupdate state pencairan di tabel pesanan");
    }
    if (errSaldo) {
      throw new Error("Gagal menambahkan saldo ke dompet penjual: " + errSaldo.message);
    }


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

  // Unggah berkas ke folder deliverables-uploads via Storage Service (AC-1)
  static async unggahBerkasDeliverable(file: File): Promise<string> {
    if (file.size > MAKS_UKURAN_DELIVERABLE) {
      throw new Error(`Ukuran berkas melebihi batas maksimum 50 MB`);
    }
    if (!TIPE_DELIVERABLE.test(file.type)) {
      throw new Error(`Tipe berkas ${file.type} tidak diizinkan untuk deliverable`);
    }
    const storage = getStorageService();
    const { url, error } = await storage.upload(file, FOLDER_DELIVERABLE);
    if (error || !url) throw new Error(error ?? `Gagal mengunggah berkas deliverable`);
    return url;
  }
}