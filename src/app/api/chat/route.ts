import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ChatService } from "@/services/chat.service";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ status : false , message: "Unauthorized" }, { status: 401 });
    }

    const rooms = await ChatService.getDaftarChatroom(user.id);
    return NextResponse.json({ success: true, data: rooms });
  } catch (err: any) {
    return NextResponse.json({ status : false , message: err.message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ status : false , message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ status : false , message: "Body request tidak valid." }, { status: 400 });
    }

    const id_pengguna_jasa = body.id_pengguna_jasa || user.id;
    const id_penyedia_jasa = body.id_penyedia_jasa;

    if (!id_pengguna_jasa || !id_penyedia_jasa) {
      return NextResponse.json(
        { status : false , message: "id_pengguna_jasa dan id_penyedia_jasa wajib diisi." },
        { status: 400 }
      );
    }

    // Cegah membuat room dengan diri sendiri
    if (id_pengguna_jasa === id_penyedia_jasa) {
      return NextResponse.json(
        { status : false , message: "Tidak dapat membuat ruang obrolan dengan diri sendiri." },
        { status: 400 }
      );
    }

    // Validasi otorisasi: user yang login HARUS salah satu pihak dalam room
    if (user.id !== id_pengguna_jasa && user.id !== id_penyedia_jasa) {
      return NextResponse.json(
        { status : false , message: "Forbidden. Anda tidak berhak membuat ruang obrolan untuk akun lain." },
        { status: 403 }
      );
    }

    const room = await ChatService.getOrCreateChatroom(id_pengguna_jasa, id_penyedia_jasa);
    return NextResponse.json({ success: true, message: "Chat dibuka", data: room });
  } catch (err: any) {
    return NextResponse.json({ status : false , message: err.message }, { status: 400 });
  }
}