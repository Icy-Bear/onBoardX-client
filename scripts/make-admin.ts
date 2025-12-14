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
    const email = "admin@gmail.com";
    console.log(`Making ${email} an admin...`);
    try {
        const result = await sql`UPDATE "user" SET role = 'admin' WHERE email = ${email} RETURNING id, name, email, role`;

        if (result.length > 0) {
            console.log("Successfully updated user role to admin:");
            console.log(result[0]);
        } else {
            console.log(`User with email ${email} not found.`);
        }
    } catch (error) {
        console.error("Error updating user:", error);
        process.exit(1);
    }
}

main();
