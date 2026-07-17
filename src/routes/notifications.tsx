import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AppShell } from "@/components/edc/AppShell";
import { NeuralBackground } from "@/components/edc/NeuralBackground";
import { ScrollReveal } from "@/components/edc/ScrollReveal";
import { useUser } from "@/lib/edc/store";
import { useState, useEffect } from "react";
import { Bell, AlarmClock, FileText, Rocket, Users, type LucideIcon } from "lucide-react";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — eDC KnowledgeHub" }] }),
  component: Notifications,
});

interface NotificationItem { id: number; title: string; time: string; urgent?: boolean; Icon: LucideIcon }

const items: NotificationItem[] = [
  { id: 1, title: "YC S25 deadline in 12 days", time: "2h ago", urgent: true, Icon: AlarmClock },
  { id: 2, title: "New Blume India Report 2024 added", time: "Today", Icon: FileText },
  { id: 3, title: "eDC Startup Sprint registration opens", time: "Yesterday", Icon: Rocket },
  { id: 4, title: "Mentor Rohan Mehta is available this week", time: "2 days ago", Icon: Users },
];

function Notifications() {
  const { user } = useUser();
  const [hydrated, setHydrated] = useState(false);

  // wait for useUser() to finish reading localStorage before deciding to
  // redirect — checking `user` on the very first render (before hydration)
  // always sees null and kicks logged-in users back to the landing page.
  useEffect(() => setHydrated(true), []);
  if (!hydrated) return null;
  if (!user) return <Navigate to="/" />;

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-8">

        <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 md:p-8">
          <NeuralBackground className="opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-accent/10 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center"><Bell className="w-5 h-5 text-primary" /></span>
              <h1 className="text-3xl md:text-4xl font-bold">Notifications</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Deadlines, new resources, and mentor updates — all in one place.
            </p>
          </div>
        </section>

        <ScrollReveal>
          <ul className="space-y-3">
            {items.map(n => (
              <li key={n.id} className={`card-lift flex items-center gap-4 bg-card border rounded-2xl p-4 ${n.urgent ? "border-red-500/30" : "border-border"}`}>
                <span className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${n.urgent ? "bg-red-500/10 border-red-500/25 text-red-300" : "bg-primary/10 border-primary/20 text-primary"}`}>
                  <n.Icon className="w-4 h-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </ScrollReveal>

      </div>
    </AppShell>
  );
}