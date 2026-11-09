import { NextResponse } from 'next/server';
import {
  mockMetodePembayaranList,
  mockPesananTransaksiList,
  mockRiwayatTransaksiList,
} from '../../../../lib/mocks/transaksi.mock';
import { PengontrolTransaksi } from '../../../../services/transaksi.service';

const isMock = () => process.env.NEXT_PUBLIC_USE_MOCK === 'true';

function responsGagal(err: unknown) {
  if (err instanceof SyntaxError) {
    return NextResponse.json(
      {
        success: false,
        message: 'Format body JSON tidak valid',
        error_code: 'VALIDATION_ERROR',
      },
      { status: 400 },
    );
  }
  const message = err instanceof Error ? err.message : 'Terjadi kegagalan server internal';
  const [status, error_code] = /tidak ditemukan/i.test(message)
    ? [404, 'NOT_FOUND']
    : /tidak valid|tidak sesuai|menunggu pembayaran|wajib|sudah dicairkan|sudah lunas/i.test(
          message,
        )
      ? [400, 'VALIDATION_ERROR']
      : [500, 'DATABASE_ERROR'];
  return NextResponse.json({ success: false, message, error_code }, { status });
}

// POST /api/transaksi/dummy — eksekusi pembayaran dummy instan (UC09 / C32 Algo-3201, Algo-3202)
// Body JSON: { id_pesanan, id_metode, jumlah_bayar? }
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      id_pesanan?: string;
      id_metode?: string;
      id_metode_pembayaran?: string;
      jumlah_bayar?: number;
      total_biaya?: number;
    };

    const id_pesanan = body.id_pesanan ?? '';
    const id_metode = body.id_metode ?? body.id_metode_pembayaran ?? '';
    const jumlah_bayar = body.jumlah_bayar ?? body.total_biaya;

    let data;
    if (isMock()) {
      const hasil = PengontrolTransaksi.prosesPembayaranDummyDiMemori(
        mockPesananTransaksiList,
        mockMetodePembayaranList,
        id_pesanan,
        id_metode,
        jumlah_bayar,
      );
      // Mutasi in-place pesanan agar pembayaran ganda tertolak di request berikutnya
      const idx = mockPesananTransaksiList.findIndex((p) => p.id_pesanan === id_pesanan);
      if (idx !== -1) mockPesananTransaksiList[idx] = hasil.pesanan;
      // Catat ke riwayat transaksi
      mockRiwayatTransaksiList.push(hasil.transaksi);
      data = hasil;
    } else {
      data = await PengontrolTransaksi.prosesPembayaranDummy(id_pesanan, id_metode, jumlah_bayar);
    }

    return NextResponse.json(
      { success: true, message: 'Pembayaran dummy berhasil diproses', data },
      { status: 201 },
    );
  } catch (err) {
    return responsGagal(err);
  }
}
