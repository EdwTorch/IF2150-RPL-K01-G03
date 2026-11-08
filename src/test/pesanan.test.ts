import { describe, it, expect } from 'vitest';
import type { Jasa, Pesanan } from '../models/types';
import { PengontrolPesanan } from '../services/pesanan.service';

const daftarJasa: Jasa[] = [
  {
    id_jasa: 'j1',
    id_penyedia_jasa: 'p1',
    nama_jasa: 'Desain Logo',
    deskripsi: 'Logo profesional',
    kategori: 'Desain Grafis',
    harga: 250000,
    rating_rata_rata: 4.8,
    status_aktif: true,
    created_at: '2026-11-01T00:00:00Z',
  },
  {
    id_jasa: 'j2',
    id_penyedia_jasa: 'p1',
    nama_jasa: 'Edit Video',
    deskripsi: 'Video reels',
    kategori: 'Video & Animasi',
    harga: 150000,
    rating_rata_rata: 4.5,
    status_aktif: true,
    created_at: '2026-11-02T00:00:00Z',
  },
  {
    id_jasa: 'j3',
    id_penyedia_jasa: 'p2',
    nama_jasa: 'Landing Page',
    deskripsi: 'Web Next.js',
    kategori: 'Pemrograman',
    harga: 1200000,
    rating_rata_rata: 4.9,
    status_aktif: true,
    created_at: '2026-11-03T00:00:00Z',
  },
  {
    id_jasa: 'j4',
    id_penyedia_jasa: 'p2',
    nama_jasa: 'Jasa Nonaktif',
    deskripsi: 'Tidak aktif',
    kategori: 'Penulisan',
    harga: 100000,
    status_aktif: false,
  },
];

const daftarPesananAwal: Pesanan[] = [
  {
    id_pesanan: 'ord-1',
    id_pengguna_jasa: 'u1',
    id_penyedia_jasa: 'p1',
    id_jasa: 'j1',
    brief: 'Brief pesanan 1',
    total_biaya: 250000,
    status_pembayaran: 'LUNAS',
    status_pesanan: 'MENUNGGU_KONFIRMASI',
    created_at: '2026-11-06T09:00:00Z',
  },
  {
    id_pesanan: 'ord-2',
    id_pengguna_jasa: 'u1',
    id_penyedia_jasa: 'p2',
    id_jasa: 'j3',
    brief: 'Brief pesanan 2',
    total_biaya: 1200000,
    status_pembayaran: 'LUNAS',
    status_pesanan: 'SELESAI',
    created_at: '2026-11-05T10:00:00Z',
  },
  {
    id_pesanan: 'ord-3',
    id_pengguna_jasa: 'u2',
    id_penyedia_jasa: 'p1',
    id_jasa: 'j2',
    brief: 'Brief pesanan 3',
    total_biaya: 150000,
    status_pembayaran: 'LUNAS',
    status_pesanan: 'DIPROSES',
    created_at: '2026-11-07T11:00:00Z',
  },
];

