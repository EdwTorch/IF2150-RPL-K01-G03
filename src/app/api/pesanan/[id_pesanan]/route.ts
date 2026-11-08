import { NextRequest, NextResponse } from "next/server";
import { PesananService } from "@/services/pesanan.service"; // Sesuaikan path service Anda
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id_pesanan: string } }
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

    // Panggil fungsi service
    await PesananService.respondOrder({
      id_pesanan: params.id_pesanan,
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