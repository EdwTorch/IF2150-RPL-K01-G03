import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JasaController } from '../services/jasa.service';
import { mockJasaList } from '../lib/mocks/jasa.mock';
import * as JasaRoute from '../app/api/jasa/route';
import * as JasaDetailRoute from '../app/api/jasa/[id]/route';
import * as AuthService from '../services/auth.service';

const p = (id: string) => ({ params: Promise.resolve({ id }) });
const jsonReq = (url: string, method: string, body?: unknown) =>
  new Request(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

describe('1. JasaController Unit Test', () => {
  describe('validasiDataJasa', () => {
    it('mengembalikan true untuk data jasa yang lengkap dan valid', () => {
      const valid = JasaController.validasiDataJasa({
        id_penyedia_jasa: 'penyedia-1',
        nama_jasa: 'Desain Banner',
        deskripsi: 'Desain banner promosi digital',
        kategori: 'Desain Grafis',
        harga: 50000,
      });
      expect(valid).toBe(true);
    });

    it('mengembalikan false jika data bernilai undefined / null', () => {
      expect(JasaController.validasiDataJasa(undefined)).toBe(false);
    });

    it('mengembalikan false jika string hanya berisi spasi kosong', () => {
      expect(
        JasaController.validasiDataJasa({
          nama_jasa: '   ',
          deskripsi: 'Deskripsi valid',
          kategori: 'Kategori',
          harga: 50000,
        })
      ).toBe(false);

      expect(
        JasaController.validasiDataJasa({
          nama_jasa: 'Nama Valid',
          deskripsi: '   \n\t  ',
          kategori: 'Kategori',
          harga: 50000,
        })
      ).toBe(false);

      expect(
        JasaController.validasiDataJasa({
          nama_jasa: 'Nama Valid',
          deskripsi: 'Deskripsi valid',
          kategori: '',
          harga: 50000,
        })
      ).toBe(false);
    });

    it('mengembalikan false jika harga <= 0, NaN, atau Infinity', () => {
      const base = {
        nama_jasa: 'Jasa',
        deskripsi: 'Deskripsi',
        kategori: 'Kategori',
      };
      expect(JasaController.validasiDataJasa({ ...base, harga: 0 })).toBe(false);
      expect(JasaController.validasiDataJasa({ ...base, harga: -1000 })).toBe(false);
      expect(JasaController.validasiDataJasa({ ...base, harga: NaN })).toBe(false);
      expect(JasaController.validasiDataJasa({ ...base, harga: Infinity })).toBe(false);
      expect(JasaController.validasiDataJasa({ ...base, harga: undefined })).toBe(false);
    });
  });

  describe('validasiBerkas', () => {
    it('mengembalikan null jika seluruh berkas memiliki tipe dan ukuran valid', () => {
      const validFiles = [
        new File(['gambar'], 'logo.png', { type: 'image/png' }),
        new File(['dokumen'], 'brief.pdf', { type: 'application/pdf' }),
        new File(['video'], 'video.mp4', { type: 'video/mp4' }),
      ];
      expect(JasaController.validasiBerkas(validFiles)).toBeNull();
    });

    it('menolak berkas dengan tipe yang tidak didukung', () => {
      const invalidFiles = [new File(['script'], 'malware.exe', { type: 'application/x-msdownload' })];
      const error = JasaController.validasiBerkas(invalidFiles);
      expect(error).toMatch(/Format berkas malware.exe tidak didukung/);
    });

    it('menolak berkas yang melebihi ukuran maksimum 10 MB', () => {
      const besar = new Uint8Array(11 * 1024 * 1024);
      const fileBesar = new File([besar], 'file_besar.png', { type: 'image/png' });
      const error = JasaController.validasiBerkas([fileBesar]);
      expect(error).toMatch(/Ukuran berkas file_besar.png melebihi 10 MB/);
    });
  });

  describe('CRUD Jasa Controller Logic & Error Boundaries', () => {
    it('ambilDetailJasa melempar error jika ID tidak valid', async () => {
      await expect(JasaController.ambilDetailJasa('')).rejects.toThrow('ID Jasa tidak valid');
      await expect(JasaController.ambilDetailJasa('   ')).rejects.toThrow('ID Jasa tidak valid');
    });

    it('simpanPenawaranJasa melempar error jika data tidak valid', async () => {
      await expect(
        JasaController.simpanPenawaranJasa({
          id_penyedia_jasa: 'p-1',
          nama_jasa: '',
          deskripsi: 'd',
          kategori: 'k',
          harga: 5000,
        })
      ).rejects.toThrow('Data penawaran jasa tidak valid atau tidak lengkap');
    });

    it('perbaruiJasa melempar error jika payload pembaruan kosong', async () => {
      await expect(JasaController.perbaruiJasa('id-1', {})).rejects.toThrow(
        'Data pembaruan jasa tidak valid atau kosong'
      );
    });

    it('perbaruiJasa melempar error jika nilai pembaruan string kosong atau harga <= 0', async () => {
      await expect(JasaController.perbaruiJasa('id-1', { nama_jasa: '   ' })).rejects.toThrow(
        'Nama jasa tidak valid atau kosong'
      );
      await expect(JasaController.perbaruiJasa('id-1', { harga: -500 })).rejects.toThrow(
        'Harga harus lebih dari 0'
      );
      await expect(JasaController.perbaruiJasa('id-1', { harga: NaN })).rejects.toThrow(
        'Harga harus lebih dari 0'
      );
    });

    it('hapusJasa melempar error jika ID tidak valid', async () => {
      await expect(JasaController.hapusJasa('')).rejects.toThrow('ID Jasa tidak valid');
    });
  });
});

describe('2. Route Handlers /api/jasa (Mock Mode)', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_USE_MOCK = 'true';
    vi.restoreAllMocks();
  });

  it('GET /api/jasa mengambil daftar penawaran jasa', async () => {
    const res = await JasaRoute.GET(new Request('http://localhost:3000/api/jasa'));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
  });

  it('GET /api/jasa/[id] mengembalikan detail jasa jika ID ditemukan', async () => {
    const target = mockJasaList[0];
    const res = await JasaDetailRoute.GET(new Request('http://localhost:3000/api/jasa/' + target.id_jasa), p(target.id_jasa));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.id_jasa).toBe(target.id_jasa);
  });

  it('GET /api/jasa/[id] mengembalikan 404 NOT_FOUND jika ID tidak ada', async () => {
    const res = await JasaDetailRoute.GET(new Request('http://localhost:3000/api/jasa/unknown-id'), p('unknown-id'));
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.success).toBe(false);
    expect(json.error_code).toBe('NOT_FOUND');
  });

  it('POST /api/jasa mengembalikan 400 jika body JSON rusak (SyntaxError)', async () => {
    const req = new Request('http://localhost:3000/api/jasa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"invalid_json":',
    });
    const res = await JasaRoute.POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error_code).toBe('VALIDATION_ERROR');
    expect(json.message).toContain('Format body JSON tidak valid');
  });

  it('POST /api/jasa memutasi mockJasaList dan mengembalikan 201', async () => {
    const initialCount = mockJasaList.length;
    const newJasa = {
      id_penyedia_jasa: 'penyedia-test',
      nama_jasa: 'Jasa Desain Brosur',
      deskripsi: 'Desain brosur digital A4',
      kategori: 'Desain Grafis',
      harga: 175000,
    };

    const res = await JasaRoute.POST(jsonReq('http://localhost:3000/api/jasa', 'POST', newJasa));
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.data.id_jasa).toBeDefined();
    expect(mockJasaList.length).toBe(initialCount + 1);
    expect(mockJasaList[0].nama_jasa).toBe('Jasa Desain Brosur');
  });

  it('PATCH /api/jasa/[id] memutasi mockJasaList secara in-memory', async () => {
    const target = mockJasaList[0];
    const updatePayload = {
      nama_jasa: 'Nama Jasa Telah Diubah',
      harga: 320000,
    };

    const res = await JasaDetailRoute.PATCH(
      jsonReq(`http://localhost:3000/api/jasa/${target.id_jasa}`, 'PATCH', updatePayload),
      p(target.id_jasa)
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.nama_jasa).toBe('Nama Jasa Telah Diubah');
    expect(json.data.harga).toBe(320000);

    const found = mockJasaList.find((j) => j.id_jasa === target.id_jasa);
    expect(found?.nama_jasa).toBe('Nama Jasa Telah Diubah');
    expect(found?.harga).toBe(320000);
  });

  it('DELETE /api/jasa/[id] mengubah status_aktif menjadi false pada mockJasaList', async () => {
    const target = mockJasaList.find((j) => j.status_aktif === true);
    expect(target).toBeDefined();

    const res = await JasaDetailRoute.DELETE(
      new Request(`http://localhost:3000/api/jasa/${target!.id_jasa}`, { method: 'DELETE' }),
      p(target!.id_jasa)
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);

    const found = mockJasaList.find((j) => j.id_jasa === target!.id_jasa);
    expect(found?.status_aktif).toBe(false);
  });
});