describe('PengontrolPesanan.buatPesananDiMemori (UC09, Algo-3101 & Algo-3102)', () => {
  it('berhasil membuat pesanan baru dengan snapshot harga dan status MENUNGGU_PEMBAYARAN', () => {
    const daftarJasaLokal = daftarJasa.map((j) => ({ ...j }));
    const pesanan = PengontrolPesanan.buatPesananDiMemori(
      daftarPesananAwal,
      daftarJasaLokal,
      'u1',
      'j2',
      '  Tolong edit video durasi 45 detik  ',
    );

    expect(pesanan.id_pesanan).toBeTruthy();
    expect(pesanan.id_pengguna_jasa).toBe('u1');
    expect(pesanan.id_penyedia_jasa).toBe('p1');
    expect(pesanan.brief).toBe('Tolong edit video durasi 45 detik');
    expect(pesanan.total_biaya).toBe(150000);
    expect(pesanan.status_pesanan).toBe('MENUNGGU_PEMBAYARAN');
    expect(pesanan.status_pembayaran).toBe('MENUNGGU_PEMBAYARAN');

    // Snapshot harga tidak berubah meski harga jasa diubah setelahnya
    daftarJasaLokal[1].harga = 999000;
    expect(pesanan.total_biaya).toBe(150000);
  });

  it('menolak jika brief kosong atau parameter tidak valid', () => {
    expect(() =>
      PengontrolPesanan.buatPesananDiMemori(daftarPesananAwal, daftarJasa, 'u1', 'j2', '   '),
    ).toThrow('Brief pemesanan wajib diisi');
    expect(() =>
      PengontrolPesanan.buatPesananDiMemori(daftarPesananAwal, daftarJasa, '', 'j2', 'Brief'),
    ).toThrow('Parameter pemesanan tidak valid');
  });

  it('menolak jika jasa tidak ditemukan, nonaktif, atau milik sendiri', () => {
    expect(() =>
      PengontrolPesanan.buatPesananDiMemori(daftarPesananAwal, daftarJasa, 'u1', 'j-404', 'Brief'),
    ).toThrow('Data jasa tidak ditemukan');
    expect(() =>
      PengontrolPesanan.buatPesananDiMemori(daftarPesananAwal, daftarJasa, 'u1', 'j4', 'Brief'),
    ).toThrow('Data jasa tidak ditemukan');
    expect(() =>
      PengontrolPesanan.buatPesananDiMemori(daftarPesananAwal, daftarJasa, 'p1', 'j1', 'Brief'),
    ).toThrow('Tidak dapat memesan jasa milik sendiri');
  });

  it('menegakkan aturan maksimal 2 pesanan aktif per pengguna jasa (SKPL #13)', () => {
    // u1 baru punya 1 pesanan aktif (ord-1: MENUNGGU_KONFIRMASI) dan 1 selesai (ord-2: SELESAI)
    const pesananKedua = PengontrolPesanan.buatPesananDiMemori(
      daftarPesananAwal,
      daftarJasa,
      'u1',
      'j2',
      'Pesanan aktif kedua',
    );
    const daftarDuaAktif = [...daftarPesananAwal, pesananKedua];

    // Pesanan ke-3 ditolak karena sudah ada 2 pesanan aktif
    expect(() =>
      PengontrolPesanan.buatPesananDiMemori(
        daftarDuaAktif,
        daftarJasa,
        'u1',
        'j3',
        'Pesanan aktif ketiga',
      ),
    ).toThrow('Batas maksimal 2 pesanan aktif telah tercapai');

    // Jika salah satu pesanan menjadi DITOLAK (terminal), u1 bisa memesan lagi
    const daftarSetelahDitolak = daftarDuaAktif.map((p) =>
      p.id_pesanan === 'ord-1' ? { ...p, status_pesanan: 'DITOLAK' } : p,
    );
    expect(() =>
      PengontrolPesanan.buatPesananDiMemori(
        daftarSetelahDitolak,
        daftarJasa,
        'u1',
        'j3',
        'Pesanan baru setelah 1 ditolak',
      ),
    ).not.toThrow();
  });
});

describe('PengontrolPesanan.konfirmasiPesananDiMemori (UC10, Algo-0205 & Algo-0206)', () => {
  it('menerima pesanan mengubah status menjadi DIPROSES (Algo-0205)', () => {
    const hasil = PengontrolPesanan.konfirmasiPesananDiMemori(
      daftarPesananAwal,
      'ord-1',
      'p1',
      'terima',
    );
    expect(hasil.status_pesanan).toBe('DIPROSES');
  });

  it('menolak pesanan mengubah status menjadi DITOLAK dan status_pembayaran DIKEMBALIKAN (Algo-0206)', () => {
    const hasil = PengontrolPesanan.konfirmasiPesananDiMemori(
      daftarPesananAwal,
      'ord-1',
      'p1',
      'tolak',
    );
    expect(hasil.status_pesanan).toBe('DITOLAK');
    expect(hasil.status_pembayaran).toBe('DIKEMBALIKAN');
  });

  it('menolak konfirmasi jika bukan penyedia jasa pemilik pesanan', () => {
    expect(() =>
      PengontrolPesanan.konfirmasiPesananDiMemori(daftarPesananAwal, 'ord-1', 'p2', 'terima'),
    ).toThrow('Akses ditolak');
  });

  it('menolak konfirmasi jika pesanan sudah diproses atau selesai sebelumnya', () => {
    expect(() =>
      PengontrolPesanan.konfirmasiPesananDiMemori(daftarPesananAwal, 'ord-3', 'p1', 'terima'),
    ).toThrow('Pesanan ini sudah diproses sebelumnya');
    expect(() =>
      PengontrolPesanan.konfirmasiPesananDiMemori(daftarPesananAwal, 'ord-2', 'p2', 'tolak'),
    ).toThrow('Pesanan ini sudah diproses sebelumnya');
  });
});

