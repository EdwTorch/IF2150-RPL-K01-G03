import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ChatService } from "@/services/chat.service";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id_chatroom: string }> | { id_chatroom: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ success : false , message: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;
    const messages = await ChatService.getRiwayatPesan(params.id_chatroom, user.id);

    return NextResponse.json({ success: true,  data: messages });
  } catch (err: any) {
    const status = err.message.includes("Akses ditolak") ? 403 : 400;
    return NextResponse.json({ success : false , message: err.message }, { status });
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id_chatroom: string }> | { id_chatroom: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ success : false , message: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, status: false, message: "Body request tidak valid." },
        { status: 400 }
      );
    }

    const pesanBaru = await ChatService.kirimPesan(
      params.id_chatroom,
      user.id,
      body.isi_pesan || "",
      body.lampiran || null
    );

    return NextResponse.json({ success: true, message : "kirim pesan berhasil", data: pesanBaru }, { status: 201 });
  } catch (err: any) {
    const status = err.message.includes("Akses ditolak") ? 403 : 400;
    return NextResponse.json({ success : false , message: err.message }, { status });
  }
}