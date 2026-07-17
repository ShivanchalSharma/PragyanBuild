import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LatestBlogs } from "@/components/edc/LatestBlogs";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/edc/Logo";
import { AuthDialog } from "@/components/edc/AuthDialog";
import { CookieBanner } from "@/components/edc/CookieBanner";
import { NewsAndEvents } from "@/components/edc/NewsAndEvents";
import { SeeItInAction } from "@/components/edc/SeeItInAction";
import { NeuralBackground } from "@/components/edc/NeuralBackground";
import { RisingEmbers } from "@/components/edc/RisingEmbers";
import { FounderGlyphs } from "@/components/edc/FounderGlyphs";
import { IdeaTypewriter } from "@/components/edc/IdeaTypewriter";
import { ScrollReveal } from "@/components/edc/ScrollReveal";
import { FooterTagline } from "@/components/edc/FooterTagline";
import {
  ArrowRight,
  Sparkles,
  Users,
  Clock,
  BookOpen,
  Rocket,
  BrainCircuit,
  TrendingUp,
  Network,
  ChevronDown,
  Home,
  Info,
  Mail,
  ShieldCheck,
  Cookie,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PragyanBuild — Troubleshooting the path from idea to enterprise" },
      { name: "description", content: "From your first idea to your next big milestone — get the right resources, funding, and guidance at every stage." },
      { property: "og:title", content: "PragyanBuild — Think · Build · Launch" },
      { property: "og:description", content: "Your entrepreneurship journey starts here." },
    ],
  }),
  component: Index,
});

