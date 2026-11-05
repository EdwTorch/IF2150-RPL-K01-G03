-- Ekstensi untuk pencarian teks cepat (M9 Profiling) dan UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 1. TABEL PENGGUNA (C01)
CREATE TABLE IF NOT EXISTS public.pengguna (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    no_telepon VARCHAR(50),
    status_online BOOLEAN DEFAULT false,
    status_akun BOOLEAN DEFAULT true,
    sanksi VARCHAR(100) DEFAULT 'AKTIF',
    role VARCHAR(50) DEFAULT 'USER',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABEL PENYEDIA JASA (C02)
CREATE TABLE IF NOT EXISTS public.penyedia_jasa (
    id UUID PRIMARY KEY REFERENCES public.pengguna(id) ON DELETE CASCADE,
    pengalaman TEXT[] DEFAULT '{}',
    prestasi TEXT[] DEFAULT '{}',
    daftar_produk TEXT[] DEFAULT '{}',
    rating_rata_rata NUMERIC(3, 2) DEFAULT 0.0 CHECK (rating_rata_rata >= 0 AND rating_rata_rata <= 5),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL PORTOFOLIO (C09)
CREATE TABLE IF NOT EXISTS public.portofolio (
    id_portofolio UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_penyedia_jasa UUID NOT NULL REFERENCES public.penyedia_jasa(id) ON DELETE CASCADE,
    judul VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    berkas_pendukung VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL JASA (C12)
CREATE TABLE IF NOT EXISTS public.jasa (
    id_jasa UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_penyedia_jasa UUID NOT NULL REFERENCES public.penyedia_jasa(id) ON DELETE CASCADE,
    nama_jasa VARCHAR(255) NOT NULL,
    deskripsi TEXT NOT NULL,
    kategori VARCHAR(100) NOT NULL,
    harga NUMERIC(15, 2) NOT NULL CHECK (harga >= 0),
    rating_rata_rata NUMERIC(3, 2) DEFAULT 0.0 CHECK (rating_rata_rata >= 0 AND rating_rata_rata <= 5),
    status_aktif BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABEL BOOKMARK (C20)
CREATE TABLE IF NOT EXISTS public.bookmark (
    id_bookmark UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_pengguna_jasa UUID NOT NULL REFERENCES public.pengguna_jasa(id) ON DELETE CASCADE,
    id_jasa UUID NOT NULL REFERENCES public.jasa(id_jasa) ON DELETE CASCADE,
    waktu_disimpan TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(id_pengguna_jasa, id_jasa)
);

-- 6. TABEL METODE PEMBAYARAN (C33)
CREATE TABLE IF NOT EXISTS public.metode_pembayaran (
    id_metode VARCHAR(50) PRIMARY KEY,
    nama_metode VARCHAR(100) NOT NULL,
    nomor_rekening_va VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABEL PESANAN (C27)
CREATE TABLE IF NOT EXISTS public.pesanan (
    id_pesanan UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_pengguna_jasa UUID NOT NULL REFERENCES public.pengguna_jasa(id),
    id_penyedia_jasa UUID NOT NULL REFERENCES public.penyedia_jasa(id),
    id_jasa UUID NOT NULL REFERENCES public.jasa(id_jasa),
    brief TEXT NOT NULL,
    total_biaya NUMERIC(15, 2) NOT NULL,
    id_metode_pembayaran VARCHAR(50) REFERENCES public.metode_pembayaran(id_metode),
    status_pembayaran VARCHAR(50) DEFAULT 'MENUNGGU_PEMBAYARAN',
    status_pesanan VARCHAR(50) DEFAULT 'MENUNGGU_PEMBAYARAN',
    status_pencairan BOOLEAN DEFAULT false,
    waktu_pencairan TIMESTAMPTZ,
    waktu_dibuat TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABEL RIWAYAT TRANSAKSI (C34)
CREATE TABLE IF NOT EXISTS public.riwayat_transaksi (
    id_riwayat UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_pesanan UUID NOT NULL REFERENCES public.pesanan(id_pesanan) ON DELETE CASCADE,
    id_metode VARCHAR(50) REFERENCES public.metode_pembayaran(id_metode) ON DELETE SET NULL,
    total_biaya NUMERIC(15, 2) NOT NULL,
    tanggal_transaksi TIMESTAMPTZ DEFAULT NOW(),
    status_transaksi VARCHAR(50) DEFAULT 'BERHASIL'
);

-- 9. TABEL CHATROOM (C23)
CREATE TABLE IF NOT EXISTS public.chatroom (
    id_chatroom UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_pengguna_jasa UUID NOT NULL REFERENCES public.pengguna_jasa(id) ON DELETE CASCADE,
    id_penyedia_jasa UUID NOT NULL REFERENCES public.penyedia_jasa(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(id_pengguna_jasa, id_penyedia_jasa)
);

-- 10. TABEL PESAN CHAT (C23, Realtime UC08)
CREATE TABLE IF NOT EXISTS public.pesan_chat (
    id_pesan UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_chatroom UUID NOT NULL REFERENCES public.chatroom(id_chatroom) ON DELETE CASCADE,
    id_pengirim UUID NOT NULL REFERENCES public.pengguna(id),
    isi_pesan TEXT NOT NULL,
    lampiran VARCHAR(500),
    waktu_dibuat TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER PUBLICATION supabase_realtime ADD TABLE public.pesan_chat;

-- 11. TABEL PRODUK AKHIR / DELIVERABLES (C36)
CREATE TABLE IF NOT EXISTS public.produk_akhir (
    id_produk_akhir UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_pesanan UUID NOT NULL REFERENCES public.pesanan(id_pesanan) ON DELETE CASCADE,
    outputpath VARCHAR(500),
    deskripsi_produk TEXT NOT NULL,
    file_url VARCHAR(500),
    status_pemeriksaan BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. TABEL PENGAJUAN REVISI (C39)
CREATE TABLE IF NOT EXISTS public.pengajuan_revisi (
    id_revisi UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_pesanan UUID NOT NULL REFERENCES public.pesanan(id_pesanan) ON DELETE CASCADE,
    deskripsi_revisi TEXT NOT NULL,
    lampiran_revisi VARCHAR(500),
    status_pengerjaan VARCHAR(50) DEFAULT 'Sedang Direvisi',
    jml_revisi_tersedia INT DEFAULT 2,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. TABEL PENCAIRAN DANA (C42)
CREATE TABLE IF NOT EXISTS public.pencairan_dana (
    id_pencairan UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_pesanan UUID NOT NULL REFERENCES public.pesanan(id_pesanan) ON DELETE CASCADE,
    state_pencairan_dana BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. TABEL TIKET LAPORAN / MEDIASI (C43)
CREATE TABLE IF NOT EXISTS public.tiket_laporan (
    id_tiket UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_pesanan UUID NOT NULL REFERENCES public.pesanan(id_pesanan) ON DELETE CASCADE,
    id_pelapor UUID NOT NULL REFERENCES public.pengguna(id),
    id_terlapor UUID REFERENCES public.pengguna(id),
    deskripsi_laporan TEXT NOT NULL,
    url_bukti VARCHAR(500),
    lampiran_bukti VARCHAR(500),
    status_tiket VARCHAR(50) DEFAULT 'MENUNGGU',
    tanggapan_admin TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. TABEL SESI MEDIASI (C51, C52)
CREATE TABLE IF NOT EXISTS public.sesi_mediasi (
    id_sesi_mediasi UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_tiket UUID NOT NULL REFERENCES public.tiket_laporan(id_tiket) ON DELETE CASCADE,
    id_admin UUID NOT NULL REFERENCES public.admin(id),
    status_sesi VARCHAR(50) DEFAULT 'BERLANGSUNG',
    waktu_mulai TIMESTAMPTZ DEFAULT NOW(),
    waktu_selesai TIMESTAMPTZ
);

-- 16. TABEL PESAN MEDIASI (C52)
CREATE TABLE IF NOT EXISTS public.pesan_mediasi (
    id_pesan UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_sesi_mediasi UUID NOT NULL REFERENCES public.sesi_mediasi(id_sesi_mediasi) ON DELETE CASCADE,
    id_pengirim UUID NOT NULL REFERENCES public.pengguna(id),
    isi_pesan TEXT NOT NULL,
    waktu_kirim TIMESTAMPTZ DEFAULT NOW()
);

-- 17. TABEL ULASAN (C46)
CREATE TABLE IF NOT EXISTS public.ulasan (
    id_ulasan UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_pesanan UUID NOT NULL REFERENCES public.pesanan(id_pesanan) ON DELETE CASCADE,
    id_penyedia_jasa UUID NOT NULL REFERENCES public.penyedia_jasa(id),
    id_pengguna_jasa UUID NOT NULL REFERENCES public.pengguna_jasa(id),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    komentar TEXT,
    dokumentasi_path VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. TABEL NOTIFIKASI (C41, C45, C51)
CREATE TABLE IF NOT EXISTS public.notifikasi (
    id_notifikasi UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_pengguna UUID REFERENCES public.pengguna(id) ON DELETE CASCADE,
    id_pesanan UUID REFERENCES public.pesanan(id_pesanan) ON DELETE CASCADE,
    id_referensi UUID,
    pesan_notifikasi TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. TABEL TANGGAPAN LAPORAN (C49)
CREATE TABLE IF NOT EXISTS public.tanggapan_laporan (
    id_tanggapan UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_tiket UUID NOT NULL REFERENCES public.tiket_laporan(id_tiket) ON DELETE CASCADE,
    jenis_tindakan VARCHAR(50) NOT NULL,
    catatan_tanggapan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. TABEL PENGGUNA JASA (C03)
CREATE TABLE IF NOT EXISTS public.pengguna_jasa (
    id UUID PRIMARY KEY REFERENCES public.pengguna(id) ON DELETE CASCADE,
    minat_kategori_jasa TEXT[] DEFAULT '{}',
    status_konfirmasi BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. TABEL ADMIN (C52)
CREATE TABLE IF NOT EXISTS public.admin (
    id UUID PRIMARY KEY REFERENCES public.pengguna(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);