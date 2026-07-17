import { useEffect, useState } from "react";
import { BookOpen, Users, Briefcase, IndianRupee, Layers } from "lucide-react";

const ITEMS = [
  {
    icon: BookOpen,
    kind: "Book",
    title: "The Mom Test",
    sub: "Talk to customers without lying to yourself",
    tint: "text-purple-300",
    chip: "bg-purple-500/15 border-purple-500/30 text-purple-300",
  },
  {
    icon: Users,
    kind: "Mentor",
    title: "Priya Nair",
    sub: "Climate-tech founder · raised pre-seed '23",
    tint: "text-accent",
    chip: "bg-accent/15 border-accent/30 text-accent",
  },
  {
    icon: Briefcase,
    kind: "Internship",
    title: "Founder-in-Residence",
    sub: "Antler India · applications open",
    tint: "text-sky-300",
    chip: "bg-sky-500/15 border-sky-500/30 text-sky-300",
  },
  {
    icon: IndianRupee,
    kind: "Funding",
    title: "BIRAC BIG Grant",
    sub: "₹50L · early-stage biotech",
    tint: "text-emerald-300",
    chip: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
  },
];

export function ResourcesPreviewCard() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % ITEMS.length), 1600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto md:mx-0 h-full flex flex-col justify-center bg-card/90 backdrop-blur border border-border rounded-2xl shadow-glow p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center">
          <Layers className="w-3.5 h-3.5 text-accent" />
        </div>
        <span className="text-xs font-semibold text-muted-foreground">Matched Resources</span>
        <span className="ml-auto text-[10px] font-medium text-muted-foreground">
          for your stage
        </span>
      </div>

      <div className="space-y-2.5">
        {ITEMS.map((item, i) => {
          const on = i === active;
          return (
            <div
              key={item.kind}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all duration-500 ${
                on
                  ? "border-accent/40 bg-accent/[0.06] scale-[1.015] shadow-[0_8px_24px_-14px_rgba(0,0,0,0.6)]"
                  : "border-border bg-card/40 opacity-55"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg shrink-0 flex items-center justify-center border ${
                  on ? item.chip : "border-border bg-secondary"
                }`}
              >
                <item.icon className={`w-4 h-4 ${on ? item.tint : "text-muted-foreground"}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                      on ? item.chip : "border-border text-muted-foreground"
                    }`}
                  >
                    {item.kind}
                  </span>
                  <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{item.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-1.5 mt-4">
        {ITEMS.map((_, i) => (
          <span
            key={i}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === active ? "w-5 bg-accent" : "w-1.5 bg-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
}