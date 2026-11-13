
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";
import type { Jasa, Pesanan } from "@/models/types";

export type PesananDetail = Pesanan & {
  pengguna_jasa: {
    id: string;
    pengguna: {
      id: string;
      nama: string;
    } | null;
  } | null;
  penyedia_jasa: {
    id: string;
    pengguna: {
      id: string;
      nama: string;
    } | null;
  } | null;
};

export type PesananDenganStatusUlasan = Pesanan & {
  sudah_diulas: boolean;
  rating_ulasan: number | null;
  penyedia_jasa: {
    id: string;
    pengguna: {
      id: string;
      nama: string;
    } | null;
  } | null;
};

export const MAKS_PESANAN_AKTIF = 2;

const STATUS_TERMINAL = new Set([
  "SELESAI",
  "DITOLAK",
  "DIKEMBALIKAN",
  "DIBATALKAN",
]);

const TRANSISI_VALID: Record<string, string[]> = {
  MENUNGGU_PEMBAYARAN: ["MENUNGGU_KONFIRMASI", "DIPROSES", "DITOLAK"],
  MENUNGGU_KONFIRMASI: [
    "DIPROSES",
    "DITOLAK",
    "MENUNGGU_KONFIRMASI_SELESAI",
    "SELESAI",
    "KOMPLAIN",
  ],
  DIPROSES: [
    "MENUNGGU_KONFIRMASI",
    "MENUNGGU_KONFIRMASI_SELESAI",
    "SELESAI",
    "KOMPLAIN",
  ],
  MENUNGGU_KONFIRMASI_SELESAI: ["SELESAI", "DIPROSES", "KOMPLAIN"],
  KOMPLAIN: ["DIPROSES", "SELESAI", "DITOLAK", "DIKEMBALIKAN"],
  SELESAI: [],
  DITOLAK: [],
  DIKEMBALIKAN: [],
};

const waktu = (p: Pesanan) => Date.parse(p.created_at ?? "") || 0;

export class PesananService {
  /**
   * Penyedia Jasa menerima atau menolak pesanan masuk (UC10)
   */
  static async respondOrder(data: {
    id_pesanan: string;
    user_id: string;
    action: "Diterima" | "Ditolak" | string;
  }): Promise<Pesanan> {
    const act = data.action?.toLowerCase();

    if (
      act !== "diterima" &&
      act !== "terima" &&
      act !== "ditolak" &&
      act !== "tolak"
    ) {
      throw new Error("Tindakan konfirmasi tidak valid");
    }

    const tindakan: "terima" | "tolak" =
      act === "diterima" || act === "terima" ? "terima" : "tolak";

    return this.konfirmasiPesanan(
      data.id_pesanan,
      data.user_id,
      tindakan,
    );
  }

  static normalisasiStatus(status?: string): string {
    return (status ?? "").trim().toUpperCase().replace(/\s+/g, "_");
  }

  static apakahPesananAktif(status?: string): boolean {
    const norm = this.normalisasiStatus(status);
    return norm !== "" && !STATUS_TERMINAL.has(norm);
  }

  // Order State Machine
  static validasiTransisiStatus(
    status_awal: string,
    status_baru: string,
  ): string {
    const awal = this.normalisasiStatus(status_awal);
    const tujuan = this.normalisasiStatus(status_baru);

    if (!awal || !tujuan || !TRANSISI_VALID[awal]?.includes(tujuan)) {
      throw new Error(
        `Transisi status pesanan dari ${status_awal} ke ${status_baru} tidak valid`,
      );
    }

    return tujuan;
  }

  // UC09: membuat pesanan di memori
  static buatPesananDiMemori(
    daftar_pesanan: Pesanan[],
    daftar_jasa: Jasa[],
    id_pengguna_jasa: string,
    id_jasa: string,
    brief_kebutuhan: string,
  ): Pesanan {
    if (!id_pengguna_jasa?.trim() || !id_jasa?.trim()) {
      throw new Error("Parameter pemesanan tidak valid");
    }

    if (!brief_kebutuhan?.trim()) {
      throw new Error("Brief pemesanan wajib diisi");
    }

    const jasa = daftar_jasa.find(
      (j) => j.id_jasa === id_jasa && j.status_aktif !== false,
    );

    if (!jasa) throw new Error("Data jasa tidak ditemukan");

    if (jasa.id_penyedia_jasa === id_pengguna_jasa) {
      throw new Error("Tidak dapat memesan jasa milik sendiri");
    }

    const aktif = daftar_pesanan.filter(
      (p) =>
        p.id_pengguna_jasa === id_pengguna_jasa &&
        this.apakahPesananAktif(p.status_pesanan) &&
        this.normalisasiStatus(p.status_pesanan) !== "MENUNGGU_PEMBAYARAN",
    ).length;

    if (aktif >= MAKS_PESANAN_AKTIF) {
      throw new Error(
        `Batas maksimal ${MAKS_PESANAN_AKTIF} pesanan aktif telah tercapai`,
      );
    }

    const sekarang = new Date().toISOString();

    return {
      id_pesanan: crypto.randomUUID(),
      id_pengguna_jasa,
      id_penyedia_jasa: jasa.id_penyedia_jasa,
      id_jasa,
      brief: brief_kebutuhan.trim(),
      total_biaya: Number(jasa.harga),
      status_pembayaran: "MENUNGGU_PEMBAYARAN",
      status_pesanan: "MENUNGGU_PEMBAYARAN",
      status_pencairan: false,
      created_at: sekarang,
      updated_at: sekarang,
      jasa: { ...jasa },
    };
  }

