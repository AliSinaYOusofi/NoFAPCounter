
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import validator from "validator";
import { openDB } from "@/database/db_connection";
const secretKey = process.env.SECRET_KEY;

export async function PUT(req) {
    let db;
    let auth_token = req.cookies.get("token")?.value;

    let decoded;
    try {
        decoded = jwt.verify(auth_token, secretKey);
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Invalid or expired token" },
            { status: 401 }
        );
    }
    
    try {
        const { id, goal, description } = await req.json();

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Goal ID is required" },
                { status: 400 }
            );
        }

        if (!String(goal).length || !String(description).length) {
            return NextResponse.json(
                { success: false, message: "Goal and description are required" },
                { status: 405 }
            );
        }

        const santizedGoal = validator.escape(goal);
        const sanitizedDescription = validator.escape(description);

        if (!santizedGoal || !sanitizedDescription) {
            return NextResponse.json(
                { success: false, message: "Invalid input" },
                { status: 405 }
            );
        }

        db = await openDB();

        const goalExists = db.get(
            "SELECT * FROM goals WHERE id = ? AND user_id = ?",
            [id, decoded.id],
            (err, row) => {
                if (err) {
                    return NextResponse.json(
                        { success: false, message: "Goal not found or unauthorized" },
                        { status: 405 }
                    );
                }
            }
        );

        if (!goalExists) {
            
            db.close();
            
            return NextResponse.json(
              { success: false, message: "Goal not found or unauthorized" },
              { status: 404 }
            );
        }

        const query = `UPDATE goals SET goal = ?, description = ? WHERE id = ? AND user_id = ?`;

        
        db.run(
            query,
            [santizedGoal, sanitizedDescription, id, decoded.id],
            function(error) {
                if (error) {
                    return NextResponse.json(
                        { success: false, message: "Failed to update goal" },
                        { status: 500 }
                    );
                } else if (this.changes === 0) {
                    return NextResponse.json(
                        { success: false, message: "Goal not found or unauthorized" },
                        { status: 405 }
                    );
                }
            }
        );
        

        db.close();
        return NextResponse.json(
            { success: true, message: "Goal updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        if (db) db.close();
        console.error("Error updating goal:", error);

        return NextResponse.json(
            { 
                success: false, 
                message: error.message === "Goal not found or unauthorized" 
                    ? error.message 
                    : "Failed to update goal"
            },
            { status: 500 }
        );
    }
}
