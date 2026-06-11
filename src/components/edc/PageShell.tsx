import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/edc/Logo";
import { Linkedin, Instagram } from "lucide-react";

interface PageShellProps {
  title: string;
  children: React.ReactNode;
}

export function PageShell({ title, children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">

      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/"><Logo /></Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="/#learn"   className="hover:text-foreground transition-colors">LEARN</a>
            <a href="/#startup" className="hover:text-foreground transition-colors">STARTUP</a>
            <a href="/#raise"   className="hover:text-foreground transition-colors">RAISE</a>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-16 animate-slide-up">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-10">{title}</h1>
        <div className="text-muted-foreground leading-relaxed space-y-4">
          {children}
        </div>
      </main>

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
         <Linkedin className="w-8 h-8" />
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

    </div>
  );
}