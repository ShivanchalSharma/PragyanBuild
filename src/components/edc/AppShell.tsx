import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Home,
  BookOpen,
  Rocket,
  TrendingUp,
  Bookmark,
  Bell,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  Sparkles,
  CheckSquare,
  GitBranch,
  Activity,
  Mic,
  MessageSquare,
  MapPinned,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Logo } from "./Logo";
import { useUser, useSaved } from "@/lib/edc/store";
import { Button } from "@/components/ui/button";

// `color` applies a unique glowing color to each core feature when active/highlighted
type NavItem = { to: string; label: string; icon: typeof Home; badge?: number; color?: string };
type NavGroup = { label: string | null; highlight?: boolean; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    label: null, // no header — this is the primary, always-visible group
    highlight: true,
    items: [
      { to: "/dashboard", label: "Home", icon: Home },
      {
        to: "/discover",
        label: "DISCOVER",
        icon: BookOpen,
        color: "text-purple-400 group-hover:text-purple-300",
      },
      {
        to: "/build",
        label: "BUILD",
        icon: Rocket,
        color: "text-sky-400 group-hover:text-sky-300",
      },
      {
        to: "/raise",
        label: "RAISE",
        icon: TrendingUp,
        color: "text-emerald-400 group-hover:text-emerald-300",
      },
      {
        to: "/bharat",
        label: "BHARAT",
        icon: MapPinned,
        color: "text-orange-400 group-hover:text-orange-300",
      },
      {
        to: "/ai",
        label: "AI Advisor",
        icon: Sparkles,
        color: "text-amber-400 group-hover:text-amber-300",
      },
    ],
  },
  {
    label: "Journey tools",
    items: [
      { to: "/StartupTimeline", label: "Timeline", icon: GitBranch },
      { to: "/tracker", label: "Tracker", icon: CheckSquare },
      { to: "/mentors", label: "Mentors", icon: Mic },
    ],
  },
  {
    label: "More",
    items: [
      { to: "/activityfeed", label: "Community Pulse", icon: Activity },
      { to: "/saved", label: "Saved", icon: Bookmark },
      { to: "/notifications", label: "Notifications", icon: Bell, badge: 3 },
      { to: "/settings", label: "Settings", icon: SettingsIcon },
    ],
  },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { user, setUser } = useUser();
  const { saved } = useSaved();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const initials =
    user?.name
      ?.split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "ED";

  const logout = () => {
    setUser(null);
    navigate({ to: "/" });
  };

  const isActive = (to: string) => pathname.toLowerCase() === to.toLowerCase();

  // NOTE on the sidebar "jerk" when navigating: AppShell is currently mounted
  // fresh inside every route file (each page does <AppShell>...</AppShell>
  // itself), so the whole sidebar unmounts + remounts on every navigation —
  // that's the real cause of the jump, not a bug in this component. The
  // permanent fix is moving AppShell into a shared TanStack layout route
  // (pathless layout + <Outlet/>) so it persists across navigation instead
  // of being torn down each time. Until that refactor happens, transitions
  // below are kept light/fast so a remount reads as a quick fade, not a snap.
  const linkClass = (to: string, highlight?: boolean) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-100 ${
      isActive(to)
        ? "bg-gradient-to-r from-accent/20 to-transparent text-foreground"
        : highlight
          ? "text-foreground/90 hover:bg-accent/10 hover:text-foreground"
          : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
    }`;

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-border bg-sidebar flex-col">
        <div className="p-5 border-b border-border">
          <Logo />
        </div>
        <div className="p-5 border-b border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-sm text-background">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name || "Founder"}</p>
            <span className="inline-block mt-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded bg-accent/15 text-accent">
              {user?.organization || "Founder"}
            </span>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
          {navGroups.map((group, gi) => (
            <div
              key={gi}
              className={group.highlight ? "space-y-1 pb-3 border-b border-border/60" : "space-y-1"}
            >
              {group.label && (
                <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                  {group.label}
                </p>
              )}
              {group.items.map((item) => {
                const active = isActive(item.to);
                const badgeCount = item.label === "Saved" ? saved.length : item.badge;
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={`group ${linkClass(item.to, group.highlight)}`}
                  >
                    <item.icon
                      className={`w-4 h-4 transition-colors duration-100 ${active ? item.color || "text-accent" : group.highlight ? item.color || "text-foreground/70" : ""}`}
                    />
                    <span className="flex-1 font-bold tracking-wide">{item.label}</span>
                    {badgeCount ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-accent text-accent-foreground">
                        {badgeCount}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="p-3 border-t border-border space-y-1">
          <Link to="/feedback" className={linkClass("/feedback", false)}>
            <MessageSquare className={`w-4 h-4 ${isActive("/feedback") ? "text-accent" : ""}`} />
            <span className="font-bold tracking-wide">Give us feedback</span>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors duration-100"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-bold tracking-wide">Log out</span>
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-30 h-14 bg-background/80 backdrop-blur border-b border-border flex items-center justify-between px-4">
        <Logo />
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)}>
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* Mobile slide-out menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Logo />
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <nav className="p-4 space-y-4">
            {navGroups.map((group, gi) => (
              <div
                key={gi}
                className={
                  group.highlight ? "space-y-1 pb-4 border-b border-border/60" : "space-y-1"
                }
              >
                {group.label && (
                  <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                    {group.label}
                  </p>
                )}
                {group.items.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={`group ${linkClass(item.to, group.highlight)}`}
                  >
                    <item.icon
                      className={`w-5 h-5 transition-colors duration-100 ${isActive(item.to) ? item.color || "text-accent" : group.highlight ? item.color || "text-foreground/70" : ""}`}
                    />
                    <span className="font-bold tracking-wide">{item.label}</span>
                  </Link>
                ))}
              </div>
            ))}
            <div className="pt-2 border-t border-border space-y-2">
              <Link
                to="/feedback"
                onClick={() => setMobileOpen(false)}
                className={linkClass("/feedback", false)}
              >
                <MessageSquare
                  className={`w-5 h-5 ${isActive("/feedback") ? "text-accent" : ""}`}
                />
                <span className="font-bold tracking-wide">Give us feedback</span>
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-bold tracking-wide">Log out</span>
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 min-w-0 pt-14 lg:pt-0 pb-20 lg:pb-0">{children}</main>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 h-16 bg-card border-t border-border grid grid-cols-5">
        {[
          { to: "/dashboard", label: "Home", icon: Home },
          { to: "/tracker", label: "Tracker", icon: CheckSquare },
          { to: "/ai", label: "AI", icon: Sparkles },
          { to: "/activityfeed", label: "Community Pulse", icon: Activity },
          { to: "/settings", label: "Profile", icon: SettingsIcon },
        ].map((i) => (
          <Link
            key={i.label}
            to={i.to}
            className={`flex flex-col items-center justify-center gap-1 text-[10px] font-medium ${isActive(i.to) ? "text-accent" : "text-muted-foreground hover:text-foreground"}`}
          >
            <i.icon className="w-5 h-5" /> {i.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
