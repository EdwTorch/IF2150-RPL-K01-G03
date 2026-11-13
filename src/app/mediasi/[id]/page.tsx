"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Alert, Button, PageHero, StatusPill } from "@/components/elemen";
import Footer from "@/components/ui/footer";
import Navbar, { type Peran } from "@/components/ui/navbar";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/cn";
import { sesiSaatIni, type UserSesi } from "@/lib/client/auth";
import {
  akhiriMediasi,
  ambilDetailMediasi,
  kirimPesanMediasi,
  type DetailMediasi,
  type PeranMediasi,
} from "@/lib/client/mediasi";

/**
 * Ruang Mediasi (C51/C52) — obrolan bertiga: Admin, Pelapor, Terlapor
 * Rute: /mediasi/[id_sesi_mediasi]
 */

const INTERVAL_MUAT_ULANG = 4000;

const LABEL_PERAN: Record<PeranMediasi, string> = {
  ADMIN: "Admin",
  PELAPOR: "Pelapor",
  TERLAPOR: "Terlapor",
};

const peranNavbar = (user: UserSesi | null): Peran =>
  !user ? "TAMU" : user.role === "ADMIN" ? "ADMIN" : user.isPenyediaJasa ? "PENYEDIA_JASA" : "PENGGUNA_JASA";

const jam = (iso: string) =>
  new Date(iso).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

function pesanError(err: unknown, cadangan: string) {
  if (err instanceof ApiError && err.status === 401) return "Masuk dulu untuk membuka ruang mediasi.";
  return err instanceof Error ? err.message : cadangan;
}

