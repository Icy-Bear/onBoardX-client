
import { auth } from "../lib/auth";

async function main() {
    try {
        console.log("Auth imported successfully");
        // Try to access a property to ensure it's initialized
        console.log("Creating user...");
        const res = await auth.api.signUpEmail({
            body: {
                email: "admin@gmail.com",
                password: "password123",
                name: "Admin User",
            },
        });
        console.log("User created:", res);
    } catch (error) {
        console.error("Error:", error);
    }
}

main();
