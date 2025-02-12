import { NextResponse } from "next/server";
import { openDB } from "@/database/db_connection";
import { usernameValidator } from "@/utils/validators/usernameValidator";
import validator from "validator";
import jwt from "jsonwebtoken";
import { idValidator } from "@/utils/validators/id_validator";
import { serialize } from "cookie";

const secret_key = process.env.SECRET_KEY;

export async function POST(req) {
    let db;

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

        db = await openDB();
        console.log(sanitizedUsername, sanitizedID)
        const user = await db.get(
                "SELECT * FROM users WHERE username = ? AND id = ?",
                [sanitizedUsername, sanitizedID],
                (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row);
                    }
                }
            );
       

        if (!user) {
            console.warn("Invalid credentials");
            return NextResponse.json(
                { success: false, message: "Invalid credentials" },
                { status: 401 }
            );
        }

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 365 * 10,
            path: "/",
        }

        const token = jwt.sign(
            { username: sanitizedUsername, id: sanitizedID },
            secret_key
        );

        const cookieString = serialize("token", token, cookieOptions)

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
                }
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
    } finally {
        if (db) {
            db.close();
        }
    }
}
