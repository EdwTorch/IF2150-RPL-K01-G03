
import { SupabaseStorageService } from "./storage/supabase.storage";
import { createClient } from "@/lib/supabase/server";
import { ProdukAkhir, PengajuanRevisi } from "@/models/types";
import { getStorageService } from "@/services/storage";
import { NotifikasiService } from "./notifikasi.service";

export const FOLDER_DELIVERABLE = "deliverables-uploads";
export const MAKS_UKURAN_DELIVERABLE = 50 * 1024 * 1024;
export const TIPE_DELIVERABLE =
  /^(image\/(png|jpe?g|webp|gif)|video\/mp4|application\/(pdf|zip)|text\/(plain|html))$/;

export type LampiranPengajuanRevisi = {
  id_revisi: string;
  nama_file: string;
  file_url: string;
  file_download_url: string;
  created_at?: string;
};

function ambilNamaFile(filePath: string): string {
  try {
    const pathname = filePath.split("?")[0];
    const nama = pathname.split("/").pop() || "Lampiran revisi";

    return decodeURIComponent(nama);
  } catch {
    return "Lampiran revisi";
  }
}

export class DeliverablesService {
  // Memastikan pesanan dimiliki oleh pengguna yang sedang login.
  static async validasiOwnerPesanan(
    id_pesanan: string,
    user_id: string
  ): Promise<boolean> {
    const supabase = await createClient();

    const { data: pesanan, error } = await supabase
      .from("pesanan")
      .select("id_pengguna_jasa, id_penyedia_jasa")
      .eq("id_pesanan", id_pesanan)
      .maybeSingle();

    if (error) {
      throw new Error(`Gagal memvalidasi pesanan: ${error.message}`);
    }

    if (!pesanan) {
      throw new Error("Pesanan tidak ditemukan.");
    }

    const isOwner =
      pesanan.id_pengguna_jasa === user_id ||
      pesanan.id_penyedia_jasa === user_id;

    if (!isOwner) {
      throw new Error("Akses ditolak. Pesanan ini bukan milik Anda.");
    }

    return true;
  }

  // Memastikan pengguna adalah pengguna jasa pemilik pesanan.
  static async validasiPenggunaJasa(
    id_pesanan: string,
    user_id: string
  ) {
    const supabase = await createClient();

    const { data: pesanan, error } = await supabase
      .from("pesanan")
      .select("id_pengguna_jasa")
      .eq("id_pesanan", id_pesanan)
      .maybeSingle();

    if (error) {
      throw new Error(`Gagal memvalidasi pesanan: ${error.message}`);
    }

    if (!pesanan) {
      throw new Error("Pesanan tidak ditemukan.");
    }

    if (pesanan.id_pengguna_jasa !== user_id) {
      throw new Error(
        "Akses ditolak. Hanya pengguna jasa pemilik pesanan yang dapat melakukan tindakan ini."
      );
    }

    return true;
  }

  // Memastikan pengguna adalah penyedia jasa pemilik pesanan.
  static async validasiPenyediaJasa(
    id_pesanan: string,
    user_id: string
  ) {
    const supabase = await createClient();

    const { data: pesanan, error } = await supabase
      .from("pesanan")
      .select("id_penyedia_jasa")
      .eq("id_pesanan", id_pesanan)
      .maybeSingle();

    if (error) {
      throw new Error(`Gagal memvalidasi pesanan: ${error.message}`);
    }

    if (!pesanan) {
      throw new Error("Pesanan tidak ditemukan.");
    }

    if (pesanan.id_penyedia_jasa !== user_id) {
      throw new Error(
        "Akses ditolak. Hanya penyedia jasa pemilik pesanan yang dapat melakukan tindakan ini."
      );
    }

    return true;
  }

