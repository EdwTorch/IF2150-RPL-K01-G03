import { NextRequest, NextResponse } from "next/server";
import { TanggapanLaporanService } from "@/services/pelaporan.service";
import { verifyAdmin } from "@/lib/auth-admin";

/* Ngepost Tanggapan */ 
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id_tiket: string }> }
) {
  try {
    const admin = await verifyAdmin();
    const body = await req.json();

    const {id_tiket} = await params;
    const hasilTanggapan = await TanggapanLaporanService.catatKeputusanTindakan({
      id_tiket: id_tiket,
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
      return NextResponse.json(
        { 
          success : false,
          message : "Unauthorized" 
        }, 
        { status: 401 });
    }


    if (error.message === "FORBIDDEN") {
      return NextResponse.json({ success : false, message : "Akses khusus Admin" }, { status: 403 });
    }
    return NextResponse.json({ success : false , message : error.message }, { status: 400 });
  }
}