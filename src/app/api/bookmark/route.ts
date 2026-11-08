import { NextResponse } from 'next/server';
import { isMock, responsGagal } from '@/app/api/jasa/helper';
import { mockBookmarkList } from '@/lib/mocks/bookmark.mock';
import { mockJasaList } from '@/lib/mocks/jasa.mock';
import { PengontrolBookmark } from '@/services/bookmark.service';

// GET /api/bookmark?id_pengguna_jasa=... — ambil daftar bookmark pengguna (UC07, C22 Algo-2203)
export async function GET(request: Request) {
  try {
    // ponytail: ambil id_pengguna_jasa dari query param; ganti ke getSessionUser() saat sesi penuh diintegrasikan
    const id_pengguna_jasa = new URL(request.url).searchParams.get('id_pengguna_jasa') ?? '';
    const data = isMock()
      ? PengontrolBookmark.daftarDariMemori(mockBookmarkList, mockJasaList, id_pengguna_jasa)
      : await PengontrolBookmark.ambilDaftarBookmarkPengguna(id_pengguna_jasa);

    const message = data.length ? 'Daftar bookmark berhasil diambil' : 'Bookmark kosong';
    return NextResponse.json({ success: true, message, data });
  } catch (err) {
    return responsGagal(err);
  }
}

// POST /api/bookmark — tambah atau toggle bookmark (UC07, C22 Algo-2201)
// Body JSON: { id_pengguna_jasa, id_jasa, toggle?: boolean, action?: 'toggle' | 'add' }
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      id_pengguna_jasa?: string;
      id_jasa?: string;
      toggle?: boolean;
      action?: 'toggle' | 'add';
    };
    const id_pengguna_jasa = body.id_pengguna_jasa ?? '';
    const id_jasa = body.id_jasa ?? '';

    if (body.toggle === true || body.action === 'toggle') {
      const hasil = isMock()
        ? PengontrolBookmark.toggleDiMemori(mockBookmarkList, mockJasaList, id_pengguna_jasa, id_jasa)
        : await PengontrolBookmark.toggleBookmark(id_pengguna_jasa, id_jasa);

      const added = hasil.action === 'added';
      return NextResponse.json(
        {
          success: true,
          message: added ? 'Bookmark berhasil disimpan' : 'Bookmark berhasil dihapus',
          data: hasil.data,
        },
        { status: added ? 201 : 200 },
      );
    }

    const data = isMock()
      ? PengontrolBookmark.tambahKeMemori(mockBookmarkList, mockJasaList, id_pengguna_jasa, id_jasa)
      : await PengontrolBookmark.tambahDataBookmark(id_pengguna_jasa, id_jasa);

    return NextResponse.json({ success: true, message: 'Bookmark berhasil disimpan', data }, { status: 201 });
  } catch (err) {
    return responsGagal(err);
  }
}

// DELETE /api/bookmark?id_pengguna_jasa=...&id_jasa=... (atau JSON body) — hapus bookmark (UC07, C22 Algo-2202)
export async function DELETE(request: Request) {
  try {
    const p = new URL(request.url).searchParams;
    let id_pengguna_jasa = p.get('id_pengguna_jasa') ?? '';
    let id_jasa = p.get('id_jasa') ?? '';
    let id_bookmark = p.get('id_bookmark') ?? undefined;

    if (!id_pengguna_jasa || (!id_jasa && !id_bookmark)) {
      const body = (await request.json().catch(() => ({}))) as Record<string, string | undefined>;
      id_pengguna_jasa = id_pengguna_jasa || body.id_pengguna_jasa || '';
      id_jasa = id_jasa || body.id_jasa || '';
      id_bookmark = id_bookmark || body.id_bookmark;
    }

    if (isMock()) {
      PengontrolBookmark.hapusDariMemori(mockBookmarkList, id_pengguna_jasa, id_bookmark || id_jasa);
    } else {
      await PengontrolBookmark.hapusDataBookmark(id_pengguna_jasa, id_jasa, id_bookmark);
    }
    return NextResponse.json({ success: true, message: 'Bookmark berhasil dihapus', data: null });
  } catch (err) {
    return responsGagal(err);
  }
}
