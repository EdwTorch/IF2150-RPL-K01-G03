"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert, Button, LogoMetode, OptionCard } from "@/components/elemen";
import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";
import { ApiError } from "@/lib/api";
import { sesiSaatIni, type UserSesi } from "@/lib/client/auth";
import { ambilProfilPenyedia } from "@/lib/client/penyedia";
import { ambilDetailPesanan, KUOTA_REVISI_DEFAULT, type Pesanan } from "@/lib/client/pesanan";
import { ambilDaftarMetode, bayarPesanan, type MetodePembayaran } from "@/lib/client/transaksi";
import { formatRupiah } from "@/lib/format";

/**
 * I-10 Layar Pembayaran — C29 HalamanPembayaran
 * Rute: /pesanan/checkout/[id]  →  [id] = id_pesanan
 * Atribut DPPL: totalHarga, idMetodePembayaran
 * Operasi DPPL: tampilkanPilihanPembayaran(), tampilkanRincianPembayaran(), tombolBayarTerklik(), tampilkanNotifikasiBerhasil()
 */

const RUTE_RIWAYAT = "/pengguna/riwayat-transaksi";
const LANGKAH = ["Isi pesanan", "Pembayaran", "Selesai"];
const POLA_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type StatusMuat = "memuat" | "siap" | "sudah_dibayar" | "tidak_ditemukan" | "perlu_login" | "gagal";

/** VA_BCA → "VA", EWALLET_GOPAY → "EW", QRIS → "QR" */
const jenisMetode = (id: string) => (id.startsWith("VA") ? "VA" : id.startsWith("EWALLET") ? "EW" : "QR");
const deskripsiMetode = (id: string) =>
  jenisMetode(id) === "VA" ? "Bayar lewat transfer ke nomor virtual account" : "Bayar lewat aplikasi dompet digital atau QRIS";

