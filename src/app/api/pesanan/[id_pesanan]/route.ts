import { NextRequest, NextResponse } from "next/server";
import { PesananService } from "@/services/pesanan.service"; // Sesuaikan path service Anda
import { createClient } from "@/lib/supabase/server";
import { mockJasaPesananList, mockPesananList } from "@/lib/mocks/pesanan.mock";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id_pesanan: string }> }
) {
  try {
    const supabase = await createClient();
    
    // Ambil session user yang sedang login
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ success : false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action } = body;

    // Validasi input action
    if (!action || !["Diterima", "Ditolak"].includes(action)) {
      return NextResponse.json(
        { success : false, message: "Aksi tidak valid. Gunakan Tombol 'Terima' atau 'Tolak'." },
        { status: 400 }
      );
    }

    const {id_pesanan} = await params;
    // Panggil fungsi service
    await PesananService.respondOrder({
      id_pesanan: id_pesanan,
      user_id: user.id,
      action,
    });

    return NextResponse.json({
      success: true,
      message: action === "Diterima" ? "Pesanan berhasil diterima." : "Pesanan ditolak.",
    });
  } catch (error: any) {
    return NextResponse.json({ success : false, message: error.message }, { status: 500 });
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id_pesanan: string }> | { id_pesanan: string } }
) {
  try {
    const { id_pesanan } = await Promise.resolve(params);
    const data =
      process.env.NEXT_PUBLIC_USE_MOCK === "true"
        ? PesananService.ambilDetailPesananDiMemori(mockPesananList, mockJasaPesananList, id_pesanan)
        : await PesananService.ambilDetailPesanan(id_pesanan);

    return NextResponse.json({
      success: true,
      message: "Detail pesanan berhasil diambil",
      data,
    });
  } catch (error: any) {
    const status = /tidak ditemukan/i.test(error?.message) ? 404 : /tidak valid/i.test(error?.message) ? 400 : 500;
    return NextResponse.json({ success: false, message: error.message }, { status });
  }
}
