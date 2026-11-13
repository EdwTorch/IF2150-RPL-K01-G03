import { NextResponse } from 'next/server';
import { isMock } from '@/app/api/jasa/helper';
import { mockProfilPenyediaList } from '@/lib/mocks/penyedia.mock';
import { PenyediaJasaService } from '@/services/penyedia.service';

type Params = { params: Promise<{ id: string }> };

function responsGagal(err: unknown) {
  const message = err instanceof Error ? err.message : 'Terjadi kegagalan server internal';
  const [status, error_code] = /tidak ditemukan/i.test(message)
    ? [404, 'NOT_FOUND']
    : /tidak valid/i.test(message)
      ? [400, 'VALIDATION_ERROR']
      : [500, 'DATABASE_ERROR'];
  return NextResponse.json({ success: false, message, error_code }, { status });
}

// GET /api/penyedia/[id] — profil publik penyedia (nama, pengalaman, prestasi, rating) untuk I-06 "Tentang penyedia"
export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const data = isMock()
      ? PenyediaJasaService.cariDiMemori(mockProfilPenyediaList, id)
      : await PenyediaJasaService.getProfilPublik(id);
    return NextResponse.json({ success: true, message: 'Profil penyedia berhasil diambil', data });
  } catch (err) {
    return responsGagal(err);
  }
}