describe('3. Route Handlers Security (Non-Mock Mode)', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_USE_MOCK = 'false';
    vi.restoreAllMocks();
  });

  it('POST /api/jasa mengembalikan 401 UNAUTHORIZED jika belum login', async () => {
    vi.spyOn(AuthService, 'getSessionUser').mockResolvedValueOnce(null);

    const res = await JasaRoute.POST(
      jsonReq('http://localhost:3000/api/jasa', 'POST', {
        nama_jasa: 'Testing',
        deskripsi: 'Deskripsi',
        kategori: 'Kategori',
        harga: 50000,
      })
    );
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.success).toBe(false);
    expect(json.error_code).toBe('UNAUTHORIZED');
  });

  it('POST /api/jasa mengembalikan 403 FORBIDDEN jika bukan penyedia jasa', async () => {
    vi.spyOn(AuthService, 'getSessionUser').mockResolvedValueOnce({
      id: 'user-regular',
      email: 'user@test.com',
      nama: 'User Biasa',
      role: 'USER',
      status_akun: true,
      isPenyediaJasa: false,
      isPenggunaJasa: true,
    });

    const res = await JasaRoute.POST(
      jsonReq('http://localhost:3000/api/jasa', 'POST', {
        nama_jasa: 'Testing',
        deskripsi: 'Deskripsi',
        kategori: 'Kategori',
        harga: 50000,
      })
    );
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.success).toBe(false);
    expect(json.error_code).toBe('FORBIDDEN');
    expect(json.message).toContain('Hanya penyedia jasa');
  });

  it('POST /api/jasa mengembalikan 403 FORBIDDEN jika mencoba upload atas nama penyedia lain', async () => {
    vi.spyOn(AuthService, 'getSessionUser').mockResolvedValueOnce({
      id: 'user-penyedia-asli',
      email: 'penyedia@test.com',
      nama: 'Penyedia Asli',
      role: 'USER',
      status_akun: true,
      isPenyediaJasa: true,
      isPenggunaJasa: true,
    });

    const res = await JasaRoute.POST(
      jsonReq('http://localhost:3000/api/jasa', 'POST', {
        id_penyedia_jasa: 'penyedia-orang-lain',
        nama_jasa: 'Testing Jasa',
        deskripsi: 'Deskripsi',
        kategori: 'Kategori',
        harga: 50000,
      })
    );
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.success).toBe(false);
    expect(json.error_code).toBe('FORBIDDEN');
  });

  it('PATCH /api/jasa/[id] mengembalikan 403 FORBIDDEN jika bukan pemilik jasa', async () => {
    vi.spyOn(AuthService, 'getSessionUser').mockResolvedValueOnce({
      id: 'penyedia-bukan-pemilik',
      email: 'p2@test.com',
      nama: 'Penyedia 2',
      role: 'USER',
      status_akun: true,
      isPenyediaJasa: true,
      isPenggunaJasa: false,
    });

    vi.spyOn(JasaController, 'ambilDetailJasa').mockResolvedValueOnce({
      id_jasa: 'jasa-milik-orang',
      id_penyedia_jasa: 'penyedia-pemilik-asli',
      nama_jasa: 'Jasa Orang',
      deskripsi: 'Deskripsi',
      kategori: 'Kategori',
      harga: 100000,
    });

    const res = await JasaDetailRoute.PATCH(
      jsonReq('http://localhost:3000/api/jasa/jasa-milik-orang', 'PATCH', { harga: 200000 }),
      p('jasa-milik-orang')
    );
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.success).toBe(false);
    expect(json.error_code).toBe('FORBIDDEN');
    expect(json.message).toContain('bukan pemilik');
  });

  it('DELETE /api/jasa/[id] mengembalikan 403 FORBIDDEN jika bukan pemilik jasa', async () => {
    vi.spyOn(AuthService, 'getSessionUser').mockResolvedValueOnce({
      id: 'penyedia-bukan-pemilik',
      email: 'p2@test.com',
      nama: 'Penyedia 2',
      role: 'USER',
      status_akun: true,
      isPenyediaJasa: true,
      isPenggunaJasa: false,
    });

    vi.spyOn(JasaController, 'ambilDetailJasa').mockResolvedValueOnce({
      id_jasa: 'jasa-milik-orang',
      id_penyedia_jasa: 'penyedia-pemilik-asli',
      nama_jasa: 'Jasa Orang',
      deskripsi: 'Deskripsi',
      kategori: 'Kategori',
      harga: 100000,
    });

    const res = await JasaDetailRoute.DELETE(
      new Request('http://localhost:3000/api/jasa/jasa-milik-orang', { method: 'DELETE' }),
      p('jasa-milik-orang')
    );
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.success).toBe(false);
    expect(json.error_code).toBe('FORBIDDEN');
  });
});
