import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/edc/AppShell";
import { useEffect, useState } from "react";
import { Users, Zap } from "lucide-react";

export const Route = createFileRoute("/ActivityFeed")({
  head: () => ({ meta: [{ title: "Activity Feed — eDC KnowledgeHub" }] }),
  component: ActivityFeedPage,
});

function ActivityFeedPage() {
  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
        <h1 className="text-3xl font-bold mb-2">Activity Feed</h1>
        <p className="text-muted-foreground mb-8">Live activity from IIT Delhi founders this week.</p>
        <ActivityFeed />
      </div>
    </AppShell>
  );
}

interface FeedItem {
  id: number;
  text: string;
  time: string;
  type: "save" | "apply" | "register" | "view";
}

const FEED_POOL: Omit<FeedItem, "id" | "time">[] = [
  { text: "12 students saved YC S25 this week", type: "save" },
  { text: "eDC Sprint now has 47 registrations", type: "register" },
  { text: "8 founders bookmarked IHFC Grant today", type: "save" },
  { text: "A 3rd year student applied to Antler India", type: "apply" },
  { text: "Blume India Report downloaded 23 times today", type: "view" },
  { text: "5 teams registered for Smart India Hackathon", type: "register" },
  { text: "BIRAC BIG Grant viewed by 18 students", type: "view" },
  { text: "2 founders matched in DeepTech this week", type: "apply" },
  { text: "The Mom Test added to 15 reading lists", type: "save" },
  { text: "Sequoia Surge applications up 30% this week", type: "view" },
  { text: "3 IITD teams shortlisted for TiE Global Pitch", type: "apply" },
  { text: "Makerspace booked solid for next 2 weeks", type: "register" },
];

const TYPE_COLORS = {
  save: "bg-sky-500/15 text-sky-300",
  apply: "bg-emerald-500/15 text-emerald-300",
  register: "bg-accent/15 text-accent",
  view: "bg-purple-500/15 text-purple-300",
};

const TYPE_ICONS = {
  save: "🔖",
  apply: "✅",
  register: "🎯",
  view: "👀",
};

function randomTime() {
  const mins = Math.floor(Math.random() * 55) + 2;
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

function buildFeed(): FeedItem[] {
  return [...FEED_POOL]
    .sort(() => Math.random() - 0.5)
    .slice(0, 6)
    .map((item, i) => ({ ...item, id: i, time: randomTime() }));
}

function ActivityFeed() {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [newItem, setNewItem] = useState<FeedItem | null>(null);
  const [total] = useState(() => Math.floor(Math.random() * 40) + 80);

  useEffect(() => {
    setFeed(buildFeed());
    const interval = setInterval(() => {
      const random = FEED_POOL[Math.floor(Math.random() * FEED_POOL.length)];
      const item: FeedItem = { ...random, id: Date.now(), time: "just now" };
      setNewItem(item);
      setTimeout(() => {
        setFeed((prev) => [item, ...prev.slice(0, 5)]);
        setNewItem(null);
      }, 400);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-accent" />
          <h3 className="font-bold text-sm">Live on campus</h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {total} active this week
        </div>
      </div>

      {newItem && (
        <div className="mb-2 px-3 py-2 rounded-lg bg-accent/10 border border-accent/30 text-xs text-foreground animate-slide-up flex items-center gap-2">
          <span>{TYPE_ICONS[newItem.type]}</span>
          {newItem.text}
        </div>
      )}

      <ul className="space-y-2">
        {feed.map((item) => (
          <li key={item.id} className="flex items-start gap-2.5 text-xs">
            <span className={`shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${TYPE_COLORS[item.type]}`}>
              {TYPE_ICONS[item.type]}
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-foreground leading-snug">{item.text}</span>
            </div>
            <span className="shrink-0 text-muted-foreground text-[10px] whitespace-nowrap">
              {item.time}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 pt-3 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
        <Users className="w-3.5 h-3.5" />
        Activity from IIT Delhi founders this week
      </div>
    </div>
  );
}