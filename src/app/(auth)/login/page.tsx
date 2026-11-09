"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import Navbar from "@/components/ui/navbar";
import { Alert, Button, Input } from "@/components/elemen";
import { ApiError } from "@/lib/api";
import { login, type UserSesi } from "@/lib/client/auth";

/**
 * I-02 Layar Login — C06 HalamanLogin
 * Atribut DPPL: formLogin, pesanError
 * Operasi DPPL: tampilkanForm(), kirimLogin(), tampilkanError()
 */

const RUTE_REGISTRASI = "/daftar";

type FieldForm = "email" | "password";

/** Halaman tujuan setelah login, sesuai peran */
function halamanAwal(user: UserSesi) {
  if (user.role === "admin") return "/admin";
  if (user.isPenyediaJasa) return "/portofolio";
  return "/cari";
}

function FormLogin() {
  const router = useRouter();
  const search_params = useSearchParams();
  const baru_registrasi = search_params.get("registrasi") === "berhasil";

  // ----- formLogin -----
  const [form_login, setFormLogin] = useState<Record<FieldForm, string>>({ email: "", password: "" });

  // ----- pesanError -----
  const [field_error, setFieldError] = useState<Partial<Record<FieldForm, string>>>({});
  const [pesan_error, setPesanError] = useState("");
  const [sedang_mengirim, setSedangMengirim] = useState(false);

  function ubahIsian(field: FieldForm, nilai: string) {
    setFormLogin((lama) => ({ ...lama, [field]: nilai }));
    if (field_error[field]) setFieldError((lama) => ({ ...lama, [field]: undefined }));
  }

  function validasiForm() {
    const error_baru: Partial<Record<FieldForm, string>> = {};
    if (!form_login.email.trim()) error_baru.email = "Email wajib diisi";
    if (!form_login.password) error_baru.password = "Kata sandi wajib diisi";
    setFieldError(error_baru);
    return Object.keys(error_baru).length === 0;
  }

  /** tampilkanError() — kode error dari services/auth.service.ts */
  function tampilkanError(err: unknown) {
    if (!(err instanceof ApiError)) {
      setPesanError("Terjadi kesalahan. Coba lagi.");
      return;
    }
    switch (err.kode) {
      case "INVALID_CREDENTIALS":
        setPesanError("Email atau kata sandi salah");
        setFieldError({ email: " ", password: " " }); // garis merah di dua isian, tanpa teks
        break;
      case "ACCOUNT_SUSPENDED":
      case "PROFILE_NOT_FOUND":
      case "EMPTY_INPUT":
      default:
        setPesanError(err.message); // pakai pesan dari backend apa adanya
    }
  }

  /** kirimLogin() */
  async function kirimLogin(e: FormEvent) {
    e.preventDefault();
    setPesanError("");
    if (!validasiForm()) return;

    setSedangMengirim(true);
    try {
      const { user } = await login(form_login.email, form_login.password);
      router.push(halamanAwal(user));
      router.refresh();
    } catch (err) {
      tampilkanError(err);
      setSedangMengirim(false);
    }
  }

  return (
    <form onSubmit={kirimLogin} noValidate className="flex w-full max-w-[440px] flex-col gap-5">
      <h1 className="text-[32px] leading-tight font-extrabold text-ink">Masuk ke CariJasa</h1>

      {baru_registrasi && !pesan_error && (
        <Alert tipe="success">Registrasi berhasil. Silakan masuk dengan akun Anda.</Alert>
      )}
      {pesan_error && <Alert tipe="error">{pesan_error}</Alert>}

      <Input
        label="Email"
        type="email"
        placeholder="nama@email.com"
        autoComplete="email"
        value={form_login.email}
        onChange={(e) => ubahIsian("email", e.target.value)}
        error={field_error.email?.trim() ? field_error.email : undefined}
        aria-invalid={!!field_error.email}
      />
      <Input
        label="Kata sandi"
        type="password"
        placeholder="Masukkan kata sandi"
        autoComplete="current-password"
        value={form_login.password}
        onChange={(e) => ubahIsian("password", e.target.value)}
        error={field_error.password?.trim() ? field_error.password : undefined}
        aria-invalid={!!field_error.password}
      />

      <Button type="submit" fullWidth loading={sedang_mengirim}>
        Masuk
      </Button>

      <p className="text-center text-body-md font-medium text-ink-muted">
        Belum punya akun?{" "}
        <Link href={RUTE_REGISTRASI} className="font-bold text-brand-text hover:underline">
          Daftar
        </Link>
      </p>
    </form>
  );
}

export default function HalamanLogin() {
  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <Navbar peran="TAMU" />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        {/* useSearchParams wajib dibungkus Suspense, kalau tidak `npm run build` gagal */}
        <Suspense>
          <FormLogin />
        </Suspense>
      </main>
    </div>
  );
}