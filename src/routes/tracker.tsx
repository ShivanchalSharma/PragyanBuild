import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AppShell } from "@/components/edc/AppShell";
import { NeuralBackground } from "@/components/edc/NeuralBackground";
import { ScrollReveal } from "@/components/edc/ScrollReveal";
import { useUser } from "@/lib/edc/store";
import { useState, useEffect } from "react";
import {
  Plus, X, Calendar, Trophy, Landmark, TrendingUp, GraduationCap,
  Layers, Inbox, Flame, ExternalLink, Save, type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TrackerApp, TrackerStatus, TrackerType } from "@/lib/edc/tracker-store";

export const Route = createFileRoute("/tracker")({
  head: () => ({ meta: [{ title: "Application Tracker — eDC KnowledgeHub" }] }),
  component: Tracker,
});

const COLUMNS: { id: TrackerStatus; label: string; color: string; bg: string; dot: string }[] = [
  { id: "wishlist",  label: "Wishlist",  color: "text-muted-foreground", bg: "bg-secondary/50",  dot: "bg-muted-foreground" },
  { id: "applied",   label: "Applied",   color: "text-sky-400",          bg: "bg-sky-500/10",     dot: "bg-sky-400" },
  { id: "in_review", label: "In Review", color: "text-amber-400",        bg: "bg-amber-500/10",   dot: "bg-amber-400" },
  { id: "accepted",  label: "Accepted",  color: "text-emerald-400",      bg: "bg-emerald-500/10", dot: "bg-emerald-400" },
  { id: "rejected",  label: "Rejected",  color: "text-red-400",          bg: "bg-red-500/10",     dot: "bg-red-400" },
];

const TYPE_META: Record<TrackerType, { Icon: LucideIcon; color: string }> = {
  grant:       { Icon: Landmark,      color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  accelerator: { Icon: TrendingUp,    color: "bg-primary/15 text-primary border-primary/30" },
  competition: { Icon: Trophy,        color: "bg-accent/15 text-accent border-accent/30" },
  fellowship:  { Icon: GraduationCap, color: "bg-purple-500/15 text-purple-300 border-purple-500/30" },
  other:       { Icon: Layers,        color: "bg-secondary text-secondary-foreground border-border" },
};

const STORAGE_KEY = "edc:tracker";
function load(): TrackerApp[] { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; } }
function save(apps: TrackerApp[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(apps)); }

const QUICK_ADD = [
  { title: "Y Combinator S25", type: "accelerator" as const, amount: "$500K", deadline: "12 days" },
  { title: "IHFC Deeptech Grant", type: "grant" as const, amount: "₹25L–2Cr", deadline: "Aug 2025" },
  { title: "BIRAC BIG Grant", type: "grant" as const, amount: "₹50L", deadline: "28 days" },
  { title: "Antler India", type: "accelerator" as const, amount: "₹35L", deadline: "Rolling" },
  { title: "eDC Startup Sprint", type: "competition" as const, amount: "₹2L", deadline: "5 days" },
];

// pull a day-count out of free-text deadlines like "12 days" / "5d" — returns
// null for things like "Rolling" or "Aug 2025" that aren't a countdown.
function parseDays(deadline?: string): number | null {
  if (!deadline) return null;
  const m = deadline.match(/(\d+)\s*d/i);
  return m ? parseInt(m[1], 10) : null;
}

