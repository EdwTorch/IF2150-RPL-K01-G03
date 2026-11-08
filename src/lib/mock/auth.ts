import { ApiError } from "@/lib/api";
import type { DataRegistrasi } from "@/lib/client/auth";

// MOCK SEMENTARA — dipakai sampai backend punya action "register"
const EMAIL_TERDAFTAR = ["rina@carijasa.test", "budi@carijasa.test"];
const TELEPON_TERDAFTAR = ["081234567890"];
const tunda = (ms = 600) => new Promise((r) => setTimeout(r, ms));

export async function mockRegistrasi(data: DataRegistrasi) {
  await tunda();
  if (data.nama.trim().toLowerCase() === "timeout") await tunda(11_000);
  if (data.nama.trim().toLowerCase() === "error")
    throw new ApiError(500, "SERVER", "Terjadi kesalahan pada server.");

  if (!data.nama.trim() || !data.email.trim() || !data.noTelepon.trim() || !data.password)
    throw new ApiError(400, "EMPTY_INPUT", "Semua isian wajib diisi");
  if (!/^\S+@\S+\.\S+$/.test(data.email))
    throw new ApiError(400, "INVALID_EMAIL", "Format email tidak valid");
  if (data.password.length < 8)
    throw new ApiError(400, "WEAK_PASSWORD", "Kata sandi minimal 8 karakter");
  if (EMAIL_TERDAFTAR.includes(data.email.toLowerCase()))
    throw new ApiError(409, "EMAIL_TAKEN", "Email sudah terdaftar");
  if (TELEPON_TERDAFTAR.includes(data.noTelepon))
    throw new ApiError(409, "PHONE_TAKEN", "Nomor telepon sudah terdaftar");

  return { message: "Registrasi berhasil" };
}