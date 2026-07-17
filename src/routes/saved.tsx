import { createFileRoute, Navigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/edc/AppShell";
import { NeuralBackground } from "@/components/edc/NeuralBackground";
import { ScrollReveal } from "@/components/edc/ScrollReveal";
import { useSaved, useUser } from "@/lib/edc/store";
import { getSavedResources, type ResourceSource } from "@/lib/edc/resource-registry";
import { Bookmark, ExternalLink, ArrowRight, Layers } from "lucide-react";

export const Route = createFileRoute("/saved")({
  head: () => ({ meta: [{ title: "Saved — eDC KnowledgeHub" }] }),
  component: Saved,
});

const SOURCE_LABEL: Record<ResourceSource, string> = {
  home: "Home",
  discover: "Discover",
  build: "Build",
  raise: "Raise",
};

function Saved() {
  const { user } = useUser();
  const { saved, toggle } = useSaved();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);
  if (!hydrated) return null;
  if (!user) return <Navigate to="/" />;

  // resolves every saved id across Discover, Build, Raise, and the dashboard's
  // own lists — not just one page's local resources
  const items = getSavedResources(saved);

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">

        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 md:p-8">
          <NeuralBackground className="opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-accent/10 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center"><Bookmark className="w-5 h-5 text-primary" /></span>
              <h1 className="text-3xl md:text-4xl font-bold">Saved</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Everything you've bookmarked — from Discover, Build, and Raise — always one click away.
            </p>
            <div className="mt-6 max-w-[200px]">
              <div className="bg-card/60 backdrop-blur border border-border rounded-2xl p-4">
                <Layers className="w-4 h-4 text-accent mb-2.5" />
                <div className="text-2xl font-bold leading-none">{items.length}</div>
                <div className="text-xs text-muted-foreground mt-1.5">resources saved</div>
              </div>
            </div>
          </div>
        </section>

        {items.length === 0 ? (
          <ScrollReveal>
            <div className="flex flex-col items-center justify-center text-center py-20 rounded-3xl border border-dashed border-border bg-card/40">
              <Bookmark className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-bold mb-1.5">Nothing saved yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-5">
                Tap the bookmark icon on any card in Discover, Build, or Raise to keep it here.
              </p>
              <div className="flex gap-2">
                <Link to="/discover" className="text-xs font-semibold text-accent hover:underline">Discover</Link>
                <span className="text-muted-foreground">·</span>
                <Link to="/build" className="text-xs font-semibold text-accent hover:underline">Build</Link>
                <span className="text-muted-foreground">·</span>
                <Link to="/raise" className="text-xs font-semibold text-accent hover:underline">Raise</Link>
              </div>
            </div>
          </ScrollReveal>
        ) : (
          <ScrollReveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map(item => (
                <div key={item.id} className="card-lift bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 h-full">
                  <div className="flex items-start justify-between">
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${item.tile}`}><item.Icon className="w-5 h-5" /></div>
                    <div className="flex items-center gap-2">
                      <Link to={item.sourceHref} className="text-[10px] font-bold px-2 py-0.5 rounded bg-secondary text-secondary-foreground hover:bg-accent/15 hover:text-accent transition-colors">
                        {SOURCE_LABEL[item.source]}
                      </Link>
                      <button onClick={() => toggle(item.id)} aria-label="Remove from saved">
                        <Bookmark className="w-4 h-4 fill-accent text-accent" />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{item.kind}</span>
                    <h4 className="font-semibold leading-snug mt-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.sub}</p>
                    {item.meta && <p className="text-sm font-bold text-accent mt-2">{item.meta}</p>}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-xs text-muted-foreground">{item.footer || ""}</span>
                    <Link to={item.sourceHref} className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline">
                      View <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}

      </div>
    </AppShell>
  );
}