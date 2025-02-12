import { serialize } from "cookie";
import { NextResponse } from "next/server";

export async function POST(req, res) {
    
    return NextResponse.json(
        {
            message: "Logged out done",
            success: true
        },
        {
            headers: {
                "Set-Cookie":
                    serialize("token", "", {
                        httpOnly: true,
                        secure: true,
                        sameSite: "strict",
                        expires: new Date(0),
                        path: "/",
                    })
            },
            status: 200
        }
    );
}
