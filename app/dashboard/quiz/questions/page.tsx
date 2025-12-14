import { getQuestions, deleteQuestion } from "@/actions/quiz";
import { AddQuestionForm } from "@/components/quiz/add-question-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { auth } from "@/lib/auth";
import { Trash2 } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function QuestionsPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
        redirect("/dashboard");
    }

    const questions = await getQuestions();

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Question Bank</h1>
                    <p className="text-muted-foreground">
                        Manage questions for your quizzes.
                    </p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>Add Question</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Question</DialogTitle>
                        </DialogHeader>
                        <AddQuestionForm />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4">
                {questions.map((q, i) => (
                    <Card key={q.id}>
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                            <CardTitle className="text-base font-medium">
                                {i + 1}. {q.question}
                            </CardTitle>
                            <form
                                action={async () => {
                                    "use server";
                                    await deleteQuestion(q.id);
                                }}
                            >
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive/90"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </form>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {(q.options as string[]).map((opt, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-2 rounded-md text-sm border ${idx === q.correctAnswer
                                                ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300"
                                                : "bg-muted/50"
                                            }`}
                                    >
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {questions.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground bg-muted/10 rounded-lg border border-dashed">
                        No questions added yet.
                    </div>
                )}
            </div>
        </div>
    );
}