describe('PengontrolPesanan.ambilDaftarPesananDiMemori & ambilDetailPesananDiMemori (Algo-3104)', () => {
  it('menyaring pesanan berdasarkan peran pengguna_jasa dan penyedia_jasa terurut terbaru', () => {
    const milikU1 = PengontrolPesanan.ambilDaftarPesananDiMemori(
      daftarPesananAwal,
      daftarJasa,
      'u1',
      'pengguna_jasa',
    );
    expect(milikU1.map((p) => p.id_pesanan)).toEqual(['ord-1', 'ord-2']);
    expect(milikU1[0].jasa?.nama_jasa).toBe('Desain Logo');

    const milikP1 = PengontrolPesanan.ambilDaftarPesananDiMemori(
      daftarPesananAwal,
      daftarJasa,
      'p1',
      'penyedia_jasa',
    );
    expect(milikP1.map((p) => p.id_pesanan)).toEqual(['ord-3', 'ord-1']);
  });

  it('menyaring berdasarkan filter_status spesifik maupun kategori tab UI (berjalan, selesai)', () => {
    const berjalanU1 = PengontrolPesanan.ambilDaftarPesananDiMemori(
      daftarPesananAwal,
      daftarJasa,
      'u1',
      'pengguna_jasa',
      'berjalan',
    );
    expect(berjalanU1.map((p) => p.id_pesanan)).toEqual(['ord-1']);

    const selesaiU1 = PengontrolPesanan.ambilDaftarPesananDiMemori(
      daftarPesananAwal,
      daftarJasa,
      'u1',
      'pengguna_jasa',
      'selesai',
    );
    expect(selesaiU1.map((p) => p.id_pesanan)).toEqual(['ord-2']);
  });

  it('mengambil detail pesanan berdasarkan ID dan menolak jika tidak ditemukan', () => {
    const detail = PengontrolPesanan.ambilDetailPesananDiMemori(
      daftarPesananAwal,
      daftarJasa,
      'ord-1',
    );
    expect(detail.id_pesanan).toBe('ord-1');
    expect(detail.jasa?.harga).toBe(250000);

    expect(() =>
      PengontrolPesanan.ambilDetailPesananDiMemori(daftarPesananAwal, daftarJasa, 'ord-404'),
    ).toThrow('Pesanan tidak ditemukan');
  });
});

describe('PengontrolPesanan Order State Machine (Algo-3103)', () => {
  it('mengizinkan alur transisi siklus hidup pesanan yang sah', () => {
    expect(
      PengontrolPesanan.validasiTransisiStatus('MENUNGGU_PEMBAYARAN', 'DIPROSES'),
    ).toBe('DIPROSES');
    expect(
      PengontrolPesanan.validasiTransisiStatus('DIPROSES', 'MENUNGGU_KONFIRMASI_SELESAI'),
    ).toBe('MENUNGGU_KONFIRMASI_SELESAI');
    expect(
      PengontrolPesanan.validasiTransisiStatus('MENUNGGU_KONFIRMASI_SELESAI', 'DIPROSES'),
    ).toBe('DIPROSES');
    expect(
      PengontrolPesanan.validasiTransisiStatus('MENUNGGU_KONFIRMASI_SELESAI', 'SELESAI'),
    ).toBe('SELESAI');
    expect(
      PengontrolPesanan.validasiTransisiStatus('DIPROSES', 'KOMPLAIN'),
    ).toBe('KOMPLAIN');
  });

  it('menolak transisi status yang melanggar aturan state machine', () => {
    expect(() =>
      PengontrolPesanan.validasiTransisiStatus('MENUNGGU_PEMBAYARAN', 'SELESAI'),
    ).toThrow('tidak valid');
    expect(() =>
      PengontrolPesanan.validasiTransisiStatus('SELESAI', 'DIPROSES'),
    ).toThrow('tidak valid');
    expect(() =>
      PengontrolPesanan.validasiTransisiStatus('DITOLAK', 'DIPROSES'),
    ).toThrow('tidak valid');
  });
});
