"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import Navbar from "@/components/ui/navbar";
import { Alert } from "@/components/elemen/Alert";
import { Button } from "@/components/elemen/Button";
import { Input } from "@/components/elemen/Input";
import { OptionCard } from "@/components/elemen/OptionCard";
import { ApiError } from "@/lib/api";
import { registrasi, type DataRegistrasi } from "@/lib/client/auth";

/**
 * I-01 Layar Registrasi — C04 HalamanRegistrasi
 * Atribut DPPL: formRegistrasi, pesanError
 * Operasi DPPL: tampilkanForm(), kirimRegistrasi(), tampilkanError()
 */

const RUTE_LOGIN = "/login"; // sesuaikan dengan folder halaman login di app/(auth)

type FieldForm = "nama" | "email" | "noTelepon" | "password";

const FORM_KOSONG: Record<FieldForm, string> = { nama: "", email: "", noTelepon: "", password: "" };

export default function HalamanRegistrasi() {
  const router = useRouter();

  // ----- formRegistrasi -----
  const [form_registrasi, setFormRegistrasi] = useState(FORM_KOSONG);
  const [role, setRole] = useState<DataRegistrasi["role"]>("PENGGUNA_JASA");

  // ----- pesanError -----
  const [field_error, setFieldError] = useState<Partial<Record<FieldForm, string>>>({});
  const [pesan_error, setPesanError] = useState("");
  const [sedang_mengirim, setSedangMengirim] = useState(false);

  function ubahIsian(field: FieldForm, nilai: string) {
    setFormRegistrasi((lama) => ({ ...lama, [field]: nilai }));
    // hapus error isian itu begitu pengguna mulai mengetik ulang
    if (field_error[field]) setFieldError((lama) => ({ ...lama, [field]: undefined }));
  }

  /** Validasi di sisi klien sebelum dikirim (server tetap memvalidasi ulang) */
  function validasiForm() {
    const error_baru: Partial<Record<FieldForm, string>> = {};
    if (!form_registrasi.nama.trim()) error_baru.nama = "Nama wajib diisi";
    if (!form_registrasi.email.trim()) error_baru.email = "Email wajib diisi";
    else if (!/^\S+@\S+\.\S+$/.test(form_registrasi.email)) error_baru.email = "Format email tidak valid";
    if (!form_registrasi.noTelepon.trim()) error_baru.noTelepon = "Nomor telepon wajib diisi";
    if (form_registrasi.password.length < 8) error_baru.password = "Kata sandi minimal 8 karakter";
    setFieldError(error_baru);
    return Object.keys(error_baru).length === 0;
  }

  /** tampilkanError() */
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
      case "PHONE_TAKEN":
        setFieldError({ noTelepon: "Nomor telepon sudah terdaftar" });
        setPesanError("Nomor telepon telah terdaftar. Silakan menggunakan nomor lain atau melakukan login.");
        break;
      case "INVALID_EMAIL":
        setFieldError({ email: err.message });
        break;
      case "WEAK_PASSWORD":
        setFieldError({ password: err.message });
        break;
      default:
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
      await registrasi({ ...form_registrasi, role });
      router.push(`${RUTE_LOGIN}?registrasi=berhasil`); // Algo-0401: arahkan ke login
    } catch (err) {
      tampilkanError(err);
    } finally {
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

          {/* Daftar sebagai */}
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-label leading-normal text-ink">Daftar sebagai</legend>
            <div className="flex gap-3">
              <OptionCard
                name="role"
                value="pengguna_jasa"
                terpilih={role === "PENGGUNA_JASA"}
                onPilih={() => setRole("PENGGUNA_JASA")}
                judul="Pengguna Jasa"
                deskripsi="Saya ingin mencari jasa"
              />
              <OptionCard
                name="role"
                value="penyedia_jasa"
                terpilih={role === "PENYEDIA_JASA"}
                onPilih={() => setRole("PENYEDIA_JASA")}
                judul="Penyedia Jasa"
                deskripsi="Saya ingin menawarkan jasa"
              />
            </div>
          </fieldset>

            <Input
                label={role === "PENYEDIA_JASA" ? "Nama penyedia" : "Nama"}
                placeholder={role === "PENYEDIA_JASA" ? "Masukkan nama penyedia" : "Masukkan nama"}
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
            label="Nomor telepon"
            type="tel"
            inputMode="numeric"
            placeholder="08xx xxxx xxxx"
            autoComplete="tel"
            value={form_registrasi.noTelepon}
            onChange={(e) => ubahIsian("noTelepon", e.target.value.replace(/[^0-9+]/g, ""))}
            error={field_error.noTelepon}
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