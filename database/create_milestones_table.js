import { openDB } from "./db_connection";

export async function createMilestonesTable() {
  const db = await openDB();

  try {
    await db.run(
      `
        CREATE TABLE IF NOT EXISTS milestones (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT NOT NULL,
          days_reached INTEGER NOT NULL,
          achieved_at DATE NOT NULL,
          milestone_type TEXT CHECK(milestone_type IN ('personal_best', 'goal_reached', 'weekly', 'monthly')),
          FOREIGN KEY (user_id) REFERENCES users(id)
        );
        `,
    );
    console.log("Success creating streak goals table");
  } catch (error) {
    console.log("Errors occurred when creating streak logs table", error);
  } finally {
    await db.close();
  }
}
