import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { MediasiService } from '@/services/mediasi.service';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
/* Membuat ruang obrolan mediasi baru (bertiga) berdasarkan tiket laporan, 
mengirim pesan pembuka otomatis, dan mengirimkan notifikasi ke Pelapor maupun Terlapor. */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id_sesi_mediasi: string }> }
) {
  try {
    const { id_sesi_mediasi } = await params;
    const body = await req.json();
    const { isi_pesan } = body;

    // Ambil id_pengirim dari Bearer Token atau fallback dari body JSON { id_pengirim }
    const authHeader = req.headers.get('authorization');
    let idPengirim: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) idPengirim = user.id;
    }

    if (!idPengirim) {
      idPengirim = body.id_pengirim || null;
    }

    if (!idPengirim || !isi_pesan) {
      return NextResponse.json(
        { success: false, message: 'id_pengirim dan isi_pesan wajib diisi.' },
        { status: 400 }
      );
    }

    const pesanBaru = await MediasiService.kirimPesanMediasi(
      id_sesi_mediasi,
      idPengirim,
      isi_pesan
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Pesan mediasi terkirim.',
        data: pesanBaru,
      },
      { status: 201 }
    );
  } catch (error: any) {
    const isForbidden = error.message?.includes('Akses ditolak');

    return NextResponse.json(
      { success: false, message: error.message || 'Gagal mengirim pesan' },
      { status: isForbidden ? 403 : 400 }
    );
  }
}