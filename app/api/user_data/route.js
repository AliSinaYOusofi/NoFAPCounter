import { NextRequest, NextResponse } from "next/server";
import { openDB } from "@/database/db_connection";
import jwt from "jsonwebtoken";
const secretKey = process.env.SECRET_KEY;

export async function GET(req, res) {
  let db;
  try {
    let token = req.cookies.get("token")?.value;
    let decoded;

    try {
      decoded = jwt.verify(token, secretKey);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 },
      );
    }

    db = await openDB();

    const user = await db.get(
      `SELECT 
        username, 
        currentStreak,
        longestStreak,
        totalCleanDays,
        motivationalMessage,
        started_at,
        updated_at,
        goal_days
      FROM users WHERE id = ?`, 
      [decoded.id]
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    // Get streak logs for the user
    const streakLogs = await db.all(
      "SELECT date, status, streak_count FROM streak_logs WHERE user_id = ? ORDER BY date DESC LIMIT 30",
      [decoded.id]
    );

    db.close();
    return NextResponse.json({ 
      success: true, 
      ...user,
      streakHistory: streakLogs 
    }, { status: 200 });
  } catch (error) {
    if (db) db.close();
    console.error("Error fetching user data:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch user data" },
      { status: 500 },
    );
  }
}
