import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/edc/AppShell";
import { usePrefs } from "@/lib/edc/store";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Circle, Lock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/StartupTimeline")({
  head: () => ({ meta: [{ title: "Startup Timeline — eDC KnowledgeHub" }] }),
  component: StartupTimelinePage,
});

function StartupTimelinePage() {
  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <h1 className="text-3xl font-bold mb-2">Startup Timeline</h1>
        <p className="text-muted-foreground mb-8">Track your founder journey from idea to scale.</p>
        <StartupTimeline />
      </div>
    </AppShell>
  );
}

const STAGES = [
  {
    id: "explorer",
    label: "Explorer",
    emoji: "🔭",
    desc: "Ideating and exploring problem spaces",
    resources: ["The Mom Test", "Blume India Report", "Venture Studio Course"],
    actions: ["Read 2 industry reports", "Talk to 10 potential users", "Join eDC community"],
  },
  {
    id: "validator",
    label: "Validator",
    emoji: "🧪",
    desc: "Testing assumptions with real users",
    resources: ["YC Startup School", "i-TTO Connect", "Pitch Deck Guide"],
    actions: ["Build an MVP or prototype", "Get 5 paying/committed users", "Apply to eDC Sprint"],
  },
  {
    id: "builder",
    label: "Builder",
    emoji: "🏗️",
    desc: "Building product and finding PMF",
    resources: ["Makerspace Lab", "R&D Partnerships", "IHFC Grant"],
    actions: ["Launch v1 publicly", "Hit first revenue milestone", "Apply for IHFC/BIRAC"],
  },
  {
    id: "raiser",
    label: "Raising",
    emoji: "🚀",
    desc: "Fundraising from angels and VCs",
    resources: ["Antler India", "Y Combinator", "Investor Email Templates"],
    actions: ["Send 20 investor emails", "Close pre-seed round", "Apply to YC / Antler"],
  },
  {
    id: "follower",
    label: "Scaling",
    emoji: "📈",
    desc: "Growing users, team, and revenue",
    resources: ["Sequoia India Outlook", "TiE Global Pitch", "Build3"],
    actions: ["Hire first 3 team members", "Enter global competitions", "Series A prep"],
  },
];

const STAGE_ORDER = STAGES.map((s) => s.id);

function StartupTimeline() {
  const { prefs } = usePrefs();
  const navigate = useNavigate();
  const currentIdx = STAGE_ORDER.indexOf(prefs?.stage || "explorer");

  return (
    <section className="animate-slide-up">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-lg">🗺️</span>
        <h2 className="text-xl font-bold">Your founder roadmap</h2>
      </div>

      <div className="relative">
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-border hidden md:block" />
        <div
          className="absolute top-6 left-6 h-0.5 bg-accent hidden md:block transition-all duration-700"
          style={{ width: `${Math.min(100, (currentIdx / (STAGES.length - 1)) * 100)}%`, right: "auto" }}
        />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {STAGES.map((stage, i) => {
            const isDone = i < currentIdx;
            const isCurrent = i === currentIdx;
            const isLocked = i > currentIdx + 1;

            return (
              <div
                key={stage.id}
                className={`relative flex flex-col gap-3 p-4 rounded-xl border transition-all ${
                  isCurrent
                    ? "bg-accent/10 border-accent/40 shadow-sm"
                    : isDone
                      ? "bg-card border-border opacity-75"
                      : isLocked
                        ? "bg-card/50 border-border/50 opacity-50"
                        : "bg-card border-border"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm z-10 relative border-2 ${
                      isCurrent
                        ? "border-accent bg-accent/20"
                        : isDone
                          ? "border-emerald-500 bg-emerald-500/20"
                          : "border-border bg-card"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isLocked ? (
                      <Lock className="w-3 h-3 text-muted-foreground" />
                    ) : (
                      <span>{stage.emoji}</span>
                    )}
                  </div>
                  {isCurrent && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent text-accent-foreground">
                      You are here
                    </span>
                  )}
                </div>

                <div>
                  <p className={`font-bold text-sm ${isCurrent ? "text-foreground" : isDone ? "text-muted-foreground" : "text-foreground"}`}>
                    {stage.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{stage.desc}</p>
                </div>

                {!isLocked && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Key resources</p>
                    {stage.resources.map((r) => (
                      <div key={r} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <div className={`w-1 h-1 rounded-full shrink-0 ${isCurrent ? "bg-accent" : "bg-muted-foreground"}`} />
                        {r}
                      </div>
                    ))}
                  </div>
                )}

                {isCurrent && (
                  <div className="space-y-1 mt-1 pt-3 border-t border-accent/20">
                    <p className="text-[10px] font-bold text-accent uppercase tracking-wider">Next actions</p>
                    {stage.actions.map((a) => (
                      <div key={a} className="flex items-start gap-1.5 text-[11px] text-foreground">
                        <Circle className="w-3 h-3 shrink-0 text-accent mt-0.5" />
                        {a}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={() => navigate({ to: "/onboarding" })}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent transition-colors"
        >
          Update my stage <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </section>
  );
}