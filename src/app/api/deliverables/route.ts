// src/app/api/deliverable/route.ts
import { NextResponse } from "next/server";
import { DeliverablesService } from "@/services/deliverables.service";
import { createClient } from "@/lib/supabase/server";

/**
 * Helper internal untuk menerjemahkan error teknis menjadi pesan ramah pengguna.
 */
function handleCustomError(err: any): string {
  const rawMessage = err.message || "";

  // 1. Error dari validasi manual buatan sendiri (throw new Error(...))
  if (
    rawMessage.includes("tidak boleh kosong") ||
    rawMessage.includes("Unggah berkas") ||
    rawMessage.includes("belum dikumpulkan")
  ) {
    return rawMessage;
  }

  // 2. Error bawaan Supabase / PostgreSQL
  if (rawMessage.includes("violates foreign key constraint")) {
    return "Data pesanan tidak ditemukan di sistem.";
  }
  if (rawMessage.includes("violates not-null constraint")) {
    return "Data yang dikirimkan kurang lengkap.";
  }

  // 3. Error umum / Server error
  return "Terjadi kesalahan pada sistem. Silakan coba beberapa saat lagi.";
}

// ----------------------------------------------------------------------
// 1. GET: Ambil Detail Hasil Pekerjaan untuk Dilihat Pembeli (I-14)
// ----------------------------------------------------------------------
export async function GET(request: Request) {
    try{
        const supabase = await createClient()
        
        const{data : {user},error : authError,} = await supabase.auth.getUser();
        if (!user || authError){
            return NextResponse.json({success : false, error : "Anda belum login"}, {status : 401});
        }
        const userId = user.id;
        const { searchParams } = new URL(request.url);
        const idPesanan = searchParams.get("id_pesanan");

        if (!idPesanan) {
        return NextResponse.json(
            { success: false, error: "Parameter id_pesanan wajib diisi." },
            { status: 400 }
        );
        }

        const data = await DeliverablesService.getDeliverableByPesanan(idPesanan, userId);
        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (err: any) {
        const cleanError = handleCustomError(err);
        return NextResponse.json(
        { success: false, error: cleanError },
        { status: 400 }
        );
    }
}


// ----------------------------------------------------------------------
// 2. POST: Penyedia Jasa Mengirim Hasil Pekerjaan Pertama Kali (I-13)
// ----------------------------------------------------------------------
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id_pesanan, deskripsi_produk, file_url, outputpath } = body;

    if (!id_pesanan) {
      return NextResponse.json(
        { success: false, error: "Identitas pesanan tidak valid." },
        { status: 400 }
      );
    }

    const result = await DeliverablesService.submitDeliverable({
      id_pesanan,
      deskripsi_produk,
      file_url,
      outputpath,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Hasil pekerjaan berhasil dikumpulkan!",
        data: result,
      },
      { status: 201 }
    );
  } catch (err: any) {
    const cleanError = handleCustomError(err);
    return NextResponse.json(
      { success: false, error: cleanError },
      { status: 400 }
    );
  }
}

// ----------------------------------------------------------------------
// 3. PATCH: Pengguna Jasa Menyetujui / Konfirmasi Selesai Pesanan (I-14)
// ----------------------------------------------------------------------
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id_pesanan } = body;

    if (!id_pesanan) {
      return NextResponse.json(
        { success: false, error: "Identitas pesanan tidak valid." },
        { status: 400 }
      );
    }
    const supabase = await createClient()
        
        const{data : {user},error : authError,} = await supabase.auth.getUser();
        if (!user || authError){
            return NextResponse.json({success : false, error : "Anda belum login"}, {status : 401});
        }
    const userId = user.id;
    await DeliverablesService.confirmOrderComplete(id_pesanan,userId);

    return NextResponse.json(
      {
        success: true,
        message: "Pesanan berhasil dikonfirmasi selesai dan dana telah dicairkan!",
      },
      { status: 200 }
    );
  } catch (err: any) {
    const cleanError = handleCustomError(err);
    return NextResponse.json(
      { success: false, error: cleanError },
      { status: 400 }
    );
  }
}