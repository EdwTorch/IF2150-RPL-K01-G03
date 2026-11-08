import { describe, it, expect } from 'vitest';
import type { Bookmark, Jasa } from '../models/types';
import { PengontrolBookmark } from '../services/bookmark.service';

const jasa = (o: Partial<Jasa> & Pick<Jasa, 'id_jasa'>): Jasa => ({
  id_penyedia_jasa: 'p1',
  nama_jasa: 'Jasa Uji',
  deskripsi: 'Deskripsi jasa uji',
  kategori: 'Desain Grafis',
  harga: 200000,
  rating_rata_rata: 4.7,
  status_aktif: true,
  created_at: '2026-11-01T00:00:00Z',
  ...o,
});

const daftarJasa: Jasa[] = [
  jasa({ id_jasa: 'j1', nama_jasa: 'Desain Logo', harga: 250000 }),
  jasa({ id_jasa: 'j2', nama_jasa: 'Edit Video', harga: 150000 }),
  jasa({ id_jasa: 'j3', nama_jasa: 'Landing Page', harga: 1200000 }),
  jasa({ id_jasa: 'j4', nama_jasa: 'Jasa Nonaktif', status_aktif: false }),
];

const daftarAwal: Bookmark[] = [
  {
    id_bookmark: 'b1',
    id_pengguna_jasa: 'u1',
    id_jasa: 'j1',
    waktu_disimpan: '2026-11-05T10:00:00Z',
  },
  {
    id_bookmark: 'b2',
    id_pengguna_jasa: 'u1',
    id_jasa: 'j3',
    waktu_disimpan: '2026-11-06T12:00:00Z',
  },
  {
    id_bookmark: 'b3',
    id_pengguna_jasa: 'u1',
    id_jasa: 'j4', // jasa nonaktif
    waktu_disimpan: '2026-11-07T08:00:00Z',
  },
  {
    id_bookmark: 'b4',
    id_pengguna_jasa: 'u2',
    id_jasa: 'j2',
    waktu_disimpan: '2026-11-06T09:00:00Z',
  },
];

describe('PengontrolBookmark.validasiInput (Algo-2201/2202/2203)', () => {
  it('menolak id_pengguna_jasa atau target kosong/spasi', () => {
    expect(() => PengontrolBookmark.validasiInput('', 'j1')).toThrow('Parameter input tidak valid');
    expect(() => PengontrolBookmark.validasiInput('   ', 'j1')).toThrow('Parameter input tidak valid');
    expect(() => PengontrolBookmark.validasiInput('u1', '')).toThrow('Parameter input tidak valid');
    expect(() => PengontrolBookmark.validasiInput('u1', '  ')).toThrow('Parameter input tidak valid');
  });

  it('mengizinkan target kosong bila wajib_target = false (Algo-2203)', () => {
    expect(() => PengontrolBookmark.validasiInput('u1', undefined, false)).not.toThrow();
  });
});

describe('PengontrolBookmark.daftarDariMemori (Algo-2203 / Q-2003)', () => {
  it('mengambil bookmark milik pengguna terurut waktu_disimpan DESC dan menyertakan detail jasa', () => {
    const hasil = PengontrolBookmark.daftarDariMemori(daftarAwal, daftarJasa, 'u1');
    expect(hasil.map((b) => b.id_jasa)).toEqual(['j3', 'j1']);
    expect(hasil[0].jasa?.nama_jasa).toBe('Landing Page');
    expect(hasil[1].jasa?.nama_jasa).toBe('Desain Logo');
  });

  it('menyembunyikan bookmark yang jasanya sudah nonaktif', () => {
    const hasil = PengontrolBookmark.daftarDariMemori(daftarAwal, daftarJasa, 'u1');
    expect(hasil.map((b) => b.id_jasa)).not.toContain('j4');
  });

  it('mengembalikan array kosong jika pengguna belum memiliki bookmark', () => {
    expect(PengontrolBookmark.daftarDariMemori(daftarAwal, daftarJasa, 'u-baru')).toEqual([]);
  });
});

describe('PengontrolBookmark.tambahKeMemori (Algo-2201 / Q-2001)', () => {
  it('berhasil menambahkan bookmark baru beserta objek jasa', () => {
    const baru = PengontrolBookmark.tambahKeMemori(daftarAwal, daftarJasa, 'u1', 'j2');
    expect(baru.id_bookmark).toBeTruthy();
    expect(baru.id_pengguna_jasa).toBe('u1');
    expect(baru.id_jasa).toBe('j2');
    expect(baru.jasa?.nama_jasa).toBe('Edit Video');
  });

  it('menolak jika jasa tidak ada atau nonaktif', () => {
    expect(() => PengontrolBookmark.tambahKeMemori(daftarAwal, daftarJasa, 'u1', 'j-tidak-ada')).toThrow(
      'Data jasa tidak ditemukan',
    );
    expect(() => PengontrolBookmark.tambahKeMemori(daftarAwal, daftarJasa, 'u2', 'j4')).toThrow(
      'Data jasa tidak ditemukan',
    );
  });

  it('menolak duplikasi bookmark pada pengguna dan jasa yang sama', () => {
    expect(() => PengontrolBookmark.tambahKeMemori(daftarAwal, daftarJasa, 'u1', 'j1')).toThrow('sudah ada');
  });
});

describe('PengontrolBookmark.hapusDariMemori (Algo-2202 / Q-2002)', () => {
  it('berhasil menghapus bookmark berdasarkan id_jasa maupun id_bookmark', () => {
    const sisaByJasa = PengontrolBookmark.hapusDariMemori(daftarAwal, 'u1', 'j1');
    expect(sisaByJasa.find((b) => b.id_bookmark === 'b1')).toBeUndefined();
    expect(sisaByJasa).toHaveLength(daftarAwal.length - 1);

    const sisaById = PengontrolBookmark.hapusDariMemori(daftarAwal, 'u1', 'b2');
    expect(sisaById.find((b) => b.id_bookmark === 'b2')).toBeUndefined();
  });

  it('melempar error jika bookmark yang dihapus tidak ditemukan atau milik pengguna lain', () => {
    expect(() => PengontrolBookmark.hapusDariMemori(daftarAwal, 'u1', 'j2')).toThrow('Data bookmark tidak ditemukan');
    expect(() => PengontrolBookmark.hapusDariMemori(daftarAwal, 'u2', 'b1')).toThrow('Data bookmark tidak ditemukan');
  });
});

describe('PengontrolBookmark.toggleDiMemori (I-06 O-05 & I-07 O-02)', () => {
  it('menambahkan saat belum ada, lalu menghapus saat dipanggil kembali', () => {
    const tambah = PengontrolBookmark.toggleDiMemori(daftarAwal, daftarJasa, 'u1', 'j2');
    expect(tambah.action).toBe('added');
    expect(tambah.data?.id_jasa).toBe('j2');

    const hapus = PengontrolBookmark.toggleDiMemori(tambah.daftar, daftarJasa, 'u1', 'j2');
    expect(hapus.action).toBe('removed');
    expect(hapus.data).toBeNull();
    expect(hapus.daftar.some((b) => b.id_pengguna_jasa === 'u1' && b.id_jasa === 'j2')).toBe(false);
  });
});
