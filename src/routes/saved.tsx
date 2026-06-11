import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/edc/AppShell";
import { useSaved, useUser } from "@/lib/edc/store";
import { whatsNew, pickedForYou } from "@/lib/edc/data";
import { Bookmark, ExternalLink, Clock, Tag } from "lucide-react";

export const Route = createFileRoute("/saved")({
  head: () => ({ meta: [{ title: "Saved — eDC KnowledgeHub" }] }),
  component: Saved,
});

const catColor: Record<string, string> = {
  FUNDING: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  EVENT: "bg-primary/15 text-primary border-primary/30",
  REPORT: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  DEADLINE: "bg-red-500/15 text-red-300 border-red-500/30",
  LEARN: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  MENTOR: "bg-accent/15 text-accent border-accent/30",
};

function Saved() {
  const { user } = useUser();
  const { saved, toggle } = useSaved();
  const navigate = useNavigate();

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  if (!hydrated) return null;
  if (!user) return <Navigate to="/" />;

  const all = [...whatsNew, ...pickedForYou].filter(r => saved.includes(r.id));

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <h1 className="text-3xl font-bold mb-2">Saved resources</h1>
        <p className="text-muted-foreground mb-8">Your bookmarked items, always one click away.</p>

        {all.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl">
            <Bookmark className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No saved resources yet. Tap the bookmark icon on any card.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {all.map(r => {
              const urgent = r.deadlineDays !== undefined && r.deadlineDays <= 7;
              const warning = r.deadlineDays !== undefined && r.deadlineDays <= 14 && !urgent;
              return (
                <div
                  key={r.id}
                  className={`card-lift relative bg-card border rounded-xl flex flex-col overflow-hidden cursor-pointer ${urgent ? "border-red-500/40" : warning ? "border-accent/40" : "border-border"}`}
                  onClick={() => navigate({ to: "/resource/$id", params: { id: r.id } })}
                >
                  {/* Top */}
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className={`inline-flex items-center text-[10px] font-bold px-2 py-1 rounded-md border ${catColor[r.category]}`}>
                        {r.category}
                      </span>
                      <div className="flex items-center gap-2">
                        {r.isNew && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">NEW</span>}
                        <button
                          onClick={e => { e.stopPropagation(); toggle(r.id); }}
                          aria-label="Remove bookmark"
                          className="p-1 rounded hover:bg-white/10 transition-colors"
                        >
                          <Bookmark className="w-4 h-4 fill-accent text-accent" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-3xl shrink-0">{r.emoji}</span>
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
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between px-5 py-3 border-t border-border">
                    <span className={`text-xs font-medium flex items-center gap-1.5 ${urgent ? "text-red-400" : warning ? "text-accent" : "text-muted-foreground"}`}>
                      {r.deadlineDays !== undefined && <Clock className="w-3 h-3" />}
                      {r.deadlineDays !== undefined ? `${r.deadlineDays} days left` : r.date}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent">
                      View details <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}