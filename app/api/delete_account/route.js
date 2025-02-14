import { NextResponse } from "next/server";
import { openDB } from "@/database/db_connection";
import jwt from "jsonwebtoken";
const secretKey = process.env.SECRET_KEY;

export async function DELETE(req) {
    let db;
    try {
        const token = req.cookies.get("token")?.value;
        const decoded = jwt.verify(token, secretKey);

        db = await openDB();

        // Delete all related data
        await db.run("DELETE FROM streak_logs WHERE user_id = ?", [decoded.id]);
        await db.run("DELETE FROM milestones WHERE user_id = ?", [decoded.id]);
        await db.run("DELETE FROM users WHERE id = ?", [decoded.id]);

        // Clear the auth cookie
        const response = NextResponse.json({ 
            success: true, 
            message: "Account deleted successfully" 
        });
        
        response.cookies.delete("token");
        
        return response;
    } catch (error) {
        console.error("Error deleting account:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete account" },
            { status: 500 }
        );
    } finally {
        if (db) await db.close();
    }
} 