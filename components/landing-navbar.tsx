"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Shield,
    Home,
    Zap,
    Layout,
    MessageCircle,
    User,
    LogIn,
} from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function LandingNavbar() {
    const navItems = [
        { name: "Home", href: "#", icon: Home },
        { name: "Features", href: "#features", icon: Zap },
        { name: "How it Works", href: "#how-it-works", icon: Layout },
        { name: "Testimonials", href: "#testimonials", icon: MessageCircle },
    ];

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <nav className="flex items-center gap-2 px-4 py-3 bg-background/60 backdrop-blur-xl border border-border/40 rounded-full shadow-2xl shadow-black/10 transition-all hover:scale-105 hover:bg-background/80">
                <TooltipProvider delayDuration={0}>
                    {/* Logo / Home */}
                    <Link href="#" className="mr-2">
                        <div className="bg-gradient-to-tr from-primary to-purple-500 p-2 rounded-full shadow-lg shadow-primary/20 hover:scale-110 transition-transform">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                    </Link>

                    <div className="h-6 w-px bg-border/50 mx-1" />

                    {/* Nav Items */}
                    {navItems.map((item) => (
                        <Tooltip key={item.name}>
                            <TooltipTrigger asChild>
                                <Link
                                    href={item.href}
                                    className="p-2.5 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all hover:-translate-y-1"
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="sr-only">{item.name}</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="mb-2">
                                <p>{item.name}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}

                    <div className="h-6 w-px bg-border/50 mx-1" />

                    {/* Auth */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="/auth/login"
                                className="p-2.5 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all hover:-translate-y-1"
                            >
                                <LogIn className="w-5 h-5" />
                                <span className="sr-only">Login</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="mb-2">
                            <p>Login</p>
                        </TooltipContent>
                    </Tooltip>

                    <Button asChild size="sm" className="rounded-full px-4 ml-1 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                        <Link href="/auth/signup">Get Started</Link>
                    </Button>
                </TooltipProvider>
            </nav>
        </div>
    );
}
