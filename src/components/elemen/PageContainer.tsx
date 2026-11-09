import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * PageContainer — pembungkus konten halaman: lebar maks. 1440, padding samping 80, jarak antarbagian 24
 * (sesuai frame "Konten" di layar Figma).
 */
export function PageContainer({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <main className={cn("mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-6 px-20 py-8", className)}>
      {children}
    </main>
  );
}