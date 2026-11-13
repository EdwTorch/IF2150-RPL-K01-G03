"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Alert, Button, LampiranBukti, PageHero, StatusPill, type NadaStatus } from "@/components/elemen";
import { ApiError } from "@/lib/api";
import { bukaRoomDenganPenyedia } from "@/lib/client/chat";
import {
  ambilHasilPekerjaan,
  konfirmasiSelesai,
  lampiranKiriman,
  type HasilPekerjaan,
} from "@/lib/client/deliverables";
import { normalisasiStatusPesanan } from "@/lib/client/pesanan";
import { formatRupiah } from "@/lib/format";

/**
 * Hasil Pekerjaan versi pengguna jasa — Figma "C38 HalamanDeliverables" (126:3074)
 *   - menunggu konfirmasimu (126:3075) · pesanan selesai (126:3276)
 *   - kuota/batas revisi habis (126:3444) · konfirmasi gagal (126:3629)
 * Sumber data: GET/PATCH /api/pesanan/[id]/deliverables
 */

type Tahap = "dikerjakan" | "revisi" | "periksa" | "selesai" | "komplain" | "batal";

function tentukanTahap(h: HasilPekerjaan): Tahap {
  const st = normalisasiStatusPesanan(h.pesanan.status_pesanan);
  if (st === "SELESAI") return "selesai";
  if (st === "KOMPLAIN") return "komplain";
  if (st === "DITOLAK" || st === "DIKEMBALIKAN" || st === "DIBATALKAN") return "batal";
  if (st === "MENUNGGU_KONFIRMASI_SELESAI") return "periksa";
  if (h.revisi_aktif) return "revisi";
  return "dikerjakan";
}

