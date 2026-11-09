import { NextRequest, NextResponse } from "next/server";
import { PesananService } from "@/services/pesanan.service";
import { createClient } from "@/lib/supabase/server";
import { mockJasaPesananList, mockPesananList } from "@/lib/mocks/pesanan.mock";

const isMock = () => process.env.NEXT_PUBLIC_USE_MOCK === "true";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id_pesanan: string }> | { id_pesanan: string } }
) {
  try {
    const body = await req.json();
    const { action } = body;

    // Validasi input action
    const actLower = action?.toLowerCase();
    if (!action || !["diterima", "ditolak", "terima", "tolak"].includes(actLower)) {
      return NextResponse.json(
        { success: false, message: "Aksi tidak valid. Gunakan Tombol 'Terima' atau 'Tolak'." },
        { status: 400 }
      );
    }

    const { id_pesanan } = await Promise.resolve(params);

    if (isMock()) {
      let userId = body.user_id ?? body.id_penyedia_jasa;
      if (!userId) {
        try {
          const supabase = await createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (user) userId = user.id;
        } catch {
          // Abaikan error auth di mode mock jika tanpa session
        }
      }
      if (!userId) {
        const target = mockPesananList.find((p) => p.id_pesanan === id_pesanan);
        userId = target?.id_penyedia_jasa ?? "";
      }

      const tindakan: "terima" | "tolak" =
        actLower === "diterima" || actLower === "terima" ? "terima" : "tolak";

      const updated = PesananService.konfirmasiPesananDiMemori(
        mockPesananList,
        id_pesanan,
        userId,
        tindakan
      );

      const idx = mockPesananList.findIndex((p) => p.id_pesanan === id_pesanan);
      if (idx !== -1) {
        mockPesananList[idx] = updated;
      }

      return NextResponse.json({
        success: true,
        message: tindakan === "terima" ? "Pesanan berhasil diterima." : "Pesanan ditolak.",
        data: updated,
      });
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await PesananService.respondOrder({
      id_pesanan,
      user_id: user.id,
      action,
    });

    return NextResponse.json({
      success: true,
      message: actLower === "diterima" || actLower === "terima" ? "Pesanan berhasil diterima." : "Pesanan ditolak.",
    });
  } catch (error: any) {
    const msg = error?.message || "Terjadi kegagalan server internal";
    let status = 500;
    if (/tidak ditemukan/i.test(msg)) {
      status = 404;
    } else if (/akses ditolak|hanya penyedia|bukan penyedia|bukan milik/i.test(msg)) {
      status = 403;
    } else if (/tidak valid|wajib|sudah diproses|aksi/i.test(msg)) {
      status = 400;
    }
    return NextResponse.json({ success: false, message: msg }, { status });
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id_pesanan: string }> | { id_pesanan: string } }
) {
  try {
    const { id_pesanan } = await Promise.resolve(params);
    const data =
      isMock()
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
