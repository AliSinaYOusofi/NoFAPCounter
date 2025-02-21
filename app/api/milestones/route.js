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
      `SELECT days_reached, achieved_at, milestone_type, id 
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

export async function DELETE(req) {
  let db
  try {
    db = await openDB()
    const auth_token = req.cookies.get("token")?.value

    if (!auth_token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    let decoded
    try {
      decoded = jwt.verify(auth_token, secretKey)
    } catch (error) {
      console.log(error)
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, error: "Milestone ID is required" }, { status: 400 })
    }

    const milestone = await db.get("SELECT * FROM milestones WHERE id = ? AND user_id = ?", [id, decoded.id])

    if (!milestone) {
      return NextResponse.json({ success: false, error: "Milestone not found or unauthorized" }, { status: 404 })
    }

    await db.run("DELETE FROM milestones WHERE id = ?", [id])

    return NextResponse.json({
      success: true,
      message: "Milestone was deleted",
    })
  } catch (error) {
    console.error("Error deleting milestone:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  } finally {
    if (db) {
      await db.close()
    }
  }
}

