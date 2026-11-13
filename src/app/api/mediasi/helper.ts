import { NextResponse } from "next/server";

type Orang = { id: string; nama: string } | null;

const satu = <T,>(nilai: T | T[] | null | undefined): T | null =>
  Array.isArray(nilai) ? (nilai[0] ?? null) : (nilai ?? null);

/** Relasi Supabase bisa berbentuk objek atau array — samakan jadi objek tunggal */
export function rapikanSesi(sesi: Record<string, unknown>) {
  const tiket = satu(sesi.tiket_laporan as Record<string, unknown> | Record<string, unknown>[] | null);
  const admin = satu(sesi.admin as Record<string, unknown> | Record<string, unknown>[] | null);
  const pengguna_admin = admin ? satu(admin.pengguna as Orang | Orang[]) : null;

  return {
    ...sesi,
    admin: undefined,
    nama_admin: pengguna_admin?.nama ?? "Admin",
    tiket_laporan: tiket
      ? {
          ...tiket,
          pelapor: satu(tiket.pelapor as Orang | Orang[]),
          terlapor: satu(tiket.terlapor as Orang | Orang[]),
        }
      : null,
  };
}

/** Ubah pesan error service jadi status HTTP yang sesuai */
export function responsGagalMediasi(err: unknown, cadangan: string) {
  const message = err instanceof Error ? err.message : cadangan;

  if (message === "UNAUTHORIZED") {
    return NextResponse.json({ success: false, message: "Silakan login terlebih dahulu." }, { status: 401 });
  }
  if (message === "FORBIDDEN") {
    return NextResponse.json({ success: false, message: "Akses khusus admin." }, { status: 403 });
  }

  const status = message.includes("Akses ditolak") ? 403 : message.includes("tidak ditemukan") ? 404 : 400;
  return NextResponse.json({ success: false, message }, { status });
}