export default function HalamanPembayaran() {
  const { id: id_pesanan } = useParams<{ id: string }>();
  const router = useRouter();

  const [sesi, setSesi] = useState<UserSesi | null>(null);
  const [status_muat, setStatusMuat] = useState<StatusMuat>("memuat");
  const [pesanan, setPesanan] = useState<Pesanan | null>(null);
  const [daftar_metode, setDaftarMetode] = useState<MetodePembayaran[]>([]);
  const [nama_penyedia, setNamaPenyedia] = useState("");

  const [id_metode_pembayaran, setIdMetodePembayaran] = useState(""); // idMetodePembayaran
  const [pesan_error, setPesanError] = useState("");
  const [gagal_bayar, setGagalBayar] = useState(false);
  const [sedang_membayar, setSedangMembayar] = useState(false);
  const [berhasil, setBerhasil] = useState(false);
  const [tersalin, setTersalin] = useState(false);

  const metode_terpilih = daftar_metode.find((m) => m.id_metode === id_metode_pembayaran);
  const total_harga = pesanan?.total_biaya ?? 0; // totalHarga

  /* ---------- tampilkanPilihanPembayaran() ---------- */
  useEffect(() => {
    let batal = false;
    (async () => {
      const user = await sesiSaatIni().then((r) => r.user).catch(() => null);
      if (batal) return;
      setSesi(user);
      if (!user) return setStatusMuat("perlu_login");
      if (!POLA_UUID.test(id_pesanan)) return setStatusMuat("tidak_ditemukan");

      try {
        const [data_pesanan, metode] = await Promise.all([ambilDetailPesanan(id_pesanan), ambilDaftarMetode()]);
        if (batal) return;
        setPesanan(data_pesanan);
        setDaftarMetode(metode);
        setStatusMuat(data_pesanan.status_pembayaran === "LUNAS" ? "sudah_dibayar" : "siap");
        ambilProfilPenyedia(data_pesanan.id_penyedia_jasa) // MOCK
          .then((p) => !batal && setNamaPenyedia(p.nama))
          .catch(() => {});
      } catch (err) {
        if (batal) return;
        setStatusMuat(err instanceof ApiError && err.status === 404 ? "tidak_ditemukan" : "gagal");
      }
    })();
    return () => {
      batal = true;
    };
  }, [id_pesanan]);

  /* ---------- tampilkanNotifikasiBerhasil() → ke riwayat setelah 3 detik ---------- */
  useEffect(() => {
    if (!berhasil) return;
    const t = setTimeout(() => router.push(RUTE_RIWAYAT), 3000);
    return () => clearTimeout(t);
  }, [berhasil, router]);

  async function salinNomor(nomor: string) {
    try {
      await navigator.clipboard.writeText(nomor);
      setTersalin(true);
      setTimeout(() => setTersalin(false), 2000);
    } catch {
      /* clipboard diblokir browser — abaikan */
    }
  }

  /** tombolBayarTerklik() */
  async function tombolBayarTerklik() {
    if (!pesanan || !id_metode_pembayaran) return;
    setPesanError("");
    setGagalBayar(false);
    setSedangMembayar(true);
    try {
      await bayarPesanan(pesanan.id_pesanan, id_metode_pembayaran, pesanan.total_biaya);
      setBerhasil(true);
    } catch (err) {
      setGagalBayar(true); // tampilkanRincianPembayaran() + pesan gagal
      setPesanError(
        err instanceof ApiError && err.status !== 500
          ? err.message
          : "Pembayaran tidak berhasil. Periksa kembali rincian lalu coba bayar lagi.",
      );
    } finally {
      setSedangMembayar(false);
    }
  }

  const peran = !sesi ? "TAMU" : sesi.isPenyediaJasa ? "PENYEDIA_JASA" : "PENGGUNA_JASA";
  const jasa = pesanan?.jasa;

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      {status_muat !== "memuat" && <Navbar peran={peran} nama={sesi?.nama} />}

      <main className="mx-auto w-full max-w-[1440px] flex-1 px-20 pt-8 pb-20">
        {/* Breadcrumb */}
        <nav className="mb-2 flex items-center gap-2 text-body-sm text-ink-muted" aria-label="Breadcrumb">
          <Link href="/pengguna/cari" className="hover:underline">Cari Jasa</Link>
          {jasa && (
            <>
              <span>/</span>
              <Link href={`/jasa/${jasa.id_jasa}`} className="hover:underline">{jasa.nama_jasa}</Link>
            </>
          )}
          <span>/</span>
          <span className="font-semibold text-brand-text">Pembayaran</span>
        </nav>

        {/* Judul + langkah */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-h2 text-ink">Pembayaran</h1>
          <ol className="flex items-center gap-3">
            {LANGKAH.map((langkah, i) => {
              const aktif = berhasil ? i <= 2 : i <= 1;
              return (
                <li key={langkah} className="flex items-center gap-2">
                  {i > 0 && <span className={`h-px w-8 ${aktif ? "bg-brand" : "bg-line-strong"}`} />}
                  <span
                    className={`flex size-6 items-center justify-center rounded-full text-caption ${
                      aktif ? "bg-brand text-on-brand" : "border border-line-strong text-ink-muted"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className={`text-body-sm ${aktif ? "font-semibold text-ink" : "text-ink-muted"}`}>{langkah}</span>
                </li>
              );
            })}
          </ol>
        </div>

        {/* ---------- Tampilan selain "siap" ---------- */}
        {status_muat !== "siap" || !pesanan ? (
          <section className="flex flex-col items-center gap-3 rounded-xl border border-line bg-surface px-6 py-16 text-center">
            {status_muat === "memuat" && <p className="text-body text-ink-muted">Memuat…</p>}
            {status_muat === "perlu_login" && (
              <>
                <p className="text-h4 text-ink">Masuk dulu untuk melanjutkan pembayaran</p>
                <Button href="/login">Masuk</Button>
              </>
            )}
            {status_muat === "sudah_dibayar" && (
              <>
                <p className="text-h4 text-ink">Pesanan ini sudah dibayar</p>
                <Button href={RUTE_RIWAYAT}>Lihat riwayat transaksi</Button>
              </>
            )}
            {status_muat === "tidak_ditemukan" && (
              <>
                <p className="text-h4 text-ink">Pesanan tidak ditemukan</p>
                <Button href="/pengguna/cari">Kembali ke pencarian</Button>
              </>
            )}
            {status_muat === "gagal" && <p className="text-h4 text-ink">Data pembayaran gagal dimuat. Coba muat ulang halaman.</p>}
          </section>
        ) : berhasil ? (
          /* ---------- tampilkanNotifikasiBerhasil() ---------- */
          <section className="flex flex-col items-center gap-3 rounded-xl border border-line bg-surface px-6 py-16 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-success-subtle">
              <Image src="/icons/alert-success.svg" alt="" width={28} height={28} />
            </span>
            <h2 className="text-h3 text-ink">Pembayaran berhasil!</h2>
            <p className="text-body text-ink-muted">
              Pesananmu sudah diteruskan ke penyedia jasa. Kamu akan diarahkan ke riwayat transaksi.
            </p>
            <Button href={RUTE_RIWAYAT}>Lihat riwayat transaksi</Button>
          </section>
        ) : (
          <div className="grid grid-cols-[minmax(0,1fr)_380px] items-start gap-6">
            {/* ================= Kiri ================= */}
            <div className="flex flex-col gap-6">
              {gagal_bayar && <Alert tipe="error">{pesan_error}</Alert>}

              {/* O-01 Option Card metode */}
              <section className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-6" aria-label="Pilih metode pembayaran">
                <h2 className="text-h4 text-ink">Pilih metode pembayaran</h2>
                {daftar_metode.length === 0 ? (
                  <p className="text-body-sm text-ink-muted">Metode pembayaran belum tersedia.</p>
                ) : (
                  daftar_metode.map((m) => (
                    <OptionCard
                      key={m.id_metode}
                      gaya="radio"
                      name="metode"
                      value={m.id_metode}
                      terpilih={id_metode_pembayaran === m.id_metode}
                      onPilih={() => {
                        setIdMetodePembayaran(m.id_metode); // pilihMetodePembayaran()
                        setGagalBayar(false);
                      }}
                      judul={m.nama_metode}
                      deskripsi={deskripsiMetode(m.id_metode)}
                      awalan={<LogoMetode teks={jenisMetode(m.id_metode)} />}
                    />
                  ))
                )}
              </section>

              {/* tampilkanRincianPembayaran() */}
              {metode_terpilih && (
                <section className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-6">
                  <h2 className="text-h4 text-ink">Rincian pembayaran</h2>
                  {metode_terpilih.nomor_rekening_va && (
                    <div className="flex items-center justify-between rounded-lg bg-muted px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-caption text-ink-muted">
                          {jenisMetode(metode_terpilih.id_metode) === "VA" ? "Nomor virtual account" : "Nomor tujuan"} ·{" "}
                          {metode_terpilih.nama_metode}
                        </span>
                        <span className="text-h3 tracking-wide text-ink">{metode_terpilih.nomor_rekening_va}</span>
                      </div>
                      {/* O-02 Salin */}
                      <button
                        type="button"
                        onClick={() => salinNomor(metode_terpilih.nomor_rekening_va!)}
                        className="text-label text-brand-text hover:underline"
                      >
                        {tersalin ? "Tersalin" : "Salin"}
                      </button>
                    </div>
                  )}
                  <p className="text-body-sm text-ink-muted">
                    {jenisMetode(metode_terpilih.id_metode) === "VA"
                      ? `1. Buka aplikasi atau ATM ${metode_terpilih.nama_metode.replace(" Virtual Account", "")}   2. Pilih transfer ke virtual account   3. Masukkan nomor VA dan nominal yang sama persis`
                      : "1. Buka aplikasi dompet digital   2. Pindai QRIS atau masukkan nomor tujuan   3. Bayar sesuai nominal yang sama persis"}
                  </p>
                  <p className="text-caption text-ink-muted">
                    Ini pembayaran simulasi untuk keperluan tugas. Tidak ada uang sungguhan yang ditransfer.
                  </p>
                </section>
              )}
            </div>

            {/* ================= Kanan: ringkasan ================= */}
            <aside className="sticky top-6 flex flex-col gap-4 rounded-xl border border-line bg-surface p-6">
              <div className="flex gap-3">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Image src="/icons/gambar.svg" alt="" width={22} height={22} />
                </span>
                <div className="flex flex-col gap-1">
                  <span className="text-h4 text-ink">{jasa?.nama_jasa ?? "Pesanan"}</span>
                  <span className="text-caption text-ink-muted">
                    oleh {nama_penyedia || "Penyedia Jasa"}
                    {jasa && ` · ${jasa.kategori}`} · {KUOTA_REVISI_DEFAULT}x revisi
                  </span>
                </div>
              </div>

              <dl className="flex flex-col gap-3 border-t border-line pt-4 text-body-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-muted">Harga jasa</dt>
                  <dd className="font-semibold text-ink">{formatRupiah(total_harga)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-muted">Metode</dt>
                  <dd className="font-semibold text-ink">{metode_terpilih?.nama_metode ?? "—"}</dd>
                </div>
              </dl>

              <div className="flex items-end justify-between border-t border-line pt-4">
                <span className="text-body-sm font-semibold text-ink">Total harga</span>
                <span className="text-h3 text-ink">{formatRupiah(total_harga)}</span>
              </div>
              <p className="text-caption text-ink-muted">
                Dana ditahan aman dan baru diteruskan ke penyedia setelah kamu mengonfirmasi hasil pekerjaan.
              </p>

              {/* O-03 Bayar sekarang */}
              <Button fullWidth onClick={tombolBayarTerklik} disabled={!id_metode_pembayaran} loading={sedang_membayar}>
                {gagal_bayar ? "Coba bayar lagi" : "Bayar sekarang"}
              </Button>
            </aside>
          </div>
        )}
      </main>

      {status_muat !== "memuat" && <Footer peran={peran} />}
    </div>
  );
}