
import { headers } from "next/headers";
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
        
        let user = await db.get('SELECT * FROM users WHERE id = ?;', [decoded.id], function(err) {
            if (err) {
                return NextResponse.json(
                    { success: false, message: "Failed to update streak" },
                    { status: 500 }
                );
            }
        })

        if ( ! user ) {
            return NextResponse.json(
                { success: false, message: "Failed to update streak" },
                { status: 404 }
            );
        }

        const currentDate = new Date().toISOString().split('T')[0];
        const lastUpdated = user.updated_at;

        if (currentDate === lastUpdated) {
            return NextResponse.json(
                { success: true, message: "Already updated today", currentStreak: user.currentStreak },
                { status: 200 }
            );
        }

        const diffDays = Math.floor(
            (new Date(currentDate) - new Date(lastUpdated)) / 
            (1000 * 60 * 60 * 24)
        );

        let newStreak = user.currentStreak;
        let newUpdated = user.updated_at;

        if (diffDays === 1) {
            newStreak++;
            newUpdated = currentDate;
        } else if (diffDays > 1) {
            newStreak = 1;
            newUpdated = currentDate;
        }

        await db.run(
            `UPDATE users 
            SET currentStreak = ?, updated_at = ?
            WHERE id = ?`,
            [newStreak, newUpdated, user.id]
        );
        
        db.close();
        return NextResponse.json(
            { success: true, message: "Goal updated successfully", currentStreak: newStreak },
            { status: 200 }
        );
    } catch (error) {
        if (db) db.close();
        console.error("Error updating streak:", error);

        return NextResponse.json(
            { 
                success: false, 
                message: error.message === "User not found or unauthorized" 
                    ? error.message 
                    : "Failed to update current streak"
            },
            { status: 500 }
        );
    }
}
