export type Category = "FUNDING" | "EVENT" | "REPORT" | "DEADLINE" | "LEARN" | "MENTOR";

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: Category;
  tags: string[];
  date?: string;
  deadlineDays?: number;
  emoji: string;
  isNew?: boolean;
  link?: string;
}

export const whatsNew: Resource[] = [
  { id: "n1", title: "YC S25 Applications Close in 12 days", description: "Apply to Y Combinator's Summer 2025 batch. $500K standard deal.", category: "DEADLINE", tags: ["Urgent", "Global"], deadlineDays: 12, emoji: "⏰", isNew: true },
  { id: "n2", title: "Blume Ventures India Report 2024", description: "Annual ecosystem outlook from one of India's leading early-stage VCs.", category: "REPORT", tags: ["Free", "PDF"], date: "Added today", emoji: "📊", isNew: true },
  { id: "n3", title: "eDC Startup Sprint registrations open", description: "48-hour campus hackathon. Win ₹2L + incubation slot.", category: "EVENT", tags: ["IITD Exclusive"], deadlineDays: 5, emoji: "🚀", isNew: true },
  { id: "n4", title: "BIRAC BIG grant — ₹50L for biotech startups", description: "Government grant for early-stage biotech students.", category: "FUNDING", tags: ["Grant", "Biotech"], deadlineDays: 28, emoji: "💰", isNew: true },
  { id: "n5", title: "Sequoia Surge Cohort 9 — applications live", description: "Rapid scale-up program for seed-stage students.", category: "FUNDING", tags: ["Accelerator"], deadlineDays: 18, emoji: "⚡", isNew: true },
];

export const pickedForYou: Resource[] = [
  { id: "p1", title: "i-TTO Connect — IP & Tech Transfer", description: "IIT Delhi's tech transfer office for patents and licensing.", category: "MENTOR", tags: ["IITD Exclusive", "Free"], emoji: "🏛️" },
  { id: "p2", title: "IHFC — Funding for Deeptech", description: "₹25L–₹2Cr grants for cyber-physical systems startups.", category: "FUNDING", tags: ["Deadline: Aug 2025", "DeepTech"], emoji: "🔬" },
  { id: "p3", title: "Makerspace — Hardware Prototyping", description: "Open access lab with 3D printers, PCB, laser cutters.", category: "MENTOR", tags: ["IITD Exclusive", "Free"], emoji: "🛠️" },
  { id: "p4", title: "The Mom Test (Book)", description: "How to talk to customers and validate ideas honestly.", category: "LEARN", tags: ["Validation"], emoji: "📖" },
  { id: "p5", title: "Antler India — Residency", description: "₹35L for 9% equity, 6-month residency program.", category: "FUNDING", tags: ["Pre-seed"], emoji: "🌱" },
  { id: "p6", title: "How to Build a Pitch Deck — Sequoia", description: "The original 10-slide deck framework that raised millions.", category: "LEARN", tags: ["Free", "Template"], emoji: "🎯" },
];

export const books = [
  { id: "b1", title: "The Lean Startup", author: "Eric Ries", emoji: "📕" },
  { id: "b2", title: "Zero to One", author: "Peter Thiel", emoji: "📘" },
  { id: "b3", title: "The Hard Thing About Hard Things", author: "Ben Horowitz", emoji: "📗" },
  { id: "b4", title: "The Mom Test", author: "Rob Fitzpatrick", emoji: "📙" },
  { id: "b5", title: "students at Work", author: "Jessica Livingston", emoji: "📔" },
];

export const courses = [
  { id: "c1", title: "Venture Studio", desc: "End-to-end ideation to MVP", emoji: "🎓" },
  { id: "c2", title: "VentureVerse", desc: "Live cohort with students", emoji: "🌐" },
  { id: "c3", title: "YC Startup School", desc: "Free online course", emoji: "🏫" },
];

export const reports = [
  { id: "r1", title: "Blume Indus Valley Report", year: "2024", emoji: "📈" },
  { id: "r2", title: "Kalaari Top 100", year: "2024", emoji: "📊" },
  { id: "r3", title: "Sequoia India Outlook", year: "2024", emoji: "📉" },
];

export const competitions = [
  { id: "co1", title: "eDC Startup Sprint", deadline: 5, prize: "₹2L + Incubation", emoji: "🏆" },
  { id: "co2", title: "Smart India Hackathon", deadline: 22, prize: "₹1L per problem", emoji: "🥇" },
  { id: "co3", title: "TiE Global Pitch", deadline: 40, prize: "Global mentorship", emoji: "🌍" },
];

export const facilities = [
  { id: "f1", title: "Makerspace", desc: "Hardware prototyping lab", emoji: "🛠️" },
  { id: "f2", title: "i-TTO", desc: "IP & Tech Transfer Office", emoji: "🏛️" },
  { id: "f3", title: "R&D Partnerships", desc: "Industry collaboration desk", emoji: "🔬" },
];

