"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trophy, Maximize2, AlertTriangle } from "lucide-react";
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
    const [isFullscreen, setIsFullscreen] = useState(true); // Default to true to avoid flash, check in useEffect

    const [isConnecting, setIsConnecting] = useState(true);

    useEffect(() => {
        // Initial check
        setIsFullscreen(!!document.fullscreenElement);

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
            setSessionId(sessionId);
            localStorage.setItem("playerSessionId", sessionId);
            localStorage.setItem("playerName", userName);
            toast.success("Joined session successfully!");
        });

        newSocket.on("error", ({ message }) => {
            toast.error(message);
            if (message === "Session not found" || message === "You are banned from this session!") {
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
            // Try to enter fullscreen, but it might fail if async. The overlay will handle it.
            enterFullscreen();
        });

        newSocket.on("quiz_ended", ({ finalScores }) => {
            setGameStatus("ended");
            const myScore = finalScores.find((p: Player) => p.name === userName)?.score || 0;
            setScore(myScore);
            exitFullscreen();
            localStorage.removeItem("playerSessionId");
        });

        newSocket.on("you_are_banned", () => {
            setGameStatus("banned");
            exitFullscreen();
            toast.error("You have been banned for cheating!");
            localStorage.removeItem("playerSessionId");
        });

        newSocket.on("you_are_unbanned", () => {
            setGameStatus("playing"); // Or waiting, but usually unban happens during game
            setWarnings(0);
            toast.success("You have been unbanned! Please play fairly.");
            enterFullscreen();
        });

        newSocket.on("session_closed", () => {
            localStorage.removeItem("playerSessionId");
            localStorage.removeItem("playerName");
            setJoined(false);
            setGameStatus("waiting"); // Reset to initial state or just reload? 
            // Better to just reset joined to false so they see the join screen again
            setSessionId("");
            exitFullscreen();
            toast.info("The host has closed the session.");
        });

        return () => {
            newSocket.disconnect();
        };
    }, [userName]);

    // Security & Fullscreen Handling
    useEffect(() => {
        if (!joined) return;
        if (gameStatus !== "playing" && gameStatus !== "waiting") return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                handleViolation("Tab switching/minimizing is not allowed!");
            }
        };

        const handleBlur = () => {
            handleViolation("Focus lost! Please stay on the quiz.");
        };

        const handleFullscreenChange = () => {
            const isFull = !!document.fullscreenElement;
            setIsFullscreen(isFull);
            if (!isFull) {
                handleViolation("Exiting fullscreen is not allowed!");
            }
        };

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            toast.warning("Right-click is disabled!");
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'x')) {
                e.preventDefault();
                toast.warning("Copy/Paste is disabled!");
            }
            if (e.key === 'F12' || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I')) {
                e.preventDefault();
                toast.warning("Developer tools are disabled!");
            }
        };

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = '';
        };

        const handleResize = () => {
            // Check if window size is significantly reduced (indication of split screen)

            if (!document.fullscreenElement) {
                const widthRatio = window.innerWidth / screen.width;
                const heightRatio = window.innerHeight / screen.height;

                // Stricter thresholds: 92% width, 85% height (account for address bars)
                // We allow a bit more leeway on height for mobile browsers with large address bars
                if (widthRatio < 0.92 || heightRatio < 0.85) {
                    handleViolation("Split-screen or window resizing is not allowed!");
                }

                // Aspect Ratio Check
                // In split screen, the aspect ratio changes drastically compared to the screen
                const screenAspect = screen.width / screen.height;
                const windowAspect = window.innerWidth / window.innerHeight;

                // Allow some variance (e.g. 20%) but split screen usually changes it significantly
                // We check absolute difference to handle both portrait/landscape split
                if (Math.abs(screenAspect - windowAspect) > 0.2) {
                    handleViolation("Window aspect ratio mismatch! Split-screen detected.");
                }

                // Check for floating window (non-zero position)
                // On mobile, a full app usually starts at 0,0. Floating windows are offset.
                if (window.screenX > 50 || window.screenY > 100) {
                    handleViolation("Floating windows are not allowed!");
                }
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("keydown", handleKeyDown);
        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("resize", handleResize);

        // Periodic check to catch state where events might be missed
        const intervalId = setInterval(() => {
            if (document.hidden) {
                handleViolation("Tab switching/minimizing is not allowed!");
            }
            if (!document.fullscreenElement) {
                // Re-run resize/position logic
                handleResize();
            }
        }, 2000);

        // Check fullscreen on mount/update
        setIsFullscreen(!!document.fullscreenElement);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleBlur);
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("resize", handleResize);
            clearInterval(intervalId);
        };
    }, [gameStatus, warnings, socket, sessionId, joined]);

    const handleViolation = async (reason: string) => {
        if (warnings >= 4) {
            if (socket) {
                socket.emit("ban_player", { sessionId, reason });
            }
            setGameStatus("banned");
        } else {
            setWarnings(prev => prev + 1);
            toast.error(`Warning ${warnings + 1}/5: ${reason}`);
            if (socket) {
                socket.emit("player_warning", { sessionId, reason });
            }
        }
    };

    const enterFullscreen = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen()
                .then(() => setIsFullscreen(true))
                .catch(err => console.log(err));
        }
    };

    const exitFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen()
                .then(() => setIsFullscreen(false))
                .catch(err => console.log(err));
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

    // Force Fullscreen Overlay
    if ((gameStatus === "playing" || gameStatus === "waiting") && !isFullscreen) {
        return (
            <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center animate-in fade-in duration-300">
                <div className="bg-card p-8 rounded-2xl shadow-2xl border max-w-md w-full space-y-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <Maximize2 className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Fullscreen Required</h2>
                        <p className="text-muted-foreground">
                            To ensure a fair quiz environment, you must stay in fullscreen mode.
                        </p>
                    </div>
                    <Button size="lg" onClick={enterFullscreen} className="w-full rounded-full">
                        Enter Fullscreen
                    </Button>
                </div>
            </div>
        );
    }

    if (gameStatus === "waiting") {
        return (
            <Card className="max-w-md mx-auto mt-8 text-center">
                <CardContent className="py-12 space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                    <h2 className="text-xl font-semibold">Waiting for host to start...</h2>
                    <p className="text-muted-foreground">Get ready! The quiz will start soon.</p>
                </CardContent>
            </Card>
        );
    }

    if (gameStatus === "banned") {
        return (
            <Card className="max-w-md mx-auto mt-8 text-center border-red-500">
                <CardContent className="py-12 space-y-6">
                    <div className="h-16 w-16 mx-auto rounded-full bg-red-100 flex items-center justify-center animate-pulse">
                        <span className="text-4xl">🚫</span>
                    </div>
                    <h2 className="text-2xl font-bold text-red-600">You have been banned!</h2>
                    <div className="space-y-2 text-muted-foreground">
                        <p>
                            You exceeded the maximum number of warnings (5) for cheating attempts.
                        </p>
                        <p className="font-medium text-foreground">
                            Please contact the admin to be unbanned.
                        </p>
                        <p className="text-sm italic">
                            Waiting for admin action...
                        </p>
                    </div>
                    {/* Removed Back to Home button to keep them on this screen waiting for unban */}
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

