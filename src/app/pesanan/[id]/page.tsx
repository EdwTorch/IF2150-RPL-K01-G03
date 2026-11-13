"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Alert, Button, Textarea } from "@/components/elemen";
import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";
import { ApiError } from "@/lib/api";
import { sesiSaatIni, type UserSesi } from "@/lib/client/auth";
import { ambilDetailJasa, type JasaListing } from "@/lib/client/jasa";
import { ambilProfilPenyedia } from "@/lib/client/penyedia";
import { buatPesanan, KUOTA_REVISI_DEFAULT, MAKS_PESANAN_AKTIF } from "@/lib/client/pesanan";
import { formatRupiah } from "@/lib/format";

/**
 * I-09 Layar Pemesanan — C28 HalamanPemesanan
 * Atribut DPPL: idJasaDipilih, briefPemesanan
 * Operasi DPPL: tampilkanFormPemesanan(), inputBriefPemesanan(), tombolPesanTerklik()
 */

/** Rute layar Pembayaran (I-10) — samakan dengan yang mengerjakan I-10 */
const ruteBayar = (id_pesanan: string) => `/pesanan/checkout/${id_pesanan}`;
const POLA_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const LANGKAH = ["Isi pesanan", "Pembayaran", "Selesai"];

type StatusMuat = "memuat" | "siap" | "tidak_ditemukan" | "perlu_login" | "bukan_pengguna" | "gagal";

