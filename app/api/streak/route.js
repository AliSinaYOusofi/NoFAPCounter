import { NextResponse } from "next/server";
const secretKey = process.env.SECRET_KEY;
import jwt from "jsonwebtoken";
import { supabase } from "@/utils/supabase";
export async function POST(req) {
  try {
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
    
    const { data: user, error: userError } = await supabase
      .from("users")
      .select(`
        currentStreak, 
        longestStreak, 
        updated_at,
        goal_days,
        motivationalMessage,
        totalCleanDays,
        started_at
      `)
      .eq("id", decoded.id)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      ...user
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}