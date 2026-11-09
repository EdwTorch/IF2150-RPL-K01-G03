import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export class AuthError extends Error {
    constructor(
        public code: 
            | "EMPTY_INPUT"
            | "INVALID_EMAIL"
            | "WEAK_PASSWORD"
            | "EMAIL_TAKEN"
            | "INVALID_ROLE"
            | "INVALID_CREDENTIALS"
            | "ACCOUNT_SUSPENDED"
            | "PROFILE_NOT_FOUND"
            | "FORBIDDEN"
            | "LOGOUT_FAILED"
            | "INTERNAL_ERROR";
        message: string
    ) {
        super(message);
        this.name = "AuthError";
    }
}

export type RoleRegistrasi = "pengguna_jasa" | "penyedia_jasa";

export interface InputRegistrasi {
    nama: string;
    email: string;
    password: string;
    role: RoleRegistrasi;
}

// Panjang minimum password
export const MIN_PANJANG_PASSWORD = 8;

// Helper untuk mengecek apakah data relasi PostgREST valid (bukan null, bukan array kosong, bukan object kosong)
export function hasRelation(rel: unknown): boolean {
    if (!rel) return false;
    if (Array.isArray(rel)) return rel.length > 0;
    if (typeof rel === "object") return Object.keys(rel).length > 0;
    return false;
}

// Admin client khusus untuk operasi auth.admin (createUser, deleteUser) dengan SERVICE_ROLE_KEY
let adminClientInstance: ReturnType<typeof createAdminClient> | null = null;

function getAdminClient() {
    if (adminClientInstance) return adminClientInstance;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
        throw new AuthError("INTERNAL_ERROR", "Konfigurasi Supabase tidak lengkap");
    }
    adminClientInstance = createAdminClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
    return adminClientInstance;
}

// Validasi input registrasi — murni (dapat diuji unit tanpa DB)
export function validasiInputRegistrasi(input: InputRegistrasi): void {
    if (!input.nama?.trim()) {
        throw new AuthError("EMPTY_INPUT", "Nama tidak boleh kosong");
    }
    if (!input.email?.trim()) {
        throw new AuthError("EMPTY_INPUT", "Email tidak boleh kosong");
    }
    const formatEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formatEmail.test(input.email.trim())) {
        throw new AuthError("INVALID_EMAIL", "Format email tidak valid");
    }
    if (!input.password || input.password.length < MIN_PANJANG_PASSWORD) {
        throw new AuthError(
            "WEAK_PASSWORD",
            `Password minimal ${MIN_PANJANG_PASSWORD} karakter`
        );
    }
    if (!input.password.trim()) {
        throw new AuthError(
            "WEAK_PASSWORD",
            "Password tidak boleh hanya berisi spasi kosong"
        );
    }
    if (input.role !== "pengguna_jasa" && input.role !== "penyedia_jasa") {
        throw new AuthError("INVALID_ROLE", "Role tidak valid");
    }
}

interface RawProfilPengguna {
    id: string;
    nama: string;
    email: string | null;
    role: "USER" | "ADMIN" | "PENYEDIA_JASA";
    status_akun: boolean;
    sanksi: string | null;
    penyedia_jasa: unknown;
    pengguna_jasa: unknown;
}

async function getValidProfil(
    supabase: Awaited<ReturnType<typeof createClient>>,
    userId: string
): Promise<RawProfilPengguna> {
    const { data: profil, error: profilError } = await supabase
        .from("pengguna")
        .select(`
            id, nama, email, role, status_akun, sanksi,
            penyedia_jasa ( id ),
            pengguna_jasa ( id )
        `)
        .eq("id", userId)
        .single();
    if (profilError) {
        await supabase.auth.signOut();
        throw new AuthError("INTERNAL_ERROR", "Terjadi kesalahan saat mengambil profil pengguna");
    }
    if (!profil) {
        await supabase.auth.signOut();
        throw new AuthError("PROFILE_NOT_FOUND", "Profil pengguna tidak ditemukan");
    }
    const diblokir = profil.status_akun === false || profil.sanksi === "SUSPENDED";
    if (diblokir) {
        await supabase.auth.signOut();
        throw new AuthError("ACCOUNT_SUSPENDED", "Akun Anda ditangguhkan");
    }
    return profil as RawProfilPengguna;
}

