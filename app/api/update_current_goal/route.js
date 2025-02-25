import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { supabase } from "@/utils/supabase";
const secretKey = process.env.SECRET_KEY;

export async function POST(request) {
    
    const auth_token = request.cookies.get("token")?.value;
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
        const { goal } = await request.json();

        // Fetch user's current goal_days
        const { data: currentStreak, error: fetchError } = await supabase
            .from("users")
            .select("goal_days")
            .eq("id", decoded.id)
            .single();

        if (fetchError) {
            console.error("Error fetching user streak:", fetchError);
            return NextResponse.json(
                { success: false, message: "User streak not found" },
                { status: 404 }
            );
        }

        // Check if the goal is already set
        if (Number(goal) === currentStreak.goal_days) {
            return NextResponse.json(
                {
                    success: true,
                    message: "Goal is already set to this value",
                    data: currentStreak,
                },
                { status: 200 }
            );
        }

        // Update goal_days
        const { error: updateError } = await supabase
            .from("users")
            .update({ goal_days: goal })
            .eq("id", decoded.id);

        if (updateError) {
            console.error("Error updating goal:", updateError);
            return NextResponse.json(
                { success: false, message: "Failed to update goal" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "New goal was set",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating streak:", error);
        return NextResponse.json(
            { success: false, message: "Error updating streak" },
            { status: 500 }
        );
    }
}
