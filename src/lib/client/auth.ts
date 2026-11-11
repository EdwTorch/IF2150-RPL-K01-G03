import { api } from "@/lib/api";
import { mockRegistrasi } from "@/lib/mock/auth";

export type DataRegistrasi = {
  nama: string;
  email: string;
  noTelepon: string;
  password: string;
  role: "pengguna_jasa" | "penyedia_jasa"; // DRAF — konfirmasi nilai ke BE
};

export type UserSesi = {
  id: string;
  email: string;
  nama: string;
  role: string;
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

export const sesiSaatIni = () => api<{ user: UserSesi }>("/api/auth");

// Belum ada di backend → mock dulu
const REGISTRASI_SUDAH_ADA = false; // ubah ke true setelah BE menambah action "register"

export function registrasi(data: DataRegistrasi) {
  if (!REGISTRASI_SUDAH_ADA) return mockRegistrasi(data);
  return api<{ message: string }>("/api/auth", { method: "POST", body: { action: "register", ...data } });
}