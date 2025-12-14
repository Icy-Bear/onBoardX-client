"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createQuestion } from "@/actions/quiz";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";

export function AddQuestionForm({ onSuccess }: { onSuccess?: () => void }) {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", "", "", ""]);
    const [correctAnswer, setCorrectAnswer] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) {
            toast.error("Please enter a question");
            return;
        }
        if (options.some((opt) => !opt.trim())) {
            toast.error("Please fill in all options");
            return;
        }

        setIsSubmitting(true);
        try {
            await createQuestion({
                question,
                options,
                correctAnswer,
            });
            toast.success("Question added successfully");
            setQuestion("");
            setOptions(["", "", "", ""]);
            setCorrectAnswer(0);
            onSuccess?.();
        } catch (error) {
            toast.error("Failed to add question");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Input
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Enter your question here..."
                />
            </div>

            <div className="space-y-4">
                <Label>Options</Label>
                <RadioGroup
                    value={correctAnswer.toString()}
                    onValueChange={(val: string) => setCorrectAnswer(parseInt(val))}
                >
                    {options.map((option, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <RadioGroupItem value={index.toString()} id={`opt-${index}`} />
                            <Input
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                placeholder={`Option ${index + 1}`}
                                className={index === correctAnswer ? "border-primary ring-1 ring-primary" : ""}
                            />
                        </div>
                    ))}
                </RadioGroup>
                <p className="text-xs text-muted-foreground">
                    Select the radio button next to the correct answer.
                </p>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                    </>
                ) : (
                    <>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Question
                    </>
                )}
            </Button>
        </form>
    );
}
