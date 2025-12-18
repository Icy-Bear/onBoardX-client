
import { db } from "../db/drizzle";
import { questions } from "../db/schema/quiz-schema";
import { user } from "../db/schema/auth-schema";
import { eq } from "drizzle-orm";

const DUMMY_QUESTIONS = [
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2,
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1,
    },
    {
        question: "What is 2 + 2?",
        options: ["3", "4", "5", "22"],
        correctAnswer: 1,
    },
    {
        question: "Who wrote 'Romeo and Juliet'?",
        options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
        correctAnswer: 1,
    },
    {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        correctAnswer: 3,
    },
];

async function main() {
    console.log("🌱 Seeding dummy questions...");

    try {
        // 1. Get Admin User
        const adminUser = await db.query.user.findFirst({
            where: eq(user.email, "admin@gmail.com"),
        });

        if (!adminUser) {
            console.error("❌ Admin user not found! Please run 'pnpm db:reset' first.");
            process.exit(1);
        }

        console.log(`👤 Found admin user: ${adminUser.name} (${adminUser.id})`);

        // 2. Insert Questions
        console.log(`📝 Inserting ${DUMMY_QUESTIONS.length} questions...`);

        await db.insert(questions).values(
            DUMMY_QUESTIONS.map((q) => ({
                ...q,
                createdBy: adminUser.id,
            }))
        );

        console.log("✅ Questions seeded successfully!");
    } catch (error) {
        console.error("❌ Error seeding questions:", error);
        process.exit(1);
    }

    process.exit(0);
}

main();
