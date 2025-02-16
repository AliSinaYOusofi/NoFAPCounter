import { openDB } from "@/database/db_connection";
import { NextResponse } from "next/server";
const secretKey = process.env.SECRET_KEY;
import jwt from "jsonwebtoken";
export async function GET(req) {
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
    const milestones = await db.all(
      `SELECT days_reached, achieved_at, milestone_type 
       FROM milestones 
       WHERE user_id = ? 
       ORDER BY achieved_at DESC`,
      [decoded.id]
    );

    return NextResponse.json({
      success: true,
      data: milestones
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 