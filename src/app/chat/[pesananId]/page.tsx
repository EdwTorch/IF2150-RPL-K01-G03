"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Alert, Button } from "@/components/elemen";
import Footer from "@/components/ui/footer";
import Navbar, { type Peran } from "@/components/ui/navbar";
import { ApiError } from "@/lib/api";
import { sesiSaatIni, type UserSesi } from "@/lib/client/auth";
import { ambilDaftarRoom, ambilRiwayatPesan, kirimPesanChat, type PesanChat, type RoomChat } from "@/lib/client/chat";
import { unggahBerkas } from "@/lib/client/upload";
import { createClient } from "@/lib/supabase/client";

/**
 * I-08 Layar Chat — C24 HalamanChat
 * Atribut DPPL: idSesiChat, inputPesan, statusKoneksi
 * Operasi DPPL: tampilkanMenuChat(), tampilkanRiwayatPesan(), inputPesan(), tombolKirimTerklik(),
 *               tampilkanPesanError(), tampilkanStatusBelumTerkirim()
 */

/** Pesan di layar = pesan dari server + pesan lokal yang belum terkirim */
type PesanTampil = PesanChat & { status_kirim?: "mengirim" | "gagal" };

const peranDari = (user: UserSesi | null): Peran =>
  !user ? "TAMU" : user.role === "ADMIN" ? "ADMIN" : user.isPenyediaJasa ? "PENYEDIA_JASA" : "PENGGUNA_JASA";

const namaLawan = (room: RoomChat, id_saya?: string) =>
  (room.id_pengguna_jasa === id_saya ? room.penyedia_jasa?.nama : room.pengguna_jasa?.nama) ?? "Percakapan";

const jam = (iso: string) => new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

