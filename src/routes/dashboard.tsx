import { createFileRoute, Navigate, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { AppShell } from "@/components/edc/AppShell";
import { ResourceCard } from "@/components/edc/ResourceCard";
import { NeuralBackground } from "@/components/edc/NeuralBackground";
import { ScrollReveal } from "@/components/edc/ScrollReveal";
import {
  Pencil, ArrowRight, BookOpen, Rocket, TrendingUp, Target,
  CalendarClock, Zap, Lightbulb, Quote, ListTodo, AlertTriangle, Sparkles, CheckCircle2, Circle, type LucideIcon,
} from "lucide-react";
import { useUser, usePrefs, useSaved } from "@/lib/edc/store";
import {
  whatsNew, deadlines, books, courses, reports, competitions,
  facilities, funders, pitchResources, getPersonalizedPicks,
} from "@/lib/edc/data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — eDC KnowledgeHub" }] }),
  component: Dashboard,
});

function useCountUp(target: number, ms = 900) {
  const [v, setV] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) { setV(target); return; }
    started.current = true;
    let raf = 0;
    const start = performance.now();
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

function StatTile({ icon: Icon, value, suffix, label }: { icon: LucideIcon; value: number; suffix?: string; label: string }) {
  const n = useCountUp(value);
  return (
    <div className="bg-card/60 backdrop-blur border border-border rounded-2xl p-4">
      <Icon className="w-4 h-4 text-accent mb-2.5" />
      <div className="text-2xl font-bold leading-none">{n}{suffix && <span className="text-accent">{suffix}</span>}</div>
      <div className="text-xs text-muted-foreground mt-1.5">{label}</div>
    </div>
  );
}

const STAGES = [
  { id: "explorer", label: "Idea" },
  { id: "validator", label: "Validate" },
  { id: "builder", label: "Build" },
  { id: "raiser", label: "Raise" },
  { id: "follower", label: "Scale" },
];

const TOTAL_MILESTONES = STAGES.length * 3;

const FOCUS: Record<string, string> = {
  explorer: "Talk to 10 potential users this week and pressure-test whether your problem is real.",
  validator: "Get a scrappy MVP in front of 5 committed users — proof beats opinions.",
  builder: "Ship v1 publicly and chase your first real revenue milestone.",
  raiser: "Tighten your deck and open 20 focused investor conversations.",
  follower: "Double down on what's working — grow users, team, and revenue.",
};

const TIPS: Record<string, string> = {
  explorer: "Fall in love with the problem, not your first solution. Your idea will change — that's normal.",
  validator: "If you're not a little embarrassed by your MVP, you launched too late.",
  builder: "Talk to users every single week. The moment you stop, you start guessing.",
  raiser: "Investors fund momentum. Show traction lines going up and to the right.",
  follower: "What got you here won't get you there — hire people better than you.",
};

const QUOTES = [
  { q: "Ideas are easy. Execution is everything.", by: "John Doerr" },
  { q: "Make something people want.", by: "Paul Graham" },
  { q: "The way to get started is to quit talking and begin doing.", by: "Walt Disney" },
  { q: "Move fast and fix things.", by: "Founder wisdom" },
];

