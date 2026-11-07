// src/models/types.ts

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
  url_bukti : string;
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