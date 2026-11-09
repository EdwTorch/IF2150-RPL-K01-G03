/**
 * Pemanggil API bersama untuk semua halaman.
 * Server selalu mengembalikan error dengan format:
 *   { "error": { "kode": "PESANAN_AKTIF_PENUH", "pesan": "…", "field": { "brief": "…" } } }
 */

export class ApiError extends Error {
  constructor(
    public status: number,
    public kode: string,
    pesan: string,
    public field?: Record<string, string>,
  ) {
    super(pesan);
    this.name = "ApiError";
  }
}

const BATAS_WAKTU_MS = 10_000; // SKPL: server tidak merespons > 10 detik = error

type OpsiApi = Omit<RequestInit, "body"> & {
  /** Objek biasa dikirim sebagai JSON, FormData dikirim apa adanya (untuk unggah berkas). */
  body?: unknown;
};

export async function api<T>(url: string, opsi: OpsiApi = {}): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), BATAS_WAKTU_MS);

  const { body, headers, ...sisa } = opsi;
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;

  try {
    const res = await fetch(url, {
      ...sisa,
      signal: ctrl.signal,
      headers: isForm || body === undefined ? headers : { "Content-Type": "application/json", ...headers },
      body: body === undefined ? undefined : isForm ? (body as FormData) : JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (res.status === 401 && typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new ApiError(
        res.status,
        data?.error?.kode ?? "SERVER",
        data?.error?.pesan ?? "Terjadi kesalahan. Coba lagi.",
        data?.error?.field,
      );
    }
    return data as T;
  } catch (e) {
    if (e instanceof ApiError) throw e;
    throw new ApiError(0, "JARINGAN", "Server tidak merespons. Periksa koneksi internet Anda dan coba lagi.");
  } finally {
    clearTimeout(timer);
  }
}
