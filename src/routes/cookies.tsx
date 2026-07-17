import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/edc/PageShell";

export const Route = createFileRoute("/cookies")({
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <PageShell title="Cookie Policy">

      <p className="text-sm">Last updated: July 11, 2026</p>

      <p>
        Our platform may use cookies and similar technologies to provide a
        smoother, more personalized experience. This page explains the types
        of cookies we may use and their purpose.
      </p>

      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Cookies We May Use
        </h2>

        <div className="flex flex-col gap-4">

          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-foreground">
                Essential Cookies
              </p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                Always on
              </span>
            </div>

            <p className="text-sm">
              Required for core platform functionality, such as maintaining
              sessions, authentication, and security. These cookies cannot be
              disabled when required for the platform to operate.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-foreground">
                Personalization Cookies
              </p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                Optional
              </span>
            </div>

            <p className="text-sm">
              Remember your preferences and selected settings to help provide
              a more relevant and consistent experience across sessions.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-foreground">
                Analytics Cookies
              </p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                Optional
              </span>
            </div>

            <p className="text-sm">
              Help us understand how people interact with the platform so we
              can improve features, usability, and performance.
            </p>
          </div>

        </div>
      </div>

    </PageShell>
  );
}