import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { openDB } from "@/database/db_connection";

const secretKey = process.env.SECRET_KEY;

export async function POST(req) {
    
    let db;
    let auth_token = req.cookies.get("token")?.value;
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
            { success: true, updated_at: user.updated_at, currentStreak: user.currentStreak, start_date: user.started_at},
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