import { useEffect, useState } from "react";
import { Sparkles, Check } from "lucide-react";

const ROADMAP_STEPS = [
  { week: "Week 1", label: "Validate customers" },
  { week: "Week 2", label: "Interview 20 users" },
  { week: "Week 3", label: "Build MVP" },
  { week: "Week 4", label: "Pitch deck" },
];

const PROMPT = "I have an idea for an EV charging startup.";

export function RoadmapPreviewCard() {
  const [typed, setTyped] = useState("");
  const [visibleSteps, setVisibleSteps] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    function wait(ms: number) {
      return new Promise<void>((resolve) => {
        timers.push(setTimeout(resolve, ms));
      });
    }

    async function cycle() {
      while (!cancelled) {
        setTyped("");
        setVisibleSteps(0);
        await wait(500);

        for (let i = 0; i <= PROMPT.length; i++) {
          if (cancelled) return;
          setTyped(PROMPT.slice(0, i));
          await wait(40);
        }
        await wait(400);

        for (let i = 1; i <= ROADMAP_STEPS.length; i++) {
          if (cancelled) return;
          setVisibleSteps(i);
          await wait(550);
        }

        await wait(3200);
      }
    }

    cycle();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  const typingDone = typed.length === PROMPT.length;

  return (
    <div className="relative w-full max-w-md mx-auto md:mx-0">
      <div className="w-full h-full flex flex-col justify-center bg-card/90 backdrop-blur border border-border rounded-2xl shadow-glow p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
          </div>
          <span className="text-xs font-semibold text-muted-foreground">AI Roadmap</span>
        </div>

        {/* Typed user prompt */}
        <div className="bg-secondary rounded-xl rounded-tr-sm px-3 py-2 text-xs text-foreground mb-4 ml-auto max-w-[85%] min-h-[2.25rem]">
          {typed}
          {!typingDone && (
            <span className="inline-block w-1 h-3 bg-foreground/60 ml-0.5 animate-pulse-soft align-middle" />
          )}
        </div>

        {/* Roadmap steps revealing one by one */}
        <div className="space-y-2">
          {ROADMAP_STEPS.map((s, i) => {
            const shown = i < visibleSteps;
            return (
              <div
                key={s.week}
                className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 transition-all duration-500 ${
                  shown
                    ? "opacity-100 translate-x-0 bg-card border-border"
                    : "opacity-0 -translate-x-2 border-transparent"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full shrink-0 flex items-center justify-center ${
                    shown ? "bg-accent" : "bg-muted"
                  }`}
                >
                  {shown && <Check className="w-2.5 h-2.5 text-accent-foreground" />}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-accent uppercase tracking-wider leading-none">
                    {s.week}
                  </p>
                  <p className="text-xs font-medium text-foreground leading-snug">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}