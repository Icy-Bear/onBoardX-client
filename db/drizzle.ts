import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import * as authSchema from "./schema/auth-schema";
import * as quizSchema from "./schema/quiz-schema";

export * from "./schema/auth-schema";
export * from "./schema/quiz-schema";

config({ path: ".env" }); // or .env.local

const schema = { ...authSchema, ...quizSchema };

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql, schema });
