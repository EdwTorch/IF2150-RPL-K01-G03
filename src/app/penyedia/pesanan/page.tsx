"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Alert, Button, PageHero, StatusPill, TabFilter, type NadaStatus } from "@/components/elemen";
import { ApiError } from "@/lib/api";
import {
  ambilPesananMasuk,
  normalisasiStatusPesanan,
  pesananBerjalan,
  type Pesanan,
} from "@/lib/client/pesanan";
import { formatRupiah } from "@/lib/format";

/**
 * Pesanan Masuk penyedia — Figma "C30 - HalamanRiwayatTransaksi - tampilan penyedia jasa" (130:4501)
 * Sumber data: GET /api/pesanan?peran=penyedia_jasa
 * "Lihat pesanan" → C35 Konfirmasi (pesanan baru) atau C38 Hasil Pekerjaan versi penyedia
 */

const TAB = ["Semua", "Berjalan", "Selesai", "Dikembalikan"] as const;
type Tab = (typeof TAB)[number];

/** Label & warna pill status (Figma: "Diproses" lavender, "Selesai" hijau) */
const LABEL_STATUS: Record<string, [string, NadaStatus]> = {
  MENUNGGU_KONFIRMASI: ["Pesanan baru", "accent"],
  DIPROSES: ["Diproses", "neutral"],
  MENUNGGU_KONFIRMASI_SELESAI: ["Menunggu pemeriksaan", "neutral"],
  KOMPLAIN: ["Komplain", "warning"],
  SELESAI: ["Selesai", "success"],
  DITOLAK: ["Ditolak", "danger"],
  DIKEMBALIKAN: ["Dana dikembalikan", "danger"],
  DIBATALKAN: ["Dibatalkan", "danger"],
};

function tujuanLihat(p: Pesanan) {
  return normalisasiStatusPesanan(p.status_pesanan) === "MENUNGGU_KONFIRMASI"
    ? `/penyedia/konfirmasi/${p.id_pesanan}`
    : `/penyedia/pesanan/${p.id_pesanan}`;
}

function cocokTab(p: Pesanan, tab: Tab) {
  const st = normalisasiStatusPesanan(p.status_pesanan);
  if (tab === "Berjalan") return pesananBerjalan(st);
  if (tab === "Selesai") return st === "SELESAI";
  if (tab === "Dikembalikan") return st === "DITOLAK" || st === "DIKEMBALIKAN" || st === "DIBATALKAN";
  return true;
}

const idTransaksi = (id: string) => `#TRX-${id.slice(0, 8).toUpperCase()}`;
const tanggal = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—";

export default function HalamanPesananMasuk() {
  const [daftar, setDaftar] = useState<Pesanan[]>([]);
  const [sedang_memuat, setSedangMemuat] = useState(true);
  const [pesan_error, setPesanError] = useState("");
  const [tab, setTab] = useState<Tab>("Semua");

  function tampilkanError(err: unknown) {
    if (err instanceof ApiError && err.status === 401) setPesanError("Masuk dulu sebagai penyedia jasa.");
    else setPesanError(err instanceof Error ? err.message : "Pesanan gagal dimuat.");
  }

  function muat() {
    setSedangMemuat(true);
    setPesanError("");
    return ambilPesananMasuk()
      .then(setDaftar)
      .catch(tampilkanError)
      .finally(() => setSedangMemuat(false));
  }

  useEffect(() => {
    ambilPesananMasuk()
      .then(setDaftar)
      .catch(tampilkanError)
      .finally(() => setSedangMemuat(false));
  }, []);

  const ringkasan = useMemo(
    () => ({
      total: daftar.length,
      diproses: daftar.filter((p) => pesananBerjalan(p.status_pesanan)).length,
      pendapatan: daftar
        .filter((p) => normalisasiStatusPesanan(p.status_pesanan) === "SELESAI")
        .reduce((jumlah, p) => jumlah + p.total_biaya, 0),
    }),
    [daftar],
  );

  const daftar_tampil = daftar.filter((p) => cocokTab(p, tab));

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-6 px-20 pt-12 pb-20">
      <PageHero judul="Riwayat Transaksi" penuh />

      {/* Kartu ringkasan */}
      <div className="grid grid-cols-3 gap-6">
        {[
          ["Total transaksi", String(ringkasan.total)],
          ["Sedang diproses", String(ringkasan.diproses)],
          ["Total pendapatan", formatRupiah(ringkasan.pendapatan)],
        ].map(([label, nilai]) => (
          <div key={label} className="flex flex-col gap-1 rounded-xl border border-line bg-surface px-6 py-5">
            <span className="text-body-sm text-ink-muted">{label}</span>
            <span className="text-h3 text-ink">{sedang_memuat ? "—" : nilai}</span>
          </div>
        ))}
      </div>

      <TabFilter opsi={TAB} nilai={tab} onUbah={setTab} />

      {sedang_memuat ? (
        <p className="text-body text-ink-muted">Memuat pesanan…</p>
      ) : pesan_error ? (
        <div className="flex max-w-[480px] flex-col items-start gap-3">
          <Alert tipe="error">{pesan_error}</Alert>
          <Button variant="secondary" onClick={muat}>
            Coba lagi
          </Button>
        </div>
      ) : daftar_tampil.length === 0 ? (
        <section className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-line-strong px-6 py-14 text-center">
          <p className="text-h4 text-ink">
            {daftar.length === 0 ? "Belum ada pesanan masuk" : "Tidak ada pesanan di tab ini"}
          </p>
          <p className="text-body-sm text-ink-muted">
            {daftar.length === 0
              ? "Pesanan dari pengguna jasa akan muncul di sini setelah dibayar."
              : "Coba pilih tab lain."}
          </p>
        </section>
      ) : (
        <div className="overflow-hidden rounded-xl border border-line bg-surface">
          <table className="w-full text-left">
            <thead className="bg-canvas text-caption text-ink-muted">
              <tr>
                <th className="px-6 py-4 font-normal">ID transaksi</th>
                <th className="px-6 py-4 font-normal">Jasa &amp; pemesan</th>
                <th className="px-6 py-4 font-normal">Tanggal</th>
                <th className="px-6 py-4 font-normal">Total</th>
                <th className="px-6 py-4 font-normal">Status</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {daftar_tampil.map((p) => {
                const [label, nada] = LABEL_STATUS[normalisasiStatusPesanan(p.status_pesanan)] ?? [
                  p.status_pesanan,
                  "neutral",
                ];
                return (
                  <tr key={p.id_pesanan} className="border-t border-line">
                    <td className="px-6 py-4 text-body-sm text-ink-muted">{idTransaksi(p.id_pesanan)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-subtle">
                          <Image src="/icons/tas.svg" alt="" width={18} height={18} />
                        </span>
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate text-label text-ink">{p.jasa?.nama_jasa ?? "Jasa"}</span>
                          <span className="truncate text-caption text-ink-muted">
                            {p.nama_pemesan ?? "Pengguna Jasa"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-body-sm text-ink">{tanggal(p.created_at)}</td>
                    <td className="px-6 py-4 text-label text-ink">{formatRupiah(p.total_biaya)}</td>
                    <td className="px-6 py-4">
                      <StatusPill nada={nada}>{label}</StatusPill>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={tujuanLihat(p)}
                        className="text-label whitespace-nowrap text-brand-text hover:underline"
                      >
                        Lihat pesanan ›
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
