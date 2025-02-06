import { openDB } from "./db_connection";

export async function createUsersTable() {
  const db = await openDB();

  try {
    await db.run(
      `
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY CHECK (id GLOB '[a-zA-Z0-9]*' AND length(id) <= 12), 
          username TEXT NOT NULL,
          startDate TEXT NOT NULL,
          currentStreak INTEGER NOT NULL,
          motivationalMessage TEXT,
          started_at DATE NOT NULL,
          updated_at DATE NOT NULL
        );

        `,
    );
    console.log("Success creating users table");
  } catch (error) {
    console.log("Errors occurred when creating table", error);
  } finally {
    await db.close();
  }
}
