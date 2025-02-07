import { openDB } from "./db_connection";

export async function createGoalsTable() {
  const db = await openDB();

  try {
    await db.run(
      `
        CREATE TABLE IF NOT EXISTS goals (
          id SERIAL PRIMARY KEY,
          user_id TEXT NOT NULL,
          goal VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        );
        `,
    );
    console.log("Success creating goals table");
  } catch (error) {
    console.log("Errors occurred when creating goals table", error);
  } finally {
    await db.close();
  }
}
