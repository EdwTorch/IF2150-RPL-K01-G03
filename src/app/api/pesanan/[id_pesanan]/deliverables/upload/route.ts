import { NextRequest, NextResponse } from "next/server";
import { DeliverablesService } from "@/services/deliverables.service";
import { belumLogin, responsGagal, userLogin, type KonteksPesanan } from "../helper";

// POST /api/pesanan/[id_pesanan]/deliverables/upload
// Multipart field "berkas" (satu berkas). Respons: { data: { url } } untuk dikirim ke POST deliverables / revisi
export async function POST(request: NextRequest, { params }: KonteksPesanan) {
  try {
    const user = await userLogin();
    if (!user) return belumLogin();

    const { id_pesanan } = await params;
    // Hanya pemesan/penyedia pesanan ini yang boleh mengunggah
    await DeliverablesService.validasiOwnerPesanan(id_pesanan, user.id);

    const form = await request.formData().catch(() => null);
    if (!form) {
      return NextResponse.json({ success: false, message: "Body harus multipart/form-data" }, { status: 400 });
    }

    const berkas = form.get("berkas");
    if (!(berkas instanceof File) || berkas.size === 0) {
      return NextResponse.json({ success: false, message: "Berkas tidak ditemukan atau kosong" }, { status: 400 });
    }

    const url = await DeliverablesService.unggahBerkasDeliverable(berkas);
    return NextResponse.json(
      { success: true, message: "Berkas deliverable berhasil diunggah", data: { url } },
      { status: 201 },
    );
  } catch (err) {
    return responsGagal(err);
  }
}