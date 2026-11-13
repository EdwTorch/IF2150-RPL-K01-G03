
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

import {
  FORMAT_BERKAS,
  MAX_MB,
  kirimHasil,
} from "@/lib/client/produk-akhir";

import { api } from "@/lib/api";

type ErrorForm = {
  desk?: string;
  berkas?: string;
  url?: string;
  umum?: string;
};

type ResponsDeliverables = {
  success: boolean;
  message?: string;
  data?: {
    revisi_aktif?: {
      id_revisi: string;
      status_pengerjaan: string;
    } | null;
    revisi_terbaru?: {
      id_revisi: string;
      status_pengerjaan: string;
    } | null;
  };
};

type ResponsPengirimanRevisi = {
  success: boolean;
  message?: string;
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

    if (url.trim()) {
      try {
        const tautanInput = url.trim();
        const tautan = new URL(
          /^[a-z][a-z\d+.-]*:\/\//i.test(tautanInput)
            ? tautanInput
            : `https://${tautanInput}`
        );

        if (
          !["http:", "https:"].includes(tautan.protocol) ||
          !tautan.hostname.includes(".")
        ) {
          errorBaru.url = "Format tautan tidak valid.";
        }
      } catch {
        errorBaru.url = "Format tautan tidak valid.";
      }
    }

    setError(errorBaru);

    if (Object.keys(errorBaru).length > 0) {
      return;
    }

    setSedangMengirim(true);

    try {
      // Periksa apakah pesanan memiliki pengajuan revisi aktif.
      const respons = await api<ResponsDeliverables>(
        `/api/pesanan/${idPesanan}/deliverables`,
        {
          method: "GET",
        }
      );

      if (!respons.success || !respons.data) {
        throw new Error(
          respons.message || "Gagal memeriksa status pesanan."
        );
      }

      const revisiAktif = respons.data.revisi_aktif;
      const revisiTerbaru = respons.data.revisi_terbaru;

      if (revisiAktif?.status_pengerjaan === "Sedang Direvisi") {
        // Kirim hasil melalui endpoint khusus revisi.
        const formData = new FormData();

        formData.append("action", "submit_revision");
        formData.append("deskripsi_produk", deskripsi.trim());

        if (url.trim()) {
          formData.append("tautan", url.trim());
        }

        files.forEach((file) => {
          formData.append("berkas", file);
        });

        const hasilRevisi = await api<ResponsPengirimanRevisi>(
          `/api/pesanan/${idPesanan}/deliverables/revisi`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!hasilRevisi.success) {
          throw new Error(
            hasilRevisi.message || "Gagal mengirim hasil revisi."
          );
        }
      } else if (revisiTerbaru) {
        // Jangan sampai hasil revisi masuk sebagai hasil pekerjaan biasa.
        throw new Error(
          revisiTerbaru.status_pengerjaan === "Revisi Dikumpulkan"
            ? "Hasil revisi sudah dikumpulkan. Silakan tunggu konfirmasi dari pengguna jasa."
            : "Pengajuan revisi tidak sedang dalam status yang memungkinkan pengiriman hasil."
        );
      } else {
        // Belum ada pengajuan revisi: kirim hasil pekerjaan pertama.
        await kirimHasil(idPesanan, {
          deskripsi,
          tautan: url,
          files,
        });
      }

      router.push(`/penyedia/pengumpulan/${idPesanan}/hasil`);
    } catch (err) {
      setError({
        umum:
          err instanceof Error
            ? err.message
            : "Gagal mengirim hasil.",
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
          {error.umum && <Alert>{error.umum}</Alert>}

          <Textarea
            label="Deskripsi Hasil"
            placeholder="Jelaskan hasil pekerjaan yang telah Anda buat"
            value={deskripsi}
            onChange={(event) => setDeskripsi(event.target.value)}
            error={error.desk}
          />

          <UploadBox
            label="Unggah Berkas Hasil"
            format={FORMAT_BERKAS}
            maksMB={MAX_MB}
            maksBerkas={3}
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
