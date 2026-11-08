import { StorageService } from "./storage.interface";
import { LocalStorageService } from "./local.storage";
import { SupabaseStorageService } from "./supabase.storage";

let storageInstance: StorageService | null = null;

export function getStorageService(): StorageService {
    if (!storageInstance) {
        // Baca konfigurasi driver dari env (default: supabase)
        const driver = process.env.STORAGE_DRIVER || "supabase";

        // Inisialisasi driver yang sesuai
        if (driver === "local") {
            storageInstance = new LocalStorageService();
        } else {
            storageInstance = new SupabaseStorageService();
        }
    }

    return storageInstance;
}

export * from "./storage.interface";
