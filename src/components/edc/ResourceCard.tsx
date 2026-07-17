import { Bookmark, ExternalLink, Banknote, Rocket, BarChart3, AlarmClock, BookOpen, Landmark, type LucideIcon } from "lucide-react";
import { useSaved } from "@/lib/edc/store";
import { useState } from "react";
import type { Resource } from "@/lib/edc/data";

const CAT: Record<string, { badge: string; tile: string; Icon: LucideIcon }> = {
  FUNDING: {
    badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    tile: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",
    Icon: Banknote,
  },
  EVENT: {
    badge: "bg-primary/15 text-primary border-primary/30",
    tile: "bg-primary/10 border-primary/20 text-primary",
    Icon: Rocket,
  },
  REPORT: {
    badge: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    tile: "bg-sky-500/10 border-sky-500/20 text-sky-300",
    Icon: BarChart3,
  },
  DEADLINE: {
    badge: "bg-red-500/15 text-red-300 border-red-500/30",
    tile: "bg-red-500/10 border-red-500/20 text-red-300",
    Icon: AlarmClock,
  },
  LEARN: {
    badge: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    tile: "bg-purple-500/10 border-purple-500/20 text-purple-300",
    Icon: BookOpen,
  },
  MENTOR: {
    badge: "bg-accent/15 text-accent border-accent/30",
    tile: "bg-accent/10 border-accent/20 text-accent",
    Icon: Landmark,
  },
};

export function ResourceCard({ r, compact }: { r: Resource; compact?: boolean }) {
  const { saved, toggle } = useSaved();
  const isSaved = saved.includes(r.id);
  const [pop, setPop] = useState(false);
  const c = CAT[r.category] || CAT.LEARN;

  const urgent = r.deadlineDays !== undefined && r.deadlineDays <= 7;
  const warning = r.deadlineDays !== undefined && r.deadlineDays <= 14 && !urgent;

  return (
    <div
      className={`card-lift relative bg-card border rounded-2xl p-5 flex flex-col gap-4 h-full ${
        urgent ? "border-red-500/40" : warning ? "border-accent/40" : "border-border"
      } ${compact ? "w-80 shrink-0" : ""}`}
    >
      {/* top row: icon tile + new/bookmark */}
      <div className="flex items-start justify-between gap-3">
        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${c.tile}`}>
          <c.Icon className="w-5 h-5" />
        </div>
        <div className="flex items-center gap-2">
          {r.isNew && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">NEW</span>
          )}
          <button
            onClick={() => {
              toggle(r.id);
              setPop(true);
              setTimeout(() => setPop(false), 400);
            }}
            aria-label="Bookmark"
          >
            <Bookmark
              className={`w-4 h-4 transition-colors ${
                isSaved ? "fill-accent text-accent" : "text-muted-foreground hover:text-foreground"
              } ${pop ? "animate-pop" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* body */}
      <div className="min-w-0 flex-1">
        <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md border mb-2.5 ${c.badge}`}>
          {r.category}
        </span>
        <h4 className="font-semibold leading-snug">{r.title}</h4>
        <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">{r.description}</p>
      </div>

      {/* tags — capped to keep it clean */}
      {r.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {r.tags.slice(0, 2).map((t) => (
            <span key={t} className="text-[10px] font-medium px-2 py-1 rounded bg-secondary text-secondary-foreground">
              {t}
            </span>
          ))}
        </div>
      )}

      {/* footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span
          className={`text-xs font-medium ${
            urgent ? "text-red-400" : warning ? "text-accent" : "text-muted-foreground"
          }`}
        >
          {r.deadlineDays !== undefined ? `${r.deadlineDays} days left` : r.date}
        </span>
        <button className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline">
          Open <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}