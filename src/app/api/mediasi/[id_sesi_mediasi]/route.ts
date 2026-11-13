import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/services/auth.service";
import { MediasiService } from "@/services/mediasi.service";
import { rapikanSesi, responsGagalMediasi } from "../helper";

type Params = { params: Promise<{ id_sesi_mediasi: string }> };

/* GET /api/mediasi/[id_sesi_mediasi] — detail sesi + riwayat pesan (hanya 3 peserta) */
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Silakan login terlebih dahulu." }, { status: 401 });
    }

    const { id_sesi_mediasi } = await params;
    const { sesi, pesan } = await MediasiService.getDetailDanPesanMediasi(id_sesi_mediasi, user.id);
    const sesi_rapi = rapikanSesi(sesi);
    const tiket = sesi_rapi.tiket_laporan as { id_terlapor?: string | null } | null;

    const peran_saya =
      user.id === sesi.id_admin ? "ADMIN" : user.id === tiket?.id_terlapor ? "TERLAPOR" : "PELAPOR";

    return NextResponse.json({
      success: true,
      message: "Detail mediasi berhasil diambil",
      data: { sesi: sesi_rapi, pesan, peran_saya },
    });
  } catch (err) {
    return responsGagalMediasi(err, "Gagal memuat ruang mediasi");
  }
}

/* POST /api/mediasi/[id_sesi_mediasi] — kirim pesan; pengirim diambil dari sesi login */
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Silakan login terlebih dahulu." }, { status: 401 });
    }

    const { id_sesi_mediasi } = await params;
    const body = await req.json().catch(() => ({}));
    const isi_pesan = typeof body?.isi_pesan === "string" ? body.isi_pesan : "";

    const data = await MediasiService.kirimPesanMediasi(id_sesi_mediasi, user.id, isi_pesan);

    return NextResponse.json({ success: true, message: "Pesan mediasi terkirim.", data }, { status: 201 });
  } catch (err) {
    return responsGagalMediasi(err, "Gagal mengirim pesan");
  }
}