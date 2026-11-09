import { NextRequest, NextResponse } from "next/server";
import { DeliverablesService } from "@/services/deliverables.service";
import { createClient } from "@/lib/supabase/server";

// GET: Ambil semua daftar/riwayat revisi
// app/api/pesanan/[id_pesanan]/deliverables/revisi/route.ts

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id_pesanan: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success : false, message: "Unauthorized" }, { status: 401 });
    }

    // Ambil riwayat revisi
    const {id_pesanan} = await params;
    const listRevisi = await DeliverablesService.getRevisionHistory(
      id_pesanan,
      user.id
    );

    // Ambil berkas deliverables paling baru (atau semua berkas)
    const deliverableTerbaru = await DeliverablesService.getDeliverableByPesanan(
      id_pesanan,
      user.id
    );

    return NextResponse.json({
      success: true,
      data: {
        revisi: listRevisi,
        deliverable_aktif: deliverableTerbaru,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success : false, message: error.message }, { status: 400 });
  }
}

// POST: Ajukan revisi baru (Pembeli) ATAU Kirim perbaikan revisi (Penjual)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id_pesanan: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success : false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {id_pesanan}  = await params;
    // Skenario A: Penjual mengirim perbaikan revisi (di Halaman Form Revisi)
    if (body.action === "submit_revision") {
      const result = await DeliverablesService.submitRevisionFix({
        id_pesanan: id_pesanan,
        deskripsi_produk: body.deskripsi_produk,
        file_url: body.file_url,
        output_path: body.output_path,
        user_id: user.id,
      });

      return NextResponse.json({
        success: true,
        message: "Hasil perbaikan revisi berhasil dikumpulkan.",
        data: result,
      });
    }

    // Skenario B: Pembeli mengajukan komplain revisi baru
    const result = await DeliverablesService.requestRevision({
      id_pesanan: id_pesanan,
      deskripsi_revisi: body.deskripsi_revisi,
      lampiran_revisi: body.lampiran_revisi,
      id_produk_akhir: body.id_produk_akhir,
      user_id: user.id,
    });

    return NextResponse.json({
      success: true,
      message: "Pengajuan revisi berhasil dikirim.",
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json({ success : false, message: error.message }, { status: 400 });
  }
}