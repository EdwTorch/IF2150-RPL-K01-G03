import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JasaController } from '../services/jasa.service';
import { mockJasaList } from '../lib/mocks/jasa.mock';
import * as JasaRoute from '../app/api/jasa/route';
import * as JasaDetailRoute from '../app/api/jasa/[id]/route';
import * as AuthService from '../services/auth.service';
import { bacaInputJasa, responsGagal } from '../app/api/jasa/helper';

let mockSupabaseResponse: { data: unknown; error: unknown } = { data: null, error: null };
let mockStorageUploadResult: { url: string; error?: string } = { url: 'https://example.com/file.jpg' };
const mockStorageDelete = vi.fn().mockResolvedValue(true);

const createMockSupabase = () => {
  const q: Record<string, unknown> = {};
  q.select = vi.fn().mockReturnValue(q);
  q.eq = vi.fn().mockReturnValue(q);
  q.order = vi.fn().mockImplementation(() => Promise.resolve(mockSupabaseResponse));
  q.maybeSingle = vi.fn().mockImplementation(() => Promise.resolve(mockSupabaseResponse));
  q.single = vi.fn().mockImplementation(() => Promise.resolve(mockSupabaseResponse));
  q.insert = vi.fn().mockReturnValue(q);
  q.update = vi.fn().mockReturnValue(q);
  return {
    from: vi.fn().mockReturnValue(q),
  };
};

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => createMockSupabase()),
}));

