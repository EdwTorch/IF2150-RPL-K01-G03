import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ChatService } from "@/services/chat.service";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rooms = await ChatService.getDaftarChatroom(user.id);
    return NextResponse.json({ success: true, data: rooms });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    // Jika pembeli yang klik chat penyedia, id_pengguna_jasa = user.id
    const id_pengguna_jasa = body.id_pengguna_jasa || user.id;
    const id_penyedia_jasa = body.id_penyedia_jasa;

    if (!id_penyedia_jasa) {
      return NextResponse.json({ error: "id_penyedia_jasa wajib diisi." }, { status: 400 });
    }

    const room = await ChatService.getOrCreateChatroom(id_pengguna_jasa, id_penyedia_jasa);
    return NextResponse.json({ success: true, data: room });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}