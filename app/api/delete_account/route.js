import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
const secretKey = process.env.SECRET_KEY;
import { supabase } from "@/utils/supabase";
export async function DELETE(req) {
    
    try {
        const token = req.cookies.get("token")?.value;
        const decoded = jwt.verify(token, secretKey);

        // Delete all related data
        const { error: streakLogsError } = await supabase
            .from("streak_logs")
            .delete()
            .eq("user_id", decoded.id);

        const { error: milestonesError } = await supabase
            .from("milestones")
            .delete()
            .eq("user_id", decoded.id);

        const { error: userError } = await supabase
            .from("users")
            .delete()
            .eq("id", decoded.id);

        if (streakLogsError || milestonesError || userError) {
            console.error(
                "Error deleting account data:",
                streakLogsError,
                milestonesError,
                userError
            );
            return NextResponse.json(
                { success: false, message: "Failed to delete account" },
                { status: 500 }
            );
        }

        const response = NextResponse.json({
            success: true,
            message: "Account deleted successfully",
        });

        response.cookies.delete("token");

        return response;

    } catch (error) {
        console.error("Error deleting account:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete account" },
            { status: 500 }
        );
    }
}
