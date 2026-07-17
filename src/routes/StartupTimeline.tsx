import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/edc/AppShell";
import { NeuralBackground } from "@/components/edc/NeuralBackground";
import { ScrollReveal } from "@/components/edc/ScrollReveal";
import { useUser, usePrefs } from "@/lib/edc/store";
import { useState, useEffect } from "react";
import {
  CheckCircle2, Circle, Lock, ArrowRight, Map, Zap, Target,
  Telescope, FlaskConical, Hammer, Rocket, TrendingUp, Crown, Sparkles, type LucideIcon,
} from "lucide-react";

export const Route = createFileRoute("/StartupTimeline")({
  head: () => ({ meta: [{ title: "Startup Timeline — eDC KnowledgeHub" }] }),
  component: StartupTimelinePage,
});

// same 5 stages, same 3-milestones-each system used on the dashboard —
// storage keys below are shared with dashboard.tsx so ticking a milestone
// here updates the dashboard's journey %, and vice versa.
const STAGES: { id: string; label: string; Icon: LucideIcon; desc: string; resources: string[] }[] = [
  { id: "explorer", label: "Explorer", Icon: Telescope, desc: "Ideating and exploring problem spaces.", resources: ["The Mom Test", "Blume India Report", "Venture Studio Course"] },
  { id: "validator", label: "Validator", Icon: FlaskConical, desc: "Testing assumptions with real users.", resources: ["YC Startup School", "i-TTO Connect", "Pitch Deck Guide"] },
  { id: "builder", label: "Builder", Icon: Hammer, desc: "Building product and finding PMF.", resources: ["Makerspace Lab", "R&D Partnerships", "IHFC Grant"] },
  { id: "raiser", label: "Raising", Icon: Rocket, desc: "Fundraising from angels and VCs.", resources: ["Antler India", "Y Combinator", "Investor Email Templates"] },
  { id: "follower", label: "Scaling", Icon: TrendingUp, desc: "Growing users, team, and revenue.", resources: ["Sequoia India Outlook", "TiE Global Pitch", "Build3"] },
];

// identical to the MILESTONES map in dashboard.tsx — keep these in sync
const MILESTONES: Record<string, string[]> = {
  explorer: ["Read 2 industry reports", "Talk to 10 potential users", "Join the eDC community"],
  validator: ["Build an MVP or prototype", "Get 5 committed users", "Apply to eDC Sprint"],
  builder: ["Launch v1 publicly", "Hit first revenue milestone", "Apply for IHFC / BIRAC"],
  raiser: ["Send 20 investor emails", "Close your pre-seed round", "Apply to YC / Antler"],
  follower: ["Hire your first 3 teammates", "Enter global competitions", "Start Series A prep"],
};
const TOTAL_MILESTONES = STAGES.length * 3;

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

// Udemy-style circular progress ring
function CircularProgress({ pct, size = 132 }: { pct: number; size?: number }) {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (c * pct) / 100;
  const complete = pct >= 100;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={complete ? "var(--accent)" : "var(--accent)"}
          strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {complete ? <Crown className="w-6 h-6 text-accent mb-1" /> : null}
        <span className="text-2xl font-bold leading-none">{pct}%</span>
      </div>
    </div>
  );
}

