import Navbar from "@/components/ui/navbar";

export default function AdminTiketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar peran="ADMIN" />
      {children}
    </>
  );
}