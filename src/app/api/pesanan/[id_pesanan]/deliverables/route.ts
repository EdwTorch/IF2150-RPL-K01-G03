import { NextRequest, NextResponse } from "next/server";
import { DeliverablesService } from "@/services/deliverables.service";
import { belumLogin, responsGagal, userLogin, type KonteksPesanan } from "./helper";

// GET /api/pesanan/[id_pesanan]/deliverables
// Hasil pekerjaan untuk C38 (pemesan & penyedia): pesanan, kiriman terakhir, riwayat revisi, kuota
export async function GET(_request: NextRequest, { params }: KonteksPesanan) {
  try {
    const user = await userLogin();
    if (!user) return belumLogin();

    const { id_pesanan } = await params;
    const data = await DeliverablesService.getHasilPekerjaan(id_pesanan, user.id);

    return NextResponse.json({
      success: true,
      message: "Detail Hasil Pekerjaan berhasil dimuat",
      data,
      deliverable: data.deliverable, // kompatibel dengan pemanggil lama
    });
  } catch (err) {
    return responsGagal(err);
  }
}

// POST /api/pesanan/[id_pesanan]/deliverables
// Penyedia mengirim hasil pekerjaan (kiriman pertama maupun perbaikan revisi)
// Body JSON: { deskripsi_produk, berkas_hasil?: string[], file_url?: string, output_path?: string }
export async function POST(request: NextRequest, { params }: KonteksPesanan) {
  try {
    const user = await userLogin();
    if (!user) return belumLogin();

    const { id_pesanan } = await params;
    const body = await request.json().catch(() => ({}));

    const data = await DeliverablesService.submitDeliverable({
      id_pesanan,
      user_id: user.id,
      deskripsi_produk: body.deskripsi_produk,
      berkas_hasil: Array.isArray(body.berkas_hasil) ? body.berkas_hasil : undefined,
      file_url: body.file_url,
      output_path: body.output_path,
    });

    return NextResponse.json(
      { success: true, message: "Hasil pekerjaan berhasil dikumpulkan!", data },
      { status: 201 },
    );
  } catch (err) {
    return responsGagal(err);
  }
}

// PATCH /api/pesanan/[id_pesanan]/deliverables
// Pemesan konfirmasi pesanan selesai → dana diteruskan ke penyedia
export async function PATCH(_request: NextRequest, { params }: KonteksPesanan) {
  try {
    const user = await userLogin();
    if (!user) return belumLogin();

    const { id_pesanan } = await params;
    await DeliverablesService.confirmOrderComplete(id_pesanan, user.id);

    return NextResponse.json({
      success: true,
      message: "Pesanan berhasil dikonfirmasi selesai dan dana telah dicairkan!",
    });
  } catch (err) {
    return responsGagal(err);
  }
}