"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import Navbar from "@/components/ui/navbar";
import { Alert, Button, Input, OptionCard } from "@/components/elemen";
import { ApiError } from "@/lib/api";
import { registrasi, type DataRegistrasi } from "@/lib/client/auth";

/**
 * I-01 Layar Registrasi — C04 HalamanRegistrasi
 * Atribut DPPL: formRegistrasi, pesanError
 * Operasi DPPL: tampilkanForm(), kirimRegistrasi(), tampilkanError()
 * Backend: POST /api/auth action "register" (services/auth.service.ts → registrasi())
 */

const RUTE_LOGIN = "/login";
const MIN_PANJANG_PASSWORD = 8; // sama dengan auth.service.ts

type FieldForm = "nama" | "email" | "password";

const FORM_KOSONG: Record<FieldForm, string> = { nama: "", email: "", password: "" };

export default function HalamanRegistrasi() {
  const router = useRouter();

  // ----- formRegistrasi -----
  const [form_registrasi, setFormRegistrasi] = useState(FORM_KOSONG);
  const [role, setRole] = useState<DataRegistrasi["role"]>("pengguna_jasa");

  // ----- pesanError -----
  const [field_error, setFieldError] = useState<Partial<Record<FieldForm, string>>>({});
  const [pesan_error, setPesanError] = useState("");
  const [sedang_mengirim, setSedangMengirim] = useState(false);

  function ubahIsian(field: FieldForm, nilai: string) {
    setFormRegistrasi((lama) => ({ ...lama, [field]: nilai }));
    if (field_error[field]) setFieldError((lama) => ({ ...lama, [field]: undefined }));
  }

  /** Validasi klien (server memvalidasi ulang lewat validasiInputRegistrasi) */
  function validasiForm() {
    const error_baru: Partial<Record<FieldForm, string>> = {};
    if (!form_registrasi.nama.trim())
      error_baru.nama = role === "penyedia_jasa" ? "Nama penyedia wajib diisi" : "Nama wajib diisi";
    if (!form_registrasi.email.trim()) error_baru.email = "Email wajib diisi";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form_registrasi.email.trim())) error_baru.email = "Format email tidak valid";
    if (form_registrasi.password.length < MIN_PANJANG_PASSWORD)
      error_baru.password = `Kata sandi minimal ${MIN_PANJANG_PASSWORD} karakter`;
    else if (!form_registrasi.password.trim()) error_baru.password = "Kata sandi tidak boleh hanya spasi";
    setFieldError(error_baru);
    return Object.keys(error_baru).length === 0;
  }

  /** tampilkanError() — kode dari AuthError di auth.service.ts */
  function tampilkanError(err: unknown) {
    if (!(err instanceof ApiError)) {
      setPesanError("Terjadi kesalahan. Coba lagi.");
      return;
    }
    switch (err.kode) {
      case "EMAIL_TAKEN":
        setFieldError({ email: "Email sudah terdaftar" });
        setPesanError("Email telah terdaftar. Silakan menggunakan email lain atau melakukan login.");
        break;
      case "INVALID_EMAIL":
        setFieldError({ email: err.message });
        break;
      case "WEAK_PASSWORD":
        setFieldError({ password: err.message });
        break;
      default: // EMPTY_INPUT, INVALID_ROLE, INTERNAL_ERROR, JARINGAN
        setPesanError(err.message);
    }
  }

  /** kirimRegistrasi() */
  async function kirimRegistrasi(e: FormEvent) {
    e.preventDefault();
    setPesanError("");
    if (!validasiForm()) return;

    setSedangMengirim(true);
    try {
      await registrasi({
        nama: form_registrasi.nama.trim(),
        email: form_registrasi.email.trim(),
        password: form_registrasi.password,
        role,
      });
      router.push(`${RUTE_LOGIN}?registrasi=berhasil`); // Algo-0401: arahkan ke login
    } catch (err) {
      tampilkanError(err);
      setSedangMengirim(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <Navbar peran="TAMU" />

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <form onSubmit={kirimRegistrasi} noValidate className="flex w-full max-w-[440px] flex-col gap-5">
          <h1 className="text-[32px] leading-tight font-extrabold text-ink">Registrasi akun CariJasa</h1>

          {pesan_error && <Alert tipe="error">{pesan_error}</Alert>}

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-label leading-normal text-ink">Daftar sebagai</legend>
            <div className="flex gap-3">
              <OptionCard
                name="role"
                value="pengguna_jasa"
                terpilih={role === "pengguna_jasa"}
                onPilih={() => setRole("pengguna_jasa")}
                judul="Pengguna Jasa"
                deskripsi="Saya ingin mencari jasa"
              />
              <OptionCard
                name="role"
                value="penyedia_jasa"
                terpilih={role === "penyedia_jasa"}
                onPilih={() => setRole("penyedia_jasa")}
                judul="Penyedia Jasa"
                deskripsi="Saya ingin menawarkan jasa"
              />
            </div>
          </fieldset>

          <Input
            label={role === "penyedia_jasa" ? "Nama penyedia" : "Nama"}
            placeholder={role === "penyedia_jasa" ? "Masukkan nama penyedia" : "Masukkan nama"}
            autoComplete="name"
            value={form_registrasi.nama}
            onChange={(e) => ubahIsian("nama", e.target.value)}
            error={field_error.nama}
          />
          <Input
            label="Email"
            type="email"
            placeholder="nama@email.com"
            autoComplete="email"
            value={form_registrasi.email}
            onChange={(e) => ubahIsian("email", e.target.value)}
            error={field_error.email}
          />
          <Input
            label="Kata sandi"
            type="password"
            placeholder="Minimal 8 karakter"
            autoComplete="new-password"
            value={form_registrasi.password}
            onChange={(e) => ubahIsian("password", e.target.value)}
            helper="Gunakan minimal 8 karakter"
            error={field_error.password}
          />

          <Button type="submit" fullWidth loading={sedang_mengirim}>
            Daftar
          </Button>

          <p className="text-center text-body-md font-medium text-ink-muted">
            Sudah punya akun?{" "}
            <Link href={RUTE_LOGIN} className="font-bold text-brand-text hover:underline">
              Masuk
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}