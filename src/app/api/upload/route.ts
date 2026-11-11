import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/services/auth.service';
import { getStorageService } from '@/services/storage';
import { validasiFolder, validasiBerkasUpload, FOLDER_DIIZINKAN, type FolderUpload } from '@/lib/upload.config';

// POST /api/upload — unggah satu berkas ke folder tujuan
// Multipart field: "berkas" (File/Blob), "folder" (string)
export async function POST(request: NextRequest) {
    try {
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
                { success: false, message: `Folder tidak valid. Pilihan: ${FOLDER_DIIZINKAN.join(', ')}` },
                { status: 400 }
            );
        }

        const berkas = form.get('berkas');
        if (!(berkas instanceof Blob) || berkas.size === 0) {
            return NextResponse.json({ success: false, message: 'Berkas tidak ditemukan atau kosong' }, { status: 400 });
        }

        const file = berkas instanceof File ? berkas : new File([berkas], 'berkas', { type: berkas.type });

        // Validasi tipe & ukuran berkas
        const pesanError = validasiBerkasUpload(file, folder as FolderUpload);
        if (pesanError) {
            return NextResponse.json({ success: false, message: pesanError }, { status: 400 });
        }

        // Unggah via Storage Service
        const storage = getStorageService();
        const { url, error } = await storage.upload(file, folder);
        if (error || !url) {
            console.error('[POST /api/upload] Gagal mengunggah berkas ke storage:', error);
            return NextResponse.json(
                { success: false, message: 'Gagal mengunggah berkas' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, message: 'Berkas berhasil diunggah', data: { url } }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/upload] Terjadi kesalahan server:', err);
        return NextResponse.json(
            { success: false, message: 'Terjadi kegagalan server internal' },
            { status: 500 }
        );
    }
}
