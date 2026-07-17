import { useEffect, useState } from "react";
import { FileText, Check, AlertTriangle, Sparkles } from "lucide-react";

const CRITERIA = [
  { label: "Problem", ok: true, note: "Clear & painful" },
  { label: "Market size", ok: true, note: "₹12,000 Cr TAM" },
  { label: "Traction", ok: false, note: "Add MRR / users" },
  { label: "Team", ok: true, note: "Strong founder-fit" },
  { label: "The Ask", ok: false, note: "State the amount" },
];

const FINAL_SCORE = 82;

export function PitchDeckReviewerCard() {
  const [visible, setVisible] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) =>
      new Promise<void>((res) => timers.push(setTimeout(res, ms)));

    async function cycle() {
      while (!cancelled) {
        setVisible(0);
        setScore(0);
        await wait(500);

        // each criterion contributes a slice of the final score, and the
        // ring climbs toward that slice as the row appears
        for (let i = 1; i <= CRITERIA.length; i++) {
          if (cancelled) return;
          setVisible(i);
          const from = Math.round(((i - 1) / CRITERIA.length) * FINAL_SCORE);
          const to = Math.round((i / CRITERIA.length) * FINAL_SCORE);
          for (let s = from; s <= to; s += 1) {
            if (cancelled) return;
            setScore(s);
            await wait(22);
          }
          setScore(to);
          await wait(180);
        }
        setScore(FINAL_SCORE);

        await wait(3200);
      }
    }
    cycle();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  const dash = 2 * Math.PI * 26;
  const offset = dash - (dash * score) / 100;

  return (
    <div className="w-full max-w-md mx-auto md:mx-0 h-full flex flex-col justify-center bg-card/90 backdrop-blur border border-border rounded-2xl shadow-glow p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
        </div>
        <span className="text-xs font-semibold text-muted-foreground">Pitch Deck Reviewer</span>
      </div>

      <div className="flex items-center gap-4">
        {/* mock deck slide */}
        <div className="relative shrink-0">
          <div className="w-24 h-[76px] rounded-lg border border-border bg-secondary/60 p-2 rotate-[-4deg]">
            <div className="h-1.5 w-10 rounded bg-accent/70 mb-1.5" />
            <div className="h-1 w-full rounded bg-muted-foreground/40 mb-1" />
            <div className="h-1 w-4/5 rounded bg-muted-foreground/30 mb-1" />
            <div className="flex gap-1 mt-2">
              <div className="h-4 w-4 rounded bg-primary/40" />
              <div className="h-4 w-4 rounded bg-accent/40" />
              <div className="h-4 w-4 rounded bg-emerald-500/40" />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg border border-border bg-card flex items-center justify-center">
            <FileText className="w-4 h-4 text-accent" />
          </div>
        </div>

        {/* score ring */}
        <div className="relative w-[72px] h-[72px] shrink-0">
          <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
            <circle cx="32" cy="32" r="26" fill="none" stroke="var(--border)" strokeWidth="6" />
            <circle
              cx="32"
              cy="32"
              r="26"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={dash}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 0.1s linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold leading-none">{score}</span>
            <span className="text-[9px] text-muted-foreground">/ 100</span>
          </div>
        </div>
      </div>

      {/* criteria feedback */}
      <div className="space-y-1.5 mt-4">
        {CRITERIA.map((c, i) => {
          const shown = i < visible;
          return (
            <div
              key={c.label}
              className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 transition-all duration-500 ${
                shown ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
              } ${c.ok ? "bg-emerald-500/[0.07]" : "bg-amber-500/[0.08]"}`}
            >
              <div
                className={`w-4 h-4 rounded-full shrink-0 flex items-center justify-center ${
                  c.ok ? "bg-emerald-500" : "bg-amber-500"
                }`}
              >
                {c.ok ? (
                  <Check className="w-2.5 h-2.5 text-white" />
                ) : (
                  <AlertTriangle className="w-2.5 h-2.5 text-black/80" />
                )}
              </div>
              <span className="text-xs font-medium text-foreground w-24 shrink-0">{c.label}</span>
              <span
                className={`text-[11px] truncate ${
                  c.ok ? "text-emerald-300/90" : "text-amber-300/90"
                }`}
              >
                {c.note}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}