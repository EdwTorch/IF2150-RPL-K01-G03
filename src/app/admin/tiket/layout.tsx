import Navbar from "@/components/ui/navbar";
import { getSessionUser } from "@/services/auth.service";
import { redirect } from "next/navigation";

export default async function AdminTiketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/admin");
  }

  return (
    <>
      <Navbar peran="ADMIN" nama={user.nama} />
      {children}
    </>
  );
}