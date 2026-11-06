import { createClient } from "@/lib/supabase/server";
export async function verifyAdmin() {
    const supabase = await createClient();
    const {
    data: { user },
    error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error("UNAUTHORIZED");
    }

    // Sesuaikan nama kolom 'id' dan 'role' dengan struktur tabel pengguna Anda
    const { data: profile, error: profileError } = await supabase
    .from("pengguna")
    .select("role")
    .eq("id", user.id)
    .single();

    if (profileError || !profile || profile.role !== "ADMIN") {
        throw new Error("FORBIDDEN");
    }

    return user;
}