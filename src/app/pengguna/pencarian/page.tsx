"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import { Alert, Button, CardJasa, Chip, PageHero } from "@/components/elemen";
import { ApiError } from "@/lib/api";
import { ambilIdBookmark, toggleBookmark } from "@/lib/client/bookmark";
import { cariJasa, MIN_PANJANG_KEYWORD, type FilterPencarian, type JasaListing } from "@/lib/client/jasa";
import { parseRupiah } from "@/lib/format";

/**
 * I-05 Layar Pencarian — C15 HalamanPencarian + C16 HasilPencarian
 * Atribut DPPL: searchBar, filterHarga, filterDurasi, filterRating, tombolCari, pesanError, daftarListingJasa
 * Operasi DPPL: inputKataKunci(), klikCari(), tampilkanPesanError(), tampilkanDaftarHasil(), klikIkonBookmark()
 *
 * Sumber data:
 *   - Pencarian  → GET /api/jasa (backend asli)
 *   - Bookmark   → MOCK (backend belum ada)
 *   - Durasi     → belum ada kolom di tabel jasa, chip dinonaktifkan
 */

const PILIHAN_DURASI = ["≤ 1 hari", "≤ 3 hari", "≤ 7 hari", "Lebih lama"];
const PILIHAN_RATING = [
  { label: "★ 3+", nilai: 3 },
  { label: "★ 4+", nilai: 4 },
  { label: "★ 4.5+", nilai: 4.5 },
];

const formatRibuan = (angka: number) => (angka ? angka.toLocaleString("id-ID") : "");
const gambarPertama = (berkas: string[] = []) => berkas.find((u) => /\.(png|jpe?g|webp|gif)(\?|$)/i.test(u));
const kelasIsianHarga =
  "h-12 w-full min-w-0 rounded-field border border-line-input bg-white px-[14px] text-body-md text-ink placeholder:text-ink-placeholder";

