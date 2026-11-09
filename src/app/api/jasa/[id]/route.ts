import { NextResponse } from 'next/server';
import { mockJasaList } from '@/lib/mocks/jasa.mock';
import { JasaController, type DataJasaUpdate } from '@/services/jasa.service';
import { bacaInputJasa, isMock, responsGagal } from '../helper';

type Params = { params: Promise<{ id: string }> };

function cariMock(id: string) {
  const jasa = mockJasaList.find((j) => j.id_jasa === id);
  if (!jasa) throw new Error('Data jasa tidak ditemukan');
  return jasa;
}

// GET /api/jasa/[id] — detail jasa (UC06)
export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const data = isMock() ? cariMock(id) : await JasaController.ambilDetailJasa(id);
    return NextResponse.json({ success: true, message: 'Detail jasa berhasil diambil', data });
  } catch (err) {
    return responsGagal(err);
  }
}

// PATCH /api/jasa/[id] — perbarui sebagian data jasa. JSON atau multipart (field "berkas")
export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { data, berkas } = await bacaInputJasa(request);
    const input = data as DataJasaUpdate;

    const jasa = isMock() ? { ...cariMock(id), ...input } : await JasaController.perbaruiJasa(id, input, berkas);
    return NextResponse.json({ success: true, message: 'Data jasa berhasil diperbarui', data: jasa });
  } catch (err) {
    return responsGagal(err);
  }
}

// DELETE /api/jasa/[id] — soft delete (status_aktif = false)
export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    if (isMock()) cariMock(id);
    else await JasaController.hapusJasa(id);
    return NextResponse.json({ success: true, message: 'Penawaran jasa berhasil dinonaktifkan', data: null });
  } catch (err) {
    return responsGagal(err);
  }
}
