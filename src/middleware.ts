import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
    return await updateSession(request);
}

export const config = {
    matcher: [
        /*
        * Cocokkan semua path request kecuali yang berawalan dengan:
        * - _next/static (file statis)
        * - _next/image (file optimasi gambar)
        * - favicon.ico (icon)
        * - ekstensi file gambar (.svg, .png, .jpg, dll.)
        */

        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};