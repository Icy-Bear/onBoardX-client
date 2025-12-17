"use server";

import { db } from "@/db/drizzle";
import { questions } from "@/db/schema/quiz-schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq, desc } from "drizzle-orm";

export async function getQuestions() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
        throw new Error("Unauthorized");
    }

    return await db.select().from(questions).orderBy(desc(questions.createdAt));
}

export async function createQuestion(data: {
    question: string;
    options: string[];
    correctAnswer: number;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
        throw new Error("Unauthorized");
    }

    await db.insert(questions).values({
        question: data.question,
        options: data.options,
        correctAnswer: data.correctAnswer,
        createdBy: session.user.id,
    });

    revalidatePath("/dashboard/quiz/questions");
    revalidatePath("/dashboard/quiz/create");
}

export async function deleteQuestion(id: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
        throw new Error("Unauthorized");
    }

    await db.delete(questions).where(eq(questions.id, id));
    revalidatePath("/dashboard/quiz/questions");
    revalidatePath("/dashboard/quiz/create");
}

import { quizzes, quizQuestions } from "@/db/schema/quiz-schema";

export async function createQuiz(data: {
    title: string;
    description?: string;
    questionIds: string[];
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
        throw new Error("Unauthorized");
    }

    const [newQuiz] = await db
        .insert(quizzes)
        .values({
            title: data.title,
            description: data.description,
            createdBy: session.user.id,
        })
        .returning();

    if (data.questionIds.length > 0) {
        await db.insert(quizQuestions).values(
            data.questionIds.map((qId, index) => ({
                quizId: newQuiz.id,
                questionId: qId,
                order: index,
            }))
        );
    }

    revalidatePath("/dashboard/quiz");
}

export async function getQuizzes() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
        throw new Error("Unauthorized");
    }

    return await db.select().from(quizzes).orderBy(desc(quizzes.createdAt));
}

export async function getQuiz(id: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
        throw new Error("Unauthorized");
    }

    const quiz = await db.query.quizzes.findFirst({
        where: eq(quizzes.id, id),
        with: {
            quizQuestions: {
                orderBy: (qq, { asc }) => [asc(qq.order)],
                with: {
                    question: true,
                },
            },
        },
    });

    return quiz;
}

export async function deleteQuiz(id: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
        throw new Error("Unauthorized");
    }

    await db.delete(quizzes).where(eq(quizzes.id, id));
    revalidatePath("/dashboard/quiz");
}
