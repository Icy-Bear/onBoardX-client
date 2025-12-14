"use client";

import { createQuiz } from "@/actions/quiz";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Question } from "@/db/schema/quiz-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    questionIds: z.array(z.string()).min(1, "Select at least one question"),
});

export function CreateQuizForm({ questions }: { questions: Question[] }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            questionIds: [],
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            await createQuiz(values);
            toast.success("Quiz created successfully");
            router.push("/dashboard/quiz");
        } catch (error) {
            console.error(error);
            toast.error("Failed to create quiz");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Quiz Title</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Mathematics Final Exam" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Optional description for the quiz..."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="questionIds"
                    render={() => (
                        <FormItem>
                            <div className="mb-4">
                                <FormLabel className="text-base">Select Questions</FormLabel>
                                <FormDescription>
                                    Select the questions you want to include in this quiz.
                                </FormDescription>
                            </div>
                            <div className="space-y-2 max-h-[400px] overflow-y-auto border rounded-md p-4">
                                {questions.map((question) => (
                                    <FormField
                                        key={question.id}
                                        control={form.control}
                                        name="questionIds"
                                        render={({ field }) => {
                                            return (
                                                <FormItem
                                                    key={question.id}
                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                >
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value?.includes(question.id)}
                                                            onCheckedChange={(checked) => {
                                                                return checked
                                                                    ? field.onChange([...field.value, question.id])
                                                                    : field.onChange(
                                                                        field.value?.filter(
                                                                            (value) => value !== question.id
                                                                        )
                                                                    );
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal cursor-pointer">
                                                        {question.question}
                                                    </FormLabel>
                                                </FormItem>
                                            );
                                        }}
                                    />
                                ))}
                                {questions.length === 0 && (
                                    <p className="text-muted-foreground text-sm">
                                        No questions available. Please add questions to the bank first.
                                    </p>
                                )}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Quiz
                </Button>
            </form>
        </Form>
    );
}