const PILL: Record<Tahap, [string, NadaStatus]> = {
  dikerjakan: ["Sedang dikerjakan", "neutral"],
  revisi: ["Revisi diminta", "warning"],
  periksa: ["Menunggu konfirmasimu", "accent"],
  selesai: ["Selesai", "success"],
  komplain: ["Komplain", "warning"],
  batal: ["Ditolak", "danger"],
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

function Kartu({ judul, children }: { judul: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-6">
      <h2 className="text-h4 text-ink">{judul}</h2>
      {children}
    </section>
  );
}

function KotakKuota({ judul, keterangan, habis = false }: { judul: string; keterangan: string; habis?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-field px-4 py-3 ${habis ? "bg-danger-subtle" : "bg-canvas"}`}
    >
      <Image src="/icons/ulang.svg" alt="" width={16} height={16} />
      <div className="flex flex-col">
        <span className={`text-label ${habis ? "text-danger" : "text-ink"}`}>{judul}</span>
        <span className="text-caption text-ink-muted">{keterangan}</span>
      </div>
    </div>
  );
}

export default function HalamanHasilPekerjaanPengguna() {
  const { idPesanan } = useParams<{ idPesanan: string }>();
  const router = useRouter();

  const [hasil, setHasil] = useState<HasilPekerjaan | null>(null);
  const [pesan_muat, setPesanMuat] = useState("");
  const [pesan_error, setPesanError] = useState("");
  const [baru_selesai, setBaruSelesai] = useState(false);
  const [sedang_konfirmasi, setSedangKonfirmasi] = useState(false);
  const [membuka_chat, setMembukaChat] = useState(false);

  async function muat() {
    try {
      setHasil(await ambilHasilPekerjaan(idPesanan));
      setPesanMuat("");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) setPesanMuat("Sesi kamu sudah habis. Silakan login kembali.");
      else if (err instanceof ApiError && err.status === 403) setPesanMuat("Pesanan ini bukan milikmu.");
      else if (err instanceof ApiError && (err.status === 404 || err.status === 400))
        setPesanMuat("Pesanan tidak ditemukan. Buka dari halaman Pesanan Saya.");
      else setPesanMuat("Gagal memuat hasil pekerjaan. Periksa koneksi internet kamu dan coba lagi.");
    }
  }

  useEffect(() => {
    muat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idPesanan]);

  /** konfirmasiSelesai() — Algo-3801 */
  async function klikKonfirmasi() {
    setSedangKonfirmasi(true);
    setPesanError("");
    try {
      await konfirmasiSelesai(idPesanan);
      setBaruSelesai(true);
      await muat();
    } catch (err) {
      setPesanError(
        err instanceof ApiError && err.status !== 500 && err.status !== 0
          ? err.message
          : "Proses konfirmasi gagal. Periksa koneksi internet Anda dan coba lagi.",
      );
    } finally {
      setSedangKonfirmasi(false);
    }
  }

  async function klikChatPenyedia() {
    if (!hasil) return;
    setMembukaChat(true);
    try {
      const room = await bukaRoomDenganPenyedia(hasil.pesanan.id_penyedia_jasa);
      router.push(`/chat?room=${room.id_chatroom}`);
    } catch {
      setPesanError("Chat gagal dibuka. Coba lagi.");
      setMembukaChat(false);
    }
  }

  if (!hasil) {
    return (
      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-4 px-20 pt-12 pb-20">
        {pesan_muat ? (
          <div className="flex max-w-[480px] flex-col items-start gap-3">
            <Alert tipe="error">{pesan_muat}</Alert>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={muat}>
                Coba lagi
              </Button>
              <Button variant="ghost" href="/pengguna/riwayat-transaksi">
                Kembali ke Pesanan Saya
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-body text-ink-muted">Memuat hasil pekerjaan…</p>
        )}
      </main>
    );
  }

  const { pesanan, deliverable, kuota_revisi } = hasil;
  const tahap = tentukanTahap(hasil);
  const [label_status, nada_status] = PILL[tahap];
  const nama_penyedia = pesanan.nama_penyedia ?? "Penyedia Jasa";
  const kuota_habis = kuota_revisi.tersisa <= 0;
  const link_lapor = `/pengguna/pelaporan?idPesanan=${encodeURIComponent(pesanan.id_pesanan)}`;

  const tombolChat = (
    <Button fullWidth variant="secondary" loading={membuka_chat} onClick={klikChatPenyedia}>
      Chat penyedia
    </Button>
  );

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-6 px-20 pt-12 pb-20">
      <PageHero
        judul="Hasil Pekerjaan"
        subjudul={`#${pesanan.id_pesanan.slice(0, 8).toUpperCase()} - ${pesanan.nama_jasa} · oleh ${nama_penyedia}`}
        status={<StatusPill nada={nada_status}>{label_status}</StatusPill>}
      />

      {baru_selesai && (
        <Alert tipe="success">Pesanan selesai. Dana diteruskan ke penyedia jasa. Jangan lupa beri ulasan!</Alert>
      )}
      {tahap === "periksa" && kuota_habis && !pesan_error && (
        <Alert tipe="error">
          Maaf, kuota pengajuan revisi sudah habis. Kamu masih bisa mengonfirmasi hasil atau melapor lewat Bantuan.
        </Alert>
      )}
      {pesan_error && <Alert tipe="error">{pesan_error}</Alert>}

      <div className="grid items-start gap-6 lg:grid-cols-[872px_1fr]">
        {/* ---------- kolom kiri ---------- */}
        <div className="flex flex-col gap-6">
          {deliverable ? (
            <>
              <Kartu judul="Catatan dari penyedia">
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
            <Kartu judul="Hasil belum dikirim">
              <p className="text-body text-ink-muted">
                {nama_penyedia} sedang mengerjakan pesananmu. Kamu akan mendapat notifikasi saat hasilnya dikirim.
              </p>
            </Kartu>
          )}
        </div>

        {/* ---------- panel aksi ---------- */}
        <section className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-6">
          {tahap === "periksa" && (
            <>
              <h2 className="text-h4 text-ink">Sudah sesuai?</h2>
              <p className="text-body-sm text-ink-muted">
                Konfirmasi jika hasil sesuai. Dana baru diteruskan ke penyedia setelah kamu konfirmasi.
              </p>
              <KotakKuota
                habis={kuota_habis}
                judul={
                  kuota_habis
                    ? "Kuota revisi habis"
                    : `Sisa revisi: ${kuota_revisi.tersisa} dari ${kuota_revisi.total}`
                }
                keterangan={kuota_habis ? "Pengajuan revisi tidak tersedia lagi" : "Setiap pengajuan mengurangi 1 kuota"}
              />
              <Button fullWidth loading={sedang_konfirmasi} onClick={klikKonfirmasi}>
                Konfirmasi selesai
              </Button>
              <Button
                fullWidth
                variant="secondary"
                disabled={kuota_habis || sedang_konfirmasi}
                href={kuota_habis ? undefined : `/pengguna/revisi/${pesanan.id_pesanan}`}
              >
                Ajukan revisi
              </Button>
            </>
          )}

          {tahap === "revisi" && (
            <>
              <h2 className="text-h4 text-ink">Revisi sedang dikerjakan</h2>
              <p className="text-body-sm text-ink-muted">
                Penyedia sedang memperbaiki hasil. Kamu akan mendapat notifikasi saat hasil revisi dikirim.
              </p>
              <KotakKuota
                judul={`Sisa revisi: ${kuota_revisi.tersisa} dari ${kuota_revisi.total}`}
                keterangan="Kuota berkurang setiap kali kamu mengajukan revisi"
              />
              {tombolChat}
            </>
          )}

          {tahap === "dikerjakan" && (
            <>
              <h2 className="text-h4 text-ink">Sedang dikerjakan</h2>
              <p className="text-body-sm text-ink-muted">
                Pembayaranmu sudah diterima dan pesanan sedang dikerjakan penyedia.
              </p>
              {tombolChat}
            </>
          )}

          {tahap === "selesai" && (
            <>
              <h2 className="text-h4 text-ink">Pesanan selesai</h2>
              <p className="text-body-sm text-ink-muted">
                Terima kasih! Pembayaran {formatRupiah(pesanan.total_biaya)} sudah diteruskan ke penyedia jasa.
              </p>
              <Button fullWidth href={`/pengguna/ulasan/${pesanan.id_pesanan}`}>
                Beri ulasan
              </Button>
            </>
          )}

          {tahap === "komplain" && (
            <>
              <h2 className="text-h4 text-ink">Pesanan dalam komplain</h2>
              <p className="text-body-sm text-ink-muted">Admin sedang menindaklanjuti laporanmu.</p>
              {tombolChat}
            </>
          )}

          {tahap === "batal" && (
            <>
              <h2 className="text-h4 text-ink">Pesanan ditolak</h2>
              <p className="text-body-sm text-ink-muted">
                Pesanan ini ditolak penyedia. Dana dikembalikan dan tercatat di riwayat transaksi.
              </p>
            </>
          )}

          {tahap !== "selesai" && tahap !== "batal" && (
            <Link href={link_lapor} className="text-label text-brand-text hover:underline">
              Ada masalah? Laporkan ke admin
            </Link>
          )}
        </section>
      </div>
    </main>
  );
}