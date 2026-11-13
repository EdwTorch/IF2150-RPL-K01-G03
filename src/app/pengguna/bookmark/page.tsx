"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Alert, Button, CardJasa } from "@/components/elemen";
import { ApiError } from "@/lib/api";
import { ambilDaftarBookmark, hapusBookmark, type Bookmark } from "@/lib/client/bookmark";

/**
 * I-07 Layar Bookmark — C21 HalamanBookmark
 * Atribut DPPL: daftarJasaTersimpan, ikonBookmarkAktif, tombolHapusBookmark
 * Operasi DPPL: tampilkanDaftarTersimpan(), klikIkonBookmark(), klikIkonHapus(), tampilkanNotifikasi()
 * Sumber data: GET & DELETE /api/bookmark (backend asli)
 */

const RUTE_PENCARIAN = "/pengguna/pencarian";
const gambarPertama = (berkas: string[] = []) => berkas.find((u) => /\.(png|jpe?g|webp|gif)(\?|$)/i.test(u));

type Notifikasi = { tipe: "success" | "error"; pesan: string } | null;

export default function HalamanBookmark() {
  const [daftar_jasa_tersimpan, setDaftarJasaTersimpan] = useState<Bookmark[]>([]);
  const [sedang_memuat, setSedangMemuat] = useState(true);
  const [error_muat, setErrorMuat] = useState("");
  const [notifikasi, setNotifikasi] = useState<Notifikasi>(null);

  /** tampilkanDaftarTersimpan() → PengontrolBookmark.ambilDaftarBookmarkPengguna() */
  async function tampilkanDaftarTersimpan() {
    setSedangMemuat(true);
    setErrorMuat("");
    try {
      const daftar = await ambilDaftarBookmark();
      setDaftarJasaTersimpan(daftar.filter((b) => b.jasa)); // jasa nonaktif sudah disaring backend
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) setErrorMuat("Sesi kamu sudah habis. Silakan login kembali.");
      else setErrorMuat(err instanceof ApiError ? err.message : "Bookmark gagal dimuat. Coba lagi.");
    } finally {
      setSedangMemuat(false);
    }
  }

  useEffect(() => {
    tampilkanDaftarTersimpan();
  }, []);

  /** tampilkanNotifikasi() */
  function tampilkanNotifikasi(tipe: "success" | "error", pesan: string) {
    setNotifikasi({ tipe, pesan });
    setTimeout(() => setNotifikasi(null), 3000);
  }

  /**
   * klikIkonHapus() (O-03) dan klikIkonBookmark() (O-02) — keduanya membatalkan simpanan.
   * Kartu langsung hilang dari daftar; kalau server gagal, kartu dikembalikan.
   */
  async function hapusDariBookmark(bookmark: Bookmark) {
    const daftar_lama = daftar_jasa_tersimpan;
    setDaftarJasaTersimpan((lama) => lama.filter((b) => b.id_jasa !== bookmark.id_jasa));
    try {
      await hapusBookmark(bookmark.id_jasa);
      tampilkanNotifikasi("success", `"${bookmark.jasa?.nama_jasa ?? "Jasa"}" dihapus dari bookmark.`);
    } catch (err) {
      setDaftarJasaTersimpan(daftar_lama);
      tampilkanNotifikasi("error", err instanceof ApiError ? err.message : "Gagal menghapus bookmark. Coba lagi.");
    }
  }

  const jumlah = daftar_jasa_tersimpan.length;

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-8 bg-canvas px-20 pt-12 pb-20">
      {/* Notifikasi pojok kanan atas (Figma: varian "berhasil dihapus") */}
      {notifikasi && (
        <div className="fixed top-24 right-20 z-50 w-[420px]" role="status">
          <Alert tipe={notifikasi.tipe}>{notifikasi.pesan}</Alert>
        </div>
      )}

      <header className="flex flex-col gap-2">
        <h1 className="text-h2 text-ink">Bookmark</h1>
        {!sedang_memuat && !error_muat && jumlah > 0 && (
          <p className="text-body-sm text-ink-muted">{jumlah} jasa tersimpan</p>
        )}
      </header>

      {sedang_memuat ? (
        <p className="text-body text-ink-muted">Memuat bookmark…</p>
      ) : error_muat ? (
        <div className="flex max-w-[480px] flex-col items-start gap-3">
          <Alert tipe="error">{error_muat}</Alert>
          <Button variant="secondary" onClick={tampilkanDaftarTersimpan}>
            Coba lagi
          </Button>
        </div>
      ) : jumlah === 0 ? (
        /* Figma: varian "kosong" */
        <section className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-line-strong px-6 py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-xl bg-brand-subtle">
            <Image src="/icons/bookmark.svg" alt="" width={24} height={24} />
          </span>
          <h2 className="text-h4 text-ink">Belum ada jasa tersimpan</h2>
          <Button href={RUTE_PENCARIAN}>Cari jasa</Button>
        </section>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {daftar_jasa_tersimpan.map((b) => {
            const jasa = b.jasa!;
            return (
              <div key={b.id_bookmark} className="flex flex-col gap-3">
                <CardJasa
                  href={`/jasa/${jasa.id_jasa}`}
                  kategori={jasa.kategori}
                  judul={jasa.nama_jasa}
                  namaPenyedia="Penyedia Jasa" // backend belum mengirim nama penyedia
                  rating={Number(jasa.rating_rata_rata ?? 0)}
                  harga={Number(jasa.harga)}
                  gambarUrl={gambarPertama(jasa.berkas_pendukung)}
                  bookmarked
                  onBookmark={() => hapusDariBookmark(b)} // O-02 ikonBookmarkAktif
                />
                {/* O-03 tombolHapusBookmark */}
                <button
                  type="button"
                  onClick={() => hapusDariBookmark(b)}
                  className="flex w-fit items-center gap-[6px] text-body-sm font-semibold text-danger hover:underline"
                >
                  <Image src="/icons/hapus.svg" alt="" width={16} height={16} />
                  Hapus dari bookmark
                </button>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}