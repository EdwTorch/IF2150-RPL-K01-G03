import { error } from "console";
import { StorageService } from "./storage.interface";
import fs from "fs/promises";
import path from "path";

export class LocalStorageService implements StorageService {
    private baseDir = path.join(process.cwd(), "public", "uploads");

    async upload(file: File, folder: string): Promise<{ url: string; error?: string }> {
        try {
            // Memastikan direktori tujuan sudah dibuat
            const targetDir = path.join(this.baseDir, folder);
            await fs.mkdir(targetDir, { recursive: true });

            // Generate penamaan file agar tidak terjadi naming collision dan aman dari karakter khusus
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
            const fileName = `${uniqueSuffix}-${sanitizedName}`;
            const filePath = path.join(targetDir, fileName);

            // Konversi data ke buffer lalu ditulis ke disk
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            await fs.writeFile(filePath, buffer);

            const cleanFolder = folder.replace(/^\/+|\/+$/g, "");
            const publicUrl = `/uploads/${cleanFolder ? cleanFolder + "/" : ""}${fileName}`;

            return { url: publicUrl };
        } catch (err: any) {
            return { url: "", error: err.message || "Gagal menyimpan berkas ke disk lokal." };
        }
    }
}