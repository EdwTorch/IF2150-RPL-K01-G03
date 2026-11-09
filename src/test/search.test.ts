import { describe, it, expect } from 'vitest';
import type { Jasa } from '../models/types';
import { LayananPembandingJasa, LayananPencarian } from '../services/pencarian.service';

const jasa = (o: Partial<Jasa> & Pick<Jasa, 'id_jasa'>): Jasa => ({
  id_penyedia_jasa: 'p1',
  nama_jasa: 'Jasa',
  deskripsi: 'deskripsi',
  kategori: 'Desain Grafis',
  harga: 100000,
  rating_rata_rata: 0,
  status_aktif: true,
  created_at: '2026-11-01T00:00:00Z',
  ...o,
});

const data: Jasa[] = [
  jasa({ id_jasa: 'a', nama_jasa: 'Desain Logo', harga: 250000, rating_rata_rata: 4.8, created_at: '2026-11-01T00:00:00Z' }),
  jasa({ id_jasa: 'b', nama_jasa: 'Edit Video', deskripsi: 'bisa bonus logo animasi', kategori: 'Video', harga: 150000, rating_rata_rata: 4.5, created_at: '2026-11-02T00:00:00Z' }),
  jasa({ id_jasa: 'c', nama_jasa: 'Landing Page', kategori: 'Pemrograman', harga: 1200000, rating_rata_rata: 4.9, created_at: '2026-11-03T00:00:00Z' }),
  jasa({ id_jasa: 'd', nama_jasa: 'Logo Nonaktif', harga: 100000, status_aktif: false, created_at: '2026-11-04T00:00:00Z' }),
];
const ids = (l: Jasa[]) => l.map((j) => j.id_jasa);

describe('LayananPencarian.validasiFilter (Algo-1701/1702)', () => {
  it('menolak keyword < 3 karakter', () => {
    expect(() => LayananPencarian.validasiFilter({ keyword: 'ab' })).toThrow('Minimal 3 karakter');
  });
  it('menerima keyword kosong/undefined', () => {
    expect(() => LayananPencarian.validasiFilter({})).not.toThrow();
    expect(() => LayananPencarian.validasiFilter({ keyword: '  ' })).not.toThrow();
  });
  it('menolak rentang harga/rating tidak sah', () => {
    expect(() => LayananPencarian.validasiFilter({ harga_min: 500, harga_max: 100 })).toThrow('Rentang harga');
    expect(() => LayananPencarian.validasiFilter({ harga_min: -1 })).toThrow('Rentang harga');
    expect(() => LayananPencarian.validasiFilter({ harga_min: NaN })).toThrow('angka');
    expect(() => LayananPencarian.validasiFilter({ rating_min: 6 })).toThrow('Rentang rating');
    expect(() => LayananPencarian.validasiFilter({ rating_max: 6 })).toThrow('Rentang rating');
    expect(() => LayananPencarian.validasiFilter({ rating_min: 4, rating_max: 3 })).toThrow('Rentang rating');
  });
  it('menolak urutan tidak dikenal', () => {
    expect(() => LayananPencarian.validasiFilter({ urutkan: 'acak' as never })).toThrow('Urutan');
  });
});

describe('LayananPencarian.saringDanUrutkan', () => {
  it('mengabaikan jasa nonaktif', () => {
    expect(ids(LayananPencarian.saringDanUrutkan(data))).not.toContain('d');
  });
  it('keyword cocok di nama atau deskripsi (case-insensitive), nama diutamakan', () => {
    expect(ids(LayananPencarian.saringDanUrutkan(data, { keyword: 'LOGO' }))).toEqual(['a', 'b']);
  });
  it('filter kategori', () => {
    expect(ids(LayananPencarian.saringDanUrutkan(data, { kategori: 'pemrograman' }))).toEqual(['c']);
  });
  it('filter harga min-max (inklusif)', () => {
    expect(ids(LayananPencarian.saringDanUrutkan(data, { harga_min: 150000, harga_max: 250000, urutkan: 'harga_asc' }))).toEqual(['b', 'a']);
  });
  it('filter rating minimum', () => {
    expect(ids(LayananPencarian.saringDanUrutkan(data, { rating_min: 4.8, urutkan: 'rating_desc' }))).toEqual(['c', 'a']);
  });
  it('sorting harga_asc, harga_desc, rating_desc, terbaru (default)', () => {
    expect(ids(LayananPencarian.saringDanUrutkan(data, { urutkan: 'harga_asc' }))).toEqual(['b', 'a', 'c']);
    expect(ids(LayananPencarian.saringDanUrutkan(data, { urutkan: 'harga_desc' }))).toEqual(['c', 'a', 'b']);
    expect(ids(LayananPencarian.saringDanUrutkan(data, { urutkan: 'rating_desc' }))).toEqual(['c', 'a', 'b']);
    expect(ids(LayananPencarian.saringDanUrutkan(data))).toEqual(['c', 'b', 'a']);
  });
  it('membatasi hasil (default 20, bisa diubah)', () => {
    expect(LayananPencarian.saringDanUrutkan(data, { limit: 2 })).toHaveLength(2);
    const banyak = Array.from({ length: 30 }, (_, i) => jasa({ id_jasa: `x${i}` }));
    expect(LayananPencarian.saringDanUrutkan(banyak)).toHaveLength(20);
  });
  it('mengembalikan array kosong jika tidak ada yang cocok', () => {
    expect(LayananPencarian.saringDanUrutkan(data, { keyword: 'tidakada' })).toEqual([]);
  });
});

describe('LayananPembandingJasa.susunMatriks (Algo-1801)', () => {
  it('menghitung ringkasan perbandingan 3 jasa', () => {
    const r = LayananPembandingJasa.susunMatriks(data, ['a', 'b', 'c']);
    expect(ids(r.jasa)).toEqual(['a', 'b', 'c']);
    expect(r.ringkasan).toEqual({
      id_termurah: 'b',
      id_termahal: 'c',
      selisih_harga: 1050000,
      id_rating_tertinggi: 'c',
    });
  });
  it('menolak < 2 ID unik', () => {
    expect(() => LayananPembandingJasa.susunMatriks(data, ['a'])).toThrow('Minimal 2 ID');
    expect(() => LayananPembandingJasa.susunMatriks(data, ['a', 'a'])).toThrow('Minimal 2 ID');
  });
  it('menolak ID tidak ditemukan atau nonaktif', () => {
    expect(() => LayananPembandingJasa.susunMatriks(data, ['a', 'zzz'])).toThrow('tidak ditemukan');
    expect(() => LayananPembandingJasa.susunMatriks(data, ['a', 'd'])).toThrow('tidak aktif');
  });
});
