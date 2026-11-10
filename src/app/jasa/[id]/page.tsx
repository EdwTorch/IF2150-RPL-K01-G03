"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert, Button } from "@/components/elemen";
import Footer from "@/components/ui/footer";
import Navbar, { type Peran } from "@/components/ui/navbar";
import { ApiError } from "@/lib/api";
import { sesiSaatIni, type UserSesi } from "@/lib/client/auth";
import { ambilIdBookmark, toggleBookmark } from "@/lib/client/bookmark";
import { ambilDetailJasa, type JasaListing } from "@/lib/client/jasa";
import { ambilProfilPenyedia, type ProfilPenyedia } from "@/lib/client/penyedia";
import { ambilUlasanJasa, type UlasanJasa } from "@/lib/client/ulasan";
import { formatRupiah } from "@/lib/format";

/**
 * I-06 Layar Detail Jasa — C19 HalamanDetailJasa
 * Atribut DPPL: tampilanDeskripsi, infoProfilPenyedia, tampilanRiwayatUlasan, tampilanHarga, ikonBookmark
 * Operasi DPPL: tampilkanDetailJasa(), klikIkonBookmark(), tampilkanNotifikasi()
 */

const RUTE_PENCARIAN = "/pengguna/pencarian";
const JUMLAH_ULASAN_AWAL = 3;

type StatusMuat = "memuat" | "ada" | "tidak_ditemukan" | "perlu_login" | "gagal";

const peranDari = (user: UserSesi | null): Peran => {
  if (!user) return "TAMU";
  if (user.role === "ADMIN") return "ADMIN";
  if (user.isPenyediaJasa) return "PENYEDIA_JASA";
  return "PENGGUNA_JASA";
};
const daftarGambar = (berkas: string[] = []) => berkas.filter((u) => /\.(png|jpe?g|webp|gif)(\?|$)/i.test(u));

