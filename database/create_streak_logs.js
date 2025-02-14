import { openDB } from "./db_connection";

export async function createStreakLogsTable() {
  const db = await openDB();

  try {
    await db.run(`
      CREATE TABLE IF NOT EXISTS streak_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        date DATE NOT NULL,
        status TEXT CHECK(status IN ('clean', 'relapse')) NOT NULL,
        streak_count INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE(user_id, date)
      );
    `);
    console.log("Success creating streak_logs table");
  } catch (error) {
    console.log("Errors occurred when creating streak_logs table", error);
  } finally {
    await db.close();
  }
}