function StartupTimelinePage() {
  const { user } = useUser();
  const { prefs } = usePrefs();
  const navigate = useNavigate();
  const [hydrated, setHydrated] = useState(false);
  // one localStorage-backed checklist per stage — same keys the dashboard reads/writes
  const [checkedByStage, setCheckedByStage] = useState<Record<string, string[]>>({});

  useEffect(() => {
    setHydrated(true);
    const map: Record<string, string[]> = {};
    STAGES.forEach(s => {
      try { map[s.id] = JSON.parse(localStorage.getItem(`edc:milestones:${s.id}`) || "[]"); }
      catch { map[s.id] = []; }
    });
    setCheckedByStage(map);
  }, []);

  const stage = prefs?.stage || "explorer";
  const currentIdx = Math.max(0, STAGES.findIndex(s => s.id === stage));

  const doneCount = STAGES.reduce((sum, s, i) => {
    if (i < currentIdx) return sum + 3; // past stages count fully complete
    if (i === currentIdx) return sum + (checkedByStage[s.id]?.length || 0);
    return sum; // future stages contribute nothing
  }, 0);
  const journeyPct = Math.round((doneCount / TOTAL_MILESTONES) * 100);
  const journeyComplete = doneCount === TOTAL_MILESTONES;

  // all hooks (including these two) must run on every render — conditional
  // returns only happen AFTER every hook has been called, never before.
  const nPct = useCountUp(journeyPct);
  const nDone = useCountUp(doneCount);

  if (!hydrated) return null;
  if (!user) return <Navigate to="/" />;

  function toggleMilestone(stageId: string, text: string) {
    setCheckedByStage(prev => {
      const cur = prev[stageId] || [];
      const next = cur.includes(text) ? cur.filter(t => t !== text) : [...cur, text];
      try { localStorage.setItem(`edc:milestones:${stageId}`, JSON.stringify(next)); } catch {}
      return { ...prev, [stageId]: next };
    });
  }

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-10">

        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 md:p-8">
          <NeuralBackground className="opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-accent/10 pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-6 justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center"><Map className="w-5 h-5 text-primary" /></span>
                <h1 className="text-3xl md:text-4xl font-bold">Startup Timeline</h1>
              </div>
              <p className="text-muted-foreground max-w-2xl">
                Track your founder journey from idea to scale — five stages, fifteen milestones. Tick them off as you go; your progress here is the same progress shown on your dashboard.
              </p>
              <div className="grid grid-cols-2 gap-3 mt-6 max-w-sm">
                <div className="bg-card/60 backdrop-blur border border-border rounded-2xl p-4">
                  <Target className="w-4 h-4 text-accent mb-2.5" />
                  <div className="text-2xl font-bold leading-none">{STAGES[currentIdx].label}</div>
                  <div className="text-xs text-muted-foreground mt-1.5">your current stage</div>
                </div>
                <div className="bg-card/60 backdrop-blur border border-border rounded-2xl p-4">
                  <Zap className="w-4 h-4 text-accent mb-2.5" />
                  <div className="text-2xl font-bold leading-none">{nDone}<span className="text-accent">/{TOTAL_MILESTONES}</span></div>
                  <div className="text-xs text-muted-foreground mt-1.5">milestones complete</div>
                </div>
              </div>
            </div>

            {/* right side: Udemy-style circular course progress ring */}
            <div className="hidden lg:flex w-56 shrink-0 flex-col items-center justify-center bg-card/60 backdrop-blur border border-border rounded-2xl p-6">
              <CircularProgress pct={nPct} />
              <p className="text-sm font-semibold mt-4">Journey progress</p>
              <p className="text-xs text-muted-foreground mt-0.5">{nDone} of {TOTAL_MILESTONES} milestones</p>
            </div>
          </div>
        </section>

        {/* Progress rail */}
        <ScrollReveal>
          <section className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Your founder roadmap</h2>
              <button onClick={() => navigate({ to: "/onboarding" })} className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline">
                Update my stage <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="relative flex items-center justify-between px-1">
              <div className="absolute left-3 right-3 top-[13px] h-0.5 bg-border" />
              {/* fixed: width now maps precisely from the first node to the current one,
                  instead of a full-width percentage that visually overshot */}
              {/* bar length now matches the SAME milestone-weighted % shown next to the
                  ring above (journeyPct) — not a discrete "which node" position. With the
                  Founder node added, these two numbers must agree, or the bar looks "off"
                  even when it's technically reflecting a different (valid) thing. */}
              <div
                className="absolute left-3 top-[13px] h-0.5 bg-accent transition-all duration-700"
                style={{ width: `calc((100% - 24px) * ${journeyPct / 100})` }}
              />
              {STAGES.map((s, i) => {
                const done = i < currentIdx, here = i === currentIdx;
                return (
                  <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                    {done ? <CheckCircle2 className="w-7 h-7 text-accent fill-accent/20 bg-background rounded-full" />
                      : here ? <span className="w-7 h-7 rounded-full bg-accent ring-4 ring-accent/20 animate-pulse-soft flex items-center justify-center"><s.Icon className="w-3.5 h-3.5 text-accent-foreground" /></span>
                      : <Lock className="w-4 h-4 text-muted-foreground/50 bg-background rounded-full p-1.5 w-7 h-7 border border-border" />}
                    <span className={`text-xs font-semibold ${here ? "text-accent" : done ? "text-foreground" : "text-muted-foreground/60"}`}>{s.label}</span>
                    {here && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-accent text-accent-foreground">You are here</span>}
                  </div>
                );
              })}
              {/* 6th node: not a stage — an earned achievement, unlocked only at 15/15 */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                {journeyComplete
                  ? <span className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary ring-4 ring-accent/30 flex items-center justify-center shadow-amber"><Crown className="w-4 h-4 text-accent-foreground" /></span>
                  : <Lock className="w-4 h-4 text-muted-foreground/50 bg-background rounded-full p-1.5 w-7 h-7 border border-dashed border-border" />}
                <span className={`text-xs font-bold ${journeyComplete ? "text-accent" : "text-muted-foreground/60"}`}>Founder</span>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Stage detail cards — description + resources + interactive milestones */}
        <div className="space-y-5">
          {STAGES.map((s, i) => {
            const done = i < currentIdx, here = i === currentIdx, locked = i > currentIdx;
            const checked = checkedByStage[s.id] || [];
            return (
              <ScrollReveal key={s.id} delay={i * 0.05}>
                <section className={`rounded-2xl border p-6 transition-all ${here ? "border-accent/40 bg-accent/[0.04]" : locked ? "border-border/60 bg-card/40" : "border-border bg-card"}`}>
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                    <div className="flex items-center gap-3">
                      <span className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${here ? "bg-accent/15 border-accent/30 text-accent" : done ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-300" : "bg-secondary border-border text-muted-foreground"}`}>
                        {locked ? <Lock className="w-5 h-5" /> : <s.Icon className="w-5 h-5" />}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold">{s.label}</h3>
                          {here && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent text-accent-foreground">You are here</span>}
                          {done && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">Complete</span>}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{s.desc}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-bold text-accent tabular-nums">
                        {done ? 3 : here ? checked.length : 0}/3
                      </span>
                      <p className="text-[10px] text-muted-foreground">milestones</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* what to learn */}
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2.5">What to learn</p>
                      <ul className="space-y-1.5">
                        {s.resources.map(r => (
                          <li key={r} className="flex items-center gap-2 text-sm text-foreground">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${here ? "bg-accent" : "bg-muted-foreground"}`} /> {r}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* what to do — shared, clickable checklist */}
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2.5">What to do</p>
                      <ul className="space-y-2">
                        {MILESTONES[s.id].map(m => {
                          const isChecked = done || checked.includes(m);
                          const interactive = here;
                          return (
                            <li key={m}>
                              <button
                                onClick={() => interactive && toggleMilestone(s.id, m)}
                                disabled={!interactive}
                                className={`w-full flex items-center gap-2.5 text-left rounded-lg border px-3 py-2 transition-all ${
                                  isChecked ? "bg-accent/10 border-accent/30" : "bg-background border-border"
                                } ${interactive ? "hover:border-accent/40 cursor-pointer" : "cursor-default opacity-80"}`}
                              >
                                {isChecked ? <CheckCircle2 className="w-4 h-4 text-accent shrink-0" /> : <Circle className="w-4 h-4 text-muted-foreground shrink-0" />}
                                <span className={`text-sm ${isChecked ? "text-foreground" : "text-muted-foreground"}`}>{m}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </section>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Achievement — earned only once every milestone is checked */}
        <ScrollReveal delay={0.1}>
          {journeyComplete ? (
            <section className="relative overflow-hidden rounded-2xl border border-accent/40 bg-gradient-to-br from-accent/15 via-card to-primary/10 p-8 text-center">
              <Sparkles className="w-6 h-6 text-accent mx-auto mb-3" />
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-accent to-primary shadow-amber mx-auto mb-4">
                <Crown className="w-8 h-8 text-accent-foreground" />
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">You've become a Founder.</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Every milestone, Explorer to Scale — all 15 of them. That's not a stage, that's a track record.
              </p>
            </section>
          ) : (
            <section className="rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center">
              <Lock className="w-6 h-6 text-muted-foreground mx-auto mb-3" />
              <h2 className="text-lg font-bold mb-1">The Founder achievement is locked</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Complete all {TOTAL_MILESTONES} milestones across every stage to unlock it. You're at {doneCount}/{TOTAL_MILESTONES} — keep going.
              </p>
            </section>
          )}
        </ScrollReveal>

      </div>
    </AppShell>
  );
}