export default function HalamanDetailJasa() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [sesi, setSesi] = useState<UserSesi | null>(null);
  const [status_muat, setStatusMuat] = useState<StatusMuat>("memuat");
  const [jasa, setJasa] = useState<JasaListing | null>(null);
  const [gambar_aktif, setGambarAktif] = useState(0);

  const [penyedia, setPenyedia] = useState<ProfilPenyedia | null>(null);
  const [ulasan, setUlasan] = useState<{ ulasan: UlasanJasa[]; total: number }>({ ulasan: [], total: 0 });
  const [tampil_semua_ulasan, setTampilSemuaUlasan] = useState(false);

  const [bookmarked, setBookmarked] = useState(false);
  const [notifikasi, setNotifikasi] = useState<{ tipe: "error" | "success"; pesan: string } | null>(null);

  const peran = peranDari(sesi);

  /** tampilkanDetailJasa() */
  useEffect(() => {
    let batal = false;

    async function muat() {
      const user = await sesiSaatIni().then((r) => r.user).catch(() => null);
      if (batal) return;
      setSesi(user);

      try {
        const data = await ambilDetailJasa(id);
        if (batal) return;
        setJasa(data);
        setStatusMuat("ada");

        // Bagian pelengkap — kalau gagal, halaman tetap tampil
        ambilUlasanJasa(id).then((u) => !batal && setUlasan(u)).catch(() => {});
        ambilProfilPenyedia(data.id_penyedia_jasa).then((p) => !batal && setPenyedia(p)).catch(() => {});
        if (user) ambilIdBookmark().then((ids) => !batal && setBookmarked(ids.includes(id))).catch(() => {});
      } catch (err) {
        if (batal) return;
        if (err instanceof ApiError && err.status === 404) setStatusMuat("tidak_ditemukan");
        else if (err instanceof ApiError && err.status === 401) setStatusMuat("perlu_login");
        else setStatusMuat("gagal");
      }
    }

    muat();
    return () => {
      batal = true;
    };
  }, [id]);

  function tampilkanNotifikasi(tipe: "error" | "success", pesan: string) {
    setNotifikasi({ tipe, pesan });
    setTimeout(() => setNotifikasi(null), 3000);
  }

  /** klikIkonBookmark() */
  async function klikIkonBookmark() {
    if (!sesi) {
      tampilkanNotifikasi("error", "Masuk atau daftar dulu untuk menyimpan jasa ke bookmark.");
      return;
    }
    const sebelumnya = bookmarked;
    setBookmarked(!sebelumnya);
    try {
      const { tersimpan, pesan } = await toggleBookmark(id);
      setBookmarked(tersimpan);
      tampilkanNotifikasi("success", pesan);
    } catch (err) {
      setBookmarked(sebelumnya);
      tampilkanNotifikasi("error", err instanceof ApiError ? err.message : "Bookmark gagal disimpan. Coba lagi.");
    }
  }

  /** O-03 Pesan Jasa → I-09 Halaman Pemesanan */
  function klikPesan() {
    if (!sesi) return router.push("/login");
    router.push(`/pesanan/checkout/${id}`);
  }

  /* ---------------- Tampilan selain "ada" ---------------- */
  if (status_muat !== "ada" || !jasa) {
    const isi: Record<Exclude<StatusMuat, "ada">, { judul: string; teks: string; tombol: [string, string] }> = {
      memuat: { judul: "Memuat jasa…", teks: "", tombol: ["", ""] },
      tidak_ditemukan: {
        judul: "Jasa tidak ditemukan",
        teks: "Jasa ini mungkin sudah dihapus atau sedang tidak aktif oleh penyedianya.",
        tombol: ["Kembali ke pencarian", RUTE_PENCARIAN],
      },
      perlu_login: {
        judul: "Masuk untuk melihat jasa",
        teks: "Kamu perlu masuk atau mendaftar dulu untuk melihat detail jasa ini.",
        tombol: ["Masuk", "/login"],
      },
      gagal: {
        judul: "Jasa gagal dimuat",
        teks: "Server tidak merespons. Periksa koneksi internet kamu dan coba lagi.",
        tombol: ["Kembali ke pencarian", RUTE_PENCARIAN],
      },
    };
    const k = isi[status_muat === "ada" ? "memuat" : status_muat];

    return (
      <div className="flex min-h-screen flex-col bg-canvas">
        <Navbar peran={peran} nama={sesi?.nama} />
        <main className="mx-auto flex w-full max-w-[1440px] flex-1 px-20 py-8">
          <section className="flex w-full flex-col items-center gap-3 rounded-xl border border-line bg-surface px-6 py-16 text-center">
            <h1 className="text-h3 text-ink">{k.judul}</h1>
            {k.teks && <p className="text-body text-ink-muted">{k.teks}</p>}
            {k.tombol[0] && (
              <Button href={k.tombol[1]} className="mt-3">
                {k.tombol[0]}
              </Button>
            )}
          </section>
        </main>
        <Footer peran={peran} />
      </div>
    );
  }

  /* ---------------- Tampilan utama ---------------- */
  const gambar = daftarGambar(jasa.berkas_pendukung);
  const ulasan_tampil = tampil_semua_ulasan ? ulasan.ulasan : ulasan.ulasan.slice(0, JUMLAH_ULASAN_AWAL);
  const bisa_memesan = peran === "PENGGUNA_JASA" || peran === "TAMU";

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar peran={peran} nama={sesi?.nama} />

      <main className="mx-auto w-full max-w-[1440px] flex-1 px-20 py-8">
        <div className="grid grid-cols-[minmax(0,1fr)_380px] items-start gap-8">
          {/* ================= Kolom kiri ================= */}
          <div className="flex flex-col gap-6">
            {/* O-01 Galeri */}
            <div className="flex flex-col gap-3">
              <div className="flex h-[380px] items-center justify-center overflow-hidden rounded-xl bg-muted">
                {gambar[gambar_aktif] ? (
                  // eslint-disable-next-line @next/next/no-img-element -- URL storage bisa dari domain luar
                  <img src={gambar[gambar_aktif]} alt={jasa.nama_jasa} className="h-full w-full object-cover" />
                ) : (
                  <Image src="/icons/gambar.svg" alt="" width={40} height={40} />
                )}
              </div>
              {gambar.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {gambar.slice(0, 4).map((url, i) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => setGambarAktif(i)}
                      aria-label={`Tampilkan gambar ${i + 1}`}
                      className={`h-[84px] overflow-hidden rounded-xl border-2 bg-surface ${
                        gambar_aktif === i ? "border-brand" : "border-transparent"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Judul */}
            <div className="flex flex-col gap-[10px]">
              <span className="w-fit rounded-full bg-accent-subtle px-[10px] py-1 text-caption text-on-accent">{jasa.kategori}</span>
              <h1 className="text-h2 text-ink">{jasa.nama_jasa}</h1>
              <div className="flex items-center gap-[6px]">
                <Image src="/icons/star.svg" alt="" width={18} height={18} />
                <span className="text-label text-ink">
                  {(jasa.rating_rata_rata ?? 0).toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                </span>
                <span className="text-body-sm text-ink-muted">· {ulasan.total} ulasan</span>
              </div>
            </div>

            {/* tampilanDeskripsi */}
            <section className="flex flex-col gap-[10px] rounded-xl border border-line bg-surface p-6">
              <h2 className="text-h4 text-ink">Deskripsi</h2>
              <p className="text-body whitespace-pre-line text-ink-muted">{jasa.deskripsi}</p>
            </section>

            {/* infoProfilPenyedia — MOCK */}
            <section className="flex flex-col gap-[14px] rounded-xl border border-line bg-surface p-6">
              <h2 className="text-h4 text-ink">Tentang penyedia</h2>
              <div className="flex items-center gap-[14px]">
                <Image src="/icons/avatar.svg" alt="" width={52} height={52} className="rounded-full" />
                <div className="flex flex-col gap-[2px]">
                  <span className="text-label text-ink">{penyedia?.nama ?? "Penyedia Jasa"}</span>
                  <span className="text-caption text-ink-muted">Penyedia Jasa · {jasa.kategori}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {(["Pengalaman", "Prestasi"] as const).map((judul) => {
                  const isi = judul === "Pengalaman" ? penyedia?.pengalaman : penyedia?.prestasi;
                  return (
                    <div key={judul} className="flex flex-col gap-[6px] rounded-lg bg-canvas px-4 py-[14px]">
                      <span className="text-label text-ink">{judul}</span>
                      {isi?.length ? (
                        <ul className="flex flex-col gap-1 text-body-sm text-ink-muted">
                          {isi.map((baris) => (
                            <li key={baris}>• {baris}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-body-sm text-ink-muted">Belum diisi</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* tampilanRiwayatUlasan */}
            <section className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-h4 text-ink">Ulasan pengguna</h2>
                {ulasan.ulasan.length > JUMLAH_ULASAN_AWAL && (
                  <button
                    type="button"
                    onClick={() => setTampilSemuaUlasan((v) => !v)}
                    className="text-label text-brand-text hover:underline"
                  >
                    {tampil_semua_ulasan ? "Tampilkan lebih sedikit" : "Lihat semua"}
                  </button>
                )}
              </div>

              {ulasan.ulasan.length === 0 ? (
                <p className="text-body-sm text-ink-muted">Belum ada ulasan untuk jasa ini.</p>
              ) : (
                ulasan_tampil.map((u) => (
                  <div key={u.id_ulasan} className="flex flex-col gap-2 border-t border-line pt-[14px]">
                    <div className="flex items-center gap-[10px]">
                      <Image src="/icons/avatar-kecil.svg" alt="" width={32} height={32} className="rounded-full" />
                      <span className="text-label text-ink">{u.nama_pengguna ?? "Pengguna Jasa"}</span>
                      <span className="flex gap-[2px]" aria-label={`Rating ${u.rating} dari 5`}>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Image key={n} src={n <= u.rating ? "/icons/star.svg" : "/icons/star-outline.svg"} alt="" width={14} height={14} />
                        ))}
                      </span>
                    </div>
                    {u.komentar && <p className="text-body-sm text-ink-muted">{u.komentar}</p>}
                  </div>
                ))
              )}
            </section>
          </div>

          {/* ================= Panel harga (kanan, menempel saat scroll) ================= */}
          <aside className="sticky top-6 flex flex-col gap-4 rounded-xl border border-line bg-surface p-6">
            {notifikasi && <Alert tipe={notifikasi.tipe}>{notifikasi.pesan}</Alert>}

            <span className="text-body-sm text-ink-muted">Harga mulai</span>
            <span className="text-h2 text-ink">{formatRupiah(jasa.harga)}</span>
            <ul className="flex flex-col gap-2 text-body-sm text-ink">
              <li>✓ Pembayaran ditahan sampai kamu konfirmasi</li>
            </ul>

            {bisa_memesan && (
              <>
                <Button fullWidth onClick={klikPesan}>
                  Pesan Jasa
                </Button>
                <div className="flex gap-[10px]">
                  <Button variant="secondary" className="flex-1" disabled title="Chat tersedia setelah fitur chat selesai">
                    Chat Penyedia
                  </Button>
                  <button
                    type="button"
                    onClick={klikIkonBookmark}
                    aria-pressed={bookmarked}
                    aria-label={bookmarked ? "Hapus dari bookmark" : "Simpan ke bookmark"}
                    className={`flex size-12 shrink-0 items-center justify-center rounded-md border-[1.5px] ${
                      bookmarked ? "border-brand bg-brand-subtle" : "border-line-input bg-white hover:bg-canvas"
                    }`}
                  >
                    <Image src={bookmarked ? "/icons/card-bookmark-aktif.svg" : "/icons/bookmark.svg"} alt="" width={22} height={22} />
                  </button>
                </div>
              </>
            )}

            {peran === "PENYEDIA_JASA" && sesi?.id === jasa.id_penyedia_jasa && (
              <p className="text-body-sm text-ink-muted">Ini jasa milikmu.</p>
            )}
          </aside>
        </div>
      </main>

      <Footer peran={peran} />
    </div>
  );
}