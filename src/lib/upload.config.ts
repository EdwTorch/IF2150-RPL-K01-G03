export const FOLDER_DIIZINKAN = [
  "jasa",
  "chat",
  "revisi",
  "portofolio",
  "produk-akhir",
] as const;

export type FolderUpload = (typeof FOLDER_DIIZINKAN)[number];

const MB = 1024 * 1024;

export const MAKS_UKURAN_PER_FOLDER: Record<FolderUpload, number> = {
  jasa: 10 * MB,
  chat: 10 * MB,
  revisi: 10 * MB,
  portofolio: 20 * MB,
  "produk-akhir": 10 * MB,
};

const TIPE_UMUM = /^(image\/(png|jpe?g|webp|gif)|application\/pdf)$/;

export const TIPE_PER_FOLDER: Record<FolderUpload, RegExp> = {
  jasa: /^(image\/(png|jpe?g|webp|gif)|video\/mp4|application\/pdf)$/,
  chat: /^(image\/(png|jpe?g|webp)|application\/pdf)$/,
  revisi: TIPE_UMUM,
  portofolio: /^(image\/(png|jpe?g)|application\/pdf)$/,
  "produk-akhir": /^(image\/(png|jpe?g)|application\/pdf)$/,
};

const EKSTENSI_UMUM = /\.(png|jpe?g|webp|gif|pdf)$/i;

export const EKSTENSI_PER_FOLDER: Record<FolderUpload, RegExp> = {
  jasa: /\.(png|jpe?g|webp|gif|mp4|pdf)$/i,
  chat: /\.(png|jpe?g|webp|pdf)$/i,
  revisi: EKSTENSI_UMUM,
  portofolio: /\.(png|jpe?g|pdf)$/i,
  "produk-akhir": /\.(png|jpe?g|pdf)$/i,
};

export function validasiFolder(folder: string): folder is FolderUpload {
  return (FOLDER_DIIZINKAN as readonly string[]).includes(folder);
}

export function validasiBerkasUpload(
  file: File,
  folder: FolderUpload
): string | null {
  const maksUkuran = MAKS_UKURAN_PER_FOLDER[folder];
  const maksMB = maksUkuran / MB;

  if (file.size > maksUkuran) {
    return `Ukuran berkas ${file.name} melebihi ${maksMB} MB.`;
  }

  if (!EKSTENSI_PER_FOLDER[folder].test(file.name)) {
    return `Format ekstensi berkas ${file.name} tidak diizinkan untuk folder ${folder}.`;
  }

  if (!TIPE_PER_FOLDER[folder].test(file.type)) {
    return `Tipe berkas ${file.type || "tidak diketahui"} tidak diizinkan untuk folder ${folder}.`;
  }

  return null;
}
