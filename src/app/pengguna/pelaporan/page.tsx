"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  Alert,
  Button,
  Input,
  PageHero,
  Select,
  StatusPill,
  Textarea,
  UploadBox,
} from "@/components/elemen";

import { cn } from "@/lib/cn";

import {
  FORMAT_BERKAS,
  MAX_MB,
  type Tiket,
  getTransaksi,
  kirimLaporan,
} from "@/services/layanan";

const KAT = [
  "Penipuan",
  "Pekerjaan tidak sesuai kesepakatan",
  "Pekerjaan tidak sesuai ekspektasi",
  "Komunikasi buruk",
  "Lainnya",
].map((k) => ({ value: k, label: k }));

type E = {
  kat?: string;
  desk?: string;
  umum?: string;
};

// C44: form kosong | form error | tiket terkirim (read-only)
export default function HalamanPelaporan() {
  const searchParams = useSearchParams();
  const idPesanan = searchParams.get("idPesanan");

  const [nama, setN] = useState("");
  const [kat, setK] = useState("");
  const [kategoriLainnya, setKategoriLainnya] = useState("");
  const [desk, setD] = useState("");
  const [files, setF] = useState<File[]>([]);
  const [e, setE] = useState<E>({});
  const [busy, setB] = useState(false);
  const [memuatPenyedia, setMemuatPenyedia] = useState(true);
  const [tiket, setT] = useState<Tiket | null>(null);

  // Mengambil nama penyedia berdasarkan ID pesanan dari C38.
  useEffect(() => {
    let aktif = true;

    async function muatPenyedia() {
      if (!idPesanan) {
        setE({
          umum: "ID pesanan tidak ditemukan. Silakan buka halaman pelaporan dari halaman hasil pekerjaan.",
        });
        setMemuatPenyedia(false);
        return;
      }

      setMemuatPenyedia(true);

      try {
        const transaksi = await getTransaksi();

        const dataPesanan = transaksi.find(
          (item) => item.id === idPesanan
        );

        if (!dataPesanan) {
          throw new Error("Data pesanan tidak ditemukan.");
        }

        if (aktif) {
          setN(dataPesanan.penyedia);
          setE({});
        }
      } catch {
        if (aktif) {
          setE({
            umum: "Gagal memuat nama penyedia jasa. Silakan coba lagi.",
          });
        }
      } finally {
        if (aktif) {
          setMemuatPenyedia(false);
        }
      }
    }

    muatPenyedia();

    return () => {
      aktif = false;
    };
  }, [idPesanan]);

  const ro = !!tiket;

  async function kirim(ev: React.FormEvent) {
    ev.preventDefault();

    const x: E = {};

    if (!nama.trim()) {
      x.umum = "Nama penyedia jasa tidak berhasil dimuat.";
    }

    if (!kat) {
      x.kat = "Pilih kategori pelanggaran.";
    } else if (
      kat === "Lainnya" &&
      !kategoriLainnya.trim()
    ) {
      x.kat = "Tuliskan kategori pelanggaran lainnya.";
    }

    if (!desk.trim()) {
      x.desk = "Deskripsi masalah wajib diisi.";
    }

    if (x.umum || x.kat || x.desk) {
      x.umum =
        x.umum ||
        "Data belum lengkap atau format berkas tidak didukung. Periksa kembali isian yang ditandai.";

      setE(x);
      return;
    }

    setE({});
    setB(true);

    try {
      setT(
        await kirimLaporan({
          penyedia: nama,
          kategori:
            kat === "Lainnya"
              ? kategoriLainnya.trim()
              : kat,
          deskripsi: desk,
          files,
        })
      );
    } catch (z) {
      setE({
        umum:
          z instanceof Error
            ? z.message
            : "Gagal mengirim laporan.",
      });
    } finally {
      setB(false);
    }
  }

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-6 py-8 md:px-20",
        !ro && "max-w-[880px]"
      )}
    >
      <PageHero
        judul={ro ? "Tiket Laporan" : "Laporkan Penyedia Jasa"}
        subjudul={
          ro
            ? undefined
            : "Sampaikan kendala yang Anda alami agar Admin dapat menindaklanjuti."
        }
      />

      <div
        className={
          ro
            ? "grid items-start gap-6 lg:grid-cols-[1fr_320px]"
            : ""
        }
      >
        <section className="rounded-xl border border-line bg-surface p-6">
          <form
            noValidate
            onSubmit={kirim}
            className="flex flex-col gap-5"
          >
            {e.umum && <Alert>{e.umum}</Alert>}

            <Input
              label="Penyedia Jasa"
              placeholder={
                memuatPenyedia
                  ? "Memuat nama penyedia..."
                  : "Nama Penyedia Jasa"
              }
              value={nama}
              disabled={memuatPenyedia || ro || !nama}
            />

            {kat === "Lainnya" ? (
              <Input
                label="Kategori Pelanggaran"
                placeholder="Tuliskan kategori pelanggaran"
                value={kategoriLainnya}
                onChange={(ev) =>
                  setKategoriLainnya(ev.target.value)
                }
                error={e.kat}
                disabled={ro}
              />
            ) : (
              <Select
                label="Kategori Pelanggaran"
                placeholder="Pilih Kategori Pelanggaran"
                opsi={KAT}
                value={kat}
                onChange={(ev) => {
                  setK(ev.target.value);
                  setKategoriLainnya("");
                  setE((prev) => ({
                    ...prev,
                    kat: undefined,
                  }));
                }}
                error={e.kat}
                disabled={ro}
              />
            )}

            {kat === "Lainnya" && !ro && (
              <button
                type="button"
                onClick={() => {
                  setK("");
                  setKategoriLainnya("");
                  setE((prev) => ({
                    ...prev,
                    kat: undefined,
                  }));
                }}
                className="self-start text-caption text-brand-text hover:underline"
              >
                Pilih dari kategori yang tersedia
              </button>
            )}

            <Textarea
              label="Deskripsi Masalah"
              placeholder="Jelaskan kendala atau masalah yang Anda alami"
              value={desk}
              onChange={(ev) => setD(ev.target.value)}
              error={e.desk}
              disabled={ro}
            />

            <UploadBox
              label="Bukti"
              format={FORMAT_BERKAS}
              maksMB={MAX_MB}
              maksBerkas={5}
              berkas={files}
              onUbah={setF}
              disabled={ro}
            />

            {!ro && (
              <Button
                type="submit"
                loading={busy}
                disabled={busy || memuatPenyedia || !nama}
                className="self-end"
              >
                Kirim Laporan
              </Button>
            )}
          </form>
        </section>

        {tiket && (
          <section
            className={cn(
              "rounded-xl border border-line bg-surface p-6",
              "flex flex-col gap-4"
            )}
          >
            <div>
              <p className="text-caption text-ink-muted">
                Nomor Tiket
              </p>
              <h2 className="text-h4 text-ink">{tiket.id}</h2>
            </div>

            <div>
              <p className="text-caption text-ink-muted">
                Tanggapan Admin
              </p>
              <p className="text-body text-ink">
                Belum ada tanggapan
              </p>
            </div>

            <div className="flex flex-col items-start gap-1">
              <p className="text-caption text-ink-muted">
                Status Laporan
              </p>
              <StatusPill nada="danger">
                {tiket.status}
              </StatusPill>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}