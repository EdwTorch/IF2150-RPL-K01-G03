
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Alert,
  Button,
  LampiranBukti,
  PageHero,
  Select,
  StatusPill,
  Textarea,
} from "@/components/elemen";
import { cn } from "@/lib/cn";
import {
  TiketAdmin,
  ambilDetailTiketAdmin,
  kirimKeputusanAdmin,
} from "@/lib/client/admin";

type JenisTindakan =
  | "PERINGATAN"
  | "SUSPEND_AKUN"
  | "LAPORAN_DITOLAK";

const PILIHAN_TINDAKAN = [
  { value: "PERINGATAN", label: "Peringatan" },
  { value: "SUSPEND_AKUN", label: "Suspend akun" },
  { value: "LAPORAN_DITOLAK", label: "Laporan ditolak" },
];

function formatTanggal(tanggal?: string) {
  if (!tanggal) return "-";

  const date = new Date(tanggal);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function namaBerkas(url: string, index: number) {
  try {
    const pathname = new URL(url).pathname;
    const nama = pathname.split("/").pop();

    return nama ? decodeURIComponent(nama) : `Bukti ${index + 1}`;
  } catch {
    return `Bukti ${index + 1}`;
  }
}

function tipeBerkas(url: string): "berkas" | "gambar" {
  const pathname = url.split("?")[0].toLowerCase();

  if (
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".jpeg") ||
    pathname.endsWith(".png")
  ) {
    return "gambar";
  }

  return "berkas";
}

function keteranganBerkas(url: string) {
  const pathname = url.split("?")[0].toLowerCase();

  if (pathname.endsWith(".pdf")) return "Dokumen PDF";
  if (pathname.endsWith(".png")) return "Gambar PNG";
  if (
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".jpeg")
  ) {
    return "Gambar JPG";
  }

  return "Lampiran laporan";
}

