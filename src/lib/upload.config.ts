// Daftar folder yang diizinkan — cegah path traversal
export const FOLDER_DIIZINKAN = ['jasa', 'chat', 'revisi', 'portofolio'] as const;
export type FolderUpload = (typeof FOLDER_DIIZINKAN)[number];

export const MAKS_UKURAN_UPLOAD = 10 * 1024 * 1024; // 10 MB

// Tipe MIME yang diizinkan per folder
const TIPE_UMUM = /^(image\/(png|jpe?g|webp|gif)|application\/pdf)$/;

export const TIPE_PER_FOLDER: Record<FolderUpload, RegExp> = {
    jasa:        /^(image\/(png|jpe?g|webp|gif)|video\/mp4|application\/pdf)$/,
    chat:        /^(image\/(png|jpe?g|webp)|application\/pdf)$/,
    revisi:      TIPE_UMUM,
    portofolio:  /^(image\/(png|jpe?g|webp|gif)|video\/mp4|application\/pdf)$/,
};

// Ekstensi berkas yang diizinkan per folder (lapisan validasi pertama sebelum MIME)
const EKSTENSI_UMUM = /\.(png|jpe?g|webp|gif|pdf)$/i;

export const EKSTENSI_PER_FOLDER: Record<FolderUpload, RegExp> = {
    jasa:        /\.(png|jpe?g|webp|gif|mp4|pdf)$/i,
    chat:        /\.(png|jpe?g|webp|pdf)$/i,
    revisi:      EKSTENSI_UMUM,
    portofolio:  /\.(png|jpe?g|webp|gif|mp4|pdf)$/i,
};

export function validasiFolder(folder: string): folder is FolderUpload {
    return (FOLDER_DIIZINKAN as readonly string[]).includes(folder);
}

export function validasiBerkasUpload(file: File, folder: FolderUpload): string | null {
    const maksMB = Math.round(MAKS_UKURAN_UPLOAD / (1024 * 1024));
    if (file.size > MAKS_UKURAN_UPLOAD) {
        return `Ukuran berkas ${file.name} melebihi ${maksMB} MB`;
    }

    if (file.name && !EKSTENSI_PER_FOLDER[folder].test(file.name)) {
        return `Format ekstensi berkas ${file.name} tidak diizinkan untuk folder ${folder}`;
    }

    if (!TIPE_PER_FOLDER[folder].test(file.type)) {
        return `Tipe berkas ${file.type || 'tidak diketahui'} tidak diizinkan untuk folder ${folder}`;
    }
    return null;
}
