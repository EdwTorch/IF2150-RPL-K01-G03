
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

import {
  FORMAT_BERKAS,
  MAX_MB,
  ajukanRevisi,
  getHasil,
} from "@/services/layanan";

const KUOTA_AWAL = 3;

export default function HalamanRequestRevisi() {
  const { idPesanan } = useParams<{ idPesanan: string }>();
  const router = useRouter();

  // State data form
  const [detail, setDetail] = useState("");
  const [pesan, setPesan] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  // State kuota revisi
  const [kuota, setKuota] = useState<number | null>(null);
  const [sedangMemuat, setSedangMemuat] = useState(true);

  // State validasi dan proses
  const [errorDetail, setErrorDetail] = useState("");
  const [errorUmum, setErrorUmum] = useState("");
  const [sedangMengirim, setSedangMengirim] = useState(false);

  // Mengambil sisa kuota revisi
  useEffect(() => {
    let aktif = true;

    async function muatKuota() {
      setSedangMemuat(true);
      setErrorUmum("");

      try {
        const hasil = await getHasil(idPesanan);

        if (aktif) {
          setKuota(hasil.kuota);
        }
      } catch {
        if (aktif) {
          setErrorUmum("Gagal memuat kuota revisi. Silakan coba lagi.");
        }
      } finally {
        if (aktif) {
          setSedangMemuat(false);
        }
      }
    }

    muatKuota();

    return () => {
      aktif = false;
    };
  }, [idPesanan]);

  // Mengirim pengajuan revisi
  async function kirimRevisi(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorUmum("");
    setErrorDetail("");

    if (!detail.trim()) {
      setErrorDetail("Detail revisi wajib diisi.");
      return;
    }

    if (kuota === null || kuota <= 0) {
      setErrorUmum(
        "Kuota revisi tidak tersedia. Silakan periksa kembali pesanan Anda."
      );
      return;
    }

    setSedangMengirim(true);

    try {
      await ajukanRevisi(idPesanan, {
        detail,
        pesan,
        files,
      });

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

  return (
    <div className="mx-auto flex w-full max-w-[880px] flex-col gap-6 px-6 py-8 md:px-20">
      <PageHero
        judul="Ajukan Revisi"
        subjudul="Ajukan revisi untuk mendapatkan hasil pekerjaan terbaik sesuai keinginan Anda."
      />

      {/* Informasi kuota revisi */}
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
                index < (kuota ?? 0) ? "bg-brand" : "bg-toggle-off"
              )}
            />
          ))}
        </div>
      </section>

      {/* Peringatan kuota habis */}
      {kuotaHabis && (
        <Alert>
          Kuota revisi habis. Kamu tidak dapat mengajukan revisi lagi. Hubungi
          admin bila ada masalah.
        </Alert>
      )}

      {/* Form pengajuan revisi */}
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
            maksBerkas={5}
            berkas={files}
            onUbah={setFiles}
          />

          {/* Tombol aksi */}
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
              disabled={
                sedangMemuat ||
                kuota === null ||
                kuotaHabis ||
                sedangMengirim
              }
            >
              Kirim revisi
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
