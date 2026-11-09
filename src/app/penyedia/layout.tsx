import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";

export default function PenyediaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar peran="PENYEDIA_JASA" />
      {children}
      <Footer peran="PENYEDIA_JASA" />
    </>
  );
}