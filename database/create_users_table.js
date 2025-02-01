import { openDB } from "./db_connection";

export async function createUsersTable() {
    

    const db = await openDB()
    
    try {
        await db.run(
            `
            CREATE TABLE IF NOT EXISTS user (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                startDate TEXT NOT NULL,
                currentStreak INTEGER NOT NULL,
                motivationalMessage TEXT,
                started_at DATE NOT NULL,
                updated_at DATE NOT NULL
            )
            `
        );
        console.log("Success creating users table");
    } catch (error) {
        console.log("Errors occurred when creating table", error);
    } finally {
        await db.close();
    }
}