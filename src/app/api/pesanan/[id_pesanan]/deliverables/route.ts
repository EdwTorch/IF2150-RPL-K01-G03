import { NextRequest, NextResponse } from "next/server";
import { DeliverablesService } from "@/services/deliverables.service";
import { createClient } from "@/lib/supabase/server";

/**
 * Helper internal untuk menerjemahkan error teknis & validasi service.
 */
function handleCustomError(err: any): { message: string; status: number } {
  const raw_message = err.message || "";

  if (raw_message.includes("Akses ditolak")) {
    return { message: raw_message, status: 403 };
  }

  if (
    raw_message.includes("Pesanan tidak ditemukan") ||
    raw_message.includes("Hasil pekerjaan tidak ditemukan") ||
    raw_message.includes("Hasil Pekerjaan tidak ditemukan")
  ) {
    return { message: raw_message, status: 404 };
  }

  if (
    raw_message.includes("tidak boleh kosong") ||
    raw_message.includes("Unggah berkas") ||
        raw_message.includes("Gagal mengonfirmasi") ||
    raw_message.includes("belum dikumpulkan") ||
    raw_message.includes("sudah diselesaikan sebelumnya") ||
    raw_message.includes("Kuota revisi") ||
    raw_message.includes("Pengajuan revisi")
  ) {
    return { message: raw_message, status: 400 };
  }

  if (raw_message.includes("violates foreign key constraint")) {
    return {
      message: "Data pesanan tidak ditemukan di sistem.",
      status: 404,
    };
  }

  if (raw_message.includes("violates not-null constraint")) {
    return {
      message: "Data yang dikirimkan kurang lengkap.",
      status: 400,
    };
  }

  console.error("Deliverables API error:", err);

  return {
    message: "Terjadi kesalahan pada sistem. Silakan coba beberapa saat lagi.",
    status: 500,
  };
}

// ----------------------------------------------------------------------
// 1. GET /api/pesanan/[id_pesanan]/deliverables
// Mengambil hasil pekerjaan, riwayat revisi, dan seluruh lampiran.
// ----------------------------------------------------------------------

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{ id_pesanan: string }> | { id_pesanan: string };
  }
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: auth_error,
    } = await supabase.auth.getUser();

    if (!user || auth_error) {
      return NextResponse.json(
        { success: false, message: "Anda belum login." },
        { status: 401 }
      );
    }

    const { id_pesanan } = await context.params;

    const [
      deliverable,
      riwayatRevisi,
      lampiranRevisi,
      lampiranPengajuanRevisi,
    ] = await Promise.all([
      DeliverablesService.getDeliverableByPesanan(
        id_pesanan,
        user.id
      ),
      DeliverablesService.getRevisionHistory(
        id_pesanan,
        user.id
      ),
      DeliverablesService.getRevisionAttachments(
        id_pesanan,
        user.id
      ),
      DeliverablesService.getRevisionRequestAttachments(
        id_pesanan,
        user.id
      ),
    ]);

    const { data: pesanan, error: pesananError } = await supabase
      .from("pesanan")
      .select(`
        status_pesanan,
        jasa (
          nama_jasa
        )
      `)
      .eq("id_pesanan", id_pesanan)
      .single();

    if (pesananError || !pesanan) {
      throw new Error("Pesanan tidak ditemukan.");
    }

    // Riwayat revisi diurutkan dari yang terbaru oleh service.
    const revisiTerbaru = riwayatRevisi[0] ?? null;

    // Hanya revisi TERBARU yang boleh dianggap sedang aktif.
    const revisiAktif =
      revisiTerbaru?.status_pengerjaan === "Sedang Direvisi"
        ? revisiTerbaru
        : null;

    const namaJasa =
      (pesanan.jasa as any)?.nama_jasa || "Pesanan";

    return NextResponse.json(
      {
        success: true,
        message: "Detail hasil pekerjaan berhasil dimuat.",
        data: {
          deliverable,
          nama_jasa: namaJasa,
          status_pesanan: pesanan.status_pesanan,

          revisi_terbaru: revisiTerbaru,
          revisi_aktif: revisiAktif,
          riwayat_revisi: riwayatRevisi,

          // Lampiran hasil revisi yang dikirim penyedia.
          lampiran_revisi: lampiranRevisi,

          // Lampiran yang diunggah pengguna saat mengajukan revisi.
          lampiran_pengajuan_revisi: lampiranPengajuanRevisi,

          kuota_revisi:
            revisiTerbaru?.jml_revisi_tersedia ?? 3,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    const { message, status } = handleCustomError(err);

    return NextResponse.json(
      { success: false, message },
      { status }
    );
  }
}

// ----------------------------------------------------------------------
// 2. POST /api/pesanan/[id_pesanan]/deliverables
// Penyedia jasa mengirim hasil pekerjaan pertama kali.
// ----------------------------------------------------------------------

export async function POST(
  request: NextRequest,
  context: {
    params: Promise<{ id_pesanan: string }> | { id_pesanan: string };
  }
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: auth_error,
    } = await supabase.auth.getUser();

    if (!user || auth_error) {
      return NextResponse.json(
        { success: false, message: "Anda belum login." },
        { status: 401 }
      );
    }

    const { id_pesanan } = await context.params;
    const body = await request.json();

    const { deskripsi_produk, file_url, output_path } = body;

    await DeliverablesService.validasiOwnerPesanan(
      id_pesanan,
      user.id
    );

    const result = await DeliverablesService.submitDeliverable({
      id_pesanan,
      deskripsi_produk,
      file_url,
      output_path,
    });

    return NextResponse.json(
      { success: true, message: "Hasil pekerjaan berhasil dikumpulkan!", data: result },
      { status: 201 },
    );
  } catch (err: any) {
    const { message, status } = handleCustomError(err);

    return NextResponse.json(
      { success: false, message },
      { status }
    );
  }
}

// ----------------------------------------------------------------------
// 3. PATCH /api/pesanan/[id_pesanan]/deliverables
// Pengguna jasa mengonfirmasi pesanan selesai.
// ----------------------------------------------------------------------

export async function PATCH(
  request: NextRequest,
  context: {
    params: Promise<{ id_pesanan: string }> | { id_pesanan: string };
  }
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: auth_error,
    } = await supabase.auth.getUser();

    if (!user || auth_error) {
      return NextResponse.json(
        { success: false, message: "Anda belum login." },
        { status: 401 }
      );
    }

    const { id_pesanan } = await context.params;

    await DeliverablesService.confirmOrderComplete(
      id_pesanan,
      user.id
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "Pesanan berhasil dikonfirmasi selesai dan dana telah dicairkan!",
      },
      { status: 200 }
    );
  } catch (err: any) {
    const { message, status } = handleCustomError(err);

    return NextResponse.json(
      { success: false, message },
      { status }
    );
  }
}