export default function HalamanPemesanan() {
  const { id: id_jasa_dipilih } = useParams<{ id: string }>(); // idJasaDipilih
  const router = useRouter();

  const [sesi, setSesi] = useState<UserSesi | null>(null);
  const [status_muat, setStatusMuat] = useState<StatusMuat>("memuat");
  const [jasa, setJasa] = useState<JasaListing | null>(null);
  const [nama_penyedia, setNamaPenyedia] = useState("");

  const [brief_pemesanan, setBriefPemesanan] = useState("");
  const [error_brief, setErrorBrief] = useState("");
  const [pesan_error, setPesanError] = useState("");
  const [sedang_mengirim, setSedangMengirim] = useState(false);

  /** tampilkanFormPemesanan() */
  useEffect(() => {
    let batal = false;
    (async () => {
      const user = await sesiSaatIni().then((r) => r.user).catch(() => null);
      if (batal) return;
      setSesi(user);
      if (!user) return setStatusMuat("perlu_login");
      if (!user.isPenggunaJasa) return setStatusMuat("bukan_pengguna");
      if (!POLA_UUID.test(id_jasa_dipilih)) return setStatusMuat("tidak_ditemukan");

      try {
        const data = await ambilDetailJasa(id_jasa_dipilih);
        if (batal) return;
        setJasa(data);
        setStatusMuat("siap");
        ambilProfilPenyedia(data.id_penyedia_jasa) // MOCK
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
  }, [id_jasa_dipilih]);

  /** tombolPesanTerklik() */
  async function tombolPesanTerklik(e: FormEvent) {
    e.preventDefault();
    setPesanError("");

    if (!brief_pemesanan.trim()) {
      setErrorBrief("Brief pemesanan wajib diisi");
      setPesanError("Brief pemesanan wajib diisi sebelum melanjutkan ke pembayaran.");
      return;
    }

    setSedangMengirim(true);
    try {
      const pesanan = await buatPesanan(id_jasa_dipilih, brief_pemesanan);
      router.push(ruteBayar(pesanan.id_pesanan)); // → I-10 Halaman Pembayaran
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) setPesanError("Sesi kamu sudah habis. Silakan login kembali.");
      else setPesanError(err instanceof ApiError ? err.message : "Pesanan gagal dibuat. Coba lagi.");
      setSedangMengirim(false);
    }
  }

  const peran = !sesi ? "TAMU" : sesi.isPenyediaJasa ? "PENYEDIA_JASA" : "PENGGUNA_JASA";

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      {status_muat !== "memuat" && <Navbar peran={peran} nama={sesi?.nama} />}

      <main className="mx-auto w-full max-w-[1440px] flex-1 px-20 pt-10 pb-20">
        {/* Judul + langkah */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-h2 text-ink">Pesan jasa</h1>
          <ol className="flex items-center gap-3">
            {LANGKAH.map((langkah, i) => (
              <li key={langkah} className="flex items-center gap-2">
                {i > 0 && <span className="h-px w-8 bg-line-strong" />}
                <span
                  className={`flex size-6 items-center justify-center rounded-full text-caption ${
                    i === 0 ? "bg-brand text-on-brand" : "border border-line-strong text-ink-muted"
                  }`}
                >
                  {i + 1}
                </span>
                <span className={`text-body-sm ${i === 0 ? "font-semibold text-ink" : "text-ink-muted"}`}>{langkah}</span>
              </li>
            ))}
          </ol>
        </div>

        {status_muat !== "siap" || !jasa ? (
          <section className="flex flex-col items-center gap-3 rounded-xl border border-line bg-surface px-6 py-16 text-center">
            {status_muat === "memuat" && <p className="text-body text-ink-muted">Memuat…</p>}
            {status_muat === "perlu_login" && (
              <>
                <p className="text-h4 text-ink">Masuk dulu untuk memesan jasa</p>
                <Button href="/login">Masuk</Button>
              </>
            )}
            {status_muat === "bukan_pengguna" && (
              <p className="text-h4 text-ink">Hanya akun Pengguna Jasa yang bisa memesan jasa.</p>
            )}
            {status_muat === "tidak_ditemukan" && (
              <>
                <p className="text-h4 text-ink">Jasa tidak ditemukan</p>
                <Button href="/pengguna/pencarian">Kembali ke pencarian</Button>
              </>
            )}
            {status_muat === "gagal" && <p className="text-h4 text-ink">Data jasa gagal dimuat. Coba muat ulang halaman.</p>}
          </section>
        ) : (
          <form onSubmit={tombolPesanTerklik} noValidate className="grid grid-cols-[minmax(0,1fr)_380px] items-start gap-6">
            {/* ================= Kiri ================= */}
            <div className="flex flex-col gap-6">
              {/* Kartu jasa */}
              <section className="flex items-center gap-4 rounded-xl border border-line bg-surface p-5">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Image src="/icons/gambar.svg" alt="" width={24} height={24} />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="text-h4 text-ink">{jasa.nama_jasa}</span>
                  <span className="text-caption text-ink-muted">
                    oleh {nama_penyedia || "Penyedia Jasa"} · {jasa.kategori} · {KUOTA_REVISI_DEFAULT}x revisi
                  </span>
                </div>
                <span className="text-label text-ink">{formatRupiah(jasa.harga)}</span>
              </section>

              {/* Brief */}
              <section className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-6">
                <div className="flex flex-col gap-2">
                  <h2 className="text-h4 text-ink">Ceritakan kebutuhanmu</h2>
                  <p className="text-body-sm text-ink-muted">
                    Brief yang jelas membantu penyedia memahami pekerjaan. Kamu tetap bisa diskusi lewat chat setelah memesan.
                  </p>
                </div>

                {pesan_error && <Alert tipe="error">{pesan_error}</Alert>}

                <Textarea
                  label="Brief pemesanan"
                  placeholder='Contoh: Logo untuk kedai kopi "Kopi Senja", nuansa hangat & sederhana, butuh versi warna dan hitam-putih.'
                  rows={5}
                  value={brief_pemesanan}
                  onChange={(e) => {
                    setBriefPemesanan(e.target.value); // inputBriefPemesanan()
                    if (error_brief) {
                      setErrorBrief("");
                      setPesanError("");
                    }
                  }}
                  error={error_brief}
                />
              </section>
            </div>

            {/* ================= Kanan: ringkasan ================= */}
            <aside className="sticky top-6 flex flex-col gap-4 rounded-xl border border-line bg-surface p-6">
              <h2 className="text-h4 text-ink">Ringkasan pesanan</h2>
              <dl className="flex flex-col gap-3 text-body-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-muted">Harga jasa</dt>
                  <dd className="font-semibold text-ink">{formatRupiah(jasa.harga)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-muted">Kuota revisi</dt>
                  <dd className="font-semibold text-ink">{KUOTA_REVISI_DEFAULT} kali</dd>
                </div>
              </dl>
              <div className="flex items-end justify-between border-t border-line pt-4">
                <span className="text-body-sm font-semibold text-ink">Total biaya</span>
                <span className="text-h3 text-ink">{formatRupiah(jasa.harga)}</span>
              </div>
              <p className="text-caption text-ink-muted">
                Kamu bisa punya maksimal {MAKS_PESANAN_AKTIF} pesanan aktif sekaligus.
              </p>
              <Button type="submit" fullWidth loading={sedang_mengirim}>
                Pesan &amp; lanjut bayar
              </Button>
            </aside>
          </form>
        )}
      </main>

      {status_muat !== "memuat" && <Footer peran={peran} />}
    </div>
  );
}