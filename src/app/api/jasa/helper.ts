import { NextResponse } from 'next/server';

// Baca input jasa dari JSON atau multipart/form-data (field "berkas" boleh banyak)
export async function bacaInputJasa(request: Request): Promise<{ data: Record<string, unknown>; berkas: File[] }> {
  if (!request.headers.get('content-type')?.includes('multipart/form-data')) {
    try {
      const data = await request.json();
      return { data, berkas: [] };
    } catch {
      throw new Error('Format body JSON tidak valid');
    }
  }

  const form = await request.formData();
  const data: Record<string, unknown> = {};
  for (const [key, value] of form.entries()) {
    if (typeof value === 'string' && key !== 'berkas') data[key] = value;
  }
  if (data.harga !== undefined) data.harga = Number(data.harga);
  if (data.status_aktif !== undefined) data.status_aktif = data.status_aktif === 'true';
  const berkas = form.getAll('berkas').filter((v): v is File => v instanceof File && v.size > 0);
  return { data, berkas };
}

// Envelope galat standar: 401, 403, 404 jika tidak ditemukan, 400 untuk input salah, 500 lainnya
export function responsGagal(err: unknown) {
  const message = err instanceof Error ? err.message : 'Terjadi kegagalan server internal';
  
  if (/autentikasi|unauthorized|belum login/i.test(message)) {
    return NextResponse.json({ success: false, message, error_code: 'UNAUTHORIZED' }, { status: 401 });
  }
  if (/akses ditolak|forbidden|bukan pemilik|bukan penyedia/i.test(message)) {
    return NextResponse.json({ success: false, message, error_code: 'FORBIDDEN' }, { status: 403 });
  }
  if (/tidak ditemukan/i.test(message)) {
    return NextResponse.json({ success: false, message, error_code: 'NOT_FOUND' }, { status: 404 });
  }
  if (/tidak valid|tidak lengkap|harus|tidak didukung|melebihi|minimal|maksimal|rentang|batas|kosong|format body/i.test(message)) {
    return NextResponse.json({ success: false, message, error_code: 'VALIDATION_ERROR' }, { status: 400 });
  }

  return NextResponse.json({ success: false, message, error_code: 'DATABASE_ERROR' }, { status: 500 });
}

export const isMock = () => process.env.NEXT_PUBLIC_USE_MOCK === 'true';
