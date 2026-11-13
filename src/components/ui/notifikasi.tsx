"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ambilNotifikasi, tandaiDibaca, type Notifikasi } from "@/lib/client/notifikasi";

/**
 * Tombol lonceng + Dropdown Notifikasi — Figma "Dropdown Notifikasi" & "Item Notifikasi".
 * Statis: item tidak menautkan ke halaman lain. Data dari GET /api/notifikasi.
 */

const INTERVAL_MUAT_ULANG = 5_000; // cek notifikasi baru tiap 30 detik

export function TombolNotifikasi() {
  const [buka, setBuka] = useState(false);
  const [daftar, setDaftar] = useState<Notifikasi[]>([]);
  const [jumlah_belum_dibaca, setJumlahBelumDibaca] = useState(0);
  const [sedang_memuat, setSedangMemuat] = useState(true);
  const [gagal, setGagal] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const muat = useCallback(async () => {
    try {
      const hasil = await ambilNotifikasi();
      setDaftar(hasil.notifikasi);
      setJumlahBelumDibaca(hasil.jumlah_belum_dibaca);
      setGagal(false);
    } catch {
      setGagal(true); // belum login / server error → lonceng tetap tampil tanpa badge
    } finally {
      setSedangMemuat(false);
    }
  }, []);

  // Muat saat navbar tampil + cek berkala
  useEffect(() => {
    muat();
    const t = setInterval(muat, INTERVAL_MUAT_ULANG);
    return () => clearInterval(t);
  }, [muat]);

  // Tutup saat klik di luar atau tekan Escape
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

  /** Buka dropdown → muat ulang, lalu tandai semua yang belum dibaca */
  async function toggle() {
    const akan_buka = !buka;
    setBuka(akan_buka);
    if (!akan_buka) return;

    await muat();
    const belum = daftar.filter((n) => !n.is_read).map((n) => n.id_notifikasi);
    if (belum.length === 0) return;
    setJumlahBelumDibaca(0); // badge langsung hilang
    Promise.all(belum.map((id) => tandaiDibaca(id).catch(() => {}))).then(muat);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="dialog"
        aria-expanded={buka}
        aria-label={jumlah_belum_dibaca ? `Notifikasi, ${jumlah_belum_dibaca} baru` : "Notifikasi"}
        className={`relative flex size-[44px] shrink-0 items-center justify-center rounded-[12px] ${
          buka ? "border-[1.5px] border-brand bg-canvas" : "bg-canvas hover:bg-line"
        }`}
      >
        <Image src="/icons/lonceng.svg" alt="" width={22} height={22} />
        {jumlah_belum_dibaca > 0 && (
          <span className="absolute -top-[5px] -right-[4px] flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-danger px-[5px] text-[11px] leading-none font-bold text-white">
            {jumlah_belum_dibaca > 99 ? "99+" : jumlah_belum_dibaca}
          </span>
        )}
      </button>

      {buka && (
        <div
          role="dialog"
          aria-label="Notifikasi"
          className="absolute top-[calc(100%+8px)] right-0 z-50 w-[360px] overflow-hidden rounded-[12px] border border-line bg-white shadow-[0_8px_24px_rgba(28,17,69,0.08)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <span className="text-[16px] leading-[1.35] font-bold text-ink">Notifikasi</span>
            {jumlah_belum_dibaca > 0 && (
              <span className="text-[12px] font-medium text-brand-text">{jumlah_belum_dibaca} baru</span>
            )}
          </div>

          {/* Daftar (scroll) */}
          <ul className="max-h-[340px] overflow-y-auto">
            {sedang_memuat ? (
              <li className="px-5 py-4 text-[13px] text-ink-muted">Memuat notifikasi…</li>
            ) : gagal ? (
              <li className="px-5 py-4 text-[13px] text-ink-muted">Notifikasi gagal dimuat.</li>
            ) : daftar.length === 0 ? (
              <li className="px-5 py-4 text-[13px] text-ink-muted">Belum ada notifikasi.</li>
            ) : (
              daftar.map((n) => (
                <li
                  key={n.id_notifikasi}
                  className={`flex flex-col gap-1 border-b border-line px-5 py-[14px] last:border-b-0 ${
                    n.is_read ? "bg-white" : "bg-canvas"
                  }`}
                >
                  <span className="text-[14px] leading-[1.4] font-semibold text-ink">{n.judul}</span>
                  <span className="line-clamp-2 text-[13px] leading-[1.4] font-medium text-ink-muted">
                    {n.pesan_notifikasi}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}