// src/app/api/deliverable/route.ts
import { NextResponse } from "next/server";
import { DeliverablesService } from "@/services/deliverables.service";
import { createClient } from "@/lib/supabase/server";

/**
 * Helper internal untuk menerjemahkan error teknis menjadi pesan ramah pengguna.
 */
function handleCustomError(err: any): string {
  const raw_message = err.message || "";

  // 1. Error dari validasi manual buatan sendiri (throw new Error(...))
  if (
    raw_message.includes("tidak boleh kosong") ||
    raw_message.includes("Unggah berkas") ||
    raw_message.includes("belum dikumpulkan")
  ) {
    return raw_message;
  }

  // 2. Error bawaan Supabase / PostgreSQL
  if (raw_message.includes("violates foreign key constraint")) {
    return "Data pesanan tidak ditemukan di sistem.";
  }
  if (raw_message.includes("violates not-null constraint")) {
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
        
        const{data : {user},error : auth_error,} = await supabase.auth.getUser();
        if (!user || auth_error){
            return NextResponse.json({success : false, error : "Anda belum login"}, {status : 401});
        }
        const user_id = user.id;
        const { searchParams } = new URL(request.url);
        const id_pesanan = searchParams.get("id_pesanan");

        if (!id_pesanan) {
        return NextResponse.json(
            { success: false, error: "Parameter id_pesanan wajib diisi." },
            { status: 400 }
        );
        }

        const deliverable = await DeliverablesService.getDeliverableByPesanan(id_pesanan, user_id);
        return NextResponse.json({ success: true, deliverable }, { status: 200 });
    } catch (err: any) {
        const clean_error = handleCustomError(err);
        return NextResponse.json(
        { success: false, error: clean_error },
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
    const { id_pesanan, deskripsi_produk, file_url, output_path } = body;

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
      output_path,
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
    const clean_error = handleCustomError(err);
    return NextResponse.json(
      { success: false, error: clean_error },
      { status: 400 }
    );
  }
}