export default function HalamanMediasi() {
  const { id } = useParams<{ id: string }>();

  const [sesi_login, setSesiLogin] = useState<UserSesi | null>(null);
  const [sesi_dicek, setSesiDicek] = useState(false);

  const [detail, setDetail] = useState<DetailMediasi | null>(null);
  const [memuat, setMemuat] = useState(true);
  const [error, setError] = useState("");

  const [isi_pesan, setIsiPesan] = useState("");
  const [mengirim, setMengirim] = useState(false);
  const [yakin_akhiri, setYakinAkhiri] = useState(false);
  const [menutup, setMenutup] = useState(false);

  const daftar_ref = useRef<HTMLDivElement>(null);

  const berlangsung = detail?.sesi.status_sesi !== "SELESAI";
  const jumlah_pesan = detail?.pesan.length ?? 0;

  useEffect(() => {
    sesiSaatIni()
      .then((r) => setSesiLogin(r.user))
      .catch(() => setSesiLogin(null))
      .finally(() => setSesiDicek(true));
  }, []);

  // Muat detail; selama mediasi berlangsung, muat ulang berkala agar pesan peserta lain muncul
  useEffect(() => {
    if (!id) return;
    let aktif = true;

    async function muat() {
      try {
        const data = await ambilDetailMediasi(id);
        if (aktif) {
          setDetail(data);
          setError("");
        }
      } catch (err) {
        if (aktif) setError(pesanError(err, "Ruang mediasi gagal dimuat."));
      } finally {
        if (aktif) setMemuat(false);
      }
    }

    muat();
    const timer = berlangsung ? setInterval(muat, INTERVAL_MUAT_ULANG) : undefined;

    return () => {
      aktif = false;
      if (timer) clearInterval(timer);
    };
  }, [id, berlangsung]);

  // Gulir ke pesan terbaru setiap ada pesan baru
  useEffect(() => {
    const el = daftar_ref.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [jumlah_pesan]);

  async function kirim(e: FormEvent) {
    e.preventDefault();
    const isi = isi_pesan.trim();
    if (!isi || mengirim) return;

    setMengirim(true);
    setError("");
    try {
      await kirimPesanMediasi(id, isi);
      setIsiPesan("");
      setDetail(await ambilDetailMediasi(id));
    } catch (err) {
      setError(pesanError(err, "Pesan gagal dikirim."));
    } finally {
      setMengirim(false);
    }
  }

  async function akhiri() {
    if (!yakin_akhiri) {
      setYakinAkhiri(true);
      return;
    }

    setMenutup(true);
    setError("");
    try {
      await akhiriMediasi(id);
      setDetail(await ambilDetailMediasi(id));
    } catch (err) {
      setError(pesanError(err, "Mediasi gagal diakhiri."));
    } finally {
      setMenutup(false);
      setYakinAkhiri(false);
    }
  }

  const tiket = detail?.sesi.tiket_laporan ?? null;
  const saya_admin = detail?.peran_saya === "ADMIN";

  const peserta: { peran: PeranMediasi; nama: string }[] = detail
    ? [
        { peran: "ADMIN", nama: detail.sesi.nama_admin },
        { peran: "PELAPOR", nama: tiket?.pelapor?.nama ?? "Pelapor" },
        { peran: "TERLAPOR", nama: tiket?.terlapor?.nama ?? "Terlapor" },
      ]
    : [];

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      {sesi_dicek && <Navbar peran={peranNavbar(sesi_login)} nama={sesi_login?.nama} />}

      <main className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col gap-6 px-6 py-8 md:px-20">
        {memuat ? (
          <p className="text-body text-ink-muted">Memuat ruang mediasi...</p>
        ) : !detail ? (
          <Alert>{error || "Ruang mediasi tidak ditemukan."}</Alert>
        ) : (
          <>
            <PageHero
              judul="Ruang Mediasi"
              subjudul={`Tiket #${detail.sesi.id_tiket.slice(0, 8)} · Pesanan #${tiket?.id_pesanan.slice(0, 8) ?? "-"}`}
              status={
                <StatusPill nada={berlangsung ? "warning" : "success"}>
                  {berlangsung ? "Mediasi berlangsung" : "Mediasi selesai"}
                </StatusPill>
              }
            />

            {error && <Alert>{error}</Alert>}

            <div className="grid items-start gap-6 lg:grid-cols-[1fr_320px]">
              {/* ===== Ruang obrolan ===== */}
              <section className="flex h-[620px] flex-col overflow-hidden rounded-xl border border-line bg-surface">
                <div ref={daftar_ref} className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
                  {detail.pesan.length === 0 && (
                    <p className="text-body-sm text-ink-muted">Belum ada pesan.</p>
                  )}

                  {detail.pesan.map((p) => {
                    const milik_saya = p.id_pengirim === sesi_login?.id;
                    return (
                      <div
                        key={p.id_pesan}
                        className={cn(
                          "flex max-w-[75%] flex-col gap-1",
                          milik_saya ? "items-end self-end" : "items-start self-start",
                        )}
                      >
                        <span className="text-caption text-ink-muted">
                          {milik_saya ? "Kamu" : p.nama_pengirim} · {LABEL_PERAN[p.peran_di_mediasi]} ·{" "}
                          {jam(p.waktu_kirim)}
                        </span>
                        <p
                          className={cn(
                            "whitespace-pre-wrap rounded-xl px-4 py-3 text-body-sm",
                            milik_saya
                              ? "bg-brand text-on-brand"
                              : p.peran_di_mediasi === "ADMIN"
                                ? "bg-accent-subtle text-ink"
                                : "border border-line bg-surface text-ink",
                          )}
                        >
                          {p.isi_pesan}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {berlangsung ? (
                  <form onSubmit={kirim} className="flex items-center gap-3 border-t border-line p-4">
                    <input
                      value={isi_pesan}
                      onChange={(e) => setIsiPesan(e.target.value)}
                      placeholder="Tulis pesan untuk semua peserta mediasi"
                      aria-label="Pesan mediasi"
                      disabled={mengirim}
                      className="h-12 flex-1 rounded-field border border-line bg-surface px-4 text-body-sm text-ink outline-none placeholder:text-ink-placeholder focus:border-brand"
                    />
                    <Button type="submit" loading={mengirim} disabled={mengirim || !isi_pesan.trim()}>
                      Kirim
                    </Button>
                  </form>
                ) : (
                  <p className="border-t border-line p-4 text-center text-body-sm text-ink-muted">
                    Sesi mediasi telah diakhiri admin. Pesan tidak dapat dikirim lagi.
                  </p>
                )}
              </section>

              {/* ===== Info mediasi ===== */}
              <aside className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-6">
                <h2 className="text-h4 text-ink">Peserta</h2>
                <ul className="flex flex-col gap-3">
                  {peserta.map((o) => (
                    <li key={o.peran} className="flex items-center justify-between gap-3">
                      <span className="truncate text-label text-ink">{o.nama}</span>
                      <StatusPill nada={o.peran === "ADMIN" ? "accent" : "neutral"}>
                        {LABEL_PERAN[o.peran]}
                      </StatusPill>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col gap-2 border-t border-line pt-4">
                  <h3 className="text-label text-ink">Isi laporan</h3>
                  <p className="text-body-sm text-ink-muted">{tiket?.deskripsi_laporan ?? "-"}</p>
                </div>

                {saya_admin && (
                  <div className="flex flex-col gap-3 border-t border-line pt-4">
                    {berlangsung ? (
                      <>
                        <p className="text-caption text-ink-muted">
                          {yakin_akhiri
                            ? "Klik sekali lagi untuk mengakhiri. Peserta tidak bisa mengirim pesan lagi."
                            : "Akhiri mediasi setelah kedua pihak menyampaikan penjelasan."}
                        </p>
                        <Button variant="accent" fullWidth loading={menutup} disabled={menutup} onClick={akhiri}>
                          {yakin_akhiri ? "Ya, akhiri mediasi" : "Akhiri mediasi"}
                        </Button>
                      </>
                    ) : (
                      <p className="text-caption text-ink-muted">
                        Mediasi selesai. Lanjutkan dengan memberi keputusan pada tiket.
                      </p>
                    )}
                    <Button variant="secondary" fullWidth href={`/admin/tiket/${detail.sesi.id_tiket}`}>
                      Buka tiket laporan
                    </Button>
                  </div>
                )}

                {!saya_admin && (
                  <Link href="/chat" className="text-label text-brand-text">
                    Kembali ke daftar chat
                  </Link>
                )}
              </aside>
            </div>
          </>
        )}
      </main>

      {sesi_dicek && <Footer peran={peranNavbar(sesi_login)} />}
    </div>
  );
}