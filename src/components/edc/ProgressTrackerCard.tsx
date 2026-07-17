import { useEffect, useState } from "react";
import { GitBranch, Circle, CheckCircle2 } from "lucide-react";

const STAGES = ["Idea", "Validate", "Build", "Raise", "Scale"];

const NEXT_ACTIONS = [
  "Build an MVP or prototype",
  "Get 5 paying / committed users",
  "Apply to eDC Startup Sprint",
];

export function ProgressTrackerCard() {
  const [pct, setPct] = useState(0);
  const [litStages, setLitStages] = useState(0);
  const [action, setAction] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let rafId = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) =>
      new Promise<void>((res) => timers.push(setTimeout(res, ms)));

    // smooth, frame-aligned 0 → 100 fill over `duration` ms
    const fill = (duration: number) =>
      new Promise<void>((resolve) => {
        const start = performance.now();
        const step = (now: number) => {
          if (cancelled) return resolve();
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 2); // ease-out
          setPct(Math.round(eased * 100));
          if (t < 1) rafId = requestAnimationFrame(step);
          else resolve();
        };
        rafId = requestAnimationFrame(step);
      });

    async function cycle() {
      while (!cancelled) {
        setPct(0);
        setLitStages(0);
        await wait(500);

        // walk each stage: fill its completion bar 0 → 100%, then advance
        for (let i = 1; i <= STAGES.length; i++) {
          if (cancelled) return;
          setLitStages(i);
          setPct(0);
          await wait(120);
          await fill(900);
          setPct(100);
          await wait(700);
        }

        // hold on the finished journey, then reset and repeat
        await wait(2000);
      }
    }
    cycle();
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      timers.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    const t = setInterval(() => setAction((p) => (p + 1) % NEXT_ACTIONS.length), 1500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto md:mx-0 h-full flex flex-col justify-center bg-card/90 backdrop-blur border border-border rounded-2xl shadow-glow p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center">
          <GitBranch className="w-3.5 h-3.5 text-accent" />
        </div>
        <span className="text-xs font-semibold text-muted-foreground">Progress Tracker</span>
        <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30">
          {STAGES[Math.min(Math.max(litStages - 1, 0), STAGES.length - 1)]} stage
        </span>
      </div>

      {/* stage rail */}
      <div className="relative flex items-center justify-between mb-2 px-1">
        <div className="absolute left-3 right-3 top-1/2 -translate-y-1/2 h-0.5 bg-border" />
        <div
          className="absolute left-3 top-1/2 -translate-y-1/2 h-0.5 bg-accent transition-all duration-500"
          style={{ width: `${(Math.max(litStages - 1, 0) / (STAGES.length - 1)) * 92}%` }}
        />
        {STAGES.map((s, i) => {
          const done = i < litStages - 1;
          const here = i === litStages - 1;
          return (
            <div key={s} className="relative z-10 flex flex-col items-center gap-1">
              {done ? (
                <CheckCircle2 className="w-4 h-4 text-accent fill-accent/20" />
              ) : here ? (
                <span className="w-4 h-4 rounded-full bg-accent ring-4 ring-accent/20 animate-pulse-soft" />
              ) : (
                <Circle className="w-4 h-4 text-muted-foreground/50" />
              )}
              <span
                className={`text-[9px] font-medium ${
                  here ? "text-accent" : done ? "text-foreground" : "text-muted-foreground/60"
                }`}
              >
                {s}
              </span>
            </div>
          );
        })}
      </div>

      {/* completion bar */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-muted-foreground">Stage completion</span>
          <span className="font-bold text-foreground">{pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* next action ticker */}
      <div className="mt-4 rounded-lg border border-border bg-secondary/40 px-3 py-2.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-accent mb-1">Next action</p>
        <div className="h-5 overflow-hidden relative">
          {NEXT_ACTIONS.map((a, i) => (
            <p
              key={a}
              className="text-sm font-medium text-foreground absolute inset-x-0 transition-all duration-500"
              style={{
                transform: `translateY(${(i - action) * 100}%)`,
                opacity: i === action ? 1 : 0,
              }}
            >
              {a}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}