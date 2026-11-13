import { NextRequest, NextResponse } from "next/server";
import { DeliverablesService } from "@/services/deliverables.service";
import { belumLogin, responsGagal, userLogin, type KonteksPesanan } from "../helper";

// GET /api/pesanan/[id_pesanan]/deliverables/revisi — riwayat revisi + kiriman terakhir + kuota
export async function GET(_req: NextRequest, { params }: KonteksPesanan) {
  try {
    const user = await userLogin();
    if (!user) return belumLogin();

    const { id_pesanan } = await params;
    const hasil = await DeliverablesService.getHasilPekerjaan(id_pesanan, user.id);

    return NextResponse.json({
      success: true,
      message: "Riwayat revisi berhasil dimuat",
      data: {
        revisi: hasil.revisi,
        revisi_aktif: hasil.revisi_aktif,
        deliverable_aktif: hasil.deliverable,
        kuota_revisi: hasil.kuota_revisi,
      },
    });
  } catch (err) {
    return responsGagal(err);
  }
}

// POST /api/pesanan/[id_pesanan]/deliverables/revisi
//  - Pemesan mengajukan revisi: { deskripsi_revisi, pesan_revisi?, lampiran_revisi?, id_produk_akhir? }
//  - Penyedia mengirim perbaikan: { action: "submit_revision", deskripsi_produk, berkas_hasil?, output_path? }
export async function POST(req: NextRequest, { params }: KonteksPesanan) {
  try {
    const user = await userLogin();
    if (!user) return belumLogin();

    const { id_pesanan } = await params;
    const body = await req.json().catch(() => ({}));

    if (body.action === "submit_revision") {
      const data = await DeliverablesService.submitRevisionFix({
        id_pesanan,
        user_id: user.id,
        deskripsi_produk: body.deskripsi_produk,
        berkas_hasil: Array.isArray(body.berkas_hasil) ? body.berkas_hasil : undefined,
        file_url: body.file_url,
        output_path: body.output_path,
      });
      return NextResponse.json(
        { success: true, message: "Hasil perbaikan revisi berhasil dikumpulkan.", data },
        { status: 201 },
      );
    }

    const data = await DeliverablesService.requestRevision({
      id_pesanan,
      user_id: user.id,
      deskripsi_revisi: body.deskripsi_revisi,
      pesan_revisi: body.pesan_revisi,
      lampiran_revisi: body.lampiran_revisi,
      id_produk_akhir: body.id_produk_akhir,
    });

    return NextResponse.json(
      { success: true, message: "Pengajuan revisi berhasil dikirim.", data },
      { status: 201 },
    );
  } catch (err) {
    return responsGagal(err);
  }
}