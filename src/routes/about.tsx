import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/edc/PageShell";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageShell title="About eDC">

      <p>
        The Entrepreneurship Development Cell (eDC), IIT Delhi, is one of India's largest
        student-driven entrepreneurship organizations, dedicated to fostering innovation
        and nurturing the next generation of founders. Established in 2007, eDC provides
        aspiring entrepreneurs with the resources, mentorship, industry connections, and
        opportunities needed to transform ideas into successful ventures.
      </p>

      <p>
        Through flagship initiatives such as the Business and Entrepreneurship Conclave
        (BECon), startup competitions, workshops, speaker sessions, hackathons, and
        incubation support, eDC creates a vibrant ecosystem where students can learn,
        build, network, and launch impactful startups.
      </p>

      <p>
        By connecting students with founders, investors, industry leaders, and the broader
        startup ecosystem, eDC IIT Delhi serves as a gateway for turning entrepreneurial
        ambitions into reality.
      </p>

      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        {[
          { stat: "2007", label: "Year founded" },
          { stat: "India's largest", label: "Student-run entrepreneurship org" },
          { stat: "500+", label: "Resources curated" },
        ].map(({ stat, label }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-5">
            <div className="text-2xl font-bold text-foreground">{stat}</div>
            <div className="text-sm text-muted-foreground mt-1">{label}</div>
          </div>
        ))}
      </div>

    </PageShell>
  );
}