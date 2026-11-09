import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockCreateClient = vi.fn();
vi.mock('../lib/supabase/server', () => ({ createClient: () => mockCreateClient() }));

import type { MetodePembayaran, Pesanan, RiwayatTransaksi } from '../models/types';
import {
  PENGGUNA_JASA_1,
  PENYEDIA_JASA_1,
  mockMetodePembayaranList,
  mockPesananTransaksiList,
  mockRiwayatTransaksiList,
} from '../lib/mocks/transaksi.mock';
import { PengontrolTransaksi } from '../services/transaksi.service';
import { POST as postPembayaranDummy } from '../app/api/transaksi/dummy/route';
import { GET as getTransaksi } from '../app/api/transaksi/route';

const daftarMetode: MetodePembayaran[] = [
  { id_metode: 'VA_BCA', nama_metode: 'BCA Virtual Account', nomor_rekening_va: '8801081234567890' },
  { id_metode: 'EWALLET_GOPAY', nama_metode: 'GoPay / QRIS', nomor_rekening_va: '081234567890' },
];

const daftarPesanan: Pesanan[] = [
  {
    id_pesanan: 'ord-unpaid',
    id_pengguna_jasa: 'u1',
    id_penyedia_jasa: 'p1',
    id_jasa: 'j1',
    brief: 'Desain logo perusahaan',
    total_biaya: 250000,
    status_pembayaran: 'MENUNGGU_PEMBAYARAN',
    status_pesanan: 'MENUNGGU_PEMBAYARAN',
    status_pencairan: false,
    created_at: '2026-11-06T09:00:00Z',
  },
  {
    id_pesanan: 'ord-paid-1',
    id_pengguna_jasa: 'u1',
    id_penyedia_jasa: 'p2',
    id_jasa: 'j2',
    brief: 'Landing page produk',
    total_biaya: 1200000,
    id_metode_pembayaran: 'VA_BCA',
    status_pembayaran: 'LUNAS',
    status_pesanan: 'SELESAI',
    status_pencairan: true,
    created_at: '2026-11-05T10:00:00Z',
  },
  {
    id_pesanan: 'ord-paid-2',
    id_pengguna_jasa: 'u2',
    id_penyedia_jasa: 'p1',
    id_jasa: 'j3',
    brief: 'Edit video promosi',
    total_biaya: 150000,
    id_metode_pembayaran: 'EWALLET_GOPAY',
    status_pembayaran: 'LUNAS',
    status_pesanan: 'DIPROSES',
    status_pencairan: false,
    created_at: '2026-11-07T11:00:00Z',
  },
];

const daftarRiwayat: RiwayatTransaksi[] = [
  {
    id_riwayat: 'trx-1',
    id_pesanan: 'ord-paid-1',
    id_metode: 'VA_BCA',
    total_biaya: 1200000,
    tanggal_transaksi: '2026-11-05T10:05:00Z',
    status_transaksi: 'BERHASIL',
  },
  {
    id_riwayat: 'trx-2',
    id_pesanan: 'ord-paid-2',
    id_metode: 'EWALLET_GOPAY',
    total_biaya: 150000,
    tanggal_transaksi: '2026-11-07T11:05:00Z',
    status_transaksi: 'BERHASIL',
  },
];

describe('Model & Mock Data Transaksi (C33 MetodePembayaran & C34 RiwayatTransaksi)', () => {
  it('menyediakan data mock metode pembayaran dan riwayat transaksi sesuai kontrak DDL snake_case', () => {
    expect(mockMetodePembayaranList.length).toBeGreaterThanOrEqual(4);
    expect(mockMetodePembayaranList[0]).toHaveProperty('id_metode');
    expect(mockMetodePembayaranList[0]).toHaveProperty('nama_metode');
    expect(mockMetodePembayaranList[0]).toHaveProperty('nomor_rekening_va');

    expect(mockPesananTransaksiList[0].status_pesanan).toBe('MENUNGGU_PEMBAYARAN');
    expect(mockRiwayatTransaksiList.length).toBeGreaterThanOrEqual(2);
    expect(mockRiwayatTransaksiList[0]).toHaveProperty('id_riwayat');
    expect(mockRiwayatTransaksiList[0].status_transaksi).toBe('BERHASIL');
  });
});