vi.mock('@/services/storage', () => ({
  getStorageService: vi.fn(() => ({
    upload: vi.fn(async () => mockStorageUploadResult),
    delete: mockStorageDelete,
  })),
}));

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

  describe('JasaController Operasi Database & Berkas (C12, C14)', () => {
    it('ambilSemuaJasa mengembalikan daftar jasa aktif terurut created_at desc', async () => {
      mockSupabaseResponse = {
        data: [{ id_jasa: 'j1', nama_jasa: 'Jasa Desain', status_aktif: true }],
        error: null,
      };
      const res = await JasaController.ambilSemuaJasa();
      expect(res).toHaveLength(1);
      expect(res[0].id_jasa).toBe('j1');
    });

    it('ambilSemuaJasa melempar error jika supabase error', async () => {
      mockSupabaseResponse = { data: null, error: { message: 'Database failure' } };
      await expect(JasaController.ambilSemuaJasa()).rejects.toThrow('Database failure');
    });

    it('ambilDetailJasa melempar error untuk ID kosong atau tidak ditemukan', async () => {
      await expect(JasaController.ambilDetailJasa('')).rejects.toThrow('ID Jasa tidak valid');
      await expect(JasaController.ambilDetailJasa('   ')).rejects.toThrow('ID Jasa tidak valid');

      mockSupabaseResponse = { data: null, error: null };
      await expect(JasaController.ambilDetailJasa('j999')).rejects.toThrow('Data jasa tidak ditemukan');

      mockSupabaseResponse = { data: null, error: { message: 'DB Error' } };
      await expect(JasaController.ambilDetailJasa('j1')).rejects.toThrow('DB Error');
    });

    it('ambilDetailJasa sukses mengembalikan data jasa', async () => {
      mockSupabaseResponse = {
        data: { id_jasa: 'j1', nama_jasa: 'Desain Logo', harga: 150000 },
        error: null,
      };
      const res = await JasaController.ambilDetailJasa('j1');
      expect(res.id_jasa).toBe('j1');
      expect(res.nama_jasa).toBe('Desain Logo');
    });

    it('validasiBerkas menolak tipe berkas tidak didukung atau ukuran melebihi 10MB', () => {
      const fileSalahTipe = new File(['konten'], 'script.exe', { type: 'application/x-msdownload' });
      expect(JasaController.validasiBerkas([fileSalahTipe])).toContain('tidak didukung');

      const fileBesar = new File(['x'.repeat(100)], 'gambar.png', { type: 'image/png' });
      Object.defineProperty(fileBesar, 'size', { value: 11 * 1024 * 1024 });
      expect(JasaController.validasiBerkas([fileBesar])).toContain('melebihi 10 MB');

      const fileValid = new File(['konten'], 'gambar.jpg', { type: 'image/jpeg' });
      expect(JasaController.validasiBerkas([fileValid])).toBeNull();
    });

    it('unggahBerkas melempar error jika ada berkas gagal upload atau format tidak valid', async () => {
      const fileSalah = new File(['konten'], 'doc.txt', { type: 'text/plain' });
      await expect(JasaController.unggahBerkas([fileSalah])).rejects.toThrow('tidak didukung');

      const fileValid = new File(['konten'], 'gambar.png', { type: 'image/png' });
      mockStorageUploadResult = { url: '', error: 'Gagal upload ke bucket' };
      await expect(JasaController.unggahBerkas([fileValid])).rejects.toThrow('Gagal upload ke bucket');

      mockStorageUploadResult = { url: 'https://example.com/jasa/gambar.png' };
      const urls = await JasaController.unggahBerkas([fileValid]);
      expect(urls).toEqual(['https://example.com/jasa/gambar.png']);
    });

    it('simpanPenawaranJasa melempar error jika data tidak valid', async () => {
      await expect(
        JasaController.simpanPenawaranJasa({
          id_penyedia_jasa: 'p1',
          nama_jasa: '',
          deskripsi: 'desk',
          kategori: 'kat',
          harga: 50000,
        })
      ).rejects.toThrow('Data penawaran jasa tidak valid');
    });

    it('simpanPenawaranJasa berhasil menyimpan ke database dan membersihkan berkas jika error', async () => {
      mockSupabaseResponse = {
        data: {
          id_jasa: 'j-new',
          id_penyedia_jasa: 'p1',
          nama_jasa: 'Jasa Baru',
          deskripsi: 'Deskripsi',
          kategori: 'Kategori',
          harga: 100000,
          berkas_pendukung: ['https://example.com/file.jpg'],
          status_aktif: true,
        },
        error: null,
      };
      mockStorageUploadResult = { url: 'https://example.com/file.jpg' };
      const file = new File(['img'], 'file.jpg', { type: 'image/jpeg' });

      const hasil = await JasaController.simpanPenawaranJasa(
        {
          id_penyedia_jasa: 'p1',
          nama_jasa: 'Jasa Baru',
          deskripsi: 'Deskripsi',
          kategori: 'Kategori',
          harga: 100000,
        },
        [file]
      );
      expect(hasil.id_jasa).toBe('j-new');

      mockSupabaseResponse = { data: null, error: { message: 'Insert failed' } };
      await expect(
        JasaController.simpanPenawaranJasa(
          {
            id_penyedia_jasa: 'p1',
            nama_jasa: 'Jasa Baru',
            deskripsi: 'Deskripsi',
            kategori: 'Kategori',
            harga: 100000,
          },
          [file]
        )
      ).rejects.toThrow('Insert failed');
      expect(mockStorageDelete).toHaveBeenCalled();
    });

    it('perbaruiJasa memvalidasi kolom-kolom input pembaruan', async () => {
      await expect(JasaController.perbaruiJasa('', {})).rejects.toThrow('ID Jasa tidak valid');
      await expect(JasaController.perbaruiJasa('j1', { nama_jasa: '  ' })).rejects.toThrow('Nama jasa');
      await expect(JasaController.perbaruiJasa('j1', { deskripsi: '  ' })).rejects.toThrow('Deskripsi jasa');
      await expect(JasaController.perbaruiJasa('j1', { kategori: '  ' })).rejects.toThrow('Kategori jasa');
      await expect(JasaController.perbaruiJasa('j1', { harga: -100 })).rejects.toThrow('Harga');
      await expect(JasaController.perbaruiJasa('j1', {})).rejects.toThrow('kosong');
    });

    it('perbaruiJasa sukses memperbarui data dan mengunggah berkas baru', async () => {
      mockSupabaseResponse = {
        data: {
          id_jasa: 'j1',
          id_penyedia_jasa: 'p1',
          nama_jasa: 'Jasa Lama',
          deskripsi: 'Deskripsi',
          kategori: 'Kategori',
          harga: 100000,
          berkas_pendukung: ['https://example.com/old.jpg'],
        },
        error: null,
      };

      const fileBaru = new File(['konten'], 'new.png', { type: 'image/png' });
      mockStorageUploadResult = { url: 'https://example.com/new.png' };

      const hasil = await JasaController.perbaruiJasa(
        'j1',
        { nama_jasa: 'Jasa Terupdate', harga: 150000 },
        [fileBaru]
      );
      expect(hasil).toBeDefined();

      mockSupabaseResponse = { data: null, error: { message: 'Update error' } };
      await expect(
        JasaController.perbaruiJasa('j1', { nama_jasa: 'Gagal' }, [fileBaru])
      ).rejects.toThrow();

      mockSupabaseResponse = { data: null, error: null };
      await expect(
        JasaController.perbaruiJasa('j1', { nama_jasa: 'NotFound' })
      ).rejects.toThrow('Data jasa tidak ditemukan');
    });

    it('hapusJasa melakukan soft delete dengan benar', async () => {
      await expect(JasaController.hapusJasa('')).rejects.toThrow('ID Jasa tidak valid');

      mockSupabaseResponse = { data: { id_jasa: 'j1' }, error: null };
      await expect(JasaController.hapusJasa('j1')).resolves.not.toThrow();

      mockSupabaseResponse = { data: null, error: { message: 'DB Error' } };
      await expect(JasaController.hapusJasa('j1')).rejects.toThrow('Gagal menonaktifkan penawaran jasa');

      mockSupabaseResponse = { data: null, error: null };
      await expect(JasaController.hapusJasa('j1')).rejects.toThrow('Data jasa tidak ditemukan');
    });
  });

  describe('bacaInputJasa & responsGagal Helper Test', () => {
    it('bacaInputJasa membaca multipart/form-data dengan benar', async () => {
      const formData = new FormData();
      formData.append('nama_jasa', 'Desain Website');
      formData.append('harga', '250000');
      formData.append('status_aktif', 'true');
      const file = new File(['konten-gambar'], 'sample.jpg', { type: 'image/jpeg' });
      formData.append('berkas', file);

      const req = new Request('http://localhost/api/jasa', {
        method: 'POST',
        body: formData,
      });

      const res = await bacaInputJasa(req);
      expect(res.data.nama_jasa).toBe('Desain Website');
      expect(res.data.harga).toBe(250000);
      expect(res.data.status_aktif).toBe(true);
      expect(res.berkas).toHaveLength(1);
    });

    it('bacaInputJasa melempar error jika body JSON tidak valid', async () => {
      const req = new Request('http://localhost/api/jasa', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: 'invalid-json{{{',
      });
      await expect(bacaInputJasa(req)).rejects.toThrow('Format body JSON tidak valid');
    });

    it('responsGagal mengembalikan status 500 DATABASE_ERROR untuk error yang tidak tercakup regex', () => {
      const res = responsGagal(new Error('Koneksi timeout pada socket'));
      expect(res.status).toBe(500);
    });
  });

  describe('Route Handlers Integrasi Non-Mock', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_USE_MOCK = 'false';
    });

    it('POST /api/jasa melempar 401 jika session user null', async () => {
      vi.spyOn(AuthService, 'getSessionUser').mockResolvedValueOnce(null);
      const res = await JasaRoute.POST(
        jsonReq('http://localhost/api/jasa', 'POST', {
          nama_jasa: 'Logo',
          deskripsi: 'Deskripsi',
          kategori: 'Desain',
          harga: 50000,
        })
      );
      expect(res.status).toBe(401);
    });

    it('POST /api/jasa melempar 400 jika data jasa tidak valid pada mode non-mock', async () => {
      vi.spyOn(AuthService, 'getSessionUser').mockResolvedValueOnce({
        id: 'penyedia-1',
        email: 'p1@test.com',
        nama: 'Penyedia 1',
        role: 'PENYEDIA_JASA',
        status_akun: true,
        isPenyediaJasa: true,
        isPenggunaJasa: false,
      });

      const res = await JasaRoute.POST(
        jsonReq('http://localhost/api/jasa', 'POST', {
          nama_jasa: '',
          deskripsi: 'Deskripsi',
          kategori: 'Desain',
          harga: 50000,
        })
      );
      expect(res.status).toBe(400);
    });

    it('POST /api/jasa sukses membuat jasa pada mode non-mock', async () => {
      vi.spyOn(AuthService, 'getSessionUser').mockResolvedValueOnce({
        id: 'penyedia-1',
        email: 'p1@test.com',
        nama: 'Penyedia 1',
        role: 'PENYEDIA_JASA',
        status_akun: true,
        isPenyediaJasa: true,
        isPenggunaJasa: false,
      });

      mockSupabaseResponse = {
        data: {
          id_jasa: 'jasa-baru',
          id_penyedia_jasa: 'penyedia-1',
          nama_jasa: 'Logo Pro',
          deskripsi: 'Deskripsi',
          kategori: 'Desain',
          harga: 50000,
          berkas_pendukung: [],
          status_aktif: true,
        },
        error: null,
      };

      const res = await JasaRoute.POST(
        jsonReq('http://localhost/api/jasa', 'POST', {
          nama_jasa: 'Logo Pro',
          deskripsi: 'Deskripsi',
          kategori: 'Desain',
          harga: 50000,
        })
      );
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.id_jasa).toBe('jasa-baru');
    });

    it('GET /api/jasa/[id] sukses pada mode non-mock dan 404 jika tidak ditemukan', async () => {
      mockSupabaseResponse = {
        data: { id_jasa: 'j1', nama_jasa: 'Detail Jasa' },
        error: null,
      };
      const res = await JasaDetailRoute.GET(new Request('http://localhost/api/jasa/j1'), p('j1'));
      expect(res.status).toBe(200);

      mockSupabaseResponse = { data: null, error: null };
      const res404 = await JasaDetailRoute.GET(new Request('http://localhost/api/jasa/j99'), p('j99'));
      expect(res404.status).toBe(404);
    });

    it('PATCH /api/jasa/[id] melempar 401 jika belum login pada mode non-mock', async () => {
      vi.spyOn(AuthService, 'getSessionUser').mockResolvedValueOnce(null);
      const res = await JasaDetailRoute.PATCH(
        jsonReq('http://localhost/api/jasa/j1', 'PATCH', { harga: 200000 }),
        p('j1')
      );
      expect(res.status).toBe(401);
    });

    it('PATCH /api/jasa/[id] sukses memperbarui pada mode non-mock', async () => {
      vi.spyOn(AuthService, 'getSessionUser').mockResolvedValueOnce({
        id: 'penyedia-1',
        email: 'p1@test.com',
        nama: 'Penyedia 1',
        role: 'PENYEDIA_JASA',
        status_akun: true,
        isPenyediaJasa: true,
        isPenggunaJasa: false,
      });

      mockSupabaseResponse = {
        data: {
          id_jasa: 'j1',
          id_penyedia_jasa: 'penyedia-1',
          nama_jasa: 'Logo Baru',
          deskripsi: 'Deskripsi Baru',
          kategori: 'Desain',
          harga: 200000,
        },
        error: null,
      };

      const res = await JasaDetailRoute.PATCH(
        jsonReq('http://localhost/api/jasa/j1', 'PATCH', { nama_jasa: 'Logo Baru', harga: 200000 }),
        p('j1')
      );
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
    });

    it('DELETE /api/jasa/[id] melempar 401 jika belum login pada mode non-mock', async () => {
      vi.spyOn(AuthService, 'getSessionUser').mockResolvedValueOnce(null);
      const res = await JasaDetailRoute.DELETE(
        new Request('http://localhost/api/jasa/j1', { method: 'DELETE' }),
        p('j1')
      );
      expect(res.status).toBe(401);
    });

    it('DELETE /api/jasa/[id] sukses menonaktifkan pada mode non-mock', async () => {
      vi.spyOn(AuthService, 'getSessionUser').mockResolvedValueOnce({
        id: 'penyedia-1',
        email: 'p1@test.com',
        nama: 'Penyedia 1',
        role: 'PENYEDIA_JASA',
        status_akun: true,
        isPenyediaJasa: true,
        isPenggunaJasa: false,
      });

      mockSupabaseResponse = {
        data: {
          id_jasa: 'j1',
          id_penyedia_jasa: 'penyedia-1',
        },
        error: null,
      };

      const res = await JasaDetailRoute.DELETE(
        new Request('http://localhost/api/jasa/j1', { method: 'DELETE' }),
        p('j1')
      );
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
    });
  });
});
