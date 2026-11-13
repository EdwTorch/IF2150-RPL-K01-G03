
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { logout, sesiSaatIni } from "@/lib/client/auth";

import {
  Alert,
  Button,
  LampiranBukti,
  PageHero,
  StatusPill,
} from "@/components/elemen";

import { cn } from "@/lib/cn";
import { api } from "@/lib/api";

type Props = {
  peran: "pengguna" | "penyedia";
};

type ProdukAkhir = {
  id_produk_akhir: string;
  id_pesanan: string;
  id_revisi?: string | null;
  deskripsi_produk: string;
  file_url?: string | null;
  file_download_url?: string | null;
  created_at?: string;
};

type PengajuanRevisi = {
  id_revisi: string;
  id_pesanan: string;
  id_produk_akhir?: string | null;
  deskripsi_revisi: string;
  jml_revisi_tersedia: number;
  status_pengerjaan: string;
  created_at?: string;
  produk_akhir?: ProdukAkhir | ProdukAkhir[] | null;
};

type LampiranPengajuanRevisi = {
  id_revisi: string;
  nama_file: string;
  file_url: string;
  file_download_url: string;
  created_at?: string;
};

type DeliverablesResponse = {
  success: boolean;
  message: string;
  data: {
    deliverable: ProdukAkhir | null;
    nama_jasa: string;
    status_pesanan: string;
    revisi_terbaru: PengajuanRevisi | null;
    revisi_aktif: PengajuanRevisi | null;
    riwayat_revisi: PengajuanRevisi[];
    lampiran_revisi: ProdukAkhir[];
    lampiran_pengajuan_revisi: LampiranPengajuanRevisi[];
    kuota_revisi: number;
  };
};

type BerkasHasil = {
  nama: string;
  tipe: "berkas" | "gambar" | "tautan";
  info: string;
  url: string;
  urlUnduh: string;
};

function namaBerkas(url: string) {
  try {
    const bagian = url.split("?")[0];

    return decodeURIComponent(
      bagian.split("/").pop() || "Berkas hasil pekerjaan"
    );
  } catch {
    return "Berkas hasil pekerjaan";
  }
}

function tipeBerkas(url: string): BerkasHasil["tipe"] {
  let pathname = url.split("?")[0];

  try {
    pathname = decodeURIComponent(pathname);
  } catch {
    // Gunakan pathname awal jika gagal decode.
  }

  const ekstensi = pathname
    .split("/")
    .pop()
    ?.split(".")
    .pop()
    ?.toLowerCase();

  if (
    ["jpg", "jpeg", "png", "webp", "gif"].includes(
      ekstensi || ""
    )
  ) {
    return "gambar";
  }

  if (
    ["pdf", "zip", "mp4", "txt", "html"].includes(
      ekstensi || ""
    )
  ) {
    return "berkas";
  }

  return /^https?:\/\//i.test(url) ? "tautan" : "berkas";
}

function buatDaftarBerkas(
  deliverable: ProdukAkhir | null,
  lampiranRevisi: ProdukAkhir[],
  revisiTerbaru: PengajuanRevisi | null
): BerkasHasil[] {
  if (
    revisiTerbaru?.status_pengerjaan === "Revisi Dikumpulkan" &&
    lampiranRevisi.length > 0
  ) {
    return lampiranRevisi
      .filter((item) => item?.file_url)
      .map((item) => {
        const url = item.file_url!;

        return {
          nama: namaBerkas(url),
          tipe: tipeBerkas(url),
          info: "Lampiran hasil revisi",
          url,
          urlUnduh: item.file_download_url || url,
        };
      });
  }

  // Hasil pekerjaan belum dikumpulkan.
  if (!deliverable?.file_url) {
    return [];
  }

  const url = deliverable.file_url;

  return [
    {
      nama: namaBerkas(url),
      tipe: tipeBerkas(url),
      info: "Berkas hasil pekerjaan",
      url,
      urlUnduh: deliverable.file_download_url || url,
    },
  ];
}

