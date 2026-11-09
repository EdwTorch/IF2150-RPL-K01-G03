import { createClient } from "@/lib/supabase/server";

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
            | "LOGOUT_FAILED",
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
    if (input.role !== "pengguna_jasa" && input.role !== "penyedia_jasa") {
        throw new AuthError("INVALID_ROLE", "Role tidak valid");
    }
}

// Daftarkan akun baru: buat auth user, simpan profil & tabel turunan sesuai role
export async function registrasi(
    input: InputRegistrasi
): Promise<{ id: string; email: string; nama: string; role: string }> {
    validasiInputRegistrasi(input);

    const email = input.email.trim().toLowerCase();
    const supabase = await createClient();

    // Buat akun di Supabase Auth (admin API agar bisa langsung confirm email)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password: input.password,
        email_confirm: true,
    });

    if (authError) {
        if (
            authError.message?.toLowerCase().includes("already registered") ||
            authError.message?.toLowerCase().includes("already been registered")
        ) {
            throw new AuthError("EMAIL_TAKEN", "Email sudah terdaftar");
        }
        throw new Error(authError.message);
    }

    const userId = authData.user.id;
    const role = input.role === "penyedia_jasa" ? "PENYEDIA_JASA" : "USER";

    // Simpan ke tabel pengguna
    const { error: profilError } = await supabase.from("pengguna").insert({
        id: userId,
        nama: input.nama.trim(),
        email,
        role,
    });

    if (profilError) {
        // Rollback: hapus auth user agar tidak orphan
        await supabase.auth.admin.deleteUser(userId);
        throw new Error(profilError.message);
    }

    // Simpan ke tabel turunan sesuai role
    const tabelTurunan = input.role === "penyedia_jasa" ? "penyedia_jasa" : "pengguna_jasa";
    const { error: turunanError } = await supabase.from(tabelTurunan).insert({ id: userId });

    if (turunanError) {
        await supabase.auth.admin.deleteUser(userId);
        throw new Error(turunanError.message);
    }

    return { id: userId, email, nama: input.nama.trim(), role };
}

export async function login(email: string, password: string) {
    const clean_email = email?.trim().toLowerCase();

    if (!clean_email || !password) {
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

    // Ambil data profil dari tabel publik
    const { data: profil, error: profil_error } = await supabase
        .from("pengguna")
        .select(`
            id, nama, email, role, status_akun, sanksi,
            penyedia_jasa ( id ),
            pengguna_jasa ( id )
        `)
        .eq("id", data.user.id)
        .single();

    if (profil_error || !profil) {
        await supabase.auth.signOut();

        throw new AuthError("PROFILE_NOT_FOUND", "Profil pengguna tidak ditemukan");
    }

    const diblokir = profil.status_akun === false || profil.sanksi === "SUSPENDED";
    if (diblokir) {
        await supabase.auth.signOut();

        throw new AuthError("ACCOUNT_SUSPENDED", "Akun Anda ditangguhkan");
    }

    await supabase.from("pengguna").update({ status_online: true }).eq("id", data.user.id);

    return {
        user: {
            id: data.user.id,
            email: data.user.email,
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

    const { data: profil, error: profil_error } = await supabase
        .from("pengguna")
        .select("id, nama, email, role, status_akun, sanksi, penyedia_jasa (id), pengguna_jasa(id)")
        .eq("id", user.id)
        .single();

    if (profil_error || !profil) {
        await supabase.auth.signOut();
        return null;
    }
    if (profil.status_akun === false || profil.sanksi === "SUSPENDED"){
      await supabase.auth.signOut();
        return null;  
    } 

    return {
        id: profil.id,
        email: profil.email!,
        nama: profil.nama,
        role: profil.role,
        status_akun: profil.status_akun,
        isPenyediaJasa: hasRelation(profil.penyedia_jasa),
        isPenggunaJasa: hasRelation(profil.pengguna_jasa),
    };
    
}

export async function loginAdmin(email: string, password: string) {
    // Gunakan fungsi login() yang sudah ada untuk validasi kredensial, profil, & sanksi
    const result = await login(email, password);

    if (result.user.role !== "ADMIN") {
        const supabase = await createClient();
        await supabase.auth.signOut(); // Hapus cookie sesi agar tidak nyangkut
        throw new AuthError("FORBIDDEN", "Akun ini tidak memiliki akses administrator");
    }

    return result;
}