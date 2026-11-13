import { describe, it, expect } from 'vitest';
import { PengontrolPortofolio } from '../services/portofolio.service';

describe('PengontrolPortofolio', () => {
  it('validasiInputBerkas: menolak jika judul atau berkas kosong (Algo-1001)', () => {
    expect(PengontrolPortofolio.validasiInputBerkas(null)).toBe(false);
    expect(PengontrolPortofolio.validasiInputBerkas({ judul: '', berkas_pendukung: '/a.png' })).toBe(false);
    expect(PengontrolPortofolio.validasiInputBerkas({ judul: 'Logo', berkas_pendukung: '' })).toBe(false);
    expect(PengontrolPortofolio.validasiInputBerkas({ judul: 'Logo', berkas_pendukung: 'javascript:alert(1)' })).toBe(false);
    expect(PengontrolPortofolio.validasiInputBerkas({ judul: 'Logo', berkas_pendukung: '/uploads/portofolio/a.png' })).toBe(true);
  });

  it('rapikanDaftar: buang baris kosong & duplikat', () => {
    expect(PengontrolPortofolio.rapikanDaftar(['  A ', '', 'A', 'B'])).toEqual(['A', 'B']);
    expect(PengontrolPortofolio.rapikanDaftar('A\n\nB')).toEqual(['A', 'B']);
    expect(PengontrolPortofolio.rapikanDaftar(123)).toEqual([]);
  });

  it('simpanDiMemori: karya baru di urutan pertama, pengalaman diperbarui', () => {
    const hasil = PengontrolPortofolio.simpanDiMemori(
      { pengalaman: ['lama'], prestasi: [], daftar_karya: [] },
      'penyedia-1',
      { judul: 'Logo', berkas_pendukung: '/a.png', pengalaman: ['baru'] },
    );
    expect(hasil.daftar_karya[0].judul).toBe('Logo');
    expect(hasil.pengalaman).toEqual(['baru']);
    expect(hasil.prestasi).toEqual([]);
  });

  it('normalisasiInput: judul terlalu panjang ditolak', () => {
    expect(() =>
      PengontrolPortofolio.normalisasiInput({ judul: 'x'.repeat(256), berkas_pendukung: '/a.png' }),
    ).toThrow(/maksimal/);
  });
});