import { useEffect, useState } from "react";
import { Users, ArrowRight } from "lucide-react";

const MENTOR = {
  name: "Priya Nair",
  initials: "PN",
  expertise: ["Climate Tech", "Fundraising"],
  reason:
    "She built a climate-tech startup from IIT Delhi and raised a pre-seed round in 2023 — closest founder-to-founder match for your idea.",
};

export function MentorMatchPreviewCard() {
  const [revealed, setRevealed] = useState(false);

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
        setRevealed(false);
        await wait(800);
        if (cancelled) return;
        setRevealed(true);
        await wait(4200);
      }
    }

    cycle();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="bg-card/90 backdrop-blur border border-border rounded-2xl shadow-glow p-5 w-full max-w-sm mx-auto md:mx-0">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center">
          <Users className="w-3.5 h-3.5 text-accent" />
        </div>
        <span className="text-xs font-semibold text-muted-foreground">Mentor Match</span>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-xs text-background">
          {MENTOR.initials}
        </div>
        <div>
          <p className="font-semibold text-sm leading-none">{MENTOR.name}</p>
          <div className="flex gap-1 mt-1.5">
            {MENTOR.expertise.map((t) => (
              <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`flex items-start gap-2 rounded-lg border px-3 py-2.5 text-xs leading-relaxed transition-all duration-500 ${
          revealed
            ? "opacity-100 translate-y-0 bg-accent/10 border-accent/30 text-foreground"
            : "opacity-0 translate-y-1 border-transparent"
        }`}
      >
        <ArrowRight className="w-3 h-3 text-accent shrink-0 mt-0.5" />
        {MENTOR.reason}
      </div>
    </div>
  );
}