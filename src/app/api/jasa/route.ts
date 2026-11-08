import { NextResponse } from 'next/server';
import { mockJasaList } from '@/lib/mocks/jasa.mock';
import { JasaController, type DataJasaBaru } from '@/services/jasa.service';
import { bacaInputJasa, isMock, responsGagal } from './helper';

// GET /api/jasa — katalog jasa aktif (UC05/UC06)
export async function GET() {
  try {
    const data = isMock() ? mockJasaList.filter((j) => j.status_aktif) : await JasaController.ambilSemuaJasa();
    return NextResponse.json({ success: true, message: 'Data penawaran jasa berhasil diambil', data });
  } catch (err) {
    return responsGagal(err);
  }
}

// POST /api/jasa — unggah penawaran jasa baru (UC04). JSON atau multipart (field "berkas")
export async function POST(request: Request) {
  try {
    const { data, berkas } = await bacaInputJasa(request);
    const input = data as unknown as DataJasaBaru;

    if (!JasaController.validasiDataJasa(input)) throw new Error('Data penawaran jasa tidak valid atau tidak lengkap');
    // ponytail: id_penyedia_jasa dari body sampai sesi login (C07) siap
    if (!input.id_penyedia_jasa) throw new Error('id_penyedia_jasa tidak valid');

    const jasa = isMock()
      ? { ...input, id_jasa: crypto.randomUUID(), rating_rata_rata: 0, status_aktif: true, created_at: new Date().toISOString() }
      : await JasaController.simpanPenawaranJasa(input, berkas);

    return NextResponse.json({ success: true, message: 'Penawaran jasa berhasil diunggah', data: jasa }, { status: 201 });
  } catch (err) {
    return responsGagal(err);
  }
}
