import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function updateSession(request: NextRequest) {
    let supabase_response = NextResponse.next({
        request
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },

                setAll(cookies_to_set) {
                    cookies_to_set.forEach(({ name, value }) => request.cookies.set(name, value));
                    supabase_response = NextResponse.next({
                        request
                    });

                    cookies_to_set.forEach(({ name, value, options }) =>
                        supabase_response.cookies.set(name, value, options)
                    );
                }
            }
        }
    );

    const { data: user } = await supabase.auth.getUser();

    // Agar cookie sesi terbaru ikut terbawa ke response redirect
    const redirect_with_cookies = (path_name: string) => {
        const url = request.nextUrl.clone();
        url.pathname = path_name;

        const redirect_response = NextResponse.redirect(url);
        supabase_response.cookies.getAll().forEach((cookie) => {
            redirect_response.cookies.set(cookie)
        });
        return redirect_response;
    };

    const path_name = request.nextUrl.pathname;

    // Menolak akses ke dashboard jika belum login
    if (!user && path_name.startsWith("/dashboard")) {
        return redirect_with_cookies("/login");
    }

    // Menolak akses ke halaman login dan register jika sudah login
    if (user && (path_name.startsWith("/login") || path_name.startsWith("/register"))) {
        return redirect_with_cookies("/dashboard");
    }

    return supabase_response;
}