import { NextRequest, NextResponse } from "next/server";
import { PelaporanService } from "@/services/pelaporan.service";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/services/auth.service";

/* Ngecreate tiket laporan */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id_pesanan: string }> }
) {
  try {
    const supabase = await createClient();
    const user = await getSessionUser();

      if (!user) {
          return NextResponse.json({ success : false, message: "Unauthorized" }, { status: 401 });
      }

      // Validasi aturan bisnis: hanya pengguna jasa yang bisa melapor
      if (!user.isPenggunaJasa) {
          return NextResponse.json(
              { success : false, message: "Hanya pengguna jasa yang dapat membuat laporan." },
              { status: 403 }
          );
      }

    const body = await req.json();
    const {id_pesanan} = await params;
    const tiketBaru = await PelaporanService.submitLaporan(
      id_pesanan,
      user.id,
      {
        kategori: body.kategori,
        deskripsi_laporan: body.deskripsi_laporan,
        url_bukti: body.url_bukti,
      }
    );

    return NextResponse.json({
      success: true,
      message: "Tiket laporan berhasil dikirim.",
      data: tiketBaru,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success : false, message : error.message || "Gagal membuat laporan." },
      { status: 400 }
    );
  }
}