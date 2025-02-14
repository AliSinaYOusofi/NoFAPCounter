import { NextResponse } from "next/server";

export function middleware(request) {
    
    const authToken = request.cookies.get("token")?.value;

    const protectedPaths = ["/dashboard", "/api/user_data", "/save_goal"];

    const isProtectedPath = protectedPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path)
    );

    if (isProtectedPath && !authToken) {
        return NextResponse.redirect(new URL("/forward", request.url));
    }

    if (request.nextUrl.pathname.startsWith("/api") && !authToken) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: "authentication failed",
            }),
            {
                status: 401,
                headers: { "content-type": "application/json" },
            }
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
        "/api/user_data",
        "/save_goal",
    ],
};
