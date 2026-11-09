"use client";

import { useEffect, useState, type FormEvent } from "react";
import Navbar from "@/components/ui/navbar";
import { Alert, Button, Input, LampiranBukti, PageContainer, PageHero, Textarea, UploadBox } from "@/components/elemen";
import { ApiError } from "@/lib/api";
import { sesiSaatIni } from "@/lib/client/auth";
import { ambilPortofolio, simpanPortofolio, type DataPortofolio } from "@/lib/client/portofolio";
import { formatUkuranBerkas } from "@/lib/format";

/**
 * I-03 Layar Portofolio — C08 HalamanPortofolio
 * Atribut DPPL: formPortofolio, pesanError
 * Operasi DPPL: tampilkanPortofolio(), kirimPortofolio(data), tampilkanError()
 */

type FieldForm = "judul" | "berkas_pendukung";

const FORM_KOSONG = { judul: "", deskripsi: "" };

/** Pecah teks per baris jadi daftar, buang baris kosong */
const jadiDaftar = (teks: string) => teks.split("\n").map((b) => b.trim()).filter(Boolean);

export default function HalamanPortofolio() {
  const [nama_pengguna, setNamaPengguna] = useState<string>();

  // ----- data yang ditampilkan (tampilkanPortofolio) -----
  const [portofolio, setPortofolio] = useState<DataPortofolio | null>(null);
  const [sedang_memuat, setSedangMemuat] = useState(true);
  const [error_muat, setErrorMuat] = useState("");

  // ----- formPortofolio -----
  const [form_portofolio, setFormPortofolio] = useState(FORM_KOSONG);
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
      setPengalaman(data.pengalaman);
      setPrestasi(data.prestasi);
    } catch (err) {
      setErrorMuat(err instanceof ApiError ? err.message : "Gagal memuat portofolio.");
    } finally {
      setSedangMemuat(false);
    }
  }

  useEffect(() => {
    tampilkanPortofolio();
    sesiSaatIni()
      .then(({ user }) => setNamaPengguna(user.nama))
      .catch(() => {}); // belum login / backend mati → navbar pakai nama bawaan
  }, []);

  function validasiForm() {
    const error_baru: Partial<Record<FieldForm, string>> = {};
    if (!form_portofolio.judul.trim()) error_baru.judul = "Judul karya wajib diisi";
    if (berkas.length === 0) error_baru.berkas_pendukung = "Berkas pendukung wajib diunggah";
    setFieldError(error_baru);
    return Object.keys(error_baru).length === 0;
  }

  /** tampilkanError() */
  function tampilkanError(err: unknown) {
    if (!(err instanceof ApiError)) {
      setPesanError("Terjadi kesalahan. Coba lagi.");
      return;
    }
    if (err.kode === "INVALID_FILE") setFieldError({ berkas_pendukung: err.message });
    else if (err.kode === "EMPTY_INPUT") setFieldError({ judul: err.message });
    else setPesanError(err.message);
  }

  /** kirimPortofolio(data) — Algo-0801 */
  async function kirimPortofolio(e: FormEvent) {
    e.preventDefault();
    setPesanError("");
    setPesanSukses("");
    if (!validasiForm()) return;

    setSedangMengirim(true);
    try {
      const data_baru = await simpanPortofolio({
        ...form_portofolio,
        pengalaman,
        prestasi,
        berkas_pendukung: berkas[0] ?? null,
      });
      setPortofolio(data_baru);
      setFormPortofolio(FORM_KOSONG);
      setBerkas([]);
      setPesanSukses("Portofolio berhasil disimpan");
    } catch (err) {
      tampilkanError(err);
    } finally {
      setSedangMengirim(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar peran="PENYEDIA_JASA" nama={nama_pengguna} />

      <PageContainer>
        <PageHero
          judul="Portofolio"
          subjudul="Tunjukkan pengalaman, prestasi, dan karya terbaikmu kepada calon pengguna jasa."
        />

        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start gap-6">
          {/* ================= Kiri: formPortofolio ================= */}
          <form
            onSubmit={kirimPortofolio}
            noValidate
            className="flex flex-col gap-5 rounded-xl border border-line bg-surface p-6"
          >
            <h2 className="text-h4 text-ink">Tambah karya</h2>

            {pesan_error && <Alert tipe="error">{pesan_error}</Alert>}
            {pesan_sukses && <Alert tipe="success">{pesan_sukses}</Alert>}

            <Input
              label="Judul karya"
              placeholder="Contoh: Logo kedai kopi"
              value={form_portofolio.judul}
              onChange={(e) => {
                setFormPortofolio((lama) => ({ ...lama, judul: e.target.value }));
                if (field_error.judul) setFieldError((lama) => ({ ...lama, judul: undefined }));
              }}
              error={field_error.judul}
            />
            <Textarea
              label="Deskripsi"
              placeholder="Ceritakan singkat tentang karya ini"
              rows={4}
              value={form_portofolio.deskripsi}
              onChange={(e) => setFormPortofolio((lama) => ({ ...lama, deskripsi: e.target.value }))}
            />
            <Textarea
              label="Pengalaman"
              placeholder="Satu pengalaman per baris"
              helper="Tulis satu pengalaman per baris"
              rows={4}
              value={pengalaman}
              onChange={(e) => setPengalaman(e.target.value)}
            />
            <Textarea
              label="Prestasi"
              placeholder="Satu prestasi per baris"
              helper="Tulis satu prestasi per baris"
              rows={3}
              value={prestasi}
              onChange={(e) => setPrestasi(e.target.value)}
            />
            <UploadBox
              label="Berkas pendukung"
              format={["jpg", "jpeg", "png", "pdf"]}
              maksMB={10}
              maksBerkas={1}
              wajib
              berkas={berkas}
              onUbah={(baru) => {
                setBerkas(baru);
                if (field_error.berkas_pendukung) setFieldError((lama) => ({ ...lama, berkas_pendukung: undefined }));
              }}
              error={field_error.berkas_pendukung}
            />

            <Button type="submit" fullWidth loading={sedang_mengirim}>
              Simpan Portofolio
            </Button>
          </form>

          {/* ================= Kanan: tampilkanPortofolio ================= */}
          <section className="flex flex-col gap-6 rounded-xl border border-line bg-surface p-6">
            {sedang_memuat ? (
              <p className="text-body-sm text-ink-muted">Memuat portofolio…</p>
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
                  <BagianDaftar judul="Pengalaman" isi={jadiDaftar(portofolio.pengalaman)} kosong="Belum ada pengalaman." />
                  <BagianDaftar judul="Prestasi" isi={jadiDaftar(portofolio.prestasi)} kosong="Belum ada prestasi." />

                  <div className="flex flex-col gap-3">
                    <h2 className="text-h4 text-ink">Karya ({portofolio.daftar_karya.length})</h2>
                    {portofolio.daftar_karya.length === 0 ? (
                      <p className="text-body-sm text-ink-muted">Belum ada karya. Tambahkan karya pertamamu di form.</p>
                    ) : (
                      portofolio.daftar_karya.map((karya) => (
                        <div key={karya.id} className="flex flex-col gap-2">
                          <div>
                            <p className="text-label text-ink">{karya.judul}</p>
                            {karya.deskripsi && <p className="text-body-sm text-ink-muted">{karya.deskripsi}</p>}
                          </div>
                          <LampiranBukti
                            tipe={karya.berkas_pendukung.tipe.startsWith("image/") ? "gambar" : "berkas"}
                            nama={karya.berkas_pendukung.nama}
                            keterangan={formatUkuranBerkas(karya.berkas_pendukung.ukuran)}
                            hrefLihat={karya.berkas_pendukung.url}
                          />
                        </div>
                      ))
                    )}
                  </div>
                </>
              )
            )}
          </section>
        </div>
      </PageContainer>
    </div>
  );
}

function BagianDaftar({ judul, isi, kosong }: { judul: string; isi: string[]; kosong: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-h4 text-ink">{judul}</h2>
      {isi.length === 0 ? (
        <p className="text-body-sm text-ink-muted">{kosong}</p>
      ) : (
        <ul className="flex list-disc flex-col gap-1 pl-5 text-body text-ink">
          {isi.map((baris, i) => (
            <li key={i}>{baris}</li>
          ))}
        </ul>
      )}
    </div>
  );
}