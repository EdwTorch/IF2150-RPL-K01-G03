
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { UlasanService } from "@/services/ulasan.service";

const MAKS_BERKAS = 3;

// POST: Kirim ulasan untuk pesanan yang sudah selesai
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized." },
                { status: 401 }
            );
        }

        const contentType = request.headers.get("content-type") || "";

        let id_pesanan: string;
        let rating: number;
        let komentar: string | null;
        let dokumentasi: File[] = [];

        if (contentType.includes("multipart/form-data")) {
            const formData = await request.formData();

            id_pesanan = String(formData.get("id_pesanan") || "");
            rating = Number(formData.get("rating"));
            komentar = String(formData.get("komentar") || "");

            dokumentasi = formData
                .getAll("berkas")
                .filter((item): item is File => item instanceof File);
        } else {
            const body = await request.json();

            id_pesanan = body.id_pesanan;
            rating = Number(body.rating);
            komentar = body.komentar || null;

            if (body.dokumentasi && Array.isArray(body.dokumentasi)) {
                throw new Error(
                    "Pengiriman dokumentasi harus menggunakan FormData."
                );
            }
        }

        if (!id_pesanan || !Number.isFinite(rating)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "ID pesanan dan penilaian wajib diisi.",
                },
                { status: 400 }
            );
        }

        if (dokumentasi.length > MAKS_BERKAS) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Dokumentasi ulasan maksimal ${MAKS_BERKAS} berkas.`,
                },
                { status: 400 }
            );
        }

        UlasanService.validasiRating(rating);
        UlasanService.validasiDokumentasi(dokumentasi);

        const dataUlasan = await UlasanService.simpanUlasan({
            id_pesanan,
            id_pengguna_jasa: user.id,
            rating,
            komentar,
            dokumentasi,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Ulasan berhasil dikirim!",
                data: dataUlasan,
            },
            { status: 201 }
        );
    } catch (err) {
        const pesan =
            err instanceof Error
                ? err.message
                : "Gagal membuat ulasan.";

        let status = 400;

        if (
            pesan === "Pesanan tidak ditemukan."
        ) {
            status = 404;
        } else if (
            pesan ===
            "Kamu tidak memiliki akses untuk mengulas pesanan ini."
        ) {
            status = 403;
        }

        return NextResponse.json(
            {
                success: false,
                message: pesan,
            },
            { status }
        );
    }
}

// GET: Ambil ulasan berdasarkan jasa atau rating penyedia
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const idJasa = searchParams.get("id_jasa");
        const idPenyedia =
            searchParams.get("id_penyedia") ??
            searchParams.get("id_penyedia_jasa");

        if (idPenyedia) {
            const dataPenyedia =
                await UlasanService.getRatingDanUlasanPenyedia(
                    idPenyedia
                );

            return NextResponse.json(
                {
                    success: true,
                    message: "Data rating penyedia berhasil diambil.",
                    data: dataPenyedia,
                },
                { status: 200 }
            );
        }

        if (idJasa) {
            const ulasanList =
                await UlasanService.getUlasanJasaById(idJasa);

            return NextResponse.json(
                {
                    success: true,
                    data: ulasanList,
                },
                { status: 200 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                message:
                    "Parameter id_jasa atau id_penyedia wajib diisi.",
            },
            { status: 400 }
        );
    } catch (err) {
        return NextResponse.json(
            {
                success: false,
                message:
                    err instanceof Error
                        ? err.message
                        : "Gagal mengambil ulasan.",
            },
            { status: 400 }
        );
    }
}
