import { headers } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import validator from "validator";
const secretKey = process.env.SECRET_KEY;
import { supabase } from "@/utils/supabase";
export async function PUT(req) {
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
                {
                    success: false,
                    message: "Goal and description are required",
                },
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

        // Check if the goal exists
        const { data: goalExists, error: fetchError } = await supabase
            .from("goals")
            .select("*")
            .eq("id", id)
            .eq("user_id", decoded.id)
            .single();

        if (fetchError || !goalExists) {
            return NextResponse.json(
                { success: false, message: "Goal not found or unauthorized" },
                { status: 404 }
            );
        }

        // Update the goal
        const { error: updateError } = await supabase
            .from("goals")
            .update({ goal: santizedGoal, description: sanitizedDescription })
            .eq("id", id)
            .eq("user_id", decoded.id);

        if (updateError) {
            console.error("Error updating goal:", updateError);
            return NextResponse.json(
                { success: false, message: "Failed to update goal" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Goal was updated" },
            { status: 200 }
        );

    } catch (error) {
        
        console.error("Error updating goal:", error);

        return NextResponse.json(
            {
                success: false,
                message:
                    error.message === "Goal not found or unauthorized"
                        ? error.message
                        : "Failed to update goal",
            },
            { status: 500 }
        );
    }
}