function Index() {
  const [authOpen, setAuthOpen] = useState(false);
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const open = (m: "signup" | "signin") => { setMode(m); setAuthOpen(true); };
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border">
        <div className="max-w-7xl mx-auto pl-6 pr-4 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2 -mr-2">
            <Button variant="ghost" onClick={() => open("signin")}>Sign In</Button>
            <Button
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
              onClick={() => open("signup")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero — living neural mesh, no stock photos */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">

        {/* base mood gradient */}
        <div className="absolute inset-0 bg-hero-mesh" />
        <div
          className="absolute inset-0 bg-hero-mesh animate-mesh opacity-40"
          style={{ transform: "scale(1.3)" }}
        />

        {/* rising embers — quiet upward drift behind the headline */}
        <RisingEmbers count={80} />
        <FounderGlyphs />

        {/* soft spotlight behind the headline */}
        <div className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 w-[820px] h-[520px] max-w-[95vw] rounded-full bg-primary/20 blur-[130px] pointer-events-none" />

        {/* legibility vignette so text stays crisp over the mesh */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-10 md:pt-14 pb-28 md:pb-36 text-center">

          {/* PragyanBuild brand moment — leads the hero before the headline */}
          <div className="relative flex flex-col items-center mb-6 animate-slide-up">
            {/* ambient glow behind the wordmark — no icon, just the text-led
                brand moment */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-accent/25 blur-3xl pointer-events-none" />
            <h2 className="relative text-5xl md:text-6xl font-bold tracking-tight leading-none mb-4">
              <span className="text-white">Pragyan</span><span className="text-[#F97316]">Build</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-5">
              Troubleshooting the path from idea to enterprise.
            </p>
            <div className="flex items-center gap-3 text-sm md:text-base font-bold tracking-[0.25em] uppercase">
              <span className="text-white">Think</span>
              <span className="text-[#F97316]">•</span>
              <span className="text-[#F97316]">Build</span>
              <span className="text-white">•</span>
              <span className="text-white">Launch</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card/40 backdrop-blur text-xs font-medium text-muted-foreground mb-6 animate-slide-up">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            Built for innovators · Empowering future leaders
          </div>

          <h1
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6 animate-slide-up"
            style={{ animationDelay: "0.05s" }}
          >
            Your{" "}
            <IdeaTypewriter />{" "}
            startup<br />
            <span className="text-foreground">starts here.</span>
          </h1>

          <p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            From your first idea to your next big milestone — get the right resources, funding, and guidance at every stage.
          </p>

          {/* Social proof */}
          <div className="mt-4 grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { icon: BookOpen, k: "500+",      v: "resources curated " },
              { icon: BrainCircuit,    k: "AI-Powered",  v: "guidance for every stage" },
              { icon: Network,    k: "All-in-One",    v: "Funding, mentors & opportunities" },
            ].map((s, i) => (
              <div
                key={i}
                className="card-lift bg-card/60 backdrop-blur border border-border rounded-xl p-5 text-left animate-slide-up"
                style={{ animationDelay: `${0.2 + i * 0.05}s` }}
              >
                <s.icon className="w-5 h-5 text-accent mb-3" />
                <div className="text-2xl font-bold">{s.k}</div>
                <div className="text-sm text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* scroll cue — nudges visitors to explore before signing up */}
        <button
          onClick={() => window.scrollBy({ top: window.innerHeight * 0.9, behavior: "smooth" })}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors animate-slide-up"
          style={{ animationDelay: "0.4s" }}
          aria-label="Scroll to explore"
        >
          <span className="text-[11px] uppercase tracking-widest">Scroll to explore</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </button>
      </section>

      {/* ===== Everything below the hero shares one live, cursor-reactive background ===== */}
      <div className="relative overflow-hidden">
        {/* reactive neural mesh + drifting founder glyphs */}
        <NeuralBackground />
        <FounderGlyphs />

        {/* real content sits above the mesh */}
        <div className="relative z-10">

          {/* 1. See it in action — the new zig-zag demo section */}
          <SeeItInAction />

          {/* 2. LEARN / STARTUP / RAISE — moved below the See-it container */}
          <ScrollReveal>
            <div className="max-w-6xl mx-auto px-6 text-center mb-12">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/10 text-xs font-bold uppercase tracking-widest text-accent mb-4">
                The hub
              </span>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Explore by what you need.</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Discover, Build and Raise — every resource sorted into three tracks, so you always know
                where to look next.
              </p>
            </div>
          </ScrollReveal>

          <section className="max-w-6xl mx-auto px-6 pb-8 grid md:grid-cols-3 gap-6">
            {[
              {
                id: "learn",
                icon: BookOpen,
                title: "DISCOVER",
                desc: "Books, courses, podcasts, industry reports and expert insights curated specifically for your need.",
                color: "from-primary/30",
              },
              {
                id: "startup",
                icon: Rocket,
                title: "BUILD",
                desc: "Tools, competitions, mentorship and valuable connections to turn your ideas into action.",
                color: "from-accent/30",
              },
              {
                id: "raise",
                icon: TrendingUp,
                title: "RAISE",
                desc: "Grants, government schemes, accelerators, investors and pitch resources to help you fund and scale your venture.",
                color: "from-primary/30",
              },
            ].map((s, i) => (
              <ScrollReveal key={s.id} delay={i * 0.1}>
                <button
                  onClick={() => open("signup")}
                  className="card-lift relative overflow-hidden bg-card border border-border rounded-2xl p-7 text-left w-full h-full hover:border-accent/50 transition-colors group"
                >
                  <div className={`absolute -top-20 -right-20 w-48 h-48 rounded-full bg-gradient-to-br ${s.color} to-transparent blur-2xl`} />
                  <s.icon className="w-7 h-7 text-accent mb-4 relative" />
                  <h3 className="text-2xl font-bold mb-2 relative">{s.title}</h3>
                  <p className="text-muted-foreground text-sm relative">{s.desc}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-accent opacity-0 group-hover:opacity-100 transition-opacity relative">
                    Get started <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              </ScrollReveal>
            ))}
          </section>

          {/* 3. Build my dashboard CTA */}
          <ScrollReveal>
            <section className="max-w-5xl mx-auto px-6 py-16">
              <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/20 via-card to-accent/10 p-12 text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                  Opportunity shouldn't depend on knowing where to look!
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Get the right resources, connections and opportunities before you even know to look for them.
                </p>
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                  onClick={() => open("signup")}
                >
                  Build my dashboard <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </section>
          </ScrollReveal>

          {/* 4. Blogs + News (kept) — still over the live background */}
          <ScrollReveal><LatestBlogs /></ScrollReveal>
          <ScrollReveal><NewsAndEvents /></ScrollReveal>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h3 className="text-sm font-bold tracking-widest text-foreground uppercase mb-5">
            Quick Access
          </h3>
          <nav className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-2 text-left hover:text-foreground transition-colors"
            >
              <Home className="w-4 h-4" /> Home
            </button>
            <Link to="/about" className="inline-flex items-center gap-2 hover:text-foreground transition-colors"><Info className="w-4 h-4" /> About PragyanBuild</Link>
            <Link to="/contact" className="inline-flex items-center gap-2 hover:text-foreground transition-colors"><Mail className="w-4 h-4" /> Contact</Link>
            <Link to="/privacy" className="inline-flex items-center gap-2 hover:text-foreground transition-colors"><ShieldCheck className="w-4 h-4" /> Privacy Policy</Link>
            <Link to="/cookies" className="inline-flex items-center gap-2 hover:text-foreground transition-colors"><Cookie className="w-4 h-4" /> Cookie Policy</Link>
          </nav>
        </div>
        <FooterTagline />
      </footer>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} mode={mode} onSwitchMode={setMode} />
      <CookieBanner />
    </div>
  );
}