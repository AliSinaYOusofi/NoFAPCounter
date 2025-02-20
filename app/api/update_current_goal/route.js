import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { openDB } from "@/database/db_connection";

const secretKey = process.env.SECRET_KEY;

export async function POST(request) {
    let db;
    const auth_token = request.cookies.get("token")?.value;
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
        const { goal } = await request.json();
        db = await openDB();

        
        const currentStreak = await db.get(
            "SELECT goal_days FROM users WHERE id = ?",
            [decoded.id]
        );

        if (!currentStreak) {
            return NextResponse.json(
                { success: false, message: "User streak not found" },
                { status: 404 }
            );
        }
        console.log(currentStreak, goal, typeof goal, typeof currentStreak.goal_days)
        if (Number(goal) === currentStreak.goal_days) {
            return NextResponse.json(
                {
                    success: true,
                    message: "Goal is already set to this value",
                    data: currentStreak,
                },
                { status: 200 }
            );
        }

        await db.run(
            "UPDATE users SET goal_days = ? WHERE id = ?",
            [goal, decoded.id]
        );

        return NextResponse.json(
            {
                success: true,
                message: "New goal was set",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating streak:", error);
        return NextResponse.json(
            { success: false, message: "Error updating streak" },
            { status: 500 }
        );
    } finally {
        if (db) {
            await db.close();
        }
    }
}