function Dashboard() {
  const { user } = useUser();
  const { prefs } = usePrefs();
  const { saved } = useSaved();
  const navigate = useNavigate();
  const [hydrated, setHydrated] = useState(false);
  const [checked, setChecked] = useState<string[]>([]);

  const stage = prefs?.stage || "explorer";
  const storageKey = `edc:milestones:${stage}`;

  useEffect(() => setHydrated(true), []);
  useEffect(() => {
    try { setChecked(JSON.parse(localStorage.getItem(storageKey) || "[]")); } catch { setChecked([]); }
  }, [storageKey]);

  if (!hydrated) return null;
  if (!user) return <Navigate to="/" />;
  if (user && !prefs) return <Navigate to="/onboarding" />;

  const stageLabelMap: Record<string, string> = {
    explorer: "Explorer", validator: "Validator", builder: "Builder", raiser: "Raising", follower: "Scaling",
  };
  const stageChip = `${stageLabelMap[stage] || stage} Stage`;
  const domainChips = prefs?.domains || [];
  const currentIdx = Math.max(0, STAGES.findIndex(s => s.id === stage));

  // calculations kept intact for the StatTile and sidebar widgets
  const doneCount = currentIdx * 3 + checked.length;
  const journeyPct = Math.round((doneCount / TOTAL_MILESTONES) * 100);

  const focus = FOCUS[stage] || FOCUS.explorer;
  const tip = TIPS[stage] || TIPS.explorer;
  const quote = QUOTES[new Date().getDate() % QUOTES.length];

  const picks = prefs ? getPersonalizedPicks(prefs) : [];

  const savedCount = saved.length;
  const activeNow = 90 + (new Date().getDate() % 12);
  const dueThisWeek = deadlines.filter(d => d.days <= 7).length;
  const tasksThisWeek = 4;

  const discoverCount = books.length + courses.length + reports.length;
  const buildCount = competitions.length + facilities.length + 3;
  const raiseCount = funders.length + pitchResources.length;

  const gateways: { to: string; icon: LucideIcon; title: string; why: string; count: number; unit: string; tint: string }[] = [
    { to: "/discover", icon: BookOpen, title: "Discover", why: "Books, courses & reports curated for your stage.", count: discoverCount, unit: "learning resources", tint: "from-purple-500/20" },
    { to: "/build", icon: Rocket, title: "Build", why: "Campus tools, competitions & institutional connects.", count: buildCount, unit: "ways to build", tint: "from-accent/20" },
    { to: "/raise", icon: TrendingUp, title: "Raise", why: "Grants, accelerators & pitch resources matched to you.", count: raiseCount, unit: "funding paths", tint: "from-emerald-500/20" },
  ];

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-12">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 md:p-8">
          <NeuralBackground className="opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-accent/10 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-2xl">👋</span>
                  <h1 className="text-3xl md:text-4xl font-bold">Welcome back, {user?.name?.split(" ")[0] || "Founder"}.</h1>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-accent text-accent-foreground">{stageChip}</span>
                  {domainChips.map(c => (
                    <span key={c} className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/30">{c}</span>
                  ))}
                  <button onClick={() => navigate({ to: "/settings" })} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground ml-1">
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> {activeNow} founders active
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-accent/25 bg-accent/[0.06] p-5 flex items-start gap-4">
              <span className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center shrink-0">
                <Target className="w-5 h-5 text-accent" />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-accent mb-1">Your focus this week</p>
                <p className="text-lg font-semibold leading-snug">{focus}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
              <StatTile icon={CalendarClock} value={dueThisWeek} label="deadlines this week" />
              <StatTile icon={ListTodo} value={tasksThisWeek} label="tasks scheduled this week" />
              <StatTile icon={Zap} value={journeyPct} suffix="%" label="of your journey done" />
            </div>
          </div>
        </section>

        {/* ── Weekly Founder Review & AI Insight ── */}
        <ScrollReveal>
          <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Your Weekly Founder Review</h2>
              <Sparkles className="w-4 h-4 text-accent" />
            </div>

            <div className="space-y-8">
              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">Progress</span>
                  <span className="text-sm font-bold text-accent">78%</span>
                </div>
                <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: "78%" }} />
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Completed 5 tasks
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Interviewed 4 users
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Finished competitor analysis
                </div>
                {/* Pending tasks to account for the remaining 22% */}
                <div className="flex items-center gap-3 text-sm text-muted-foreground/60">
                  <Circle className="w-4 h-4" /> Finalize core MVP features
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground/60">
                  <Circle className="w-4 h-4" /> Configure Vercel deployment
                </div>
              </div>

              {/* Warning */}
              <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-400">You're falling behind on</p>
                  <p className="text-sm text-red-300 mt-0.5">MVP development — 6 days overdue</p>
                </div>
              </div>

              {/* AI Insight */}
              <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <h3 className="text-sm font-bold text-accent">AI Insight</h3>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  You're spending significantly more time researching than testing with users.
                </p>
              </div>

              {/* Recommended next move */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Recommended Next Moves</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm p-3 rounded-lg bg-secondary/50 border border-border hover:border-accent/50 transition-colors cursor-default">
                    <ArrowRight className="w-4 h-4 text-accent" /> Ship the landing page
                  </div>
                  <div className="flex items-center gap-3 text-sm p-3 rounded-lg bg-secondary/50 border border-border hover:border-accent/50 transition-colors cursor-default">
                    <ArrowRight className="w-4 h-4 text-accent" /> Talk to 5 users
                  </div>
                  <div className="flex items-center gap-3 text-sm p-3 rounded-lg bg-secondary/50 border border-border hover:border-accent/50 transition-colors cursor-default">
                    <ArrowRight className="w-4 h-4 text-accent" /> Configure Vercel deployment
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ── Picked for you  +  Upcoming deadlines ── */}
        <ScrollReveal>
          <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-stretch">
            <section className="flex flex-col">
              <div className="flex items-center gap-2.5 mb-5">
                <span className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center"><Sparkles className="w-4 h-4 text-accent" /></span>
                <h2 className="text-xl font-bold">Picked for you</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 flex-1 auto-rows-fr">
                {picks.slice(0, 4).map(r => <ResourceCard key={r.id} r={r} />)}
              </div>
            </section>

            <aside className="flex flex-col gap-4">
              <div className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <CalendarClock className="w-4 h-4 text-accent" />
                  <h3 className="font-bold">Upcoming deadlines</h3>
                </div>
                <ul className="space-y-4">
                  {deadlines.sort((a, b) => a.days - b.days).map(d => (
                    <li key={d.id}>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <p className="text-sm font-medium truncate">{d.title}</p>
                        <span className={`text-xs font-bold shrink-0 ${d.days <= 7 ? "text-red-400" : d.days <= 14 ? "text-accent" : "text-muted-foreground"}`}>{d.days}d</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div className={`h-full rounded-full ${d.days <= 7 ? "bg-red-500" : d.days <= 14 ? "bg-accent" : "bg-primary"}`} style={{ width: `${Math.max(8, 100 - d.days * 2)}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gradient-to-br from-accent/15 to-primary/10 border border-accent/20 rounded-2xl p-5">
                <p className="text-2xl mb-1">🔥</p>
                <p className="font-semibold text-sm">You're building momentum.</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{savedCount > 0 ? `${savedCount} resources saved and counting.` : "Save resources to build your toolkit."} Keep going — future-you will thank you.</p>
              </div>
              <div className="bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/20 rounded-2xl p-5 flex-1 flex flex-col justify-center">
                <p className="text-2xl mb-1">🎯</p>
                <p className="font-semibold text-sm">Small wins add up.</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{doneCount} of {TOTAL_MILESTONES} milestones checked off so far. Every founder's journey looks slow up close.</p>
              </div>
            </aside>
          </div>
        </ScrollReveal>

        {/* ── Warm cards: tip + quote ── */}
        <ScrollReveal>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-500/12 to-primary/8 p-6 flex items-start gap-4">
              <span className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/25 flex items-center justify-center shrink-0"><Lightbulb className="w-5 h-5 text-sky-300" /></span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-sky-300 mb-1.5">Tip of the week</p>
                <p className="text-sm font-medium leading-relaxed">{tip}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/12 to-primary/8 p-6 flex items-start gap-4">
              <span className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center shrink-0"><Quote className="w-5 h-5 text-accent" /></span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-accent mb-1.5">Founder quote</p>
                <p className="text-base font-semibold leading-snug">"{quote.q}"</p>
                <p className="text-xs text-muted-foreground mt-1.5">— {quote.by}</p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* ── What's new this week ── */}
        <ScrollReveal>
          <section>
            <div className="flex items-center gap-2.5 mb-5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-soft" />
              <h2 className="text-xl font-bold">What's new this week</h2>
              <span className="text-xs text-muted-foreground ml-1">Updated today</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {whatsNew.map(r => <ResourceCard key={r.id} r={r} />)}
            </div>
          </section>
        </ScrollReveal>

        {/* ── Gateways ── */}
        <ScrollReveal>
          <section>
            <h2 className="text-xl font-bold mb-5">Where to next?</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {gateways.map((g, i) => (
                <Link key={g.to} to={g.to} className="card-lift group relative overflow-hidden bg-card border border-border rounded-2xl p-6 hover:border-accent/50 transition-colors animate-slide-up" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${g.tint} to-transparent blur-2xl`} />
                  <div className="relative">
                    <span className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4"><g.icon className="w-6 h-6 text-accent" /></span>
                    <h3 className="text-xl font-bold">{g.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{g.why}</p>
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
                      <span className="text-xs text-muted-foreground"><span className="font-bold text-foreground">{g.count}</span> {g.unit}</span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent group-hover:gap-2 transition-all">Explore <ArrowRight className="w-3.5 h-3.5" /></span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </ScrollReveal>

      </div>
    </AppShell>
  );
}