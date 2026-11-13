"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Alert, Button, PageHero, StatusPill, type NadaStatus } from "@/components/elemen";
import { ApiError } from "@/lib/api";
import { bukaRoomDenganPemesan } from "@/lib/client/chat";
import { ambilHasilPekerjaan, type HasilPekerjaan } from "@/lib/client/deliverables";
import { normalisasiStatusPesanan, responPesanan } from "@/lib/client/pesanan";
import { cn } from "@/lib/cn";
import { formatRupiah } from "@/lib/format";

/**
 * C35 HalamanKonfirmasi: pesanan baru → diterima (DIPROSES) | ditolak (DITOLAK)
 * Data: GET /api/pesanan/[id]/deliverables · Aksi: PATCH /api/pesanan/[id] { action }
 */

type Status = "menunggu" | "diproses" | "ditolak";
type AksiPesanan = "terima" | "tolak";

const PILL: Record<Status, [NadaStatus, string]> = {
  menunggu: ["accent", "Menunggu konfirmasi"],
  diproses: ["brand", "Diproses"],
  ditolak: ["danger", "Ditolak"],
};

function statusDari(st: string): Status {
  const s = normalisasiStatusPesanan(st);
  if (s === "MENUNGGU_KONFIRMASI" || s === "MENUNGGU_PEMBAYARAN") return "menunggu";
  if (s === "DITOLAK" || s === "DIKEMBALIKAN" || s === "DIBATALKAN") return "ditolak";
  return "diproses";
}

const tanggal = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "—";

export default function HalamanKonfirmasi() {
  const { idPesanan } = useParams<{ idPesanan: string }>();
  const router = useRouter();

  const [hasil, setHasil] = useState<HasilPekerjaan | null>(null);
  const [status, setStatus] = useState<Status>("menunggu");
  const [baru_diubah, setBaruDiubah] = useState(false);
  const [aksiSedangDiproses, setAksiSedangDiproses] = useState<AksiPesanan | null>(null);
  const [error, setError] = useState("");
  const [gagal_muat, setGagalMuat] = useState(false);

  useEffect(() => {
    ambilHasilPekerjaan(idPesanan)
      .then((data) => {
        setHasil(data);
        setStatus(statusDari(data.pesanan.status_pesanan));
      })
      .catch((err) => {
        setGagalMuat(true);
        setError(
          err instanceof ApiError && (err.status === 403 || err.status === 404 || err.status === 400)
            ? "Pesanan tidak ditemukan atau bukan milikmu."
            : "Gagal memuat pesanan. Coba lagi.",
        );
      });
  }, [idPesanan]);

  async function prosesPesanan(aksi: AksiPesanan) {
    setAksiSedangDiproses(aksi);
    setError("");

    try {
      await responPesanan(idPesanan, aksi);
      setStatus(aksi === "terima" ? "diproses" : "ditolak");
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
    if (!hasil) return;
    try {
      const room = await bukaRoomDenganPemesan(hasil.pesanan.id_pengguna_jasa, hasil.pesanan.id_penyedia_jasa);
      router.push(`/chat?room=${room.id_chatroom}`);
    } catch {
      setError("Chat gagal dibuka. Coba lagi.");
    }
  }

  if (!hasil) {
    return (
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 px-6 py-8 md:px-20">
        {gagal_muat ? (
          <div className="flex max-w-[480px] flex-col items-start gap-3">
            <Alert>{error}</Alert>
            <Button variant="secondary" href="/penyedia/pesanan">
              Kembali ke Pesanan Masuk
            </Button>
          </div>
        ) : (
          <p className="text-body text-ink-muted">Memuat pesanan…</p>
        )}
      </div>
    );
  }

  const { pesanan, kuota_revisi } = hasil;
  const [varianStatus, labelStatus] = PILL[status];

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-6 py-8 md:px-20">
      <PageHero
        judul={status === "menunggu" ? "Pesanan baru masuk" : "Detail pesanan"}
        status={<StatusPill nada={varianStatus}>{labelStatus}</StatusPill>}
      />

      {error && <Alert>{error}</Alert>}

      {baru_diubah && status === "diproses" && (
        <Alert tipe="success">
          Pesanan diterima dan sedang diproses. Pengguna jasa akan mendapatkan notifikasi.
        </Alert>
      )}

      {baru_diubah && status === "ditolak" && (
        <Alert>Pesanan ditolak. Dana pengguna jasa dikembalikan dan tercatat di riwayat transaksi.</Alert>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6">
          {/* Informasi jasa dan pemesan */}
          <section className={cn("rounded-xl border border-line bg-surface p-6", "flex flex-col gap-3")}>
            <h2 className="text-h4 text-ink">{pesanan.nama_jasa}</h2>

            {pesanan.kategori_jasa && <p className="text-caption text-ink-muted">{pesanan.kategori_jasa}</p>}

            <div className="flex items-center justify-between border-t border-line pt-3">
              <span className="text-label text-ink">{pesanan.nama_pemesan ?? "Pengguna Jasa"} · Pemesan</span>

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
            ["Tanggal pesan", tanggal(pesanan.created_at)],
            ["Kuota revisi", `${kuota_revisi.total} kali`],
          ].map(([judul, nilai]) => (
            <div key={judul} className="flex justify-between text-body-sm">
              <span className="text-ink-muted">{judul}</span>
              <span className="text-ink">{nilai}</span>
            </div>
          ))}

          <div className="flex items-center justify-between border-t border-line pt-4">
            <span className="text-label text-ink">Total biaya</span>

            <span className="text-h3 text-ink">{formatRupiah(pesanan.total_biaya)}</span>
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
                loading={aksiSedangDiproses === "tolak"}
                onClick={() => prosesPesanan("tolak")}
              >
                Tolak
              </Button>

              <Button
                className="flex-1"
                disabled={!!aksiSedangDiproses}
                loading={aksiSedangDiproses === "terima"}
                onClick={() => prosesPesanan("terima")}
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

          {status === "ditolak" && (
            <Button fullWidth variant="secondary" href="/penyedia/pesanan">
              Kembali ke Pesanan Masuk
            </Button>
          )}
        </section>
      </div>
    </div>
  );
}