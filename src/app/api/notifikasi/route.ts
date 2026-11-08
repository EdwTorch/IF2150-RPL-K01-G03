import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { NotifikasiService } from "@/services/notifikasi.service";

/* Dapetin Notifikasinya */ 
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ success : false, message: "Unauthorized" }, { status: 401 });
    }

    const hasil = await NotifikasiService.getNotifikasiUser(user.id);
    return NextResponse.json({ success: true, data: hasil });
  } catch (err: any) {
    return NextResponse.json({ success : false, message: err.message }, { status: 500 });
  }
}

/* ngubah is_read nya jadi true (udah dibaca) */
export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ success : false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    await NotifikasiService.tandaiSudahDibaca(user.id, body.id_notifikasi);

    return NextResponse.json({
      success: true,
      message: "Notifikasi ditandai sudah dibaca.",
    });
  } catch (err: any) {
    return NextResponse.json({ success : false, message: err.message }, { status: 500 });
  }
}