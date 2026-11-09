import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { MediasiService } from '@/services/mediasi.service';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
/* Mengambil detail lengkap satu ruang mediasi (info tiket laporan, nama peserta, dan status sesi)
 beserta seluruh riwayat percakapan (pesan) dari awal hingga akhir. */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id_sesi_mediasi: string }> }
) {
  try {
    const { id_sesi_mediasi } = await params;

    // Ambil user dari Bearer Token atau query param ?id_pengguna=...
    const authHeader = req.headers.get('authorization');
    let idPengguna: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        idPengguna = user.id;
      }
    }

    if (!idPengguna) {
      idPengguna = req.nextUrl.searchParams.get('id_pengguna');
    }

    if (!idPengguna) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: ID pengguna tidak ditemukan.' },
        { status: 401 }
      );
    }

    const detailMediasi = await MediasiService.getDetailDanPesanMediasi(
      id_sesi_mediasi,
      idPengguna
    );

    return NextResponse.json(
      {
        success: true,
        message : "Detail dan Pesan Room Mediasi Berhasil dimuat",
        data: detailMediasi,
      },
      { status: 200 }
    );
  } catch (error: any) {
    const isForbidden = error.message?.includes('Akses ditolak');
    const isNotFound = error.message?.includes('tidak ditemukan');

    return NextResponse.json(
      { success: false, message: error.message || 'Gagal memuat detail mediasi' },
      { status: isForbidden ? 403 : isNotFound ? 404 : 400 }
    );
  }
}
/* Fungsi: Menyimpan pesan baru yang dikirim oleh salah satu peserta (Admin, Pelapor, atau Terlapor) ke database,
 sekaligus otomatis mengirimkan notifikasi ke 2 peserta lainnya. */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id_tiket } = body;

    // Ambil id_admin dari Bearer Token atau fallback dari body JSON { id_admin }
    const authHeader = req.headers.get('authorization');
    let idAdmin: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) idAdmin = user.id;
    }

    if (!idAdmin) {
      idAdmin = body.id_admin || null;
    }

    if (!id_tiket || !idAdmin) {
      return NextResponse.json(
        { success: false, message: 'id_tiket dan id_admin wajib diisi.' },
        { status: 400 }
      );
    }

    const result = await MediasiService.mulaiMediasi(id_tiket, idAdmin);

    return NextResponse.json(
      {
        success: true,
        message: result.is_new
          ? 'Sesi mediasi berhasil dibuat.'
          : 'Sesi mediasi yang aktif sudah tersedia.',
        data: result,
      },
      { status: result.is_new ? 201 : 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal memulai sesi mediasi' },
      { status: 400 }
    );
  }
}