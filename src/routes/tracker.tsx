import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AppShell } from "@/components/edc/AppShell";
import { useUser } from "@/lib/edc/store";
import { useState, useEffect } from "react";
import { Plus, X, GripVertical, ExternalLink, Calendar, Trophy, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/tracker")({
  head: () => ({ meta: [{ title: "Application Tracker — eDC KnowledgeHub" }] }),
  component: Tracker,
});

type Status = "wishlist" | "applied" | "in_review" | "accepted" | "rejected";

interface Application {
  id: string;
  title: string;
  type: "grant" | "accelerator" | "competition" | "fellowship" | "other";
  amount?: string;
  deadline?: string;
  status: Status;
  notes?: string;
  link?: string;
  addedAt: number;
}

const COLUMNS: { id: Status; label: string; color: string; bg: string }[] = [
  { id: "wishlist", label: "Wishlist", color: "text-muted-foreground", bg: "bg-secondary/50" },
  { id: "applied", label: "Applied", color: "text-sky-400", bg: "bg-sky-500/10" },
  { id: "in_review", label: "In Review", color: "text-amber-400", bg: "bg-amber-500/10" },
  { id: "accepted", label: "Accepted", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { id: "rejected", label: "Rejected", color: "text-red-400", bg: "bg-red-500/10" },
];

const TYPE_COLORS: Record<string, string> = {
  grant: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  accelerator: "bg-primary/15 text-primary border-primary/30",
  competition: "bg-accent/15 text-accent border-accent/30",
  fellowship: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  other: "bg-secondary text-secondary-foreground border-border",
};

const STORAGE_KEY = "edc:tracker";

function load(): Application[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}
function save(apps: Application[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
}

const QUICK_ADD = [
  { title: "Y Combinator S25", type: "accelerator" as const, amount: "$500K", deadline: "12 days" },
  {
    title: "IHFC Deeptech Grant",
    type: "grant" as const,
    amount: "₹25L–2Cr",
    deadline: "Aug 2025",
  },
  { title: "BIRAC BIG Grant", type: "grant" as const, amount: "₹50L", deadline: "28 days" },
  { title: "Antler India", type: "accelerator" as const, amount: "₹35L", deadline: "Rolling" },
  { title: "eDC Startup Sprint", type: "competition" as const, amount: "₹2L", deadline: "5 days" },
];

function Tracker() {
  const { user } = useUser();
  const [hydrated, setHydrated] = useState(false);
  const [apps, setApps] = useState<Application[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    type: "grant" as Application["type"],
    amount: "",
    deadline: "",
    notes: "",
    link: "",
  });

  useEffect(() => {
    setHydrated(true);
    setApps(load());
  }, []);

  if (!hydrated) return null;
  if (!user) return <Navigate to="/" />;

  function update(next: Application[]) {
    setApps(next);
    save(next);
  }

  function addApp() {
    if (!form.title.trim()) return;
    const next: Application = {
      ...form,
      id: crypto.randomUUID(),
      status: "wishlist",
      addedAt: Date.now(),
    };
    update([...apps, next]);
    setForm({ title: "", type: "grant", amount: "", deadline: "", notes: "", link: "" });
    setShowAdd(false);
  }

  function quickAdd(item: (typeof QUICK_ADD)[number]) {
    const next: Application = {
      ...item,
      id: crypto.randomUUID(),
      status: "wishlist",
      addedAt: Date.now(),
    };
    update([...apps, next]);
  }

  function moveApp(id: string, status: Status) {
    update(apps.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  function deleteApp(id: string) {
    update(apps.filter((a) => a.id !== id));
  }

  function onDrop(status: Status) {
    if (dragId) {
      moveApp(dragId, status);
      setDragId(null);
    }
  }

  const stats = {
    total: apps.length,
    applied: apps.filter((a) => a.status === "applied" || a.status === "in_review").length,
    accepted: apps.filter((a) => a.status === "accepted").length,
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Application Tracker</h1>
            <p className="text-muted-foreground mt-1">
              Track grants, accelerators and competitions in one place.
            </p>
          </div>
          <Button
            onClick={() => setShowAdd(true)}
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2"
          >
            <Plus className="w-4 h-4" /> Add application
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Total tracked", value: stats.total },
            { label: "Active / in review", value: stats.applied },
            { label: "Won / accepted", value: stats.accepted },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-4">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick add from platform */}
        {apps.length === 0 && (
          <div className="mb-8 p-5 bg-card border border-border rounded-xl">
            <p className="text-sm font-semibold mb-3">Quick add from eDC resources</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_ADD.map((q) => (
                <button
                  key={q.title}
                  onClick={() => quickAdd(q)}
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-secondary hover:bg-accent/15 hover:text-accent border border-border transition-colors"
                >
                  <Plus className="w-3 h-3" /> {q.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Kanban */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {COLUMNS.map((col) => {
            const colApps = apps.filter((a) => a.status === col.id);
            return (
              <div
                key={col.id}
                className="flex flex-col gap-2 min-h-48"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(col.id)}
              >
                {/* Column header */}
                <div className={`flex items-center justify-between px-3 py-2 rounded-lg ${col.bg}`}>
                  <span className={`text-xs font-bold ${col.color}`}>{col.label}</span>
                  <span
                    className={`text-xs font-bold px-1.5 py-0.5 rounded-full bg-background/30 ${col.color}`}
                  >
                    {colApps.length}
                  </span>
                </div>

                {/* Cards */}
                {colApps.map((app) => (
                  <div
                    key={app.id}
                    draggable
                    onDragStart={() => setDragId(app.id)}
                    onDragEnd={() => setDragId(null)}
                    className={`bg-card border border-border rounded-xl p-3 cursor-grab active:cursor-grabbing transition-all ${dragId === app.id ? "opacity-50 scale-95" : "hover:border-accent/40"}`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-2">
                      <p className="text-sm font-semibold leading-snug flex-1">{app.title}</p>
                      <button
                        onClick={() => deleteApp(app.id)}
                        className="p-0.5 text-muted-foreground hover:text-red-400 shrink-0"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${TYPE_COLORS[app.type]}`}
                      >
                        {app.type}
                      </span>
                      {app.amount && (
                        <span className="text-[10px] font-semibold text-emerald-400">
                          {app.amount}
                        </span>
                      )}
                    </div>
                    {app.deadline && (
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-2">
                        <Calendar className="w-3 h-3" /> {app.deadline}
                      </div>
                    )}
                    {/* Move buttons */}
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {COLUMNS.filter((c) => c.id !== col.id).map((c) => (
                        <button
                          key={c.id}
                          onClick={() => moveApp(app.id, c.id)}
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${c.bg} ${c.color} hover:opacity-80`}
                        >
                          → {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Drop zone hint */}
                {colApps.length === 0 && (
                  <div className="flex-1 border border-dashed border-border rounded-xl flex items-center justify-center p-4">
                    <p className="text-[10px] text-muted-foreground text-center">Drop here</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add modal */}
        {showAdd && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg">Add application</h2>
                <button onClick={() => setShowAdd(false)}>
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              {[
                { label: "Name *", key: "title", placeholder: "e.g. Y Combinator S25" },
                { label: "Amount / Prize", key: "amount", placeholder: "e.g. $500K or ₹2L" },
                { label: "Deadline", key: "deadline", placeholder: "e.g. 12 days or Aug 2025" },
                { label: "Link", key: "link", placeholder: "https://..." },
                { label: "Notes", key: "notes", placeholder: "Any notes..." },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
                  <input
                    value={(form as any)[f.key]}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent/50"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Type</label>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, type: e.target.value as Application["type"] }))
                  }
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none"
                >
                  {["grant", "accelerator", "competition", "fellowship", "other"].map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                onClick={addApp}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
              >
                Add to tracker
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
