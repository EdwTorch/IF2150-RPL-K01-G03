import Image from "next/image";
import Link from "next/link";

type Peran = "TAMU" | "PENGGUNA_JASA" | "PENYEDIA_JASA" | "ADMIN";

/**
 * Footer — Figma "Footer" (31:212).
 * Tampil untuk Pengguna Jasa dan Penyedia Jasa.
 * Tidak tampil untuk Tamu dan Admin.
 */
const KOLOM = [
  {
    judul: "Pengguna Jasa",
    tautan: [
      { label: "Cari Jasa", href: "/pengguna/pencarian" },
      { label: "Bookmark", href: "/pengguna/bookmark" },
      { label: "Pesanan Saya", href: "/pengguna/riwayat-transaksi" },
    ],
  },
  {
    judul: "Penyedia Jasa",
    tautan: [
      { label: "Tawarkan Jasa", href: "/penyedia/upload-jasa" },
      { label: "Pesanan Masuk", href: "/penyedia/pesanan" },
      { label: "Portofolio", href: "/penyedia/portofolio" },
    ],
  },
   
];



export default function Footer({
  peran,
  deskripsi = "Platform untuk mencari, membandingkan, dan memesan jasa digital dari penyedia lokal.",
}: {
  peran: Peran;
  deskripsi?: string;
}) {
  // Footer tidak ditampilkan untuk tamu dan admin.
  if (peran === "TAMU" || peran === "ADMIN") return null;

  // Menampilkan kolom sesuai peran.
  const kolomTampil =
    peran === "PENGGUNA_JASA"
      ? KOLOM.filter((kolom) => kolom.judul !== "Penyedia Jasa")
      : KOLOM.filter((kolom) => kolom.judul !== "Pengguna Jasa");

  return (
    <footer className="w-full border-t border-line bg-surface">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-20 pt-16 pb-8">
        {/* Bagian atas: brand + kolom tautan */}
        <div className="flex w-full items-start gap-16">
          <div className="flex w-[400px] shrink-0 flex-col gap-5">
            <Link
              href="/"
              className="flex items-center gap-[10px]"
              aria-label="CariJasa, ke beranda"
            >
              <Image src="/icons/logo-cj.svg" alt="" width={36} height={36} />
              <span className="text-[22px] leading-[1.35] font-semibold tracking-[-0.55px] text-ink">
                CariJasa
              </span>
            </Link>

            <p className="text-body-sm text-ink-muted">{deskripsi}</p>
          </div>

          {kolomTampil.map((kolom) => (
            <nav
              key={kolom.judul}
              aria-label={kolom.judul}
              className="flex min-w-0 flex-1 flex-col gap-[14px]"
            >
              <h2 className="text-h4 text-ink">{kolom.judul}</h2>

              {kolom.tautan.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="text-body-sm whitespace-nowrap text-ink-muted hover:text-ink"
                >
                  {t.label}
                </Link>
              ))}
            </nav>
          ))}
        </div>

        {/* Bagian bawah: ikon sosial media */}
        
      </div>
    </footer>
  );
}