import { NextRequest, NextResponse } from "next/server";
import { TanggapanLaporanService } from "@/services/pelaporan.service";
import { verifyAdmin } from "@/lib/auth-admin";

/* Ngepost Tanggapan */ 
export async function POST(
  req: NextRequest,
  { params }: { params: { id_tiket: string } }
) {
  try {
    const admin = await verifyAdmin();
    const body = await req.json();

    const hasilTanggapan = await TanggapanLaporanService.catatKeputusanTindakan({
      id_tiket: params.id_tiket,
      id_admin: admin.id,
      jenis_tindakan: body.jenis_tindakan,
      catatan_tanggapan: body.catatan_tanggapan,
    });

    return NextResponse.json({
      success: true,
      message: "Keputusan tindakan dan tanggapan berhasil disimpan.",
      data: hasilTanggapan,
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Akses khusus Admin" }, { status: 403 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}