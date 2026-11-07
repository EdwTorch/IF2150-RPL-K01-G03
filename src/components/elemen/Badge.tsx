import { cn } from "@/lib/cn";

/**
 * Badge angka merah — Figma "Badge Notifikasi"/"Badge Chat" di Navbar.
 * Tidak tampil jika jumlah 0; lebih dari 99 ditampilkan "99+".
 * Taruh di dalam elemen ber-`relative`, lalu atur posisi lewat className.
 */
export function Badge({ jumlah, className }: { jumlah?: number; className?: string }) {
  if (!jumlah || jumlah <= 0) return null;
  return (
    <span
      className={cn(
        "absolute flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-danger px-[5px] text-badge whitespace-nowrap text-white",
        className,
      )}
    >
      {jumlah > 99 ? "99+" : jumlah}
    </span>
  );
}