  // UC10: konfirmasi pesanan di memori
  static konfirmasiPesananDiMemori(
    daftar_pesanan: Pesanan[],
    id_pesanan: string,
    id_penyedia_jasa: string,
    tindakan: "terima" | "tolak" | string,
  ): Pesanan {
    if (!id_pesanan?.trim() || !id_penyedia_jasa?.trim()) {
      throw new Error("Identitas pesanan tidak valid");
    }

    const t = tindakan?.toLowerCase();

    const act =
      t === "diterima" || t === "terima"
        ? "terima"
        : t === "ditolak" || t === "tolak"
          ? "tolak"
          : null;

    if (!act) throw new Error("Tindakan konfirmasi tidak valid");

    const pesanan = daftar_pesanan.find(
      (p) => p.id_pesanan === id_pesanan,
    );

    if (!pesanan) throw new Error("Pesanan tidak ditemukan");

    if (pesanan.id_penyedia_jasa !== id_penyedia_jasa) {
      throw new Error(
        "Akses ditolak. Hanya penyedia jasa yang dapat memproses pesanan ini",
      );
    }

    const st = this.normalisasiStatus(pesanan.status_pesanan);

    if (
      st !== "MENUNGGU_KONFIRMASI" &&
      st !== "MENUNGGU_PEMBAYARAN"
    ) {
      throw new Error("Pesanan ini sudah diproses sebelumnya");
    }

    return {
      ...pesanan,
      status_pesanan: act === "terima" ? "DIPROSES" : "DITOLAK",
      status_pembayaran:
        act === "tolak" &&
        this.normalisasiStatus(pesanan.status_pembayaran) === "LUNAS"
          ? "DIKEMBALIKAN"
          : pesanan.status_pembayaran,
      updated_at: new Date().toISOString(),
    };
  }

  // Mengambil daftar pesanan di memori
  static ambilDaftarPesananDiMemori(
    daftar_pesanan: Pesanan[],
    daftar_jasa: Jasa[],
    id_pengguna: string,
    peran: "pengguna_jasa" | "penyedia_jasa",
    filter_status?: string,
  ): Pesanan[] {
    if (!id_pengguna?.trim()) {
      throw new Error("ID pengguna tidak valid");
    }

    if (peran !== "pengguna_jasa" && peran !== "penyedia_jasa") {
      throw new Error("Peran pengguna tidak valid");
    }

    const f = this.normalisasiStatus(filter_status);

    return daftar_pesanan
      .filter((p) =>
        peran === "pengguna_jasa"
          ? p.id_pengguna_jasa === id_pengguna
          : p.id_penyedia_jasa === id_pengguna,
      )
      .filter((p) => {
        if (!f || f === "SEMUA") return true;

        const st = this.normalisasiStatus(p.status_pesanan);

        if (f === "BERJALAN") return this.apakahPesananAktif(st);

        if (f === "DIKEMBALIKAN") {
          return st === "DITOLAK" || st === "DIKEMBALIKAN";
        }

        return st === f;
      })
      .map((p) => ({
        ...p,
        jasa: p.jasa ?? daftar_jasa.find((j) => j.id_jasa === p.id_jasa),
      }))
      .sort((a, b) => waktu(b) - waktu(a));
  }

  // Mengambil detail pesanan di memori
  static ambilDetailPesananDiMemori(
    daftar_pesanan: Pesanan[],
    daftar_jasa: Jasa[],
    id_pesanan: string,
  ): Pesanan {
    if (!id_pesanan?.trim()) {
      throw new Error("ID pesanan tidak valid");
    }

    const pesanan = daftar_pesanan.find(
      (p) => p.id_pesanan === id_pesanan,
    );

    if (!pesanan) throw new Error("Pesanan tidak ditemukan");

    return {
      ...pesanan,
      jasa:
        pesanan.jasa ??
        daftar_jasa.find((j) => j.id_jasa === pesanan.id_jasa),
    };
  }

