import { getQuizzes } from "@/actions/quiz";
import { QuizList } from "@/components/quiz/quiz-list";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { Plus } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function HostQuizPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
        redirect("/dashboard");
    }

    const quizzes = await getQuizzes();

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Select Quiz to Host</h1>
                    <p className="text-muted-foreground">
                        Choose a quiz to start a live session.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/quiz/create">
                        <Plus className="mr-2 h-4 w-4" /> Create Quiz
                    </Link>
                </Button>
            </div>

            <QuizList quizzes={quizzes} />
        </div>
    );
}
