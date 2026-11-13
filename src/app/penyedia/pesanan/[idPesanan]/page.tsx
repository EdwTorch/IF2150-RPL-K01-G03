"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Alert, Button, LampiranBukti, PageHero, StatusPill, type NadaStatus } from "@/components/elemen";
import { ApiError } from "@/lib/api";
import { bukaRoomDenganPemesan } from "@/lib/client/chat";
import {
  ambilHasilPekerjaan,
  lampiranDariUrl,
  lampiranKiriman,
  type HasilPekerjaan,
} from "@/lib/client/deliverables";
import { normalisasiStatusPesanan } from "@/lib/client/pesanan";
import { formatRupiah } from "@/lib/format";

/**
 * Hasil Pekerjaan versi penyedia — Figma "C38 HalamanDeliverables (Versi Penyedia Jasa)" (199:5077)
 *   - revisi diminta        (199:5078)
 *   - menunggu pemeriksaan  (199:5287)
 * Dibuka dari Pesanan Masuk. Sumber data: GET /api/pesanan/[id]/deliverables
 */

type Tahap = "belum_dikirim" | "revisi" | "menunggu" | "selesai" | "komplain" | "batal";

function tentukanTahap(h: HasilPekerjaan): Tahap {
  const st = normalisasiStatusPesanan(h.pesanan.status_pesanan);
  if (st === "SELESAI") return "selesai";
  if (st === "KOMPLAIN") return "komplain";
  if (st === "DITOLAK" || st === "DIKEMBALIKAN" || st === "DIBATALKAN") return "batal";
  if (st === "MENUNGGU_KONFIRMASI_SELESAI") return "menunggu";
  if (h.revisi_aktif) return "revisi";
  return "belum_dikirim";
}

const PILL: Record<Tahap, [string, NadaStatus]> = {
  belum_dikirim: ["Sedang dikerjakan", "neutral"],
  revisi: ["Revisi diminta", "warning"],
  menunggu: ["Menunggu pemeriksaan", "neutral"],
  selesai: ["Selesai", "success"],
  komplain: ["Komplain", "warning"],
  batal: ["Dibatalkan", "danger"],
};

const waktu = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

function Kartu({ judul, children, className = "" }: { judul: string; children: ReactNode; className?: string }) {
  return (
    <section className={`flex flex-col gap-3 rounded-xl border border-line bg-surface p-6 ${className}`}>
      <h2 className="text-h4 text-ink">{judul}</h2>
      {children}
    </section>
  );
}

function KotakKuota({ judul, keterangan }: { judul: string; keterangan: string }) {
  return (
    <div className="flex items-center gap-3 rounded-field bg-canvas px-4 py-3">
      <Image src="/icons/ulang.svg" alt="" width={16} height={16} />
      <div className="flex flex-col">
        <span className="text-label text-ink">{judul}</span>
        <span className="text-caption text-ink-muted">{keterangan}</span>
      </div>
    </div>
  );
}

