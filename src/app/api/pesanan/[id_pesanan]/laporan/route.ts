import { NextRequest, NextResponse } from "next/server";
import { PelaporanService } from "@/services/pelaporan.service";
import { createClient } from "@/lib/supabase/server";

/* Ngecreate tiket laporan */
export async function POST(
  req: NextRequest,
  { params }: { params: { id_pesanan: string } }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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