  // UC09: membuat pesanan baru di Supabase
  static async buatPesananBaru(
    id_pengguna_jasa: string,
    id_jasa: string,
    brief_kebutuhan: string,
  ): Promise<Pesanan> {
    if (!id_pengguna_jasa?.trim() || !id_jasa?.trim()) {
      throw new Error("Parameter pemesanan tidak valid");
    }

    if (!brief_kebutuhan?.trim()) {
      throw new Error("Brief pemesanan wajib diisi");
    }

    const supabase = await createClient();

    const { data: jasa, error: errJasa } = await supabase
      .from("jasa")
      .select("*")
      .eq("id_jasa", id_jasa)
      .eq("status_aktif", true)
      .maybeSingle();

    if (errJasa) throw new Error(errJasa.message);
    if (!jasa) throw new Error("Data jasa tidak ditemukan");

    if (jasa.id_penyedia_jasa === id_pengguna_jasa) {
      throw new Error("Tidak dapat memesan jasa milik sendiri");
    }

    const { data: listAktif, error: errAktif } = await supabase
      .from("pesanan")
      .select("id_pesanan, id_jasa, status_pesanan")
      .eq("id_pengguna_jasa", id_pengguna_jasa);

    if (errAktif) throw new Error(errAktif.message);

    const belumDibayar = (p: { status_pesanan: string }) =>
      this.normalisasiStatus(p.status_pesanan) === "MENUNGGU_PEMBAYARAN";

    // Pesanan jasa yang sama yang belum dibayar dipakai ulang (brief diperbarui), tidak membuat pesanan baru
    const pesananGantung = (listAktif ?? []).find((p) => p.id_jasa === id_jasa && belumDibayar(p));
    if (pesananGantung) {
      const { data: diperbarui, error: errUlang } = await supabase
        .from("pesanan")
        .update({
          brief: brief_kebutuhan.trim(),
          total_biaya: Number(jasa.harga),
          updated_at: new Date().toISOString(),
        })
        .eq("id_pesanan", pesananGantung.id_pesanan)
        .select("*, jasa(*)")
        .single();

      if (errUlang) throw new Error(errUlang.message);
      return diperbarui as Pesanan;
    }

    // Yang dihitung aktif hanya pesanan yang sudah dibayar dan belum selesai
    const jmlAktif = (listAktif ?? []).filter(
      (p) => this.apakahPesananAktif(p.status_pesanan) && !belumDibayar(p),
    ).length;

    if (jmlAktif >= MAKS_PESANAN_AKTIF) {
      throw new Error(
        `Batas maksimal ${MAKS_PESANAN_AKTIF} pesanan aktif telah tercapai`,
      );
    }
    const { data, error } = await supabase
      .from("pesanan")
      .insert({
        id_pengguna_jasa,
        id_penyedia_jasa: jasa.id_penyedia_jasa,
        id_jasa,
        brief: brief_kebutuhan.trim(),
        total_biaya: Number(jasa.harga),
        status_pembayaran: "MENUNGGU_PEMBAYARAN",
        status_pesanan: "MENUNGGU_PEMBAYARAN",
      })
      .select("*, jasa(*)")
      .single();

    if (error) throw new Error(error.message);

    return data as Pesanan;
  }

  // UC10: konfirmasi pesanan di Supabase
  static async konfirmasiPesanan(
    id_pesanan: string,
    id_penyedia_jasa: string,
    tindakan: "terima" | "tolak" | string,
  ): Promise<Pesanan> {
    if (!id_pesanan?.trim() || !id_penyedia_jasa?.trim()) {
      throw new Error("Identitas pesanan tidak valid");
    }

    const t = tindakan?.toLowerCase();

    const act =
      t === "diterima" || t === "terima"
        ? "terima"
        : t === "ditolak" || t === "tolak"
          ? "tolak"
          : null;

    if (!act) throw new Error("Tindakan konfirmasi tidak valid");

    const supabase = await createClient();

    const { data: pesanan, error: errFetch } = await supabase
      .from("pesanan")
      .select("*")
      .eq("id_pesanan", id_pesanan)
      .maybeSingle();

    if (errFetch) throw new Error(errFetch.message);
    if (!pesanan) throw new Error("Pesanan tidak ditemukan");

    const diperbarui = this.konfirmasiPesananDiMemori(
      [pesanan as Pesanan],
      id_pesanan,
      id_penyedia_jasa,
      act,
    );

    const { data, error } = await supabase
      .from("pesanan")
      .update({
        status_pesanan: diperbarui.status_pesanan,
        status_pembayaran: diperbarui.status_pembayaran,
        updated_at: diperbarui.updated_at,
      })
      .eq("id_pesanan", id_pesanan)
      .select("*, jasa(*)")
      .single();

    if (error) throw new Error(error.message);

    return data as Pesanan;
  }

