import { createClient } from "@/lib/supabase/server";

export class AuthError extends Error {
    constructor(
        public code: "EMPTY_INPUT" | "INVALID_CREDENTIALS" | "ACCOUNT_SUSPENDED" | "PROFILE_NOT_FOUND",
        message: string
    ) {
        super(message);
        this.name = "AuthError";
    }
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

    return {
        user: {
            id: data.user.id,
            email: data.user.email,
            nama: profil.nama,
            role: profil.role,
            isPenyedia: !!profil.penyedia_jasa,
            isPenggunaJasa: !!profil.pengguna_jasa
        }
    };
}