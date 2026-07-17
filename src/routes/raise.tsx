import { createFileRoute, Navigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/edc/AppShell";
import { NeuralBackground } from "@/components/edc/NeuralBackground";
import { ScrollReveal } from "@/components/edc/ScrollReveal";
import { Input } from "@/components/ui/input";
import { useUser, useSaved } from "@/lib/edc/store";
import {
  TrendingUp, Landmark, FileText, Search, CheckCircle2, Circle,
  Layers, Sparkles, Lightbulb, Bookmark, Flame, Plus, X, Pencil, ArrowRight, CheckSquare, Quote, Check,
  Users, Building2, Handshake, ArrowUpRight, type LucideIcon,
} from "lucide-react";
import { funders, pitchResources } from "@/lib/edc/data";
import { addToTracker, isTracked } from "@/lib/edc/tracker-store";

export const Route = createFileRoute("/raise")({
  head: () => ({ meta: [{ title: "Raise — eDC KnowledgeHub" }] }),
  component: RaisePage,
});

// ── Who's Backing Founders — curated from eDC's Startup Resource
// Knowledgebase (compiled July 2026). Figures are as publicly reported at
// that date and change often — always confirm current terms on the
// programme's own site before advising anyone to apply.
type BackerCategory = "Angels" | "VCs" | "Incubators" | "Corporate Programmes";
interface Backer { id: string; name: string; desc: string; highlight: string; category: BackerCategory }

const BACKER_CATEGORY: Record<BackerCategory, { Icon: LucideIcon; tile: string }> = {
  Angels:                  { Icon: Users,     tile: "bg-rose-500/10 border-rose-500/20 text-rose-300" },
  VCs:                     { Icon: TrendingUp,tile: "bg-primary/10 border-primary/20 text-primary" },
  Incubators:              { Icon: Building2, tile: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" },
  "Corporate Programmes":  { Icon: Handshake, tile: "bg-orange-500/10 border-orange-500/20 text-orange-300" },
};

const BACKERS: Backer[] = [
  // Angels & angel networks
  { id: "a1", name: "Indian Angel Network (IAN)", desc: "Asia's largest angel network — 500+ members, backed Ola, Spinny, and Druva.", highlight: "₹25L–₹5Cr cheques", category: "Angels" },
  { id: "a2", name: "Mumbai Angels", desc: "One of India's oldest angel networks, with a strong fintech and financial-services focus.", highlight: "Fintech-focused", category: "Angels" },
  { id: "a3", name: "LetsVenture", desc: "India's largest online syndication platform — standardised term sheets, fast closes.", highlight: "Online syndication", category: "Angels" },
  { id: "a4", name: "AngelList India", desc: "SPV/RUV infrastructure that lets angels co-invest deal-by-deal alongside lead investors.", highlight: "Deal-by-deal SPVs", category: "Angels" },
  { id: "a5", name: "100X.VC", desc: "India's first firm to invest via India-SAFE notes — fast, standardised early paperwork.", highlight: "India-SAFE notes", category: "Angels" },
  { id: "a6", name: "TiE Angels", desc: "Founder-focused angel chapters (Delhi, Bangalore, Mumbai) inside the global TiE network.", highlight: "Founder-run chapters", category: "Angels" },

  // Venture capital firms — India
  { id: "v1", name: "Peak XV Partners", desc: "Formerly Sequoia India — seed through pre-IPO. Backed Zomato, CRED, Razorpay.", highlight: "$10B+ AUM", category: "VCs" },
  { id: "v2", name: "Accel India", desc: "Seed to Series B, with Flipkart, Swiggy, and Freshworks in its portfolio.", highlight: "$650M Fund VIII", category: "VCs" },
  { id: "v3", name: "Blume Ventures", desc: "Pre-seed and seed specialist behind Unacademy, Dunzo, and Purplle.", highlight: "Pre-seed / Seed", category: "VCs" },
  { id: "v4", name: "Nexus Venture Partners", desc: "Seed through growth, with a strong enterprise-software specialism.", highlight: "$700M Fund VIII", category: "VCs" },
  { id: "v5", name: "Elevation Capital", desc: "Formerly SAIF Partners — seed to growth, backed Paytm and Swiggy.", highlight: "Multiple vintages", category: "VCs" },
  { id: "v6", name: "Stellaris Venture Partners", desc: "Seed to Series A, with a notable tilt toward AI-focused startups.", highlight: "$300M Fund III", category: "VCs" },

  // Incubators
  { id: "i1", name: "FITT — IIT Delhi", desc: "IIT Delhi's own Foundation for Innovation & Technology Transfer, with a strong industry-linkage model.", highlight: "IIT Delhi's own incubator", category: "Incubators" },
  { id: "i2", name: "NSRCEL — IIM Bangalore", desc: "One of India's oldest and most respected incubators — strong on women entrepreneurs and social ventures.", highlight: "Women & social ventures", category: "Incubators" },
  { id: "i3", name: "CIIE.CO — IIM Ahmedabad", desc: "Runs the Bharat Innovation Fund, with a focus on AgriTech and Cleantech.", highlight: "AgriTech / Cleantech", category: "Incubators" },
  { id: "i4", name: "SINE — IIT Bombay", desc: "Research-heavy incubator for deep-tech and hardware ventures.", highlight: "Deep-tech & hardware", category: "Incubators" },
  { id: "i5", name: "T-Hub", desc: "India's largest innovation ecosystem, with deep corporate and government-contract access.", highlight: "India's largest hub", category: "Incubators" },
  { id: "i6", name: "Villgro", desc: "A pioneer in social-enterprise incubation across health, agriculture, and clean energy.", highlight: "Social enterprise", category: "Incubators" },

  // Corporate innovation / compute-credit programmes
  { id: "c1", name: "Google for Startups", desc: "Global accelerator tracks plus cloud credits, equity-free, active across 87 countries.", highlight: "Up to $350K credits", category: "Corporate Programmes" },
  { id: "c2", name: "Microsoft for Startups Founders Hub", desc: "Azure and OpenAI API credits with no pitch process and no equity taken.", highlight: "Up to $150K, 0% equity", category: "Corporate Programmes" },
  { id: "c3", name: "NVIDIA Inception", desc: "A free global AI-startup network with GPU discounts and technical training.", highlight: "40,000+ members, 0% equity", category: "Corporate Programmes" },
  { id: "c4", name: "AWS Activate", desc: "Tiered cloud credits for startups building on AWS, with a larger GAIA tier for AI-native founders.", highlight: "Up to $1M (GAIA tier)", category: "Corporate Programmes" },
  { id: "c5", name: "JioGenNext", desc: "Reliance Jio's corporate incubator, offering market access at telecom and retail scale.", highlight: "Telecom / retail scale", category: "Corporate Programmes" },
  { id: "c6", name: "Cisco LaunchPad", desc: "Corporate incubator offering enterprise pilot access for networking and IoT startups.", highlight: "Enterprise pilots", category: "Corporate Programmes" },
];

// ── kind → icon tile ─────────────────────────────────────────────────────────
type Kind = "Funder" | "Pitch";
const KIND: Record<Kind, { Icon: LucideIcon; tile: string; cta: string }> = {
  Funder: { Icon: Landmark, tile: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300", cta: "Apply" },
  Pitch:  { Icon: FileText, tile: "bg-primary/10 border-primary/20 text-primary",              cta: "Download" },
};

interface Item { id: string; kind: Kind; title: string; sub: string; meta?: string; footer?: string }
const ALL: Item[] = [
  ...funders.map(f => ({ id: f.id, kind: "Funder" as const, title: f.title, sub: f.stage, meta: f.amount, footer: f.deadline })),
  ...pitchResources.map(p => ({ id: p.id, kind: "Pitch" as const, title: p.title, sub: "Free download" })),
];

// ── funding-readiness checklist (goals, on-topic for Raise) ─────────────────
interface Goal { id: string; text: string; done: boolean }
const DEFAULT_WEEK: Goal[] = [
  { id: "w1", text: "Update the pitch deck with latest traction", done: false },
  { id: "w2", text: "Shortlist 5 investors to reach out to", done: false },
];
const DEFAULT_MONTH: Goal[] = [
  { id: "m1", text: "Send 20 investor emails", done: false },
  { id: "m2", text: "Apply to one grant or accelerator", done: false },
];

function useGoals(key: string, fallback: Goal[]) {
  const [goals, setGoals] = useState<Goal[]>(fallback);
  useEffect(() => {
    try { const raw = localStorage.getItem(key); setGoals(raw ? JSON.parse(raw) : fallback); }
    catch { setGoals(fallback); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const persist = (next: Goal[]) => { setGoals(next); try { localStorage.setItem(key, JSON.stringify(next)); } catch {} };
  return {
    goals,
    toggle: (id: string) => persist(goals.map(g => g.id === id ? { ...g, done: !g.done } : g)),
    add: (text: string) => persist([...goals, { id: crypto.randomUUID(), text, done: false }]),
    edit: (id: string, text: string) => persist(goals.map(g => g.id === id ? { ...g, text } : g)),
    remove: (id: string) => persist(goals.filter(g => g.id !== id)),
  };
}

function GoalRow({ goal, onToggle, onEdit, onRemove }: { goal: Goal; onToggle: () => void; onEdit: (t: string) => void; onRemove: () => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(goal.text);
  if (editing) {
    return (
      <li className="flex items-center gap-3 rounded-xl border border-accent/40 bg-background p-3">
        <Input value={draft} onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && draft.trim()) { onEdit(draft.trim()); setEditing(false); } if (e.key === "Escape") { setDraft(goal.text); setEditing(false); } }}
          autoFocus className="flex-1" />
        <button onClick={() => { if (draft.trim()) onEdit(draft.trim()); setEditing(false); }} className="text-xs font-semibold text-accent shrink-0">Save</button>
        <button onClick={() => { setDraft(goal.text); setEditing(false); }} className="text-muted-foreground shrink-0"><X className="w-4 h-4" /></button>
      </li>
    );
  }
  return (
    <li onClick={onToggle} className={`group flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all ${goal.done ? "bg-accent/[0.06] border-accent/30" : "bg-background border-border hover:border-accent/30"}`}>
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
  const submitAdd = () => { if (draft.trim()) add(draft.trim()); setDraft(""); setAdding(false); };

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
        {goals.map(g => <GoalRow key={g.id} goal={g} onToggle={() => toggle(g.id)} onEdit={t => edit(g.id, t)} onRemove={() => remove(g.id)} />)}
        {goals.length === 0 && !adding && <li className="text-sm text-muted-foreground text-center py-6">No goals yet — add one below.</li>}
      </ul>
      {adding ? (
        <div className="flex items-center gap-2 mt-3">
          <Input value={draft} onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") submitAdd(); if (e.key === "Escape") { setDraft(""); setAdding(false); } }}
            placeholder="New goal…" autoFocus className="flex-1" />
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

// ── library card ─────────────────────────────────────────────────────────────
function RaiseCard({ item }: { item: Item }) {
  const k = KIND[item.kind];
  const { saved, toggle } = useSaved();
  const isSaved = saved.includes(item.id);
  const [tracked, setTracked] = useState(false);

  useEffect(() => { if (item.kind === "Funder") setTracked(isTracked(item.title)); }, [item.title, item.kind]);

  const handleCta = () => {
    if (item.kind !== "Funder") return; // pitch resources are downloads, not applications
    const added = addToTracker({ title: item.title, type: "grant", amount: item.meta, deadline: item.footer });
    if (added) setTracked(true);
  };

  return (
    <div className="card-lift bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 h-full">
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${k.tile}`}><k.Icon className="w-5 h-5" /></div>
        <button onClick={() => toggle(item.id)} aria-label="Save"><Bookmark className={`w-4 h-4 ${isSaved ? "fill-accent text-accent" : "text-muted-foreground hover:text-foreground"}`} /></button>
      </div>
      <div className="flex-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{item.kind}</span>
        <h4 className="font-semibold leading-snug mt-1">{item.title}</h4>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.sub}</p>
        {item.meta && <p className="text-sm font-bold text-accent mt-2">{item.meta}</p>}
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span className="text-xs text-muted-foreground">{item.footer || ""}</span>
        {item.kind === "Funder" ? (
          <button onClick={handleCta} disabled={tracked} className={`text-xs font-semibold hover:underline inline-flex items-center gap-1 ${tracked ? "text-emerald-400 cursor-default" : "text-accent"}`}>
            {tracked ? <><Check className="w-3 h-3" /> Tracked</> : k.cta}
          </button>
        ) : (
          <button className="text-xs font-semibold text-accent hover:underline">{k.cta}</button>
        )}
      </div>
    </div>
  );
}

function BackerCard({ b }: { b: Backer }) {
  const c = BACKER_CATEGORY[b.category];
  return (
    <div className="card-lift bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 h-full">
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${c.tile}`}><c.Icon className="w-5 h-5" /></div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-secondary text-secondary-foreground border-border">{b.category}</span>
      </div>
      <div className="flex-1">
        <h4 className="font-semibold leading-snug">{b.name}</h4>
        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{b.desc}</p>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <p className="text-xs font-bold text-accent">{b.highlight}</p>
        <button className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline shrink-0">
          Read more <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
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

function RaisePage() {
  const { user } = useUser();
  const [hydrated, setHydrated] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => setHydrated(true), []);
  const nFunders = useCountUp(funders.length);

  if (!hydrated) return null;
  if (!user) return <Navigate to="/" />;

  const match = (t: string) => t.toLowerCase().includes(query.toLowerCase());
  const filtered = ALL.filter(i => match(i.title) || match(i.sub));
  const groups: { label: string; items: Item[] }[] = [
    { label: "Funders, Grants & Accelerators", items: filtered.filter(i => i.kind === "Funder") },
    { label: "Pitch Resources", items: filtered.filter(i => i.kind === "Pitch") },
  ];

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-12">

        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 md:p-8">
          <NeuralBackground className="opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/15 via-transparent to-primary/10 pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-6 justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-emerald-300" /></span>
                <h1 className="text-3xl md:text-4xl font-bold">Raise</h1>
              </div>
              <p className="text-muted-foreground max-w-2xl">
                Funding is a numbers game and a story game. Set your outreach goals, track them here, then work the list of grants, accelerators, and investors that fit where you are.
              </p>
              <div className="grid grid-cols-3 gap-3 mt-6 max-w-lg">
                <div className="bg-card/60 backdrop-blur border border-border rounded-2xl p-4">
                  <Layers className="w-4 h-4 text-accent mb-2.5" />
                  <div className="text-2xl font-bold leading-none">{nFunders}</div>
                  <div className="text-xs text-muted-foreground mt-1.5">funding paths listed</div>
                </div>
                <div className="bg-card/60 backdrop-blur border border-border rounded-2xl p-4">
                  <Sparkles className="w-4 h-4 text-accent mb-2.5" />
                  <div className="text-2xl font-bold leading-none">₹2Cr+</div>
                  <div className="text-xs text-muted-foreground mt-1.5">total grants available</div>
                </div>
                <div className="bg-card/60 backdrop-blur border border-border rounded-2xl p-4">
                  <Flame className="w-4 h-4 text-accent mb-2.5" />
                  <div className="text-2xl font-bold leading-none">30%</div>
                  <div className="text-xs text-muted-foreground mt-1.5">rise in applications</div>
                </div>
              </div>
            </div>

            {/* right-side: motivational quote, fills the space */}
            <div className="hidden lg:flex w-[380px] shrink-0 flex-col justify-center bg-card/50 backdrop-blur border border-emerald-500/20 rounded-2xl p-7">
              <Quote className="w-7 h-7 text-emerald-300/60 mb-3" />
              <p className="text-xl font-semibold leading-snug">
                "Fundraising is a full-time job. The founders who raise are the ones who never stop asking."
              </p>
              <p className="text-sm text-muted-foreground mt-3">— YC partner wisdom</p>
            </div>
          </div>
        </section>

        {/* Weekly + Monthly raise goals */}
        <ScrollReveal>
          <div className="grid md:grid-cols-2 gap-6">
            <GoalPanel title="This week's raise goals" storageKey="edc:raise:goals:week" fallback={DEFAULT_WEEK} />
            <GoalPanel title="This month's raise goals" storageKey="edc:raise:goals:month" fallback={DEFAULT_MONTH} />
          </div>
        </ScrollReveal>

        {/* Who's Backing Founders — Angels, VCs, Incubators, Corporate Programmes */}
        <ScrollReveal>
          <section>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center"><Handshake className="w-4 h-4 text-accent" /></span>
              <h2 className="text-xl font-bold">Who's Backing Founders</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-5 ml-[42px]">
              Angels, VCs, incubators, and corporate programmes actually active right now — curated from eDC's Startup Resource Knowledgebase, July 2026. Figures change often; confirm current terms on the programme's own site.
            </p>

            {(["Angels", "VCs", "Incubators", "Corporate Programmes"] as BackerCategory[]).map(cat => (
              <div key={cat} className="mb-8 last:mb-0">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">{cat}</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {BACKERS.filter(b => b.category === cat).map(b => <BackerCard key={b.id} b={b} />)}
                </div>
              </div>
            ))}
          </section>
        </ScrollReveal>

        {/* Tracker teaser */}
        <ScrollReveal>
          <Link to="/tracker" className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 hover:border-accent/40 transition-colors">
            <div className="flex items-center gap-4">
              <span className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0"><CheckSquare className="w-5 h-5 text-primary" /></span>
              <div>
                <p className="font-semibold">Tracking applications already?</p>
                <p className="text-sm text-muted-foreground">Manage every grant, accelerator and competition in one board.</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent shrink-0 group-hover:gap-2.5 transition-all">Open tracker <ArrowRight className="w-4 h-4" /></span>
          </Link>
        </ScrollReveal>

        {/* Warm row */}
        <ScrollReveal>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/12 to-primary/8 p-6 flex items-start gap-4">
              <span className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center shrink-0"><Flame className="w-5 h-5 text-accent" /></span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-accent mb-1.5">Closing soon</p>
                <p className="text-base font-semibold">Y Combinator S25 — 12 days left</p>
                <p className="text-xs text-muted-foreground mt-1">$500K standard deal, rolling applications.</p>
              </div>
            </div>
            <div className="rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-500/12 to-primary/8 p-6 flex items-start gap-4">
              <span className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/25 flex items-center justify-center shrink-0"><Lightbulb className="w-5 h-5 text-sky-300" /></span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-sky-300 mb-1.5">Raise smarter</p>
                <p className="text-sm font-medium leading-relaxed">Ask every investor for two intros, whether they say yes or no. Momentum compounds.</p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Browse */}
        <ScrollReveal>
          <section>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold">Explore funding & pitch resources</h2>
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search funders, resources…" className="pl-9" />
              </div>
            </div>

            {groups.filter(g => g.items.length > 0).map(group => (
              <div key={group.label} className="mb-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">{group.label}</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {group.items.map(item => <RaiseCard key={item.id} item={item} />)}
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-12">No matches for "{query}".</p>
            )}
          </section>
        </ScrollReveal>

      </div>
    </AppShell>
  );
}