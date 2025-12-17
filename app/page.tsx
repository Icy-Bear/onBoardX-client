import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Layout, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-14 flex items-center border-b backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <Link className="flex items-center justify-center" href="#">
          <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            onBoardX
          </span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/auth/login"
          >
            Login
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/auth/signup"
          >
            Sign Up
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted/20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                  The Future of Secure Assessments
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                  onBoardX provides an industry-standard platform for real-time
                  quizzes with advanced anti-cheat technology.
                </p>
              </div>
              <div className="space-x-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-400">
                <Button asChild size="lg" className="h-12 px-8">
                  <Link href="/auth/signup">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 px-8">
                  <Link href="/auth/login">Login</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center p-6 bg-background rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Shield className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-xl font-bold">Anti-Cheat System</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Advanced detection for tab switching and focus loss to ensure
                  integrity.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 bg-background rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Zap className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-xl font-bold">Real-Time Updates</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Instant feedback and live score updates powered by Socket.io.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 bg-background rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Layout className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-xl font-bold">Modern Dashboard</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Intuitive admin panel for managing quizzes, users, and
                  analytics.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 onBoardX. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
