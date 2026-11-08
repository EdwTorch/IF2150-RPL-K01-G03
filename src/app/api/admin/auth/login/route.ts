import { NextRequest, NextResponse } from "next/server";
import { AuthError, loginAdmin } from "@/services/auth.service";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body ?? {};

        if (typeof email !== "string" || typeof password !== "string") {
            return NextResponse.json(
                { 
                    success : false,
                    message : "Email dan password harus berupa teks",
                },
                { status: 400 }
            );
        }

        const result = await loginAdmin(email, password);
        return NextResponse.json(
            {
                success : true,
                message : "login Admin berhasil",
                result
            }, 
            { status: 200 });

    } catch (err) {
        if (err instanceof AuthError) {
            const statusMap: Record<AuthError["code"], number> = {
                EMPTY_INPUT: 400,
                INVALID_CREDENTIALS: 401,
                ACCOUNT_SUSPENDED: 403,
                PROFILE_NOT_FOUND: 403,
                FORBIDDEN: 403,
                LOGOUT_FAILED: 500,
            };
            return NextResponse.json(
        { 
            success: false, 
            message: err.message, 
            code: err.code 
        },
        { status: statusMap[err.code] ?? 400 }
        );
    }

        return NextResponse.json(
            { 
                success : false,
                message : "Terjadi kesalahan pada server."
            },
            { status: 500 }
        );
    }
}