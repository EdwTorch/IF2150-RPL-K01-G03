import { NextResponse } from "next/server";
import { TanggapanLaporanService } from "@/services/pelaporan.service";
import { verifyAdmin } from "@/lib/auth-admin";


/* Liat List Semua Tiket */

export async function GET() {
  try {
    await verifyAdmin();
    const semuaTiket = await TanggapanLaporanService.getAllTicketsForAdmin();

    return NextResponse.json({
      success: true,
      message : "Berhasil memuat list tiket pengaduan",
      data: semuaTiket,
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ success : false, message : "Unauthorized" }, { status: 401 });
    }
    if (error.message === "FORBIDDEN") {
      return NextResponse.json({ success : false, message : "Akses khusus Admin" }, { status: 403 });
    }
    return NextResponse.json({ success : false, message : error.message }, { status: 400 });
  }
}