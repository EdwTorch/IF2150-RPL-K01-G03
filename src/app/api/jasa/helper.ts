import { NextResponse } from 'next/server';

// Baca input jasa dari JSON atau multipart/form-data (field "berkas" boleh banyak)
export async function bacaInputJasa(request: Request): Promise<{ data: Record<string, unknown>; berkas: File[] }> {
  if (!request.headers.get('content-type')?.includes('multipart/form-data')) {
    return { data: await request.json(), berkas: [] };
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

// Envelope galat standar: 404 jika tidak ditemukan, 400 untuk input salah, 500 lainnya
export function responsGagal(err: unknown) {
  const message = err instanceof Error ? err.message : 'Terjadi kegagalan server internal';
  const [status, error_code] = /tidak ditemukan/i.test(message)
    ? [404, 'NOT_FOUND']
    : /tidak valid|tidak lengkap|harus|tidak didukung|melebihi|minimal|maksimal|rentang|batas/i.test(message)
      ? [400, 'VALIDATION_ERROR']
      : [500, 'DATABASE_ERROR'];
  return NextResponse.json({ success: false, message, error_code }, { status });
}

export const isMock = () => process.env.NEXT_PUBLIC_USE_MOCK === 'true';
