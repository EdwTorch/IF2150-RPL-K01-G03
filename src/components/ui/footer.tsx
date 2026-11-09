import Image from "next/image";
import Link from "next/link";

/**
 * Footer — Figma "Footer" (31:212). Tampil di semua halaman kecuali halaman admin.
 */
const KOLOM = [
  {
    judul: "Pengguna Jasa",
    tautan: [
      { label: "Cari Jasa", href: "/cari" },
      { label: "Bookmark", href: "/bookmark" },
      { label: "Pesanan Saya", href: "/riwayat" },
    ],
  },
  {
    judul: "Penyedia Jasa",
    tautan: [
      { label: "Tawarkan Jasa", href: "/jasa/baru" },
      { label: "Pesanan Masuk", href: "/pesanan-masuk" },
      { label: "Portofolio", href: "/portofolio" },
    ],
  },
  {
    judul: "CariJasa",
    tautan: [
      { label: "Tentang Kami", href: "/tentang" },
      { label: "Bantuan", href: "/bantuan" },
      { label: "Syarat & Ketentuan", href: "/syarat" },
      { label: "Kebijakan Privasi", href: "/privasi" },
    ],
  },
];

const SOSIAL = [
  { label: "Instagram", ikon: "/icons/instagram.svg", href: "#" },
  { label: "LinkedIn", ikon: "/icons/linkedin.svg", href: "#" },
  { label: "Email", ikon: "/icons/email.svg", href: "mailto:halo@carijasa.test" },
];

export default function Footer({
  deskripsi = "Platform untuk mencari, membandingkan, dan memesan jasa digital dari penyedia lokal.",
}: {
  deskripsi?: string;
}) {
  return (
    <footer className="w-full border-t border-line bg-surface">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-20 pt-16 pb-8">
        {/* Bagian atas: brand + 3 kolom tautan */}
        <div className="flex w-full items-start gap-16">
          <div className="flex w-[400px] shrink-0 flex-col gap-5">
            <Link href="/" className="flex items-center gap-[10px]" aria-label="CariJasa, ke beranda">
              <Image src="/icons/logo-cj.svg" alt="" width={36} height={36} />
              <span className="text-[22px] leading-[1.35] font-semibold tracking-[-0.55px] text-ink">CariJasa</span>
            </Link>
            <p className="text-body-sm text-ink-muted">{deskripsi}</p>
          </div>

          {KOLOM.map((kolom) => (
            <nav key={kolom.judul} aria-label={kolom.judul} className="flex min-w-0 flex-1 flex-col gap-[14px]">
              <h2 className="text-h4 text-ink">{kolom.judul}</h2>
              {kolom.tautan.map((t) => (
                <Link key={t.href} href={t.href} className="text-body-sm whitespace-nowrap text-ink-muted hover:text-ink">
                  {t.label}
                </Link>
              ))}
            </nav>
          ))}
        </div>

        {/* Bagian bawah: ikon sosial media */}
        <div className="flex w-full items-center justify-between border-t border-line pt-6">
          <div className="flex items-start gap-[10px]">
            {SOSIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="flex size-10 items-center justify-center rounded-full bg-brand-subtle hover:bg-line-strong"
              >
                <Image src={s.ikon} alt="" width={18} height={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}