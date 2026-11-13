import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Alert — Figma "Alert" (6:100). Tipe Error · Success.
 * Contoh: {pesanError && <Alert tipe="error">{pesanError}</Alert>}
 */
type Props = {
  tipe?: "error" | "success";
  children: ReactNode;
  className?: string;
};

export function Alert({ tipe = "error", children, className }: Props) {
  const sukses = tipe === "success";
  return (
    <div
      role={sukses ? "status" : "alert"}
      className={cn(
        "flex min-h-12 w-full items-center gap-3 rounded-field border px-4 py-3",
        sukses ? "border-hijau-200 bg-success-subtle" : "border-merah-200 bg-danger-subtle",
        className,
      )}
    >
      <Image
        src={sukses ? "/icons/alert-success.svg" : "/icons/alert-error.svg"}
        alt=""
        width={20}
        height={20}
        className="shrink-0"
      />
      <p className={cn("min-w-0 flex-1 text-label leading-normal", sukses ? "text-success" : "text-danger")}>
        {children}
      </p>
    </div>
  );
}
