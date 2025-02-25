import { NextResponse } from "next/server";
const secretKey = process.env.SECRET_KEY;
import jwt from "jsonwebtoken";
import { supabase } from "@/utils/supabase";
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
            console.log(error);
            return NextResponse.json(
                { success: false, message: "Invalid or expired token" },
                { status: 401 }
            );
        }
        const { data: milestones, error } = await supabase
            .from("milestones")
            .select("days_reached, achieved_at, milestone_type, id")
            .eq("user_id", decoded.id)
            .order("achieved_at", { ascending: false });

        if (error) {
            return NextResponse.json({
                success: false,
                message: "Failed to get data!",
            });
        }

        return NextResponse.json({
            success: true,
            data: milestones,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
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
            console.log(error);
            return NextResponse.json(
                { success: false, message: "Invalid or expired token" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Milestone ID is required" },
                { status: 400 }
            );
        }

        const { data: milestone, error: fetchError } = await supabase
            .from("milestones")
            .select("*")
            .eq("id", id)
            .eq("user_id", decoded.id)
            .single();

        if (fetchError || !milestone) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Milestone not found or unauthorized",
                },
                { status: 404 }
            );
        }

        // Delete the milestone
        const { error: deleteError } = await supabase
            .from("milestones")
            .delete()
            .eq("id", id);

        if (deleteError) {
            return NextResponse.json(
                { success: false, error: "Failed to delete milestone" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Milestone was deleted",
        });
    } catch (error) {
        console.error("Error deleting milestone:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
