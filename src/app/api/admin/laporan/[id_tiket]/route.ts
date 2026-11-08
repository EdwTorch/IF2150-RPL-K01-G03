import { NextRequest, NextResponse } from "next/server";
import { TanggapanLaporanService } from "@/services/pelaporan.service";
import { verifyAdmin } from "@/lib/auth-admin";

/* Detail Tiket di Atmint */
export async function GET(
  req: NextRequest,
  { params }: { params: { id_tiket: string } }
) {
  try {
    await verifyAdmin();
    const detailTiket = await TanggapanLaporanService.getDetailTiketAdmin(
      params.id_tiket
    );

    return NextResponse.json({
      success: true,
      message : "Berhasil Memuat Detail Tiket",
      data: detailTiket,
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ success : false, message : "Unauthorized" }, { status: 401 });
    }
    if (error.message === "FORBIDDEN") {
      return NextResponse.json({ success : false, message : "Akses khusus Admin" }, { status: 403 });
    }
    return NextResponse.json({ success : false , message : error.message }, { status: 400 });
  }
}