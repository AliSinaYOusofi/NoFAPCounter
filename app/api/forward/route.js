import { NextResponse } from "next/server";
import { usernameValidator } from "@/utils/validators/usernameValidator";
import validator from "validator";
import jwt from "jsonwebtoken";
import { idValidator } from "@/utils/validators/id_validator";
import { serialize } from "cookie";
import { supabase } from "@/utils/supabase";
const secret_key = process.env.SECRET_KEY;

export async function POST(req) {

    try {
        const { username, id } = await req.json();

        const sanitizedUsername = validator.escape(username);
        const sanitizedID = validator.escape(id);

        if (!sanitizedUsername || !sanitizedID) {
            console.warn("Incomplete data provided");
            return NextResponse.json(
                { success: false, message: "Incomplete data provided" },
                { status: 400 }
            );
        }

        if (
            !usernameValidator(sanitizedUsername) ||
            !idValidator(sanitizedID)
        ) {
            console.warn("Error: Invalid values provided");
            return NextResponse.json(
                { success: false, message: "Invalid username or ID format" },
                { status: 400 }
            );
        }

        const { data: user, error } = await supabase
            .from("users")
            .select("*")
            .eq("username", sanitizedUsername)
            .eq("id", sanitizedID)
            .single();

        if (error || !user) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 365 * 10,
            path: "/",
        };

        const token = jwt.sign(
            { username: sanitizedUsername, id: sanitizedID },
            secret_key
        );

        const cookieString = serialize("token", token, cookieOptions);

        return NextResponse.json(
            {
                success: true,
                message: "Login successful",
                token,
            },
            {
                status: 200,
                headers: {
                    "Set-Cookie": cookieString,
                    "Content-Type": "application/json",
                },
            }
        );
    } catch (error) {
        console.error("Error during login:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Login failed",
            },
            { status: 500 }
        );
    }
}
