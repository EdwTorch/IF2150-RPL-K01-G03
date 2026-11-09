import { NextResponse } from 'next/server';
import { mockJasaPesananList, mockPesananList } from '@/lib/mocks/pesanan.mock';
import { PengontrolPesanan } from '@/services/pesanan.service';

const isMock = () => process.env.NEXT_PUBLIC_USE_MOCK === 'true';

function responsGagal(err: unknown) {
  const message = err instanceof Error ? err.message : 'Terjadi kegagalan server internal';
  const [status, error_code] = /tidak ditemukan/i.test(message)
    ? [404, 'NOT_FOUND']
    : /akses ditolak|bukan milik|hanya penyedia/i.test(message)
      ? [403, 'FORBIDDEN']
      : /tidak valid|wajib diisi|batas maksimal|sudah diproses|milik sendiri/i.test(message)
        ? [400, 'VALIDATION_ERROR']
        : [500, 'DATABASE_ERROR'];
  return NextResponse.json({ success: false, message, error_code }, { status });
}

// GET /api/pesanan?id_pengguna=...&peran=pengguna_jasa|penyedia_jasa&status=...
export async function GET(request: Request) {
  try {
    const p = new URL(request.url).searchParams;
    const id_pengguna_jasa = p.get('id_pengguna_jasa');
    const id_penyedia_jasa = p.get('id_penyedia_jasa');

    // ponytail: ambil id_pengguna & peran dari query param; siap diganti ke getSessionUser() saat sesi penuh diintegrasikan
    const id_pengguna = p.get('id_pengguna') ?? id_pengguna_jasa ?? id_penyedia_jasa ?? '';
    const peran = (p.get('peran') ??
      (id_penyedia_jasa ? 'penyedia_jasa' : 'pengguna_jasa')) as 'pengguna_jasa' | 'penyedia_jasa';
    const filter_status = p.get('status') ?? p.get('filter_status') ?? undefined;

    const data = isMock()
      ? PengontrolPesanan.ambilDaftarPesananDiMemori(
          mockPesananList,
          mockJasaPesananList,
          id_pengguna,
          peran,
          filter_status,
        )
      : await PengontrolPesanan.ambilDaftarPesanan(id_pengguna, peran, filter_status);

    const message = data.length ? 'Daftar pesanan berhasil diambil' : 'Daftar pesanan kosong';
    return NextResponse.json({ success: true, message, data });
  } catch (err) {
    return responsGagal(err);
  }
}

// POST /api/pesanan — buat pesanan baru (UC09, C31 Algo-3101 & Algo-3102)
// Body JSON: { id_pengguna_jasa, id_jasa, brief | brief_kebutuhan }
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      id_pengguna_jasa?: string;
      id_jasa?: string;
      brief?: string;
      brief_kebutuhan?: string;
    };

    const id_pengguna_jasa = body.id_pengguna_jasa ?? '';
    const id_jasa = body.id_jasa ?? '';
    const brief = body.brief ?? body.brief_kebutuhan ?? '';

    const data = isMock()
      ? PengontrolPesanan.buatPesananDiMemori(
          mockPesananList,
          mockJasaPesananList,
          id_pengguna_jasa,
          id_jasa,
          brief,
        )
      : await PengontrolPesanan.buatPesananBaru(id_pengguna_jasa, id_jasa, brief);

    return NextResponse.json(
      { success: true, message: 'Pesanan berhasil dibuat', data },
      { status: 201 },
    );
  } catch (err) {
    return responsGagal(err);
  }
}