export default function HalamanPencarian() {
  // ----- searchBar & filter -----
  const [search_bar, setSearchBar] = useState("");
  const [filter_harga_min, setFilterHargaMin] = useState(0);
  const [filter_harga_max, setFilterHargaMax] = useState(0);
  const [filter_rating, setFilterRating] = useState(0);

  // ----- hasil (C16) -----
  const [daftar_listing_jasa, setDaftarListingJasa] = useState<JasaListing[]>([]);
  const [sedang_memuat, setSedangMemuat] = useState(true);
  const [pesan_error, setPesanError] = useState("");
  const [jasa_tidak_ditemukan, setJasaTidakDitemukan] = useState(false);

  // ----- bookmark -----
  const [id_bookmark, setIdBookmark] = useState<Set<string>>(new Set());
  const [notifikasi, setNotifikasi] = useState("");

  /** tampilkanPesanError(pesan) */
  function tampilkanPesanError(pesan: string) {
    setPesanError(pesan);
  }

  /** klikCari() — `ubah` dipakai chip/reset supaya langsung mencari dengan nilai barunya */
  async function klikCari(ubah: Partial<FilterPencarian> = {}) {
    const filter: FilterPencarian = {
      keyword: search_bar,
      harga_min: filter_harga_min || undefined,
      harga_max: filter_harga_max || undefined,
      rating_min: filter_rating || undefined,
      ...ubah,
    };

    setPesanError("");
    setJasaTidakDitemukan(false);

    // Validasi klien (server juga memvalidasi — Algo-1701 baris 1)
    const kata = filter.keyword?.trim() ?? "";
    if (kata && kata.length < MIN_PANJANG_KEYWORD) {
      tampilkanPesanError(`Kata kunci minimal ${MIN_PANJANG_KEYWORD} karakter.`);
      return;
    }
    if (filter.harga_min && filter.harga_max && filter.harga_min > filter.harga_max) {
      tampilkanPesanError("Harga minimum tidak boleh lebih besar dari harga maksimum.");
      return;
    }

    setSedangMemuat(true);
    try {
      const hasil = await cariJasa(filter);
      setDaftarListingJasa(hasil); // tampilkanDaftarHasil()
      if (hasil.length === 0) {
        setJasaTidakDitemukan(true);
        tampilkanPesanError("Jasa tidak ditemukan.");
      }
    } catch (err) {
      setDaftarListingJasa([]);
      if (err instanceof ApiError && err.status === 401) tampilkanPesanError("Sesi kamu sudah habis. Silakan login kembali.");
      else tampilkanPesanError(err instanceof ApiError ? err.message : "Gagal memuat jasa. Coba lagi.");
    } finally {
      setSedangMemuat(false);
    }
  }

  // Saat halaman dibuka: katalog semua jasa aktif + daftar bookmark
  useEffect(() => {
    klikCari();
    ambilIdBookmark()
      .then((ids) => setIdBookmark(new Set(ids)))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function kirimPencarian(e: FormEvent) {
    e.preventDefault();
    klikCari();
  }

  function pilihRating(rating: number) {
    const baru = filter_rating === rating ? 0 : rating; // klik lagi = batal pilih
    setFilterRating(baru);
    klikCari({ rating_min: baru || undefined });
  }

  /** Reset — kosongkan semua filter (kata kunci tetap) */
  function resetFilter() {
    setFilterHargaMin(0);
    setFilterHargaMax(0);
    setFilterRating(0);
    klikCari({ harga_min: undefined, harga_max: undefined, rating_min: undefined });
  }

  /** klikIkonBookmark() → tambahDataBookmark() → tampilkanNotifikasi() */
/** klikIkonBookmark() → PengontrolBookmark.toggleBookmark() → tampilkanNotifikasi() */
async function klikIkonBookmark(id_jasa: string) {
  const sebelumnya = id_bookmark.has(id_jasa);
  const ubahTanda = (simpan: boolean) =>
    setIdBookmark((lama) => {
      const baru = new Set(lama);
      if (simpan) baru.add(id_jasa);
      else baru.delete(id_jasa);
      return baru;
    });

  ubahTanda(!sebelumnya); // ubah ikon dulu supaya terasa cepat
  try {
    const { tersimpan, pesan } = await toggleBookmark(id_jasa);
    ubahTanda(tersimpan); // samakan dengan hasil server
    tampilkanNotifikasi(pesan); // "Bookmark berhasil disimpan" / "Bookmark berhasil dihapus"
  } catch (err) {
    ubahTanda(sebelumnya); // gagal → kembalikan ikon
    tampilkanNotifikasi(err instanceof ApiError ? err.message : "Bookmark gagal disimpan. Coba lagi.");
  }
}

  function tampilkanNotifikasi(pesan: string) {
    setNotifikasi(pesan);
    setTimeout(() => setNotifikasi(""), 2500);
  }

  const search_bar_merah = !!pesan_error;

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-8 bg-canvas px-20 pt-12 pb-20">
      {/* ================= Hero + search bar (C15) ================= */}
      <PageHero judul="Cari jasa yang kamu butuhkan" className="[&>div]:max-w-none">
        {pesan_error && (
          <div className="max-w-[440px]">
            <Alert tipe="error">{pesan_error}</Alert>
          </div>
        )}
        <form onSubmit={kirimPencarian} className="flex gap-3" role="search">
          <label
            className={`flex h-14 w-full max-w-[600px] items-center gap-3 rounded-field border-2 bg-white px-5 ${
              search_bar_merah ? "border-danger" : "border-transparent"
            }`}
          >
            <Image src="/icons/search.svg" alt="" width={22} height={22} />
            <input
              type="search"
              value={search_bar}
              onChange={(e) => setSearchBar(e.target.value)}
              placeholder="Cari jasa, mis. desain logo"
              aria-label="Kata kunci pencarian"
              className="h-full flex-1 bg-transparent text-body text-ink outline-none placeholder:text-ink-placeholder"
            />
          </label>
          <Button type="submit" variant="accent" className="h-14 px-9" loading={sedang_memuat}>
            Cari
          </Button>
        </form>
      </PageHero>

      {/* ================= Filter ================= */}
      <section className="flex flex-col gap-5 rounded-xl border border-line bg-surface p-7">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] leading-tight font-bold text-ink">Filter hasil</h2>
          <button type="button" onClick={resetFilter} className="text-body-sm font-bold text-brand-text hover:underline">
            Reset
          </button>
        </div>

        <div className="grid grid-cols-3 gap-10">
          {/* filterHarga */}
          <div className="flex flex-col gap-2">
            <span className="text-label text-ink">Harga</span>
            <div className="flex items-center gap-3">
              <input
                inputMode="numeric"
                placeholder="Rp minimum"
                aria-label="Harga minimum"
                value={formatRibuan(filter_harga_min)}
                onChange={(e) => setFilterHargaMin(parseRupiah(e.target.value))}
                onKeyDown={(e) => e.key === "Enter" && klikCari()}
                onBlur={() => klikCari()}
                className={kelasIsianHarga}
              />
              <span className="font-bold text-ink-muted">–</span>
              <input
                inputMode="numeric"
                placeholder="Rp maksimum"
                aria-label="Harga maksimum"
                value={formatRibuan(filter_harga_max)}
                onChange={(e) => setFilterHargaMax(parseRupiah(e.target.value))}
                onKeyDown={(e) => e.key === "Enter" && klikCari()}
                onBlur={() => klikCari()}
                className={kelasIsianHarga}
              />
            </div>
          </div>

          {/* filterDurasi — BELUM didukung backend (tabel jasa belum punya kolom durasi) */}
          <div className="flex flex-col gap-2">
            <span className="text-label text-ink">Durasi pengerjaan</span>
            <div className="flex flex-wrap gap-2">
              {PILIHAN_DURASI.map((d) => (
                <Chip key={d} disabled title="Filter durasi belum tersedia" className="cursor-not-allowed opacity-50">
                  {d}
                </Chip>
              ))}
            </div>
          </div>

          {/* filterRating */}
          <div className="flex flex-col gap-2">
            <span className="text-label text-ink">Rating</span>
            <div className="flex flex-wrap gap-2">
              {PILIHAN_RATING.map((r) => (
                <Chip key={r.nilai} terpilih={filter_rating === r.nilai} onClick={() => pilihRating(r.nilai)}>
                  {r.label}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= Hasil (C16 HasilPencarian) ================= */}
      {notifikasi && (
        <div className="max-w-[440px]">
          <Alert tipe="success">{notifikasi}</Alert>
        </div>
      )}

      {sedang_memuat ? (
        <p className="text-body text-ink-muted">Memuat jasa…</p>
      ) : daftar_listing_jasa.length === 0 ? (
        <div className="flex flex-col items-center gap-1 rounded-xl border-2 border-dashed border-line-strong px-6 py-12 text-center">
          <p className="text-[18px] font-bold text-ink">{jasa_tidak_ditemukan ? "Jasa tidak ditemukan" : "Belum ada jasa"}</p>
          <p className="text-body-sm text-ink-muted">Coba kata kunci lain atau ubah filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {daftar_listing_jasa.map((jasa) => (
            <CardJasa
              key={jasa.id_jasa}
              href={`/jasa/${jasa.id_jasa}`}
              kategori={jasa.kategori}
              judul={jasa.nama_jasa}
              namaPenyedia="Penyedia Jasa" // backend belum mengirim nama penyedia
              rating={jasa.rating_rata_rata}
              harga={jasa.harga}
              gambarUrl={gambarPertama(jasa.berkas_pendukung)}
              bookmarked={id_bookmark.has(jasa.id_jasa)}
              onBookmark={() => klikIkonBookmark(jasa.id_jasa)}
            />
          ))}
        </div>
      )}
    </main>
  );
}