import type { Jasa } from '@/models/types';

const PENYEDIA_1 = '11111111-1111-4111-8111-111111111111';
const PENYEDIA_2 = '22222222-2222-4222-8222-222222222222';

export const mockJasaList: Jasa[] = [
  {
    id_jasa: 'a0000000-0000-4000-8000-000000000001',
    id_penyedia_jasa: PENYEDIA_1,
    nama_jasa: 'Desain Logo Profesional',
    deskripsi: 'Desain logo brand dengan 3 konsep awal dan file sumber.',
    kategori: 'Desain Grafis',
    harga: 250000,
    rating_rata_rata: 4.8,
    status_aktif: true,
    berkas_pendukung: ['/uploads/jasa/logo-1.png', '/uploads/jasa/logo-2.png'],
    created_at: '2026-11-01T08:00:00+07:00',
  },
  {
    id_jasa: 'a0000000-0000-4000-8000-000000000002',
    id_penyedia_jasa: PENYEDIA_1,
    nama_jasa: 'Edit Video Reels/TikTok',
    deskripsi: 'Editing video pendek maksimal 60 detik, termasuk subtitle.',
    kategori: 'Video & Animasi',
    harga: 150000,
    rating_rata_rata: 4.5,
    status_aktif: true,
    berkas_pendukung: ['/uploads/jasa/reels-sample.mp4'],
    created_at: '2026-11-02T08:00:00+07:00',
  },
  {
    id_jasa: 'a0000000-0000-4000-8000-000000000003',
    id_penyedia_jasa: PENYEDIA_2,
    nama_jasa: 'Landing Page Next.js',
    deskripsi: 'Pembuatan landing page responsif dengan Next.js dan Tailwind.',
    kategori: 'Pemrograman',
    harga: 1200000,
    rating_rata_rata: 4.9,
    status_aktif: true,
    berkas_pendukung: ['/uploads/jasa/landing-page.png'],
    created_at: '2026-11-03T08:00:00+07:00',
  },
  {
    id_jasa: 'a0000000-0000-4000-8000-000000000004',
    id_penyedia_jasa: PENYEDIA_2,
    nama_jasa: 'Penulisan Artikel SEO',
    deskripsi: 'Artikel 1000 kata dioptimasi SEO. (Nonaktif)',
    kategori: 'Penulisan',
    harga: 100000,
    rating_rata_rata: 0,
    status_aktif: false,
    berkas_pendukung: [],
    created_at: '2026-11-04T08:00:00+07:00',
  },
];
