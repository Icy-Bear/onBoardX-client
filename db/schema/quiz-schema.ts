import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, integer, uuid, jsonb } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const questions = pgTable("questions", {
    id: uuid("id").defaultRandom().primaryKey(),
    question: text("question").notNull(),
    options: jsonb("options").notNull(), // Array of strings
    correctAnswer: integer("correct_answer").notNull(), // Index of correct option
    createdBy: text("created_by").references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const questionsRelations = relations(questions, ({ one, many }) => ({
    author: one(user, {
        fields: [questions.createdBy],
        references: [user.id],
    }),
    quizQuestions: many(quizQuestions),
}));

export const quizzes = pgTable("quizzes", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    createdBy: text("created_by").references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
    author: one(user, {
        fields: [quizzes.createdBy],
        references: [user.id],
    }),
    quizQuestions: many(quizQuestions),
}));

export const quizQuestions = pgTable("quiz_questions", {
    id: uuid("id").defaultRandom().primaryKey(),
    quizId: uuid("quiz_id").references(() => quizzes.id, { onDelete: "cascade" }).notNull(),
    questionId: uuid("question_id").references(() => questions.id, { onDelete: "cascade" }).notNull(),
    order: integer("order").notNull(),
});

export const quizQuestionsRelations = relations(quizQuestions, ({ one }) => ({
    quiz: one(quizzes, {
        fields: [quizQuestions.quizId],
        references: [quizzes.id],
    }),
    question: one(questions, {
        fields: [quizQuestions.questionId],
        references: [questions.id],
    }),
}));

export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;

export type Quiz = typeof quizzes.$inferSelect;
export type NewQuiz = typeof quizzes.$inferInsert;

export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type NewQuizQuestion = typeof quizQuestions.$inferInsert;
