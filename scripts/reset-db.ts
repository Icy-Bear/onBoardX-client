
import { db } from "../db/drizzle";
import { sql } from "drizzle-orm";
import { auth } from "../lib/auth";
import { execSync } from "child_process";

async function main() {
    console.log("🔴 Resetting database...");

    try {
        // 1. Drop Schema
        console.log("💥 Dropping schema 'public'...");
        await db.execute(sql`DROP SCHEMA IF EXISTS public CASCADE`);
        await db.execute(sql`CREATE SCHEMA public`);

        // 2. Push Schema
        console.log("🚀 Pushing schema...");
        // Using --force if available or just relying on empty DB behavior
        execSync("npx drizzle-kit push", { stdio: "inherit", cwd: process.cwd() });

        // 3. Seed Admin
        console.log("🌱 Seeding admin user...");

        // Create user using better-auth API
        const res = await auth.api.signUpEmail({
            body: {
                email: "admin@gmail.com",
                password: "1234567890",
                name: "Admin",
            },
        });

        if (res?.user) {
            console.log("Admin user created with ID:", res.user.id);

            // 4. Set Role to Admin
            // Updating directly via DB to ensure it works without extra API permissions/headers
            await db.execute(sql`UPDATE "user" SET role = 'admin' WHERE id = ${res.user.id}`);
            console.log("👑 Admin role assigned.");
        } else {
            console.error("Failed to create user. Response:", res);
        }

    } catch (error) {
        console.error("❌ Error during reset:", error);
        process.exit(1);
    }

    console.log("✅ Database reset complete.");
    process.exit(0);
}

main();
