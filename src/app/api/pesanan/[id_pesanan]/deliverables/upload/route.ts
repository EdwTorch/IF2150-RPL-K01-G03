import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { DeliverablesService } from '@/services/deliverables.service';

// Unggah berkas deliverable, respons berisi file_url untuk disimpan ke produk_akhir
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id_pesanan: string }> | { id_pesanan: string } }
) {
  const supabase = await createClient();
  const { data: { user }, error: auth_error } = await supabase.auth.getUser();

  if (!user || auth_error) {
    return NextResponse.json({ success: false, message: 'Anda belum login' }, { status: 401 });
  }

  const { id_pesanan } = await context.params;

  // Hanya pemesan/penyedia pada pesanan ini yang boleh mengunggah
  try {
    await DeliverablesService.validasiOwnerPesanan(id_pesanan, user.id);
  } catch {
    return NextResponse.json({ success: false, message: 'Akses ditolak' }, { status: 403 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ success: false, message: 'Body harus multipart/form-data' }, { status: 400 });
  }

  const berkas = form.get('berkas');
  if (!(berkas instanceof File) || berkas.size === 0) {
    return NextResponse.json({ success: false, message: 'Berkas tidak ditemukan atau kosong' }, { status: 400 });
  }

  try {
    // Unggah ke folder deliverables-uploads
    const url = await DeliverablesService.unggahBerkasDeliverable(berkas);
    return NextResponse.json(
      { success: true, message: 'Berkas deliverable berhasil diunggah', data: { url } },
      { status: 201 }
    );
  } catch (err: any) {
    const isValidasi = /melebihi|tidak diizinkan/i.test(err.message ?? '');
    return NextResponse.json(
      { success: false, message: err.message ?? 'Gagal mengunggah berkas' },
      { status: isValidasi ? 400 : 500 }
    );
  }
}
