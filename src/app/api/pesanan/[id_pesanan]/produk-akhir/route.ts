
import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/services/auth.service";
import { createClient } from "@/lib/supabase/server";
import { SupabaseStorageService } from "@/services/storage/supabase.storage";
import {
  validasiBerkasUpload,
} from "@/lib/upload.config";

const MAKS_JUMLAH_BERKAS = 3;
const MAKS_UKURAN = 10 * 1024 * 1024;

type KonteksRoute = {
  params: Promise<{ id_pesanan: string }>;
};

function responsGagal(
  message: string,
  status: number
) {
  return NextResponse.json(
    { success: false, message },
    { status }
  );
}

// Memastikan isi file sesuai dengan format yang diperbolehkan
async function validasiSignature(file: File): Promise<boolean> {
  const buffer = await file.slice(0, 8).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  const nama = file.name.toLowerCase();

  if (nama.endsWith(".jpg") || nama.endsWith(".jpeg")) {
    return (
      bytes.length >= 3 &&
      bytes[0] === 0xff &&
      bytes[1] === 0xd8 &&
      bytes[2] === 0xff
    );
  }

  if (nama.endsWith(".png")) {
    return (
      bytes.length >= 8 &&
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a
    );
  }

  if (nama.endsWith(".pdf")) {
    return (
      bytes.length >= 5 &&
      bytes[0] === 0x25 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x44 &&
      bytes[3] === 0x46 &&
      bytes[4] === 0x2d
    );
  }

  return false;
}

// Normalisasi dan validasi tautan eksternal
function normalisasiTautan(input: string): string | null {
  if (!input.trim()) return null;

  try {
    const nilai = input.trim();

    const url = new URL(
      /^[a-z][a-z\d+.-]*:\/\//i.test(nilai)
        ? nilai
        : `https://${nilai}`
    );

    if (
      !["http:", "https:"].includes(url.protocol) ||
      !url.hostname.includes(".")
    ) {
      return null;
    }

    if (url.href.length > 500) {
      return null;
    }

    return url.href;
  } catch {
    return null;
  }
}

