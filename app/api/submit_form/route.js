import sqlite3 from "sqlite3";
import { NextResponse, NextRequest } from "next/server";
import { openDB } from "@/database/db_connection";
import { usernameValidator } from "@/utils/validators/usernameValidator";
import { dateValidator } from "@/utils/validators/dateValidator";
import validator from "validator";
import { createUsersTable } from "@/database/create_users_table";
import jwt from "jsonwebtoken";

const secret_key = process.env.SECRET_KEY;

export async function POST(req, res) {
  let db;

  try {
    const { username, startDate, currentStreak, motivationalMessage } =
      await req.json();

    console.log(username, startDate, currentStreak, motivationalMessage);

    const sanitizedUsername = validator.escape(username);
    const sanitizedStartDate = validator.escape(startDate);

    const sanitizedCurrentStreak = validator.escape(currentStreak);
    const sanitizedMotivationalMessage = validator.escape(motivationalMessage);

    if (!sanitizedUsername || !sanitizedStartDate) {
      console.warn("Username and startDate is empty");

      return NextResponse.json(
        {
          success: false,
        },
        {
          status: 405,
        },
      );
    } else if (
      !usernameValidator(sanitizedUsername) ||
      !dateValidator(sanitizedStartDate)
    ) {
      console.warn("Error: Invalid values provided for username and startDate");
      return NextResponse.json(
        {
          success: false,
        },
        {
          status: 400,
        },
      );
    } else if (typeof Number(sanitizedCurrentStreak) !== "number") {
      console.warn("Error: Invalid values provided for currentStreak");
      return NextResponse.json(
        {
          success: false,
        },
        {
          status: 400,
        },
      );
    }
    db = await openDB();

    // create the table
    await createUsersTable();

    const userExists = await db.get(
      "SELECT username FROM user WHERE username = ?",
      [sanitizedUsername],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      },
    );

    if (userExists) {
      console.warn("Username already exists");

      return NextResponse.json(
        { success: false, message: "Username already exists" },
        { status: 409 },
      );
    }

    const query = `INSERT INTO user (username, startDate, currentStreak, motivationalMessage, started_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`;

    const started_at = new Date().toISOString().split("T")[0];
    const updated_at = new Date().toISOString().split("T")[0];

    db.run(
      query,
      [
        sanitizedUsername,
        sanitizedStartDate,
        sanitizedCurrentStreak,
        sanitizedMotivationalMessage,
        started_at,
        updated_at,
      ],
      function (error) {
        console.error("Error while saving data to DB", error);

        if (error) {
          return NextResponse.json(
            {
              success: false,
              message: "Failed to save data",
            },
            {
              status: 500,
            },
          );
        }
      },
    );

    const token = jwt.sign({ username: sanitizedUsername }, secret_key);

    return NextResponse.json(
      {
        success: true,
        message: "Data saved successfully",
        token,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error saving to database:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save data",
      },
      { status: 500 },
    );
  } finally {
    db.close();
  }
}
