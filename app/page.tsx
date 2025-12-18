import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LandingNavbar } from "@/components/landing-navbar";
import {
  ArrowRight,
  Shield,
  Zap,
  Layout,
  CheckCircle2,
  Trophy,
  Users,
  Star,
  Sparkles,
  Play,
  HelpCircle,
  ChevronDown,
  Brain,
  Target,
  Rocket,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary overflow-x-hidden pb-24">
      <LandingNavbar />

      <main className="flex-1">
        {/* Fun Hero Section (Bento Grid Style) */}
        <section className="w-full py-12 md:py-24 lg:py-32 relative">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-7xl mx-auto">

              {/* Main Hero Card */}
              <div className="md:col-span-8 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 rounded-[2.5rem] p-8 md:p-12 flex flex-col justify-center relative overflow-hidden border border-border/50 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse" />
                <Badge className="w-fit mb-6 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 px-4 py-1.5 text-sm rounded-full">
                  <Rocket className="w-4 h-4 mr-2" />
                  v2.0 is Live!
                </Badge>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                  Make assessments <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                    fun again.
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg">
                  The anti-cheat platform that students actually enjoy using. Gamified, secure, and lightning fast.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="rounded-full text-lg h-12 px-8 shadow-lg shadow-primary/25 hover:scale-105 transition-transform">
                    Get Started
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-full text-lg h-12 px-8 border-2 hover:bg-background/50">
                    View Demo
                  </Button>
                </div>
              </div>

              {/* Stats Card */}
              <div className="md:col-span-4 bg-card rounded-[2.5rem] p-8 flex flex-col justify-between border border-border/50 shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-green-500 font-bold flex items-center text-sm">+12% <ArrowRight className="w-3 h-3 ml-1 -rotate-45" /></span>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-1">10k+</div>
                  <div className="text-muted-foreground font-medium">Active Users</div>
                </div>
                <div className="mt-6 flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-bold">
                      U{i}
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-background bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    +
                  </div>
                </div>
              </div>

              {/* Feature Card 1 */}
              <div className="md:col-span-5 bg-card rounded-[2.5rem] p-8 border border-border/50 shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-2xl w-fit mb-6">
                  <Brain className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">AI Proctoring</h3>
                <p className="text-muted-foreground">Smart detection that knows the difference between thinking and cheating.</p>
                <div className="mt-6 h-24 bg-muted/50 rounded-xl border border-dashed border-border flex items-center justify-center text-sm text-muted-foreground">
                  [Webcam Feed Placeholder]
                </div>
              </div>

              {/* Feature Card 2 */}
              <div className="md:col-span-7 bg-card rounded-[2.5rem] p-8 border border-border/50 shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-start justify-between">
                  <div>
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-2xl w-fit mb-6">
                      <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">99.9% Accuracy</h3>
                    <p className="text-muted-foreground max-w-xs">Our algorithms are trained on millions of sessions to ensure fairness.</p>
                  </div>
                  <div className="hidden sm:block">
                    <div className="bg-background rounded-xl p-4 shadow-lg border rotate-6 group-hover:rotate-0 transition-transform duration-500">
                      <CheckCircle2 className="w-12 h-12 text-green-500" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-12 border-y bg-muted/30">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <p className="text-sm font-semibold text-muted-foreground mb-8 uppercase tracking-widest">Trusted by innovative teams at</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Placeholders for logos */}
              <div className="flex items-center gap-2 text-xl font-bold"><div className="w-6 h-6 bg-foreground rounded-full" /> Acme Corp</div>
              <div className="flex items-center gap-2 text-xl font-bold"><div className="w-6 h-6 bg-foreground rounded-full" /> Globex</div>
              <div className="flex items-center gap-2 text-xl font-bold"><div className="w-6 h-6 bg-foreground rounded-full" /> Soylent</div>
              <div className="flex items-center gap-2 text-xl font-bold"><div className="w-6 h-6 bg-foreground rounded-full" /> Initech</div>
              <div className="flex items-center gap-2 text-xl font-bold"><div className="w-6 h-6 bg-foreground rounded-full" /> Umbrella</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 md:py-32 relative">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl font-bold tracking-tight md:text-5xl mb-6">
                Everything you need to <span className="text-primary">excel</span>
              </h2>
              <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
                We've packed onBoardX with powerful features to make your assessment process smooth, secure, and insightful.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Shield,
                  title: "Ironclad Anti-Cheat",
                  desc: "Advanced detection for tab switching, copy-pasting, and multiple monitors. Keep it fair for everyone.",
                  color: "text-blue-500",
                  bg: "bg-blue-500/10"
                },
                {
                  icon: Zap,
                  title: "Real-Time Results",
                  desc: "Watch scores roll in live via Socket.io. No more waiting for manual grading or page refreshes.",
                  color: "text-yellow-500",
                  bg: "bg-yellow-500/10"
                },
                {
                  icon: Layout,
                  title: "Beautiful Dashboard",
                  desc: "A command center that's actually a joy to use. Manage users, quizzes, and analytics with ease.",
                  color: "text-purple-500",
                  bg: "bg-purple-500/10"
                },
                {
                  icon: Trophy,
                  title: "Gamified Experience",
                  desc: "Leaderboards, badges, and progress tracking to keep participants engaged and motivated.",
                  color: "text-orange-500",
                  bg: "bg-orange-500/10"
                },
                {
                  icon: Users,
                  title: "Team Management",
                  desc: "Organize users into groups, assign specific quizzes, and track team performance over time.",
                  color: "text-green-500",
                  bg: "bg-green-500/10"
                },
                {
                  icon: CheckCircle2,
                  title: "Auto-Grading",
                  desc: "Save hours of time. Our system grades objective questions instantly and accurately.",
                  color: "text-pink-500",
                  bg: "bg-pink-500/10"
                }
              ].map((feature, i) => (
                <Card key={i} className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-border/50 overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 ${feature.bg} rounded-bl-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-500`} />
                  <CardHeader>
                    <div className={`w-12 h-12 ${feature.bg} ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 bg-muted/50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl font-bold tracking-tight md:text-5xl mb-6">
                Simple as 1, 2, 3
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent border-t-2 border-dashed border-primary/30" />

              {[
                { step: "01", title: "Create Quiz", desc: "Use our intuitive builder to add questions, set timers, and configure anti-cheat rules." },
                { step: "02", title: "Invite Users", desc: "Share a secure link or assign directly to your team members via email." },
                { step: "03", title: "Analyze Results", desc: "Get instant reports, identify knowledge gaps, and export data." }
              ].map((item, i) => (
                <div key={i} className="relative flex flex-col items-center text-center z-10">
                  <div className="w-24 h-24 bg-background border-4 border-primary/10 rounded-full flex items-center justify-center text-3xl font-bold text-primary shadow-xl mb-6 group hover:border-primary transition-colors">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground max-w-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight md:text-5xl mb-6">
                Loved by Developers & Educators
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: "Sarah J.", role: "HR Manager", text: "onBoardX revolutionized our hiring process. The anti-cheat features give us total confidence in our remote assessments." },
                { name: "Mike T.", role: "Lead Instructor", text: "The real-time feedback is a game changer for my classes. Students love seeing their progress instantly." },
                { name: "Alex R.", role: "CTO", text: "Finally, a quiz platform that doesn't look like it was built in 1999. The API and webhooks are fantastic." }
              ].map((testimonial, i) => (
                <Card key={i} className="bg-muted/30 border-none shadow-sm">
                  <CardContent className="pt-6">
                    <div className="flex gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                    </div>
                    <p className="text-lg mb-6 italic">"{testimonial.text}"</p>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback className="bg-primary/20 text-primary">{testimonial.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 bg-muted/50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight md:text-5xl mb-6">
                Simple, Transparent Pricing
              </h2>
              <p className="text-muted-foreground text-xl">Start for free, upgrade as you grow.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Free Tier */}
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-2xl">Starter</CardTitle>
                  <div className="text-4xl font-bold mt-4">$0</div>
                  <p className="text-muted-foreground">Forever free</p>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Up to 50 participants</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Basic Anti-Cheat</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> 1 Admin</li>
                  </ul>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button variant="outline" className="w-full">Get Started</Button>
                </div>
              </Card>

              {/* Pro Tier */}
              <Card className="flex flex-col border-primary shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-xl">POPULAR</div>
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">Pro</CardTitle>
                  <div className="text-4xl font-bold mt-4">$29<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
                  <p className="text-muted-foreground">For growing teams</p>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Up to 500 participants</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Advanced Anti-Cheat</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> 5 Admins</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Analytics Dashboard</li>
                  </ul>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button className="w-full">Start Free Trial</Button>
                </div>
              </Card>

              {/* Enterprise Tier */}
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-2xl">Enterprise</CardTitle>
                  <div className="text-4xl font-bold mt-4">Custom</div>
                  <p className="text-muted-foreground">For large organizations</p>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Unlimited participants</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Custom Integrations</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> SSO & SAML</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Dedicated Support</li>
                  </ul>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button variant="outline" className="w-full">Contact Sales</Button>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24">
          <div className="container px-4 md:px-6 mx-auto max-w-3xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-6">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {[
                { q: "How does the anti-cheat work?", a: "We monitor browser events like tab switching, window resizing, and focus loss. We also have optional webcam proctoring." },
                { q: "Can I export the results?", a: "Yes! You can export all quiz results to CSV, PDF, or directly to your LMS via our API." },
                { q: "Is there a limit on questions?", a: "No, you can create unlimited questions and quizzes on all plans." },
                { q: "Do students need to create an account?", a: "Not necessarily. You can create public links that allow guest access, or require login for better tracking." }
              ].map((faq, i) => (
                <details key={i} className="group border rounded-xl p-4 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer items-center justify-between gap-1.5 font-medium text-lg">
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-muted-foreground" />
                      {faq.q}
                    </div>
                    <span className="shrink-0 rounded-full bg-white p-1.5 text-gray-900 sm:p-3 group-open:-rotate-180 transition-transform">
                      <ChevronDown className="w-5 h-5" />
                    </span>
                  </summary>
                  <p className="mt-4 leading-relaxed text-muted-foreground pl-8">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
          <div className="container px-4 md:px-6 mx-auto text-center relative z-10">
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl mb-6">
              Ready to transform your assessments?
            </h2>
            <p className="text-primary-foreground/80 text-xl max-w-2xl mx-auto mb-10">
              Join thousands of educators and companies using onBoardX today.
            </p>
            <Button asChild size="lg" variant="secondary" className="h-14 px-8 text-lg rounded-full shadow-2xl hover:scale-105 transition-transform">
              <Link href="/auth/signup">
                Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-background border-t pb-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <Link className="flex items-center gap-2 mb-4" href="#">
                <Shield className="w-6 h-6 text-primary" />
                <span className="font-bold text-xl">onBoardX</span>
              </Link>
              <p className="text-muted-foreground max-w-xs">
                The most secure and user-friendly quiz platform for modern teams and schools.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary">Features</Link></li>
                <li><Link href="#" className="hover:text-primary">Pricing</Link></li>
                <li><Link href="#" className="hover:text-primary">Security</Link></li>
                <li><Link href="#" className="hover:text-primary">Roadmap</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary">About</Link></li>
                <li><Link href="#" className="hover:text-primary">Blog</Link></li>
                <li><Link href="#" className="hover:text-primary">Careers</Link></li>
                <li><Link href="#" className="hover:text-primary">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 onBoardX. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link className="text-sm text-muted-foreground hover:text-primary" href="#">Terms</Link>
              <Link className="text-sm text-muted-foreground hover:text-primary" href="#">Privacy</Link>
              <Link className="text-sm text-muted-foreground hover:text-primary" href="#">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
