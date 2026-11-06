import { NextRequest, NextResponse } from "next/server";
import { AuthError, login, logout, getSessionUser } from "@/services/auth.service";
import { error } from "console";

const STATUS_BY_CODE: Partial<Record<AuthError["code"], number>> = {
    EMPTY_INPUT: 400,
    INVALID_CREDENTIALS: 401,
    ACCOUNT_SUSPENDED: 403,
    PROFILE_NOT_FOUND: 403,
};

function handleError(err: unknown) {
    if (err instanceof AuthError) {
        return NextResponse.json(
            { error: err.message, code: err.code },
            { status: STATUS_BY_CODE[err.code] ?? 400 }
        );
    }

    return NextResponse.json(
        { error: "Terjadi kesalahan pada server." },
        { status: 500 }
    );
}

export async function POST(request: NextRequest) {
    let body: unknown;

    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
        { error: "Body tidak valid (harus JSON)" },
        { status: 400 }
        );
    }

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
        return NextResponse.json(
            { error: "Body harus berupa objek JSON" },
            { status: 400 }
        );
    }

    const { action, email, password } = body as {
        action?: unknown;
        email?: unknown;
        password?: unknown;
    };

    switch (action) {
        case "login": {
            if (typeof email !== "string" || typeof password !== "string") {
                return NextResponse.json(
                    { error: "Email dan password harus berupa teks" },
                    { status: 400 }
                );
            }

            try {
                const result = await login(email, password);

                return NextResponse.json(result, { status: 200 });
            } catch (err) {
                return handleError(err);
            }
        }

        case "logout": {
            try {
                await logout();
                
                return NextResponse.json({ message: "Logout berhasil" }, { status: 200 });
            } catch (err) {
                return handleError(err);
            }
        }
    }
}