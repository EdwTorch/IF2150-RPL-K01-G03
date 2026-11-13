import { NextResponse } from 'next/server';
import { isMock } from '@/app/api/jasa/helper';
import { mockPortofolio } from '@/lib/mocks/portofolio.mock';
import { getSessionUser } from '@/services/auth.service';
import { PengontrolPortofolio, type InputPortofolio } from '@/services/portofolio.service';

// Envelope galat standar
export function responsGagal(err: unknown) {
  const message = err instanceof Error ? err.message : 'Terjadi kegagalan server internal';
  const [status, error_code] = /tidak ditemukan/i.test(message)
    ? [404, 'NOT_FOUND']
    : /tidak valid|tidak lengkap|maksimal/i.test(message)
      ? [400, 'VALIDATION_ERROR']
      : [500, 'DATABASE_ERROR'];
  return NextResponse.json({ success: false, message, error_code }, { status });
}

// Hanya penyedia jasa yang login; id diambil dari sesi (cegah IDOR)
async function resolvePenyedia(): Promise<{ id_penyedia_jasa: string } | NextResponse> {
  if (isMock()) return { id_penyedia_jasa: mockPortofolio.id_penyedia_jasa };

  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json(
      { success: false, message: 'Autentikasi diperlukan: silakan masuk terlebih dahulu', error_code: 'UNAUTHORIZED' },
      { status: 401 },
    );
  }
  if (!user.isPenyediaJasa) {
    return NextResponse.json(
      { success: false, message: 'Akses ditolak: hanya penyedia jasa yang memiliki portofolio', error_code: 'FORBIDDEN' },
      { status: 403 },
    );
  }
  return { id_penyedia_jasa: user.id };
}

// GET /api/portofolio — portofolio penyedia yang sedang login (UC03, tampilkanPortofolio)
export async function GET() {
  try {
    const auth = await resolvePenyedia();
    if (auth instanceof NextResponse) return auth;

    const data = isMock()
      ? { pengalaman: mockPortofolio.pengalaman, prestasi: mockPortofolio.prestasi, daftar_karya: mockPortofolio.daftar_karya }
      : await PengontrolPortofolio.ambilPortofolio(auth.id_penyedia_jasa);

    return NextResponse.json({ success: true, message: 'Portofolio berhasil diambil', data });
  } catch (err) {
    return responsGagal(err);
  }
}

// POST /api/portofolio — simpan karya baru + perbarui pengalaman/prestasi (UC03, Algo-0801)
// Body JSON: { judul, deskripsi?, berkas_pendukung (URL dari /api/upload), pengalaman?: string[], prestasi?: string[] }
export async function POST(request: Request) {
  try {
    const auth = await resolvePenyedia();
    if (auth instanceof NextResponse) return auth;

    let body: Partial<InputPortofolio>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Format body JSON tidak valid', error_code: 'VALIDATION_ERROR' },
        { status: 400 },
      );
    }

    let data;
    if (isMock()) {
      const input = PengontrolPortofolio.normalisasiInput(body);
      const baru = PengontrolPortofolio.simpanDiMemori(mockPortofolio, auth.id_penyedia_jasa, input);
      Object.assign(mockPortofolio, baru); // simpan di memori untuk request berikutnya
      data = baru;
    } else {
      data = await PengontrolPortofolio.simpanPortofolio(auth.id_penyedia_jasa, body);
    }

    return NextResponse.json({ success: true, message: 'Portofolio berhasil disimpan', data }, { status: 201 });
  } catch (err) {
    return responsGagal(err);
  }
}