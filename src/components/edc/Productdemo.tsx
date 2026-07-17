import { RoadmapPreviewCard } from "@/components/edc/ResourcesPreviewCard";
import { MentorMatchPreviewCard } from "@/components/edc/MentorMatchPreviewCard";
import { TiltCard } from "@/components/edc/TiltCard";
import { ScrollReveal } from "@/components/edc/ScrollReveal";

export function ProductDemo() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <ScrollReveal>
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">See it think.</h2>
          <p className="text-muted-foreground">
            Describe your idea once. Watch it turn into a roadmap and matched mentors — live.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <ScrollReveal delay={0.05}>
          <TiltCard>
            <RoadmapPreviewCard />
          </TiltCard>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <TiltCard>
            <MentorMatchPreviewCard />
          </TiltCard>
        </ScrollReveal>
      </div>
    </section>
  );
}
