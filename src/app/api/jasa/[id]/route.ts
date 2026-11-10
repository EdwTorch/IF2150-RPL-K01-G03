import { NextResponse } from 'next/server';
import { mockJasaList } from '@/lib/mocks/jasa.mock';
import { JasaController, type DataJasaUpdate } from '@/services/jasa.service';
import { getSessionUser } from '@/services/auth.service';
import { bacaInputJasa, isMock, responsGagal } from '../helper';

type Params = { params: Promise<{ id: string }> };

function cariMock(id: string) {
  const jasa = mockJasaList.find((j) => j.id_jasa === id);
  if (!jasa) throw new Error('Data jasa tidak ditemukan');
  return jasa;
}

// GET /api/jasa/[id] - detail jasa (UC06)
export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const data = isMock() ? cariMock(id) : await JasaController.ambilDetailJasa(id);
    return NextResponse.json({ success: true, message: 'Detail jasa berhasil diambil', data });
  } catch (err) {
    return responsGagal(err);
  }
}

// PATCH /api/jasa/[id] - perbarui sebagian data jasa. JSON atau multipart (field "berkas")
export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { data, berkas } = await bacaInputJasa(request);
    const input = data as DataJasaUpdate;

    if (isMock()) {
      const index = mockJasaList.findIndex((j) => j.id_jasa === id);
      if (index === -1) throw new Error('Data jasa tidak ditemukan');

      // Validasi input pembaruan mock
      if (input.nama_jasa !== undefined && (typeof input.nama_jasa !== 'string' || !input.nama_jasa.trim())) {
        throw new Error('Nama jasa tidak valid atau kosong');
      }
      if (input.deskripsi !== undefined && (typeof input.deskripsi !== 'string' || !input.deskripsi.trim())) {
        throw new Error('Deskripsi jasa tidak valid atau kosong');
      }
      if (input.kategori !== undefined && (typeof input.kategori !== 'string' || !input.kategori.trim())) {
        throw new Error('Kategori jasa tidak valid atau kosong');
      }
      if (input.harga !== undefined && (typeof input.harga !== 'number' || !Number.isFinite(input.harga) || input.harga <= 0)) {
        throw new Error('Harga harus lebih dari 0');
      }

      if (Object.keys(input).length === 0 && berkas.length === 0) {
        throw new Error('Data pembaruan jasa tidak valid atau kosong');
      }

      const updated = {
        ...mockJasaList[index],
        ...input,
        nama_jasa: input.nama_jasa !== undefined ? input.nama_jasa.trim() : mockJasaList[index].nama_jasa,
        deskripsi: input.deskripsi !== undefined ? input.deskripsi.trim() : mockJasaList[index].deskripsi,
        kategori: input.kategori !== undefined ? input.kategori.trim() : mockJasaList[index].kategori,
      };
      mockJasaList[index] = updated;

      return NextResponse.json({ success: true, message: 'Data jasa berhasil diperbarui', data: updated });
    }

    // Mode non-mock: autentikasi & otorisasi kepemilikan
    const user = await getSessionUser();
    if (!user) {
      throw new Error('Autentikasi diperlukan: silakan login terlebih dahulu');
    }

    const jasa = await JasaController.ambilDetailJasa(id);
    if (jasa.id_penyedia_jasa !== user.id) {
      throw new Error('Akses ditolak: Anda bukan pemilik jasa ini');
    }

    const updatedJasa = await JasaController.perbaruiJasa(id, input, berkas);
    return NextResponse.json({ success: true, message: 'Data jasa berhasil diperbarui', data: updatedJasa });
  } catch (err) {
    return responsGagal(err);
  }
}

// DELETE /api/jasa/[id] - soft delete (status_aktif = false)
export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params;

    if (isMock()) {
      const index = mockJasaList.findIndex((j) => j.id_jasa === id);
      if (index === -1) throw new Error('Data jasa tidak ditemukan');
      mockJasaList[index].status_aktif = false;
      return NextResponse.json({ success: true, message: 'Penawaran jasa berhasil dinonaktifkan', data: null });
    }

    // Mode non-mock: autentikasi & otorisasi kepemilikan
    const user = await getSessionUser();
    if (!user) {
      throw new Error('Autentikasi diperlukan: silakan login terlebih dahulu');
    }

    const jasa = await JasaController.ambilDetailJasa(id);
    if (jasa.id_penyedia_jasa !== user.id) {
      throw new Error('Akses ditolak: Anda bukan pemilik jasa ini');
    }

    await JasaController.hapusJasa(id);
    return NextResponse.json({ success: true, message: 'Penawaran jasa berhasil dinonaktifkan', data: null });
  } catch (err) {
    return responsGagal(err);
  }
}
