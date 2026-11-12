
/**
 * Pemanggil API bersama untuk semua halaman.
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

const BATAS_WAKTU_MS = 10_000;

type OpsiApi = Omit<RequestInit, "body"> & {
  /** Objek biasa dikirim sebagai JSON, FormData dikirim apa adanya. */
  body?: unknown;
  /** Timeout khusus request. Default 10 detik. */
  timeoutMs?: number;
};

export async function api<T>(
  url: string,
  opsi: OpsiApi = {},
): Promise<T> {
  const {
    body,
    headers,
    timeoutMs = BATAS_WAKTU_MS,
    ...sisa
  } = opsi;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);

  const isForm =
    typeof FormData !== "undefined" && body instanceof FormData;

  try {
    const res = await fetch(url, {
      ...sisa,
      signal: ctrl.signal,
      headers:
        isForm || body === undefined
          ? headers
          : { "Content-Type": "application/json", ...headers },
      body:
        body === undefined
          ? undefined
          : isForm
            ? (body as FormData)
            : JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const pesan =
        typeof data?.error === "string"
          ? data.error
          : typeof data?.message === "string"
            ? data.message
            : "Terjadi kesalahan. Coba lagi.";

      const kode = data?.code ?? data?.error_code ?? "SERVER";

      throw new ApiError(res.status, kode, pesan, data?.field);
    }

    return data as T;
  } catch (e) {
    if (e instanceof ApiError) throw e;

    if (e instanceof Error && e.name === "AbortError") {
      throw new ApiError(
        0,
        "TIMEOUT",
        "Waktu tunggu permintaan habis. Silakan coba lagi.",
      );
    }

    throw new ApiError(
      0,
      "JARINGAN",
      "Server tidak merespons. Periksa koneksi internet Anda dan coba lagi.",
    );
  } finally {
    clearTimeout(timer);
  }
}
