import { openDB } from "@/database/db_connection";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const db = await openDB();
    const token = req.headers.get("authorization")?.split(" ")[1];
    
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const goals = await db.all(
      `SELECT id, goal, description, created_at 
       FROM goals 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [token]
    );

    return NextResponse.json({
      success: true,
      data: goals
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const db = await openDB();
    const { goal, description } = await req.json();
    const token = req.headers.get("authorization")?.split(" ")[1];
    
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await db.run(
      `INSERT INTO goals (user_id, goal, description) 
       VALUES (?, ?, ?)`,
      [token, goal, description]
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const db = await openDB();
    const token = req.headers.get("authorization")?.split(" ")[1];
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await db.run(
      `DELETE FROM goals WHERE id = ? AND user_id = ?`,
      [id, token]
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 