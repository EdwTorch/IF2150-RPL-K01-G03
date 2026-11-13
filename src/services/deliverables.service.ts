// src/services/deliverables.service.ts
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { ProdukAkhir, PengajuanRevisi } from "@/models/types";
import { getStorageService } from "@/services/storage";
import { NotifikasiService } from "./notifikasi.service";
import { PesananService } from "./pesanan.service";

export const FOLDER_DELIVERABLE = "deliverables-uploads";
export const MAKS_UKURAN_DELIVERABLE = 50 * 1024 * 1024; // 50 MB
export const TIPE_DELIVERABLE = /^(image\/(png|jpe?g|webp|gif)|video\/mp4|application\/(pdf|zip)|text\/(plain|html))$/;

/** Kuota revisi per pesanan (default kolom pengajuan_revisi.jml_revisi_tersedia) */
export const KUOTA_REVISI = 2;
export const STATUS_REVISI_BERJALAN = "Sedang Direvisi";
export const STATUS_REVISI_DIKUMPULKAN = "Revisi Dikumpulkan";

type Supabase = Awaited<ReturnType<typeof createClient>>;

/** Kolom pesanan yang dibutuhkan alur deliverables */
export type PesananDeliverable = {
  id_pesanan: string;
  id_pengguna_jasa: string;
  id_penyedia_jasa: string;
  status_pesanan: string;
  total_biaya: number;
  brief?: string;
  created_at?: string;
  jasa?: { nama_jasa: string; kategori?: string | null } | null;
};

/** Respons GET /api/pesanan/[id]/deliverables — satu paket untuk halaman Hasil Pekerjaan (C38) */
export type HasilPekerjaan = {
  pesanan: Omit<PesananDeliverable, "jasa"> & {
    nama_jasa: string;
    kategori_jasa: string | null;
    nama_pemesan: string | null;
    nama_penyedia: string | null;
  };
  deliverable: ProdukAkhir | null;
  revisi: PengajuanRevisi[];
  revisi_aktif: PengajuanRevisi | null;
  kuota_revisi: { total: number; terpakai: number; tersisa: number };
};

const status = (s?: string) => PesananService.normalisasiStatus(s);

