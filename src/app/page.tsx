import Navbar from "@/components/ui/navbar";

export default function Home() {
  return (
    <main className="flex flex-col gap-6 py-6">
      <Navbar peran="TAMU" />
      <Navbar peran="PENGGUNA_JASA" nama="Rina Putri" jumlahPesanan={1} jumlahChat={3} />
      <Navbar peran="PENYEDIA_JASA" nama="Budi Santoso" jumlahPesanan={2} jumlahChat={3} />
    </main>
  );
}