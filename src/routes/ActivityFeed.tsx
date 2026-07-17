import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AppShell } from "@/components/edc/AppShell";
import { NeuralBackground } from "@/components/edc/NeuralBackground";
import { ScrollReveal } from "@/components/edc/ScrollReveal";
import { useUser } from "@/lib/edc/store";
import { useEffect, useState } from "react";
import {
  Activity, Users, Bookmark, CheckCircle2, Eye, Target,
  Zap, type LucideIcon,
} from "lucide-react";

export const Route = createFileRoute("/ActivityFeed")({
  head: () => ({ meta: [{ title: "Community Pulse — KnowledgeHub" }] }),
  component: ActivityFeedPage,
});

interface FeedItem {
  id: number;
  text: string;
  time: string;
  type: "save" | "apply" | "register" | "view";
}

const FEED_POOL: Omit<FeedItem, "id" | "time">[] = [
  { text: "21 founders generated a personalized roadmap today", type: "view" },
  { text: "18 founders saved The Mom Test this week", type: "save" },
  { text: "14 startups completed their MVP milestone", type: "apply" },
  { text: "36 builders joined this week's startup challenge", type: "register" },
  { text: "Startup India Seed Fund added to 24 trackers", type: "save" },
  { text: "OpenAI API documentation viewed 42 times today", type: "view" },
  { text: "11 founders submitted a pitch deck for AI review", type: "apply" },
  { text: "Blume India Annual Report viewed 31 times today", type: "view" },
  { text: "19 builders bookmarked YC Startup School", type: "save" },
  { text: "8 founders launched the first version of their product", type: "apply" },
  { text: "AI Founder Copilot answered 120 startup questions today", type: "view" },
  { text: "15 builders registered for a product hackathon", type: "register" },
];

const TYPE_META: Record<FeedItem["type"], { Icon: LucideIcon; tile: string }> = {
  save:     { Icon: Bookmark,     tile: "bg-sky-500/10 border-sky-500/20 text-sky-300" },
  apply:    { Icon: CheckCircle2, tile: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" },
  register: { Icon: Target,       tile: "bg-accent/10 border-accent/20 text-accent" },
  view:     { Icon: Eye,          tile: "bg-purple-500/10 border-purple-500/20 text-purple-300" },
};

function randomTime() {
  const mins = Math.floor(Math.random() * 55) + 2;
  return mins < 60 ? `${mins}m ago` : `${Math.floor(mins / 60)}h ago`;
}

function buildFeed(): FeedItem[] {
  return [...FEED_POOL]
    .sort(() => Math.random() - 0.5)
    .slice(0, 8)
    .map((item, i) => ({ ...item, id: i, time: randomTime() }));
}

function useCountUp(target: number, ms = 900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0; const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / ms, 1);
      setV(Math.round((1 - Math.pow(1 - t, 3)) * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

function ActivityFeedPage() {
  const { user } = useUser();
  const [hydrated, setHydrated] = useState(false);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [newItem, setNewItem] = useState<FeedItem | null>(null);
  const [total] = useState(() => Math.floor(Math.random() * 40) + 80);
  const nTotal = useCountUp(total);

  useEffect(() => {
    setHydrated(true);
    setFeed(buildFeed());
    const interval = setInterval(() => {
      const random = FEED_POOL[Math.floor(Math.random() * FEED_POOL.length)];
      const item: FeedItem = { ...random, id: Date.now(), time: "just now" };
      setNewItem(item);
      setTimeout(() => {
        setFeed(prev => [item, ...prev.slice(0, 7)]);
        setNewItem(null);
      }, 500);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  if (!hydrated) return null;
  if (!user) return <Navigate to="/" />;

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-8">

        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 md:p-8">
          <NeuralBackground className="opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-accent/10 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center"><Activity className="w-5 h-5 text-primary" /></span>
              <h1 className="text-3xl md:text-4xl font-bold">
  Community Pulse
</h1>
</div>
            </div>
            <p className="text-muted-foreground max-w-2xl">
  Stay in sync with what founders across the community are building, launching, learning, and exploring. Discover the latest momentum from startups, builders, and innovators in real time.
</p>
            <div className="mt-6 grid grid-cols-3 gap-3 max-w-xl">

  <div className="bg-card/60 backdrop-blur border border-border rounded-2xl p-4">
    <Users className="w-4 h-4 text-accent mb-2.5" />
    <div className="text-2xl font-bold leading-none">{nTotal}</div>
    <div className="text-xs text-muted-foreground mt-1.5">
      Active Builders
    </div>
  </div>

  <div className="bg-card/60 backdrop-blur border border-border rounded-2xl p-4">
    <Activity className="w-4 h-4 text-primary mb-2.5" />
    <div className="text-2xl font-bold leading-none">47</div>
    <div className="text-xs text-muted-foreground mt-1.5">
      Projects Shipped
    </div>
  </div>

  <div className="bg-card/60 backdrop-blur border border-border rounded-2xl p-4">
    <Zap className="w-4 h-4 text-yellow-400 mb-2.5" />
    <div className="text-2xl font-bold leading-none">318</div>
    <div className="text-xs text-muted-foreground mt-1.5">
      AI Sessions Today
    </div>
  </div>

</div>
        </section>
        <div className="mb-6 rounded-2xl border border-border bg-card p-5">
  <h3 className="font-semibold mb-3">🔥 Trending Today</h3>

  <div className="flex flex-wrap gap-2">
    {[
      "Startup India Seed Fund",
      "YC Startup School",
      "OpenAI Agents SDK",
      "Product Hunt",
      "The Mom Test",
    ].map(tag => (
      <span
        key={tag}
        className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium"
      >
        {tag}
      </span>
    ))}
  </div>
</div>

        {/* Live feed */}
        <ScrollReveal>
          <section className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-accent" />
                <h2 className="font-bold">
  Community Feed
</h2>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
{total} builders active 
              </div>
            </div>

            {newItem && (
              <div className="mx-6 mt-4 flex items-center gap-3 rounded-xl border border-accent/30 bg-accent/[0.06] px-4 py-3 animate-slide-up">
                {(() => { const m = TYPE_META[newItem.type]; return (
                  <span className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${m.tile}`}><m.Icon className="w-4 h-4" /></span>
                ); })()}
                <p className="text-sm font-medium flex-1">{newItem.text}</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/15 text-accent shrink-0">NEW</span>
              </div>
            )}

            <ul className="divide-y divide-border">
              {feed.map(item => {
                const m = TYPE_META[item.type];
                return (
                  <li key={item.id} className="flex items-center gap-3.5 px-6 py-3.5 hover:bg-secondary/30 transition-colors">
                    <span className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${m.tile}`}><m.Icon className="w-4 h-4" /></span>
                    <p className="text-sm text-foreground flex-1 min-w-0">{item.text}</p>
                    <span className="text-xs text-muted-foreground shrink-0 whitespace-nowrap">{item.time}</span>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-2 px-6 py-4 border-t border-border text-xs text-muted-foreground">
  <Users className="w-3.5 h-3.5" />
  Live community activity from founders across the platform
</div>
          </section>
        </ScrollReveal>

      </div>
    </AppShell>
  );
}