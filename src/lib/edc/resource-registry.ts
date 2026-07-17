// Every saveable resource across the whole app, in one place, so the Saved
// page (or anything else) can resolve a bookmarked id no matter which
// section — Discover, Build, Raise, or the dashboard's own lists — it came
// from. useSaved() already stores ids from a single shared "edc:saved" key;
// this registry is what turns those ids back into renderable cards.

import {
  BookOpen, GraduationCap, LineChart, Trophy, Wrench, Handshake,
  Landmark, FileText, Banknote, Rocket, BarChart3, AlarmClock, type LucideIcon,
} from "lucide-react";
import {
  whatsNew, pickedForYou, books, courses, reports,
  competitions, facilities, connects, funders, pitchResources,
} from "@/lib/edc/data";

export type ResourceSource = "home" | "discover" | "build" | "raise";

export interface RegistryItem {
  id: string;
  title: string;
  sub: string;
  meta?: string;   // e.g. amount, prize
  footer?: string; // e.g. deadline
  kind: string;    // display label, e.g. "Book", "Funder"
  Icon: LucideIcon;
  tile: string;    // tailwind classes for the icon tile
  source: ResourceSource;
  sourceHref: string;
}

const TILE = {
  purple:  "bg-purple-500/10 border-purple-500/20 text-purple-300",
  sky:     "bg-sky-500/10 border-sky-500/20 text-sky-300",
  emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",
  accent:  "bg-accent/10 border-accent/20 text-accent",
  primary: "bg-primary/10 border-primary/20 text-primary",
};

export const RESOURCE_REGISTRY: RegistryItem[] = [
  // ── Home / dashboard lists ──────────────────────────────────────────────
  ...whatsNew.map(r => ({
    id: r.id, title: r.title, sub: r.description, footer: r.date,
    kind: r.category, Icon: AlarmClock, tile: TILE.accent,
    source: "home" as const, sourceHref: "/dashboard",
  })),
  ...pickedForYou.map(r => ({
    id: r.id, title: r.title, sub: r.description,
    kind: r.category, Icon: Rocket, tile: TILE.primary,
    source: "home" as const, sourceHref: "/dashboard",
  })),

  // ── Discover ─────────────────────────────────────────────────────────────
  ...books.map(b => ({
    id: b.id, title: b.title, sub: b.author,
    kind: "Book", Icon: BookOpen, tile: TILE.purple,
    source: "discover" as const, sourceHref: "/discover",
  })),
  ...courses.map(c => ({
    id: c.id, title: c.title, sub: c.desc,
    kind: "Course", Icon: GraduationCap, tile: TILE.sky,
    source: "discover" as const, sourceHref: "/discover",
  })),
  ...reports.map(r => ({
    id: r.id, title: r.title, sub: r.year,
    kind: "Report", Icon: LineChart, tile: TILE.emerald,
    source: "discover" as const, sourceHref: "/discover",
  })),

  // ── Build ────────────────────────────────────────────────────────────────
  ...competitions.map(c => ({
    id: c.id, title: c.title, sub: c.prize, footer: `${c.deadline} days left`,
    kind: "Competition", Icon: Trophy, tile: TILE.accent,
    source: "build" as const, sourceHref: "/build",
  })),
  ...facilities.map(f => ({
    id: f.id, title: f.title, sub: f.desc,
    kind: "Facility", Icon: Wrench, tile: TILE.sky,
    source: "build" as const, sourceHref: "/build",
  })),
  ...connects.map(c => ({
    id: c.id, title: c.title, sub: c.desc,
    kind: "Connect", Icon: Handshake, tile: TILE.emerald,
    source: "build" as const, sourceHref: "/build",
  })),

  // ── Raise ────────────────────────────────────────────────────────────────
  ...funders.map(f => ({
    id: f.id, title: f.title, sub: f.stage, meta: f.amount, footer: f.deadline,
    kind: "Funder", Icon: Landmark, tile: TILE.emerald,
    source: "raise" as const, sourceHref: "/raise",
  })),
  ...pitchResources.map(p => ({
    id: p.id, title: p.title, sub: "Free download",
    kind: "Pitch resource", Icon: FileText, tile: TILE.primary,
    source: "raise" as const, sourceHref: "/raise",
  })),
];

export function getSavedResources(savedIds: string[]): RegistryItem[] {
  const byId = new Map(RESOURCE_REGISTRY.map(r => [r.id, r]));
  return savedIds.map(id => byId.get(id)).filter((r): r is RegistryItem => !!r);
}