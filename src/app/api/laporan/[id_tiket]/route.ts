import { NextRequest, NextResponse } from "next/server";
import { PelaporanService } from "@/services/pelaporan.service";
import { createClient } from "@/lib/supabase/server";

/*
Lihat Detail Tiket dan Tanggapan Atmint
*/
export async function GET(
  req: NextRequest,
  { params }: { params: { id_tiket: string } }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success : false, message : "Unauthorized" }, { status: 401 });
    }

    const detailTiket = await PelaporanService.getDetailTiket(
      params.id_tiket,
      user.id
    );

    return NextResponse.json({
      success: true,
      message : "Detail Tiket Berhasil Dimuat",
      data: detailTiket,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success : false, message: error.message || "Gagal mengambil detail tiket." },
      { status: 400 }
    );
  }
}