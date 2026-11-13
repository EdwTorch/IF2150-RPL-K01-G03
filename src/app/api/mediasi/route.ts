import { NextResponse } from "next/server";
import { getSessionUser } from "@/services/auth.service";
import { MediasiService } from "@/services/mediasi.service";
import { rapikanSesi, responsGagalMediasi } from "./helper";

/* GET /api/mediasi — daftar ruang mediasi yang diikuti user login (admin, pelapor, atau terlapor) */
export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Silakan login terlebih dahulu." }, { status: 401 });
    }

    const daftar = await MediasiService.getDaftarMediasiUser(user.id);

    return NextResponse.json({
      success: true,
      message: "Daftar mediasi berhasil diambil",
      data: daftar.map((sesi: Record<string, unknown>) => rapikanSesi(sesi)),
    });
  } catch (err) {
    return responsGagalMediasi(err, "Gagal mengambil daftar mediasi");
  }
}