export async function POST(
  request: NextRequest,
  { params }: KonteksRoute
) {
  const storage = new SupabaseStorageService();
  const pathBerkas: string[] = [];

  try {
    // 1. Periksa sesi pengguna
    const user = await getSessionUser();

    if (!user) {
      return responsGagal("Tidak terautentikasi.", 401);
    }

    if (!user.isPenyediaJasa) {
      return responsGagal(
        "Hanya penyedia jasa yang dapat mengumpulkan hasil pekerjaan.",
        403
      );
    }

    const { id_pesanan } = await params;

    // 2. Ambil dan periksa pesanan menggunakan sesi pengguna
    const supabase = await createClient();

    const { data: pesanan, error: errorPesanan } = await supabase
      .from("pesanan")
      .select("id_pesanan, id_penyedia_jasa, status_pesanan")
      .eq("id_pesanan", id_pesanan)
      .maybeSingle();

    if (errorPesanan) {
      return responsGagal(
        "Gagal memeriksa data pesanan.",
        500
      );
    }

    if (!pesanan) {
      return responsGagal("Pesanan tidak ditemukan.", 404);
    }

    if (pesanan.id_penyedia_jasa !== user.id) {
      return responsGagal(
        "Kamu tidak memiliki akses ke pesanan ini.",
        403
      );
    }

    if (
      pesanan.status_pesanan?.trim().toUpperCase() !== "DIPROSES"
    ) {
      return responsGagal(
        "Hasil hanya dapat dikumpulkan untuk pesanan yang sedang diproses.",
        409
      );
    }

    // 3. Baca multipart form
    let form: FormData;

    try {
      form = await request.formData();
    } catch {
      return responsGagal(
        "Format data pengumpulan tidak valid.",
        400
      );
    }

    const deskripsi = String(
      form.get("deskripsi") ?? ""
    ).trim();

    const inputTautan = String(
      form.get("tautan") ?? ""
    ).trim();

    const daftarInput = form.getAll("berkas");

    const berkas = daftarInput.filter(
      (item): item is File =>
        item instanceof File && item.size > 0
    );

    if (daftarInput.some(
      (item) => !(item instanceof File)
    )) {
      return responsGagal(
        "Data berkas tidak valid.",
        400
      );
    }

    if (!deskripsi) {
      return responsGagal(
        "Deskripsi hasil wajib diisi.",
        400
      );
    }

    if (berkas.length > MAKS_JUMLAH_BERKAS) {
      return responsGagal(
        `Maksimal ${MAKS_JUMLAH_BERKAS} berkas dalam satu pengumpulan.`,
        400
      );
    }

    if (berkas.length === 0 && !inputTautan) {
      return responsGagal(
        "Unggah minimal satu berkas atau lampirkan tautan hasil pekerjaan.",
        400
      );
    }

    // 4. Validasi tautan eksternal
    let tautanValid: string | null = null;

    if (inputTautan) {
      tautanValid = normalisasiTautan(inputTautan);

      if (!tautanValid) {
        return responsGagal(
          "Format tautan tidak valid atau melebihi 500 karakter.",
          400
        );
      }
    }

    // 5. Validasi seluruh berkas sebelum upload
    for (const file of berkas) {
      if (file.size > MAKS_UKURAN) {
        return responsGagal(
          `Berkas ${file.name} melebihi 10 MB.`,
          400
        );
      }

      const errorValidasi = validasiBerkasUpload(
        file,
        "produk-akhir"
      );

      if (errorValidasi) {
        return responsGagal(errorValidasi, 400);
      }

      const signatureValid = await validasiSignature(file);

      if (!signatureValid) {
        return responsGagal(
          `Isi berkas ${file.name} tidak sesuai dengan format yang diizinkan.`,
          400
        );
      }
    }

    // 6. Upload berkas ke bucket privat
    const daftarData: {
      id_pesanan: string;
      deskripsi_produk: string;
      file_url: string;
    }[] = [];

    for (const file of berkas) {
      const hasilUpload = await storage.uploadProdukAkhir(
        file,
        id_pesanan
      );

      if (hasilUpload.error || !hasilUpload.path) {
        throw new Error(
          hasilUpload.error || "Gagal mengunggah berkas."
        );
      }

      pathBerkas.push(hasilUpload.path);

      daftarData.push({
        id_pesanan,
        deskripsi_produk: deskripsi,
        file_url: hasilUpload.path,
      });
    }

    // Tautan eksternal disimpan sebagai baris terpisah
    if (tautanValid) {
      daftarData.push({
        id_pesanan,
        deskripsi_produk: deskripsi,
        file_url: tautanValid,
      });
    }

    // 7. Simpan metadata ke tabel produk_akhir
    const { data, error: errorInsert } = await supabase
      .from("produk_akhir")
      .insert(daftarData)
      .select(
        "id_produk_akhir, id_pesanan, deskripsi_produk, file_url, status_pemeriksaan, created_at"
      );

    if (errorInsert) {
      throw new Error(
        "Gagal menyimpan data hasil pekerjaan."
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Hasil pekerjaan berhasil dikumpulkan.",
        data,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    // Hapus file yang sudah terunggah jika penyimpanan metadata gagal
    await Promise.all(
      pathBerkas.map((path) =>
        storage.hapusProdukAkhir(path)
      )
    );

    console.error("Gagal mengumpulkan produk akhir:", error);

    return responsGagal(
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan saat mengumpulkan hasil pekerjaan.",
      500
    );
  }
}


export async function GET(
  _request: NextRequest,
  { params }: KonteksRoute
) {
  try {
    // 1. Periksa sesi pengguna
    const user = await getSessionUser();

    if (!user) {
      return responsGagal("Tidak terautentikasi.", 401);
    }

    const { id_pesanan } = await params;
    const supabase = await createClient();

    // 2. Pastikan pengguna merupakan peserta pesanan
    const { data: pesanan, error: errorPesanan } = await supabase
      .from("pesanan")
      .select("id_pesanan, id_pengguna_jasa, id_penyedia_jasa")
      .eq("id_pesanan", id_pesanan)
      .maybeSingle();

    if (errorPesanan) {
      return responsGagal("Gagal memeriksa data pesanan.", 500);
    }

    if (!pesanan) {
      return responsGagal("Pesanan tidak ditemukan.", 404);
    }

    const pesertaPesanan =
      pesanan.id_pengguna_jasa === user.id ||
      pesanan.id_penyedia_jasa === user.id;

    if (!pesertaPesanan) {
      return responsGagal(
        "Kamu tidak memiliki akses ke hasil pesanan ini.",
        403
      );
    }

    // 3. Ambil metadata hasil pekerjaan
    const { data: daftarHasil, error: errorHasil } = await supabase
      .from("produk_akhir")
      .select(
        "id_produk_akhir, id_pesanan, deskripsi_produk, file_url, status_pemeriksaan, created_at"
      )
      .eq("id_pesanan", id_pesanan)
      .order("created_at", { ascending: true });

    if (errorHasil) {
      return responsGagal(
        "Gagal mengambil hasil pekerjaan.",
        500
      );
    }

    // 4. Ubah path Storage menjadi signed URL
    const storage = new SupabaseStorageService();

    const data = await Promise.all(
      (daftarHasil ?? []).map(async (item) => {
        const fileUrl = item.file_url;

        if (!fileUrl) {
          return { ...item, file_url: null };
        }

        // Tautan eksternal tidak perlu signed URL
        if (/^https?:\/\//i.test(fileUrl)) {
          return { ...item, file_url: fileUrl };
        }

        // Berkas bucket privat menggunakan signed URL
        const signedUrl =
          await storage.buatSignedUrlProdukAkhir(fileUrl);

        return {
          ...item,
          file_url: signedUrl,
        };
      })
    );

    return NextResponse.json({
      success: true,
      message: data.length
        ? "Hasil pekerjaan berhasil diambil."
        : "Belum ada hasil pekerjaan.",
      data,
    });
  } catch (error) {
    console.error("Gagal mengambil produk akhir:", error);

    return responsGagal(
      "Terjadi kesalahan saat mengambil hasil pekerjaan.",
      500
    );
  }
}

