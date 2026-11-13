import { redirect } from "next/navigation";

// Daftar pesanan pengguna ada di Riwayat Transaksi
export default function Page() {
  redirect("/pengguna/riwayat-transaksi");
}