import { NextRequest, NextResponse } from "next/server";
import { PelaporanService } from "@/services/pelaporan.service";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/services/auth.service";

/* Ngecreate tiket laporan */
export async function POST(
  req: NextRequest,
  { params }: { params: { id_pesanan: string } }
) {
  try {
    const supabase = await createClient();
    const user = await getSessionUser();

      if (!user) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Validasi aturan bisnis: hanya pengguna jasa yang bisa melapor
      if (!user.isPenggunaJasa) {
          return NextResponse.json(
              { error: "Hanya pengguna jasa yang dapat membuat laporan." },
              { status: 403 }
          );
      }

    const body = await req.json();

    const tiketBaru = await PelaporanService.submitLaporan(
      params.id_pesanan,
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
      { error: error.message || "Gagal membuat laporan." },
      { status: 400 }
    );
  }
}