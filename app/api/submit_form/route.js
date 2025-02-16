import { NextResponse } from "next/server";
import { openDB } from "@/database/db_connection";
import { usernameValidator } from "@/utils/validators/usernameValidator";
import validator from "validator";
import { createUsersTable } from "@/database/create_users_table";
import jwt from "jsonwebtoken";
import { idValidator } from "@/utils/validators/id_validator";
import { serialize } from "cookie";
import { createStreakLogsTable } from "@/database/create_streak_logs";
import { createMilestonesTable } from "@/database/create_milestones_table";

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
  let db;

  try {
    const { username, motivationalMessage, id, goal_days } = await req.json();

    // Sanitize inputs
    const sanitizedUsername = validator.escape(username);
    const sanitizedMotivationalMessage = motivationalMessage ? validator.escape(motivationalMessage) : '';
    const sanitizedID = validator.escape(id);
    const sanitizedGoalDays = parseInt(goal_days) || 90; // Default to 90 if not provided

    // Validate required fields
    if (!sanitizedUsername || !sanitizedID) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 405 }
      );
    }

    // Validate format of fields
    if (!usernameValidator(sanitizedUsername) || !idValidator(sanitizedID)) {
      return NextResponse.json(
        { success: false, message: "Invalid input format" },
        { status: 400 }
      );
    }

    db = await openDB();
    await createUsersTable();
    await createStreakLogsTable();
    await createMilestonesTable()

    // Check if ID already exists
    const existingUser = await db.get(
      "SELECT id FROM users WHERE id = ?",
      [sanitizedID]
    );

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "ID already exists" },
        { status: 401 }
      );
    }

    // Get current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().split('T')[0];

    // Insert new user
    await db.run(
      `INSERT INTO users (
        id, 
        username, 
        currentStreak,
        longestStreak,
        totalCleanDays,
        motivationalMessage,
        started_at,
        updated_at,
        goal_days
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        sanitizedID,
        sanitizedUsername,
        0,
        0,
        0,
        sanitizedMotivationalMessage,
        currentDate,
        currentDate,
        sanitizedGoalDays
      ]
    );

    // Create initial milestone for starting the journey
    await db.run(
      `INSERT INTO milestones (
        user_id,
        days_reached,
        achieved_at,
        milestone_type
      ) VALUES (?, ?, ?, ?)`,
      [
        sanitizedID,
        0,
        currentDate,
        'personal_best'
      ]
    );

    // Create initial streak log
    await db.run(
      `INSERT INTO streak_logs (
        user_id,
        date,
        status,
        streak_count
      ) VALUES (?, ?, ?, ?)`,
      [
        sanitizedID,
        currentDate,
        'clean',
        0
      ]
    );

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

    await db.close();

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
    if (db) await db.close();
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
