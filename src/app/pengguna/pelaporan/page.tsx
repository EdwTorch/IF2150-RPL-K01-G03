
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
import { ambilDetailPesanan } from "@/lib/client/pesanan";

import type { TiketLaporan } from "@/models/types";

const FORMAT_BERKAS = ["jpg", "jpeg", "png", "pdf"];
const MAX_MB = 10;
const MAKS_BERKAS = 3;

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

type TanggapanRingkas = {
  id_tanggapan: string;
  jenis_tindakan: string;
  catatan_tanggapan: string | null;
  created_at?: string;
};

type TiketLaporanDetail = TiketLaporan & {
  tanggapan_laporan?: TanggapanRingkas[];
};

type ResponsLaporan = {
  success: boolean;
  message: string;
  data: TiketLaporanDetail | null;
};

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
  const [tiket, setT] = useState<TiketLaporanDetail | null>(null);

  // Memuat detail pesanan dan mengecek tiket laporan yang sudah ada.
  useEffect(() => {
    let aktif = true;

    async function muatData() {
      if (!idPesanan) {
        setE({
          umum:
            "ID pesanan tidak ditemukan. Silakan buka halaman pelaporan dari halaman hasil pekerjaan.",
        });
        setMemuatPenyedia(false);
        return;
      }

      setMemuatPenyedia(true);
      setT(null);

      // Memuat nama penyedia jasa.
      try {
        const pesanan = await ambilDetailPesanan(idPesanan);

        const namaPenyedia =
          pesanan.penyedia_jasa?.pengguna?.nama;

        if (!namaPenyedia) {
          throw new Error("Nama penyedia jasa tidak ditemukan.");
        }

        if (aktif) {
          setN(namaPenyedia);
        }
      } catch (error) {
        if (aktif) {
          setE((prev) => ({
            ...prev,
            umum:
              error instanceof Error
                ? error.message
                : "Gagal memuat nama penyedia jasa.",
          }));
        }
      }

      // Mengecek apakah pesanan sudah memiliki tiket laporan.
      try {
        const response = await fetch(
          `/api/pesanan/${encodeURIComponent(idPesanan)}/laporan`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const hasil: ResponsLaporan = await response.json();

        if (!response.ok || !hasil.success) {
          throw new Error(
            hasil.message || "Gagal memuat tiket laporan."
          );
        }

        if (aktif && hasil.data) {
          const dataTiket = hasil.data;

          setT(dataTiket);
          setD(dataTiket.deskripsi_laporan);

          // Mengisi kategori yang tersimpan.
          const kategoriPertama = dataTiket.kategori?.[0] ?? "";

          if (KAT.some((item) => item.value === kategoriPertama)) {
            setK(kategoriPertama);
          } else if (kategoriPertama) {
            setK("Lainnya");
            setKategoriLainnya(kategoriPertama);
          }
        }
      } catch (error) {
        if (aktif) {
          setE((prev) => ({
            ...prev,
            umum:
              error instanceof Error
                ? error.message
                : "Gagal memuat tiket laporan.",
          }));
        }
      } finally {
        if (aktif) {
          setMemuatPenyedia(false);
        }
      }
    }

    muatData();

    return () => {
      aktif = false;
    };
  }, [idPesanan]);

  const ro = !!tiket;

  async function kirim(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();

    const x: E = {};

    if (!idPesanan) {
      x.umum = "ID pesanan tidak ditemukan.";
    }

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

    if (files.length === 0) {
      x.umum = "Minimal sertakan 1 bukti laporan.";
    } else if (files.length > MAKS_BERKAS) {
      x.umum = "Maksimal 3 bukti yang dapat dilampirkan.";
    }

    if (x.umum || x.kat || x.desk) {
      setE(x);
      return;
    }

    setE({});
    setB(true);

    try {
      const formData = new FormData();

      const kategoriFinal =
        kat === "Lainnya"
          ? kategoriLainnya.trim()
          : kat;

      formData.append(
        "kategori",
        JSON.stringify([kategoriFinal])
      );

      formData.append("deskripsi_laporan", desk.trim());

      files.forEach((file) => {
        formData.append("berkas", file);
      });

      const response = await fetch(
        `/api/pesanan/${encodeURIComponent(idPesanan!)}/laporan`,
        {
          method: "POST",
          body: formData,
        }
      );

      const hasil: ResponsLaporan = await response.json();

      if (!response.ok || !hasil.success || !hasil.data) {
        throw new Error(
          hasil.message || "Gagal mengirim laporan."
        );
      }

      setT(hasil.data);
    } catch (error) {
      setE({
        umum:
          error instanceof Error
            ? error.message
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

      {memuatPenyedia ? (
        <section className="rounded-xl border border-line bg-surface p-6">
          <p className="text-body text-ink-muted">
            Memuat informasi pesanan dan laporan...
          </p>
        </section>
      ) : (
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
                placeholder="Nama Penyedia Jasa"
                value={nama}
                disabled
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

              {!ro && (
                <UploadBox
                  label="Bukti"
                  format={FORMAT_BERKAS}
                  maksMB={MAX_MB}
                  maksBerkas={MAKS_BERKAS}
                  berkas={files}
                  onUbah={setF}
                />
              )}

              {ro && (
                <div className="flex flex-col gap-2">
                  <p className="text-body font-medium text-ink">
                    Bukti Laporan
                  </p>

                  {tiket.url_bukti?.length ? (
                    <div className="flex flex-col gap-2">
                      {tiket.url_bukti.map((url, index) => (
                        <a
                          key={`${url}-${index}`}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-caption text-brand-text hover:underline"
                        >
                          Lihat bukti {index + 1}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-caption text-ink-muted">
                      Tidak ada bukti yang dilampirkan.
                    </p>
                  )}
                </div>
              )}

              {!ro && (
                <Button
                  type="submit"
                  loading={busy}
                  disabled={busy || !nama}
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
                <h2 className="break-all text-h4 text-ink">
                  {tiket.id_tiket}
                </h2>
              </div>

              <div>
                <p className="text-caption text-ink-muted">
                  Tanggapan Admin
                </p>

                {tiket.tanggapan_laporan?.length ? (
                  <div className="mt-2 flex flex-col gap-3">
                    {tiket.tanggapan_laporan.map((tanggapan) => (
                      <div
                        key={tanggapan.id_tanggapan}
                        className="rounded-lg bg-surface-subtle p-3"
                      >
                        <p className="text-caption font-medium text-ink">
                          {tanggapan.jenis_tindakan.replaceAll(
                            "_",
                            " "
                          )}
                        </p>
                        <p className="mt-1 text-body text-ink">
                          {tanggapan.catatan_tanggapan ||
                            "Tidak ada catatan tambahan."}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-body text-ink">
                    Belum ada tanggapan.
                  </p>
                )}
              </div>

              <div className="flex flex-col items-start gap-1">
                <p className="text-caption text-ink-muted">
                  Status Laporan
                </p>
                <StatusPill
                  nada={
                    tiket.status_tiket === "Diproses"
                      ? "danger"
                      : "success"
                  }
                >
                  {tiket.status_tiket}
                </StatusPill>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
