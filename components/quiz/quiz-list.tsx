"use client";

import { deleteQuiz } from "@/actions/quiz";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Quiz } from "@/db/schema/quiz-schema";
import { format } from "date-fns";
import { Play, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function QuizList({ quizzes }: { quizzes: Quiz[] }) {
    const router = useRouter();

    const handleDelete = async (id: string) => {
        try {
            await deleteQuiz(id);
            toast.success("Quiz deleted successfully");
        } catch (error) {
            toast.error("Failed to delete quiz");
        }
    };

    if (quizzes.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground bg-muted/10 rounded-lg border border-dashed">
                <p className="mb-4">No quizzes created yet.</p>
                <Button asChild>
                    <Link href="/dashboard/quiz/create">Create Your First Quiz</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
                <Card key={quiz.id} className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="line-clamp-1">{quiz.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                            {quiz.description || "No description provided."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="text-sm text-muted-foreground">
                            Created {format(new Date(quiz.createdAt!), "PPP")}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between gap-2">
                        <Button asChild className="flex-1" variant="default">
                            <Link href={`/dashboard/quiz/host/${quiz.id}`}>
                                <Play className="mr-2 h-4 w-4" /> Host
                            </Link>
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" size="icon" className="text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the
                                        quiz "{quiz.title}".
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => handleDelete(quiz.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
