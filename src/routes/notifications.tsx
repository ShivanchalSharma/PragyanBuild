import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AppShell } from "@/components/edc/AppShell";
import { useUser } from "@/lib/edc/store";
import { Bell } from "lucide-react";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — eDC KnowledgeHub" }] }),
  component: Notifications,
});

const items = [
  { id: 1, title: "YC S25 deadline in 12 days", time: "2h ago", urgent: true },
  { id: 2, title: "New Blume India Report 2024 added", time: "Today" },
  { id: 3, title: "eDC Startup Sprint registration opens", time: "Yesterday" },
  { id: 4, title: "Mentor Rohan Mehta is available this week", time: "2 days ago" },
];

function Notifications() {
  const { user } = useUser();
  if (typeof window !== "undefined" && !user) return <Navigate to="/" />;
  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Notifications</h1>
        <ul className="space-y-3">
          {items.map(n => (
            <li key={n.id} className="card-lift flex items-start gap-3 bg-card border border-border rounded-xl p-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${n.urgent ? "bg-red-500/15 text-red-300" : "bg-primary/15 text-primary"}`}>
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
}