export const funders = [
  { id: "fu1", title: "IHFC", amount: "₹25L–2Cr", stage: "Pre-seed/Seed", deadline: "Aug 2025", emoji: "🏦" },
  { id: "fu2", title: "IDEX", amount: "₹1.5Cr", stage: "Prototype", deadline: "Rolling", emoji: "🛡️" },
  { id: "fu3", title: "BIRAC BIG", amount: "₹50L", stage: "Biotech early", deadline: "28 days", emoji: "🧬" },
  { id: "fu4", title: "Atal Incubation", amount: "₹10L grant", stage: "Idea", deadline: "Rolling", emoji: "🇮🇳" },
  { id: "fu5", title: "Y Combinator", amount: "$500K", stage: "Seed", deadline: "12 days", emoji: "⚡" },
  { id: "fu6", title: "Antler", amount: "₹35L / 9%", stage: "Pre-seed", deadline: "Rolling", emoji: "🌱" },
  { id: "fu7", title: "Build3", amount: "$100K", stage: "Climate seed", deadline: "60 days", emoji: "🌍" },
];

export const pitchResources = [
  { id: "pr1", title: "Investor Email Templates", emoji: "✉️" },
  { id: "pr2", title: "Pitch Deck Guide (Sequoia)", emoji: "📑" },
  { id: "pr3", title: "Term Sheet 101", emoji: "📜" },
];

export const mentors = [
  { id: "m1", name: "Rohan Mehta", expertise: ["DeepTech", "Fundraising"], status: "Available this week", initials: "RM" },
  { id: "m2", name: "Aisha Khan", expertise: ["Consumer", "Growth"], status: "Booking 2 weeks out", initials: "AK" },
  { id: "m3", name: "Vikram Iyer", expertise: ["SaaS", "GTM"], status: "Available this week", initials: "VI" },
];

export const deadlines = [
  { id: "d1", title: "YC Application", days: 12 },
  { id: "d2", title: "eDC Sprint", days: 5 },
  { id: "d3", title: "BIRAC BIG Grant", days: 28 },
  { id: "d4", title: "Antler Residency", days: 18 },
];

export function getPersonalizedPicks(prefs: import("@/lib/edc/store").Preferences): Resource[] {
  const { stage, domains = [], needs = [] } = prefs;

  const stageMap: Record<string, string[]> = {
    explorer: ["p4", "p1", "p3"],
    validator: ["p4", "p6", "p1"],
    builder:   ["p3", "p1", "p2"],
    raiser:    ["p5", "p6", "p2"],
    follower:  ["p2", "p4", "p6"],
  };

  const priority = stageMap[stage || "explorer"] || [];
  const base = [...pickedForYou].sort((a, b) => {
    const ai = priority.indexOf(a.id);
    const bi = priority.indexOf(b.id);
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  // boost domain-matching items
  if (domains.length > 0) {
    return base.sort((a, b) => {
      const am = a.tags.some(t => domains.some(d => t.toLowerCase().includes(d.toLowerCase()))) ? -1 : 0;
      const bm = b.tags.some(t => domains.some(d => t.toLowerCase().includes(d.toLowerCase()))) ? -1 : 0;
      return am - bm;
    });
  }

  return base;
}

export function getDefaultTab(prefs: import("@/lib/edc/store").Preferences): string {
  const { stage, needs = [] } = prefs;
  if (needs.includes("funding") || stage === "raiser") return "raise";
  if (needs.includes("labs") || needs.includes("compete") || stage === "builder") return "startup";
  return "learn";
}

export function getPersonalizedMentors(prefs: import("@/lib/edc/store").Preferences) {
  const { domains = [], stage } = prefs;
  if (domains.length === 0) return mentors;
  return [...mentors].sort((a, b) => {
    const am = a.expertise.some(e => domains.some(d => e.toLowerCase().includes(d.toLowerCase()))) ? -1 : 0;
    const bm = b.expertise.some(e => domains.some(d => e.toLowerCase().includes(d.toLowerCase()))) ? -1 : 0;
    return am - bm;
  });
}

export function getPersonalizedFunders(prefs: import("@/lib/edc/store").Preferences) {
  const { stage, domains = [] } = prefs;
  const stageOrder: Record<string, string[]> = {
    explorer: ["fu4", "fu1"],
    validator: ["fu4", "fu1", "fu6"],
    builder:   ["fu1", "fu2", "fu6"],
    raiser:    ["fu5", "fu3", "fu6", "fu2"],
    follower:  [],
  };
  const priority = stageOrder[stage || ""] || [];
  return [...funders].sort((a, b) => {
    const ai = priority.indexOf(a.id);
    const bi = priority.indexOf(b.id);
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}