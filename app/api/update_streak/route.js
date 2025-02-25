import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabase } from "@/utils/supabase";
const secretKey = process.env.SECRET_KEY;

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
        // Fetch user data
        const { data: user, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", decoded.id)
            .single();

        if (userError || !user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        const currentDate = new Date().toISOString().split("T")[0];
        const lastUpdated = user.updated_at;

        const nofapGoalDays = [1, 2, 3, 5, 7, 10, 14, 21, 30, 45, 60, 90, 120, 180, 365];

        let show_goal_gained_card = false;
        let LightningEffect = true;

        if (user.currentStreak === 0) {
            // Initialize streak data
            await supabase
                .from("streak_logs")
                .upsert({
                    user_id: user.id,
                    date: currentDate,
                    status: "clean",
                    streak_count: 1,
                });

            await supabase
                .from("users")
                .update({
                    currentStreak: 1,
                    longestStreak: 1,
                    totalCleanDays: 1,
                    updated_at: currentDate,
                })
                .eq("id", user.id);

            await supabase
                .from("milestones")
                .upsert({
                    user_id: user.id,
                    days_reached: 1,
                    achieved_at: currentDate,
                });

            return NextResponse.json(
                {
                    success: true,
                    message: "Started your streak! Keep going!",
                    currentStreak: 1,
                    longestStreak: 1,
                    totalCleanDays: 1,
                    relapse: false,
                    LightningEffect,
                    showCard: true,
                },
                { status: 200 }
            );
        }

        if (currentDate === lastUpdated) {
            return NextResponse.json(
                {
                    success: true,
                    message: "Already updated today",
                    currentStreak: user.currentStreak,
                    longestStreak: user.longestStreak,
                    totalCleanDays: user.totalCleanDays,
                },
                { status: 200 }
            );
        }

        let newStreak = user.currentStreak;
        let newLongestStreak = user.longestStreak;
        let newTotalCleanDays = user.totalCleanDays;
        let isStreakReset = false;
        let status = "clean";

        const diffDays = Math.floor(
            (new Date(currentDate + "T00:00:00Z") - new Date(lastUpdated + "T00:00:00Z")) /
                (1000 * 60 * 60 * 24)
        );

        if (diffDays === 1) {
            newStreak++;
            newTotalCleanDays++;
            if (newStreak > newLongestStreak) {
                newLongestStreak = newStreak;
            }
        } else if (diffDays > 1) {
            isStreakReset = true;
            status = "relapse";
            newStreak = 1;
            newTotalCleanDays++;
        }

        // Update streak and user data
        await supabase
            .from("users")
            .update({
                currentStreak: newStreak,
                longestStreak: newLongestStreak,
                totalCleanDays: newTotalCleanDays,
                updated_at: currentDate,
            })
            .eq("id", user.id);

        await supabase
            .from("streak_logs")
            .upsert({
                user_id: user.id,
                date: currentDate,
                status,
                streak_count: newStreak,
            });

        const milestonesToCheck = [
            { days: 1, milestone_type: "daily" },
            { days: 2, milestone_type: "daily" },
            { days: 3, milestone_type: "daily" },
            { days: 5, milestone_type: "daily" },
            { days: 7, milestone_type: "weekly" },
            { days: 10, milestone_type: "weekly" },
            { days: 14, milestone_type: "weekly" },
            { days: 21, milestone_type: "weekly" },
            { days: 30, milestone_type: "monthly" },
            { days: 45, milestone_type: "monthly" },
            { days: 60, milestone_type: "monthly" },
            { days: 90, milestone_type: "monthly" },
            { days: 120, milestone_type: "monthly" },
            { days: 180, milestone_type: "monthly" },
            { days: 365, milestone_type: "yearly" },
        ];

        if (newStreak === user.goal_days) {
            await supabase
                .from("milestones")
                .upsert({
                    user_id: user.id,
                    days_reached: newStreak,
                    achieved_at: currentDate,
                    milestone_type: "goal_reached",
                });
        } else {
            for (const milestone of milestonesToCheck) {
                if (newStreak === milestone.days) {
                    await supabase
                        .from("milestones")
                        .upsert({
                            user_id: user.id,
                            days_reached: newStreak,
                            achieved_at: currentDate,
                            milestone_type: milestone.milestone_type,
                        });
                }
            }

            await supabase
                .from("milestones")
                .upsert({
                    user_id: user.id,
                    days_reached: newStreak,
                    achieved_at: currentDate,
                    milestone_type: "personal_best",
                });
        }

        if (nofapGoalDays.includes(newStreak)) show_goal_gained_card = true;

        return NextResponse.json(
            {
                success: true,
                message: isStreakReset ? "New streak started" : "Streak updated successfully",
                currentStreak: newStreak,
                longestStreak: newLongestStreak,
                totalCleanDays: newTotalCleanDays,
                relapse: isStreakReset,
                LightningEffect,
                showCard: show_goal_gained_card,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating streak:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update streak" },
            { status: 500 }
        );
    }
}