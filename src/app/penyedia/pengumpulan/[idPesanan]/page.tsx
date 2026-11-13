
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  Alert,
  Button,
  Input,
  PageHero,
  Textarea,
  UploadBox,
} from "@/components/elemen";

import { ApiError } from "@/lib/api";
import {
  FORMAT_BERKAS_HASIL,
  MAKS_MB_BERKAS_HASIL,
  kirimHasilPekerjaan,
} from "@/lib/client/deliverables";

type ErrorForm = {
  desk?: string;
  berkas?: string;
  url?: string;
  umum?: string;
};

export default function HalamanPengumpulan() {
  const { idPesanan } = useParams<{
    idPesanan: string;
  }>();

  const router = useRouter();

  const [deskripsi, setDeskripsi] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [url, setUrl] = useState("");
  const [error, setError] = useState<ErrorForm>({});
  const [sedangMengirim, setSedangMengirim] = useState(false);

  async function kirim(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errorBaru: ErrorForm = {};

    if (!deskripsi.trim()) {
      errorBaru.desk = "Deskripsi hasil wajib diisi.";
    }

    if (!files.length && !url.trim()) {
      errorBaru.berkas =
        "Unggah berkas atau lampirkan tautan hasil pekerjaan.";
      errorBaru.url = " ";
    }

    if (url.trim() && !/^https:\/\//i.test(url.trim())) {
      errorBaru.url = "Tautan harus diawali https://";
    }

    setError(errorBaru);

    if (Object.keys(errorBaru).length > 0) {
      return;
    }

    setSedangMengirim(true);

    try {
      await kirimHasilPekerjaan(idPesanan, {
        deskripsi,
        tautan: url,
        berkas: files,
      });

      router.push(`/penyedia/pengumpulan/${idPesanan}/hasil`);
    } catch (err) {
      setError({
        umum:
          err instanceof Error
            ? err.message
            : "Gagal mengirim hasil. Periksa koneksi internet Anda dan coba lagi.",
      });

      setSedangMengirim(false);
    }
  }

  return (
      <div className="mx-auto flex w-full max-w-[880px] flex-col gap-6 px-6 py-8 md:px-20">
        <PageHero
          judul="Pengumpulan Jasa"
          subjudul="Unggah berkas atau lampirkan tautan hasil pekerjaan Anda untuk ditinjau oleh Pembeli."
        />

        <section className="rounded-lg border border-line bg-surface p-4">
        <p className="text-caption text-ink-muted">ID Pesanan</p>
        <p className="text-h4 font-semibold text-ink">
            #{idPesanan}
        </p>
        </section>

        <section className="rounded-xl border border-line bg-surface p-6">
          <form
            noValidate
            onSubmit={kirim}
            className="flex flex-col gap-5"
          >
            {error.umum && (
              <Alert>{error.umum}</Alert>
            )}

            <Textarea
              label="Deskripsi Hasil"
              placeholder="Jelaskan hasil pekerjaan yang telah Anda buat"
              value={deskripsi}
              onChange={(event) => setDeskripsi(event.target.value)}
              error={error.desk}
            />

            <UploadBox
              label="Unggah Berkas Hasil"
              format={FORMAT_BERKAS_HASIL}
              maksMB={MAKS_MB_BERKAS_HASIL}
              maksBerkas={5}
              berkas={files}
              onUbah={setFiles}
              error={error.berkas}
            />

            <Input
              label="Atau Lampirkan Tautan"
              placeholder="https://"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              error={error.url}
            />

            <Button
              type="submit"
              loading={sedangMengirim}
              className="self-end"
            >
              Kirim Hasil Pekerjaan
            </Button>
          </form>
        </section>
      </div>
  );
}
