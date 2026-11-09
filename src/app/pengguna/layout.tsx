import Navbar from "@/components/ui/navbar";

export default function PenggunaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar peran="PENGGUNA_JASA" />
      {children}
    </>
  );
}