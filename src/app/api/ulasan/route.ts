import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { UlasanService } from "@/services/ulasan.service";

// POST: Kirim Ulasan (Hanya butuh id_pesanan)
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
    if (error || !user) {
        return NextResponse.json({ success : false, message: "Unauthorized" }, { status: 401 });
      }
    const userId = user.id; 
    const body = await request.json();
    const { id_pesanan, rating, komentar, dokumentasi_url } = body;

    // Validasi input minimal
    if (!id_pesanan || !rating) {
      return NextResponse.json(
        { success: false, message: "ID pesanan dan penilaian (rating) wajib diisi." },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: "Rating harus bernilai antara 1 sampai 5." },
        { status: 400 }
      );
    }

    const dataUlasan = await UlasanService.simpanUlasan({
      id_pesanan,
      id_pengguna_jasa: userId,
      rating,
      komentar: komentar || null,
      dokumentasi : dokumentasi_url || null,
    });

    return NextResponse.json(
      { success: true, message: "Ulasan berhasil dikirim!", data: dataUlasan },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Gagal membuat ulasan." },
      { status: 400 }
    );
  }
}

// GET: Ambil Daftar Ulasan Berdasarkan Jasa
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idJasa = searchParams.get("id_jasa");

    if (!idJasa) {
      return NextResponse.json(
        { success: false, message: "Parameter id_jasa wajib diisi." },
        { status: 400 }
      );
    }

    const ulasanList = await UlasanService.getUlasanJasaById(idJasa);

    return NextResponse.json(
      { success: true, data: ulasanList },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Gagal mengambil ulasan." },
      { status: 400 }
    );
  }
}