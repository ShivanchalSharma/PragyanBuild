import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/edc/PageShell";

export const Route = createFileRoute("/cookies")({
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <PageShell title="Cookie Policy">

      <p className="text-sm">Last updated: June 10, 2026</p>

      <p>
        eDC KnowledgeHub uses cookies to improve your experience on the
        platform. This page explains what cookies we use and how you can
        manage them.
      </p>

      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Cookies We Use</h2>

        <div className="flex flex-col gap-4">

          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-foreground">Essential Cookies</p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                Always on
              </span>
            </div>
            <p className="text-sm">
              Required for the platform to function, such as keeping you logged
              in and remembering your session. These cannot be disabled.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-foreground">Personalization Cookies</p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                Opt-in
              </span>
            </div>
            <p className="text-sm">
              Store your quiz answers and dashboard preferences so your
              experience is consistent across sessions.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-foreground">Analytics Cookies</p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                Opt-in
              </span>
            </div>
            <p className="text-sm">
              Help us understand how the platform is used so we can improve it.
              All analytics data is fully anonymized.
            </p>
          </div>

        </div>
      </div>

    </PageShell>
  );
}