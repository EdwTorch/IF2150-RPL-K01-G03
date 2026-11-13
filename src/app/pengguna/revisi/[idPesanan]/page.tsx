
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  Alert,
  Button,
  PageHero,
  Textarea,
  UploadBox,
} from "@/components/elemen";

import { cn } from "@/lib/cn";
import { FORMAT_BERKAS, MAX_MB } from "@/lib/layanan";

const KUOTA_AWAL = 3;

const URL_REVISI = (idPesanan: string) =>
  `/api/pesanan/${encodeURIComponent(idPesanan)}/deliverables/revisi`;

type StatusRevisi =
  | "Sedang Direvisi"
  | "Revisi Dikumpulkan"
  | string;

type ResponsRiwayatRevisi = {
  success: boolean;
  message?: string;
  data?: {
    revisi?: {
      jml_revisi_tersedia: number;
      status_pengerjaan?: StatusRevisi;
      created_at?: string;
    }[];
    boleh_ajukan_revisi?: boolean;
    sisa_kuota?: number;
    status_revisi_terakhir?: string | null;
  };
};

type ResponsPengajuanRevisi = {
  success: boolean;
  message?: string;
};

async function bacaRespons<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    const teks = await response.text();

    throw new Error(
      `Server tidak mengembalikan JSON (HTTP ${response.status}). ` +
        `Periksa URL API dan server backend. ` +
        (teks.includes("<!DOCTYPE")
          ? "Respons yang diterima adalah halaman HTML."
          : "")
    );
  }

  return response.json() as Promise<T>;
}

