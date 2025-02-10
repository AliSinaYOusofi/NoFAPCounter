// pages/api/streak.js

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { openDB } from "@/database/db_connection";

const secretKey = process.env.SECRET_KEY;

export async function POST(req) {
    let db;
    let headersList = await headers();
    const auth_token = headersList.get("Authorization")?.split(" ")[1];

    if (!headersList.has("Authorization")) {
        return NextResponse.json(
            { success: false, message: "Missing Authorization header" },
            { status: 401 }
        );
    } else if (!auth_token) {
        return NextResponse.json(
            { success: false, message: "No Authorization token provided" },
            { status: 400 }
        );
    }

    let decoded;
    
    try {
        decoded = jwt.verify(auth_token, secretKey);
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Invalid or expired token" },
            { status: 401 }
        );
    }
    
    try {
        db = await openDB();
        
        let user = await db.get('SELECT * FROM users WHERE id = ?;', [decoded.id]);
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, currentStreak: user.currentStreak },
            { status: 200 }
        );
    } catch (error) {
        if (db) db.close();
        console.error("Error fetching streak:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch streak" },
            { status: 500 }
        );
    }
}