describe('PengontrolTransaksi.dapatkanDetailMetodeDiMemori (C33, Algo-3301)', () => {
  it('mengembalikan detail metode pembayaran yang terdaftar', () => {
    const detail = PengontrolTransaksi.dapatkanDetailMetodeDiMemori(daftarMetode, 'VA_BCA');
    expect(detail.id_metode).toBe('VA_BCA');
    expect(detail.nama_metode).toBe('BCA Virtual Account');
    expect(detail.nomor_rekening_va).toBe('8801081234567890');
  });

  it('menolak jika ID metode kosong atau tidak ditemukan', () => {
    expect(() => PengontrolTransaksi.dapatkanDetailMetodeDiMemori(daftarMetode, '   ')).toThrow(
      'ID metode pembayaran tidak valid',
    );
    expect(() =>
      PengontrolTransaksi.dapatkanDetailMetodeDiMemori(daftarMetode, 'METODE_TIDAK_ADA'),
    ).toThrow('Metode pembayaran tidak ditemukan');
  });
});

describe('PengontrolTransaksi.prosesPembayaranDummyDiMemori (UC09, Algo-3201, Algo-3202, Algo-3401)', () => {
  it('berhasil memproses pembayaran dummy, mencatat riwayat BERHASIL, dan mengubah status pesanan ke DIPROSES', () => {
    const hasil = PengontrolTransaksi.prosesPembayaranDummyDiMemori(
      daftarPesanan,
      daftarMetode,
      'ord-unpaid',
      'VA_BCA',
      250000,
    );

    expect(hasil.pesanan.id_pesanan).toBe('ord-unpaid');
    expect(hasil.pesanan.status_pembayaran).toBe('LUNAS');
    expect(hasil.pesanan.status_pesanan).toBe('DIPROSES');
    expect(hasil.pesanan.id_metode_pembayaran).toBe('VA_BCA');

    expect(hasil.transaksi.id_riwayat).toBeTruthy();
    expect(hasil.transaksi.id_pesanan).toBe('ord-unpaid');
    expect(hasil.transaksi.id_metode).toBe('VA_BCA');
    expect(hasil.transaksi.total_biaya).toBe(250000);
    expect(hasil.transaksi.status_transaksi).toBe('BERHASIL');
    expect(hasil.transaksi.metode_pembayaran?.nama_metode).toBe('BCA Virtual Account');
  });

  it('menolak jika parameter kosong, metode tidak valid, atau pesanan tidak ditemukan', () => {
    expect(() =>
      PengontrolTransaksi.prosesPembayaranDummyDiMemori(daftarPesanan, daftarMetode, '', 'VA_BCA'),
    ).toThrow('Parameter pembayaran tidak valid');
    expect(() =>
      PengontrolTransaksi.prosesPembayaranDummyDiMemori(
        daftarPesanan,
        daftarMetode,
        'ord-unpaid',
        'VA_PALSU',
      ),
    ).toThrow('Metode pembayaran tidak ditemukan');
    expect(() =>
      PengontrolTransaksi.prosesPembayaranDummyDiMemori(
        daftarPesanan,
        daftarMetode,
        'ord-404',
        'VA_BCA',
      ),
    ).toThrow('Pesanan tidak ditemukan');
  });

  it('menolak pembayaran ganda jika pesanan sudah lunas atau tidak berstatus MENUNGGU_PEMBAYARAN', () => {
    expect(() =>
      PengontrolTransaksi.prosesPembayaranDummyDiMemori(
        daftarPesanan,
        daftarMetode,
        'ord-paid-1',
        'VA_BCA',
        1200000,
      ),
    ).toThrow('Pesanan tidak dalam status menunggu pembayaran');
    expect(() =>
      PengontrolTransaksi.prosesPembayaranDummyDiMemori(
        daftarPesanan,
        daftarMetode,
        'ord-paid-2',
        'EWALLET_GOPAY',
        150000,
      ),
    ).toThrow('Pesanan tidak dalam status menunggu pembayaran');
  });

  it('menolak jika nominal pembayaran tidak sesuai dengan total biaya pesanan atau tidak valid', () => {
    expect(() =>
      PengontrolTransaksi.prosesPembayaranDummyDiMemori(
        daftarPesanan,
        daftarMetode,
        'ord-unpaid',
        'VA_BCA',
        100000,
      ),
    ).toThrow('Nominal pembayaran tidak sesuai dengan total biaya pesanan');
    expect(() =>
      PengontrolTransaksi.prosesPembayaranDummyDiMemori(
        daftarPesanan,
        daftarMetode,
        'ord-unpaid',
        'VA_BCA',
        -5000,
      ),
    ).toThrow('Nominal pembayaran tidak valid');
  });
});

