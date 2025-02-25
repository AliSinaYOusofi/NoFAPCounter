import { NextResponse } from "next/server";
import { usernameValidator } from "@/utils/validators/usernameValidator";
import validator from "validator";
import jwt from "jsonwebtoken";
import { idValidator } from "@/utils/validators/id_validator";
import { serialize } from "cookie";
import { supabase } from "@/utils/supabase";

const secret_key = process.env.SECRET_KEY;

function signToken(payload, secret) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, (error, token) => {
      if (error) return reject(error);
      resolve(token);
    });
  });
}

export async function POST(req) {

  try {
    const { username, motivationalMessage, id, goal_days } = await req.json();

    const sanitizedUsername = validator.escape(username);
    const sanitizedMotivationalMessage = motivationalMessage ? validator.escape(motivationalMessage) : '';
    const sanitizedID = validator.escape(id);
    const sanitizedGoalDays = parseInt(goal_days) || 90; // Default to 90 if not provided

    if (!sanitizedUsername || !sanitizedID) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 405 }
      );
    }

    if (!usernameValidator(sanitizedUsername) || !idValidator(sanitizedID)) {
      return NextResponse.json(
        { success: false, message: "Invalid input format" },
        { status: 400 }
      );
    }

    // Check if ID already exists
    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('id')
      .eq('id', sanitizedID);

    if (selectError) {
      return NextResponse.json(
        { success: false, message: "ID already exists" },
        { status: 401 }
      );
    }

    if (existingUser && existingUser.length > 0) {
      return NextResponse.json(
        { success: false, message: 'ID already exists' },
        { status: 401 }
      );
    }

    // Get current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().split('T')[0];

    // Insert new user
    const { error: userInsertError } = await supabase.from('users').insert([
      {
        id: sanitizedID,
        username: sanitizedUsername,
        currentStreak: 0,
        longestStreak: 0,
        totalCleanDays: 0,
        motivationalMessage: sanitizedMotivationalMessage,
        started_at: currentDate,
        updated_at: currentDate,
        goal_days: sanitizedGoalDays,
      },
    ]);

    if (userInsertError) {
      console.error('Error inserting user:', userInsertError);
      return NextResponse.json(
        { success: false, message: 'Failed to create account' },
        { status: 500 }
      );
    }

    // Insert initial milestone into the "milestones" table
    const { error: milestoneError } = await supabase
      .from('milestones')
      .insert([
        {
          user_id: sanitizedID,
          days_reached: 0,
          achieved_at: currentDate,
          milestone_type: 'personal_best',
        },
      ]);

    if (milestoneError) {
      console.error('Error inserting milestone:', milestoneError);
      return NextResponse.json(
        { success: false, message: 'Failed to create milestone' },
        { status: 500 }
      );
    }

    // Create initial streak log
    const { error: streakLogError } = await supabase
      .from('streak_logs')
      .insert([
        {
          user_id: sanitizedID,
          date: currentDate,
          status: 'clean',
          streak_count: 0,
        },
      ]);

    if (streakLogError) {
      console.error('Error inserting streak log:', streakLogError);
      return NextResponse.json(
        { success: false, message: 'Failed to create streak log' },
        { status: 500 }
      );
    }

    const token = await signToken(
      { username: sanitizedUsername, id: sanitizedID },
      secret_key
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 365 * 10, // 10 years
      path: "/"
    };

    const cookieString = serialize("token", token, cookieOptions);

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        token
      },
      {
        status: 200,
        headers: {
          "Set-Cookie": cookieString,
          "Content-Type": "application/json"
        }
      }
    );

  } catch (error) {
    console.error("Error in submit_form:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create account"
      },
      { status: 500 }
    );
  }
}
