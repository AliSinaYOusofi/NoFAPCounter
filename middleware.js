import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const secretKey = process.env.SECRET_KEY;

export async function middleware(req) {
    
    const headersList = req.headers;
    const auth_token = headersList.get("Authorization")?.split(" ")[1];
    
    if (!headersList.has("Authorization")) {
        return NextResponse.json(
            { success: false, message: "Missing Authorization header" },
            { status: 401 }
        );
    }

    if (!auth_token) {
        return NextResponse.json(
            { success: false, message: "No Authorization token provided" },
            { status: 400 }
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [ '/api/user_data', '/save_goal'],
}