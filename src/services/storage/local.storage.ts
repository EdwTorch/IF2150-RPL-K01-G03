import { StorageService } from "./storage.interface";
import fs from "fs/promises";
import path from "path";

export class LocalStorageService implements StorageService {
    private base_dir = path.join(process.cwd(), "public", "uploads");

    async upload(file: File, folder: string): Promise<{ url: string; error?: string }> {
        try {
            // Memastikan direktori tujuan sudah dibuat
            const target_dir = path.join(this.base_dir, folder);
            await fs.mkdir(target_dir, { recursive: true });

            // Generate penamaan file agar tidak terjadi naming collision dan aman dari karakter khusus
            const unique_suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            const sanitized_name = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
            const file_name = `${unique_suffix}-${sanitized_name}`;
            const file_path = path.join(target_dir, file_name);

            // Konversi data ke buffer lalu ditulis ke disk
            const array_buffer = await file.arrayBuffer();
            const buffer = Buffer.from(array_buffer);
            await fs.writeFile(file_path, buffer);

            const clean_folder = folder.replace(/^\/+|\/+$/g, "");
            const public_url = `/uploads/${clean_folder ? clean_folder + "/" : ""}${file_name}`;

            return { url: public_url };
        } catch (err: any) {
            return { url: "", error: err.message || "Gagal menyimpan berkas ke disk lokal." };
        }
    }

    async delete(file_path: string): Promise<boolean> {
        try {
            // Menyusun path yang sudah dinormalisasi
            const normalized_path = file_path.startsWith("/") ? file_path.slice(1) : file_path;
            const full_path = path.join(process.cwd(), "public", normalized_path);

            // Hapus berkas dari disk
            await fs.unlink(full_path);

            return true;
        } catch {
            return false;
        }
    }
}