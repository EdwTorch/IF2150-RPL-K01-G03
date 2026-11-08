-- Tambah kolom berkas pendukung (URL hasil LayananUploadFile C11) pada tabel jasa (C12)
-- Dicatat pada Tabel B.1 Laporan Implementasi (perubahan dari DPPL)
ALTER TABLE public.jasa
    ADD COLUMN IF NOT EXISTS berkas_pendukung TEXT[] DEFAULT '{}';
