import type { MetodePembayaran, Pesanan, RiwayatTransaksi } from '@/models/types';

export const PENYEDIA_JASA_1 = '11111111-1111-4111-8111-111111111111';
export const PENYEDIA_JASA_2 = '22222222-2222-4222-8222-222222222222';
export const PENGGUNA_JASA_1 = '33333333-3333-4333-8333-333333333333';
export const PENGGUNA_JASA_2 = '44444444-4444-4444-8444-444444444444';

export const mockMetodePembayaranList: MetodePembayaran[] = [
  {
    id_metode: 'VA_BCA',
    nama_metode: 'BCA Virtual Account',
    nomor_rekening_va: '8801081234567890',
    created_at: '2026-11-01T08:00:00+07:00',
  },
  {
    id_metode: 'VA_MANDIRI',
    nama_metode: 'Mandiri Virtual Account',
    nomor_rekening_va: '8902081234567890',
    created_at: '2026-11-01T08:00:00+07:00',
  },
  {
    id_metode: 'VA_BNI',
    nama_metode: 'BNI Virtual Account',
    nomor_rekening_va: '8810081234567890',
    created_at: '2026-11-01T08:00:00+07:00',
  },
  {
    id_metode: 'EWALLET_GOPAY',
    nama_metode: 'GoPay / QRIS',
    nomor_rekening_va: '081234567890',
    created_at: '2026-11-01T08:00:00+07:00',
  },
];

export const mockPesananTransaksiList: Pesanan[] = [
  {
    id_pesanan: 'c0000000-0000-4000-8000-000000000001',
    id_pengguna_jasa: PENGGUNA_JASA_1,
    id_penyedia_jasa: PENYEDIA_JASA_1,
    id_jasa: 'a0000000-0000-4000-8000-000000000001',
    brief: 'Logo minimalis warna biru tua untuk startup teknologi finansial.',
    total_biaya: 250000,
    status_pembayaran: 'MENUNGGU_PEMBAYARAN',
    status_pesanan: 'MENUNGGU_PEMBAYARAN',
    status_pencairan: false,
    created_at: '2026-11-06T09:00:00+07:00',
    updated_at: '2026-11-06T09:00:00+07:00',
  },
  {
    id_pesanan: 'c0000000-0000-4000-8000-000000000002',
    id_pengguna_jasa: PENGGUNA_JASA_1,
    id_penyedia_jasa: PENYEDIA_JASA_2,
    id_jasa: 'a0000000-0000-4000-8000-000000000003',
    brief: 'Landing page produk kopi lokal, 4 section beserta tombol WhatsApp.',
    total_biaya: 1200000,
    id_metode_pembayaran: 'VA_BCA',
    status_pembayaran: 'LUNAS',
    status_pesanan: 'SELESAI',
    status_pencairan: true,
    waktu_pencairan: '2026-11-07T15:00:00+07:00',
    created_at: '2026-11-05T10:00:00+07:00',
    updated_at: '2026-11-07T15:00:00+07:00',
  },
  {
    id_pesanan: 'c0000000-0000-4000-8000-000000000003',
    id_pengguna_jasa: PENGGUNA_JASA_2,
    id_penyedia_jasa: PENYEDIA_JASA_1,
    id_jasa: 'a0000000-0000-4000-8000-000000000002',
    brief: 'Video promosi reels 30 detik dengan transisi cepat dan teks kuning.',
    total_biaya: 150000,
    id_metode_pembayaran: 'EWALLET_GOPAY',
    status_pembayaran: 'LUNAS',
    status_pesanan: 'DIPROSES',
    status_pencairan: false,
    created_at: '2026-11-07T11:00:00+07:00',
    updated_at: '2026-11-07T11:30:00+07:00',
  },
];

export const mockRiwayatTransaksiList: RiwayatTransaksi[] = [
  {
    id_riwayat: 'd0000000-0000-4000-8000-000000000001',
    id_pesanan: mockPesananTransaksiList[1].id_pesanan,
    id_metode: 'VA_BCA',
    total_biaya: 1200000,
    tanggal_transaksi: '2026-11-05T10:05:00+07:00',
    status_transaksi: 'BERHASIL',
    pesanan: mockPesananTransaksiList[1],
    metode_pembayaran: mockMetodePembayaranList[0],
  },
  {
    id_riwayat: 'd0000000-0000-4000-8000-000000000002',
    id_pesanan: mockPesananTransaksiList[2].id_pesanan,
    id_metode: 'EWALLET_GOPAY',
    total_biaya: 150000,
    tanggal_transaksi: '2026-11-07T11:05:00+07:00',
    status_transaksi: 'BERHASIL',
    pesanan: mockPesananTransaksiList[2],
    metode_pembayaran: mockMetodePembayaranList[3],
  },
];
