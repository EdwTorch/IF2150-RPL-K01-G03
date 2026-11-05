import { StorageService } from "./storage.interface";
import { createClient } from "@supabase/supabase-js";

export class SupabaseStorageService implements StorageService {
    private supabase;
    private bucket_name: string;

    constructor() {
        const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabase_service_key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        this.supabase = createClient(supabase_url, supabase_service_key);

        this.bucket_name = process.env.SUPABASE_STORAGE_BUCKET || "public";
    }

    async upload(file: File, folder: string): Promise<{ url: string; error?: string }> {
        try {
            // Buat nama berkas unik dan ternormalisasi
            const unique_suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            const sanitized_name = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");

            // Susun path berkas di dalam bucket
            const clean_folder = folder.replace(/^\/+|\/+$/g, "");
            const file_path = `${clean_folder ? clean_folder + "/" : ""}${unique_suffix}-${sanitized_name}`;

            const array_buffer = await file.arrayBuffer();
            const buffer = Buffer.from(array_buffer);

            // Masukkan ke bucket
            const { data, error } = await this.supabase.storage
                .from(this.bucket_name)
                .upload(file_path, buffer, {
                    contentType: file.type,
                    upsert: false
                });

            if (error) throw error;

            // Mengambil URL publik
            const { data: public_url_data } = this.supabase.storage
                .from(this.bucket_name)
                .getPublicUrl(data.path);

            return { url: public_url_data.publicUrl };
        } catch (err: any) {
            return { url: "", error: err.message || "Gagal mengunggah berkas ke Supabase Storage." };
        }
    }

    async delete(file_path: string): Promise<boolean> {
        try {
            let relative_path = file_path;

            if (file_path.includes(`/storage/v1/object/public/${this.bucket_name}/`)) {
                relative_path = file_path.split(`/storage/v1/object/public/${this.bucket_name}/`)[1];
            } else if (file_path.startsWith("/")) {
                relative_path = file_path.slice(1);
            }

            if (!relative_path) return false;

            const { error } = await this.supabase.storage
                .from(this.bucket_name)
                .remove([relative_path]);

            return !error;
        } catch {
            return false;
        }
    }
}