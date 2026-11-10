import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { MediasiService } from '@/services/mediasi.service';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
/* Mengambil daftar seluruh ruang mediasi yang diikuti oleh user yang sedang login (berlaku untuk Admin, Pelapor, maupun Terlapor), 
lengkap dengan cuplikan pesan_terakhir dan status_sesi (BERLANGSUNG atau SELESAI). */

export async function GET(req: NextRequest) {
  try {
    // Opsi 1: Ambil user dari Bearer Token (Disarankan)
    const authHeader = req.headers.get('authorization');
    let idPengguna: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        idPengguna = user.id;
      }
    }

    // Opsi 2 (Fallback untuk testing Postman/dev): Ambil dari query param ?id_pengguna=...
    if (!idPengguna) {
      idPengguna = req.nextUrl.searchParams.get('id_pengguna');
    }

    if (!idPengguna) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: ID pengguna tidak ditemukan.' },
        { status: 401 }
      );
    }

    const daftarMediasi = await MediasiService.getDaftarMediasiUser(idPengguna);

    return NextResponse.json(
      {
        success: true,
        data: daftarMediasi,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal mengambil daftar mediasi' },
      { status: 400 }
    );
  }
}