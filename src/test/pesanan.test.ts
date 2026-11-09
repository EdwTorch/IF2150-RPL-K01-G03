import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }));
vi.mock('@/lib/mocks/pesanan.mock', () => import('../lib/mocks/pesanan.mock'));
vi.mock('@/services/pesanan.service', () => import('../services/pesanan.service'));

import type { Jasa, Pesanan } from '../models/types';
import { PENYEDIA_JASA_1, PENYEDIA_JASA_2, PENGGUNA_JASA_1, PENGGUNA_JASA_2, mockJasaPesananList, mockPesananList } from '../lib/mocks/pesanan.mock';
import { PengontrolPesanan } from '../services/pesanan.service';
import { GET as getDaftarPesanan, POST as postPesananBaru } from '../app/api/pesanan/route';
import { GET as getDetailPesanan, PATCH as patchDetailPesanan } from '../app/api/pesanan/[id_pesanan]/route';

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

  it('dapat mengonfirmasi pesanan dengan status MENUNGGU_PEMBAYARAN maupun MENUNGGU_KONFIRMASI', () => {
    const pesananBayar: Pesanan = {
      ...daftarPesananAwal[0],
      id_pesanan: 'ord-bayar',
      status_pesanan: 'MENUNGGU_PEMBAYARAN',
    };
    const hasil = PengontrolPesanan.konfirmasiPesananDiMemori(
      [pesananBayar],
      'ord-bayar',
      'p1',
      'terima',
    );
    expect(hasil.status_pesanan).toBe('DIPROSES');
  });
});

