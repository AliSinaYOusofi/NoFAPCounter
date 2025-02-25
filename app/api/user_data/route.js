import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
const secretKey = process.env.SECRET_KEY;
import { supabase } from "@/utils/supabase";

export async function GET(req, res) {
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

    const { data: user, error: userError } = await supabase
    .from("users")
    .select(`
      username,
      currentStreak,
      longestStreak,
      totalCleanDays,
      motivationalMessage,
      started_at,
      updated_at,
      goal_days
    `)
    .eq("id", decoded.id)
    .single();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Get streak logs for the user
    const { data: streakLogs, error: logsError } = await supabase
      .from("streak_logs")
      .select("date, status, streak_count")
      .eq("user_id", decoded.id)
      .order("date", { ascending: false })
      .limit(1);

    if (logsError) {
      console.error("Error fetching streak logs:", logsError);
      return NextResponse.json(
        { success: false, message: "Failed to fetch user data" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      ...user,
      streakHistory: streakLogs 
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch user data" },
      { status: 500 },
    );
  }
}
