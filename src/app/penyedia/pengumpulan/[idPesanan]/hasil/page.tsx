import { redirect } from "next/navigation";

// Hasil Pekerjaan versi penyedia sekarang ada di Pesanan Masuk → /penyedia/pesanan/[idPesanan]
export default async function Page({ params }: { params: Promise<{ idPesanan: string }> }) {
  const { idPesanan } = await params;
  redirect(`/penyedia/pesanan/${idPesanan}`);
}