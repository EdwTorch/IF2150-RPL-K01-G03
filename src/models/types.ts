// src/models/types.ts

// Tipe data untuk Produk Akhir / Deliverables (C36)
// ada tanda tanya artinya optional
export interface ProdukAkhir {
  id_produk_akhir?: string; 
  id_pesanan: string;
  output_path?: string; 
  deskripsi_produk: string;
  file_url?: string; //
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


export interface Pesanan {
  id_pesanan : string;
  id_pengguna_jasa : string;
  id_penyedia_jasa : string;
  id_jasa : string;
  brief : string;
  total_biaya : number;
  status_pesanan : string;
}

export interface PencairanDana {
  id_pencairan : string;
  id_pesanan : string;
  id_penyedia_jasa : string;
  jumlah_pencairan : number;
  state_pencairan_dana : boolean;
  
}