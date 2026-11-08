import type { Jasa, Pesanan } from '@/models/types';

export const PENYEDIA_JASA_1 = '11111111-1111-4111-8111-111111111111';
export const PENYEDIA_JASA_2 = '22222222-2222-4222-8222-222222222222';
export const PENGGUNA_JASA_1 = '33333333-3333-4333-8333-333333333333';
export const PENGGUNA_JASA_2 = '44444444-4444-4444-8444-444444444444';

export const mockJasaPesananList: Jasa[] = [
  {
    id_jasa: 'a0000000-0000-4000-8000-000000000001',
    id_penyedia_jasa: PENYEDIA_JASA_1,
    nama_jasa: 'Desain Logo Profesional',
    deskripsi: 'Desain logo brand dengan 3 konsep awal dan file sumber.',
    kategori: 'Desain Grafis',
    harga: 250000,
    rating_rata_rata: 4.8,
    status_aktif: true,
    created_at: '2026-11-01T08:00:00+07:00',
  },
  {
    id_jasa: 'a0000000-0000-4000-8000-000000000002',
    id_penyedia_jasa: PENYEDIA_JASA_1,
    nama_jasa: 'Edit Video Reels/TikTok',
    deskripsi: 'Editing video pendek maksimal 60 detik, termasuk subtitle.',
    kategori: 'Video & Animasi',
    harga: 150000,
    rating_rata_rata: 4.5,
    status_aktif: true,
    created_at: '2026-11-02T08:00:00+07:00',
  },
  {
    id_jasa: 'a0000000-0000-4000-8000-000000000003',
    id_penyedia_jasa: PENYEDIA_JASA_2,
    nama_jasa: 'Landing Page Next.js',
    deskripsi: 'Pembuatan landing page responsif dengan Next.js dan Tailwind.',
    kategori: 'Pemrograman',
    harga: 1200000,
    rating_rata_rata: 4.9,
    status_aktif: true,
    created_at: '2026-11-03T08:00:00+07:00',
  },
  {
    id_jasa: 'a0000000-0000-4000-8000-000000000004',
    id_penyedia_jasa: PENYEDIA_JASA_2,
    nama_jasa: 'Penulisan Artikel SEO',
    deskripsi: 'Artikel 1000 kata dioptimasi SEO. (Nonaktif)',
    kategori: 'Penulisan',
    harga: 100000,
    rating_rata_rata: 0,
    status_aktif: false,
    created_at: '2026-11-04T08:00:00+07:00',
  },
];

export const mockPesananList: Pesanan[] = [
  {
    id_pesanan: 'c0000000-0000-4000-8000-000000000001',
    id_pengguna_jasa: PENGGUNA_JASA_1,
    id_penyedia_jasa: PENYEDIA_JASA_1,
    id_jasa: mockJasaPesananList[0].id_jasa,
    brief: 'Logo minimalis warna biru tua untuk startup teknologi finansial.',
    total_biaya: 250000,
    status_pembayaran: 'LUNAS',
    status_pesanan: 'MENUNGGU_KONFIRMASI',
    status_pencairan: false,
    created_at: '2026-11-06T09:00:00+07:00',
    updated_at: '2026-11-06T09:05:00+07:00',
    jasa: mockJasaPesananList[0],
  },
  {
    id_pesanan: 'c0000000-0000-4000-8000-000000000002',
    id_pengguna_jasa: PENGGUNA_JASA_1,
    id_penyedia_jasa: PENYEDIA_JASA_2,
    id_jasa: mockJasaPesananList[2].id_jasa,
    brief: 'Landing page produk kopi lokal, 4 section beserta tombol WhatsApp.',
    total_biaya: 1200000,
    status_pembayaran: 'LUNAS',
    status_pesanan: 'SELESAI',
    status_pencairan: true,
    waktu_pencairan: '2026-11-07T15:00:00+07:00',
    created_at: '2026-11-05T10:00:00+07:00',
    updated_at: '2026-11-07T15:00:00+07:00',
    jasa: mockJasaPesananList[2],
  },
  {
    id_pesanan: 'c0000000-0000-4000-8000-000000000003',
    id_pengguna_jasa: PENGGUNA_JASA_2,
    id_penyedia_jasa: PENYEDIA_JASA_1,
    id_jasa: mockJasaPesananList[1].id_jasa,
    brief: 'Video promosi reels 30 detik dengan transisi cepat dan teks kuning.',
    total_biaya: 150000,
    status_pembayaran: 'LUNAS',
    status_pesanan: 'DIPROSES',
    status_pencairan: false,
    created_at: '2026-11-07T11:00:00+07:00',
    updated_at: '2026-11-07T11:30:00+07:00',
    jasa: mockJasaPesananList[1],
  },
];