describe('PengontrolTransaksi.ambilRiwayatTransaksiDiMemori & setPencairanDanaDiMemori', () => {
  it('menyaring riwayat transaksi berdasarkan peran pengguna_jasa dan penyedia_jasa terurut terbaru', () => {
    const riwayatU1 = PengontrolTransaksi.ambilRiwayatTransaksiDiMemori(
      daftarRiwayat,
      daftarPesanan,
      daftarMetode,
      'u1',
      'pengguna_jasa',
    );
    expect(riwayatU1).toHaveLength(1);
    expect(riwayatU1[0].id_riwayat).toBe('trx-1');
    expect(riwayatU1[0].pesanan?.total_biaya).toBe(1200000);
    expect(riwayatU1[0].metode_pembayaran?.nama_metode).toBe('BCA Virtual Account');

    const riwayatP1 = PengontrolTransaksi.ambilRiwayatTransaksiDiMemori(
      daftarRiwayat,
      daftarPesanan,
      daftarMetode,
      'p1',
      'penyedia_jasa',
    );
    expect(riwayatP1).toHaveLength(1);
    expect(riwayatP1[0].id_riwayat).toBe('trx-2');
  });

  it('menolak pengambilan riwayat jika id_pengguna kosong atau peran tidak valid', () => {
    expect(() =>
      PengontrolTransaksi.ambilRiwayatTransaksiDiMemori(
        daftarRiwayat,
        daftarPesanan,
        daftarMetode,
        '',
        'pengguna_jasa',
      ),
    ).toThrow('ID pengguna tidak valid');
    expect(() =>
      PengontrolTransaksi.ambilRiwayatTransaksiDiMemori(
        daftarRiwayat,
        daftarPesanan,
        daftarMetode,
        'u1',
        'admin' as 'pengguna_jasa',
      ),
    ).toThrow('Peran pengguna tidak valid');
  });

  it('mencairkan dana pesanan selesai yang sudah lunas dan menolak jika belum selesai, belum lunas, atau sudah dicairkan', () => {
    const dicairkan = PengontrolTransaksi.setPencairanDanaDiMemori(
      daftarPesanan,
      'ord-paid-2',
      true,
    );
    expect(dicairkan.status_pencairan).toBe(true);
    expect(dicairkan.waktu_pencairan).toBeTruthy();

    expect(() =>
      PengontrolTransaksi.setPencairanDanaDiMemori(daftarPesanan, 'ord-paid-2', false),
    ).toThrow('Pencairan dana hanya dapat dilakukan untuk pesanan selesai');

    expect(() =>
      PengontrolTransaksi.setPencairanDanaDiMemori(daftarPesanan, 'ord-unpaid', true),
    ).toThrow('Pencairan dana hanya dapat dilakukan untuk pesanan yang sudah lunas');

    expect(() =>
      PengontrolTransaksi.setPencairanDanaDiMemori(daftarPesanan, 'ord-paid-1', true),
    ).toThrow('Dana untuk pesanan ini sudah dicairkan sebelumnya');
  });
});

