import { NextResponse } from "next/server";
import { openDB } from "@/database/db_connection";
import jwt from "jsonwebtoken";
const secretKey = process.env.SECRET_KEY;

export async function POST(req) {
    let db;
    try {
        const token = req.cookies.get("token")?.value;
        const decoded = jwt.verify(token, secretKey);
        const { username, goal_days, motivationalMessage } = await req.json();

        db = await openDB();

        await db.run(
            `UPDATE users 
             SET username = ?, 
                 goal_days = ?, 
                 motivationalMessage = ?
             WHERE id = ?`,
            [username, goal_days, motivationalMessage, decoded.id]
        );

        return NextResponse.json({ 
            success: true, 
            message: "Settings updated successfully" 
        });
    } catch (error) {
        console.error("Error updating settings:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update settings" },
            { status: 500 }
        );
    } finally {
        if (db) await db.close();
    }
} 