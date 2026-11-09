import { NextResponse } from 'next/server';
import {
  mockMetodePembayaranList,
  mockPesananTransaksiList,
  mockRiwayatTransaksiList,
} from '@/lib/mocks/transaksi.mock';
import { PengontrolTransaksi } from '@/services/transaksi.service';

const isMock = () => process.env.NEXT_PUBLIC_USE_MOCK === 'true';

function responsGagal(err: unknown) {
  const message = err instanceof Error ? err.message : 'Terjadi kegagalan server internal';
  const [status, error_code] = /tidak ditemukan/i.test(message)
    ? [404, 'NOT_FOUND']
    : /tidak valid|wajib/i.test(message)
      ? [400, 'VALIDATION_ERROR']
      : [500, 'DATABASE_ERROR'];
  return NextResponse.json({ success: false, message, error_code }, { status });
}

// GET /api/transaksi?id_pengguna=...&peran=pengguna_jasa|penyedia_jasa
// atau GET /api/transaksi?type=metode / ?id_metode=...
export async function GET(request: Request) {
  try {
    const p = new URL(request.url).searchParams;
    const id_metode = p.get('id_metode');
    const type = p.get('type');

    if (id_metode) {
      const data = isMock()
        ? PengontrolTransaksi.dapatkanDetailMetodeDiMemori(mockMetodePembayaranList, id_metode)
        : await PengontrolTransaksi.dapatkanDetailMetode(id_metode);
      return NextResponse.json({
        success: true,
        message: 'Detail metode pembayaran berhasil diambil',
        data,
      });
    }

    if (type === 'metode') {
      const data = isMock()
        ? mockMetodePembayaranList
        : await PengontrolTransaksi.ambilDaftarMetode();
      return NextResponse.json({
        success: true,
        message: 'Daftar metode pembayaran berhasil diambil',
        data,
      });
    }

    const id_pengguna_jasa = p.get('id_pengguna_jasa');
    const id_penyedia_jasa = p.get('id_penyedia_jasa');

    // ponytail: ambil id_pengguna & peran dari query param; siap diganti ke getSessionUser() saat sesi penuh diintegrasikan
    const id_pengguna = p.get('id_pengguna') ?? id_pengguna_jasa ?? id_penyedia_jasa ?? '';
    const peran = (p.get('peran') ??
      (id_penyedia_jasa ? 'penyedia_jasa' : 'pengguna_jasa')) as 'pengguna_jasa' | 'penyedia_jasa';

    const data = isMock()
      ? PengontrolTransaksi.ambilRiwayatTransaksiDiMemori(
          mockRiwayatTransaksiList,
          mockPesananTransaksiList,
          mockMetodePembayaranList,
          id_pengguna,
          peran,
        )
      : await PengontrolTransaksi.ambilRiwayatTransaksi(id_pengguna, peran);

    const message = data.length
      ? 'Daftar riwayat transaksi berhasil diambil'
      : 'Daftar riwayat transaksi kosong';
    return NextResponse.json({ success: true, message, data });
  } catch (err) {
    return responsGagal(err);
  }
}