export default function HalamanDetailTiketAdmin() {
  const params = useParams<{ idTiket: string }>();
  const idTiket = params.idTiket;

  const [tiket, setTiket] = useState<TiketAdmin | null>(null);
  const [loading, setLoading] = useState(true);

  const [catatan, setCatatan] = useState("");
  const [tindakan, setTindakan] = useState<JenisTindakan | "">("");

  const [error, setError] = useState("");
  const [errorCatatan, setErrorCatatan] = useState("");
  const [errorTindakan, setErrorTindakan] = useState("");
  const [info, setInfo] = useState("");

  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let aktif = true;

    async function muatDetail() {
      setLoading(true);
      setError("");

      try {
        const data = await ambilDetailTiketAdmin(idTiket);

        if (aktif) {
          setTiket(data);
        }
      } catch (err: unknown) {
        if (aktif) {
          setTiket(null);
          setError(
            err instanceof Error
              ? err.message
              : "Gagal memuat detail tiket."
          );
        }
      } finally {
        if (aktif) setLoading(false);
      }
    }

    if (idTiket) muatDetail();

    return () => {
      aktif = false;
    };
  }, [idTiket]);

  async function kirimKeputusan() {
    setError("");
    setInfo("");

    const catatanValid = catatan.trim().length > 0;
    const tindakanValid = tindakan !== "";

    setErrorCatatan(
      catatanValid ? "" : "Catatan tanggapan wajib diisi."
    );

    setErrorTindakan(
      tindakanValid ? "" : "Pilih tindakan admin."
    );

    if (!catatanValid || !tindakanValid || !tiket) return;

    setBusy(true);

    try {
      await kirimKeputusanAdmin(idTiket, {
        jenis_tindakan: tindakan,
        catatan_tanggapan: catatan.trim(),
      });

      const tanggapanBaru = {
        jenis_tindakan: tindakan,
        catatan_tanggapan: catatan.trim(),
        created_at: new Date().toISOString(),
      };

      setTiket({
        ...tiket,
        status_tiket: "Selesai",
        tanggapan_laporan: [
          ...(tiket.tanggapan_laporan ?? []),
          tanggapanBaru,
        ],
      });

      setCatatan("");
      setTindakan("");
      setInfo("Keputusan admin berhasil disimpan.");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan keputusan admin."
      );
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-6 py-8 md:px-20">
        <p className="text-body text-ink-muted">Memuat detail tiket…</p>
      </div>
    );
  }

  if (!tiket) {
    return (
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-6 py-8 md:px-20">
        <PageHero judul="Detail Tiket" penuh />
        <Alert>{error || "Tiket laporan tidak ditemukan."}</Alert>
      </div>
    );
  }

  const selesai = tiket.status_tiket === "Selesai";

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-6 py-8 md:px-20">
      <PageHero judul={`Tiket ${tiket.id_tiket}`} penuh />

      {error && <Alert>{error}</Alert>}

      {info && <Alert tipe="success">{info}</Alert>}

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_380px]">
        {/* DETAIL LAPORAN */}
        <section
          className={cn(
            "rounded-xl border border-line bg-surface p-6",
            "flex flex-col gap-5"
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-h4 text-ink">Detail Laporan</h2>

            <StatusPill
              nada={selesai ? "success" : "neutral"}
            >
              {tiket.status_tiket}
            </StatusPill>
          </div>

          {/* IDENTITAS */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-body-sm text-ink-muted">Pelapor</p>
              <p className="text-body text-ink">
                {tiket.pelapor?.nama ?? "-"}
              </p>
              <p className="text-caption text-ink-muted">
                {tiket.pelapor?.email ?? "-"}
              </p>
            </div>

            <div>
              <p className="text-body-sm text-ink-muted">Terlapor</p>
              <p className="text-body text-ink">
                {tiket.terlapor?.nama ?? "-"}
              </p>
              <p className="text-caption text-ink-muted">
                {tiket.terlapor?.email ?? "-"}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-body-sm text-ink-muted">
                ID Pesanan
              </p>
              <p className="text-body text-ink break-all">
                {tiket.id_pesanan}
              </p>
            </div>

            <div>
              <p className="text-body-sm text-ink-muted">
                Tanggal Laporan
              </p>
              <p className="text-body text-ink">
                {formatTanggal(tiket.created_at)}
              </p>
            </div>
          </div>

          <div>
            <p className="text-body-sm text-ink-muted">Kategori</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {tiket.kategori?.length ? (
                tiket.kategori.map((kategori, index) => (
                  <span
                    key={`${kategori}-${index}`}
                    className="rounded-full bg-canvas px-3 py-1 text-body-sm text-ink"
                  >
                    {kategori}
                  </span>
                ))
              ) : (
                <p className="text-body text-ink">-</p>
              )}
            </div>
          </div>

          <div>
            <p className="text-body-sm text-ink-muted">
              Deskripsi Masalah
            </p>
            <p className="whitespace-pre-wrap text-body text-ink">
              {tiket.deskripsi_laporan}
            </p>
          </div>

          {/* BUKTI LAPORAN */}
          <div className="flex flex-col gap-3">
            <h3 className="text-label text-ink">Bukti Laporan</h3>

            {tiket.url_bukti?.length ? (
              tiket.url_bukti.map((url, index) => (
                <LampiranBukti
                  key={`${url}-${index}`}
                  tipe={tipeBerkas(url)}
                  nama={namaBerkas(url, index)}
                  keterangan={keteranganBerkas(url)}
                  hrefLihat={url}
                  hrefUnduh={url}
                />
              ))
            ) : (
              <p className="text-body-sm text-ink-muted">
                Tidak ada bukti yang dilampirkan.
              </p>
            )}
          </div>

          {/* RIWAYAT TANGGAPAN */}
          <div className="flex flex-col gap-3">
            <h3 className="text-label text-ink">
              Riwayat Tanggapan Admin
            </h3>

            {tiket.tanggapan_laporan?.length ? (
              tiket.tanggapan_laporan.map((tanggapan, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-line bg-canvas p-4"
                >
                  <p className="text-label text-ink">
                    {tanggapan.jenis_tindakan}
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-body-sm text-ink">
                    {tanggapan.catatan_tanggapan}
                  </p>

                  <p className="mt-2 text-caption text-ink-muted">
                    {formatTanggal(tanggapan.created_at)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-body-sm text-ink-muted">
                Belum ada tanggapan admin.
              </p>
            )}
          </div>
        </section>

        {/* FORM TANGGAPAN ADMIN */}
        <section
          className={cn(
            "rounded-xl border border-line bg-surface p-6",
            "flex flex-col gap-4"
          )}
        >
          <h2 className="text-h4 text-ink">Tanggapan Admin</h2>

          {selesai ? (
            <p className="text-body-sm text-ink-muted">
              Tiket ini sudah selesai ditangani. Keputusan tidak
              dapat diubah kembali.
            </p>
          ) : (
            <>
              <Textarea
                placeholder="Berikan tanggapan terhadap laporan pengguna"
                value={catatan}
                onChange={(ev) => setCatatan(ev.target.value)}
                error={errorCatatan}
                disabled={busy}
                aria-label="Catatan tanggapan admin"
              />

              <Select
                label="Tindakan Admin"
                placeholder="Pilih tindakan"
                opsi={PILIHAN_TINDAKAN}
                value={tindakan}
                onChange={(ev) =>
                  setTindakan(ev.target.value as JenisTindakan | "")
                }
                error={errorTindakan}
                disabled={busy}
              />

              <p className="text-caption text-ink-muted">
                Keputusan yang dikirim akan disimpan sebagai
                tanggapan dan menandai tiket sebagai selesai.
              </p>

              <Button
                variant="accent"
                fullWidth
                loading={busy}
                disabled={busy}
                onClick={kirimKeputusan}
              >
                Kirim Keputusan
              </Button>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
