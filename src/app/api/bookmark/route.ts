import { NextResponse } from 'next/server';
import { isMock } from '@/app/api/jasa/helper';
import { mockBookmarkList } from '@/lib/mocks/bookmark.mock';
import { mockJasaList } from '@/lib/mocks/jasa.mock';
import { getSessionUser } from '@/services/auth.service';
import { PengontrolBookmark } from '@/services/bookmark.service';

// Envelope galat standar bookmark
export function responsGagal(err: unknown) {
  const message = err instanceof Error ? err.message : 'Terjadi kegagalan server internal';
  if (/sudah ada/i.test(message)) {
    return NextResponse.json({ success: false, message, error_code: 'CONFLICT' }, { status: 409 });
  }
  if (/tidak ditemukan/i.test(message)) {
    return NextResponse.json({ success: false, message, error_code: 'NOT_FOUND' }, { status: 404 });
  }
  if (/akses ditolak|tidak dapat mengakses/i.test(message)) {
    return NextResponse.json({ success: false, message, error_code: 'FORBIDDEN' }, { status: 403 });
  }
  if (/autentikasi diperlukan/i.test(message)) {
    return NextResponse.json({ success: false, message, error_code: 'UNAUTHORIZED' }, { status: 401 });
  }
  if (/tidak valid|tidak lengkap|harus|tidak didukung|melebihi/i.test(message)) {
    return NextResponse.json({ success: false, message, error_code: 'VALIDATION_ERROR' }, { status: 400 });
  }
  return NextResponse.json({ success: false, message, error_code: 'DATABASE_ERROR' }, { status: 500 });
}

// Resolver identitas pengguna: autentikasi & pencegahan IDOR
async function resolveIdPenggunaJasa(
  idDariRequest?: string | null,
): Promise<{ id_pengguna_jasa: string } | NextResponse> {
  if (isMock()) {
    const id = idDariRequest?.trim();
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Parameter input tidak valid', error_code: 'VALIDATION_ERROR' },
        { status: 400 },
      );
    }
    return { id_pengguna_jasa: id };
  }

  const sessionUser = await getSessionUser();
  if (sessionUser) {
    if (idDariRequest && idDariRequest.trim() !== sessionUser.id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Akses ditolak: tidak dapat mengakses bookmark pengguna lain',
          error_code: 'FORBIDDEN',
        },
        { status: 403 },
      );
    }
    return { id_pengguna_jasa: sessionUser.id };
  }

  // Jika !sessionUser
  if (!idDariRequest?.trim()) {
    return NextResponse.json(
      {
        success: false,
        message: 'Autentikasi diperlukan: silakan masuk terlebih dahulu',
        error_code: 'UNAUTHORIZED',
      },
      { status: 401 },
    );
  }

  return { id_pengguna_jasa: idDariRequest.trim() };
}

// GET /api/bookmark?id_pengguna_jasa=... — ambil daftar bookmark pengguna (UC07, C22 Algo-2203)
export async function GET(request: Request) {
  try {
    const paramId = new URL(request.url).searchParams.get('id_pengguna_jasa');
    const authRes = await resolveIdPenggunaJasa(paramId);
    if (authRes instanceof NextResponse) return authRes;

    const { id_pengguna_jasa } = authRes;
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
    let body: {
      id_pengguna_jasa?: string;
      id_jasa?: string;
      toggle?: boolean;
      action?: 'toggle' | 'add';
    };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Format body JSON tidak valid', error_code: 'VALIDATION_ERROR' },
        { status: 400 },
      );
    }

    const authRes = await resolveIdPenggunaJasa(body.id_pengguna_jasa);
    if (authRes instanceof NextResponse) return authRes;

    const { id_pengguna_jasa } = authRes;
    const id_jasa = body.id_jasa ?? '';

    if (body.toggle === true || body.action === 'toggle') {
      if (isMock()) {
        const hasil = PengontrolBookmark.toggleDiMemori(mockBookmarkList, mockJasaList, id_pengguna_jasa, id_jasa);
        mockBookmarkList.splice(0, mockBookmarkList.length, ...hasil.daftar);
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

      const hasil = await PengontrolBookmark.toggleBookmark(id_pengguna_jasa, id_jasa);
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

    if (isMock()) {
      const data = PengontrolBookmark.tambahKeMemori(mockBookmarkList, mockJasaList, id_pengguna_jasa, id_jasa);
      mockBookmarkList.unshift(data);
      return NextResponse.json({ success: true, message: 'Bookmark berhasil disimpan', data }, { status: 201 });
    }

    const data = await PengontrolBookmark.tambahDataBookmark(id_pengguna_jasa, id_jasa);
    return NextResponse.json({ success: true, message: 'Bookmark berhasil disimpan', data }, { status: 201 });
  } catch (err) {
    return responsGagal(err);
  }
}

// DELETE /api/bookmark?id_pengguna_jasa=...&id_jasa=... (atau JSON body) — hapus bookmark (UC07, C22 Algo-2202)
export async function DELETE(request: Request) {
  try {
    const p = new URL(request.url).searchParams;
    let idDariReq = p.get('id_pengguna_jasa') ?? undefined;
    let id_jasa = p.get('id_jasa') ?? '';
    let id_bookmark = p.get('id_bookmark') ?? undefined;

    if (!idDariReq || (!id_jasa && !id_bookmark)) {
      try {
        const body = (await request.json()) as Record<string, string | undefined>;
        idDariReq = idDariReq || body.id_pengguna_jasa;
        id_jasa = id_jasa || body.id_jasa || '';
        id_bookmark = id_bookmark || body.id_bookmark;
      } catch {
        // Abaikan jika query string sudah mencukupi
      }
    }

    const authRes = await resolveIdPenggunaJasa(idDariReq);
    if (authRes instanceof NextResponse) return authRes;

    const { id_pengguna_jasa } = authRes;

    if (isMock()) {
      const sisa = PengontrolBookmark.hapusDariMemori(mockBookmarkList, id_pengguna_jasa, id_bookmark || id_jasa);
      mockBookmarkList.splice(0, mockBookmarkList.length, ...sisa);
    } else {
      await PengontrolBookmark.hapusDataBookmark(id_pengguna_jasa, id_jasa, id_bookmark);
    }
    return NextResponse.json({ success: true, message: 'Bookmark berhasil dihapus', data: null });
  } catch (err) {
    return responsGagal(err);
  }
}
