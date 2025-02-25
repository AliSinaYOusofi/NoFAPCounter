import { NextResponse } from "next/server";
const secretKey = process.env.SECRET_KEY;
import jwt from "jsonwebtoken";
import { supabase } from "@/utils/supabase";
import {
    checkMilestoneEligibility,
} from "@/utils/milestone_helpers";

export async function GET(req) {
    try {
        const auth_token = req.cookies.get("token")?.value;

        if (!auth_token) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        let decoded;
        try {
            decoded = jwt.verify(auth_token, secretKey);
        } catch (error) {
            return NextResponse.json(
                { success: false, message: "Invalid or expired token" },
                { status: 401 }
            );
        }

        // Get user's streak logs
        const { data: logs, error } = await supabase
            .from("streak_logs")
            .select("date, status, streak_count")
            .eq("user_id", decoded.id)
            .order("date", { ascending: false });

        if (error) {
            console.error("Error fetching streak logs:", error);
            return NextResponse.json(
                { success: false, message: "Failed to fetch streak logs" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, data: logs },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        const { status, date } = await req.json();
        const auth_token = req.cookies.get("token")?.value;

        if (!auth_token) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        let decoded;
        try {
            decoded = jwt.verify(auth_token, secretKey);
        } catch (error) {
            return NextResponse.json(
                { success: false, message: "Invalid or expired token" },
                { status: 401 }
            );
        }

        // Get user's current data
        // Fetch user data
        const { data: user, error: userError } = await supabase
            .from("users")
            .select("currentStreak, longestStreak")
            .eq("id", decoded.id)
            .single();

        if (userError || !user) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }

        // Insert new streak log
        const { error: streakLogError } = await supabase
            .from("streak_logs")
            .insert([
                {
                    user_id: decoded.id,
                    date: date,
                    status: status,
                    streak_count: user.currentStreak,
                },
            ]);

        if (streakLogError) {
            return NextResponse.json(
                { success: false, error: "Failed to insert streak log" },
                { status: 500 }
            );
        }

        // Check for milestone eligibility
        const eligibleMilestones = checkMilestoneEligibility(
            user.currentStreak
        );

        // Create new milestones if eligible
        for (const milestone of eligibleMilestones) {
            const { error: milestoneError } = await supabase
                .from("milestones")
                .insert([
                    {
                        user_id: decoded.id,
                        days_reached: milestone.days,
                        milestone_type: milestone.type,
                        achieved_at: date,
                    },
                ]);
            if (milestoneError) {
                console.error("Error inserting milestone:", milestoneError);
            }
        }

        // Check for personal best
        if (user.currentStreak > user.longestStreak) {
            const { error: personalBestError } = await supabase
                .from("milestones")
                .insert([
                    {
                        user_id: decoded.id,
                        days_reached: user.currentStreak,
                        milestone_type: "personal_best",
                        achieved_at: date,
                    },
                ]);
            if (personalBestError) {
                console.error(
                    "Error inserting personal best milestone:",
                    personalBestError
                );
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
