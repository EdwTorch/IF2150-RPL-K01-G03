import { api } from "@/lib/api";

/** Sama dengan InputRegistrasi di services/auth.service.ts */
export type DataRegistrasi = {
  nama: string;
  email: string;
  password: string;
  role: "pengguna_jasa" | "penyedia_jasa";
};

export type UserSesi = {
  id: string;
  email: string;
  nama: string;
  role: string; // "USER" | "PENYEDIA_JASA" | "ADMIN"
  isPenyediaJasa: boolean;
  isPenggunaJasa: boolean;
};

/** POST /api/auth action "login" → { success, message, result: { user } } */
export async function login(email: string, password: string) {
  const respons = await api<{ result: { user: UserSesi } }>("/api/auth", {
    method: "POST",
    body: { action: "login", email, password },
  });
  return respons.result; // { user } — halaman login tidak perlu diubah
}

export const logout = () => api<{ message: string }>("/api/auth", { method: "POST", body: { action: "logout" } });

/** GET /api/auth → { success, message, user } */
export const sesiSaatIni = () => api<{ user: UserSesi }>("/api/auth");

/** POST /api/auth action "register" → { success, message, data } */
export const registrasi = (data_registrasi: DataRegistrasi) =>
  api<{ message: string }>("/api/auth", { method: "POST", body: { action: "register", ...data_registrasi } });