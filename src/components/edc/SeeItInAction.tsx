import type { ReactNode } from "react";
import { Sparkles, Layers, PenLine, GitBranch } from "lucide-react";
import { RoadmapPreviewCard } from "@/components/edc/RoadmapPreviewCard";
import { ResourcesPreviewCard } from "@/components/edc/ResourcesPreviewCard";
import { PitchDeckReviewerCard } from "@/components/edc/PitchDeckReviewerCard";
import { ProgressTrackerCard } from "@/components/edc/ProgressTrackerCard";
import { TiltCard } from "@/components/edc/TiltCard";
import { ScrollReveal } from "@/components/edc/ScrollReveal";
import { ScrollJourney } from "@/components/edc/ScrollJourney";

interface Feature {
  icon: typeof Sparkles;
  eyebrow: string;
  title: string;
  body: string;
  tags: string[];
  card: ReactNode;
}

const FEATURES: Feature[] = [
  {
    icon: Sparkles,
    eyebrow: "AI Roadmap Creator",
    title: "One line in. A founder roadmap out.",
    body: "Describe your idea in a single sentence. We turn it into a week-by-week plan with the exact steps, resources and milestones to reach your first real users.",
    tags: ["Idea → plan", "Weekly steps", "Personalised"],
    card: <RoadmapPreviewCard />,
  },
  {
    icon: Layers,
    eyebrow: "Matched Resources",
    title: "The right resource, right when it matters.",
    body: "Books, mentors, internships, and funding opportunities — intelligently surfaced for your exact stage and evolving as you grow, instead of getting buried in endless folders and spreadsheets you never open.",
    tags: ["Books", "Mentors", "Internships", "Funding"],
    card: <ResourcesPreviewCard />,
  },
  {
    icon: PenLine,
    eyebrow: "AI Pitch Deck Reviewer",
    title: "Investor-grade feedback in seconds.",
    body: "Drop in your deck and get a scored review: what's strong, what's missing, and the one slide that will lose the room and the one that will make you stand out.",
    tags: ["Scored review", "Slide-by-slide", "Fix-it notes"],
    card: <PitchDeckReviewerCard />,
  },
  {
    icon: GitBranch,
    eyebrow: "Startup Progress Tracker",
    title: "Always know your next move.",
    body: "See exactly where you are from idea to scale, what to do next, and how you're pacing against fellow founders, all in one live view.",
    tags: ["Idea → scale", "Next actions", "Live pacing"],
    card: <ProgressTrackerCard />,
  },
];

function Description({ f }: { f: Feature }) {
  return (
    <div className="max-w-md">
      <div className="inline-flex items-center gap-2 mb-4">
        <span className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center">
          <f.icon className="w-4 h-4 text-accent" />
        </span>
        <span className="text-xs font-bold uppercase tracking-widest text-accent">{f.eyebrow}</span>
      </div>
      <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-3">{f.title}</h3>
      <p className="text-muted-foreground leading-relaxed mb-5">{f.body}</p>
      <div className="flex flex-wrap gap-2">
        {f.tags.map((t) => (
          <span
            key={t}
            className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-secondary/70 border border-border text-secondary-foreground"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SeeItInAction() {
  return (
    <section className="relative max-w-6xl mx-auto px-6 py-24">
      <ScrollJourney />
      <div className="relative z-10">
      <ScrollReveal>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/10 text-xs font-bold uppercase tracking-widest text-accent mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Live · See it in action
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">See it think.</h2>
          <p className="text-muted-foreground text-lg">
            Describe your idea once. Watch it become a roadmap, matched resources, a sharper pitch
            and a tracked plan.
          </p>
        </div>
      </ScrollReveal>

      <div className="space-y-16 md:space-y-24">
        {FEATURES.map((f, i) => {
          const reverse = i % 2 === 1; // 0,2 → card left · 1,3 → card right
          return (
            <ScrollReveal key={f.eyebrow} delay={0.05}>
              <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
                {/* card cell */}
                <div className={`flex ${reverse ? "md:order-2" : ""}`}>
                  <div className="w-full max-w-md mx-auto md:mx-0 min-h-[440px] flex">
                    <TiltCard className="w-full flex">{f.card}</TiltCard>
                  </div>
                </div>
                {/* description cell */}
                <div
                  className={`flex justify-center md:justify-start ${
                    reverse ? "md:order-1 md:justify-end" : ""
                  }`}
                >
                  <Description f={f} />
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
      </div>
    </section>
  );
}