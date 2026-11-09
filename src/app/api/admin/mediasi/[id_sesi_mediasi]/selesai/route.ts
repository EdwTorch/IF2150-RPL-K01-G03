import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { MediasiService } from '@/services/mediasi.service';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
/* Fungsi: Mengubah status_sesi dari BERLANGSUNG menjadi SELESAI, mencatat waktu_selesai,
 serta mengirimkan pesan sistem penutup otomatis ke dalam ruang obrolan. */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id_sesi_mediasi: string }> }
) {
  try {
    const { id_sesi_mediasi } = await params;

    // Ambil id_admin dari Bearer Token atau dari body JSON { id_admin }
    const authHeader = req.headers.get('authorization');
    let idAdmin: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        idAdmin = user.id;
      }
    }

    if (!idAdmin) {
      const body = await req.json().catch(() => ({}));
      idAdmin = body.id_admin || null;
    }

    if (!idAdmin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: id_admin wajib disertakan.' },
        { status: 401 }
      );
    }

    const sesiSelesai = await MediasiService.selesaikanMediasi(
      id_sesi_mediasi,
      idAdmin
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Sesi mediasi berhasil diakhiri.',
        data: sesiSelesai,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal mengakhiri sesi mediasi' },
      { status: 400 }
    );
  }
}

