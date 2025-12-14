import { getQuizzes } from "@/actions/quiz";
import { QuizList } from "@/components/quiz/quiz-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function QuizDashboardPage() {
    const quizzes = await getQuizzes();

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quizzes</h1>
                    <p className="text-muted-foreground">
                        Manage and host your quizzes here.
                    </p>
                </div>
                {quizzes.length > 0 && (
                    <Button asChild>
                        <Link href="/dashboard/quiz/create">
                            <Plus className="mr-2 h-4 w-4" /> Create Quiz
                        </Link>
                    </Button>
                )}
            </div>

            <QuizList quizzes={quizzes} />
        </div>
    );
}