describe('PengontrolTransaksi Query Supabase (Filter Inner Join, Guard Double-Pay, Rollback & Pencairan)', () => {
  beforeEach(() => {
    mockCreateClient.mockReset();
  });

  it('ambilRiwayatTransaksi memfilter langsung di DB dengan pesanan!inner dan eq(pesanan.<kolom>, id_pengguna)', async () => {
    const mockOrder = vi.fn().mockResolvedValue({
      data: [{ ...daftarRiwayat[0], pesanan: daftarPesanan[1], metode_pembayaran: daftarMetode[0] }],
      error: null,
    });
    const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });
    mockCreateClient.mockResolvedValue({ from: mockFrom });

    const hasil = await PengontrolTransaksi.ambilRiwayatTransaksi('  u1  ', 'pengguna_jasa');

    expect(mockFrom).toHaveBeenCalledWith('riwayat_transaksi');
    expect(mockSelect).toHaveBeenCalledWith('*, pesanan!inner(*), metode_pembayaran(*)');
    expect(mockEq).toHaveBeenCalledWith('pesanan.id_pengguna_jasa', 'u1');
    expect(hasil).toHaveLength(1);
    expect(hasil[0].id_riwayat).toBe('trx-1');
  });

  it('prosesPembayaranDummy melakukan rollback kompensasi ke status awal jika insert riwayat_transaksi gagal', async () => {
    const rollbackEq = vi.fn().mockResolvedValue({ error: null });
    const updateCalls: Record<string, unknown>[] = [];

    mockCreateClient.mockResolvedValue({
      from: (table: string) => {
        if (table === 'metode_pembayaran') {
          return {
            select: () => ({
              eq: () => ({
                maybeSingle: vi.fn().mockResolvedValue({ data: daftarMetode[0], error: null }),
              }),
            }),
          };
        }
        if (table === 'pesanan') {
          return {
            select: () => ({
              eq: () => ({
                maybeSingle: vi.fn().mockResolvedValue({ data: daftarPesanan[0], error: null }),
              }),
            }),
            update: (payload: Record<string, unknown>) => {
              updateCalls.push(payload);
              if (updateCalls.length === 1) {
                return {
                  eq: () => ({
                    neq: (col: string, val: string) => {
                      expect(col).toBe('status_pembayaran');
                      expect(val).toBe('LUNAS');
                      return {
                        select: () => ({
                          maybeSingle: vi.fn().mockResolvedValue({
                            data: { ...daftarPesanan[0], ...payload },
                            error: null,
                          }),
                        }),
                      };
                    },
                  }),
                };
              }
              return { eq: rollbackEq };
            },
          };
        }
        if (table === 'riwayat_transaksi') {
          return {
            insert: () => ({
              select: () => ({
                single: vi.fn().mockResolvedValue({
                  data: null,
                  error: { message: 'Gagal menyimpan riwayat transaksi ke DB' },
                }),
              }),
            }),
          };
        }
        return {};
      },
    });

    await expect(
      PengontrolTransaksi.prosesPembayaranDummy('ord-unpaid', 'VA_BCA', 250000),
    ).rejects.toThrow('Gagal menyimpan riwayat transaksi ke DB');

    expect(updateCalls).toHaveLength(2);
    expect(updateCalls[1]).toMatchObject({
      status_pembayaran: 'MENUNGGU_PEMBAYARAN',
      status_pesanan: 'MENUNGGU_PEMBAYARAN',
      id_metode_pembayaran: null,
    });
    expect(rollbackEq).toHaveBeenCalledWith('id_pesanan', 'ord-unpaid');
  });

  it('setPencairanDana di DB menolak pesanan yang belum lunas atau sudah pernah dicairkan', async () => {
    mockCreateClient.mockResolvedValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            maybeSingle: vi.fn().mockResolvedValue({ data: daftarPesanan[0], error: null }),
          }),
        }),
      }),
    });

    await expect(PengontrolTransaksi.setPencairanDana('ord-unpaid', true)).rejects.toThrow(
      'Pencairan dana hanya dapat dilakukan untuk pesanan yang sudah lunas',
    );

    mockCreateClient.mockResolvedValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            maybeSingle: vi.fn().mockResolvedValue({ data: daftarPesanan[1], error: null }),
          }),
        }),
      }),
    });

    await expect(PengontrolTransaksi.setPencairanDana('ord-paid-1', true)).rejects.toThrow(
      'Dana untuk pesanan ini sudah dicairkan sebelumnya',
    );
  });
});

