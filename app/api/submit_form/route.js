import sqlite3 from "sqlite3";
import { NextResponse, NextRequest } from "next/server";
import { openDB } from "@/database/db_connection";
import { usernameValidator } from "@/utils/validators/usernameValidator";
import { dateValidator } from "@/utils/validators/dateValidator";
import validator from "validator";
import { createUsersTable } from "@/database/create_users_table";
import jwt from "jsonwebtoken";
import { idValidator } from "@/utils/validators/id_validator";
import { nanoid } from "nanoid";

const secret_key = process.env.SECRET_KEY;

function signToken(payload, secret) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, (error, token) => {
      if (error) {
        return reject(error);
      }
      resolve(token);
    });
  });
}


export async function POST(req, res) {
  let db;

  try {
    const { username, startDate, currentStreak, motivationalMessage, id } =
      await req.json();

    console.log(username, startDate, currentStreak, motivationalMessage);

    const sanitizedUsername = validator.escape(username);
    const sanitizedStartDate = validator.escape(startDate);

    const sanitizedCurrentStreak = validator.escape(currentStreak);
    const sanitizedMotivationalMessage = validator.escape(motivationalMessage);

    const sanitizedID = validator.escape(id)

    if (!sanitizedUsername || !sanitizedStartDate || !sanitizedID) {
      console.warn("Incomplete data provided");

      return NextResponse.json(
        {
          success: false,
        },
        {
          status: 405,
        },
      );
    } else if (
      ! usernameValidator(sanitizedUsername) ||
      ! dateValidator(sanitizedStartDate) ||
      ! idValidator(sanitizedID)
    ) {
      console.warn("Error: Invalid values provided");
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

    const userIdAlreadyExists = await db.get(
      "SELECT id FROM users WHERE id = ?",
      [sanitizedID],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      },
    );

    if (userIdAlreadyExists) {
      console.warn("ID already exists");

      return NextResponse.json(
        { success: false, message: "ID already exists" },
        { status: 401 },
      );
    }

    const query = `INSERT INTO users (id, username, startDate, currentStreak, motivationalMessage, started_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const started_at = new Date().toISOString().split("T")[0];
    const updated_at = new Date().toISOString().split("T")[0];

    db.run(
      query,
      [
        sanitizedID,
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

    const token = await signToken(
      { username: sanitizedUsername, id: sanitizedID },
      secret_key
    );

    return NextResponse.json(
      {
        success: true,
        message: "Failed to save data",
        token
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
  }
}
