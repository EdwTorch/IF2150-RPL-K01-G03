// src/models/types.ts

// Tipe data untuk Jasa (C12)
export interface Jasa {
  id_jasa: string;
  id_penyedia_jasa: string;
  nama_jasa: string;
  deskripsi: string;
  kategori: string;
  harga: number;
  rating_rata_rata?: number; // default 0.0, rentang 0-5
  status_aktif?: boolean; // default true
  berkas_pendukung?: string[]; // URL berkas, default []
  created_at?: string;
}

// Tipe data untuk Bookmark (C20)
export interface Bookmark {
  id_bookmark: string;
  id_pengguna_jasa: string;
  id_jasa: string;
  waktu_disimpan?: string;
  created_at?: string;
  jasa?: Jasa;
}

// Tipe data untuk Produk Akhir / Deliverables (C36)
// ada tanda tanya artinya optional
export interface ProdukAkhir {
  id_produk_akhir: string; 
  id_pesanan: string;
  output_path?: string; 
  deskripsi_produk: string;
  file_url?: string; //bra
  status_pemeriksaan?: boolean;
  created_at?: string;
}

// Tipe data untuk Pengajuan Revisi (C39)
export interface PengajuanRevisi {
  id_revisi?: string;
  id_pesanan: string;
  deskripsi_revisi: string;
  jml_revisi_tersedia: number;
  status_pengerjaan: string;
  lampiran_revisi?: string;
  created_at?: string;
}

// Tipe data untuk Pesanan (C27)
export interface Pesanan {
  id_pesanan : string;
  id_pengguna_jasa : string;
  id_penyedia_jasa : string;
  id_jasa : string;
  brief : string;
  total_biaya : number;
  id_metode_pembayaran? : string;
  status_pembayaran? : string;
  status_pesanan : string;
  status_pencairan? : boolean;
  waktu_pencairan? : string;
  created_at? : string;
  updated_at? : string;
  jasa? : Jasa;
}

export interface PencairanDana {
  id_pencairan : string;
  id_pesanan : string;
  id_penyedia_jasa : string;
  jumlah_pencairan : number;
  state_pencairan_dana : boolean;
}
export interface Ulasan {
  id_ulasan : string;
  id_pesanan : string;
  id_pengguna_jasa : string;
  rating : number;
  komentar? : string;
  dokumentasi_path? : string;
  created_at : string;
}

export interface TiketLaporan {
  id_tiket?: string;
  id_pesanan : string;
  id_pelapor : string;
  id_terlapor : string;
  deskripsi_laporan : string;
  url_bukti : string[];
  kategori : string[];
  status_tiket : "Diproses" | "Selesai";
  tanggapan_admin : string;
}

export interface TanggapanLaporan{
  id_tanggapan : string;
  id_tiket : string;
  jenis_tindakan : string;
  catatan_tanggapan : string;
}
// Tipe data pengguna yang sedang login (dari sesi)
export interface SessionUser {
  id: string;
  email: string;
  nama: string;
  role: "USER" | "ADMIN";
  status_akun: boolean;
  isPenyediaJasa: boolean;
  isPenggunaJasa: boolean;
}

export interface Notifikasi{
    id_notifikasi : string;
    id_pengguna : string;
    id_pesanan : string;
    id_referensi : string,
    judul : string,
    pesan_notifikasi : string,
    is_read : boolean,
}

export interface ChatroomRow {
  id_chatroom: string;
  id_pengguna_jasa: string;
  id_penyedia_jasa: string;
  created_at: string;
}

export interface PesanChatRow {
  id_pesan: string;
  id_chatroom: string;
  id_pengirim: string;
  isi_pesan: string;
  lampiran: string | null;
  waktu_dibuat: string;
  created_at: string;
}

// 2. Extend dari tabel mentah untuk kebutuhan response API (dengan data JOIN)
export interface ChatroomDetail extends ChatroomRow {
  pengguna_jasa?: {
    id: string;
    nama: string;
  };
  penyedia_jasa?: {
    id: string;
    nama: string;
  };
}

export interface PesanChatDetail extends PesanChatRow {
  pengirim?: {
    id: string;
    nama: string;
  };
}
