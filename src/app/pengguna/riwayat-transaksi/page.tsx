"use client";

import { useEffect, useState } from "react";

import {
  Alert,
  Button,
  PageHero,
  RatingInput,
  TabFilter,
} from "@/components/elemen";
import { cn } from "@/lib/cn";
import { formatRupiah } from "@/lib/format";
import { Transaksi, getTransaksi } from "@/lib/layanan";

const TAB = ["Semua", "Berjalan", "Selesai", "Dikembalikan"] as const;

type Tab = (typeof TAB)[number];

const STATUS = {
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
  selesai: [
    "Pesanan selesai",
    "text-success",
    "Pesan lagi",
    "primary",
  ],
  dikembalikan: [
    "Ditolak penyedia · dana dikembalikan",
    "text-danger",
    "Lihat pesanan",
    "secondary",
  ],
} as const;

export default function HalamanRiwayatTransaksi() {
  const [transaksi, setTransaksi] = useState<Transaksi[] | null>(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("Semua");
  const [pembayaranBerhasil, setPembayaranBerhasil] = useState(false);

  useEffect(() => {
    setPembayaranBerhasil(location.search.includes("bayar=sukses"));

    getTransaksi()
      .then(setTransaksi)
      .catch(() => {
        setError("Gagal memuat riwayat transaksi.");
      });
  }, []);

  const semuaTransaksi = transaksi ?? [];

  const isBerjalan = (item: Transaksi) =>
    item.status === "berjalan" || item.status === "cek";

  const transaksiDitampilkan = semuaTransaksi.filter((item) => {
    if (tab === "Semua") return true;
    if (tab === "Berjalan") return isBerjalan(item);
    if (tab === "Selesai") return item.status === "selesai";

    return item.status === "dikembalikan";
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
          .filter((item) => item.status !== "dikembalikan")
          .reduce((total, item) => total + item.harga, 0),
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

      <PageHero judul="Riwayat Transaksi" />

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
            "py-12 text-center text-body text-ink-muted",
          )}
        >
          Belum ada transaksi
          {tab !== "Semua" && " pada kategori ini"}.
        </section>
      )}

      {/* Daftar transaksi */}
      {transaksiDitampilkan.map((item) => {
        const [labelStatus, warnaStatus, labelTombol, varianTombol] =
          STATUS[item.status];

        return (
          <div
            key={item.id}
            className="overflow-hidden rounded-xl border border-line bg-surface"
          >
            <div
              className={cn(
                "flex items-center justify-between gap-4 p-6",
                item.status === "berjalan" && "bg-accent-subtle",
              )}
            >
              <div className="flex flex-col gap-1">
                <span className="text-caption text-ink-muted">
                  [TANGGAL], [JAM]
                </span>

                <h3 className="text-h4 text-ink">{item.judul}</h3>

                <span className={cn("text-label", warnaStatus)}>
                  {labelStatus}
                </span>

                <span className="text-caption text-ink-muted">
                  #TRX-{item.id} · {item.penyedia}
                </span>
              </div>

              <div className="flex flex-col items-end gap-3">
                <span className="text-label text-ink">
                  {formatRupiah(item.harga)}
                </span>

                <Button
                  variant={varianTombol}
                  href={
                    item.status === "selesai"
                      ? "/jasa"
                      : `/hasil/${item.id}`
                  }
                >
                  {labelTombol}
                </Button>
              </div>
            </div>

            {/* Rating transaksi selesai */}
            {item.status === "selesai" && (
              <div className="flex items-center gap-3 bg-brand-subtle px-6 py-3">
                <span className="text-label text-ink">
                  {item.rating ? "Rating kamu" : "Ditunggu ratingnya!"}
                </span>

                {item.rating ? (
                  <RatingInput
                    nilai={item.rating}
                    onUbah={() => {}}
                    disabled
                    ukuran={20}
                  />
                ) : (
                  <Button
                    variant="accent"
                    href={`/pengguna/ulasan/${item.id}`}
                    className="h-9 px-4"
                  >
                    Beri ulasan
                  </Button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}