/** Secret key hanya di server: dipakai untuk pencairan dana & saldo penyedia (tidak dibuka lewat RLS) */
function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Konfigurasi Supabase tidak lengkap");
  return createAdminClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export class DeliverablesService {
  // ---------------------------------------------------------------- helper

  private static async ambilPesanan(supabase: Supabase, id_pesanan: string): Promise<PesananDeliverable> {
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id_pesanan ?? "")) {
      throw new Error("ID pesanan tidak valid");
    }
    const { data, error } = await supabase
      .from("pesanan")
         .select("id_pesanan, id_pengguna_jasa, id_penyedia_jasa, status_pesanan, total_biaya, brief, created_at, jasa(nama_jasa, kategori)")
      .eq("id_pesanan", id_pesanan)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) throw new Error("Pesanan tidak ditemukan");

    const pesanan = data as unknown as PesananDeliverable;
    return { ...pesanan, total_biaya: Number(pesanan.total_biaya) };
  }

  /** Pastikan user adalah pemesan atau penyedia pesanan ini. Mengembalikan data pesanannya. */
  static async validasiOwnerPesanan(id_pesanan: string, user_id: string): Promise<PesananDeliverable> {
    const supabase = await createClient();
    const pesanan = await this.ambilPesanan(supabase, id_pesanan);

    if (pesanan.id_pengguna_jasa !== user_id && pesanan.id_penyedia_jasa !== user_id) {
      throw new Error("Akses ditolak, pesanan ini bukan milik anda");
    }
    return pesanan;
  }

  private static async daftarRevisi(supabase: Supabase, id_pesanan: string): Promise<PengajuanRevisi[]> {
    const { data, error } = await supabase
      .from("pengajuan_revisi")
      .select("*")
      .eq("id_pesanan", id_pesanan)
      .order("created_at", { ascending: false });

    if (error) throw new Error(`Gagal mengambil riwayat revisi: ${error.message}`);
    return (data ?? []) as PengajuanRevisi[];
  }

  private static async produkTerakhir(supabase: Supabase, id_pesanan: string): Promise<ProdukAkhir | null> {
    const { data, error } = await supabase
      .from("produk_akhir")
      .select("*")
      .eq("id_pesanan", id_pesanan)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data as ProdukAkhir) ?? null;
  }

  static hitungKuota(jumlah_revisi: number) {
    const terpakai = Math.min(jumlah_revisi, KUOTA_REVISI);
    return { total: KUOTA_REVISI, terpakai, tersisa: KUOTA_REVISI - terpakai };
  }

  // ---------------------------------------------------------------- baca

  // C38 HalamanDeliverables (pengguna & penyedia): pesanan + kiriman terakhir + revisi + kuota
  static async getHasilPekerjaan(id_pesanan: string, user_id: string): Promise<HasilPekerjaan> {
    const pesanan = await this.validasiOwnerPesanan(id_pesanan, user_id);
    const supabase = await createClient();

    const [deliverable, revisi, { data: daftar_nama }] = await Promise.all([
      this.produkTerakhir(supabase, id_pesanan),
      this.daftarRevisi(supabase, id_pesanan),
      supabase.from("pengguna").select("id, nama").in("id", [pesanan.id_pengguna_jasa, pesanan.id_penyedia_jasa]),
    ]);

    const nama = (id: string) => daftar_nama?.find((p) => p.id === id)?.nama ?? null;
    const revisi_terakhir = revisi[0] ?? null;
    const { jasa, ...data_pesanan } = pesanan;

    return {
      pesanan: {
        ...data_pesanan,
        nama_jasa: jasa?.nama_jasa ?? "Pesanan",
        kategori_jasa: jasa?.kategori ?? null,
        nama_pemesan: nama(pesanan.id_pengguna_jasa),
        nama_penyedia: nama(pesanan.id_penyedia_jasa),
      },
      deliverable,
      revisi,
      revisi_aktif:
        revisi_terakhir?.status_pengerjaan === STATUS_REVISI_BERJALAN && status(pesanan.status_pesanan) === "DIPROSES"
          ? revisi_terakhir
          : null,
      kuota_revisi: this.hitungKuota(revisi.length),
    };
  }

  // Kiriman terakhir saja (dipakai route lama)
  static async getDeliverableByPesanan(id_pesanan: string, user_id: string): Promise<ProdukAkhir> {
    await this.validasiOwnerPesanan(id_pesanan, user_id);
    const supabase = await createClient();
    const data = await this.produkTerakhir(supabase, id_pesanan);
    if (!data) throw new Error("Hasil pekerjaan belum dikumpulkan.");
    return data;
  }

  static async getDeliverableByProdukAkhir(id_produk_akhir: string, user_id: string): Promise<ProdukAkhir> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("produk_akhir")
      .select("*")
      .eq("id_produk_akhir", id_produk_akhir)
      .maybeSingle();

    if (error || !data) throw new Error("Hasil Pekerjaan tidak ditemukan");
    await this.validasiOwnerPesanan(data.id_pesanan, user_id);
    return data as ProdukAkhir;
  }

  static async getRevisionHistory(id_pesanan: string, user_id: string): Promise<PengajuanRevisi[]> {
    await this.validasiOwnerPesanan(id_pesanan, user_id);
    const supabase = await createClient();
    return this.daftarRevisi(supabase, id_pesanan);
  }

  // ---------------------------------------------------------------- penyedia

  // C37 Pengumpulan (kiriman pertama) & Algo-0209 (kiriman perbaikan revisi) — satu pintu
  static async submitDeliverable(data: {
    id_pesanan: string;
    user_id: string;
    deskripsi_produk: string;
    berkas_hasil?: string[];
    file_url?: string;
    output_path?: string;
  }): Promise<ProdukAkhir> {
    const deskripsi_produk = data.deskripsi_produk?.trim() ?? "";
    const berkas_hasil = [...(data.berkas_hasil ?? []), ...(data.file_url ? [data.file_url] : [])]
      .map((u) => u.trim())
      .filter(Boolean);
    const output_path = data.output_path?.trim() || null;

    if (!deskripsi_produk) throw new Error("Deskripsi hasil pekerjaan tidak boleh kosong.");
    if (!berkas_hasil.length && !output_path) throw new Error("Unggah berkas atau sertakan tautan hasil pekerjaan.");
    if (output_path && !/^https:\/\//i.test(output_path)) throw new Error("Tautan hasil pekerjaan tidak valid, harus diawali https://");

    const pesanan = await this.validasiOwnerPesanan(data.id_pesanan, data.user_id);
    if (pesanan.id_penyedia_jasa !== data.user_id) {
      throw new Error("Akses ditolak. Hanya penyedia jasa pesanan ini yang dapat mengirim hasil pekerjaan.");
    }
    if (status(pesanan.status_pesanan) !== "DIPROSES") {
      throw new Error("Hasil pekerjaan hanya dapat dikirim saat pesanan sedang diproses.");
    }

    const supabase = await createClient();
    const revisi_terakhir = (await this.daftarRevisi(supabase, data.id_pesanan))[0];
    const kiriman_revisi = revisi_terakhir?.status_pengerjaan === STATUS_REVISI_BERJALAN;

    const { data: produk, error } = await supabase
      .from("produk_akhir")
      .insert({
        id_pesanan: data.id_pesanan,
        deskripsi_produk,
        file_url: berkas_hasil[0] ?? null,
        berkas_hasil,
        output_path,
        status_pemeriksaan: false,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    const { error: err_status } = await supabase
      .from("pesanan")
      .update({ status_pesanan: "MENUNGGU_KONFIRMASI_SELESAI", updated_at: new Date().toISOString() })
      .eq("id_pesanan", data.id_pesanan);

    if (err_status) {
      await supabase.from("produk_akhir").delete().eq("id_produk_akhir", produk.id_produk_akhir);
      throw new Error(`Gagal memperbarui status pesanan: ${err_status.message}`);
    }

    if (kiriman_revisi && revisi_terakhir.id_revisi) {
      await supabase
        .from("pengajuan_revisi")
        .update({ status_pengerjaan: STATUS_REVISI_DIKUMPULKAN })
        .eq("id_revisi", revisi_terakhir.id_revisi);
    }

    const nama_jasa = pesanan.jasa?.nama_jasa ?? "Pesanan";
    await NotifikasiService.kirimNotifikasi({
      id_pengguna: pesanan.id_pengguna_jasa,
      judul: kiriman_revisi
        ? `${nama_jasa}: Hasil Revisi Telah Dikumpulkan`
        : `${nama_jasa}: Hasil Pekerjaan Telah Dikumpulkan`,
      pesan_notifikasi: kiriman_revisi
        ? "Penyedia jasa telah mengirimkan hasil perbaikan (revisi). Silakan periksa dan konfirmasi pesanan Anda."
        : `Penyedia jasa telah mengumpulkan hasil pekerjaan untuk "${nama_jasa}". Silakan periksa dan konfirmasi pesanan Anda.`,
      id_pesanan: data.id_pesanan,
      id_referensi: produk.id_produk_akhir,
    });

    return produk as ProdukAkhir;
  }

  /** Dipertahankan untuk route lama: kiriman revisi = kiriman biasa saat ada revisi berjalan */
  static submitRevisionFix(data: {
    id_pesanan: string;
    deskripsi_produk: string;
    file_url?: string;
    berkas_hasil?: string[];
    output_path?: string;
    user_id: string;
  }) {
    return this.submitDeliverable(data);
  }

  // ---------------------------------------------------------------- pengguna jasa

  // C39 & C41: pemesan mengajukan revisi atas kiriman terakhir
  static async requestRevision(data: {
    id_pesanan: string;
    user_id: string;
    deskripsi_revisi: string;
    pesan_revisi?: string;
    lampiran_revisi?: string;
    id_produk_akhir?: string;
  }): Promise<PengajuanRevisi> {
    const deskripsi_revisi = data.deskripsi_revisi?.trim() ?? "";
    if (!deskripsi_revisi) throw new Error("Deskripsi revisi wajib diisi.");

    const pesanan = await this.validasiOwnerPesanan(data.id_pesanan, data.user_id);
    if (pesanan.id_pengguna_jasa !== data.user_id) {
      throw new Error("Akses ditolak. Hanya pengguna jasa yang dapat mengajukan revisi.");
    }
    if (status(pesanan.status_pesanan) !== "MENUNGGU_KONFIRMASI_SELESAI") {
      throw new Error("Revisi hanya dapat diajukan setelah penyedia mengirim hasil pekerjaan.");
    }

    const supabase = await createClient();
    const [revisi, produk] = await Promise.all([
      this.daftarRevisi(supabase, data.id_pesanan),
      this.produkTerakhir(supabase, data.id_pesanan),
    ]);

    const { tersisa } = this.hitungKuota(revisi.length);
    if (tersisa <= 0) throw new Error("Kuota revisi untuk pesanan ini sudah habis.");

    const { data: hasil, error } = await supabase
      .from("pengajuan_revisi")
      .insert({
        id_pesanan: data.id_pesanan,
        id_produk_akhir: data.id_produk_akhir || produk?.id_produk_akhir || null,
        deskripsi_revisi,
        pesan_revisi: data.pesan_revisi?.trim() || null,
        lampiran_revisi: data.lampiran_revisi || null,
        jml_revisi_tersedia: tersisa - 1,
        status_pengerjaan: STATUS_REVISI_BERJALAN,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    const { error: err_status } = await supabase
      .from("pesanan")
      .update({ status_pesanan: "DIPROSES", updated_at: new Date().toISOString() })
      .eq("id_pesanan", data.id_pesanan);

    if (err_status) {
      await supabase.from("pengajuan_revisi").delete().eq("id_revisi", hasil.id_revisi);
      throw new Error(`Gagal memperbarui status pesanan: ${err_status.message}`);
    }

    const nama_jasa = pesanan.jasa?.nama_jasa ?? "Pesanan";
    await NotifikasiService.kirimNotifikasi({
      id_pengguna: pesanan.id_penyedia_jasa,
      judul: `${nama_jasa}: Pengajuan Revisi Baru`,
      pesan_notifikasi: `Pemesan mengajukan revisi untuk "${nama_jasa}" (sisa kuota revisi: ${tersisa - 1}). Silakan periksa catatan revisi.`,
      id_pesanan: data.id_pesanan,
      id_referensi: hasil.id_revisi,
    });

    return hasil as PengajuanRevisi;
  }

  // C38 Algo-3801: pemesan konfirmasi selesai → dana diteruskan ke saldo penyedia
  static async confirmOrderComplete(id_pesanan: string, user_id: string): Promise<void> {
    const pesanan = await this.validasiOwnerPesanan(id_pesanan, user_id);
    if (pesanan.id_pengguna_jasa !== user_id) {
      throw new Error("Akses ditolak. Hanya pengguna jasa yang dapat mengonfirmasi pesanan selesai.");
    }

    const st = status(pesanan.status_pesanan);
    if (st === "SELESAI") throw new Error("Pesanan ini sudah diselesaikan sebelumnya.");
    if (st !== "MENUNGGU_KONFIRMASI_SELESAI") {
      throw new Error("Pesanan belum bisa dikonfirmasi selesai karena hasil pekerjaan belum dikirim.");
    }

    const admin = adminClient(); // gagal di awal jika secret key tidak ada, sebelum status diubah
    const supabase = await createClient();
    const sekarang = new Date().toISOString();

    const { error } = await supabase
      .from("pesanan")
      .update({ status_pesanan: "SELESAI", status_pencairan: true, waktu_pencairan: sekarang, updated_at: sekarang })
      .eq("id_pesanan", id_pesanan);
    if (error) throw new Error(error.message);

    const produk = await this.produkTerakhir(supabase, id_pesanan);
    if (produk) {
      await supabase.from("produk_akhir").update({ status_pemeriksaan: true }).eq("id_produk_akhir", produk.id_produk_akhir);
    }

    const jumlah = Math.round(pesanan.total_biaya);

    const { error: err_pencairan } = await admin.from("pencairan_dana").insert({
      id_pesanan,
      id_penyedia_jasa: pesanan.id_penyedia_jasa,
      jumlah_pencairan: jumlah,
      state_pencairan_dana: true,
    });
    if (err_pencairan) throw new Error(`Gagal mencatat pencairan dana: ${err_pencairan.message}`);

    const { data: penyedia } = await admin
      .from("penyedia_jasa")
      .select("saldo")
      .eq("id", pesanan.id_penyedia_jasa)
      .maybeSingle();

    const { error: err_saldo } = await admin
      .from("penyedia_jasa")
      .update({ saldo: (Number(penyedia?.saldo) || 0) + jumlah })
      .eq("id", pesanan.id_penyedia_jasa);
    if (err_saldo) throw new Error(`Gagal menambahkan saldo penyedia: ${err_saldo.message}`);

    const nama_jasa = pesanan.jasa?.nama_jasa ?? "Pesanan";
    await NotifikasiService.kirimNotifikasi({
      id_pengguna: pesanan.id_penyedia_jasa,
      judul: `${nama_jasa}: Pesanan Selesai & Dana Cair`,
      pesan_notifikasi: `Pemesan telah mengonfirmasi pesanan selesai. Dana sebesar Rp ${jumlah.toLocaleString("id-ID")} telah ditambahkan ke saldo Anda.`,
      id_pesanan,
    });
  }

  // ---------------------------------------------------------------- berkas

  // Unggah berkas ke folder deliverables-uploads via Storage Service (AC-1)
  static async unggahBerkasDeliverable(file: File): Promise<string> {
    if (file.size > MAKS_UKURAN_DELIVERABLE) {
      throw new Error(`Ukuran berkas melebihi batas maksimum 50 MB`);
    }
    if (!TIPE_DELIVERABLE.test(file.type)) {
      throw new Error(`Tipe berkas ${file.type || "tidak dikenal"} tidak diizinkan untuk deliverable`);
    }
    const storage = getStorageService();
    const { url, error } = await storage.upload(file, FOLDER_DELIVERABLE);
    if (error || !url) throw new Error(error ?? `Gagal mengunggah berkas deliverable`);
    return url;
  }
}