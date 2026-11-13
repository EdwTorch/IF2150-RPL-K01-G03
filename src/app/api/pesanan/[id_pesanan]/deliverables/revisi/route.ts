import { NextRequest, NextResponse } from "next/server";
import { DeliverablesService } from "@/services/deliverables.service";
import { SupabaseStorageService } from "@/services/storage/supabase.storage";
import { createClient } from "@/lib/supabase/server";

const MAX_BERKAS = 3;
const MAX_UKURAN = 10 * 1024 * 1024;

const FORMAT_BERKAS = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  pdf: "application/pdf",
} as const;

type EkstensiBerkas = keyof typeof FORMAT_BERKAS;

function normalisasiTautan(input: string): string {
  const nilai = input.trim();

  if (!nilai) return "";

  return /^[a-z][a-z\d+.-]*:\/\//i.test(nilai)
    ? nilai
    : `https://${nilai}`;
}

function validasiTautan(input: string): string | null {
  if (!input.trim()) return null;

  try {
    const url = new URL(normalisasiTautan(input));

    if (
      !["http:", "https:"].includes(url.protocol) ||
      !url.hostname.includes(".")
    ) {
      return "Format tautan tidak valid.";
    }

    return null;
  } catch {
    return "Format tautan tidak valid.";
  }
}

async function validasiBerkas(file: File): Promise<string | null> {
  if (file.size > MAX_UKURAN) {
    return `${file.name} melebihi batas 10 MB.`;
  }

  const ekstensi = file.name.split(".").pop()?.toLowerCase();

  if (!ekstensi || !(ekstensi in FORMAT_BERKAS)) {
    return `${file.name}: format hanya boleh JPG, JPEG, PNG, atau PDF.`;
  }

  const tipe = FORMAT_BERKAS[ekstensi as EkstensiBerkas];

  if (file.type && file.type !== tipe) {
    return `${file.name}: tipe berkas tidak sesuai dengan ekstensinya.`;
  }

  const buffer = new Uint8Array(await file.arrayBuffer());

  const isJpg =
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff;

  const isPng =
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a;

  const isPdf =
    buffer.length >= 5 &&
    String.fromCharCode(...buffer.slice(0, 5)) === "%PDF-";

  const valid =
    (tipe === "image/jpeg" && isJpg) ||
    (tipe === "image/png" && isPng) ||
    (tipe === "application/pdf" && isPdf);

  if (!valid) {
    return `${file.name}: isi berkas tidak sesuai dengan formatnya.`;
  }

  return null;
}

// GET: Ambil riwayat revisi, deliverable terbaru,
// dan seluruh lampiran hasil revisi.
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id_pesanan: string }> }
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id_pesanan } = await params;

    const listRevisi = await DeliverablesService.getRevisionHistory(
      id_pesanan,
      user.id
    );

    const deliverableTerbaru =
      await DeliverablesService.getDeliverableByPesanan(
        id_pesanan,
        user.id
      );

    const lampiranRevisi =
      await DeliverablesService.getRevisionAttachments(
        id_pesanan,
        user.id
      );

    return NextResponse.json({
      success: true,
      data: {
        revisi: listRevisi,
        deliverable_aktif: deliverableTerbaru,
        lampiran_revisi: lampiranRevisi,
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Gagal mengambil riwayat revisi.";

    return NextResponse.json(
      { success: false, message },
      { status: 400 }
    );
  }
}

// POST:
// 1. Pengajuan revisi oleh pengguna: JSON.
// 2. Pengumpulan hasil revisi oleh penyedia: FormData.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id_pesanan: string }> }
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id_pesanan } = await params;
    const contentType = req.headers.get("content-type") || "";

    // SKENARIO A: Penyedia mengumpulkan hasil revisi.
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      const action = formData.get("action");
      const deskripsi = formData.get("deskripsi_produk");
      const tautan = formData.get("tautan");

      if (action !== "submit_revision") {
        return NextResponse.json(
          { success: false, message: "Action tidak valid." },
          { status: 400 }
        );
      }

      if (typeof deskripsi !== "string" || !deskripsi.trim()) {
        return NextResponse.json(
          {
            success: false,
            message: "Deskripsi hasil revisi wajib diisi.",
          },
          { status: 400 }
        );
      }

      if (tautan !== null && typeof tautan !== "string") {
        return NextResponse.json(
          { success: false, message: "Format tautan tidak valid." },
          { status: 400 }
        );
      }

      const tautanInput =
        typeof tautan === "string" ? tautan.trim() : "";

      const errorTautan = validasiTautan(tautanInput);

      if (errorTautan) {
        return NextResponse.json(
          { success: false, message: errorTautan },
          { status: 400 }
        );
      }

      const berkas = formData
        .getAll("berkas")
        .filter((item): item is File => item instanceof File);

      if (berkas.length > MAX_BERKAS) {
        return NextResponse.json(
          {
            success: false,
            message: `Maksimal ${MAX_BERKAS} berkas yang dapat diunggah.`,
          },
          { status: 400 }
        );
      }

      if (berkas.length === 0 && !tautanInput) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Unggah minimal satu berkas atau sertakan tautan hasil revisi.",
          },
          { status: 400 }
        );
      }

      // Validasi seluruh berkas sebelum upload.
      for (const file of berkas) {
        const errorBerkas = await validasiBerkas(file);

        if (errorBerkas) {
          return NextResponse.json(
            { success: false, message: errorBerkas },
            { status: 400 }
          );
        }
      }

      const storage = new SupabaseStorageService();
      const uploadedPaths: string[] = [];

      try {
        // Upload berkas ke bucket privat produk-akhir.
        for (const file of berkas) {
          const hasilUpload = await storage.uploadProdukAkhir(
            file,
            id_pesanan
          );

          if (hasilUpload.error || !hasilUpload.path) {
            throw new Error(
              hasilUpload.error || `Gagal mengunggah ${file.name}.`
            );
          }

          uploadedPaths.push(hasilUpload.path);
        }
      } catch (uploadError: unknown) {
        // Bersihkan berkas yang sudah berhasil di-upload
        // jika proses upload berkas berikutnya gagal.
        await Promise.all(
          uploadedPaths.map((path) =>
            storage.hapusProdukAkhir(path)
          )
        );

        throw uploadError;
      }

      const fileUrls = [
        ...uploadedPaths,
        ...(tautanInput
          ? [normalisasiTautan(tautanInput)]
          : []),
      ];

      const result = await DeliverablesService.submitRevisionFix({
        id_pesanan,
        deskripsi_produk: deskripsi.trim(),
        file_urls: fileUrls,
        user_id: user.id,
      });

      return NextResponse.json({
        success: true,
        message: "Hasil perbaikan revisi berhasil dikumpulkan.",
        data: result,
      });
    }

    // SKENARIO B: Pengguna mengajukan revisi baru.
    const body = await req.json();

    const result = await DeliverablesService.requestRevision({
      id_pesanan,
      deskripsi_revisi: body.deskripsi_revisi,
      lampiran_revisi: body.lampiran_revisi,
      id_produk_akhir: body.id_produk_akhir,
      user_id: user.id,
    });

    return NextResponse.json({
      success: true,
      message: "Pengajuan revisi berhasil dikirim.",
      data: result,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Gagal memproses revisi.";

    return NextResponse.json(
      { success: false, message },
      { status: 400 }
    );
  }
}