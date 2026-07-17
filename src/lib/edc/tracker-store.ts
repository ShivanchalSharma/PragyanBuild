// Shared helper so any page (Raise, Build, Discover) can push an application
// straight into the Tracker's board without needing React context — it just
// writes to the same localStorage key the Tracker reads from.

export type TrackerStatus = "wishlist" | "applied" | "in_review" | "accepted" | "rejected";
export type TrackerType = "grant" | "accelerator" | "competition" | "fellowship" | "other";

export interface TrackerApp {
  id: string;
  title: string;
  type: TrackerType;
  amount?: string;
  deadline?: string;
  status: TrackerStatus;
  notes?: string;
  link?: string;
  addedAt: number;
  updatedAt: number;
}

const STORAGE_KEY = "edc:tracker";

function load(): TrackerApp[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}
function save(apps: TrackerApp[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
}

/**
 * Add an application to the tracker board (status: wishlist) from anywhere
 * in the app. Skips duplicates by title. Returns true if it was added.
 */
export function addToTracker(input: { title: string; type: TrackerType; amount?: string; deadline?: string }): boolean {
  const apps = load();
  if (apps.some(a => a.title.toLowerCase() === input.title.toLowerCase())) return false;
  const now = Date.now();
  apps.push({ ...input, id: crypto.randomUUID(), status: "wishlist", addedAt: now, updatedAt: now });
  save(apps);
  return true;
}

export function isTracked(title: string): boolean {
  return load().some(a => a.title.toLowerCase() === title.toLowerCase());
}