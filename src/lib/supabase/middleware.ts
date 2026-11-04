import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

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
    )

    await supabase.auth.getUser();

    return supabase_response;
}