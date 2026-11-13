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

// Sudah ada di backend → API asli
export const login = async (email: string, password: string) => {
  const response = await api<{
    success: boolean;
    message: string;
    result: {
      user: UserSesi;
    };
  }>("/api/auth", {
    method: "POST",
    body: { action: "login", email, password },
  });

  return {
    user: response.result.user,
  };
};

export const loginAdmin = (email: string, password: string) =>
  api<{
    success: boolean;
    message: string;
    result: { user: UserSesi };
  }>("/api/admin/auth/login", {
    method: "POST",
    body: { email, password },
  });
  
export const logout = () =>
  api<{ message: string }>("/api/auth", { method: "POST", body: { action: "logout" } });

/** GET /api/auth → { success, message, user } */
export const sesiSaatIni = () => api<{ user: UserSesi }>("/api/auth");

/** POST /api/auth action "register" → { success, message, data } */
export const registrasi = (data_registrasi: DataRegistrasi) =>
  api<{ message: string }>("/api/auth", { method: "POST", body: { action: "register", ...data_registrasi } });