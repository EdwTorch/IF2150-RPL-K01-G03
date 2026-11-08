import { NextRequest, NextResponse } from 'next/server';
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

type RouteContext = { params: Promise<{ id_pesanan: string }> | { id_pesanan: string } };

// GET /api/pesanan/[id_pesanan] — ambil detail pesanan (C31 Algo-3104)
export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id_pesanan } = await Promise.resolve(params);
    const data = isMock()
      ? PengontrolPesanan.ambilDetailPesananDiMemori(mockPesananList, mockJasaPesananList, id_pesanan)
      : await PengontrolPesanan.ambilDetailPesanan(id_pesanan);

    return NextResponse.json({
      success: true,
      message: 'Detail pesanan berhasil diambil',
      data,
    });
  } catch (err) {
    return responsGagal(err);
  }
}

// PATCH /api/pesanan/[id_pesanan] — konfirmasi penyedia jasa (UC10) atau transisi status pesanan (Algo-3103)
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const { id_pesanan } = await Promise.resolve(params);
    const body = (await req.json()) as {
      id_penyedia_jasa?: string;
      tindakan?: 'terima' | 'tolak';
      action?: 'Diterima' | 'Ditolak' | 'terima' | 'tolak';
      status_pesanan?: string;
      status?: string;
    };

    // Skenario 1: Update status pesanan melalui Order State Machine (Algo-3103)
    const status_baru = body.status_pesanan ?? body.status;
    if (status_baru !== undefined && !body.tindakan && !body.action) {
      const data = isMock()
        ? PengontrolPesanan.updateStatusPesananDiMemori(mockPesananList, id_pesanan, status_baru)
        : await PengontrolPesanan.updateStatusPesanan(id_pesanan, status_baru);

      return NextResponse.json({
        success: true,
        message: 'Status pesanan berhasil diperbarui',
        data,
      });
    }

    // Skenario 2: Konfirmasi terima/tolak pesanan oleh Penyedia Jasa (UC10, Algo-0205 & Algo-0206)
    const raw_aksi = body.tindakan ?? body.action;
    const tindakan: 'terima' | 'tolak' | undefined =
      raw_aksi === 'terima' || raw_aksi === 'Diterima'
        ? 'terima'
        : raw_aksi === 'tolak' || raw_aksi === 'Ditolak'
          ? 'tolak'
          : undefined;

    if (!tindakan) {
      return NextResponse.json(
        {
          success: false,
          message: "Tindakan konfirmasi tidak valid. Gunakan 'terima' atau 'tolak'.",
          error_code: 'VALIDATION_ERROR',
        },
        { status: 400 },
      );
    }

    let id_penyedia_jasa = body.id_penyedia_jasa ?? '';
    if (!id_penyedia_jasa && !isMock()) {
      const { createClient } = await import('@/lib/supabase/server');
      const supabase = await createClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) {
        return NextResponse.json(
          { success: false, message: 'Unauthorized', error_code: 'UNAUTHORIZED' },
          { status: 401 },
        );
      }
      id_penyedia_jasa = user.id;
    }

    const data = isMock()
      ? PengontrolPesanan.konfirmasiPesananDiMemori(mockPesananList, id_pesanan, id_penyedia_jasa, tindakan)
      : await PengontrolPesanan.konfirmasiPesanan(id_pesanan, id_penyedia_jasa, tindakan);

    return NextResponse.json({
      success: true,
      message: tindakan === 'terima' ? 'Pesanan berhasil diterima.' : 'Pesanan ditolak.',
      data,
    });
  } catch (err) {
    return responsGagal(err);
  }
}
