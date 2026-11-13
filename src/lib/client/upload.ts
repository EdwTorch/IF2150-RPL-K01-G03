import { api } from "@/lib/api";

/** Sama dengan FOLDER_DIIZINKAN di lib/upload.config.ts */
export type FolderUpload = "jasa" | "chat" | "revisi" | "portofolio";

/** POST /api/upload → { success, message, data: { url } }. Maks 10 MB */
export async function unggahBerkas(berkas: File, folder: FolderUpload): Promise<{ url: string; nama: string }> {
  const form_data = new FormData();
  form_data.append("berkas", berkas);
  form_data.append("folder", folder);
  const respons = await api<{ data: { url: string } }>("/api/upload", { method: "POST", body: form_data });
  return { url: respons.data.url, nama: berkas.name };
}