// Daftarkan akun baru: buat auth user, simpan profil & tabel turunan sesuai role
export async function registrasi(
    input: InputRegistrasi
): Promise<{ id: string; email: string; nama: string; role: string }> {
    validasiInputRegistrasi(input);

    const email = input.email.trim().toLowerCase();
    const adminClient = getAdminClient();

    // Buat akun di Supabase Auth menggunakan admin client (SERVICE_ROLE_KEY)
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
        email,
        password: input.password,
        email_confirm: true,
    });
    if (authError || !authData?.user) {
        if (
            authError?.message?.toLowerCase().includes("already registered") ||
            authError?.message?.toLowerCase().includes("already been registered")
        ) {
            throw new AuthError("EMAIL_TAKEN", "Email sudah terdaftar");
        }
        throw new AuthError("INTERNAL_ERROR", "Terjadi kesalahan saat pendaftaran akun");
    }
    const user_id = authData.user.id;
    const role = input.role === "penyedia_jasa" ? "PENYEDIA_JASA" : "USER";

    // Simpan ke tabel pengguna
    const { error: profilError } = await adminClient.from("pengguna").insert({
        id: user_id,
        nama: input.nama.trim(),
        email,
        role,
    });

    if (profilError) {
        // Rollback: hapus auth user agar tidak orphan
        await adminClient.auth.admin.deleteUser(user_id);
        throw new AuthError("INTERNAL_ERROR", "Terjadi kesalahan saat menyimpan profil pengguna");
    }

    // Simpan ke tabel turunan sesuai role
    const tabelTurunan = input.role === "penyedia_jasa" ? "penyedia_jasa" : "pengguna_jasa";
    const { error: turunanError } = await adminClient.from(tabelTurunan).insert({ id: user_id });

    if (turunanError) {
        // Rollback: bersihkan data pengguna dan auth user agar tidak meninggalkan orphan data
        await adminClient.from("pengguna").delete().eq("id", user_id);
        await adminClient.auth.admin.deleteUser(user_id);
        throw new AuthError("INTERNAL_ERROR", "Terjadi kesalahan saat menyimpan data peran pengguna");
    }

    return { id: user_id, email, nama: input.nama.trim(), role };
}

export async function login(email: string, password: string) {
    const clean_email = email?.trim().toLowerCase();

    if (!clean_email || !password || !password.trim()) {
        throw new AuthError("EMPTY_INPUT", "Email dan password tidak boleh kosong");
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
        email: clean_email,
        password
    });

    if (error || !data.user) {
        // Jangan bocorkan apakah email atau password yang salah
        throw new AuthError("INVALID_CREDENTIALS", "Kredensial tidak valid");
    }

    // Ambil dan validasi data profil dari tabel publik menggunakan helper DRY
    const profil = await getValidProfil(supabase, data.user.id);

    await supabase.from("pengguna").update({ status_online: true }).eq("id", data.user.id);

    return {
        user: {
            id: data.user.id,
            email: data.user.email ?? clean_email,
            nama: profil.nama,
            role: profil.role,
            isPenyediaJasa: hasRelation(profil.penyedia_jasa),
            isPenggunaJasa: hasRelation(profil.pengguna_jasa)
        }
    };
}

export async function logout() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        await supabase.from("pengguna").update({ status_online: false }).eq("id", user.id);
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
        throw new AuthError("LOGOUT_FAILED", "Gagal keluar dari akun");
    }
}

export async function getSessionUser() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) return null;

    try {
        const profil = await getValidProfil(supabase, user.id);

        return {
            id: profil.id,
            email: profil.email!,
            nama: profil.nama,
            role: profil.role as "USER" | "ADMIN",
            status_akun: profil.status_akun,
            isPenyediaJasa: hasRelation(profil.penyedia_jasa),
            isPenggunaJasa: hasRelation(profil.pengguna_jasa),
        };
    } catch {
        return null;
    }
}

export async function loginAdmin(email: string, password: string) {
    // Gunakan fungsi login() yang sudah ada untuk validasi kredensial, profil, & sanksi
    const result = await login(email, password);

    if (result.user.role !== "ADMIN") {
        const supabase = await createClient();
        await supabase.from("pengguna").update({ status_online: false }).eq("id", result.user.id);
        await supabase.auth.signOut(); // Hapus cookie sesi agar tidak nyangkut
        throw new AuthError("FORBIDDEN", "Akun ini tidak memiliki akses administrator");
    }

    return result;
}