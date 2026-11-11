"use client";

import { useEffect, useState } from "react";
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
  ambilDetailPesanan,
  terimaPesanan,
  tolakPesanan,
  KUOTA_REVISI_DEFAULT,
  type PesananDetail,
} from "@/lib/client/pesanan";

type StatusTampilan = "menunggu" | "diproses" | "ditolak" | "selesai";

type AksiPesanan = "diproses" | "ditolak";

const PILL = {
  menunggu: ["accent", "Menunggu konfirmasi"],
  diproses: ["brand", "Diproses"],
  ditolak: ["danger", "Ditolak"],
  selesai: ["brand", "Selesai"],
} as const;

function normalisasiStatus(status: string): StatusTampilan {
  const s = status.toUpperCase();

  if (s === "DITOLAK" || s === "DIKEMBALIKAN") return "ditolak";
  if (s === "SELESAI") return "selesai";

  if (
    s === "DIPROSES" ||
    s === "BERJALAN" ||
    s === "DALAM_PENGERJAAN"
  ) {
    return "diproses";
  }

  return "menunggu";
}

function formatTanggal(tanggal?: string) {
  if (!tanggal) return "Belum tersedia";

  const date = new Date(tanggal);

  if (Number.isNaN(date.getTime())) return "Belum tersedia";

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function HalamanKonfirmasi() {
  const { idPesanan } = useParams<{ idPesanan: string }>();

  const [pesanan, setPesanan] = useState<PesananDetail | null>(null);
  const [status, setStatus] = useState<StatusTampilan>("menunggu");
  const [sedangMemuat, setSedangMemuat] = useState(true);
  const [aksiSedangDiproses, setAksiSedangDiproses] =
    useState<AksiPesanan | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function muatDetail() {
      try {
        setSedangMemuat(true);
        setError("");

        const data = await ambilDetailPesanan(idPesanan);

        setPesanan(data);
        setStatus(normalisasiStatus(data.status_pesanan));
      } catch {
        setError("Gagal mengambil detail pesanan. Coba lagi.");
      } finally {
        setSedangMemuat(false);
      }
    }

    if (idPesanan) muatDetail();
  }, [idPesanan]);

  async function prosesPesanan(aksi: AksiPesanan) {
    if (!pesanan) return;

    setAksiSedangDiproses(aksi);
    setError("");

    try {
      if (aksi === "diproses") {
        await terimaPesanan(idPesanan);
      } else {
        await tolakPesanan(idPesanan);
      }

      setStatus(aksi);

      setPesanan((prev) =>
        prev
          ? {
              ...prev,
              status_pesanan: aksi === "diproses" ? "DIPROSES" : "DITOLAK",
            }
          : prev
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memproses pesanan. Coba lagi."
      );
    } finally {
      setAksiSedangDiproses(null);
    }
  }

  if (sedangMemuat) {
    return (
      <div className="mx-auto w-full max-w-[1280px] px-6 py-8 md:px-20">
        <p className="text-body text-ink-muted">
          Memuat detail pesanan...
        </p>
      </div>
    );
  }

  if (!pesanan) {
    return (
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 px-6 py-8 md:px-20">
        <Alert>{error || "Pesanan tidak ditemukan."}</Alert>
        <Link href="/penyedia" className="text-label text-brand-text">
          Kembali
        </Link>
      </div>
    );
  }

  const [varianStatus, labelStatus] = PILL[status];

  const namaJasa = pesanan.jasa?.nama_jasa ?? "Nama jasa tidak tersedia";
  const kategori = pesanan.jasa?.kategori ?? "Kategori tidak tersedia";
  const namaPemesan =
    pesanan.pengguna_jasa?.pengguna?.nama ??
    "Nama pemesan tidak tersedia";

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-6 py-8 md:px-20">
      <PageHero
        judul={status === "menunggu" ? "Pesanan baru masuk" : "Detail pesanan"}
        status={
          <StatusPill nada={varianStatus}>
            {labelStatus}
          </StatusPill>
        }
      />

      {error && <Alert>{error}</Alert>}

      {status === "diproses" && (
        <Alert tipe="success">
          Pesanan diterima dan sedang diproses.
        </Alert>
      )}

      {status === "ditolak" && (
        <Alert>
          Pesanan telah ditolak.
        </Alert>
      )}

      {status === "selesai" && (
        <Alert tipe="success">
          Pesanan telah selesai.
        </Alert>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6">
          {/* Informasi jasa dan pemesan */}
          <section
            className={cn(
              "rounded-xl border border-line bg-surface p-6",
              "flex flex-col gap-3"
            )}
          >
            <h2 className="text-h4 text-ink">{namaJasa}</h2>

            <p className="text-caption text-ink-muted">{kategori}</p>

            <div className="flex items-center justify-between border-t border-line pt-3">
              <span className="text-label text-ink">
                {namaPemesan} · Pemesan
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
              "flex flex-col gap-2"
            )}
          >
            <h2 className="text-h4 text-ink">
              Brief dari pemesan
            </h2>

            <p className="text-body text-ink-muted whitespace-pre-wrap">
              {pesanan.brief || "Tidak ada brief."}
            </p>
          </section>
        </div>

        {/* Ringkasan pesanan */}
        <section
          className={cn(
            "rounded-xl border border-line bg-surface p-6",
            "flex flex-col gap-4"
          )}
        >
          <h2 className="text-h4 text-ink">
            Ringkasan pesanan
          </h2>

          {[
            ["ID pesanan", `#${pesanan.id_pesanan}`],
            ["Tanggal pesan", formatTanggal(pesanan.created_at)],
            ["Tenggat", "Belum ditentukan"],
            ["Kuota revisi", `${KUOTA_REVISI_DEFAULT} kali`],
          ].map(([judul, nilai]) => (
            <div
              key={judul}
              className="flex justify-between gap-4 text-body-sm"
            >
              <span className="text-ink-muted">{judul}</span>
              <span className="text-right text-ink">{nilai}</span>
            </div>
          ))}

          <div className="flex items-center justify-between border-t border-line pt-4">
            <span className="text-label text-ink">
              Total biaya
            </span>

            <span className="text-h3 text-ink">
              {formatRupiah(Number(pesanan.total_biaya))}
            </span>
          </div>

          <p className="text-caption text-ink-muted">
            Status pembayaran: {pesanan.status_pembayaran ?? "Belum tersedia"}
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
        </section>
      </div>
    </div>
  );
}
