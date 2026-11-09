import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/services/auth.service';
import { getStorageService } from '@/services/storage';
import { validasiFolder, validasiBerkasUpload, type FolderUpload } from '@/lib/upload.config';

// POST /api/upload — unggah satu berkas ke folder tujuan
// Multipart field: "berkas" (File), "folder" (string)
export async function POST(request: NextRequest) {
    // Autentikasi
    const user = await getSessionUser();
    if (!user) {
        return NextResponse.json({ success: false, message: 'Tidak terautentikasi' }, { status: 401 });
    }

    let form: FormData;
    try {
        form = await request.formData();
    } catch {
        return NextResponse.json({ success: false, message: 'Body harus berupa multipart/form-data' }, { status: 400 });
    }

    // Validasi folder (cegah path traversal)
    const folder = (form.get('folder') as string | null)?.trim() ?? '';
    if (!validasiFolder(folder)) {
        return NextResponse.json(
            { success: false, message: `Folder tidak valid. Pilihan: jasa, chat, revisi, portofolio` },
            { status: 400 }
        );
    }

    const berkas = form.get('berkas');
    if (!(berkas instanceof File) || berkas.size === 0) {
        return NextResponse.json({ success: false, message: 'Berkas tidak ditemukan atau kosong' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Berkas berhasil diunggah', data: { url } }, { status: 201 });
}
