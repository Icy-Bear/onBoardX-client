"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    Shield,
    Home,
    Zap,
    Layout,
    MessageCircle,
    LogIn,
    Menu,
} from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function LandingNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { name: "Home", href: "#", icon: Home },
        { name: "Features", href: "#features", icon: Zap },
        { name: "How it Works", href: "#how-it-works", icon: Layout },
        { name: "Testimonials", href: "#testimonials", icon: MessageCircle },
    ];

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? "bg-background/60 backdrop-blur-xl border-b border-border/40 shadow-sm"
                    : "bg-transparent"
            )}
        >
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="#" className="flex items-center gap-2 group">
                    <div className="relative w-10 h-10 group-hover:scale-110 transition-transform duration-300">
                        <Image
                            src="/icon0.svg"
                            alt="onBoardX Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="font-bold text-xl tracking-tight group-hover:text-primary transition-colors">
                        onBoardX
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Desktop Auth */}
                <div className="hidden md:flex items-center gap-4">
                    <Button variant="ghost" asChild className="text-muted-foreground hover:text-primary">
                        <Link href="/auth/login">Login</Link>
                    </Button>
                    <Button asChild className="rounded-full px-6 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5">
                        <Link href="/auth/signup">Get Started</Link>
                    </Button>
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <Menu className="w-6 h-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader className="mb-8 text-left">
                                <SheetTitle className="flex items-center gap-2">
                                    <div className="relative w-8 h-8">
                                        <Image
                                            src="/icon0.svg"
                                            alt="onBoardX Logo"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    onBoardX
                                </SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors text-lg font-medium text-muted-foreground hover:text-foreground"
                                        >
                                            <item.icon className="w-5 h-5" />
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                                <div className="h-px bg-border/50" />
                                <div className="flex flex-col gap-3">
                                    <Button asChild variant="outline" className="w-full justify-start text-lg h-12 rounded-xl">
                                        <Link href="/auth/login">
                                            <LogIn className="w-5 h-5 mr-2" />
                                            Login
                                        </Link>
                                    </Button>
                                    <Button asChild className="w-full justify-start text-lg h-12 rounded-xl shadow-lg shadow-primary/20">
                                        <Link href="/auth/signup">
                                            <Zap className="w-5 h-5 mr-2" />
                                            Get Started
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
