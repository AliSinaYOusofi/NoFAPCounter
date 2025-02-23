import { openDB } from "@/database/db_connection";
import { NextResponse } from "next/server";
const secretKey = process.env.SECRET_KEY;
import jwt from "jsonwebtoken";
export async function POST(req) {
  try {
    const db = await openDB();
    const auth_token = req.cookies.get("token")?.value;
    
    if (!auth_token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
        decoded = jwt.verify(auth_token, secretKey);
    } catch (error) {
      console.log(error)
      return NextResponse.json(
          { success: false, message: "Invalid or expired token" },
          { status: 401 }
      );
    }
    const user = await db.get(
      `SELECT 
        currentStreak, 
        longestStreak, 
        updated_at,
        goal_days,
        motivationalMessage,
        totalCleanDays,
        started_at
       FROM users WHERE id = ?`,
      [decoded.id]
    );

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      ...user  // This will include all user fields
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}