import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/edc/AppShell";
import { NeuralBackground } from "@/components/edc/NeuralBackground";
import { ScrollReveal } from "@/components/edc/ScrollReveal";
import { Input } from "@/components/ui/input";
import { useUser, useSaved } from "@/lib/edc/store";
import {
  BookOpen, GraduationCap, LineChart, Search, CheckCircle2, Circle,
  Clock, Layers, Sparkles, Lightbulb, Bookmark, Flame, Plus, X, Pencil, Quote,
  Database, Users, Code2, TrendingUp, Palette, ExternalLink, type LucideIcon,
} from "lucide-react";
import { books, courses, reports } from "@/lib/edc/data";

export const Route = createFileRoute("/discover")({
  head: () => ({ meta: [{ title: "Discover — eDC KnowledgeHub" }] }),
  component: DiscoverPage,
});

// ── format → icon tile ──────────────────────────────────────────────────────
type Fmt = "Book" | "Course" | "Report";
const FMT: Record<Fmt, { Icon: LucideIcon; tile: string; cta: string; hours: number }> = {
  Book:   { Icon: BookOpen,      tile: "bg-purple-500/10 border-purple-500/20 text-purple-300",   cta: "Read",   hours: 5 },
  Course: { Icon: GraduationCap, tile: "bg-sky-500/10 border-sky-500/20 text-sky-300",             cta: "Enroll", hours: 8 },
  Report: { Icon: LineChart,     tile: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300", cta: "Open",   hours: 1 },
};

type Item = { id: string; title: string; sub: string; fmt: Fmt };
const ALL: Record<string, Item> = {};
books.forEach(b => (ALL[b.id] = { id: b.id, title: b.title, sub: b.author, fmt: "Book" }));
courses.forEach(c => (ALL[c.id] = { id: c.id, title: c.title, sub: c.desc, fmt: "Course" }));
reports.forEach(r => (ALL[r.id] = { id: r.id, title: r.title, sub: r.year, fmt: "Report" }));

// ── Hidden Gems — real websites worth knowing about, not just books/courses ──
type GemCategory = "Data & Analytics" | "Community" | "Dev Learning" | "Market Research" | "Design";
interface Gem { id: string; title: string; url: string; desc: string; category: GemCategory }

const GEM_CATEGORY: Record<GemCategory, { Icon: LucideIcon; tile: string }> = {
  "Data & Analytics": { Icon: Database,   tile: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" },
  "Community":        { Icon: Users,      tile: "bg-accent/10 border-accent/20 text-accent" },
  "Dev Learning":      { Icon: Code2,      tile: "bg-sky-500/10 border-sky-500/20 text-sky-300" },
  "Market Research":  { Icon: TrendingUp, tile: "bg-primary/10 border-primary/20 text-primary" },
  "Design":            { Icon: Palette,    tile: "bg-purple-500/10 border-purple-500/20 text-purple-300" },
};

const GEMS: Gem[] = [
  { id: "g1", title: "DataWars", url: "https://www.datawars.io/", desc: "Learn pandas, SQL, and data science by building real projects instead of watching tutorials.", category: "Data & Analytics" },
  { id: "g2", title: "Kaggle", url: "https://www.kaggle.com/", desc: "Real datasets, competitions, and notebooks to practice machine learning on actual data.", category: "Data & Analytics" },
  { id: "g3", title: "Indie Hackers", url: "https://www.indiehackers.com/", desc: "A community of founders building in public — real revenue numbers, real lessons.", category: "Community" },
  { id: "g4", title: "Product Hunt", url: "https://www.producthunt.com/", desc: "See what's launching in tech today, and get your own product discovered on launch day.", category: "Community" },
  { id: "g5", title: "freeCodeCamp", url: "https://www.freecodecamp.org/", desc: "A completely free, project-based curriculum from web dev to machine learning.", category: "Dev Learning" },
  { id: "g6", title: "roadmap.sh", url: "https://roadmap.sh/", desc: "Visual, step-by-step roadmaps for learning any tech role — frontend to DevOps.", category: "Dev Learning" },
  { id: "g7", title: "Exploding Topics", url: "https://explodingtopics.com/", desc: "Surfaces trending topics and markets before they go mainstream — useful for idea validation.", category: "Market Research" },
  { id: "g8", title: "Crunchbase", url: "https://www.crunchbase.com/", desc: "Company, funding, and investor data — good for competitor and market research.", category: "Market Research" },
  { id: "g9", title: "Statista", url: "https://www.statista.com/", desc: "Statistics and market data across nearly every industry — handy for pitch decks.", category: "Market Research" },
  { id: "g10", title: "Dribbble", url: "https://dribbble.com/", desc: "Design inspiration, and a good place to find a freelance designer for your product.", category: "Design" },
];

// ── goals ────────────────────────────────────────────────────────────────────
interface Goal { id: string; text: string; done: boolean }
const DEFAULT_WEEK: Goal[] = [
  { id: "w1", text: "Finish reading The Mom Test", done: false },
  { id: "w2", text: "Talk to 5 potential users", done: false },
];
const DEFAULT_MONTH: Goal[] = [
  { id: "m1", text: "Complete YC Startup School module 1–3", done: false },
  { id: "m2", text: "Read one industry report end-to-end", done: false },
];

function useGoals(key: string, fallback: Goal[]) {
  const [goals, setGoals] = useState<Goal[]>(fallback);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      setGoals(raw ? JSON.parse(raw) : fallback);
    } catch { setGoals(fallback); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const persist = (next: Goal[]) => {
    setGoals(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
  };
  const toggle = (id: string) => persist(goals.map(g => g.id === id ? { ...g, done: !g.done } : g));
  const add = (text: string) => persist([...goals, { id: crypto.randomUUID(), text, done: false }]);
  const edit = (id: string, text: string) => persist(goals.map(g => g.id === id ? { ...g, text } : g));
  const remove = (id: string) => persist(goals.filter(g => g.id !== id));

  return { goals, toggle, add, edit, remove };
}

function GoalRow({ goal, onToggle, onEdit, onRemove }: { goal: Goal; onToggle: () => void; onEdit: (t: string) => void; onRemove: () => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(goal.text);

  if (editing) {
    return (
      <li className="flex items-center gap-3 rounded-xl border border-accent/40 bg-background p-3">
        <Input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && draft.trim()) { onEdit(draft.trim()); setEditing(false); }
            if (e.key === "Escape") { setDraft(goal.text); setEditing(false); }
          }}
          autoFocus
          className="flex-1"
        />
        <button onClick={() => { if (draft.trim()) onEdit(draft.trim()); setEditing(false); }} className="text-xs font-semibold text-accent shrink-0">Save</button>
        <button onClick={() => { setDraft(goal.text); setEditing(false); }} className="text-muted-foreground shrink-0"><X className="w-4 h-4" /></button>
      </li>
    );
  }

  return (
    <li
      onClick={onToggle}
      className={`group flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all ${
        goal.done ? "bg-accent/[0.06] border-accent/30" : "bg-background border-border hover:border-accent/30"
      }`}
    >
      {goal.done ? <CheckCircle2 className="w-5 h-5 text-accent shrink-0" /> : <Circle className="w-5 h-5 text-muted-foreground shrink-0" />}
      <span className={`text-sm flex-1 ${goal.done ? "text-muted-foreground" : "text-foreground"}`}>{goal.text}</span>
      <button onClick={e => { e.stopPropagation(); setEditing(true); }} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground shrink-0 transition-opacity"><Pencil className="w-3.5 h-3.5" /></button>
      <button onClick={e => { e.stopPropagation(); onRemove(); }} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 shrink-0 transition-opacity"><X className="w-3.5 h-3.5" /></button>
    </li>
  );
}

function GoalPanel({ title, storageKey, fallback }: { title: string; storageKey: string; fallback: Goal[] }) {
  const { goals, toggle, add, edit, remove } = useGoals(storageKey, fallback);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const done = goals.filter(g => g.done).length;
  const pct = goals.length ? Math.round((done / goals.length) * 100) : 0;

  const submitAdd = () => {
    if (draft.trim()) add(draft.trim());
    setDraft("");
    setAdding(false);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold">{title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{done} of {goals.length} complete</p>
        </div>
        <div className="text-xl font-bold text-accent tabular-nums">{pct}%</div>
      </div>

      <div className="h-1.5 rounded-full bg-secondary overflow-hidden mb-4">
        <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>

      <ul className="space-y-2.5 flex-1">
        {goals.map(g => (
          <GoalRow key={g.id} goal={g} onToggle={() => toggle(g.id)} onEdit={t => edit(g.id, t)} onRemove={() => remove(g.id)} />
        ))}
        {goals.length === 0 && !adding && (
          <li className="text-sm text-muted-foreground text-center py-6">No goals yet — add one below.</li>
        )}
      </ul>

      {adding ? (
        <div className="flex items-center gap-2 mt-3">
          <Input
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") submitAdd(); if (e.key === "Escape") { setDraft(""); setAdding(false); } }}
            placeholder="New goal…"
            autoFocus
            className="flex-1"
          />
          <button onClick={submitAdd} className="text-xs font-semibold text-accent shrink-0">Add</button>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline">
          <Plus className="w-3.5 h-3.5" /> Add a goal
        </button>
      )}
    </div>
  );
}

// ── icon tile + library card ────────────────────────────────────────────────
function IconTile({ fmt }: { fmt: Fmt }) {
  const f = FMT[fmt];
  return <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${f.tile}`}><f.Icon className="w-5 h-5" /></div>;
}

function LibraryCard({ item }: { item: Item }) {
  const f = FMT[item.fmt];
  const { saved, toggle } = useSaved();
  const isSaved = saved.includes(item.id);
  return (
    <div className="card-lift bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 h-full">
      <div className="flex items-start justify-between">
        <IconTile fmt={item.fmt} />
        <button onClick={() => toggle(item.id)} aria-label="Save">
          <Bookmark className={`w-4 h-4 ${isSaved ? "fill-accent text-accent" : "text-muted-foreground hover:text-foreground"}`} />
        </button>
      </div>
      <div className="flex-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{item.fmt}</span>
        <h4 className="font-semibold leading-snug mt-1">{item.title}</h4>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.sub}</p>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {f.hours}h</span>
        <button className="text-xs font-semibold text-accent hover:underline">{f.cta}</button>
      </div>
    </div>
  );
}

function GemCard({ gem }: { gem: Gem }) {
  const c = GEM_CATEGORY[gem.category];
  const domain = gem.url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return (
    <a
      href={gem.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card-lift group bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 h-full hover:border-accent/40 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${c.tile}`}><c.Icon className="w-5 h-5" /></div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-secondary text-secondary-foreground border-border">{gem.category}</span>
      </div>
      <div className="flex-1">
        <h4 className="font-semibold leading-snug">{gem.title}</h4>
        <p className="text-[11px] text-muted-foreground/70 mt-0.5">{domain}</p>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{gem.desc}</p>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span className="text-xs text-muted-foreground">External site</span>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent group-hover:gap-1.5 transition-all">
          Visit <ExternalLink className="w-3 h-3" />
        </span>
      </div>
    </a>
  );
}

