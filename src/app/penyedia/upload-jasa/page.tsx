"use client";

import { useState, type FormEvent } from "react";
import { Alert, Button, Input, PageHero, Select, Textarea, UploadBox } from "@/components/elemen";
import Footer from "@/components/ui/footer";
import { ApiError } from "@/lib/api";
import { DAFTAR_KATEGORI, FORMAT_BERKAS_JASA, MAKS_MB_BERKAS_JASA, unggahJasa } from "@/lib/client/jasa";
import { parseRupiah } from "@/lib/format";

/**
 * I-04 Layar Upload Jasa — C13 HalamanUploadJasa
 * Atribut DPPL: formNamaJasa, formKategori, formDeskripsi, formHarga, inputUploadBerkas, tombolUnggah, pesanError
 * Operasi DPPL: klikUnggah(), tampilkanPesanError(), tampilkanNotifikasiBerhasil()
 */

type FieldForm = "nama_jasa" | "kategori" | "harga" | "deskripsi" | "berkas";

const PESAN_ERROR_UMUM = "Data belum lengkap atau format berkas tidak didukung. Periksa kembali isian yang ditandai.";
const PESAN_BERHASIL = "Penawaran jasa berhasil diunggah dan sudah tampil di pencarian.";

/** 500000 → "500.000" */
const formatRibuan = (angka: number) => (angka ? angka.toLocaleString("id-ID") : "");

export default function HalamanUploadJasa() {
  // ----- form -----
  const [form_nama_jasa, setFormNamaJasa] = useState("");
  const [form_kategori, setFormKategori] = useState("");
  const [form_harga, setFormHarga] = useState(0);
  const [form_deskripsi, setFormDeskripsi] = useState("");
  const [input_upload_berkas, setInputUploadBerkas] = useState<File[]>([]);

  // ----- pesan -----
  const [field_error, setFieldError] = useState<Partial<Record<FieldForm, string>>>({});
  const [pesan_error, setPesanError] = useState("");
  const [pesan_berhasil, setPesanBerhasil] = useState("");
  const [sedang_mengirim, setSedangMengirim] = useState(false);

  function hapusError(field: FieldForm) {
    if (field_error[field]) setFieldError((lama) => ({ ...lama, [field]: undefined }));
  }

  /** JasaController.validasiDataJasa() versi klien — server tetap memvalidasi ulang */
  function validasiForm() {
    const error_baru: Partial<Record<FieldForm, string>> = {};
    if (!form_nama_jasa.trim()) error_baru.nama_jasa = "Nama jasa wajib diisi";
    if (!form_kategori) error_baru.kategori = "Kategori wajib dipilih";
    if (!form_harga) error_baru.harga = "Harga wajib diisi";
    if (!form_deskripsi.trim()) error_baru.deskripsi = "Deskripsi wajib diisi";
    if (input_upload_berkas.length === 0) error_baru.berkas = "Foto / berkas contoh wajib diunggah";
    setFieldError(error_baru);
    return Object.keys(error_baru).length === 0;
  }

  /** tampilkanPesanError() */
  function tampilkanPesanError(err?: unknown) {
    if (err instanceof ApiError && err.status === 401) {
      setPesanError("Sesi kamu sudah habis. Silakan login kembali.");
      return;
    }
    setPesanError(err instanceof ApiError ? err.message : PESAN_ERROR_UMUM);
  }

  /** tampilkanNotifikasiBerhasil() */
  function tampilkanNotifikasiBerhasil() {
    setPesanBerhasil(PESAN_BERHASIL);
    setFormNamaJasa("");
    setFormKategori("");
    setFormHarga(0);
    setFormDeskripsi("");
    setInputUploadBerkas([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /** klikUnggah() */
  async function klikUnggah(e: FormEvent) {
    e.preventDefault();
    setPesanError("");
    setPesanBerhasil("");
    if (!validasiForm()) {
      tampilkanPesanError();
      return;
    }

    setSedangMengirim(true);
    try {
      await unggahJasa({
        nama_jasa: form_nama_jasa,
        kategori: form_kategori,
        harga: form_harga,
        deskripsi: form_deskripsi,
        berkas: input_upload_berkas,
      });
      tampilkanNotifikasiBerhasil();
    } catch (err) {
      tampilkanPesanError(err);
    } finally {
      setSedangMengirim(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <main className="flex flex-1 justify-center px-20 pt-12 pb-20">
        <div className="flex w-full max-w-[800px] flex-col gap-7">
          <PageHero judul="Unggah penawaran jasa" subjudul="Lengkapi detail jasamu agar mudah ditemukan pengguna jasa." />

          <form
            onSubmit={klikUnggah}
            noValidate
            className="flex flex-col gap-[22px] rounded-xl border border-line bg-surface p-9"
          >
            {pesan_error && <Alert tipe="error">{pesan_error}</Alert>}
            {pesan_berhasil && <Alert tipe="success">{pesan_berhasil}</Alert>}

            <Input
              label="Nama jasa"
              placeholder="Contoh: Desain logo & identitas brand"
              value={form_nama_jasa}
              onChange={(e) => {
                setFormNamaJasa(e.target.value);
                hapusError("nama_jasa");
              }}
              error={field_error.nama_jasa}
            />

            <div className="grid grid-cols-2 gap-5">
              <Select
                label="Kategori"
                placeholder="Pilih kategori"
                opsi={DAFTAR_KATEGORI.map((k) => ({ value: k, label: k }))}
                value={form_kategori}
                onChange={(e) => {
                  setFormKategori(e.target.value);
                  hapusError("kategori");
                }}
                error={field_error.kategori}
              />
              <Input
                label="Harga (Rp)"
                inputMode="numeric"
                placeholder="Contoh: 500.000"
                value={formatRibuan(form_harga)}
                onChange={(e) => {
                  setFormHarga(parseRupiah(e.target.value));
                  hapusError("harga");
                }}
                error={field_error.harga}
              />
            </div>

            <Textarea
              label="Deskripsi"
              placeholder="Jelaskan layanan, hasil yang didapat, dan lama pengerjaan"
              rows={5}
              value={form_deskripsi}
              onChange={(e) => {
                setFormDeskripsi(e.target.value);
                hapusError("deskripsi");
              }}
              error={field_error.deskripsi}
            />

            <UploadBox
              label="Foto / berkas contoh"
              format={FORMAT_BERKAS_JASA}
              maksMB={MAKS_MB_BERKAS_JASA}
              maksBerkas={5}
              berkas={input_upload_berkas}
              onUbah={(baru) => {
                setInputUploadBerkas(baru);
                hapusError("berkas");
              }}
              error={field_error.berkas}
            />

            <div className="flex justify-end">
              <Button type="submit" loading={sedang_mengirim}>
                Unggah Jasa
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}