import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Home, BookOpen, Rocket, TrendingUp, Bookmark, Bell, Settings as SettingsIcon, LogOut, Menu, X, Sparkles, CheckSquare, GitBranch, Activity } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Logo } from "./Logo";
import { useUser, useSaved } from "@/lib/edc/store";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/dashboard", label: "LEARN", icon: BookOpen, tab: "learn" },
  { to: "/dashboard", label: "STARTUP", icon: Rocket, tab: "startup" },
  { to: "/dashboard", label: "RAISE", icon: TrendingUp, tab: "raise" },
  { to: "/tracker", label: "Tracker", icon: CheckSquare },
  { to: "/startuptimeline", label: "Timeline", icon: GitBranch },
  { to: "/activityfeed", label: "Activity", icon: Activity },
  { to: "/saved", label: "Saved", icon: Bookmark },
  { to: "/ai", label: "AI Advisor", icon: Sparkles },
  { to: "/notifications", label: "Notifications", icon: Bell, badge: 3 },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { user, setUser } = useUser();
  const { saved } = useSaved();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: s => s.location.pathname });

  const initials = user?.name?.split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase() || "ED";

  const logout = () => { setUser(null); navigate({ to: "/" }); };

  const fireTab = (tab: string) => {
    navigate({ to: "/dashboard" }).then(() => {
      window.dispatchEvent(new CustomEvent("edc:tab", { detail: tab }));
      setTimeout(() => {
        document.getElementById("learn")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-border bg-sidebar flex-col">
        <div className="p-5 border-b border-border"><Logo /></div>
        <div className="p-5 border-b border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-sm text-background">{initials}</div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name || "Founder"}</p>
            <span className="inline-block mt-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded bg-accent/15 text-accent">IIT Delhi</span>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {nav.map(item => {
            const active = pathname === item.to;
            const badgeCount = item.label === "Saved" ? saved.length : item.badge;
            const baseClass = `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active ? "bg-primary/15 text-foreground" : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"}`;
            if ("tab" in item && item.tab) {
              return (
                <button key={item.label} onClick={() => fireTab(item.tab!)} className={`w-full ${baseClass}`}>
                  <item.icon className="w-4 h-4" />
                  <span className="flex-1 text-left">{item.label}</span>
                </button>
              );
            }
            return (
              <Link key={item.label} to={item.to as string} className={baseClass}>
                <item.icon className="w-4 h-4" />
                <span className="flex-1">{item.label}</span>
                {badgeCount ? <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-accent text-accent-foreground">{badgeCount}</span> : null}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border space-y-1">
          <Link to="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground">Edit My Profile</Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground">
            <LogOut className="w-4 h-4" /> Log out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-30 h-14 bg-background/80 backdrop-blur border-b border-border flex items-center justify-between px-4">
        <Logo />
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></Button>
      </div>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Logo />
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}><X className="w-5 h-5" /></Button>
          </div>
          <nav className="p-4 space-y-1">
            {nav.map(item => {
              const baseClass = "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-sidebar-accent";
              if ("tab" in item && item.tab) {
                return (
                  <button key={item.label} onClick={() => { setMobileOpen(false); fireTab(item.tab!); }} className={`w-full ${baseClass}`}>
                    <item.icon className="w-5 h-5" /> {item.label}
                  </button>
                );
              }
              return (
                <Link key={item.label} to={item.to as string} onClick={() => setMobileOpen(false)} className={baseClass}>
                  <item.icon className="w-5 h-5" /> {item.label}
                </Link>
              );
            })}
            <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-muted-foreground"><LogOut className="w-5 h-5" /> Log out</button>
          </nav>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 min-w-0 pt-14 lg:pt-0 pb-20 lg:pb-0">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 h-16 bg-card border-t border-border grid grid-cols-5">
        {[
          { to: "/", label: "Home", icon: Home },
          { to: "/tracker", label: "Tracker", icon: CheckSquare },
          { to: "/ai", label: "AI", icon: Sparkles },
          { to: "/activityfeed", label: "Activity", icon: Activity },
          { to: "/settings", label: "Profile", icon: SettingsIcon },
        ].map(i => (
          <Link key={i.label} to={i.to} className="flex flex-col items-center justify-center gap-1 text-[10px] text-muted-foreground hover:text-foreground">
            <i.icon className="w-5 h-5" /> {i.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}