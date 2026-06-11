import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { LatestBlogs } from "@/components/edc/LatestBlogs";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/edc/Logo";
import { AuthDialog } from "@/components/edc/AuthDialog";
import { CookieBanner } from "@/components/edc/CookieBanner";
import { NewsAndEvents } from "@/components/edc/NewsAndEvents";
import {
  ArrowRight,
  Sparkles,
  Users,
  Clock,
  BookOpen,
  Rocket,
  TrendingUp,
  Linkedin,
  Instagram,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "eDC KnowledgeHub — Entrepreneurship hub for IIT Delhi" },
      { name: "description", content: "Personalized resources, funding alerts, and mentorship — built for IIT Delhi students." },
      { property: "og:title", content: "eDC Launchpad — IIT Delhi" },
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
  const [heroBg, setHeroBg] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setHeroBg(p => (p + 1) % 3), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2">
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

      {/* Hero */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">

        {/* Slideshow backgrounds */}
        {[
          "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1600&q=80",
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80",
          "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600&q=80",
        ].map((src, i) => (
          <div
            key={i}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{
              backgroundImage: `url(${src})`,
              opacity: heroBg === i ? 1 : 0,
            }}
          />
        ))}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-background/75" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-28 md:py-36 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card/40 backdrop-blur text-xs font-medium text-muted-foreground mb-6 animate-slide-up">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            Built by eDC IIT Delhi · Tech Vertical
          </div>

          <h1
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6 animate-slide-up"
            style={{ animationDelay: "0.05s" }}
          >
            Your entrepreneurship<br />
            journey{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              starts here.
            </span>
          </h1>

          <p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            Personalized resources, funding alerts, and mentorship — built for
            IIT Delhi students.
          </p>

          <div
            className="flex flex-wrap justify-center gap-3 animate-slide-up"
            style={{ animationDelay: "0.15s" }}
          >
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-amber"
              onClick={() => open("signup")}
            >
              Get Started <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => open("signin")}>
              Sign In
            </Button>
          </div>

          {/* Social proof */}
          <div className="mt-20 grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { icon: BookOpen, k: "500+",      v: "resources curated" },
              { icon: Users,    k: "IIT Delhi",  v: "exclusive connects" },
              { icon: Clock,    k: "Updated",    v: "weekly" },
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
      </section>

      {/* Section previews */}
      <section className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-3 gap-6">
        {[
          {
            id: "learn",
            icon: BookOpen,
            title: "LEARN",
            desc: "Books, courses, podcasts and industry reports curated for students.",
            color: "from-primary/30",
          },
          {
            id: "startup",
            icon: Rocket,
            title: "STARTUP",
            desc: "Campus facilities, competitions and institutional connects — IITD only.",
            color: "from-accent/30",
          },
          {
            id: "raise",
            icon: TrendingUp,
            title: "RAISE",
            desc: "Grants, accelerators, VCs and pitch resources for every stage.",
            color: "from-primary/30",
          },
        ].map((s) => (
          <button
            key={s.id}
            onClick={() => open("signup")}
            className="card-lift relative overflow-hidden bg-card border border-border rounded-2xl p-7 text-left w-full hover:border-accent/50 transition-colors group"
          >
            <div className={`absolute -top-20 -right-20 w-48 h-48 rounded-full bg-gradient-to-br ${s.color} to-transparent blur-2xl`} />
            <s.icon className="w-7 h-7 text-accent mb-4 relative" />
            <h3 className="text-2xl font-bold mb-2 relative">{s.title}</h3>
            <p className="text-muted-foreground text-sm relative">{s.desc}</p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-accent opacity-0 group-hover:opacity-100 transition-opacity relative">
              Get started <ArrowRight className="w-3 h-3" />
            </span>
          </button>
        ))}
      </section>

      {/* CTA banner */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/20 via-card to-accent/10 p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            An unfair advantage for IITD students!
          </h2>
          <p className="text-muted-foreground mb-6">
            Makerspace, i-TTO, R&D Partnerships — surfaced exactly when you need them.
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

      <LatestBlogs />
      <NewsAndEvents />

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-6">
            <Link to="/about"   className="hover:text-foreground transition-colors">About eDC</Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/cookies" className="hover:text-foreground transition-colors">Cookie Policy</Link>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://in.linkedin.com/company/edc-iit-delhi" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin className="w-6 h-6" />
            </a>
            <a href="https://www.instagram.com/edc_iitd/?hl=en" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram className="w-6 h-6" />
            </a>
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground pb-6">
          Made with <span className="text-accent">♥</span> by eDC IIT Delhi Tech Vertical
        </p>
      </footer>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} mode={mode} onSwitchMode={setMode} />
      <CookieBanner />
    </div>
  );
}