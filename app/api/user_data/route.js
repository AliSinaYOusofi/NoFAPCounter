import { NextRequest, NextResponse } from "next/server";
import { openDB } from "@/database/db_connection";
import jwt from "jsonwebtoken";
const secretKey = process.env.SECRET_KEY;
import { headers } from "next/headers";

export async function GET(req, res) {
  
  try {
    const headersList = await headers();
    const authorization_get_token = headersList
      .get("Authorization")
      ?.split(" ")[1];

    const token = authorization_get_token;

    if (!headersList.has("Authorization")) {
      return NextResponse.json(
        { success: false, message: "Missing Authorization header" },
        { status: 401 },
      );
    } else if (!token) {
      return NextResponse.json(
        { success: false, message: "No Authorization token provided" },
        { status: 400 },
      );
    }

    let decoded;

    try {
      decoded = jwt.verify(token, secretKey);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 },
      );
    }

    const db = await openDB();

    const user = await db.get(
      "SELECT username, startDate, currentStreak, motivationalMessage, started_at FROM users WHERE username = ?",
      [decoded.username],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      },
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    db.close();

    return NextResponse.json({ success: true, ...user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch user data" },
      { status: 500 },
    );
  }
}
