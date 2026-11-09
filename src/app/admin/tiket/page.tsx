"use client";

import { useEffect, useState } from "react";
import { Alert, Button, PageHero, StatusPill } from "@/components/elemen";
import { cn } from "@/lib/cn";
import { Tiket, getTiketList } from "@/lib/layanan";

const NADA = {
  Belum: "danger",
  Mediasi: "neutral",
  Selesai: "success",
} as const;

// C53: loading | error | tabel | empty state
export default function HalamanDashboardAdmin() {
  const [d, setD] = useState<Tiket[] | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    getTiketList()
      .then(setD)
      .catch(() => setErr("Gagal memuat tiket laporan."));
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-6 py-8 md:px-20">
      <PageHero judul="Tiket Laporan" penuh />

      {err && <Alert>{err}</Alert>}

      {!d && !err && (
        <p className="text-body text-ink-muted">Memuat…</p>
      )}

      {d && !d.length && (
        <section
          className={cn(
            "rounded-xl border border-line bg-surface p-6",
            "flex flex-col items-center gap-2 py-16 text-center"
          )}
        >
          <h2 className="text-h4 text-ink">Belum ada Laporan</h2>
          <p className="text-body-sm text-ink-muted">
            Tiket Laporan dari Pengguna akan muncul di sini.
          </p>
        </section>
      )}

      {!!d?.length && (
        <section
          className={cn(
            "rounded-xl border border-line bg-surface p-6",
            "overflow-x-auto p-2"
          )}
        >
          <table className="w-full min-w-[820px] text-left text-body-sm text-ink">
            <thead className="text-ink-muted">
              <tr>
                {[
                  "No. Tiket",
                  "Pelapor",
                  "Terlapor",
                  "Kategori",
                  "Tanggal",
                  "Status",
                  "",
                ].map((h) => (
                  <th key={h} className="px-4 py-4 text-label font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {d.map((t) => {
                const idTiket = t.id;

                return (
                  <tr key={idTiket} className="border-t border-line">
                    <td className="px-4 py-4">{idTiket}</td>
                    <td className="px-4">{t.pelapor}</td>
                    <td className="px-4">{t.terlapor}</td>
                    <td className="px-4">{t.kategori}</td>
                    <td className="px-4">{t.tanggal}</td>
                    <td className="px-4">
                      <StatusPill nada={NADA[t.status]}>
                        {t.status}
                      </StatusPill>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        href={`/admin/tiket/${idTiket}`}
                        className="h-10 px-5"
                      >
                        Detail
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}