export default function HalamanRequestRevisi() {
  const { idPesanan } = useParams<{ idPesanan: string }>();
  const router = useRouter();

  const [detail, setDetail] = useState("");
  const [pesan, setPesan] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const [kuota, setKuota] = useState<number | null>(null);
  const [statusRevisi, setStatusRevisi] = useState<string | null>(null);
  const [bolehAjukanRevisi, setBolehAjukanRevisi] = useState(false);

  const [sedangMemuat, setSedangMemuat] = useState(true);
  const [sedangMengirim, setSedangMengirim] = useState(false);

  const [errorDetail, setErrorDetail] = useState("");
  const [errorUmum, setErrorUmum] = useState("");

  useEffect(() => {
    let aktif = true;

    async function muatInformasiRevisi() {
      setSedangMemuat(true);
      setErrorUmum("");

      try {
        const response = await fetch(URL_REVISI(idPesanan), {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
        });

        const hasil =
          await bacaRespons<ResponsRiwayatRevisi>(response);

        if (!response.ok || !hasil.success || !hasil.data) {
          throw new Error(
            hasil.message || "Gagal mengambil informasi revisi."
          );
        }

        const data = hasil.data;
        const daftarRevisi = data.revisi ?? [];

        const kuotaTerbaru =
          data.sisa_kuota ??
          (daftarRevisi.length > 0
            ? daftarRevisi[0].jml_revisi_tersedia
            : KUOTA_AWAL);

        const statusTerbaru =
          data.status_revisi_terakhir ??
          daftarRevisi[0]?.status_pengerjaan ??
          null;

        if (aktif) {
          setKuota(kuotaTerbaru);
          setStatusRevisi(statusTerbaru);
          setBolehAjukanRevisi(
            data.boleh_ajukan_revisi === true &&
              kuotaTerbaru > 0
          );
        }
      } catch (error) {
        if (aktif) {
          setKuota(null);
          setBolehAjukanRevisi(false);

          setErrorUmum(
            error instanceof Error
              ? error.message
              : "Gagal memuat informasi revisi. Silakan coba lagi."
          );
        }
      } finally {
        if (aktif) {
          setSedangMemuat(false);
        }
      }
    }

    muatInformasiRevisi();

    return () => {
      aktif = false;
    };
  }, [idPesanan]);

  async function kirimRevisi(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorUmum("");
    setErrorDetail("");

    if (!bolehAjukanRevisi) {
      setErrorUmum(
        "Kamu belum dapat mengajukan revisi. Periksa status revisi dan kuota pesanan."
      );
      return;
    }

    if (!detail.trim()) {
      setErrorDetail("Detail revisi wajib diisi.");
      return;
    }

    if (kuota === null || kuota <= 0) {
      setErrorUmum("Kuota revisi sudah habis.");
      return;
    }

    if (files.length > 3) {
      setErrorUmum("Maksimal 3 lampiran yang dapat diunggah.");
      return;
    }

    setSedangMengirim(true);

    try {
      const formData = new FormData();

      formData.append("detail", detail.trim());
      formData.append("pesan", pesan.trim());

      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch(URL_REVISI(idPesanan), {
        method: "POST",
        credentials: "same-origin",
        body: formData,
      });

      const hasil =
        await bacaRespons<ResponsPengajuanRevisi>(response);

      if (!response.ok || !hasil.success) {
        throw new Error(
          hasil.message ||
            "Gagal mengajukan revisi. Silakan coba lagi."
        );
      }

      router.push(`/pengguna/hasil/${idPesanan}`);
    } catch (error) {
      setErrorUmum(
        error instanceof Error
          ? error.message
          : "Gagal mengajukan revisi. Silakan coba lagi."
      );
    } finally {
      setSedangMengirim(false);
    }
  }

  const kuotaHabis = kuota === 0;

  const menungguPenyedia =
    statusRevisi === "Sedang Direvisi";

  const revisiSudahDikumpulkan =
    statusRevisi === "Revisi Dikumpulkan";

  return (
    <div className="mx-auto flex w-full max-w-[880px] flex-col gap-6 px-6 py-8 md:px-20">
      <PageHero
        judul="Ajukan Revisi"
        subjudul="Ajukan revisi untuk mendapatkan hasil pekerjaan terbaik sesuai keinginan Anda."
      />

      <section
        className={cn(
          "flex items-center justify-between gap-4",
          "rounded-xl border border-line bg-surface p-6 py-4"
        )}
      >
        <div>
          <p className="text-label text-ink">
            Sisa kuota revisi:{" "}
            {sedangMemuat ? "…" : kuota ?? "–"} dari {KUOTA_AWAL}
          </p>

          <p className="text-caption text-ink-muted">
            Setiap pengajuan revisi mengurangi 1 kuota.
          </p>
        </div>

        <div className="flex gap-1.5">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className={cn(
                "h-1.5 w-7 rounded-full",
                index < (kuota ?? 0)
                  ? "bg-brand"
                  : "bg-toggle-off"
              )}
            />
          ))}
        </div>
      </section>

      {!sedangMemuat && !errorUmum && (
        <>
          {menungguPenyedia && (
            <Alert tipe="success">
              Pengajuan revisimu sedang dikerjakan oleh penyedia.
              Kamu belum dapat mengajukan revisi berikutnya sampai
              penyedia mengumpulkan hasil revisi.
            </Alert>
          )}

          {revisiSudahDikumpulkan && kuotaHabis && (
            <Alert>
              Penyedia sudah mengumpulkan hasil revisi, tetapi
              kuota revisimu telah habis. Kamu tidak dapat
              mengajukan revisi lagi.
            </Alert>
          )}

          {revisiSudahDikumpulkan && kuota !== null && kuota > 0 && (
            <Alert tipe="success">
              Hasil revisi sudah dikumpulkan oleh penyedia.
              Silakan periksa hasilnya terlebih dahulu. Jika
              masih ada bagian yang perlu diperbaiki, kamu dapat
              mengajukan revisi kembali.
            </Alert>
          )}

          {!statusRevisi && (
            <Alert tipe="success">
              Kamu dapat mengajukan revisi untuk pesanan ini.
            </Alert>
          )}
        </>
      )}

      {kuotaHabis && !menungguPenyedia && !revisiSudahDikumpulkan && (
        <Alert>
          Kuota revisi habis. Kamu tidak dapat mengajukan revisi lagi.
          Hubungi admin bila ada masalah.
        </Alert>
      )}

      {sedangMemuat ? (
        <section className="rounded-xl border border-line bg-surface p-6">
          <p className="text-body text-ink-muted">
            Memuat informasi revisi...
          </p>
        </section>
      ) : bolehAjukanRevisi ? (
        <section className="rounded-xl border border-line bg-surface p-6">
          <form
            noValidate
            onSubmit={kirimRevisi}
            className="flex flex-col gap-5"
          >
            {errorUmum && <Alert>{errorUmum}</Alert>}

            <Textarea
              label="Detail revisi"
              placeholder="Jelaskan bagian yang perlu diperbaiki secara spesifik"
              value={detail}
              onChange={(event) => {
                setDetail(event.target.value);

                if (event.target.value.trim()) {
                  setErrorDetail("");
                }
              }}
              error={errorDetail}
            />

            <Textarea
              label="Pesan untuk penyedia (opsional)"
              placeholder="Tambahkan pesan singkat"
              value={pesan}
              onChange={(event) => setPesan(event.target.value)}
            />

            <UploadBox
              label="Lampiran (opsional)"
              judul="Tambahkan referensi atau tangkapan layar"
              format={FORMAT_BERKAS}
              maksMB={MAX_MB}
              maksBerkas={3}
              berkas={files}
              onUbah={setFiles}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
                disabled={sedangMengirim}
              >
                Batal
              </Button>

              <Button
                type="submit"
                loading={sedangMengirim}
                disabled={sedangMengirim}
              >
                Kirim revisi
              </Button>
            </div>
          </form>
        </section>
      ) : (
        <section className="rounded-xl border border-line bg-surface p-6">
          <div className="flex flex-col gap-4">
            {!errorUmum && !kuotaHabis && !menungguPenyedia && (
              <Alert>
                Kamu belum dapat mengajukan revisi saat ini.
                Silakan periksa kembali status pesanan.
              </Alert>
            )}

            <div className="flex justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
              >
                Kembali
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
