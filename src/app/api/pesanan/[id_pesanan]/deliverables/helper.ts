import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export type KonteksPesanan = { params: Promise<{ id_pesanan: string }> };

/** User yang sedang login, atau null */
export async function userLogin() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return error ? null : user;
}

export const belumLogin = () =>
  NextResponse.json({ success: false, message: "Anda belum login", error_code: "UNAUTHORIZED" }, { status: 401 });

/** Terjemahkan pesan error service deliverables → status HTTP */
export function responsGagal(err: unknown) {
  const message = err instanceof Error ? err.message : "";

  const [status, error_code] = /akses ditolak/i.test(message)
    ? [403, "FORBIDDEN"]
    : /tidak ditemukan|belum dikumpulkan/i.test(message)
      ? [404, "NOT_FOUND"]
      : /tidak boleh kosong|wajib|unggah berkas|tidak valid|hanya dapat|belum bisa|sudah diselesaikan|habis|melebihi|tidak diizinkan/i.test(message)
        ? [400, "VALIDATION_ERROR"]
        : [500, "SERVER_ERROR"];

  if (status === 500) console.error("[deliverables]", err);

  return NextResponse.json(
    {
      success: false,
      message: status === 500 ? "Terjadi kesalahan pada sistem. Silakan coba beberapa saat lagi." : message,
      error_code,
    },
    { status },
  );
}
