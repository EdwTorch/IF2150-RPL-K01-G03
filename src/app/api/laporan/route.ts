import { NextRequest, NextResponse } from "next/server";
import { PelaporanService } from "@/services/pelaporan.service";
import { createClient } from "@/lib/supabase/server";

/* Liat Semua Daftar Tiket */ 
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success : false, message: "Unauthorized" }, { status: 401 });
    }

    const daftarTiket = await PelaporanService.getTicketsByUser(user.id);

    return NextResponse.json({
      success: true,
      message : "Daftar Tiket Berhasil dimuat",
      data: daftarTiket,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success : false, message: error.message || "Gagal mengambil daftar tiket." },
      { status: 400 }
    );
  }
}