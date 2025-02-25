import { NextResponse } from "next/server";
import validator from "validator";
import { nanoid } from "nanoid";
const secretKey = process.env.SECRET_KEY;
import jwt from "jsonwebtoken";
import { supabase } from "@/utils/supabase";

export async function POST(req) {
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
        const { goal, description } = await req.json();

        if (!String(goal).length || !String(goal).length) {
            return NextResponse.json(
                {
                    success: false,
                },
                {
                    status: 405,
                }
            );
        } else if (!goal || !description) {
            return NextResponse.json(
                {
                    success: false,
                },
                {
                    status: 405,
                }
            );
        }

        const santizedGoal = validator.escape(goal);
        const sanitizedDescription = validator.escape(description);

        if (!santizedGoal || !sanitizedDescription) {
            return NextResponse.json(
                {
                    success: false,
                },
                {
                    status: 405,
                }
            );
        }

        const created_at = new Date().toISOString();
        const id = nanoid();

        const { data, error } = await supabase.from("goals").insert([
            {
                id,
                user_id: decoded.id,
                goal,
                description,
                created_at,
            },
        ]);

        if (error) {
            console.error("Error while saving data to DB", error);
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to save data",
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Data saved successfully",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error("Error saving goals to database:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to save data",
            },
            { status: 500 }
        );
    }
}

// get data

export async function GET(req) {

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
        const { data: goals, error } = await supabase
            .from("goals")
            .select("*")
            .eq("user_id", decoded.id)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error while fetching goals:", error);
            return NextResponse.json(
                { success: false, message: "Failed while fetching goals" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: goals,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error("Error getting goals from DB:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to save data",
            },
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Goal ID is required." },
                { status: 400 }
            );
        }

        const { error, count } = await supabase
            .from("goals")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Error while deleting goal:", error);
            return NextResponse.json(
                { success: false, message: "Failed to delete goal" },
                { status: 500 }
            );
        }

        if (count === 0) {
            return NextResponse.json(
                { success: false, message: "Goal not found." },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Goal was deleted." },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting goal:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete goal." },
            { status: 500 }
        );
    }
}
