"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Navbar CariJasa — sesuai komponen Figma "Navbar" (node 31:167)
 *   Peran=Tamu          (31:110)  → logo + Masuk + Daftar (hanya di C04 Registrasi & C06 Login)
 *   Peran=Pengguna Jasa (31:136)  → Cari Jasa, Pesanan Saya, Bantuan + bookmark, chat, akun
 *   Peran=Penyedia Jasa (70:131)  → Tawarkan Jasa, Pesanan Masuk, Portofolio, Bantuan + chat, akun
 *   Peran=Admin         → Dashboard + chat, akun
 */

export type Peran = "TAMU" | "PENGGUNA_JASA" | "PENYEDIA_JASA" | "ADMIN";

export type NavbarProps = {
  peran: Peran;
  /** Nama pengguna yang sedang login (Figma: Nama). */
  nama?: string;
  /** URL foto profil. Jika kosong, dipakai avatar default. */
  avatarUrl?: string;
  /** Badge di "Pesanan Saya" (Pengguna Jasa) atau "Pesanan Masuk" (Penyedia Jasa). 0 = badge disembunyikan. */
  jumlahPesanan?: number;
  /** Badge di ikon chat. 0 = badge disembunyikan. */
  jumlahChat?: number;
  /** Dipanggil saat klik "Keluar". Default: POST /api/auth/logout lalu ke /masuk. */
  onKeluar?: () => void | Promise<void>;
};

type MenuItem = { label: string; href: string; pakaiBadge?: boolean };

const MENU: Record<Exclude<Peran, "TAMU">, MenuItem[]> = {
  PENGGUNA_JASA: [
    { label: "Cari Jasa", href: "/cari" },
    { label: "Pesanan Saya", href: "/riwayat", pakaiBadge: true },
    { label: "Bantuan", href: "/bantuan" },
  ],
  PENYEDIA_JASA: [
    { label: "Tawarkan Jasa", href: "/jasa/baru" },
    { label: "Pesanan Masuk", href: "/pesanan-masuk", pakaiBadge: true },
    { label: "Portofolio", href: "/portofolio" },
    { label: "Bantuan", href: "/bantuan" },
  ],
  ADMIN: [
    { label: "Tiket Laporan", href: "/admin/tiket" },
    { label: "Ruang Mediasi", href: "/admin" }
  ],
};

const BERANDA: Record<Peran, string> = {
  TAMU: "/",
  PENGGUNA_JASA: "/cari",
  PENYEDIA_JASA: "/portofolio",
  ADMIN: "/admin",
};

const LABEL_PERAN: Record<Exclude<Peran, "TAMU">, string> = {
  PENGGUNA_JASA: "Pengguna Jasa",
  PENYEDIA_JASA: "Penyedia Jasa",
  ADMIN: "Admin",
};

/* ---------------- Bagian kecil ---------------- */

function Brand({ href }: { href: string }) {
  return (
    <Link href={href} className="flex shrink-0 items-center gap-[10px]" aria-label="CariJasa, ke beranda">
      <Image src="/icons/logo-cj.svg" alt="" width={36} height={36} priority />
      <span className="text-[22px] leading-[1.35] font-semibold tracking-[-0.55px] whitespace-nowrap text-ink">
        CariJasa
      </span>
    </Link>
  );
}

/** Badge merah (Figma: "Badge Notifikasi" / "Badge Chat"). */
function Badge({ jumlah, className }: { jumlah?: number; className: string }) {
  if (!jumlah || jumlah <= 0) return null;
  return (
    <span
      className={`absolute flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-danger px-[5px] text-[11px] leading-none font-bold whitespace-nowrap text-white ${className}`}
    >
      {jumlah > 99 ? "99+" : jumlah}
    </span>
  );
}

function MenuLink({ item, aktif, jumlahBadge }: { item: MenuItem; aktif: boolean; jumlahBadge?: number }) {
  return (
    <Link
      href={item.href}
      aria-current={aktif ? "page" : undefined}
      className="relative flex shrink-0 flex-col items-center gap-[6px]"
    >
      <span
        className={`text-[14px] leading-[1.4] font-semibold whitespace-nowrap ${
          aktif ? "text-ink" : "text-ink-muted hover:text-ink"
        }`}
      >
        {item.label}
      </span>
      {/* Indikator aktif: garis lime 20x3 */}
      <span className={`h-[3px] w-[20px] rounded-[2px] bg-accent ${aktif ? "opacity-100" : "opacity-0"}`} />
      {item.pakaiBadge && <Badge jumlah={jumlahBadge} className="-top-[9px] -right-[14px]" />}
    </Link>
  );
}