export default function HalamanDeliverables({ peran }: Props) {
  const { idPesanan } = useParams<{
    idPesanan: string;
  }>();

  const [data, setData] = useState<
    DeliverablesResponse["data"] | null
  >(null);

  const [error, setError] = useState("");
  const [sedangMemuat, setSedangMemuat] = useState(true);
  const [sedangMemproses, setSedangMemproses] = useState(false);
  const [konfirmasiBerhasil, setKonfirmasiBerhasil] =
    useState(false);

  const isPengguna = peran === "pengguna";

  useEffect(() => {
    let aktif = true;

    async function muatDeliverables() {
      setSedangMemuat(true);
      setError("");

      try {
        const respons = await api<DeliverablesResponse>(
          `/api/pesanan/${encodeURIComponent(idPesanan)}/deliverables`
        );

        if (aktif) {
          setData(respons.data);
        }
      } catch (err) {
        if (aktif) {
          setError(
            err instanceof Error
              ? err.message
              : "Gagal memuat hasil pekerjaan."
          );
        }
      } finally {
        if (aktif) {
          setSedangMemuat(false);
        }
      }
    }

    if (idPesanan) {
      muatDeliverables();
    }

    return () => {
      aktif = false;
    };
  }, [idPesanan]);

  const statusPesanan = data?.status_pesanan?.toLowerCase() ?? "";

  const pesananDitolak =
    statusPesanan.includes("tolak") ||
    statusPesanan.includes("kembali");

  const pesananSelesai =
    statusPesanan === "selesai" || konfirmasiBerhasil;

  const revisiAktif = data?.revisi_aktif ?? null;
  const revisiTerbaru = data?.revisi_terbaru ?? null;

  const revisiDiminta =
    revisiAktif?.status_pengerjaan === "Sedang Direvisi";

  const revisiSudahDikirim =
    revisiTerbaru?.status_pengerjaan === "Revisi Dikumpulkan";

  const kuotaRevisi = data?.kuota_revisi ?? 3;
  
  // Penyedia belum pernah mengumpulkan hasil (pesanan baru diterima / sedang dikerjakan)
  const belumAdaHasil = !data?.deliverable;

  const berkas = data
    ? buatDaftarBerkas(
        data.deliverable,
        data.lampiran_revisi ?? [],
        revisiTerbaru
      )
    : [];

  const lampiranPengajuanRevisi =
    data?.lampiran_pengajuan_revisi?.filter(
      (item) =>
        item.file_url &&
        (!revisiAktif || item.id_revisi === revisiAktif.id_revisi)
    ) ?? [];

  const catatanHasil =
    data?.deliverable?.deskripsi_produk;

  async function konfirmasi() {
    if (pesananDitolak || sedangMemproses) return;

    setSedangMemproses(true);
    setError("");

    try {
      await api(
        `/api/pesanan/${encodeURIComponent(idPesanan)}/deliverables`,
        {
          method: "PATCH",
        }
      );

      setKonfirmasiBerhasil(true);

      setData((sebelumnya) =>
        sebelumnya
          ? {
              ...sebelumnya,
              status_pesanan: "Selesai",
            }
          : sebelumnya
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Proses konfirmasi gagal. Silakan coba lagi."
      );
    } finally {
      setSedangMemproses(false);
    }
  }

  const statusLabel = pesananDitolak
    ? "Ditolak"
    : pesananSelesai
      ? "Selesai"
      : revisiDiminta
        ? "Revisi diminta"
        : belumAdaHasil
          ? "Sedang dikerjakan"
          : isPengguna
            ? "Menunggu konfirmasimu"
            : "Menunggu pemeriksaan";

  const statusNada = pesananDitolak
    ? "danger"
    : pesananSelesai
      ? "success"
      : revisiDiminta
        ? "warning"
        : belumAdaHasil
          ? "neutral"
          : isPengguna
            ? "accent"
            : "neutral";

  if (sedangMemuat) {
    return (
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-6 py-8 md:px-20">
        <p className="text-body text-ink-muted">
          Memuat hasil pekerjaan...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-6 py-8 md:px-20">
        <Alert>
          {error || "Hasil pekerjaan belum tersedia."}
        </Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-6 py-8 md:px-20">
      {error && <Alert>{error}</Alert>}

      {konfirmasiBerhasil && (
        <Alert tipe="success">
          Pesanan selesai. Dana diteruskan ke penyedia jasa.
          Jangan lupa beri ulasan!
        </Alert>
      )}

      <PageHero
        judul="Hasil Pekerjaan"
        subjudul={`#${idPesanan} - ${data.nama_jasa}`}
        status={
          <StatusPill nada={statusNada}>
            {statusLabel}
          </StatusPill>
        }
      />

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6">
          {revisiAktif && (
            <section
              className={cn(
                "flex flex-col gap-3 rounded-xl border border-warning-subtle bg-surface p-6"
              )}
            >
              <h2 className="text-h4 text-ink">
                {isPengguna
                  ? "Permintaan revisimu"
                  : "Permintaan revisi dari pemesan"}
              </h2>

              <p className="text-body text-ink-muted">
                {revisiAktif.deskripsi_revisi}
              </p>

              {lampiranPengajuanRevisi.length > 0 && (
                <div className="mt-2 flex flex-col gap-3">
                  <h3 className="text-label text-ink">
                    Lampiran dari pemesan
                  </h3>

                  {lampiranPengajuanRevisi.map((item, index) => (
                    <LampiranBukti
                      key={`${item.id_revisi}-${index}`}
                      tipe={tipeBerkas(item.file_url)}
                      nama={item.nama_file}
                      keterangan="Lampiran permintaan revisi"
                      hrefLihat={item.file_url}
                      hrefUnduh={
                        item.file_download_url || item.file_url
                      }
                    />
                  ))}
                </div>
              )}

              {lampiranPengajuanRevisi.length === 0 && (
                <p className="text-body-sm text-ink-muted">
                  Tidak ada lampiran pada pengajuan revisi ini.
                </p>
              )}
            </section>
          )}

          {belumAdaHasil && !isPengguna ? (
            <section className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-line-strong bg-surface p-6">
              <h2 className="text-h4 text-ink">Belum ada hasil yang dikirim</h2>
              <p className="text-body text-ink-muted">
                Unggah berkas (JPG, PNG, PDF, maks. 10 MB) atau tautan hasil pekerjaan,
                lalu tulis catatan singkat untuk pemesan.
              </p>
              <Button href={`/penyedia/pengumpulan/${idPesanan}`}>
                Kumpulkan hasil
              </Button>
            </section>
          ) : (
            <section className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-6">
              <h2 className="text-h4 text-ink">
                {isPengguna
                  ? "Catatan dari penyedia"
                  : "Kiriman terakhirmu"}
              </h2>

              <p className="text-body text-ink-muted">
                {catatanHasil || "Belum ada catatan hasil pekerjaan."}
              </p>
            </section>
          )}

          <section className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-6">
            <h2 className="text-h4 text-ink">
              Berkas & tautan hasil
            </h2>

            {berkas.length > 0 ? (
              berkas.map((item, index) => (
                <LampiranBukti
                  key={`${item.nama}-${index}`}
                  tipe={item.tipe}
                  nama={item.nama}
                  keterangan={item.info}
                  hrefLihat={item.url}
                  hrefUnduh={item.urlUnduh}
                />
              ))
            ) : (
              <p className="text-body-sm text-ink-muted">
                Belum ada berkas yang dilampirkan.
              </p>
            )}
          </section>
        </div>

        <section className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-6">
          {isPengguna && pesananDitolak && (
            <div
              className="pointer-events-none flex flex-col gap-4 rounded-lg bg-disabled p-4 opacity-50"
              aria-disabled="true"
            >
              <h2 className="text-h4 text-ink-disabled">
                Sudah sesuai?
              </h2>

              <p className="text-body-sm text-ink-disabled">
                Pesanan telah ditolak. Konfirmasi selesai dan
                pengajuan revisi tidak lagi tersedia.
              </p>

              <p className="rounded-field bg-muted px-4 py-3 text-label text-ink-disabled">
                Sisa revisi: {kuotaRevisi} dari 3
              </p>

              <Button fullWidth disabled>
                Konfirmasi selesai
              </Button>

              <Button fullWidth variant="secondary" disabled>
                Ajukan revisi
              </Button>
            </div>
          )}

          {isPengguna &&
            !pesananDitolak &&
            belumAdaHasil &&
            !pesananSelesai && (
              <>
                <h2 className="text-h4 text-ink">
                  Pesanan sedang dikerjakan
                </h2>

                <p className="text-body-sm text-ink-muted">
                  Penyedia sedang mengerjakan pesananmu. Kamu akan
                  mendapat notifikasi saat hasil pekerjaan dikirim.
                </p>

                <Button fullWidth variant="secondary" href="/chat">
                  Chat penyedia
                </Button>
              </>
            )}

          {isPengguna &&
            !pesananDitolak &&
            !belumAdaHasil &&
            !revisiDiminta &&
            !revisiSudahDikirim &&
            !pesananSelesai && (
              <>
                <h2 className="text-h4 text-ink">
                  Sudah sesuai?
                </h2>

                <p className="text-body-sm text-ink-muted">
                  Konfirmasi jika hasil sesuai. Dana baru
                  diteruskan ke penyedia setelah kamu konfirmasi.
                </p>

                <p className="rounded-field bg-brand-subtle px-4 py-3 text-label text-ink">
                  Sisa revisi: {kuotaRevisi} dari 3
                </p>

                <Button
                  fullWidth
                  loading={sedangMemproses}
                  disabled={sedangMemproses}
                  onClick={konfirmasi}
                >
                  Konfirmasi selesai
                </Button>

                {kuotaRevisi > 0 ? (
                  <Button
                    fullWidth
                    variant="secondary"
                    href={`/pengguna/revisi/${idPesanan}`}
                  >
                    Ajukan revisi
                  </Button>
                ) : (
                  <Button fullWidth variant="secondary" disabled>
                    Kuota revisi habis
                  </Button>
                )}
              </>
            )}

          {isPengguna && !pesananDitolak && revisiDiminta && (
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
                href={`/chat`}
              >
                Chat penyedia
              </Button>
            </>
          )}

          {isPengguna &&
            !pesananDitolak &&
            revisiSudahDikirim &&
            !pesananSelesai && (
              <>
                <h2 className="text-h4 text-ink">
                  Hasil revisi sudah dikirim
                </h2>

                <p className="text-body-sm text-ink-muted">
                  Periksa hasil revisi terbaru. Jika sudah sesuai,
                  kamu dapat mengonfirmasi penyelesaian pesanan.
                </p>

                <Button
                  fullWidth
                  loading={sedangMemproses}
                  disabled={sedangMemproses}
                  onClick={konfirmasi}
                >
                  Konfirmasi selesai
                </Button>

                {kuotaRevisi > 0 && (
                  <Button
                    fullWidth
                    variant="secondary"
                    href={`/pengguna/revisi/${idPesanan}`}
                  >
                    Ajukan revisi lagi
                  </Button>
                )}
              </>
            )}

          {isPengguna && pesananSelesai && (
            <>
              <h2 className="text-h4 text-ink">
                Pesanan selesai
              </h2>

              <p className="text-body-sm text-ink-muted">
                Terima kasih! Pembayaran telah diteruskan
                ke penyedia jasa.
              </p>

              <Button fullWidth href={`/pengguna/ulasan/${idPesanan}`}>
                Beri ulasan
              </Button>
            </>
          )}

          {!isPengguna &&
            !pesananDitolak &&
            belumAdaHasil &&
            !pesananSelesai && (
              <>
                <h2 className="text-h4 text-ink">
                  Kumpulkan hasil pekerjaan
                </h2>

                <p className="text-body-sm text-ink-muted">
                  Unggah berkas atau tautan hasil pekerjaan beserta
                  catatan untuk pemesan. Pemesan akan memeriksa
                  hasilmu setelah dikirim.
                </p>

                <p className="rounded-field bg-brand-subtle px-4 py-3 text-label text-ink">
                  Kuota revisi pemesan: {kuotaRevisi} dari 3
                </p>

                <Button
                  fullWidth
                  href={`/penyedia/pengumpulan/${idPesanan}`}
                >
                  Kumpulkan hasil
                </Button>

                <Button fullWidth variant="secondary" href="/chat">
                  Chat pemesan
                </Button>
              </>
            )}

          {!isPengguna &&
            !pesananDitolak &&
            !belumAdaHasil &&
            !revisiDiminta &&
            !pesananSelesai && (
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
                  Sisa kuota revisi pemesan: {kuotaRevisi} dari 3
                </p>

                <Button
                  fullWidth
                  variant="secondary"
                  href={`/chat`}
                >
                  Chat pemesan
                </Button>
              </>
            )}

          {!isPengguna && !pesananDitolak && revisiDiminta && (
            <>
              <h2 className="text-h4 text-ink">
                Kerjakan revisi
              </h2>

              <p className="text-body-sm text-ink-muted">
                Perbaiki hasil sesuai permintaan, lalu kirim
                ulang lewat halaman pengumpulan.
              </p>

              <p className="rounded-field bg-brand-subtle px-4 py-3 text-label text-ink">
                Sisa kuota revisi pemesan: {kuotaRevisi}
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
                href={`/chat`}
              >
                Chat pemesan
              </Button>
            </>
          )}

          {isPengguna && (
            <Link
              href={`/pengguna/pelaporan?idPesanan=${encodeURIComponent(idPesanan)}`}
              className="text-label text-brand-text"
            >
              Ada masalah? Laporkan ke admin
            </Link>
          )}
        </section>
      </div>
    </div>
  );
}
