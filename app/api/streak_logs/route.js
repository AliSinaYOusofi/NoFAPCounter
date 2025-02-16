import { openDB } from "@/database/db_connection";
import { NextResponse } from "next/server";
const secretKey = process.env.SECRET_KEY;
import jwt from "jsonwebtoken";
import { createMilestone, checkMilestoneEligibility } from '@/utils/milestone_helpers';

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
        return NextResponse.json(
            { success: false, message: "Invalid or expired token" },
            { status: 401 }
        );
    }

    // Get user's streak logs
    const logs = await db.all(
      `SELECT date, status, streak_count 
       FROM streak_logs 
       WHERE user_id = ? 
       ORDER BY date DESC`,
      [decoded.id]
    );

    return NextResponse.json({
      success: true,
      data: logs
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const db = await openDB();
    const { status, date } = await req.json();
    const auth_token = req.cookies.get("token")?.value;
    
    if (!auth_token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
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

    // Get user's current data
    const user = await db.get(
      `SELECT currentStreak, longestStreak FROM users WHERE id = ?`,
      [decoded.id]
    );

    // Insert new streak log
    await db.run(
      `INSERT INTO streak_logs (user_id, date, status, streak_count) 
       VALUES (?, ?, ?, ?)`,
      [decoded.id, date, status, user.currentStreak]
    );

    // Check for milestone eligibility
    const eligibleMilestones = checkMilestoneEligibility(user.currentStreak);
    
    // Create new milestones if eligible
    for (const milestone of eligibleMilestones) {
      await createMilestone(db, decoded.id, milestone.days, milestone.type);
    }

    // Check for personal best
    if (user.currentStreak > user.longestStreak) {
      await createMilestone(db, decoded.id, user.currentStreak, 'personal_best');
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 