"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Alert, PageHero, StatusPill } from "@/components/elemen";
import { ambilDaftarMediasi, type RingkasanMediasi } from "@/lib/client/mediasi";

/** Daftar ruang mediasi yang dibuka admin (menu "Ruang Mediasi") */

const tanggal = (iso: string) =>
  new Date(iso).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default function HalamanDaftarMediasiAdmin() {
  const [daftar, setDaftar] = useState<RingkasanMediasi[]>([]);
  const [memuat, setMemuat] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    ambilDaftarMediasi()
      .then(setDaftar)
      .catch((err) => setError(err instanceof Error ? err.message : "Daftar mediasi gagal dimuat."))
      .finally(() => setMemuat(false));
  }, []);

  return (
    <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-6 py-8 md:px-20">
      <PageHero judul="Ruang Mediasi" subjudul="Obrolan bertiga antara admin, pelapor, dan terlapor" />

      {error && <Alert>{error}</Alert>}

      {memuat ? (
        <p className="text-body text-ink-muted">Memuat daftar mediasi...</p>
      ) : daftar.length === 0 ? (
        <section className="rounded-xl border border-line bg-surface p-6 text-body-sm text-ink-muted">
          Belum ada ruang mediasi. Buka dari detail tiket laporan dengan tombol &quot;Mulai mediasi&quot;.
        </section>
      ) : (
        <ul className="flex flex-col gap-4">
          {daftar.map((m) => {
            const berlangsung = m.status_sesi !== "SELESAI";
            return (
              <li key={m.id_sesi_mediasi}>
                <Link
                  href={`/mediasi/${m.id_sesi_mediasi}`}
                  className="flex items-center justify-between gap-6 rounded-xl border border-line bg-surface p-6 hover:bg-canvas"
                >
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="text-label text-ink">
                      {m.tiket_laporan?.pelapor?.nama ?? "Pelapor"} vs {m.tiket_laporan?.terlapor?.nama ?? "Terlapor"}
                    </span>
                    <span className="truncate text-body-sm text-ink-muted">
                      {m.pesan_terakhir ?? m.tiket_laporan?.deskripsi_laporan ?? "-"}
                    </span>
                    <span className="text-caption text-ink-muted">
                      Tiket #{m.id_tiket.slice(0, 8)} · {tanggal(m.waktu_pesan_terakhir)}
                    </span>
                  </span>
                  <StatusPill nada={berlangsung ? "warning" : "success"}>
                    {berlangsung ? "Berlangsung" : "Selesai"}
                  </StatusPill>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}