export default function HalamanHasilPekerjaanPenyedia() {
  const { idPesanan } = useParams<{ idPesanan: string }>();
  const router = useRouter();

  const [hasil, setHasil] = useState<HasilPekerjaan | null>(null);
  const [pesan_error, setPesanError] = useState("");
  const [membuka_chat, setMembukaChat] = useState(false);

  async function muat() {
    try {
      const data = await ambilHasilPekerjaan(idPesanan);
      // Pesanan baru belum diterima → halaman konfirmasi (C35)
      if (normalisasiStatusPesanan(data.pesanan.status_pesanan) === "MENUNGGU_KONFIRMASI") {
        router.replace(`/penyedia/konfirmasi/${idPesanan}`);
        return;
      }
      setPesanError("");
      setHasil(data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) setPesanError("Sesi kamu sudah habis. Silakan login kembali.");
      else if (err instanceof ApiError && err.status === 403) setPesanError("Pesanan ini bukan milikmu.");
      else if (err instanceof ApiError && err.status === 404) setPesanError("Pesanan tidak ditemukan.");
      else setPesanError("Gagal memuat hasil pekerjaan. Periksa koneksi internet kamu dan coba lagi.");
    }
  }

  useEffect(() => {
    muat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idPesanan]);

  async function klikChatPemesan() {
    if (!hasil) return;
    setMembukaChat(true);
    try {
      const room = await bukaRoomDenganPemesan(hasil.pesanan.id_pengguna_jasa, hasil.pesanan.id_penyedia_jasa);
      router.push(`/chat?room=${room.id_chatroom}`);
    } catch {
      setPesanError("Chat gagal dibuka. Coba lagi.");
      setMembukaChat(false);
    }
  }

  if (!hasil) {
    return (
      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-4 px-20 pt-12 pb-20">
        {pesan_error ? (
          <div className="flex max-w-[480px] flex-col items-start gap-3">
            <Alert tipe="error">{pesan_error}</Alert>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={muat}>
                Coba lagi
              </Button>
              <Button variant="ghost" href="/penyedia/pesanan">
                Kembali ke Pesanan Masuk
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-body text-ink-muted">Memuat hasil pekerjaan…</p>
        )}
      </main>
    );
  }

  const { pesanan, deliverable, revisi_aktif, kuota_revisi } = hasil;
  const tahap = tentukanTahap(hasil);
  const [label_status, nada_status] = PILL[tahap];
  const nama_pemesan = pesanan.nama_pemesan ?? "Pengguna Jasa";
  const urutan_revisi = hasil.revisi.length; // revisi_aktif selalu revisi terbaru
  const link_lapor = `/pengguna/pelaporan?idPesanan=${encodeURIComponent(pesanan.id_pesanan)}`;

  const tombolChat = (
    <Button fullWidth variant="secondary" loading={membuka_chat} onClick={klikChatPemesan}>
      Chat pemesan
    </Button>
  );

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-6 px-20 pt-12 pb-20">
      {pesan_error && <Alert tipe="error">{pesan_error}</Alert>}

      <PageHero
        judul="Hasil Pekerjaan"
        subjudul={`#${pesanan.id_pesanan.slice(0, 8).toUpperCase()} - ${pesanan.nama_jasa} · untuk ${nama_pemesan}`}
        status={<StatusPill nada={nada_status}>{label_status}</StatusPill>}
      />

      <div className="grid items-start gap-6 lg:grid-cols-[872px_1fr]">
        {/* ---------- kolom kiri ---------- */}
        <div className="flex flex-col gap-6">
          {tahap === "revisi" && revisi_aktif && (
            <Kartu judul={`Permintaan revisi dari ${nama_pemesan}`} className="border-warning-subtle">
              <p className="-mt-2 text-caption text-ink-muted">
                Revisi ke-{urutan_revisi} dari {kuota_revisi.total} · diajukan {waktu(revisi_aktif.created_at)}
              </p>
              <div className="flex flex-col gap-1">
                <span className="text-caption text-ink-muted">Detail revisi</span>
                <p className="text-body text-ink">{revisi_aktif.deskripsi_revisi}</p>
              </div>
              {revisi_aktif.pesan_revisi && (
                <div className="flex flex-col gap-1">
                  <span className="text-caption text-ink-muted">Pesan untuk penyedia</span>
                  <p className="text-body text-ink">{revisi_aktif.pesan_revisi}</p>
                </div>
              )}
              {revisi_aktif.lampiran_revisi && (
                <div className="flex flex-col gap-2">
                  <span className="text-caption text-ink-muted">Lampiran revisi</span>
                  {(() => {
                    const l = lampiranDariUrl(revisi_aktif.lampiran_revisi);
                    return <LampiranBukti tipe={l.tipe} nama={l.nama} keterangan={l.keterangan} hrefLihat={l.url} />;
                  })()}
                </div>
              )}
            </Kartu>
          )}

          {deliverable ? (
            <>
              <Kartu judul="Kiriman terakhirmu">
                <p className="text-body text-ink-muted">{deliverable.deskripsi_produk}</p>
                <p className="text-caption text-ink-muted">Dikirim {waktu(deliverable.created_at)}</p>
              </Kartu>

              <Kartu judul="Berkas & tautan hasil">
                {lampiranKiriman(deliverable).map((l) => (
                  <LampiranBukti key={l.url} tipe={l.tipe} nama={l.nama} keterangan={l.keterangan} hrefLihat={l.url} />
                ))}
              </Kartu>
            </>
          ) : (
            <Kartu judul="Belum ada hasil yang dikirim">
              <p className="text-body text-ink-muted">
                Kerjakan pesanan sesuai brief pemesan, lalu kirim hasilnya lewat halaman pengumpulan.
              </p>
            </Kartu>
          )}
        </div>

        {/* ---------- panel aksi ---------- */}
        <section className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-6">
          {tahap === "revisi" && (
            <>
              <h2 className="text-h4 text-ink">Kerjakan revisi</h2>
              <p className="text-body-sm text-ink-muted">
                Perbaiki hasil sesuai permintaan, lalu kirim ulang lewat halaman pengumpulan. Dana diteruskan
                setelah pemesan mengonfirmasi hasil.
              </p>
              <KotakKuota
                judul={`Revisi ke-${urutan_revisi} dari ${kuota_revisi.total}`}
                keterangan={`Sisa kuota revisi pemesan: ${kuota_revisi.tersisa}`}
              />
              <Button fullWidth href={`/penyedia/pengumpulan/${pesanan.id_pesanan}`}>
                Kirim hasil revisi
              </Button>
              {tombolChat}
            </>
          )}

          {tahap === "menunggu" && (
            <>
              <h2 className="text-h4 text-ink">Menunggu pemeriksaan</h2>
              <p className="text-body-sm text-ink-muted">
                Pemesan sedang memeriksa hasilmu. Kamu akan mendapat notifikasi jika ada permintaan revisi atau
                konfirmasi selesai.
              </p>
              <KotakKuota
                judul={`Sisa kuota revisi pemesan: ${kuota_revisi.tersisa} dari ${kuota_revisi.total}`}
                keterangan="Dana diteruskan setelah pemesan mengonfirmasi selesai"
              />
              {tombolChat}
            </>
          )}

          {tahap === "belum_dikirim" && (
            <>
              <h2 className="text-h4 text-ink">Kirim hasil pekerjaan</h2>
              <p className="text-body-sm text-ink-muted">
                Pesanan sudah dibayar dan sedang kamu kerjakan. Kirim hasilnya agar pemesan bisa memeriksa.
              </p>
              <Button fullWidth href={`/penyedia/pengumpulan/${pesanan.id_pesanan}`}>
                Kirim hasil pekerjaan
              </Button>
              {tombolChat}
            </>
          )}

          {tahap === "selesai" && (
            <>
              <h2 className="text-h4 text-ink">Pesanan selesai</h2>
              <p className="text-body-sm text-ink-muted">
                Pemesan sudah mengonfirmasi hasil. Dana {formatRupiah(pesanan.total_biaya)} sudah ditambahkan ke
                saldomu.
              </p>
              {tombolChat}
            </>
          )}

          {tahap === "komplain" && (
            <>
              <h2 className="text-h4 text-ink">Pesanan dalam komplain</h2>
              <p className="text-body-sm text-ink-muted">
                Pemesan mengajukan komplain. Admin akan menghubungimu untuk proses mediasi.
              </p>
              {tombolChat}
            </>
          )}

          {tahap === "batal" && (
            <>
              <h2 className="text-h4 text-ink">Pesanan tidak berjalan</h2>
              <p className="text-body-sm text-ink-muted">
                Pesanan ini sudah ditolak atau dibatalkan, dana dikembalikan ke pemesan.
              </p>
            </>
          )}

          <Link href={link_lapor} className="flex items-center gap-1.5 text-label text-brand-text hover:underline">
            Ada masalah? Laporkan ke admin
          </Link>
        </section>
      </div>
    </main>
  );
}