describe('PengontrolPesanan.respondOrder (UC10)', () => {
  it('menolak jika tindakan tidak valid', async () => {
    await expect(
      PengontrolPesanan.respondOrder({
        id_pesanan: 'ord-1',
        user_id: 'p1',
        action: 'pending',
      }),
    ).rejects.toThrow('Tindakan konfirmasi tidak valid');
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

describe('HTTP Route Handlers /api/pesanan & /api/pesanan/[id_pesanan]', () => {
  const prevMock = process.env.NEXT_PUBLIC_USE_MOCK;
  beforeEach(() => {
    process.env.NEXT_PUBLIC_USE_MOCK = 'true';
  });
  afterEach(() => {
    process.env.NEXT_PUBLIC_USE_MOCK = prevMock;
  });

  it('GET /api/pesanan mengembalikan daftar pesanan pengguna (HTTP 200) atau 400 jika tanpa id_pengguna', async () => {
    const resOk = await getDaftarPesanan(
      new Request(`http://localhost/api/pesanan?id_pengguna_jasa=${PENGGUNA_JASA_1}&status=berjalan`),
    );
    const jsonOk = await resOk.json();
    expect(resOk.status).toBe(200);
    expect(jsonOk.success).toBe(true);
    expect(jsonOk.data).toHaveLength(1);
    expect(jsonOk.data[0].id_pesanan).toBe('c0000000-0000-4000-8000-000000000001');

    const resBad = await getDaftarPesanan(new Request('http://localhost/api/pesanan'));
    expect(resBad.status).toBe(400);
  });

  it('POST /api/pesanan membuat pesanan baru (HTTP 201) dan menolak input salah (400 / 404)', async () => {
    const resCreated = await postPesananBaru(
      new Request('http://localhost/api/pesanan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_pengguna_jasa: PENGGUNA_JASA_2,
          id_jasa: mockJasaPesananList[0].id_jasa,
          brief: 'Desain logo warung kopi modern',
        }),
      }),
    );
    const jsonCreated = await resCreated.json();
    expect(resCreated.status).toBe(201);
    expect(jsonCreated.success).toBe(true);
    expect(jsonCreated.data.total_biaya).toBe(250000);
    expect(jsonCreated.data.status_pesanan).toBe('MENUNGGU_PEMBAYARAN');

    const resEmptyBrief = await postPesananBaru(
      new Request('http://localhost/api/pesanan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_pengguna_jasa: PENGGUNA_JASA_2,
          id_jasa: mockJasaPesananList[0].id_jasa,
          brief: '   ',
        }),
      }),
    );
    expect(resEmptyBrief.status).toBe(400);

    const resNotFound = await postPesananBaru(
      new Request('http://localhost/api/pesanan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_pengguna_jasa: PENGGUNA_JASA_2,
          id_jasa: 'jasa-tidak-ada',
          brief: 'Brief valid',
        }),
      }),
    );
    expect(resNotFound.status).toBe(404);
  });

  it('GET /api/pesanan/[id_pesanan] mengembalikan detail pesanan (HTTP 200) atau 404 jika tidak ada', async () => {
    const resDetail = await getDetailPesanan(
      new NextRequest('http://localhost/api/pesanan/c0000000-0000-4000-8000-000000000001'),
      { params: { id_pesanan: 'c0000000-0000-4000-8000-000000000001' } },
    );
    const jsonDetail = await resDetail.json();
    expect(resDetail.status).toBe(200);
    expect(jsonDetail.success).toBe(true);
    expect(jsonDetail.data.id_pesanan).toBe('c0000000-0000-4000-8000-000000000001');

    const res404 = await getDetailPesanan(
      new NextRequest('http://localhost/api/pesanan/tidak-ada'),
      { params: { id_pesanan: 'tidak-ada' } },
    );
    expect(res404.status).toBe(404);
  });

  it('PATCH /api/pesanan/[id_pesanan] berhasil menerima pesanan dalam mode mock', async () => {
    mockPesananList[0].status_pesanan = 'MENUNGGU_KONFIRMASI';

    const req = new NextRequest('http://localhost/api/pesanan/c0000000-0000-4000-8000-000000000001', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'Diterima',
        user_id: PENYEDIA_JASA_1,
      }),
    });

    const res = await patchDetailPesanan(req, {
      params: { id_pesanan: 'c0000000-0000-4000-8000-000000000001' },
    });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.message).toContain('berhasil diterima');
    expect(mockPesananList[0].status_pesanan).toBe('DIPROSES');
  });

  it('PATCH /api/pesanan/[id_pesanan] berhasil menolak pesanan dalam mode mock', async () => {
    mockPesananList[0].status_pesanan = 'MENUNGGU_KONFIRMASI';

    const req = new NextRequest('http://localhost/api/pesanan/c0000000-0000-4000-8000-000000000001', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'tolak',
        user_id: PENYEDIA_JASA_1,
      }),
    });

    const res = await patchDetailPesanan(req, {
      params: { id_pesanan: 'c0000000-0000-4000-8000-000000000001' },
    });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.message).toContain('ditolak');
    expect(mockPesananList[0].status_pesanan).toBe('DITOLAK');

    mockPesananList[0].status_pesanan = 'MENUNGGU_KONFIRMASI';
  });

  it('PATCH /api/pesanan/[id_pesanan] menolak aksi yang tidak valid (400)', async () => {
    const req = new NextRequest('http://localhost/api/pesanan/c0000000-0000-4000-8000-000000000001', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'batal',
      }),
    });

    const res = await patchDetailPesanan(req, {
      params: { id_pesanan: 'c0000000-0000-4000-8000-000000000001' },
    });
    expect(res.status).toBe(400);
  });

  it('PATCH /api/pesanan/[id_pesanan] menolak jika user bukan penyedia jasa (403)', async () => {
    mockPesananList[0].status_pesanan = 'MENUNGGU_KONFIRMASI';

    const req = new NextRequest('http://localhost/api/pesanan/c0000000-0000-4000-8000-000000000001', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'terima',
        user_id: 'user-bukan-penyedia',
      }),
    });

    const res = await patchDetailPesanan(req, {
      params: { id_pesanan: 'c0000000-0000-4000-8000-000000000001' },
    });
    expect(res.status).toBe(403);
  });

  it('PATCH /api/pesanan/[id_pesanan] menolak jika pesanan sudah diproses sebelumnya (400)', async () => {
    const req = new NextRequest('http://localhost/api/pesanan/c0000000-0000-4000-8000-000000000002', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'terima',
        user_id: PENYEDIA_JASA_2,
      }),
    });

    const res = await patchDetailPesanan(req, {
      params: { id_pesanan: 'c0000000-0000-4000-8000-000000000002' },
    });
    expect(res.status).toBe(400);
  });

  it('PATCH /api/pesanan/[id_pesanan] mengembalikan 404 jika pesanan tidak ditemukan', async () => {
    const req = new NextRequest('http://localhost/api/pesanan/tidak-ada', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'terima',
        user_id: PENYEDIA_JASA_1,
      }),
    });

    const res = await patchDetailPesanan(req, {
      params: { id_pesanan: 'tidak-ada' },
    });
    expect(res.status).toBe(404);
  });
});
