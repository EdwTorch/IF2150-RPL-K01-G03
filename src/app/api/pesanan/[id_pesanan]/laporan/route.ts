
import { NextRequest, NextResponse } from "next/server";
import { PelaporanService } from "@/services/pelaporan.service";
import { getSessionUser } from "@/services/auth.service";
import { getStorageService } from "@/services/storage";

const MAKS_BERKAS = 3;
const MAKS_UKURAN_BERKAS = 10 * 1024 * 1024;

const FORMAT_BERKAS_DIIZINKAN: Record<string, string[]> = {
  jpg: ["image/jpeg"],
  jpeg: ["image/jpeg"],
  png: ["image/png"],
  pdf: ["application/pdf"],
};

type KonteksRoute = {
  params: Promise<{ id_pesanan: string }>;
};

function validasiBerkas(files: File[]): void {
  if (files.length > MAKS_BERKAS) {
    throw new Error("Maksimal 3 bukti yang dapat dilampirkan.");
  }

  for (const [index, file] of files.entries()) {
    const ekstensi = file.name.split(".").pop()?.toLowerCase() ?? "";
    const mimeDiizinkan = FORMAT_BERKAS_DIIZINKAN[ekstensi];

    if (!mimeDiizinkan || !mimeDiizinkan.includes(file.type)) {
      throw new Error(
        `Format berkas ke-${index + 1} tidak diizinkan. Gunakan JPG, JPEG, PNG, atau PDF.`
      );
    }

    if (file.size === 0) {
      throw new Error(`Berkas ke-${index + 1} kosong.`);
    }

    if (file.size > MAKS_UKURAN_BERKAS) {
      throw new Error(`Ukuran berkas ke-${index + 1} melebihi 10 MB.`);
    }
  }
}

// GET: Mengambil tiket laporan pengguna berdasarkan pesanan.
export async function GET(
  _req: NextRequest,
  { params }: KonteksRoute
) {
  try {
    const { id_pesanan } = await params;
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    if (!user.isPenggunaJasa) {
      return NextResponse.json(
        {
          success: false,
          message: "Hanya pengguna jasa yang dapat mengakses laporan ini.",
        },
        { status: 403 }
      );
    }

    // Pastikan pesanan memang melibatkan pengguna yang sedang login.
    await PelaporanService.validasiOwnerPesanan(
      id_pesanan,
      user.id
    );

    // Ambil tiket milik pengguna, lalu pilih yang sesuai dengan pesanan.
    const semuaTiket = await PelaporanService.getTicketsByUser(
      user.id
    );

    const tiket = semuaTiket.find(
      (item) =>
        item.id_pesanan === id_pesanan &&
        item.id_pelapor === user.id
    );

    if (!tiket?.id_tiket) {
      return NextResponse.json({
        success: true,
        message: "Belum ada laporan untuk pesanan ini.",
        data: null,
      });
    }

    // Ambil detail tiket sekaligus tanggapan admin.
    const detailTiket = await PelaporanService.getDetailTiket(
      tiket.id_tiket,
      user.id
    );

    return NextResponse.json({
      success: true,
      message: "Tiket laporan berhasil dimuat.",
      data: detailTiket,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Gagal memuat laporan.";

    let status = 400;

    if (message.includes("Pesanan tidak ditemukan")) {
      status = 404;
    } else if (message.includes("Akses ditolak")) {
      status = 403;
    } else if (message.includes("Unauthorized")) {
      status = 401;
    }

    return NextResponse.json(
      { success: false, message },
      { status }
    );
  }
}

// POST: Membuat tiket laporan baru.
export async function POST(
  req: NextRequest,
  { params }: KonteksRoute
) {
  try {
    const { id_pesanan } = await params;
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    if (!user.isPenggunaJasa) {
      return NextResponse.json(
        {
          success: false,
          message: "Hanya pengguna jasa yang dapat membuat laporan.",
        },
        { status: 403 }
      );
    }

    let kategori: string[];
    let deskripsi_laporan: string;
    let files: File[] = [];
    let bodyUrls: string[] = [];

    const contentType = req.headers.get("content-type") ?? "";
    const isFormData = contentType.includes("multipart/form-data");

    if (isFormData) {
      const formData = await req.formData();

      const kategoriRaw = formData.get("kategori");
      deskripsi_laporan = String(
        formData.get("deskripsi_laporan") ?? ""
      );

      if (typeof kategoriRaw === "string") {
        try {
          const parsed: unknown = JSON.parse(kategoriRaw);

          kategori = Array.isArray(parsed)
            ? parsed.filter(
                (item): item is string =>
                  typeof item === "string"
              )
            : [kategoriRaw];
        } catch {
          kategori = [kategoriRaw];
        }
      } else {
        kategori = formData
          .getAll("kategori")
          .filter(
            (item): item is string =>
              typeof item === "string"
          );
      }

      files = formData
        .getAll("berkas")
        .filter((item): item is File => item instanceof File);
    } else {
      const body = await req.json();

      kategori = body.kategori;
      deskripsi_laporan = body.deskripsi_laporan;

      if (body.url_bukti !== undefined) {
        if (
          !Array.isArray(body.url_bukti) ||
          !body.url_bukti.every(
            (item: unknown) => typeof item === "string"
          )
        ) {
          return NextResponse.json(
            {
              success: false,
              message: "Format URL bukti tidak valid.",
            },
            { status: 400 }
          );
        }

        bodyUrls = body.url_bukti;
      }
    }

    if (!Array.isArray(kategori) || kategori.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Pilih minimal 1 kategori laporan.",
        },
        { status: 400 }
      );
    }

    if (
      typeof deskripsi_laporan !== "string" ||
      !deskripsi_laporan.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Deskripsi laporan wajib diisi.",
        },
        { status: 400 }
      );
    }

    validasiBerkas(files);

    const uploadedUrls: string[] = [];
    const storage = getStorageService();

    try {
      for (const file of files) {
        const hasilUpload = await storage.upload(
          file,
          "pelaporan"
        );

        if (hasilUpload.error || !hasilUpload.url) {
          throw new Error(
            hasilUpload.error ||
              "Gagal mengunggah bukti laporan."
          );
        }

        uploadedUrls.push(hasilUpload.url);
      }

      const semuaUrl = [...bodyUrls, ...uploadedUrls];

      if (semuaUrl.length === 0) {
        throw new Error(
          "Minimal sertakan 1 bukti laporan."
        );
      }

      if (semuaUrl.length > MAKS_BERKAS) {
        throw new Error(
          "Maksimal 3 bukti yang dapat dilampirkan."
        );
      }

      const tiketBaru = await PelaporanService.submitLaporan(
        id_pesanan,
        user.id,
        {
          kategori,
          deskripsi_laporan: deskripsi_laporan.trim(),
          url_bukti: semuaUrl,
        }
      );

      return NextResponse.json(
        {
          success: true,
          message: "Tiket laporan berhasil dikirim.",
          data: tiketBaru,
        },
        { status: 201 }
      );
    } catch (error) {
      // Bersihkan berkas yang sudah terunggah jika pembuatan tiket gagal.
      await Promise.allSettled(
        uploadedUrls.map((url) => storage.delete(url))
      );

      throw error;
    }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Gagal membuat laporan.";

    let status = 400;

    if (message.includes("Pesanan tidak ditemukan")) {
      status = 404;
    } else if (message.includes("Akses ditolak")) {
      status = 403;
    } else if (message.includes("Unauthorized")) {
      status = 401;
    }

    return NextResponse.json(
      { success: false, message },
      { status }
    );
  }
}
