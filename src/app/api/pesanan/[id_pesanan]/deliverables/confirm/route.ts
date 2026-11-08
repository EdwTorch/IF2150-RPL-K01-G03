import { NextRequest, NextResponse } from "next/server";
import { DeliverablesService } from "@/services/deliverables.service"; // Sesuaikan path service Anda
import { createClient } from "@/lib/supabase/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id_pesanan: string } }
) {
  try {
    const supabase = await createClient();

    // 1. Ambil session user yang sedang login dari Supabase Auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success : false, message: "Anda harus login terlebih dahulu." },
        { status: 401 }
      );
    }

    // 2. Panggil fungsi service confirmOrderComplete yang sudah Anda buat
    await DeliverablesService.confirmOrderComplete(params.id_pesanan, user.id);

    // 3. Kembalikan respon sukses ke Frontend
    return NextResponse.json({
      success: true,
      message: "Pesanan berhasil diselesaikan.",
    });
  } catch (error: any) {
    // Tangkap error jika validasi owner gagal atau ada masalah di Supabase
    return NextResponse.json(
      { success : false, message: error.message || "Gagal menyelesaikan pesanan." },
      { status: 400 }
    );
  }
}