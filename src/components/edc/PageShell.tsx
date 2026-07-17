import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/edc/Logo";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/edc/AuthDialog";
import { FooterTagline } from "@/components/edc/FooterTagline";
import { Home, Info, Mail, ShieldCheck, Cookie } from "lucide-react";

interface PageShellProps {
  title: string;
  children: React.ReactNode;
}

export function PageShell({ title, children }: PageShellProps) {
  const [authOpen, setAuthOpen] = useState(false);
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const open = (m: "signup" | "signin") => { setMode(m); setAuthOpen(true); };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">

      {/* Header — same Sign In / Get Started as the hero */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/"><Logo /></Link>
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

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-16 animate-slide-up">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-10">{title}</h1>
        <div className="text-muted-foreground leading-relaxed space-y-4">
          {children}
        </div>
      </main>

      {/* Footer — Quick Access layout, matching the landing page */}
      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h3 className="text-sm font-bold tracking-widest text-foreground uppercase mb-5">
            Quick Access
          </h3>
          <nav className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <Link to="/" className="inline-flex items-center gap-2 hover:text-foreground transition-colors">
              <Home className="w-4 h-4" /> Home
            </Link>
            <Link to="/about" className="inline-flex items-center gap-2 hover:text-foreground transition-colors"><Info className="w-4 h-4" /> About PragyanBuild</Link>
            <Link to="/contact" className="inline-flex items-center gap-2 hover:text-foreground transition-colors"><Mail className="w-4 h-4" /> Contact</Link>
            <Link to="/privacy" className="inline-flex items-center gap-2 hover:text-foreground transition-colors"><ShieldCheck className="w-4 h-4" /> Privacy Policy</Link>
            <Link to="/cookies" className="inline-flex items-center gap-2 hover:text-foreground transition-colors"><Cookie className="w-4 h-4" /> Cookie Policy</Link>
          </nav>
        </div>
        <FooterTagline />
      </footer>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} mode={mode} onSwitchMode={setMode} />
    </div>
  );
}