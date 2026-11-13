
import { StorageService } from "./storage.interface";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

export class SupabaseStorageService implements StorageService {
  private supabase;
  private bucket_name: string;
  private bucket_produk_akhir = "produk-akhir";

  constructor() {
    const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabase_service_key =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    this.supabase = createClient(supabase_url, supabase_service_key);
    this.bucket_name = process.env.SUPABASE_STORAGE_BUCKET || "public";
  }

  // Upload umum — dipertahankan untuk fitur lain
  async upload(
    file: File,
    folder: string
  ): Promise<{ url: string; error?: string }> {
    try {
      const unique_suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const sanitized_name = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const clean_folder = folder.replace(/^\/+|\/+$/g, "");
      const file_path = `${clean_folder ? clean_folder + "/" : ""}${unique_suffix}-${sanitized_name}`;

      const buffer = Buffer.from(await file.arrayBuffer());

      const { data, error } = await this.supabase.storage
        .from(this.bucket_name)
        .upload(file_path, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) throw error;

      const { data: public_url_data } = this.supabase.storage
        .from(this.bucket_name)
        .getPublicUrl(data.path);

      return { url: public_url_data.publicUrl };
    } catch (err: unknown) {
      return {
        url: "",
        error:
          err instanceof Error
            ? err.message
            : "Gagal mengunggah berkas ke Supabase Storage.",
      };
    }
  }

  // Upload khusus hasil akhir pesanan ke bucket privat
  async uploadProdukAkhir(
    file: File,
    id_pesanan: string
  ): Promise<{ path: string; error?: string }> {
    try {
      const sanitized_name = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const file_path = `${id_pesanan}/${randomUUID()}-${sanitized_name}`;
      const buffer = Buffer.from(await file.arrayBuffer());

      const { data, error } = await this.supabase.storage
        .from(this.bucket_produk_akhir)
        .upload(file_path, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) throw error;

      return { path: data.path };
    } catch (err: unknown) {
      return {
        path: "",
        error:
          err instanceof Error
            ? err.message
            : "Gagal mengunggah produk akhir.",
      };
    }
  }

  // Membuat signed URL sementara untuk melihat file privat
  async buatSignedUrlProdukAkhir(
    file_path: string,
    masaBerlakuDetik = 300
  ): Promise<string | null> {
    const { data, error } = await this.supabase.storage
      .from(this.bucket_produk_akhir)
      .createSignedUrl(file_path, masaBerlakuDetik);

    if (error) return null;

    return data.signedUrl;
  }

  // Membuat signed URL sementara khusus untuk mengunduh file
  async buatSignedUrlUnduhProdukAkhir(
    file_path: string,
    masaBerlakuDetik = 300
  ): Promise<string | null> {
    const { data, error } = await this.supabase.storage
      .from(this.bucket_produk_akhir)
      .createSignedUrl(file_path, masaBerlakuDetik, {
        download: true,
      });

    if (error) return null;

    return data.signedUrl;
  }

  // Menghapus file hasil akhir
  async hapusProdukAkhir(file_path: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase.storage
        .from(this.bucket_produk_akhir)
        .remove([file_path]);

      return !error && (data?.length ?? 0) > 0;
    } catch {
      return false;
    }
  }

  // Delete umum — dipertahankan untuk fitur lain
  async delete(file_path: string): Promise<boolean> {
    try {
      let relative_path = file_path;

      if (/^https?:\/\//i.test(file_path)) {
        const parsed_url = new URL(file_path);
        const path_prefix = `/storage/v1/object/public/${this.bucket_name}/`;
        const idx = parsed_url.pathname.indexOf(path_prefix);

        if (idx === -1) return false;

        relative_path = decodeURIComponent(
          parsed_url.pathname.slice(idx + path_prefix.length)
        );
      }

      relative_path = relative_path.replace(/^\/+/, "");
      if (!relative_path) return false;

      const { data, error } = await this.supabase.storage
        .from(this.bucket_name)
        .remove([relative_path]);

      return !error && (data?.length ?? 0) > 0;
    } catch {
      return false;
    }
  }
}
