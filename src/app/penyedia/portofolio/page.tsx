"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import { Alert, Button, Input, Textarea, UploadBox } from "@/components/elemen";
import { ApiError } from "@/lib/api";
import {
  ambilPortofolio,
  FORMAT_BERKAS_PORTOFOLIO,
  MAKS_MB_PORTOFOLIO,
  simpanPortofolio,
  type DataPortofolio,
} from "@/lib/client/portofolio";

/**
 * I-03 Layar Portofolio — C08 HalamanPortofolio
 * Atribut DPPL: formPortofolio, pesanError
 * Operasi DPPL: tampilkanPortofolio(), kirimPortofolio(data), tampilkanError()
 */

type FieldForm = "judul" | "berkas_pendukung";

const PESAN_ERROR_UMUM = "Data tidak valid. Judul wajib diisi dan berkas harus JPG, PNG, atau PDF sesuai batas ukuran.";

const jadiDaftar = (teks: string) => teks.split("\n").map((b) => b.trim()).filter(Boolean);
const jadiTeks = (daftar: string[]) => daftar.join("\n");
const adalahGambar = (url: string | null) => !!url && /\.(png|jpe?g|webp|gif)(\?|$)/i.test(url);

export default function HalamanPortofolio() {
  // ----- data tampilan (tampilkanPortofolio) -----
  const [portofolio, setPortofolio] = useState<DataPortofolio | null>(null);
  const [sedang_memuat, setSedangMemuat] = useState(true);
  const [error_muat, setErrorMuat] = useState("");

  // ----- formPortofolio -----
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [pengalaman, setPengalaman] = useState("");
  const [prestasi, setPrestasi] = useState("");
  const [berkas, setBerkas] = useState<File[]>([]);

  // ----- pesanError -----
  const [field_error, setFieldError] = useState<Partial<Record<FieldForm, string>>>({});
  const [pesan_error, setPesanError] = useState("");
  const [pesan_sukses, setPesanSukses] = useState("");
  const [sedang_mengirim, setSedangMengirim] = useState(false);

  /** tampilkanPortofolio() */
  async function tampilkanPortofolio() {
    setSedangMemuat(true);
    setErrorMuat("");
    try {
      const data = await ambilPortofolio();
      setPortofolio(data);
      setPengalaman(jadiTeks(data.pengalaman));
      setPrestasi(jadiTeks(data.prestasi));
    } catch (err) {
      setErrorMuat(err instanceof ApiError ? err.message : "Portofolio gagal dimuat.");
    } finally {
      setSedangMemuat(false);
    }
  }

  useEffect(() => {
    tampilkanPortofolio();
  }, []);

  /** PengontrolPortofolio.validasiInputBerkas() versi klien — Algo-1001 */
  function validasiForm() {
    const error_baru: Partial<Record<FieldForm, string>> = {};
    if (!judul.trim()) error_baru.judul = "Judul karya wajib diisi";
    if (berkas.length === 0) error_baru.berkas_pendukung = "Berkas pendukung wajib diunggah";
    setFieldError(error_baru);
    return Object.keys(error_baru).length === 0;
  }

  /** tampilkanError() */
  function tampilkanError(err?: unknown) {
    if (err instanceof ApiError && err.status === 401) {
      setPesanError("Sesi kamu sudah habis. Silakan login kembali.");
      return;
    }
    if (err instanceof ApiError && /berkas|format|ukuran/i.test(err.message)) {
      setFieldError({ berkas_pendukung: err.message }); // dari /api/upload
    }
    setPesanError(err instanceof ApiError && err.status !== 400 ? err.message : PESAN_ERROR_UMUM);
  }

  /** kirimPortofolio(data) — Algo-0801 */
  async function kirimPortofolio(e: FormEvent) {
    e.preventDefault();
    setPesanError("");
    setPesanSukses("");
    if (!validasiForm()) {
      tampilkanError();
      return;
    }

    setSedangMengirim(true);
    try {
      const data_baru = await simpanPortofolio({
        judul,
        deskripsi,
        pengalaman: jadiDaftar(pengalaman),
        prestasi: jadiDaftar(prestasi),
        berkas_pendukung: berkas[0],
      });
      setPortofolio(data_baru);
      setJudul("");
      setDeskripsi("");
      setBerkas([]);
      setPesanSukses("Portofolio berhasil disimpan.");
    } catch (err) {
      tampilkanError(err);
    } finally {
      setSedangMengirim(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-6 bg-canvas px-20 pt-12 pb-20">
      <header className="flex flex-col gap-2">
        <h1 className="text-h2 text-ink">Portofolio Saya</h1>
        <p className="text-body text-ink-muted">
          Lengkapi pengalaman, prestasi, dan karya terbaikmu agar calon pengguna jasa lebih yakin.
        </p>
      </header>

      <div className="grid grid-cols-[minmax(0,1fr)_460px] items-start gap-6">
        {/* ================= Kiri: tampilkanPortofolio ================= */}
        <div className="flex flex-col gap-6">
          {sedang_memuat ? (
            <p className="text-body text-ink-muted">Memuat portofolio…</p>
          ) : error_muat ? (
            <div className="flex flex-col items-start gap-3">
              <Alert tipe="error">{error_muat}</Alert>
              <Button variant="secondary" onClick={tampilkanPortofolio}>
                Coba lagi
              </Button>
            </div>
          ) : (
            portofolio && (
              <>
                <div className="grid grid-cols-2 gap-6">
                  <KartuDaftar judul="Pengalaman" ikon="/icons/lampiran.svg" isi={portofolio.pengalaman} kosong="Belum ada pengalaman." />
                  <KartuDaftar judul="Prestasi" ikon="/icons/star-outline.svg" isi={portofolio.prestasi} kosong="Belum ada prestasi." />
                </div>

                <section className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-h4 text-ink">Karya yang sudah diunggah</h2>
                    <span className="text-caption text-ink-muted">{portofolio.daftar_karya.length} karya</span>
                  </div>

                  {portofolio.daftar_karya.length === 0 ? (
                    <p className="text-body-sm text-ink-muted">Belum ada karya. Tambahkan karya pertamamu lewat form di kanan.</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-4">
                      {portofolio.daftar_karya.map((karya) => {
                        const isi_kartu = (
                          <>
                            <div className="flex h-[110px] items-center justify-center overflow-hidden rounded-lg bg-muted">
                              {adalahGambar(karya.berkas_pendukung) ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={karya.berkas_pendukung!} alt={karya.judul} className="h-full w-full object-cover" />
                              ) : (
                                <Image src={karya.berkas_pendukung ? "/icons/lampiran.svg" : "/icons/gambar.svg"} alt="" width={24} height={24} />
                              )}
                            </div>
                            <p className="mt-2 truncate text-label text-ink">{karya.judul}</p>
                            <p className="line-clamp-2 text-caption text-ink-muted">{karya.deskripsi || "Tanpa deskripsi"}</p>
                          </>
                        );
                        return karya.berkas_pendukung ? (
                          <a
                            key={karya.id_portofolio}
                            href={karya.berkas_pendukung}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg border border-line p-2 hover:bg-canvas"
                          >
                            {isi_kartu}
                          </a>
                        ) : (
                          <div key={karya.id_portofolio} className="rounded-lg border border-line p-2">
                            {isi_kartu}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              </>
            )
          )}
        </div>

        {/* ================= Kanan: formPortofolio ================= */}
        <form
          onSubmit={kirimPortofolio}
          noValidate
          className="sticky top-6 flex flex-col gap-5 rounded-xl border border-line bg-surface p-6"
        >
          <h2 className="text-h4 text-ink">Isi portofolio</h2>

          {pesan_error && <Alert tipe="error">{pesan_error}</Alert>}
          {pesan_sukses && <Alert tipe="success">{pesan_sukses}</Alert>}

          <Input
            label="Judul karya"
            placeholder="Contoh: Logo kedai kopi"
            value={judul}
            onChange={(e) => {
              setJudul(e.target.value);
              if (field_error.judul) setFieldError((l) => ({ ...l, judul: undefined }));
            }}
            error={field_error.judul}
          />
          <Textarea label="Deskripsi" rows={4} value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} />
          <Textarea
            label="Pengalaman"
            rows={4}
            helper="Tulis satu pengalaman per baris"
            value={pengalaman}
            onChange={(e) => setPengalaman(e.target.value)}
          />
          <Textarea
            label="Prestasi"
            rows={4}
            helper="Tulis satu prestasi per baris"
            value={prestasi}
            onChange={(e) => setPrestasi(e.target.value)}
          />
          <UploadBox
            label="Berkas pendukung"
            format={FORMAT_BERKAS_PORTOFOLIO}
            maksMB={MAKS_MB_PORTOFOLIO}
            maksBerkas={1}
            berkas={berkas}
            onUbah={(baru) => {
              setBerkas(baru);
              if (field_error.berkas_pendukung) setFieldError((l) => ({ ...l, berkas_pendukung: undefined }));
            }}
            error={field_error.berkas_pendukung}
          />

          <div className="flex justify-end">
            <Button type="submit" loading={sedang_mengirim}>
              Simpan Portofolio
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}

function KartuDaftar({ judul, ikon, isi, kosong }: { judul: string; ikon: string; isi: string[]; kosong: string }) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-6">
      <div className="flex items-center gap-3">
        <span className="flex size-8 items-center justify-center rounded-lg bg-accent">
          <Image src={ikon} alt="" width={16} height={16} />
        </span>
        <h2 className="text-h4 text-ink">{judul}</h2>
      </div>
      {isi.length === 0 ? (
        <p className="text-body-sm text-ink-muted">{kosong}</p>
      ) : (
        <ul className="flex list-disc flex-col gap-1 pl-5 text-body-sm text-ink">
          {isi.map((baris, i) => (
            <li key={i}>{baris}</li>
          ))}
        </ul>
      )}
    </section>
  );
}