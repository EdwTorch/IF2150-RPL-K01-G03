
"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
  Alert,
  Button,
  PageHero,
  StatusPill,
} from "@/components/elemen";
import { cn } from "@/lib/cn";
import { formatRupiah } from "@/lib/format";
import {
  terimaPesanan,
  tolakPesanan,
} from "@/services/layanan";

// C35: menunggu -> diproses | ditolak
type Status = "menunggu" | "diproses" | "ditolak";
type AksiPesanan = "diproses" | "ditolak";

const PILL = {
  menunggu: ["accent", "Menunggu konfirmasi"],
  diproses: ["brand", "Diproses"],
  ditolak: ["danger", "Ditolak"],
} as const;

export default function HalamanKonfirmasi() {
  const { idPesanan } = useParams<{ idPesanan: string }>();

  const [status, setStatus] = useState<Status>("menunggu");
  const [aksiSedangDiproses, setAksiSedangDiproses] =
    useState<AksiPesanan | null>(null);
  const [error, setError] = useState("");

  async function prosesPesanan(aksi: AksiPesanan) {
    setAksiSedangDiproses(aksi);
    setError("");

    try {
      await (
        aksi === "diproses" ? terimaPesanan : tolakPesanan
      )(idPesanan);

      setStatus(aksi);
    } catch {
      setError("Gagal memproses pesanan. Coba lagi.");
    } finally {
      setAksiSedangDiproses(null);
    }
  }

  const [varianStatus, labelStatus] = PILL[status];

  return (
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-6 py-8 md:px-20">
        <PageHero
          judul={
            status === "menunggu"
              ? "Pesanan baru masuk"
              : "Detail pesanan"
          }
          status={
            <StatusPill nada={varianStatus}>
              {labelStatus}
            </StatusPill>
          }
        />

        {error && <Alert>{error}</Alert>}

        {status === "diproses" && (
          <Alert tipe="success">
            Pesanan diterima dan sedang diproses. Pengguna jasa akan mendapatkan
            notifikasi.
          </Alert>
        )}

        {status === "ditolak" && (
          <Alert>
            Pesanan ditolak. Dana pengguna jasa dikembalikan dan tercatat di
            riwayat transaksi.
          </Alert>
        )}

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-6">
            {/* Informasi jasa dan pemesan */}
            <section
              className={cn(
                "rounded-xl border border-line bg-surface p-6",
                "flex flex-col gap-3",
              )}
            >
              <h2 className="text-h4 text-ink">
                Desain logo & identitas brand
              </h2>

              <p className="text-caption text-ink-muted">
                Desain Grafis
              </p>

              <div className="flex items-center justify-between border-t border-line pt-3">
                <span className="text-label text-ink">
                  [Nama Pengguna Jasa] · Pemesan
                </span>

                <Link
                  href={`/chat/${idPesanan}`}
                  className="text-label text-brand-text"
                >
                  Chat pemesan
                </Link>
              </div>
            </section>

            {/* Brief pemesanan */}
            <section
              className={cn(
                "rounded-xl border border-line bg-surface p-6",
                "flex flex-col gap-2",
              )}
            >
              <h2 className="text-h4 text-ink">
                Brief dari pemesan
              </h2>

              <p className="text-body text-ink-muted">
                [Isi brief pemesanan]
              </p>
            </section>
          </div>

          {/* Ringkasan pesanan */}
          <section
            className={cn(
              "rounded-xl border border-line bg-surface p-6",
              "flex flex-col gap-4",
            )}
          >
            <h2 className="text-h4 text-ink">
              Ringkasan pesanan
            </h2>

            {[
              ["ID pesanan", `#${idPesanan}`],
              ["Tanggal pesan", "[TANGGAL]"],
              ["Tenggat", "[TANGGAL]"],
              ["Kuota revisi", "3 kali"],
            ].map(([judul, nilai]) => (
              <div
                key={judul}
                className="flex justify-between text-body-sm"
              >
                <span className="text-ink-muted">{judul}</span>
                <span className="text-ink">{nilai}</span>
              </div>
            ))}

            <div className="flex items-center justify-between border-t border-line pt-4">
              <span className="text-label text-ink">
                Total biaya
              </span>

              <span className="text-h3 text-ink">
                {formatRupiah(500000)}
              </span>
            </div>

            <p className="text-caption text-ink-muted">
              Dana sudah dibayar pemesan dan ditahan sampai pekerjaan
              dikonfirmasi selesai.
            </p>

            {status === "menunggu" && (
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  disabled={!!aksiSedangDiproses}
                  loading={aksiSedangDiproses === "ditolak"}
                  onClick={() => prosesPesanan("ditolak")}
                >
                  Tolak
                </Button>

                <Button
                  className="flex-1"
                  disabled={!!aksiSedangDiproses}
                  loading={aksiSedangDiproses === "diproses"}
                  onClick={() => prosesPesanan("diproses")}
                >
                  Terima Pesanan
                </Button>
              </div>
            )}

            {status === "diproses" && (
              <Button fullWidth href={`/penyedia/pengumpulan/${idPesanan}`}>
                Kirim hasil pekerjaan
              </Button>
            )}

            {status === "ditolak" && (
              <Button
                fullWidth
                variant="secondary"
                href="/konfirmasi/1"
              >
                Kembali ke Pesanan Masuk
              </Button>
            )}
          </section>
        </div>
      </div>
  );
}
