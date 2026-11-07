
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  Alert,
  Button,
  LampiranBukti,
  PageHero,
  StatusPill,
} from "@/components/elemen";

import { cn } from "@/lib/cn";
import {
  getHasil,
  konfirmasiSelesai,
  type Hasil,
} from "@/services/layanan";


type Props = {
  peran: "pengguna" | "penyedia";
};

export default function HalamanDeliverables({ peran }: Props) {
  const { idPesanan } = useParams<{
    idPesanan: string;
  }>();

  const router = useRouter();

  const [hasil, setHasil] = useState<Hasil | null>(null);
  const [error, setError] = useState("");
  const [sedangMemproses, setSedangMemproses] = useState(false);
  const [konfirmasiBerhasil, setKonfirmasiBerhasil] = useState(false);

  const isPengguna = peran === "pengguna";
  const revisiDiminta = hasil?.status === "revisi";

  // Memuat data hasil pekerjaan
  useEffect(() => {
    let aktif = true;

    async function muatHasil() {
      try {
        const data = await getHasil(idPesanan);

        if (aktif) {
          setHasil(data);
        }
      } catch {
        if (aktif) {
          setError("Gagal memuat hasil pekerjaan.");
        }
      }
    }

    muatHasil();

    return () => {
      aktif = false;
    };
  }, [idPesanan]);

  // Konfirmasi penyelesaian pekerjaan oleh pengguna
  async function konfirmasi() {
    setSedangMemproses(true);
    setError("");

    try {
      await konfirmasiSelesai(idPesanan);
      setKonfirmasiBerhasil(true);
    } catch {
      setError(
        "Proses konfirmasi gagal. Periksa koneksi internet Anda dan coba lagi."
      );
    } finally {
      setSedangMemproses(false);
    }
  }

  // Tampilan status halaman
  const statusLabel = revisiDiminta
    ? "Revisi diminta"
    : konfirmasiBerhasil
      ? "Selesai"
      : isPengguna
        ? "Menunggu konfirmasimu"
        : "Menunggu pemeriksaan";

  const statusNada = revisiDiminta
    ? "warning"
    : konfirmasiBerhasil
      ? "success"
      : isPengguna
        ? "accent"
        : "neutral";

  return (
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-6 py-8 md:px-20">
        {/* Tampilan loading dan error */}
        {!hasil ? (
          error ? (
            <Alert>{error}</Alert>
          ) : (
            <p className="text-body text-ink-muted">
              Memuat...
            </p>
          )
        ) : (
          <>
            {/* Notifikasi */}
            {error && <Alert>{error}</Alert>}

            {konfirmasiBerhasil && (
              <Alert tipe="success">
                Pesanan selesai. Dana diteruskan ke penyedia jasa.
                Jangan lupa beri ulasan!
              </Alert>
            )}

            {/* Header halaman */}
            <PageHero
              judul="Hasil Pekerjaan"
              subjudul={`#${idPesanan} - ${hasil.judul}`}
              status={
                <StatusPill nada={statusNada}>
                  {statusLabel}
                </StatusPill>
              }
            />

            <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
              {/* Informasi hasil pekerjaan */}
              <div className="flex flex-col gap-6">
                {/* Informasi revisi */}
                {revisiDiminta && (
                  <section
                    className={cn(
                      "flex flex-col gap-2 rounded-xl border border-warning-subtle bg-surface p-6"
                    )}
                  >
                    <h2 className="text-h4 text-ink">
                      {isPengguna
                        ? "Permintaan revisimu"
                        : "Permintaan revisi dari pemesan"}
                    </h2>

                    <p className="text-body text-ink-muted">
                      {hasil.revisi}
                    </p>
                  </section>
                )}

                {/* Catatan hasil */}
                <section className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-6">
                  <h2 className="text-h4 text-ink">
                    {isPengguna
                      ? "Catatan dari penyedia"
                      : "Kiriman terakhirmu"}
                  </h2>

                  <p className="text-body text-ink-muted">
                    {hasil.catatan}
                  </p>
                </section>

                {/* Berkas dan tautan hasil */}
                <section className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-6">
                  <h2 className="text-h4 text-ink">
                    Berkas & tautan hasil
                  </h2>

                  {hasil.berkas.map((berkas) => (
                    <LampiranBukti
                      key={berkas.nama}
                      tipe={berkas.tipe}
                      nama={berkas.nama}
                      keterangan={berkas.info}
                      hrefLihat={berkas.url}
                    />
                  ))}
                </section>
              </div>

              {/* Panel aksi berdasarkan peran dan status */}
              <section className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-6">
                {/* Pengguna: hasil menunggu konfirmasi */}
                {isPengguna &&
                  !revisiDiminta &&
                  !konfirmasiBerhasil && (
                    <>
                      <h2 className="text-h4 text-ink">
                        Sudah sesuai?
                      </h2>

                      <p className="text-body-sm text-ink-muted">
                        Konfirmasi jika hasil sesuai. Dana baru
                        diteruskan ke penyedia setelah kamu konfirmasi.
                      </p>

                      <p className="rounded-field bg-brand-subtle px-4 py-3 text-label text-ink">
                        Sisa revisi: {hasil.kuota} dari 3
                      </p>

                      <Button
                        fullWidth
                        loading={sedangMemproses}
                        disabled={sedangMemproses}
                        onClick={konfirmasi}
                      >
                        Konfirmasi selesai
                      </Button>

                      {hasil.kuota > 0 ? (
                        <Button
                          fullWidth
                          variant="secondary"
                          href={`/pengguna/revisi/${idPesanan}`}
                        >
                          Ajukan revisi
                        </Button>
                      ) : (
                        <Button
                          fullWidth
                          variant="secondary"
                          disabled
                        >
                          Kuota revisi habis
                        </Button>
                      )}
                    </>
                  )}

                {/* Pengguna: revisi sedang dikerjakan */}
                {isPengguna && revisiDiminta && (
                  <>
                    <h2 className="text-h4 text-ink">
                      Revisi sedang dikerjakan
                    </h2>

                    <p className="text-body-sm text-ink-muted">
                      Penyedia sedang memperbaiki hasil. Kamu akan
                      mendapat notifikasi saat hasil revisi dikirim.
                    </p>

                    <Button
                      fullWidth
                      variant="secondary"
                      href={`/chat/${idPesanan}`}
                    >
                      Chat penyedia
                    </Button>
                  </>
                )}

                {/* Pengguna: pesanan berhasil diselesaikan */}
                {isPengguna && konfirmasiBerhasil && (
                  <>
                    <h2 className="text-h4 text-ink">
                      Pesanan selesai
                    </h2>

                    <p className="text-body-sm text-ink-muted">
                      Terima kasih! Pembayaran telah diteruskan
                      ke penyedia jasa.
                    </p>

                    <Button
                      fullWidth
                      href={`/ulasan/${idPesanan}`}
                    >
                      Beri ulasan
                    </Button>
                  </>
                )}

                {/* Penyedia: menunggu pemeriksaan */}
                {!isPengguna && !revisiDiminta && (
                  <>
                    <h2 className="text-h4 text-ink">
                      Menunggu pemeriksaan
                    </h2>

                    <p className="text-body-sm text-ink-muted">
                      Pemesan sedang memeriksa hasilmu. Kamu akan
                      mendapat notifikasi jika ada permintaan revisi
                      atau konfirmasi selesai.
                    </p>

                    <p className="rounded-field bg-brand-subtle px-4 py-3 text-label text-ink">
                      Sisa kuota revisi pemesan: {hasil.kuota} dari 3
                    </p>

                    <Button
                      fullWidth
                      variant="secondary"
                      href={`/chat/${idPesanan}`}
                    >
                      Chat pemesan
                    </Button>
                  </>
                )}

                {/* Penyedia: menerima permintaan revisi */}
                {!isPengguna && revisiDiminta && (
                  <>
                    <h2 className="text-h4 text-ink">
                      Kerjakan revisi
                    </h2>

                    <p className="text-body-sm text-ink-muted">
                      Perbaiki hasil sesuai permintaan, lalu kirim
                      ulang lewat halaman pengumpulan.
                    </p>

                    <p className="rounded-field bg-brand-subtle px-4 py-3 text-label text-ink">
                      Sisa kuota revisi pemesan: {hasil.kuota}
                    </p>

                    <Button
                      fullWidth
                      href={`/penyedia/pengumpulan/${idPesanan}`}
                    >
                      Kirim hasil revisi
                    </Button>

                    <Button
                      fullWidth
                      variant="secondary"
                      href={`/chat/${idPesanan}`}
                    >
                      Chat pemesan
                    </Button>
                  </>
                )}

                {/* Pengguna: laporan ke admin */}
                {isPengguna && (
                  <Link
                    href="/pelaporan"
                    className="text-label text-brand-text"
                  >
                    Ada masalah? Laporkan ke admin
                  </Link>
                )}
              </section>
            </div>
          </>
        )}
      </div>
  );
}
