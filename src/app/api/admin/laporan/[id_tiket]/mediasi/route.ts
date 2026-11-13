import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth-admin";
import { createClient } from "@/lib/supabase/server";
import { MediasiService } from "@/services/mediasi.service";

/* POST /api/admin/laporan/[id_tiket]/mediasi — Admin membuka sesi mediasi untuk tiket (C50) */
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id_tiket: string }> }) {
  try {
    const admin = await verifyAdmin();
    const { id_tiket } = await params;

    const hasil = await MediasiService.mulaiMediasi(id_tiket, admin.id);

    const supabase = await createClient();
    const { error } = await supabase.from("tiket_laporan").update({ status_tiket: "Mediasi" }).eq("id_tiket", id_tiket);
    if (error) throw new Error(`Sesi mediasi dibuat, tapi status tiket gagal diperbarui: ${error.message}`);

    return NextResponse.json(
      { success: true, message: "Sesi mediasi berhasil dibuka.", data: hasil },
      { status: hasil.is_new ? 201 : 200 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal membuka mediasi";
    if (message === "UNAUTHORIZED") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    if (message === "FORBIDDEN" || /akses ditolak/i.test(message)) {
      return NextResponse.json({ success: false, message: "Akses khusus Admin" }, { status: 403 });
    }
    return NextResponse.json({ success: false, message }, { status: /tidak ditemukan|tidak memiliki/i.test(message) ? 400 : 500 });
  }
}