"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Alert, Button, PageHero, StatusPill, type NadaStatus } from "@/components/elemen";
import { ApiError } from "@/lib/api";
import { bukaRoomDenganPemesan } from "@/lib/client/chat";
import {
  ambilDetailPesanan,
  terimaPesanan,
  tolakPesanan,
  KUOTA_REVISI_DEFAULT,
  type PesananDetail,
} from "@/lib/client/pesanan";
import { cn } from "@/lib/cn";
import { formatRupiah } from "@/lib/format";

/**
 * C35 HalamanKonfirmasi: pesanan baru → diterima (DIPROSES) | ditolak (DITOLAK)
 * Data: GET /api/pesanan/[id] · Aksi: PATCH /api/pesanan/[id] { action }
 */

type StatusTampilan = "menunggu" | "diproses" | "ditolak" | "selesai";
type AksiPesanan = "diproses" | "ditolak";

const PILL: Record<StatusTampilan, [NadaStatus, string]> = {
  menunggu: ["accent", "Menunggu konfirmasi"],
  diproses: ["brand", "Diproses"],
  ditolak: ["danger", "Ditolak"],
  selesai: ["success", "Selesai"],
};

function statusDari(status: string): StatusTampilan {
  const s = status.trim().toUpperCase().replace(/[\s-]+/g, "_");
  if (s === "DITOLAK" || s === "DIKEMBALIKAN" || s === "DIBATALKAN") return "ditolak";
  if (s === "SELESAI") return "selesai";
  if (s === "MENUNGGU_KONFIRMASI" || s === "MENUNGGU_PEMBAYARAN") return "menunggu";
  return "diproses";
}

