
"use client";

import { useEffect, useState } from "react";

import {
  Alert,
  Button,
  PageHero,
  TabFilter,
} from "@/components/elemen";
import { cn } from "@/lib/cn";
import { formatRupiah } from "@/lib/format";
import {
  ambilDaftarPesanan,
  type Pesanan,
} from "@/lib/client/pesanan";

const TAB = ["Semua", "Berjalan", "Selesai", "Dikembalikan"] as const;

type Tab = (typeof TAB)[number];

type StatusTampilan =
   | "menunggu_konfirmasi" | "berjalan" | "cek" | "komplain" | "selesai" | "ditolak" | "dikembalikan" | "dibatalkan";

const STATUS: Record<
  StatusTampilan,
  [string, string, string, "secondary" | "accent" | "primary"]
> = {
  menunggu_konfirmasi: [
    "Menunggu konfirmasi penyedia",
    "text-ink",
    "Lihat pesanan",
    "secondary",
  ],
  berjalan: [
    "Sedang dikerjakan penyedia",
    "text-brand-text",
    "Lihat pesanan",
    "secondary",
  ],
  cek: [
    "Hasil sudah dikirim, cek & konfirmasi",
    "text-ink",
    "Cek hasil",
    "accent",
  ],
  komplain: [
    "Sedang dalam penanganan komplain",
    "text-danger",
    "Lihat pesanan",
    "secondary",
  ],
  selesai: [
    "Pesanan selesai",
    "text-success",
    "Pesan lagi",
    "primary",
  ],
  ditolak: [
    "Pesanan ditolak penyedia",
    "text-danger",
    "Lihat pesanan",
    "secondary",
  ],
  dikembalikan: [
    "Dana dikembalikan",
    "text-danger",
    "Lihat pesanan",
    "secondary",
  ],
  dibatalkan: [
    "Pesanan dibatalkan",
    "text-ink-muted",
    "Lihat pesanan",
    "secondary",
  ],
};

function normalisasiStatus(status: string): string {
  return status.trim().toUpperCase().replace(/[\s-]+/g, "_");
}

function tentukanStatus(statusPesanan: string): StatusTampilan {
  const status = normalisasiStatus(statusPesanan);

  switch (status) {

    case "MENUNGGU_KONFIRMASI":
      return "menunggu_konfirmasi";

    case "DIPROSES":
      return "berjalan";

    case "MENUNGGU_KONFIRMASI_SELESAI":
      return "cek";

    case "KOMPLAIN":
      return "komplain";

    case "SELESAI":
      return "selesai";

    case "DITOLAK":
      return "ditolak";

    case "DIKEMBALIKAN":
      return "dikembalikan";

    case "DIBATALKAN":
      return "dibatalkan";

    default:
      return "berjalan";
  }
}

