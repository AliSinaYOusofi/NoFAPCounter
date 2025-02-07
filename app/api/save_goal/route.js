import { NextRequest, NextResponse } from "next/server";
import { createGoalsTable } from "@/database/create_goals_table";
import validator from 'validator'
import { openDB } from "@/database/db_connection";
import { nanoid } from "nanoid";
import { headers } from "next/headers";
const secretKey = process.env.SECRET_KEY;
import jwt from "jsonwebtoken";

export async function POST(req) {

    let db
    let headersList = await headers()
    
    const auth_token = headersList.get("Authorization")?.split(" ")[1];

    if (! headersList.has("Authorization")) {
        return NextResponse.json(
            { success: false, message: "Missing Authorization header" },
            { status: 401 },
        );
      } 
    
    else if (!auth_token) {
        return NextResponse.json(
          { success: false, message: "No Authorization token provided" },
          { status: 400 },
        );
    }

    let decoded;
    console.log(auth_token, ' the auth token', secretKey)
    try {
        decoded = jwt.verify(auth_token, secretKey);
        console.log(decoded)
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Invalid or expired token" },
            { status: 401 },
        );
    }
    
    try {
        const {
            goal,
            description
        } = await req.json()
    
        if ( ! String(goal).length || ! String(goal).length) {
            return NextResponse.json(
                {
                  success: false,
                },
                {
                  status: 405,
                },
            );
        }
    
        else if (! goal || ! description) {
            
            return NextResponse.json(
                {
                  success: false,
                },
                {
                  status: 405,
                },
            );
        }
    
        const santizedGoal = validator.escape(goal)
        const sanitizedDescription = validator.escape(description)
    
        if ( ! santizedGoal || ! sanitizedDescription ) {
            return NextResponse.json(
                {
                  success: false,
                },
                {
                  status: 405,
                },
              );
        }

        await createGoalsTable()

        const query = `INSERT INTO goals (id, user_id, goal, description, created_at) VALUES (?, ?, ?, ?, ?)`;

        const created_at = new Date().toISOString().split("T")[0]
        const id = nanoid()

        db = await openDB()

        db.run(
            query,
            [
                id,
                decoded.id,
                goal,
                description,
                created_at
            ],
            
            function (error) {
                console.error("Error while saving data to DB", error);
        
                if (error) {
                  return NextResponse.json(
                    {
                      success: false,
                      message: "Failed to save data",
                    },
                    {
                      status: 500,
                    },
                  );
                }
            },
        )

        db.close()
        return NextResponse.json(
            {
                success: true,
                message: "Data saved successfully",
            },
            {
                status: 200,
            },
        )
    } catch (error) {
        console.error("Error saving goals to database:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to save data",
            },
            { status: 500 },
        );
    }

    
}

// get data

export async function GET(req) {
    try {
        const query = `SELECT * FROM goals ORDER BY created_at DESC`;

        const db = await openDB();
        const goals = await db.all(query);
        db.close();

        return NextResponse.json(
            {
                success: true,
                data: goals,
            },
            {
                status: 200,
            },
        );
    } catch (error) {
        console.error("Error getting goals from DB:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to save data",
            },
            { status: 500 },
        );
    }
}


export async function DELETE(req) {
    
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Goal ID is required.' },
                { status: 400 }
            );
        }

        const db = await openDB();
        const result = await db.run('DELETE FROM goals WHERE id = ?', [id]);

        if (result.changes === 0) {
            return NextResponse.json(
                { success: false, message: 'Goal not found.' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Goal deleted successfully.' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting goal:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to delete goal.' },
            { status: 500 }
        );
    }
}