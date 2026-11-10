import { NextRequest, NextResponse } from "next/server";
import { AuthError, login, logout, getSessionUser, registrasi, type InputRegistrasi } from "@/services/auth.service";

const STATUS_BY_CODE: Partial<Record<AuthError["code"], number>> = {
    EMPTY_INPUT: 400,
    INVALID_EMAIL: 400,
    WEAK_PASSWORD: 400,
    EMAIL_TAKEN: 409,
    INVALID_ROLE: 400,
    INVALID_CREDENTIALS: 401,
    ACCOUNT_SUSPENDED: 403,
    PROFILE_NOT_FOUND: 403,
};

function handleError(err: unknown) {
    if (err instanceof AuthError) {
        return NextResponse.json(
            { success : false, message: err.message, code: err.code },
            { status: STATUS_BY_CODE[err.code] ?? 400 }
        );
    }

    return NextResponse.json(
        { success : false, message: "Terjadi kesalahan pada server." },
        { status: 500 }
    );
}

async function me() {
    const user = await getSessionUser();

    if (!user) {
        return NextResponse.json({ success : false, message: "Tidak terautentikasi" }, { status: 401 });
    }

    return NextResponse.json({ success : true, message :"get session user berhasil",  user }, { status: 200 });
}

export async function POST(request: NextRequest) {
    let body: unknown;

    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
        { success : false, message: "Body tidak valid (harus JSON)" },
        { status: 400 }
        );
    }

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
        return NextResponse.json(
            { success : false, message: "Body harus berupa objek JSON" },
            { status: 400 }
        );
    }

    const { action, email, password } = body as {
        action?: unknown;
        email?: unknown;
        password?: unknown;
    };

    switch (action) {
        case "register": {
            const { nama, email, password, role } = body as {
                nama?: unknown; email?: unknown; password?: unknown; role?: unknown;
            };
            if (
                typeof nama !== "string" ||
                typeof email !== "string" ||
                typeof password !== "string" ||
                typeof role !== "string"
            ) {
                return NextResponse.json(
                    { success: false, message: "nama, email, password, dan role harus berupa teks" },
                    { status: 400 }
                );
            }
            try {
                const data = await registrasi({ nama, email, password, role } as InputRegistrasi);
                return NextResponse.json({ success: true, message: "Registrasi berhasil", data }, { status: 201 });
            } catch (err) {
                return handleError(err);
            }
        }

        case "login": {
            if (typeof email !== "string" || typeof password !== "string") {
                return NextResponse.json(
                    { success : false, message: "Email dan password harus berupa teks" },
                    { status: 400 }
                );
            }

            try {
                const result = await login(email, password);

                return NextResponse.json({success : true, message :"login berhasil", result}, { status: 200 });
            } catch (err) {
                return handleError(err);
            }
        }

        case "logout": {
            try {
                await logout();

                return NextResponse.json({ success : true, message: "Logout berhasil" }, { status: 200 });
            } catch (err) {
                return handleError(err);
            }
        }

        case "me":
            return me();

        default:
            return NextResponse.json({ success : false, message: "Action tidak dikenal" }, { status: 400 });
    }
}

export async function GET() {
    return me();
}