  // 1. Penyedia jasa mengumpulkan hasil pekerjaan pertama kali.
  static async submitDeliverable(data: {
    id_pesanan: string;
    deskripsi_produk: string;
    file_url?: string;
    output_path?: string;
  }): Promise<ProdukAkhir> {
    const supabase = await createClient();

    if (!data.deskripsi_produk?.trim()) {
      throw new Error("Deskripsi hasil pekerjaan tidak boleh kosong.");
    }

    const fileUrl = data.file_url || data.output_path;

    if (!fileUrl) {
      throw new Error("Unggah berkas atau sertakan tautan hasil pekerjaan.");
    }

    const id_produk_akhir = crypto.randomUUID();

    const { data: result, error } = await supabase
      .from("produk_akhir")
      .insert({
        id_produk_akhir,
        id_pesanan: data.id_pesanan,
        deskripsi_produk: data.deskripsi_produk.trim(),
        file_url: fileUrl,
        status_pemeriksaan: false,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Gagal menyimpan hasil pekerjaan: ${error.message}`);
    }

    const { error: pesananError } = await supabase
      .from("pesanan")
      .update({ status_pesanan: "Menunggu Konfirmasi" })
      .eq("id_pesanan", data.id_pesanan);

    if (pesananError) {
      throw new Error(
        `Gagal memperbarui status pesanan: ${pesananError.message}`
      );
    }

    const { data: pesananData } = await supabase
      .from("pesanan")
      .select("id_pengguna_jasa, jasa(nama_jasa)")
      .eq("id_pesanan", data.id_pesanan)
      .maybeSingle();

    const namaJasa =
      (pesananData?.jasa as any)?.nama_jasa || "Pesanan";

    if (pesananData?.id_pengguna_jasa) {
      await NotifikasiService.kirimNotifikasi({
        id_pengguna: pesananData.id_pengguna_jasa,
        pesan_notifikasi: `Penyedia jasa telah mengumpulkan hasil pekerjaan untuk "${namaJasa}". Silakan periksa dan konfirmasi pesanan Anda.`,
        id_pesanan: data.id_pesanan,
        id_referensi: id_produk_akhir,
        judul: `${namaJasa}: Hasil Pekerjaan Telah Dikumpulkan`,
      });
    }

    return result as ProdukAkhir;
  }

  // 2. Mengambil hasil pekerjaan utama berdasarkan pesanan.
  static async getDeliverableByPesanan(
    id_pesanan: string,
    user_id: string
  ): Promise<ProdukAkhir> {
    await this.validasiOwnerPesanan(id_pesanan, user_id);

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("produk_akhir")
      .select("*")
      .eq("id_pesanan", id_pesanan)
      .is("id_revisi", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error("Hasil pekerjaan belum dikumpulkan.");
    }

    const fileUrl = data.file_url;

    if (!fileUrl || /^https?:\/\//i.test(fileUrl)) {
      return {
        ...data,
        file_download_url: fileUrl,
      } as ProdukAkhir;
    }

    const storage = new SupabaseStorageService();

    const [signedUrl, downloadUrl] = await Promise.all([
      storage.buatSignedUrlProdukAkhir(fileUrl),
      storage.buatSignedUrlUnduhProdukAkhir(fileUrl),
    ]);

    if (!signedUrl || !downloadUrl) {
      throw new Error("Gagal membuat URL hasil pekerjaan.");
    }

    return {
      ...data,
      file_url: signedUrl,
      file_download_url: downloadUrl,
    } as ProdukAkhir;
  }

  // Mengambil hasil pekerjaan berdasarkan ID produk akhir.
  static async getDeliverableByProdukAkhir(
    id_produk_akhir: string,
    user_id: string
  ) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("produk_akhir")
      .select("*")
      .eq("id_produk_akhir", id_produk_akhir)
      .maybeSingle();

    if (error || !data) {
      throw new Error("Hasil pekerjaan tidak ditemukan.");
    }

    await this.validasiOwnerPesanan(data.id_pesanan, user_id);

    return data as ProdukAkhir;
  }

  // Mengambil riwayat revisi.
  static async getRevisionHistory(
    id_pesanan: string,
    user_id: string
  ): Promise<any[]> {
    await this.validasiOwnerPesanan(id_pesanan, user_id);

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("pengajuan_revisi")
      .select(`
        *,
        produk_akhir!pengajuan_revisi_id_produk_akhir_fkey (
          id_produk_akhir,
          deskripsi_produk,
          file_url,
          created_at
        )
      `)
      .eq("id_pesanan", id_pesanan)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(
        `Gagal mengambil riwayat revisi: ${error.message}`
      );
    }

    return data || [];
  }

  // Mengambil seluruh berkas hasil revisi yang dikirim penyedia.
  static async getRevisionAttachments(
    id_pesanan: string,
    user_id: string
  ) {
    await this.validasiOwnerPesanan(id_pesanan, user_id);

    const supabase = await createClient();
    const storage = new SupabaseStorageService();

    const { data, error } = await supabase
      .from("produk_akhir")
      .select("*")
      .eq("id_pesanan", id_pesanan)
      .not("id_revisi", "is", null)
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(
        `Gagal mengambil hasil revisi: ${error.message}`
      );
    }

    const lampiran = await Promise.all(
      (data ?? []).map(async (item) => {
        const fileUrl = item.file_url;

        if (!fileUrl || /^https?:\/\//i.test(fileUrl)) {
          return {
            ...item,
            file_download_url: fileUrl,
          };
        }

        const [signedUrl, downloadUrl] = await Promise.all([
          storage.buatSignedUrlProdukAkhir(fileUrl),
          storage.buatSignedUrlUnduhProdukAkhir(fileUrl),
        ]);

        if (!signedUrl || !downloadUrl) {
          throw new Error(
            `Gagal membuat URL hasil revisi: ${item.id_produk_akhir}`
          );
        }

        return {
          ...item,
          file_url: signedUrl,
          file_download_url: downloadUrl,
        };
      })
    );

    return lampiran;
  }

  // Mengambil lampiran yang dikirim pengguna saat mengajukan revisi.
  static async getRevisionRequestAttachments(
    id_pesanan: string,
    user_id: string
  ): Promise<LampiranPengajuanRevisi[]> {
    await this.validasiOwnerPesanan(id_pesanan, user_id);

    const supabase = await createClient();
    const storage = new SupabaseStorageService();

    const { data, error } = await supabase
      .from("pengajuan_revisi")
      .select("id_revisi, lampiran_revisi, created_at")
      .eq("id_pesanan", id_pesanan)
      .not("lampiran_revisi", "is", null)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(
        `Gagal mengambil lampiran pengajuan revisi: ${error.message}`
      );
    }

    const hasil: LampiranPengajuanRevisi[] = [];

    for (const revisi of data ?? []) {
      const daftarPath: string[] = Array.isArray(revisi.lampiran_revisi)
        ? revisi.lampiran_revisi
        : typeof revisi.lampiran_revisi === "string"
          ? [revisi.lampiran_revisi]
          : [];

      for (const filePath of daftarPath) {
        if (!filePath) continue;

        const namaFile = ambilNamaFile(filePath);

        if (/^https?:\/\//i.test(filePath)) {
          hasil.push({
            id_revisi: revisi.id_revisi,
            nama_file: namaFile,
            file_url: filePath,
            file_download_url: filePath,
            created_at: revisi.created_at ?? undefined,
          });

          continue;
        }

        const [signedUrl, downloadUrl] = await Promise.all([
          storage.buatSignedUrlProdukAkhir(filePath),
          storage.buatSignedUrlUnduhProdukAkhir(filePath),
        ]);

        if (!signedUrl || !downloadUrl) {
          throw new Error(
            `Gagal membuat URL lampiran revisi: ${namaFile}`
          );
        }

        hasil.push({
          id_revisi: revisi.id_revisi,
          nama_file: namaFile,
          file_url: signedUrl,
          file_download_url: downloadUrl,
          created_at: revisi.created_at ?? undefined,
        });
      }
    }

    return hasil;
  }

  // 3. Pengguna jasa mengajukan revisi.
  static async requestRevision(data: {
    id_pesanan: string;
    deskripsi_revisi: string;
    lampiran_revisi?: string[];
    id_produk_akhir: string;
    user_id: string;
  }): Promise<PengajuanRevisi> {
    await this.validasiPenggunaJasa(
      data.id_pesanan,
      data.user_id
    );

    const supabase = await createClient();

    if (!data.deskripsi_revisi?.trim()) {
      throw new Error("Deskripsi revisi wajib diisi.");
    }

    const { data: produkAkhir, error: produkError } = await supabase
      .from("produk_akhir")
      .select("id_produk_akhir")
      .eq("id_produk_akhir", data.id_produk_akhir)
      .eq("id_pesanan", data.id_pesanan)
      .maybeSingle();

    if (produkError) {
      throw new Error(
        `Gagal memvalidasi hasil pekerjaan: ${produkError.message}`
      );
    }

    if (!produkAkhir) {
      throw new Error(
        "Hasil pekerjaan tidak ditemukan pada pesanan ini."
      );
    }

    const { data: revisiTerakhir, error: revisiError } = await supabase
      .from("pengajuan_revisi")
      .select(
        "id_revisi, jml_revisi_tersedia, status_pengerjaan"
      )
      .eq("id_pesanan", data.id_pesanan)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (revisiError) {
      throw new Error(
        `Gagal memeriksa riwayat revisi: ${revisiError.message}`
      );
    }

    if (revisiTerakhir) {
      if (revisiTerakhir.status_pengerjaan === "Sedang Direvisi") {
        throw new Error(
          "Revisi sebelumnya masih dikerjakan penyedia jasa. Silakan tunggu sampai hasil revisi dikirimkan."
        );
      }

      if (
        revisiTerakhir.status_pengerjaan !== "Revisi Dikumpulkan"
      ) {
        throw new Error(
          "Pengajuan revisi baru belum dapat dilakukan karena status revisi sebelumnya belum memungkinkan pengajuan ulang."
        );
      }
    }

    const current_kuota = revisiTerakhir
      ? (revisiTerakhir.jml_revisi_tersedia ?? 0)
      : 3;

    if (current_kuota <= 0) {
      throw new Error(
        "Kuota revisi untuk pesanan ini sudah habis."
      );
    }

    const id_revisi = crypto.randomUUID();

    const { data: result, error: insertError } = await supabase
      .from("pengajuan_revisi")
      .insert({
        id_revisi,
        id_produk_akhir: data.id_produk_akhir,
        id_pesanan: data.id_pesanan,
        deskripsi_revisi: data.deskripsi_revisi.trim(),
        lampiran_revisi: data.lampiran_revisi?.length
          ? data.lampiran_revisi
          : null,
        jml_revisi_tersedia: current_kuota - 1,
        status_pengerjaan: "Sedang Direvisi",
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(
        `Gagal mengajukan revisi: ${insertError.message}`
      );
    }

    if (!result) {
      throw new Error(
        "Data pengajuan revisi tidak berhasil disimpan."
      );
    }

    const { error: pesananError } = await supabase
      .from("pesanan")
      .update({ status_pesanan: "DIPROSES" })
      .eq("id_pesanan", data.id_pesanan);

    if (pesananError) {
      throw new Error(
        `Revisi berhasil disimpan, tetapi gagal memperbarui status pesanan: ${pesananError.message}`
      );
    }

    const { data: pesananUpdated, error: fetchError } = await supabase
      .from("pesanan")
      .select("id_penyedia_jasa, jasa(nama_jasa)")
      .eq("id_pesanan", data.id_pesanan)
      .maybeSingle();

    if (fetchError) {
      console.error(
        "Gagal mengambil informasi pesanan:",
        fetchError
      );
    }

    const namaJasa =
      (pesananUpdated?.jasa as any)?.nama_jasa || "Pesanan";

    if (pesananUpdated?.id_penyedia_jasa) {
      await NotifikasiService.kirimNotifikasi({
        id_pengguna: pesananUpdated.id_penyedia_jasa,
        judul: `${namaJasa}: Pengajuan Revisi Baru`,
        pesan_notifikasi: `Pemesan mengajukan revisi untuk "${namaJasa}" (Sisa kuota revisi: ${current_kuota - 1}). Silakan periksa catatan revisi.`,
        id_pesanan: data.id_pesanan,
        id_referensi: id_revisi,
      });
    }

    return result as PengajuanRevisi;
  }

  // 4. Penyedia jasa mengumpulkan hasil perbaikan revisi.
  static async submitRevisionFix(data: {
    id_pesanan: string;
    deskripsi_produk: string;
    file_urls: string[];
    user_id: string;
  }): Promise<ProdukAkhir[]> {
    await this.validasiPenyediaJasa(
      data.id_pesanan,
      data.user_id
    );

    const supabase = await createClient();

    if (!data.deskripsi_produk?.trim()) {
      throw new Error("Deskripsi hasil revisi wajib diisi.");
    }

    if (!data.file_urls.length) {
      throw new Error("Unggah berkas atau sertakan tautan hasil revisi.");
    }

    const { data: latestRevisi, error: revisiError } = await supabase
      .from("pengajuan_revisi")
      .select("id_revisi")
      .eq("id_pesanan", data.id_pesanan)
      .eq("status_pengerjaan", "Sedang Direvisi")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (revisiError) {
      throw new Error(
        `Gagal memeriksa pengajuan revisi: ${revisiError.message}`
      );
    }

    if (!latestRevisi) {
      throw new Error(
        "Tidak ada pengajuan revisi yang sedang dikerjakan."
      );
    }

    const idProdukUtama = crypto.randomUUID();

    const rows = data.file_urls.map((fileUrl, index) => ({
      id_produk_akhir:
        index === 0 ? idProdukUtama : crypto.randomUUID(),
      id_pesanan: data.id_pesanan,
      id_revisi: latestRevisi.id_revisi,
      deskripsi_produk: data.deskripsi_produk.trim(),
      file_url: fileUrl,
      status_pemeriksaan: false,
    }));

    const { data: hasil, error: errProduk } = await supabase
      .from("produk_akhir")
      .insert(rows)
      .select();

    if (errProduk || !hasil) {
      throw new Error(
        `Gagal menyimpan hasil revisi: ${
          errProduk?.message ?? "Data tidak ditemukan."
        }`
      );
    }

    const { data: revisiUpdated, error: errUpdateRevisi } =
      await supabase
        .from("pengajuan_revisi")
        .update({
          status_pengerjaan: "Revisi Dikumpulkan",
          id_produk_akhir: idProdukUtama,
        })
        .eq("id_revisi", latestRevisi.id_revisi)
        .eq("status_pengerjaan", "Sedang Direvisi")
        .select("id_revisi")
        .maybeSingle();

    if (errUpdateRevisi || !revisiUpdated) {
      throw new Error(
        `Gagal memperbarui status revisi: ${
          errUpdateRevisi?.message ?? "Status revisi telah berubah. Periksa policy UPDATE pengajuan_revisi."
        }`
      );
    }

    const { data: pesananUpdated, error: pesananError } = await supabase
      .from("pesanan")
      .update({ status_pesanan: "Menunggu Konfirmasi" })
      .eq("id_pesanan", data.id_pesanan)
      .eq("status_pesanan", "DIPROSES")
      .select("id_pesanan")
      .maybeSingle();

    if (pesananError || !pesananUpdated) {
      throw new Error(
        `Revisi berhasil disimpan, tetapi status pesanan gagal diperbarui: ${
          pesananError?.message ??
          "Periksa policy UPDATE pesanan dan pastikan status sebelumnya DIPROSES."
        }`
      );
    }

    const { data: pesananData } = await supabase
      .from("pesanan")
      .select("id_pengguna_jasa, jasa(nama_jasa)")
      .eq("id_pesanan", data.id_pesanan)
      .maybeSingle();

    const namaJasa =
      (pesananData?.jasa as any)?.nama_jasa || "Pesanan";

    if (pesananData?.id_pengguna_jasa) {
      await NotifikasiService.kirimNotifikasi({
        id_pengguna: pesananData.id_pengguna_jasa,
        judul: `${namaJasa}: Hasil Revisi Telah Dikumpulkan`,
        pesan_notifikasi:
          "Penyedia jasa telah mengirimkan hasil perbaikan revisi. Silakan periksa dan konfirmasi pesanan Anda.",
        id_pesanan: data.id_pesanan,
        id_referensi: latestRevisi.id_revisi,
      });
    }

    return hasil as ProdukAkhir[];
  }

  // 5. Pengguna jasa mengonfirmasi pesanan selesai.
  // Seluruh proses status pesanan, pencairan, dan saldo dilakukan
  // secara atomik oleh fungsi PostgreSQL.
  static async confirmOrderComplete(
    id_pesanan: string,
    user_id: string
  ): Promise<void> {
    await this.validasiPenggunaJasa(id_pesanan, user_id);

    const supabase = await createClient();

    // Ambil informasi pesanan sebelum transaksi untuk kebutuhan notifikasi.
    const { data: pesanan, error: errFetch } = await supabase
      .from("pesanan")
      .select("id_penyedia_jasa, total_biaya, jasa(nama_jasa)")
      .eq("id_pesanan", id_pesanan)
      .single();

    if (errFetch || !pesanan) {
      throw new Error(
        `Pesanan tidak ditemukan: ${errFetch?.message ?? ""}`
      );
    }

    // Fungsi database mengurus:
    // 1. Validasi pemilik pesanan dan status.
    // 2. Mengubah status pesanan menjadi Selesai.
    // 3. Mencatat pencairan dana.
    // 4. Menambahkan saldo penyedia.
    // Semua langkah tersebut berada dalam satu transaksi.
    const { error: rpcError } = await supabase.rpc(
      "konfirmasi_pesanan_selesai",
      {
        p_id_pesanan: id_pesanan,
      }
    );

    if (rpcError) {
      throw new Error(
        `Gagal mengonfirmasi pesanan dan mencairkan dana: ${rpcError.message}`
      );
    }

    const namaJasa =
      (pesanan.jasa as any)?.nama_jasa || "Pesanan";

    if (pesanan.id_penyedia_jasa) {
      await NotifikasiService.kirimNotifikasi({
        id_pengguna: pesanan.id_penyedia_jasa,
        judul: `${namaJasa}: Pesanan Selesai & Dana Cair`,
        pesan_notifikasi: `Pemesan telah mengonfirmasi pesanan selesai. Dana sebesar Rp ${Number(
          pesanan.total_biaya
        ).toLocaleString("id-ID")} telah ditambahkan ke saldo Anda.`,
        id_pesanan,
      });
    }
  }

  // Unggah berkas melalui Storage Service lama.
  static async unggahBerkasDeliverable(file: File): Promise<string> {
    if (file.size > MAKS_UKURAN_DELIVERABLE) {
      throw new Error("Ukuran berkas melebihi batas maksimum 50 MB.");
    }

    if (!TIPE_DELIVERABLE.test(file.type)) {
      throw new Error(
        `Tipe berkas ${file.type} tidak diizinkan untuk deliverable.`
      );
    }

    const storage = getStorageService();

    const { url, error } = await storage.upload(
      file,
      FOLDER_DELIVERABLE
    );

    if (error || !url) {
      throw new Error(
        error ?? "Gagal mengunggah berkas deliverable."
      );
    }

    return url;
  }
}
