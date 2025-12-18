"use client";

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, Play, ArrowRight, Trophy, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Question } from "@/db/schema/quiz-schema";

interface Player {
    id: string;
    name: string;
    score: number;
    status?: 'active' | 'banned';
}

export function HostScreen({ questions, userId, quizId }: { questions: Question[]; userId: string; quizId: string }) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [gameStatus, setGameStatus] = useState<"waiting" | "playing" | "ended">("waiting");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(true);

    // Use a ref to track if we're currently mounting/connecting to avoid double-firing in strict mode
    const socketRef = useRef<Socket | null>(null);

    const connectToServer = () => {
        setIsConnecting(true);
        setConnectionError(null);

        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

        // Close existing connection if any
        if (socketRef.current) {
            socketRef.current.disconnect();
        }

        const newSocket = io(socketUrl, {
            timeout: 10000, // 10 seconds connection timeout
            reconnectionAttempts: 5,
        });

        socketRef.current = newSocket;
        setSocket(newSocket);

        // Connection timeout safety net
        const timeoutId = setTimeout(() => {
            if (!newSocket.connected) {
                setConnectionError("Connection timed out. The server might be down.");
                setIsConnecting(false);
                newSocket.disconnect();
            }
        }, 10000);

        newSocket.on("connect", () => {
            clearTimeout(timeoutId);
            console.log("Connected to server");
            setIsConnecting(false);

            // Check for existing session in localStorage
            // Note: In a real app, we might want to validate this session ID or check if it's expired
            // But for now, the server handles the check based on hostId.
            // So we just emit create_session, and the server will return the existing one if it matches.
            newSocket.emit("create_session", { hostId: userId, quizId });
        });

        newSocket.on("connect_error", (err) => {
            console.error("Connection error:", err);
            if (newSocket.io.opts.reconnectionAttempts === 0) {
                clearTimeout(timeoutId);
                setConnectionError("Failed to connect to quiz server. Please check your internet connection.");
                setIsConnecting(false);
            }
        });

        newSocket.on("session_created", ({ sessionId }) => {
            setSessionId(sessionId);
            // Store in localStorage (optional, but good for debugging or explicit rejoin if we add that)
            localStorage.setItem("hostSessionId", sessionId);
            toast.success(`Session active: ${sessionId}`);
        });

        newSocket.on("player_joined", ({ players }) => {
            setPlayers(players);
            // Don't show toast for initial load of existing players
        });

        newSocket.on("new_question", ({ index }) => {
            // Restore current question index if rejoining
            setCurrentQuestionIndex(index);
            setGameStatus("playing");
        });

        newSocket.on("leaderboard_update", ({ players }) => {
            setPlayers(players);
        });

        newSocket.on("player_banned", ({ playerName, players }) => {
            setPlayers(players);
            toast.error(`${playerName} has been banned!`);
        });

        newSocket.on("quiz_ended", ({ finalScores }) => {
            setGameStatus("ended");
            setPlayers(finalScores);
            localStorage.removeItem("hostSessionId"); // Clear on end
        });
    };

    useEffect(() => {
        connectToServer();

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [userId]);

    const startGame = () => {
        if (!socket || !sessionId) return;
        socket.emit("start_quiz", { sessionId, questions });
        setGameStatus("playing");
        setCurrentQuestionIndex(0);
    };

    const nextQuestion = () => {
        if (!socket || !sessionId) return;
        socket.emit("next_question", { sessionId });
        setCurrentQuestionIndex((prev) => prev + 1);
    };

    const unbanPlayer = (playerId: string) => {
        if (!socket || !sessionId) return;
        socket.emit("unban_player", { sessionId, playerId });
        toast.success("Player unbanned");
    };

    const resetSession = () => {
        if (!socket || !sessionId) return;
        socket.emit("reset_session", { sessionId });
        toast.info("Resetting session...");
        setTimeout(() => {
            window.location.reload();
        }, 500);
    };

    if (connectionError) {
        return (
            <div className="flex flex-col justify-center items-center h-64 space-y-4 text-center">
                <div className="bg-destructive/10 p-4 rounded-full">
                    <AlertCircle className="h-12 w-12 text-destructive" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Connection Failed</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                        {connectionError}
                    </p>
                </div>
                <Button onClick={connectToServer} variant="outline" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Retry Connection
                </Button>
            </div>
        );
    }

    if (isConnecting || !sessionId) {
        return (
            <div className="flex flex-col justify-center items-center h-64 space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <div className="text-center space-y-1">
                    <h3 className="text-lg font-medium">Connecting to Server</h3>
                    <p className="text-sm text-muted-foreground">
                        Establishing secure connection...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Info */}
            <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
                <div>
                    <p className="text-sm text-muted-foreground">Session Code</p>
                    <h2 className="text-3xl font-bold tracking-wider">{sessionId}</h2>
                </div>
                <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xl font-bold">{players.filter(p => p.status !== 'banned').length}</span>
                    <span className="text-sm text-muted-foreground">Active Players</span>
                </div>
            </div>

            {/* Game Area */}
            {gameStatus === "waiting" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Waiting for players...</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            {players.map((p) => (
                                <Badge
                                    key={p.id}
                                    variant={p.status === 'banned' ? "destructive" : "secondary"}
                                    className="text-sm py-1 px-3"
                                >
                                    {p.name} {p.status === 'banned' && "(Banned)"}
                                </Badge>
                            ))}
                            {players.length === 0 && (
                                <p className="text-muted-foreground italic">No players joined yet.</p>
                            )}
                        </div>
                        <Button
                            onClick={startGame}
                            disabled={players.filter(p => p.status !== 'banned').length === 0}
                            className="w-full sm:w-auto"
                        >
                            <Play className="mr-2 h-4 w-4" /> Start Quiz
                        </Button>
                    </CardContent>
                </Card>
            )}

            {gameStatus === "playing" && (
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Question View */}
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>
                                Question {currentQuestionIndex + 1} / {questions.length}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-lg font-medium">
                                {questions[currentQuestionIndex]?.question}
                            </div>
                            <div className="space-y-2">
                                {((questions[currentQuestionIndex]?.options as string[]) || []).map((opt, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-3 rounded-md border ${idx === questions[currentQuestionIndex]?.correctAnswer
                                            ? "bg-green-100 border-green-300 dark:bg-green-900/30"
                                            : "bg-muted/30"
                                            }`}
                                    >
                                        {opt}
                                    </div>
                                ))}
                            </div>
                            <Button onClick={nextQuestion} className="w-full mt-4">
                                {currentQuestionIndex < questions.length - 1 ? (
                                    <>Next Question <ArrowRight className="ml-2 h-4 w-4" /></>
                                ) : (
                                    <>End Quiz <Trophy className="ml-2 h-4 w-4" /></>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Live Leaderboard */}
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>Live Leaderboard</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {players
                                    .sort((a, b) => {
                                        // Sort banned players to the bottom
                                        if (a.status === 'banned' && b.status !== 'banned') return 1;
                                        if (a.status !== 'banned' && b.status === 'banned') return -1;
                                        // Then sort by score
                                        return b.score - a.score;
                                    })
                                    .map((p, i) => (
                                        <div
                                            key={p.id}
                                            className={`flex items-center justify-between p-2 rounded ${p.status === 'banned'
                                                ? "bg-red-100 border border-red-200 dark:bg-red-900/30 dark:border-red-800"
                                                : "bg-muted/20"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold w-6 text-center">{i + 1}</span>
                                                <span className={p.status === 'banned' ? "text-red-600 font-medium" : ""}>
                                                    {p.name} {p.status === 'banned' && "(Banned)"}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {/* Show warnings if any */}
                                                {(p as any).warnings > 0 && p.status !== 'banned' && (
                                                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300">
                                                        {(p as any).warnings} ⚠️
                                                    </Badge>
                                                )}

                                                {p.status === 'banned' ? (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-7 text-xs border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-800 dark:hover:bg-red-900/20"
                                                        onClick={() => unbanPlayer(p.id)}
                                                    >
                                                        Unban
                                                    </Button>
                                                ) : (
                                                    <Badge variant="outline">
                                                        {p.score} pts
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {gameStatus === "ended" && (
                <Card className="text-center py-8">
                    <CardContent className="space-y-6">
                        <Trophy className="h-16 w-16 mx-auto text-yellow-500" />
                        <h2 className="text-3xl font-bold">Quiz Ended!</h2>
                        <div className="max-w-md mx-auto space-y-2">
                            {players
                                .sort((a, b) => b.score - a.score)
                                .slice(0, 3)
                                .map((p, i) => (
                                    <div
                                        key={p.id}
                                        className={`flex items-center justify-between p-4 rounded-lg border ${i === 0 ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20" : "bg-card"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl font-bold">#{i + 1}</span>
                                            <span className="text-lg">{p.name}</span>
                                        </div>
                                        <span className="font-bold text-xl">{p.score}</span>
                                    </div>
                                ))}
                        </div>
                        <Button onClick={resetSession} variant="outline">
                            Host Another
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