function formatTanggal(tanggal?: string) {
  if (!tanggal) return "—";
  const date = new Date(tanggal);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

export default function HalamanKonfirmasi() {
  const { idPesanan } = useParams<{ idPesanan: string }>();
  const router = useRouter();

  const [pesanan, setPesanan] = useState<PesananDetail | null>(null);
  const [status, setStatus] = useState<StatusTampilan>("menunggu");
  const [baruDiubah, setBaruDiubah] = useState(false);
  const [sedangMemuat, setSedangMemuat] = useState(true);
  const [aksiSedangDiproses, setAksiSedangDiproses] = useState<AksiPesanan | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let aktif = true;

    ambilDetailPesanan(idPesanan)
      .then((data) => {
        if (!aktif) return;
        setPesanan(data);
        setStatus(statusDari(data.status_pesanan));
      })
      .catch((err) => {
        if (!aktif) return;
        setError(
          err instanceof ApiError && (err.status === 404 || err.status === 400)
            ? "Pesanan tidak ditemukan."
            : "Gagal mengambil detail pesanan. Coba lagi.",
        );
      })
      .finally(() => {
        if (aktif) setSedangMemuat(false);
      });

    return () => {
      aktif = false;
    };
  }, [idPesanan]);

  async function prosesPesanan(aksi: AksiPesanan) {
    setAksiSedangDiproses(aksi);
    setError("");

    try {
      if (aksi === "diproses") await terimaPesanan(idPesanan);
      else await tolakPesanan(idPesanan);

      setStatus(aksi);
      setBaruDiubah(true);
    } catch (err) {
      setError(
        err instanceof ApiError && err.status !== 500 && err.status !== 0
          ? err.message
          : "Gagal memproses pesanan. Coba lagi.",
      );
    } finally {
      setAksiSedangDiproses(null);
    }
  }

  async function klikChatPemesan() {
    if (!pesanan) return;
    try {
      const room = await bukaRoomDenganPemesan(pesanan.id_pengguna_jasa, pesanan.id_penyedia_jasa);
      router.push(`/chat?room=${room.id_chatroom}`);
    } catch {
      setError("Chat gagal dibuka. Coba lagi.");
    }
  }

  if (sedangMemuat) {
    return (
      <div className="mx-auto w-full max-w-[1280px] px-6 py-8 md:px-20">
        <p className="text-body text-ink-muted">Memuat pesanan…</p>
      </div>
    );
  }

  if (!pesanan) {
    return (
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start gap-3 px-6 py-8 md:px-20">
        <Alert>{error || "Pesanan tidak ditemukan."}</Alert>
        <Button variant="secondary" href="/penyedia/pesanan">
          Kembali ke Pesanan Masuk
        </Button>
      </div>
    );
  }

  const [varianStatus, labelStatus] = PILL[status];
  const namaPemesan = pesanan.pengguna_jasa?.pengguna?.nama ?? "Pengguna Jasa";

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-6 py-8 md:px-20">
      <PageHero
        judul={status === "menunggu" ? "Pesanan baru masuk" : "Detail pesanan"}
        status={<StatusPill nada={varianStatus}>{labelStatus}</StatusPill>}
      />

      {error && <Alert>{error}</Alert>}

      {baruDiubah && status === "diproses" && (
        <Alert tipe="success">Pesanan diterima dan sedang diproses. Pengguna jasa akan mendapatkan notifikasi.</Alert>
      )}

      {baruDiubah && status === "ditolak" && (
        <Alert>Pesanan ditolak. Dana pengguna jasa dikembalikan dan tercatat di riwayat transaksi.</Alert>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6">
          {/* Informasi jasa dan pemesan */}
          <section className={cn("rounded-xl border border-line bg-surface p-6", "flex flex-col gap-3")}>
            <h2 className="text-h4 text-ink">{pesanan.jasa?.nama_jasa ?? "Jasa"}</h2>

            {pesanan.jasa?.kategori && <p className="text-caption text-ink-muted">{pesanan.jasa.kategori}</p>}

            <div className="flex items-center justify-between border-t border-line pt-3">
              <span className="text-label text-ink">{namaPemesan} · Pemesan</span>

              <button type="button" onClick={klikChatPemesan} className="text-label text-brand-text hover:underline">
                Chat pemesan
              </button>
            </div>
          </section>

          {/* Brief pemesanan */}
          <section className={cn("rounded-xl border border-line bg-surface p-6", "flex flex-col gap-2")}>
            <h2 className="text-h4 text-ink">Brief dari pemesan</h2>
            <p className="text-body whitespace-pre-line text-ink-muted">{pesanan.brief || "-"}</p>
          </section>
        </div>

        {/* Ringkasan pesanan */}
        <section className={cn("rounded-xl border border-line bg-surface p-6", "flex flex-col gap-4")}>
          <h2 className="text-h4 text-ink">Ringkasan pesanan</h2>

          {[
            ["ID pesanan", `#${pesanan.id_pesanan.slice(0, 8).toUpperCase()}`],
            ["Tanggal pesan", formatTanggal(pesanan.created_at)],
            ["Kuota revisi", `${KUOTA_REVISI_DEFAULT} kali`],
          ].map(([judul, nilai]) => (
            <div key={judul} className="flex justify-between text-body-sm">
              <span className="text-ink-muted">{judul}</span>
              <span className="text-ink">{nilai}</span>
            </div>
          ))}

          <div className="flex items-center justify-between border-t border-line pt-4">
            <span className="text-label text-ink">Total biaya</span>
            <span className="text-h3 text-ink">{formatRupiah(Number(pesanan.total_biaya))}</span>
          </div>

          <p className="text-caption text-ink-muted">
            Dana sudah dibayar pemesan dan ditahan sampai pekerjaan dikonfirmasi selesai.
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
            <Button fullWidth href={`/penyedia/pesanan/${pesanan.id_pesanan}`}>
              Lihat & kirim hasil pekerjaan
            </Button>
          )}

          {(status === "ditolak" || status === "selesai") && (
            <Button fullWidth variant="secondary" href="/penyedia/pesanan">
              Kembali ke Pesanan Masuk
            </Button>
          )}
        </section>
      </div>
    </div>
  );
}