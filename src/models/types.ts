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
  id_penyedia_jasa : string;
  rating : number;
  komentar? : string;
  dokumentasi_path? : string;
  created_at : string;
}

export interface TiketLaporan {
  id_tiket : string;
  deskripsi_laporan : string;
  url_bukti : string;
  path_bukti? : string;
  status_tiket : string;
  tanggapan_admin : string;
}

export interface TanggapanLaporan{
  id_tanggapan : string;
  id_tiket : string;
  jenis_tindakan : string;
  catatan_tanggapan : string;
}