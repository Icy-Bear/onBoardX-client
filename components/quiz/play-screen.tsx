"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trophy } from "lucide-react";
import { toast } from "sonner";
import { Question } from "@/db/schema/quiz-schema";

interface Player {
    id: string;
    name: string;
    score: number;
}

export function PlayScreen({ userName, userId }: { userName: string, userId: string }) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [sessionId, setSessionId] = useState("");
    const [joined, setJoined] = useState(false);
    const [gameStatus, setGameStatus] = useState<"waiting" | "playing" | "ended" | "banned">("waiting");
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [startTime, setStartTime] = useState<number>(0);
    const [warnings, setWarnings] = useState(0);

    const [isConnecting, setIsConnecting] = useState(true);

    useEffect(() => {
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";
        const newSocket = io(socketUrl, {
            reconnectionAttempts: 5,
            timeout: 10000,
        });
        setSocket(newSocket);

        newSocket.on("connect", () => {
            console.log("Connected to server");
            setIsConnecting(false);

            // Auto-join if session exists in localStorage
            const savedSession = localStorage.getItem("playerSessionId");
            const savedName = localStorage.getItem("playerName");

            if (savedSession && savedName && !joined) {
                setSessionId(savedSession);
                // We need to wait a bit or just emit immediately? 
                // Better to emit immediately on connect if we have data
                newSocket.emit("join_session", { sessionId: savedSession, playerName: savedName });
                toast.info("Rejoining previous session...");
            }
        });

        newSocket.on("connect_error", (err) => {
            console.error("Connection error:", err);
            setIsConnecting(false);
            toast.error("Failed to connect to quiz server. Please check your internet.");
        });

        newSocket.on("joined_success", ({ sessionId }) => {
            setJoined(true);
            setSessionId(sessionId); // Ensure state is synced
            // Save to localStorage
            localStorage.setItem("playerSessionId", sessionId);
            localStorage.setItem("playerName", userName); // We use the prop userName, but for rejoin we might need to store it if prop is missing? 
            // Actually, the prop userName comes from auth, so it should be stable. 
            // But if we want to support anonymous rejoin, we'd need to store the name used.
            // Here we just store it to be safe.
            toast.success("Joined session successfully!");
        });

        newSocket.on("error", ({ message }) => {
            toast.error(message);
            if (message === "Session not found" || message === "You are banned from this session!") {
                // Clear invalid session
                localStorage.removeItem("playerSessionId");
                localStorage.removeItem("playerName");
                setJoined(false);
            }
        });

        newSocket.on("new_question", ({ question, index, total }) => {
            setGameStatus("playing");
            setCurrentQuestion(question);
            setCurrentQuestionIndex(index);
            setTotalQuestions(total);
            setSelectedAnswer(null);
            setIsAnswerSubmitted(false);
            setStartTime(Date.now());
            enterFullscreen();
        });

        newSocket.on("quiz_ended", ({ finalScores }) => {
            setGameStatus("ended");
            const myScore = finalScores.find((p: Player) => p.name === userName)?.score || 0;
            setScore(myScore);
            exitFullscreen();
            localStorage.removeItem("playerSessionId"); // Clear on end
        });

        newSocket.on("you_are_banned", () => {
            setGameStatus("banned");
            exitFullscreen();
            toast.error("You have been banned for cheating!");
            localStorage.removeItem("playerSessionId"); // Clear on ban
        });

        return () => {
            newSocket.disconnect();
        };
    }, [userName]);

    // Security Measures
    useEffect(() => {
        if (gameStatus !== "playing") return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                handleViolation("Tab switching/minimizing is not allowed!");
            }
        };

        const handleBlur = () => {
            handleViolation("Focus lost! Please stay on the quiz.");
        };

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                handleViolation("Exiting fullscreen is not allowed!");
            }
        };

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            toast.warning("Right-click is disabled!");
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent Copy, Paste, Cut
            if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'x')) {
                e.preventDefault();
                toast.warning("Copy/Paste is disabled!");
            }
            // Prevent DevTools (F12, Ctrl+Shift+I)
            if (e.key === 'F12' || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I')) {
                e.preventDefault();
                toast.warning("Developer tools are disabled!");
            }
        };

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = ''; // Shows browser default confirmation
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("keydown", handleKeyDown);
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleBlur);
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [gameStatus, warnings, socket, sessionId]);

    const handleViolation = async (reason: string) => {
        if (warnings >= 4) {
            // Ban User from Session
            if (socket) {
                socket.emit("ban_player", { sessionId, reason });
            }
            setGameStatus("banned");
        } else {
            setWarnings(prev => prev + 1);
            toast.error(`Warning ${warnings + 1}/5: ${reason}`);

            // Notify server of warning
            if (socket) {
                socket.emit("player_warning", { sessionId, reason });
            }

            // Try to re-enter fullscreen if that was the violation
            enterFullscreen();
        }
    };

    const enterFullscreen = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(err => console.log(err));
        }
    };

    const exitFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(err => console.log(err));
        }
    };

    const joinSession = () => {
        if (!socket || !sessionId.trim()) return;
        enterFullscreen();
        socket.emit("join_session", { sessionId: sessionId.toUpperCase(), playerName: userName });
    };

    const submitAnswer = (index: number) => {
        if (!socket || isAnswerSubmitted) return;

        const timeTaken = (Date.now() - startTime) / 1000;
        socket.emit("submit_answer", {
            sessionId: sessionId.toUpperCase(),
            answerIndex: index,
            timeTaken
        });

        setSelectedAnswer(index);
        setIsAnswerSubmitted(true);
    };

    if (isConnecting) {
        return (
            <div className="flex flex-col justify-center items-center h-64 space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">Connecting to quiz server...</p>
            </div>
        );
    }

    if (!joined) {
        return (
            <Card className="max-w-md mx-auto mt-8">
                <CardHeader>
                    <CardTitle>Join Quiz Session</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="sessionId">Session Code</Label>
                        <Input
                            id="sessionId"
                            value={sessionId}
                            onChange={(e) => setSessionId(e.target.value)}
                            placeholder="Enter 6-character code"
                            className="uppercase tracking-widest text-center text-lg"
                            maxLength={6}
                        />
                    </div>
                    <Button onClick={joinSession} className="w-full">
                        Join Quiz
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (gameStatus === "waiting") {
        return (
            <Card className="max-w-md mx-auto mt-8 text-center">
                <CardContent className="py-12 space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                    <h2 className="text-xl font-semibold">Waiting for host to start...</h2>
                    <p className="text-muted-foreground">Get ready! The quiz will start in fullscreen.</p>
                    <Button onClick={enterFullscreen} variant="outline" className="mt-4">
                        Enter Fullscreen
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (gameStatus === "banned") {
        return (
            <Card className="max-w-md mx-auto mt-8 text-center border-red-500">
                <CardContent className="py-12 space-y-6">
                    <div className="h-16 w-16 mx-auto rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-4xl">🚫</span>
                    </div>
                    <h2 className="text-2xl font-bold text-red-600">You have been banned!</h2>
                    <p className="text-muted-foreground">
                        You exceeded the maximum number of warnings (5) for cheating attempts.
                        You are banned from this session.
                    </p>
                    <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
                        Back to Home
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (gameStatus === "ended") {
        return (
            <Card className="max-w-md mx-auto mt-8 text-center">
                <CardContent className="py-12 space-y-6">
                    <Trophy className="h-16 w-16 mx-auto text-yellow-500" />
                    <h2 className="text-3xl font-bold">Quiz Complete!</h2>
                    <div className="bg-muted/30 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Your Final Score</p>
                        <p className="text-4xl font-bold text-primary">{score}</p>
                    </div>
                    <Button onClick={() => window.location.reload()} variant="outline">
                        Play Another
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 select-none">
            <div className="flex justify-between items-center">
                <Badge variant="outline" className="text-sm">
                    Question {currentQuestionIndex + 1} / {totalQuestions}
                </Badge>
                <div className="flex gap-2">
                    {warnings > 0 && (
                        <Badge variant="destructive" className="animate-pulse">
                            {warnings} Warning(s)
                        </Badge>
                    )}
                    {isAnswerSubmitted && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            Answer Submitted
                        </Badge>
                    )}
                </div>
            </div>

            <Card>
                <CardContent className="p-6 space-y-6">
                    <h2 className="text-xl font-semibold">{currentQuestion?.question}</h2>

                    <div className="grid gap-3">
                        {(currentQuestion?.options as string[]).map((opt, idx) => (
                            <Button
                                key={idx}
                                variant={selectedAnswer === idx ? "default" : "outline"}
                                className={`h-auto py-4 justify-start text-left text-wrap ${selectedAnswer === idx ? "ring-2 ring-primary ring-offset-2" : ""
                                    }`}
                                onClick={() => submitAnswer(idx)}
                                disabled={isAnswerSubmitted}
                            >
                                <div className="flex items-center gap-3 w-full">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs">
                                        {String.fromCharCode(65 + idx)}
                                    </span>
                                    <span>{opt}</span>
                                </div>
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
