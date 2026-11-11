import { describe, it, expect } from 'vitest';
import {
  validasiInputRegistrasi,
  MIN_PANJANG_PASSWORD,
  type InputRegistrasi,
} from '../services/auth.service';

const inputValid: InputRegistrasi = {
  nama: 'Budi Santoso',
  email: 'budi@example.com',
  password: 'password123',
  role: 'pengguna_jasa',
};

describe('validasiInputRegistrasi (AC-2: Validasi Input)', () => {
  it('menerima input yang valid tanpa melempar error', () => {
    expect(() => validasiInputRegistrasi(inputValid)).not.toThrow();
    expect(() => validasiInputRegistrasi({ ...inputValid, role: 'penyedia_jasa' })).not.toThrow();
  });

  it('menolak nama kosong atau hanya spasi', () => {
    expect(() => validasiInputRegistrasi({ ...inputValid, nama: '' })).toThrow('Nama');
    expect(() => validasiInputRegistrasi({ ...inputValid, nama: '   ' })).toThrow('Nama');
  });

  it('menolak email kosong', () => {
    expect(() => validasiInputRegistrasi({ ...inputValid, email: '' })).toThrow('Email');
  });

  it('menolak format email tidak valid', () => {
    expect(() => validasiInputRegistrasi({ ...inputValid, email: 'bukan-email' })).toThrow('Format email');
    expect(() => validasiInputRegistrasi({ ...inputValid, email: 'a@b' })).toThrow('Format email');
    expect(() => validasiInputRegistrasi({ ...inputValid, email: '@domain.com' })).toThrow('Format email');
  });

  it('menolak password kurang dari panjang minimum', () => {
    const pendek = 'x'.repeat(MIN_PANJANG_PASSWORD - 1);
    expect(() => validasiInputRegistrasi({ ...inputValid, password: pendek })).toThrow(
      `${MIN_PANJANG_PASSWORD} karakter`
    );
  });

  it('menerima password tepat di batas minimum', () => {
    const pas = 'x'.repeat(MIN_PANJANG_PASSWORD);
    expect(() => validasiInputRegistrasi({ ...inputValid, password: pas })).not.toThrow();
  });

  it('menolak role yang tidak dikenal', () => {
    expect(() =>
      validasiInputRegistrasi({ ...inputValid, role: 'admin' as never })
    ).toThrow('Role');
  });
});
