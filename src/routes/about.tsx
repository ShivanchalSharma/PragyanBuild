import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/edc/PageShell";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageShell title="About Us">

      <p>
        Entrepreneurship is full of opportunities, but finding the right resource,
        mentor, funding program, or next step often means navigating scattered
        information across countless platforms. We are building a smarter way forward.
      </p>

      <p>
        Our platform brings together curated resources, funding opportunities,
        mentorship, events, and ecosystem connections in one place. Through
        personalized guidance, it understands where you are in your entrepreneurial
        journey and surfaces what matters most at that stage.
      </p>

      <p>
        Whether you're exploring entrepreneurship, validating an idea, building your
        first product, or preparing to scale, our goal is simple: help you discover
        the right opportunities, make better decisions, and keep moving forward.
      </p>

      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        {[
          { stat: "500+", label: "Curated resources" },
          { stat: "Personalized", label: "Guidance for every stage" },
          { stat: "One Platform", label: "Resources, funding & connections" },
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