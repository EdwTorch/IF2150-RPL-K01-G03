import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";

export default function PenggunaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar peran="PENGGUNA_JASA" />
      {children}
      <Footer peran="PENGGUNA_JASA" />
    </>
  );
}