function formatTanggal(tanggal?: string) {
  if (!tanggal) return "Tanggal tidak tersedia";

  const date = new Date(tanggal);

  if (Number.isNaN(date.getTime())) {
    return "Tanggal tidak tersedia";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

export default function HalamanRiwayatTransaksi() {
  const [transaksi, setTransaksi] = useState<Pesanan[] | null>(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("Semua");
  const [pembayaranBerhasil, setPembayaranBerhasil] = useState(false);

  useEffect(() => {
    setPembayaranBerhasil(
      new URLSearchParams(window.location.search).get("bayar") === "sukses"
    );

    let aktif = true;

    ambilDaftarPesanan()
      .then((data) => {
        // Pesanan yang belum dibayar tidak ditampilkan di riwayat transaksi
        if (aktif) setTransaksi(data.filter((p) => normalisasiStatus(p.status_pesanan) !== "MENUNGGU_PEMBAYARAN"));
      })
      .catch((err: unknown) => {
        if (!aktif) return;

        setError(
          err instanceof Error
            ? err.message
            : "Gagal memuat riwayat transaksi."
        );
      });

    return () => {
      aktif = false;
    };
  }, []);

  const semuaTransaksi = transaksi ?? [];

  const isBerjalan = (item: Pesanan) => {
    const status = tentukanStatus(item.status_pesanan);

    return (
      status === "menunggu_konfirmasi" ||
      status === "berjalan" ||
      status === "cek" ||
      status === "komplain"
    );
  };

  const transaksiDitampilkan = semuaTransaksi.filter((item) => {
    const status = tentukanStatus(item.status_pesanan);

    if (tab === "Semua") return true;
    if (tab === "Berjalan") return isBerjalan(item);
    if (tab === "Selesai") return status === "selesai";

    return (
      status === "ditolak" ||
      status === "dikembalikan" ||
      status === "dibatalkan"
    );
  });

  const statistik = [
    ["Total transaksi", String(semuaTransaksi.length)],
    [
      "Sedang berjalan",
      String(semuaTransaksi.filter(isBerjalan).length),
    ],
    [
      "Total pengeluaran",
      formatRupiah(
        semuaTransaksi
          .filter(
            (item) =>
              normalisasiStatus(item.status_pembayaran ?? "") === "LUNAS"
          )
          .reduce(
            (total, item) => total + Number(item.total_biaya),
            0
          )
      ),
    ],
  ];

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-6 py-8 md:px-20">
      {pembayaranBerhasil && (
        <Alert tipe="success">
          Pembayaran berhasil! Pesananmu sudah diteruskan ke penyedia jasa.
        </Alert>
      )}

      {error && <Alert>{error}</Alert>}

      <PageHero judul="Riwayat Transaksi" penuh />

      {/* Statistik transaksi */}
      <div className="grid gap-4 md:grid-cols-3">
        {statistik.map(([judul, nilai]) => (
          <section
            key={judul}
            className="flex flex-col gap-1 rounded-xl border border-line bg-surface px-6 py-5"
          >
            <span className="text-body-sm text-ink-muted">{judul}</span>
            <span className="text-h3 text-ink">{nilai}</span>
          </section>
        ))}
      </div>

      {/* Filter transaksi */}
      <TabFilter opsi={TAB} nilai={tab} onUbah={setTab} />

      {/* Loading */}
      {!transaksi && !error && (
        <p className="text-body text-ink-muted">Memuat…</p>
      )}

      {/* Empty state */}
      {transaksi && transaksiDitampilkan.length === 0 && (
        <section
          className={cn(
            "rounded-xl border border-line bg-surface p-6",
            "py-12 text-center text-body text-ink-muted"
          )}
        >
          Belum ada transaksi
          {tab !== "Semua" && " pada kategori ini"}.
        </section>
      )}

      {/* Daftar transaksi */}
      {transaksiDitampilkan.map((item) => {
        const idPesanan = item.id_pesanan;
        const status = tentukanStatus(item.status_pesanan);

        const [labelStatus, warnaStatus, labelTombol, varianTombol] =
          STATUS[status];

        const rating = Math.min(
          5,
          Math.max(0, Math.round(Number(item.rating_ulasan ?? 0)))
        );

        return (
          <div
            key={idPesanan}
            className="overflow-hidden rounded-xl border border-line bg-surface"
          >
            <div
              className={cn(
                "flex items-center justify-between gap-4 p-6",
                isBerjalan(item) && "bg-accent-subtle"
              )}
            >
              <div className="flex flex-col gap-1">
                <span className="text-caption text-ink-muted">
                  {formatTanggal(item.created_at)}
                </span>

                <h3 className="text-h4 text-ink">
                  {item.jasa?.nama_jasa ?? "Nama jasa belum tersedia"}
                </h3>

                <span className={cn("text-label", warnaStatus)}>
                  {normalisasiStatus(item.status_pesanan) === "DIBATALKAN"
                    ? "Pesanan dibatalkan"
                    : labelStatus}
                </span>

                <span className="text-caption text-ink-muted">
                  #{idPesanan.slice(0, 8).toUpperCase()} ·{" "}
                  {item.penyedia_jasa?.pengguna?.nama ??
                    "Nama penyedia belum tersedia"}
                </span>
              </div>

              <div className="flex flex-col items-end gap-3">
                <span className="text-label text-ink">
                  {formatRupiah(Number(item.total_biaya))}
                </span>

                <Button
                  variant={varianTombol}
                  href={
                    status === "selesai"
                      ? `/jasa/${item.id_jasa}`
                      : `/pengguna/hasil/${idPesanan}`
                  }
                >
                  {labelTombol}
                </Button>
              </div>
            </div>

            {/* Rating transaksi selesai */}
            {status === "selesai" && (
              <div className="flex items-center gap-6 border-l-2 border-dotted border-brand px-6 py-4 bg-brand-subtle">
                {item.sudah_diulas ? (
                  <>
                    <span className="text-label text-ink">
                      Rating kamu
                    </span>

                    <div
                      className="flex items-center gap-2"
                      aria-label={`Rating kamu ${rating} dari 5 bintang`}
                    >
                      {[1, 2, 3, 4, 5].map((bintang) => (
                        <span
                          key={bintang}
                          className={cn(
                            "text-2xl leading-none",
                            bintang <= rating
                              ? "text-[#F5A623]"
                              : "text-ink-muted/30"
                          )}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-label text-ink">
                      Ditunggu ratingnya!
                    </span>

                    <Button
                      variant="accent"
                      href={`/pengguna/ulasan/${idPesanan}`}
                      className="h-9 px-4"
                    >
                      Beri ulasan
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
