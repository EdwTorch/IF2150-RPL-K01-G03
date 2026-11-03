import { StorageService } from "./storage.interface";
import { createClient } from "@supabase/supabase-js";

export class SupabaseStorageService implements StorageService {
    private supabase;

    constructor() {
        const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabase_service_key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        this.supabase = createClient(supabase_url, supabase_service_key)
    }
}