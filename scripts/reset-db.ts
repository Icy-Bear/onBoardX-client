import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import path from "path";

// Load .env from project root
config({ path: path.resolve(__dirname, "../.env") });

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
}

const sql = neon(process.env.DATABASE_URL);

async function main() {
    console.log("Dropping all tables...");
    try {
        // Drop public schema and recreate it to wipe everything
        await sql`DROP SCHEMA public CASCADE`;
        await sql`CREATE SCHEMA public`;
        // Grant permissions if necessary (usually public has usage on public)
        await sql`GRANT ALL ON SCHEMA public TO public`;
        await sql`COMMENT ON SCHEMA public IS 'standard public schema'`;
        console.log("Database reset complete.");
    } catch (error) {
        console.error("Error resetting database:", error);
        process.exit(1);
    }
}

main();
