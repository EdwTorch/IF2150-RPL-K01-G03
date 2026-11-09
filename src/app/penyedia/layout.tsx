import Navbar from "@/components/ui/navbar";

export default function PenyediaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar peran="PENYEDIA_JASA" />
      {children}
    </>
  );
}