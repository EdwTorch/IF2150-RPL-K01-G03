
"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Alert, Button, Input } from "@/components/elemen";
import { ApiError } from "@/lib/api";
import { loginAdmin } from "@/lib/client/auth";
import Navbar from "@/components/ui/navbar";

export default function HalamanLoginAdmin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pesanError, setPesanError] = useState("");
  const [sedangMengirim, setSedangMengirim] = useState(false);

  async function kirimLogin(e: FormEvent) {
  e.preventDefault();
  setPesanError("");
  setSedangMengirim(true);

  try {
    await loginAdmin(email, password);

    router.push("/admin/tiket");
    router.refresh();
  } catch (err) {
    if (err instanceof ApiError) {
      setPesanError(err.message);
    } else {
      setPesanError("Terjadi kesalahan. Coba lagi.");
    }

    setSedangMengirim(false);
  }
}

  return (
    <>
      <Navbar peran="ADMIN" logoOnly />

      <main className="flex min-h-screen items-center justify-center bg-muted px-4 py-12">
        <form
          onSubmit={kirimLogin}
          noValidate
          className="flex w-full max-w-[440px] flex-col gap-5 rounded-xl bg-surface p-8"
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-[32px] leading-tight font-extrabold text-ink">
              Login Admin
            </h1>
            <p className="text-body-sm text-ink-muted">
              Masuk untuk mengelola tiket laporan CariJasa.
            </p>
          </div>

          {pesanError && <Alert tipe="error">{pesanError}</Alert>}

          <Input
            label="Email"
            type="email"
            placeholder="nama@email.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Kata sandi"
            type="password"
            placeholder="Masukkan kata sandi"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" fullWidth loading={sedangMengirim}>
            Masuk sebagai Admin
          </Button>
        </form>
      </main>
    </>
  );
}