function useCountUp(target: number, ms = 900) {
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

function DiscoverPage() {
  const { user } = useUser();
  const [hydrated, setHydrated] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => setHydrated(true), []);

  const totalResources = books.length + courses.length + reports.length;
  const nResources = useCountUp(totalResources);

  if (!hydrated) return null;
  if (!user) return <Navigate to="/" />;

  const match = (t: string) => t.toLowerCase().includes(query.toLowerCase());
  const fBooks = books.filter(b => match(b.title) || match(b.author));
  const fCourses = courses.filter(c => match(c.title) || match(c.desc));
  const fReports = reports.filter(r => match(r.title));

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-12">

        {/* Hero — warm, no stage/domain shown */}
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 md:p-8">
          <NeuralBackground className="opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/15 via-transparent to-primary/10 pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-6 justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center"><BookOpen className="w-5 h-5 text-purple-300" /></span>
                <h1 className="text-3xl md:text-4xl font-bold">Discover</h1>
              </div>
              <p className="text-muted-foreground max-w-2xl">
                A quiet corner to learn, one goal at a time. Set what you want to get through this week and this month — we'll help you get there.
              </p>
              <div className="grid grid-cols-3 gap-3 mt-6 max-w-lg">
                <div className="bg-card/60 backdrop-blur border border-border rounded-2xl p-4">
                  <Layers className="w-4 h-4 text-accent mb-2.5" />
                  <div className="text-2xl font-bold leading-none">{nResources}</div>
                  <div className="text-xs text-muted-foreground mt-1.5">resources curated</div>
                </div>
                <div className="bg-card/60 backdrop-blur border border-border rounded-2xl p-4">
                  <Sparkles className="w-4 h-4 text-accent mb-2.5" />
                  <div className="text-2xl font-bold leading-none">3</div>
                  <div className="text-xs text-muted-foreground mt-1.5">formats to explore</div>
                </div>
                <div className="bg-card/60 backdrop-blur border border-border rounded-2xl p-4">
                  <Flame className="w-4 h-4 text-accent mb-2.5" />
                  <div className="text-2xl font-bold leading-none">15</div>
                  <div className="text-xs text-muted-foreground mt-1.5">founders reading now</div>
                </div>
              </div>
            </div>

            {/* right-side: motivational quote, fills the space */}
            <div className="hidden lg:flex w-[380px] shrink-0 flex-col justify-center bg-card/50 backdrop-blur border border-purple-500/20 rounded-2xl p-7">
              <Quote className="w-7 h-7 text-purple-300/60 mb-3" />
              <p className="text-xl font-semibold leading-snug">
                "Read 500 pages every day. That's how knowledge works — it builds up, like compound interest."
              </p>
              <p className="text-sm text-muted-foreground mt-3">— Warren Buffett</p>
            </div>
          </div>
        </section>

        {/* Weekly + Monthly goals */}
        <ScrollReveal>
          <div className="grid md:grid-cols-2 gap-6">
            <GoalPanel title="This week's goals" storageKey="edc:discover:goals:week" fallback={DEFAULT_WEEK} />
            <GoalPanel title="This month's goals" storageKey="edc:discover:goals:month" fallback={DEFAULT_MONTH} />
          </div>
        </ScrollReveal>

        {/* Warm row */}
        <ScrollReveal>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/12 to-primary/8 p-6 flex items-start gap-4">
              <span className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center shrink-0"><Flame className="w-5 h-5 text-accent" /></span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-accent mb-1.5">Most-read this week</p>
                <p className="text-base font-semibold">The Mom Test</p>
                <p className="text-xs text-muted-foreground mt-1">Added to 15 IITD founders' lists in the last 7 days.</p>
              </div>
            </div>
            <div className="rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-500/12 to-primary/8 p-6 flex items-start gap-4">
              <span className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/25 flex items-center justify-center shrink-0"><Lightbulb className="w-5 h-5 text-sky-300" /></span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-sky-300 mb-1.5">Learn smarter</p>
                <p className="text-sm font-medium leading-relaxed">Don't binge — apply one idea from each resource to your startup before moving on.</p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Hidden Gems — real websites worth knowing about */}
        <ScrollReveal>
          <section>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center"><Sparkles className="w-4 h-4 text-accent" /></span>
              <h2 className="text-xl font-bold">Hidden Gems</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-5 ml-[42px]">Not books or courses — real websites and tools worth bookmarking, the kind you stumble on and wish you'd found sooner.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {GEMS.map(gem => <GemCard key={gem.id} gem={gem} />)}
            </div>
          </section>
        </ScrollReveal>

        {/* Browse library */}
        <ScrollReveal>
          <section>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold">Browse the library</h2>
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search books, courses, reports…" className="pl-9" />
              </div>
            </div>

            {[
              { label: "Books", items: fBooks.map(b => ALL[b.id]) },
              { label: "Courses", items: fCourses.map(c => ALL[c.id]) },
              { label: "Reports", items: fReports.map(r => ALL[r.id]) },
            ].filter(g => g.items.length > 0).map(group => (
              <div key={group.label} className="mb-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">{group.label}</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {group.items.map(item => <LibraryCard key={item.id} item={item} />)}
                </div>
              </div>
            ))}

            {fBooks.length + fCourses.length + fReports.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-12">No resources match "{query}".</p>
            )}
          </section>
        </ScrollReveal>

      </div>
    </AppShell>
  );
}