function labelTanggal(iso: string) {
  const d = new Date(iso);
  const hari_ini = new Date();
  const kemarin = new Date();
  kemarin.setDate(hari_ini.getDate() - 1);
  if (d.toDateString() === hari_ini.toDateString()) return "Hari ini";
  if (d.toDateString() === kemarin.toDateString()) return "Kemarin";
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

const adalahGambar = (url: string) => /\.(png|jpe?g|webp|gif)(\?|$)/i.test(url) || url.startsWith("blob:");
const namaBerkas = (url: string) => decodeURIComponent(url.split("/").pop()?.split("?")[0] ?? "lampiran");

function HalamanChatIsi() {
  const router = useRouter();
  const search_params = useSearchParams();
  const id_sesi_chat = search_params.get("room"); // idSesiChat

  const [sesi, setSesi] = useState<UserSesi | null>(null);
  const [sesi_dicek, setSesiDicek] = useState(false);

  const [daftar_room, setDaftarRoom] = useState<RoomChat[]>([]);
  const [cari_percakapan, setCariPercakapan] = useState("");
  const [error_room, setErrorRoom] = useState("");

  const [pesan, setPesan] = useState<PesanTampil[]>([]);
  const [memuat_pesan, setMemuatPesan] = useState(false);
  const [input_pesan, setInputPesan] = useState("");
  const [pesan_error, setPesanError] = useState("");
  const [status_koneksi, setStatusKoneksi] = useState<"online" | "offline">("online");
  const [mengunggah, setMengunggah] = useState(false);

  const ujung_pesan = useRef<HTMLDivElement>(null);
  const input_dokumen = useRef<HTMLInputElement>(null);
  const input_foto = useRef<HTMLInputElement>(null);

  const peran = peranDari(sesi);
  const room_aktif = daftar_room.find((r) => r.id_chatroom === id_sesi_chat);

  /* ---------- sesi + tampilkanMenuChat() ---------- */
  useEffect(() => {
    sesiSaatIni()
      .then((r) => setSesi(r.user))
      .catch(() => setSesi(null))
      .finally(() => setSesiDicek(true));

    ambilDaftarRoom()
      .then(setDaftarRoom)
      .catch((err) =>
        setErrorRoom(
          err instanceof ApiError && err.status === 401
            ? "Masuk dulu untuk melihat percakapan."
            : err instanceof ApiError
              ? err.message
              : "Daftar percakapan gagal dimuat.",
        ),
      );
  }, []);

  /* ---------- statusKoneksi ---------- */
  useEffect(() => {
    const perbarui = () => setStatusKoneksi(navigator.onLine ? "online" : "offline");
    perbarui();
    window.addEventListener("online", perbarui);
    window.addEventListener("offline", perbarui);
    return () => {
      window.removeEventListener("online", perbarui);
      window.removeEventListener("offline", perbarui);
    };
  }, []);

  /* ---------- tampilkanRiwayatPesan() + realtime ---------- */
  useEffect(() => {
    if (!id_sesi_chat) return;
    let batal = false;
    setMemuatPesan(true);
    setPesan([]);
    setPesanError("");

    ambilRiwayatPesan(id_sesi_chat)
      .then((data) => !batal && setPesan(data))
      .catch((err) => !batal && setPesanError(err instanceof ApiError ? err.message : "Pesan gagal dimuat."))
      .finally(() => !batal && setMemuatPesan(false));

    // Pesan baru dari lawan bicara langsung muncul (tabel pesan_chat sudah di publication supabase_realtime)
    const supabase = createClient();
    const kanal = supabase
      .channel(`chat-${id_sesi_chat}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "pesan_chat", filter: `id_chatroom=eq.${id_sesi_chat}` },
        (payload) => {
          const baru = payload.new as PesanChat;
          setPesan((lama) => (lama.some((p) => p.id_pesan === baru.id_pesan) ? lama : [...lama, baru]));
        },
      )
      .subscribe();

    return () => {
      batal = true;
      supabase.removeChannel(kanal);
    };
  }, [id_sesi_chat]);

  // Scroll ke pesan terbaru
  useEffect(() => {
    ujung_pesan.current?.scrollIntoView({ behavior: "smooth" });
  }, [pesan]);

  const room_tersaring = useMemo(() => {
    const kata = cari_percakapan.trim().toLowerCase();
    return kata ? daftar_room.filter((r) => namaLawan(r, sesi?.id).toLowerCase().includes(kata)) : daftar_room;
  }, [daftar_room, cari_percakapan, sesi?.id]);

  /* ---------- kirim ---------- */
  async function kirim(isi: string, lampiran: string | null, id_lokal?: string) {
    if (!id_sesi_chat || !sesi) return;
    const id_sementara = id_lokal ?? `lokal-${Date.now()}`;
    const sekarang = new Date().toISOString();

    // tampilkan dulu (status "mengirim")
    setPesan((lama) => {
      const tanpa_lama = lama.filter((p) => p.id_pesan !== id_sementara);
      return [
        ...tanpa_lama,
        {
          id_pesan: id_sementara,
          id_chatroom: id_sesi_chat,
          id_pengirim: sesi.id,
          isi_pesan: isi,
          lampiran,
          waktu_dibuat: sekarang,
          created_at: sekarang,
          status_kirim: "mengirim",
        },
      ];
    });

    try {
      const tersimpan = await kirimPesanChat(id_sesi_chat, isi, lampiran);
      setPesan((lama) => {
        const tanpa_sementara = lama.filter((p) => p.id_pesan !== id_sementara);
        // realtime mungkin sudah menambahkan pesan yang sama lebih dulu
        return tanpa_sementara.some((p) => p.id_pesan === tersimpan.id_pesan)
          ? tanpa_sementara
          : [...tanpa_sementara, tersimpan];
      });
    } catch (err) {
      tampilkanStatusBelumTerkirim(id_sementara);
      if (err instanceof ApiError && err.kode !== "JARINGAN") setPesanError(err.message);
    }
  }

  /** tampilkanStatusBelumTerkirim() */
  function tampilkanStatusBelumTerkirim(id_pesan: string) {
    setPesan((lama) => lama.map((p) => (p.id_pesan === id_pesan ? { ...p, status_kirim: "gagal" } : p)));
  }

  /** tombolKirimTerklik() */
  function tombolKirimTerklik(e: FormEvent) {
    e.preventDefault();
    setPesanError("");
    // LayananPesanInstan.validasiInputPesan()
    if (!input_pesan.trim()) {
      tampilkanPesanError("Pesan tidak boleh kosong.");
      return;
    }
    kirim(input_pesan.trim(), null);
    setInputPesan("");
  }

  /** tampilkanPesanError() */
  function tampilkanPesanError(teks: string) {
    setPesanError(teks);
  }

  /** O-03 / O-04 — lampirkan dokumen atau foto */
  async function pilihLampiran(berkas: File | undefined) {
    if (!berkas) return;
    setMengunggah(true);
    try {
      const { url, nama } = await unggahBerkas(berkas);
      await kirim(nama, url);
    } catch {
      tampilkanPesanError("Lampiran gagal diunggah. Coba lagi.");
    } finally {
      setMengunggah(false);
    }
  }

  /* ---------- tampilan ---------- */
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      {sesi_dicek && <Navbar peran={peran} nama={sesi?.nama} />}

      <main className="mx-auto w-full max-w-[1440px] flex-1 px-20 py-8">
        <div className="grid h-[720px] grid-cols-[360px_minmax(0,1fr)] overflow-hidden rounded-xl border border-line bg-surface">
          {/* ================= Kiri: menu chat ================= */}
          <aside className="flex min-h-0 flex-col border-r border-line">
            <div className="flex flex-col gap-4 p-5">
              <h1 className="text-h3 text-ink">Chat</h1>
              <label className="flex h-11 items-center gap-2 rounded-field bg-canvas px-4">
                <Image src="/icons/search.svg" alt="" width={18} height={18} />
                <input
                  type="search"
                  value={cari_percakapan}
                  onChange={(e) => setCariPercakapan(e.target.value)}
                  placeholder="Cari percakapan"
                  aria-label="Cari percakapan"
                  className="flex-1 bg-transparent text-body-sm text-ink outline-none placeholder:text-ink-placeholder"
                />
              </label>
            </div>

            <ul className="min-h-0 flex-1 overflow-y-auto">
              {error_room && (
                <li className="px-5">
                  <Alert tipe="error">{error_room}</Alert>
                </li>
              )}
              {!error_room && room_tersaring.length === 0 && (
                <li className="px-5 text-body-sm text-ink-muted">
                  {daftar_room.length === 0 ? "Belum ada percakapan." : "Percakapan tidak ditemukan."}
                </li>
              )}
              {room_tersaring.map((room) => {
                const aktif = room.id_chatroom === id_sesi_chat;
                return (
                  <li key={room.id_chatroom}>
                    <button
                      type="button"
                      onClick={() => router.push(`/chat?room=${room.id_chatroom}`)}
                      className={`flex w-full items-center gap-3 px-5 py-4 text-left ${aktif ? "bg-muted" : "hover:bg-canvas"}`}
                    >
                      <Image src="/icons/avatar.svg" alt="" width={40} height={40} className="rounded-full" />
                      <span className="flex min-w-0 flex-col">
                        <span className="truncate text-label text-ink">{namaLawan(room, sesi?.id)}</span>
                        <span className="text-caption text-ink-muted">Dibuka {labelTanggal(room.created_at)}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* ================= Kanan: ruang chat ================= */}
          {!id_sesi_chat ? (
            <section className="flex items-center justify-center p-6 text-center">
              <p className="text-body text-ink-muted">Pilih percakapan di sebelah kiri untuk mulai mengobrol.</p>
            </section>
          ) : (
            <section className="flex min-h-0 flex-col">
              {/* Header */}
              <header className="flex items-center gap-3 border-b border-line px-6 py-4">
                <Image src="/icons/avatar.svg" alt="" width={40} height={40} className="rounded-full" />
                <span className="text-label text-ink">{room_aktif ? namaLawan(room_aktif, sesi?.id) : "Percakapan"}</span>
              </header>

              {status_koneksi === "offline" && (
                <div className="bg-danger-subtle px-6 py-2 text-body-sm text-danger">
                  Koneksi terputus. Pesan akan dikirim ulang saat kamu online kembali.
                </div>
              )}

              {/* Riwayat pesan */}
              <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto bg-canvas px-6 py-5">
                {memuat_pesan && <p className="text-center text-body-sm text-ink-muted">Memuat pesan…</p>}
                {!memuat_pesan && pesan.length === 0 && (
                  <p className="text-center text-body-sm text-ink-muted">Belum ada pesan. Sapa duluan!</p>
                )}

                {pesan.map((p, i) => {
                  const milik_saya = p.id_pengirim === sesi?.id;
                  const tanggal_baru =
                    i === 0 || labelTanggal(p.created_at) !== labelTanggal(pesan[i - 1].created_at);
                  return (
                    <div key={p.id_pesan} className="flex flex-col gap-1">
                      {tanggal_baru && (
                        <span className="mx-auto my-2 rounded-full bg-surface px-3 py-1 text-caption text-ink-muted">
                          {labelTanggal(p.created_at)}
                        </span>
                      )}
                      <div className={`flex max-w-[70%] flex-col gap-1 ${milik_saya ? "items-end self-end" : "items-start self-start"}`}>
                        {p.lampiran ? (
                          <a
                            href={p.lampiran}
                            target="_blank"
                            rel="noreferrer"
                            className="flex flex-col items-center gap-2 rounded-xl bg-muted p-4 text-body-sm text-ink"
                          >
                            {adalahGambar(p.lampiran) ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={p.lampiran} alt={p.isi_pesan} className="max-h-48 rounded-lg object-cover" />
                            ) : (
                              <Image src="/icons/lampiran.svg" alt="" width={24} height={24} />
                            )}
                            <span>{p.isi_pesan || namaBerkas(p.lampiran)}</span>
                          </a>
                        ) : (
                          <p
                            className={`rounded-2xl px-4 py-3 text-body-sm whitespace-pre-line ${
                              milik_saya ? "bg-brand text-on-brand" : "border border-line bg-surface text-ink"
                            } ${p.status_kirim ? "opacity-70" : ""}`}
                          >
                            {p.isi_pesan}
                          </p>
                        )}

                        {p.status_kirim === "gagal" ? (
                          <button
                            type="button"
                            onClick={() => kirim(p.isi_pesan, p.lampiran, p.id_pesan)}
                            className="text-caption text-danger hover:underline"
                          >
                            Belum terkirim · Coba lagi
                          </button>
                        ) : (
                          <span className="text-caption text-ink-muted">
                            {p.status_kirim === "mengirim" ? "Mengirim…" : jam(p.created_at)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={ujung_pesan} />
              </div>

              {/* Input pesan */}
              <form onSubmit={tombolKirimTerklik} className="flex flex-col gap-1 border-t border-line px-6 py-4">
                <div className="flex items-center gap-3">
                  <input ref={input_dokumen} type="file" accept=".pdf,.doc,.docx,.zip" hidden onChange={(e) => pilihLampiran(e.target.files?.[0])} />
                  <input ref={input_foto} type="file" accept="image/*" hidden onChange={(e) => pilihLampiran(e.target.files?.[0])} />

                  <button type="button" onClick={() => input_dokumen.current?.click()} disabled={mengunggah} aria-label="Lampirkan dokumen" className="flex size-11 shrink-0 items-center justify-center rounded-field bg-canvas hover:bg-line disabled:opacity-50">
                    <Image src="/icons/lampiran.svg" alt="" width={20} height={20} />
                  </button>
                  <button type="button" onClick={() => input_foto.current?.click()} disabled={mengunggah} aria-label="Lampirkan foto" className="flex size-11 shrink-0 items-center justify-center rounded-field bg-canvas hover:bg-line disabled:opacity-50">
                    <Image src="/icons/gambar.svg" alt="" width={20} height={20} />
                  </button>

                  <input
                    value={input_pesan}
                    onChange={(e) => {
                      setInputPesan(e.target.value);
                      if (pesan_error) setPesanError("");
                    }}
                    placeholder="Tulis pesan…"
                    aria-label="Tulis pesan"
                    className={`h-11 flex-1 rounded-field border bg-canvas px-4 text-body-sm text-ink outline-none placeholder:text-ink-placeholder ${
                      pesan_error ? "border-danger" : "border-transparent"
                    }`}
                  />
                  <Button type="submit" className="size-11 px-0" aria-label="Kirim pesan" loading={mengunggah}>
                    <Image src="/icons/kirim.svg" alt="" width={20} height={20} />
                  </Button>
                </div>
                {pesan_error && <p className="text-helper text-danger">{pesan_error}</p>}
              </form>
            </section>
          )}
        </div>
      </main>

      {sesi_dicek && <Footer peran={peran} />}
    </div>
  );
}

export default function HalamanChat() {
  // useSearchParams wajib dibungkus Suspense
  return (
    <Suspense>
      <HalamanChatIsi />
    </Suspense>
  );
}