describe('HTTP Route Handlers /api/transaksi/dummy & /api/transaksi', () => {
  const prevMock = process.env.NEXT_PUBLIC_USE_MOCK;
  let snapshotPesanan: Pesanan[];
  let snapshotRiwayat: RiwayatTransaksi[];

  beforeEach(() => {
    process.env.NEXT_PUBLIC_USE_MOCK = 'true';
    snapshotPesanan = mockPesananTransaksiList.map((p) => ({ ...p }));
    snapshotRiwayat = [...mockRiwayatTransaksiList];
  });
  afterEach(() => {
    process.env.NEXT_PUBLIC_USE_MOCK = prevMock;
    mockPesananTransaksiList.length = 0;
    mockPesananTransaksiList.push(...snapshotPesanan);
    mockRiwayatTransaksiList.length = 0;
    mockRiwayatTransaksiList.push(...snapshotRiwayat);
  });

  it('POST /api/transaksi/dummy memproses pembayaran instan (201) dan menolak input salah / JSON rusak (400 / 404)', async () => {
    const resOk = await postPembayaranDummy(
      new Request('http://localhost/api/transaksi/dummy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_pesanan: mockPesananTransaksiList[0].id_pesanan,
          id_metode: 'VA_BCA',
          jumlah_bayar: 250000,
        }),
      }),
    );
    const jsonOk = await resOk.json();
    expect(resOk.status).toBe(201);
    expect(jsonOk.success).toBe(true);
    expect(jsonOk.data.pesanan.status_pesanan).toBe('DIPROSES');
    expect(jsonOk.data.pesanan.status_pembayaran).toBe('LUNAS');
    expect(jsonOk.data.transaksi.status_transaksi).toBe('BERHASIL');

    const resMalformedJson = await postPembayaranDummy(
      new Request('http://localhost/api/transaksi/dummy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{ invalid json',
      }),
    );
    const jsonMalformed = await resMalformedJson.json();
    expect(resMalformedJson.status).toBe(400);
    expect(jsonMalformed.error_code).toBe('VALIDATION_ERROR');

    const resSalahNominal = await postPembayaranDummy(
      new Request('http://localhost/api/transaksi/dummy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_pesanan: mockPesananTransaksiList[0].id_pesanan,
          id_metode: 'VA_BCA',
          jumlah_bayar: 999999,
        }),
      }),
    );
    expect(resSalahNominal.status).toBe(400);

    const resSudahLunas = await postPembayaranDummy(
      new Request('http://localhost/api/transaksi/dummy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_pesanan: mockPesananTransaksiList[1].id_pesanan,
          id_metode: 'VA_BCA',
          jumlah_bayar: 1200000,
        }),
      }),
    );
    expect(resSudahLunas.status).toBe(400);

    const resNotFound = await postPembayaranDummy(
      new Request('http://localhost/api/transaksi/dummy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_pesanan: 'pesanan-tidak-ada',
          id_metode: 'VA_BCA',
        }),
      }),
    );
    expect(resNotFound.status).toBe(404);
  });

  it('GET /api/transaksi mengembalikan metode pembayaran (200/404) dan riwayat transaksi pengguna (200/400)', async () => {
    const resMetodeList = await getTransaksi(
      new Request('http://localhost/api/transaksi?type=metode'),
    );
    const jsonMetodeList = await resMetodeList.json();
    expect(resMetodeList.status).toBe(200);
    expect(jsonMetodeList.data).toHaveLength(4);

    const resDetailMetode = await getTransaksi(
      new Request('http://localhost/api/transaksi?id_metode=VA_MANDIRI'),
    );
    const jsonDetailMetode = await resDetailMetode.json();
    expect(resDetailMetode.status).toBe(200);
    expect(jsonDetailMetode.data.nama_metode).toBe('Mandiri Virtual Account');

    const resRiwayatPengguna = await getTransaksi(
      new Request(`http://localhost/api/transaksi?id_pengguna_jasa=${PENGGUNA_JASA_1}`),
    );
    const jsonRiwayatPengguna = await resRiwayatPengguna.json();
    expect(resRiwayatPengguna.status).toBe(200);
    expect(jsonRiwayatPengguna.data).toHaveLength(1);
    expect(jsonRiwayatPengguna.data[0].total_biaya).toBe(1200000);

    const resRiwayatPenyedia = await getTransaksi(
      new Request(`http://localhost/api/transaksi?id_penyedia_jasa=${PENYEDIA_JASA_1}`),
    );
    const jsonRiwayatPenyedia = await resRiwayatPenyedia.json();
    expect(resRiwayatPenyedia.status).toBe(200);
    expect(jsonRiwayatPenyedia.data).toHaveLength(1);
    expect(jsonRiwayatPenyedia.data[0].id_pesanan).toBe(mockPesananTransaksiList[2].id_pesanan);

    const resTanpaId = await getTransaksi(new Request('http://localhost/api/transaksi'));
    expect(resTanpaId.status).toBe(400);
  });
});
