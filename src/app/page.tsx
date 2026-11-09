import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";

export default function Home() {
  return (
    <>
      <Navbar peran="PENGGUNA_JASA" nama="Rina Putri" jumlahPesanan={1} jumlahChat={3} />
      <main className="min-h-[60vh]" />
      <Footer />
    </>
  );
}