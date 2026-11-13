import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server"; // sesuaikan path
import { NotifikasiService } from "@/services/notifikasi.service";

// 1. Dipanggil saat Navbar dimuat / lonceng ditekan -> ambil 20 notif teratas + jumlah unread
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ status : false, message: "Unauthorized" }, { status: 401 });
    }

    const result = await NotifikasiService.getNotifikasiUser(user.id);
    // result berisi { notifications: [...20 teratas], unreadCount: angka }
    return NextResponse.json({status : true,  message :"Notifikasi Berhasil Dimuat",result}, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status : false, message: error.message }, { status: 500 });
  }
}

// 2. Dipanggil saat salah satu item notif diklik -> kirim { id_notifikasi } di body
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ status : false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id_notifikasi } = body;

    if (!id_notifikasi) {
      return NextResponse.json(
        { status : false, message: "id_notifikasi wajib disertakan" },
        { status: 400 }
      );
    }

    await NotifikasiService.tandaiSudahDibaca(user.id,id_notifikasi);

    return NextResponse.json(
      { status : true,
        message: "Notifikasi ditandai sudah dibaca" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}