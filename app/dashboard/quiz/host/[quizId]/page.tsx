import { getQuiz } from "@/actions/quiz";
import { HostScreen } from "@/components/quiz/host-screen";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

export default async function HostQuizSessionPage({
    params,
}: {
    params: Promise<{ quizId: string }>;
}) {
    const { quizId } = await params;
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
        redirect("/dashboard");
    }

    const quiz = await getQuiz(quizId);

    if (!quiz) {
        notFound();
    }

    // Extract questions from the quiz relation and sort by order
    const questions = quiz.quizQuestions
        .sort((a, b) => a.order - b.order)
        .map((qq) => qq.question);

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">{quiz.title}</h1>
                {quiz.description && (
                    <p className="text-muted-foreground">{quiz.description}</p>
                )}
            </div>
            <HostScreen questions={questions} userId={session.user.id} quizId={quizId} />
        </div>
    );
}
