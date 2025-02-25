import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
const secretKey = process.env.SECRET_KEY;
import { supabase } from "@/utils/supabase";
export async function POST(req) {

    try {
        const token = req.cookies.get("token")?.value;
        const decoded = jwt.verify(token, secretKey);
        const { username, goal_days, motivationalMessage } = await req.json();

        const { error } = await supabase
            .from("users")
            .update({
                username: username,
                goal_days: goal_days,
                motivationalMessage: motivationalMessage,
            })
            .eq("id", decoded.id);

        if (error) {
            console.error("Error updating user:", error);
            return NextResponse.json(
                { success: false, message: "Failed to update user" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Settings updated successfully",
        });
    } catch (error) {
        console.error("Error updating settings:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update settings" },
            { status: 500 }
        );
    }
}
