import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth-admin";
import { MediasiService } from "@/services/mediasi.service";
import { responsGagalMediasi } from "@/app/api/mediasi/helper";

type Params = { params: Promise<{ id_sesi_mediasi: string }> };

/* PATCH /api/admin/mediasi/[id_sesi_mediasi]/selesai — admin menutup ruang mediasi */
export async function PATCH(_req: NextRequest, { params }: Params) {
  try {
    const admin = await verifyAdmin();
    const { id_sesi_mediasi } = await params;

    const data = await MediasiService.selesaikanMediasi(id_sesi_mediasi, admin.id);

    return NextResponse.json({ success: true, message: "Sesi mediasi telah diakhiri.", data });
  } catch (err) {
    return responsGagalMediasi(err, "Gagal mengakhiri mediasi");
  }
}