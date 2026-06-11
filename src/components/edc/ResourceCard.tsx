import { Bookmark, ExternalLink } from "lucide-react";
import { useSaved } from "@/lib/edc/store";
import { useState } from "react";
import type { Resource } from "@/lib/edc/data";

const catColor: Record<string, string> = {
  FUNDING: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  EVENT: "bg-primary/15 text-primary border-primary/30",
  REPORT: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  DEADLINE: "bg-red-500/15 text-red-300 border-red-500/30",
  LEARN: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  MENTOR: "bg-accent/15 text-accent border-accent/30",
};

export function ResourceCard({ r, compact }: { r: Resource; compact?: boolean }) {
  const { saved, toggle } = useSaved();
  const isSaved = saved.includes(r.id);
  const [pop, setPop] = useState(false);

  const urgent = r.deadlineDays !== undefined && r.deadlineDays <= 7;
  const warning = r.deadlineDays !== undefined && r.deadlineDays <= 14 && !urgent;

  return (
    <div className={`card-lift relative bg-card border rounded-xl p-5 flex flex-col gap-3 ${urgent ? "border-red-500/40" : warning ? "border-accent/40" : "border-border"} ${compact ? "w-72 shrink-0" : ""}`}>
      <div className="flex items-start justify-between gap-2">
        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md border ${catColor[r.category]}`}>{r.category}</span>
        <div className="flex items-center gap-2">
          {r.isNew && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white animate-pulse-soft">NEW</span>}
          <button onClick={() => { toggle(r.id); setPop(true); setTimeout(() => setPop(false), 400); }} aria-label="Bookmark">
            <Bookmark className={`w-4 h-4 transition-colors ${isSaved ? "fill-accent text-accent" : "text-muted-foreground hover:text-foreground"} ${pop ? "animate-pop" : ""}`} />
          </button>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <div className="text-3xl shrink-0">{r.emoji}</div>
        <div className="min-w-0">
          <h4 className="font-semibold leading-snug">{r.title}</h4>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{r.description}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1.5 mt-auto">
        {r.tags.map(t => (
          <span key={t} className="text-[10px] font-medium px-2 py-1 rounded bg-secondary text-secondary-foreground">{t}</span>
        ))}
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="text-xs text-muted-foreground">
          {r.deadlineDays !== undefined ? `${r.deadlineDays} days left` : r.date}
        </span>
        <button className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline">
          Open <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}