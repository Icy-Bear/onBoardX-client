import { getQuestions } from "@/actions/quiz";
import { CreateQuizForm } from "@/components/quiz/create-quiz-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function CreateQuizPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
        redirect("/dashboard");
    }

    const questions = await getQuestions();

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Create New Quiz</h1>
            <CreateQuizForm questions={questions} />
        </div>
    );
}