function TombolIkon({
  href,
  ikon,
  label,
  jumlahBadge,
}: {
  href: string;
  ikon: string;
  label: string;
  jumlahBadge?: number;
}) {
  return (
    <Link
      href={href}
      aria-label={jumlahBadge ? `${label}, ${jumlahBadge} baru` : label}
      className="relative flex size-[44px] shrink-0 items-center justify-center rounded-[12px] bg-canvas hover:bg-line"
    >
      <Image src={ikon} alt="" width={22} height={22} />
      <Badge jumlah={jumlahBadge} className="-top-[5px] -right-[4px]" />
    </Link>
  );
}

function MenuAkun({
  nama,
  peranLabel,
  avatarUrl,
  onKeluar,
}: {
  nama: string;
  peranLabel: string;
  avatarUrl?: string;
  onKeluar: () => void;
}) {
  const [buka, setBuka] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Tutup dropdown saat klik di luar atau tekan Escape
  useEffect(() => {
    if (!buka) return;
    const klikLuar = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setBuka(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setBuka(false);
    document.addEventListener("mousedown", klikLuar);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", klikLuar);
      document.removeEventListener("keydown", esc);
    };
  }, [buka]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setBuka((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={buka}
        className="flex items-center gap-[10px] rounded-full border border-line py-[6px] pr-[14px] pl-[6px] hover:bg-canvas"
      >
        <Image
          src={avatarUrl || "/icons/avatar.svg"}
          alt=""
          width={32}
          height={32}
          className="size-[32px] rounded-full object-cover"
        />
        <span className="flex flex-col items-start leading-[1.4] whitespace-nowrap">
          <span className="text-[14px] font-semibold text-ink">{nama}</span>
          <span className="text-[12px] font-medium text-ink-muted">{peranLabel}</span>
        </span>
      </button>

      {buka && (
        <div
          role="menu"
          className="absolute top-[calc(100%+8px)] right-0 z-50 min-w-[180px] rounded-[12px] border border-line bg-white p-[6px] shadow-[0_8px_24px_rgba(28,17,69,0.08)]"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setBuka(false);
              onKeluar();
            }}
            className="w-full rounded-[8px] px-[12px] py-[10px] text-left text-[14px] font-semibold text-danger hover:bg-canvas"
          >
            Keluar
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------- Navbar ---------------- */

export default function Navbar({
  peran,
  nama = "[Nama Pengguna]",
  avatarUrl,
  jumlahPesanan = 0,
  jumlahChat = 0,
  onKeluar,
}: NavbarProps) {
  const pathname = usePathname() ?? "";
  const router = useRouter();

  async function keluar() {
    if (onKeluar) return onKeluar();
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/masuk");
      router.refresh();
    }
  }

  return (
    <header className="w-full border-b-2 border-line bg-white">
      <nav className="mx-auto flex h-[76px] w-full max-w-[1440px] items-center justify-between px-[80px]">
        <Brand href={BERANDA[peran]} />

        {peran === "TAMU" ? (
          /* ----- Peran = Tamu ----- */
          <div className="flex shrink-0 items-center gap-[12px]">
            {/* Button Style=Ghost */}
            <Link
              href="/masuk"
              className="flex h-[48px] items-center justify-center rounded-[10px] px-[24px] text-[16px] leading-[1.2] font-semibold text-brand-text hover:bg-canvas"
            >
              Masuk
            </Link>
            {/* Button Style=Primary */}
            <Link
              href="/daftar"
              className="flex h-[48px] items-center justify-center rounded-[10px] bg-brand px-[24px] text-[16px] leading-[1.2] font-semibold text-white hover:opacity-90"
            >
              Daftar
            </Link>
          </div>
        ) : (
          <>
            {/* ----- Menu tengah ----- */}
            <ul className="flex shrink-0 items-center gap-[36px]">
              {MENU[peran].map((item) => (
                <li key={item.href}>
                  <MenuLink
                    item={item}
                    aktif={pathname === item.href || pathname.startsWith(`${item.href}/`)}
                    jumlahBadge={jumlahPesanan}
                  />
                </li>
              ))}
            </ul>

            {/* ----- Aksi kanan ----- */}
            <div className="flex shrink-0 items-center gap-[12px]">
              {peran === "PENGGUNA_JASA" && (
                <TombolIkon href="/bookmark" ikon="/icons/bookmark.svg" label="Bookmark" />
              )}
              <TombolIkon href="/chat" ikon="/icons/chat.svg" label="Chat" jumlahBadge={jumlahChat} />
              <MenuAkun nama={nama} peranLabel={LABEL_PERAN[peran]} avatarUrl={avatarUrl} onKeluar={keluar} />
            </div>
          </>
        )}
      </nav>
    </header>
  );
}