  // Ambil daftar pesanan berdasarkan peran & filter status
  static async ambilDaftarPesanan(
    id_pengguna: string,
    peran: "pengguna_jasa" | "penyedia_jasa",
    filter_status?: string,
  ): Promise<PesananDenganStatusUlasan[]> {
    if (!id_pengguna?.trim()) {
      throw new Error("ID pengguna tidak valid");
    }

    if (peran !== "pengguna_jasa" && peran !== "penyedia_jasa") {
      throw new Error("Peran pengguna tidak valid");
    }

    const supabase = await createClient();

    const kolom =
      peran === "pengguna_jasa"
        ? "id_pengguna_jasa"
        : "id_penyedia_jasa";

    const { data, error } = await supabase
      .from("pesanan")
      .select(`
        *,
        jasa(*),
        ulasan(id_ulasan, rating),
        penyedia_jasa:penyedia_jasa!pesanan_id_penyedia_jasa_fkey(
          id,
          pengguna:pengguna!penyedia_jasa_id_fkey(
            id,
            nama
          )
        ),
        pemesan:pengguna_jasa!pesanan_id_pengguna_jasa_fkey(
          pengguna:pengguna!pengguna_jasa_id_fkey( nama )
        )
      `)
      .eq(kolom, id_pengguna)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    type RelasiUlasan = {
      id_ulasan: string;
      rating: number;
    };

    type RelasiPenyedia = {
      id: string;
      pengguna: {
        id: string;
        nama: string;
      } | null;
    } | null;

    type RelasiPemesan = {
      pengguna: { nama: string } | null;
    } | null;

    type PesananQuery = Pesanan & {
      ulasan?: RelasiUlasan | RelasiUlasan[] | null;
      penyedia_jasa?: RelasiPenyedia;
      pemesan?: RelasiPemesan;
    };

    const daftar = (data ?? []) as unknown as PesananQuery[];

    const hasil = this.ambilDaftarPesananDiMemori(
      daftar,
      [],
      id_pengguna,
      peran,
      filter_status,
    );

    const dataPerPesanan = new Map(
      daftar.map((item) => {
        const relasiUlasan = item.ulasan;

        const ulasan = Array.isArray(relasiUlasan)
          ? relasiUlasan[0]
          : relasiUlasan;

        return [
          item.id_pesanan,
          {
            ulasan: ulasan ?? null,
            penyedia_jasa: item.penyedia_jasa ?? null,
            nama_pemesan: item.pemesan?.pengguna?.nama ?? null,
          },
        ] as const;
      }),
    );

    return hasil.map((pesanan) => {
      const dataRelasi = dataPerPesanan.get(pesanan.id_pesanan);
      const ulasan = dataRelasi?.ulasan;

      return {
        ...pesanan,
        penyedia_jasa: dataRelasi?.penyedia_jasa ?? null,
        // Dipakai halaman Pesanan Masuk penyedia
        nama_pemesan: dataRelasi?.nama_pemesan ?? null,
        sudah_diulas: Boolean(ulasan?.id_ulasan),
        rating_ulasan: ulasan?.rating ?? null,
      };
    });
  }

  // Ambil detail pesanan berdasarkan ID beserta nama penyedia jasa
  static async ambilDetailPesanan(
    id_pesanan: string,
  ): Promise<PesananDetail> {
    if (!id_pesanan?.trim()) {
      throw new Error("ID pesanan tidak valid");
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("pesanan")
      .select(`
        *,
        jasa(*),
        pengguna_jasa:pengguna_jasa!pesanan_id_pengguna_jasa_fkey(
          id,
          pengguna:pengguna!pengguna_jasa_id_fkey(
            id,
            nama
          )
        ),
        penyedia_jasa:penyedia_jasa!pesanan_id_penyedia_jasa_fkey(
          id,
          pengguna:pengguna!penyedia_jasa_id_fkey(
            id,
            nama
          )
        )
      `)
      .eq("id_pesanan", id_pesanan)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) throw new Error("Pesanan tidak ditemukan");

    return data as unknown as PesananDetail;
  }
}

export { PesananService as PengontrolPesanan };
