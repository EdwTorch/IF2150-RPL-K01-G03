import { api } from "@/lib/api";
import type { JasaListing } from "@/lib/client/jasa";

/**
 * Bookmark (C22 PengontrolBookmark) → app/api/bookmark/route.ts
 * id_pengguna_jasa TIDAK dikirim — route mengambilnya dari sesi login.
 * Catatan: kalau NEXT_PUBLIC_USE_MOCK=true, route backend justru minta id_pengguna_jasa → pakai mode asli.
 */

export type Bookmark = {
  id_bookmark: string;
  id_pengguna_jasa: string;
  id_jasa: string;
  waktu_disimpan?: string;
  jasa?: JasaListing;
};

type Respons<T> = { success: true; message: string; data: T };

/** Algo-2203 — daftar bookmark pengguna (dipakai juga di layar Bookmark I-07) */
export async function ambilDaftarBookmark() {
  const respons = await api<Respons<Bookmark[]>>("/api/bookmark");
  return respons.data;
}

/** Hanya id_jasa-nya, untuk menandai ikon bookmark di kartu */
export async function ambilIdBookmark() {
  const daftar = await ambilDaftarBookmark();
  return daftar.map((b) => b.id_jasa);
}

/** klikIkonBookmark() — tambah kalau belum ada, hapus kalau sudah ada */
export async function toggleBookmark(id_jasa: string) {
  const respons = await api<Respons<Bookmark | null>>("/api/bookmark", {
    method: "POST",
    body: { id_jasa, toggle: true },
  });
  return { tersimpan: respons.data !== null, pesan: respons.message };
}

/** Hapus langsung (dipakai di layar Bookmark I-07) */
export async function hapusBookmark(id_jasa: string) {
  await api<Respons<null>>(`/api/bookmark?id_jasa=${encodeURIComponent(id_jasa)}`, { method: "DELETE" });
}