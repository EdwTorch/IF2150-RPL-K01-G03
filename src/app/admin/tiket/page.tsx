
"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  PageHero,
  StatusPill,
} from "@/components/elemen";
import { cn } from "@/lib/cn";
import { ApiError } from "@/lib/api";
import {
  TiketAdmin,
  ambilDaftarTiketAdmin,
} from "@/lib/client/admin";

const NADA: Record<string, "danger" | "neutral" | "success"> = {
  Diproses: "neutral",
  Selesai: "success",
};

function formatTanggal(tanggal: string) {
  const date = new Date(tanggal);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// C53: loading | error | tabel | empty state
export default function HalamanDashboardAdmin() {
  const [d, setD] = useState<TiketAdmin[] | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    ambilDaftarTiketAdmin()
      .then(setD)
      .catch((error: unknown) => {
        setErr(
          error instanceof ApiError
            ? error.message
            : "Gagal memuat tiket laporan."
        );
      });
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
                const idTiket = t.id_tiket;

                return (
                  <tr key={idTiket} className="border-t border-line">
                    <td className="px-4 py-4">{idTiket}</td>

                    <td className="px-4">
                      {t.pelapor?.nama ?? "-"}
                    </td>

                    <td className="px-4">
                      {t.terlapor?.nama ?? "-"}
                    </td>

                    <td className="px-4">
                      {Array.isArray(t.kategori)
                        ? t.kategori.join(", ")
                        : "-"}
                    </td>

                    <td className="px-4">
                      {formatTanggal(t.created_at)}
                    </td>

                    <td className="px-4">
                      <StatusPill
                        nada={NADA[t.status_tiket] ?? "neutral"}
                      >
                        {t.status_tiket}
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