function useCountUp(target: number, ms = 700) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0; const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / ms, 1);
      setV(Math.round((1 - Math.pow(1 - t, 3)) * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

function Tracker() {
  const { user } = useUser();
  const [hydrated, setHydrated] = useState(false);
  const [apps, setApps] = useState<TrackerApp[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [openApp, setOpenApp] = useState<TrackerApp | null>(null);
  const [form, setForm] = useState({ title: "", type: "grant" as TrackerType, amount: "", deadline: "", notes: "", link: "" });

  useEffect(() => { setHydrated(true); setApps(load()); }, []);

  const stats = {
    total: apps.length,
    applied: apps.filter(a => a.status === "applied" || a.status === "in_review").length,
    accepted: apps.filter(a => a.status === "accepted").length,
  };
  const nTotal = useCountUp(stats.total);
  const nApplied = useCountUp(stats.applied);
  const nAccepted = useCountUp(stats.accepted);

  const dueThisWeek = apps.filter(a => {
    const d = parseDays(a.deadline);
    return d !== null && d <= 7 && a.status !== "accepted" && a.status !== "rejected";
  });

  if (!hydrated) return null;
  if (!user) return <Navigate to="/" />;

  function update(next: TrackerApp[]) { setApps(next); save(next); }

  function addApp() {
    if (!form.title.trim()) return;
    const now = Date.now();
    update([...apps, { ...form, id: crypto.randomUUID(), status: "wishlist", addedAt: now, updatedAt: now }]);
    setForm({ title: "", type: "grant", amount: "", deadline: "", notes: "", link: "" });
    setShowAdd(false);
  }
  function quickAdd(item: (typeof QUICK_ADD)[number]) {
    const now = Date.now();
    update([...apps, { ...item, id: crypto.randomUUID(), status: "wishlist", addedAt: now, updatedAt: now }]);
  }
  function moveApp(id: string, status: TrackerStatus) {
    update(apps.map(a => a.id === id ? { ...a, status, updatedAt: Date.now() } : a));
  }
  function deleteApp(id: string) { update(apps.filter(a => a.id !== id)); setOpenApp(null); }
  function onDrop(status: TrackerStatus) { if (dragId) { moveApp(dragId, status); setDragId(null); } }
  function saveDetail(id: string, patch: Partial<TrackerApp>) {
    update(apps.map(a => a.id === id ? { ...a, ...patch, updatedAt: Date.now() } : a));
    setOpenApp(prev => prev && prev.id === id ? { ...prev, ...patch } : prev);
  }

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">

        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 md:p-8">
          <NeuralBackground className="opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-accent/10 pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-6 justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center"><Layers className="w-5 h-5 text-primary" /></span>
                <h1 className="text-3xl md:text-4xl font-bold">Application Tracker</h1>
              </div>
              <p className="text-muted-foreground max-w-2xl">
                Every grant, accelerator and competition — in one board. Drag a card across stages as things move.
              </p>
              <div className="grid grid-cols-3 gap-3 mt-6 max-w-lg">
                <div className="bg-card/60 backdrop-blur border border-border rounded-2xl p-4">
                  <Inbox className="w-4 h-4 text-accent mb-2.5" />
                  <div className="text-2xl font-bold leading-none">{nTotal}</div>
                  <div className="text-xs text-muted-foreground mt-1.5">total tracked</div>
                </div>
                <div className="bg-card/60 backdrop-blur border border-border rounded-2xl p-4">
                  <TrendingUp className="w-4 h-4 text-accent mb-2.5" />
                  <div className="text-2xl font-bold leading-none">{nApplied}</div>
                  <div className="text-xs text-muted-foreground mt-1.5">active / in review</div>
                </div>
                <div className="bg-card/60 backdrop-blur border border-border rounded-2xl p-4">
                  <Trophy className="w-4 h-4 text-accent mb-2.5" />
                  <div className="text-2xl font-bold leading-none">{nAccepted}</div>
                  <div className="text-xs text-muted-foreground mt-1.5">won / accepted</div>
                </div>
              </div>
            </div>
            <Button onClick={() => setShowAdd(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2 shrink-0 self-start lg:self-center">
              <Plus className="w-4 h-4" /> Add application
            </Button>
          </div>
        </section>

        {/* This week's urgency summary */}
        <ScrollReveal>
          {dueThisWeek.length > 0 ? (
            <div className="flex items-center gap-4 rounded-2xl border border-red-500/25 bg-red-500/[0.06] p-5">
              <span className="w-11 h-11 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0"><Flame className="w-5 h-5 text-red-400" /></span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm">
                  {dueThisWeek.length} application{dueThisWeek.length > 1 ? "s" : ""} closing this week
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {dueThisWeek.map(a => a.title).join(" · ")}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] p-5">
              <span className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0"><Flame className="w-5 h-5 text-emerald-400" /></span>
              <p className="font-semibold text-sm">Nothing urgent this week — you're clear.</p>
            </div>
          )}
        </ScrollReveal>

        {/* Quick add */}
        {(() => {
          const remaining = QUICK_ADD.filter(q => !apps.some(a => a.title === q.title));
          // show quick-add as long as there's still something useful to suggest,
          // instead of hiding it after an arbitrary count of tracked apps
          if (remaining.length === 0) return null;
          return (
            <ScrollReveal>
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-sm font-semibold mb-3">Quick add from eDC resources</p>
                <div className="flex flex-wrap gap-2">
                  {remaining.map(q => (
                    <button key={q.title} onClick={() => quickAdd(q)} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-secondary hover:bg-accent/15 hover:text-accent border border-border transition-colors">
                      <Plus className="w-3 h-3" /> {q.title}
                    </button>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          );
        })()}

        {/* Kanban */}
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {COLUMNS.map(col => {
              const colApps = apps.filter(a => a.status === col.id);
              return (
                <div key={col.id} className="flex flex-col gap-3" onDragOver={e => e.preventDefault()} onDrop={() => onDrop(col.id)}>
                  <div className={`flex items-center justify-between px-3 py-2 rounded-lg ${col.bg}`}>
                    <span className={`text-xs font-bold flex items-center gap-1.5 ${col.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${col.dot}`} /> {col.label}
                    </span>
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full bg-background/30 ${col.color}`}>{colApps.length}</span>
                  </div>

                  {colApps.map(app => {
                    const meta = TYPE_META[app.type];
                    const days = parseDays(app.deadline);
                    const urgent = days !== null && days <= 7 && app.status !== "accepted" && app.status !== "rejected";
                    return (
                      <div
                        key={app.id}
                        draggable
                        onDragStart={() => setDragId(app.id)}
                        onDragEnd={() => setDragId(null)}
                        onClick={() => setOpenApp(app)}
                        className={`card-lift bg-card border rounded-xl p-3.5 cursor-pointer transition-all ${
                          dragId === app.id ? "opacity-50 scale-95" : urgent ? "border-red-500/40 hover:border-red-500/60" : "border-border hover:border-accent/40"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2.5">
                          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${meta.color}`}><meta.Icon className="w-4 h-4" /></div>
                          <button onClick={e => { e.stopPropagation(); deleteApp(app.id); }} className="p-0.5 text-muted-foreground hover:text-red-400 shrink-0"><X className="w-3.5 h-3.5" /></button>
                        </div>
                        <p className="text-sm font-semibold leading-snug mb-1">{app.title}</p>
                        {app.amount && <p className="text-xs font-semibold text-emerald-400">{app.amount}</p>}
                        {app.deadline && (
                          <div className={`flex items-center gap-1 text-[10px] mt-1.5 ${urgent ? "text-red-400 font-semibold" : "text-muted-foreground"}`}>
                            <Calendar className="w-3 h-3" /> {app.deadline} {urgent && "· closing soon"}
                          </div>
                        )}
                        <div className="flex gap-1 mt-2.5 flex-wrap" onClick={e => e.stopPropagation()}>
                          {COLUMNS.filter(c => c.id !== col.id).map(c => (
                            <button key={c.id} onClick={() => moveApp(app.id, c.id)} className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${c.bg} ${c.color} hover:opacity-80`}>→ {c.label}</button>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {colApps.length === 0 && (
                    <div className="flex-1 min-h-[88px] rounded-xl border border-dashed border-border/70 flex items-center justify-center">
                      <p className="text-[11px] text-muted-foreground/70">Drop here</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollReveal>

        {apps.length === 0 && (
          <ScrollReveal>
            <div className="flex flex-col items-center justify-center text-center py-16 rounded-3xl border border-dashed border-border bg-card/40">
              <span className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4"><Inbox className="w-5 h-5 text-accent" /></span>
              <h3 className="font-bold mb-1">Nothing tracked yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm">Use "Quick add" above, "Add application", or hit Apply on any funder in Raise.</p>
            </div>
          </ScrollReveal>
        )}

        {/* Add modal */}
        {showAdd && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg">Add application</h2>
                <button onClick={() => setShowAdd(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
              </div>
              {[
                { label: "Name *", key: "title", placeholder: "e.g. Y Combinator S25" },
                { label: "Amount / Prize", key: "amount", placeholder: "e.g. $500K or ₹2L" },
                { label: "Deadline", key: "deadline", placeholder: "e.g. 12 days or Aug 2025" },
                { label: "Link", key: "link", placeholder: "https://..." },
                { label: "Notes", key: "notes", placeholder: "Any notes..." },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
                  <Input value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} />
                </div>
              ))}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Type</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as TrackerType }))} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none">
                  {(["grant", "accelerator", "competition", "fellowship", "other"] as TrackerType[]).map(t => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>
              <Button onClick={addApp} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">Add to tracker</Button>
            </div>
          </div>
        )}

        {/* Detail / expand modal */}
        {openApp && (
          <DetailModal app={openApp} onClose={() => setOpenApp(null)} onSave={saveDetail} onDelete={deleteApp} />
        )}

      </div>
    </AppShell>
  );
}

function DetailModal({ app, onClose, onSave, onDelete }: {
  app: TrackerApp;
  onClose: () => void;
  onSave: (id: string, patch: Partial<TrackerApp>) => void;
  onDelete: (id: string) => void;
}) {
  const [notes, setNotes] = useState(app.notes || "");
  const [link, setLink] = useState(app.link || "");
  const [deadline, setDeadline] = useState(app.deadline || "");
  const meta = TYPE_META[app.type];
  const col = COLUMNS.find(c => c.id === app.status)!;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md space-y-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${meta.color}`}><meta.Icon className="w-5 h-5" /></div>
            <div>
              <h2 className="font-bold leading-tight">{app.title}</h2>
              <span className={`text-xs font-bold ${col.color}`}>{col.label}</span>
            </div>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>

        {app.amount && <p className="text-sm font-semibold text-emerald-400">{app.amount}</p>}

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Deadline</label>
          <Input value={deadline} onChange={e => setDeadline(e.target.value)} placeholder="e.g. 12 days or Aug 2025" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Link</label>
          <div className="flex gap-2">
            <Input value={link} onChange={e => setLink(e.target.value)} placeholder="https://..." className="flex-1" />
            {link && <a href={link} target="_blank" rel="noopener noreferrer" className="shrink-0 w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:border-accent/40"><ExternalLink className="w-4 h-4 text-accent" /></a>}
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Notes</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            placeholder="Any notes on this application…"
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent/50 resize-none"
          />
        </div>

        <p className="text-[11px] text-muted-foreground">
          Added {new Date(app.addedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          {app.updatedAt !== app.addedAt && <> · updated {new Date(app.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</>}
        </p>

        <div className="flex gap-2">
          <Button onClick={() => { onSave(app.id, { notes, link, deadline }); onClose(); }} className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2">
            <Save className="w-4 h-4" /> Save
          </Button>
          <Button variant="outline" onClick={() => onDelete(app.id)} className="text-red-400 hover:text-red-300">Delete</Button>
        </div>
      </div>
    </div>
  );
}