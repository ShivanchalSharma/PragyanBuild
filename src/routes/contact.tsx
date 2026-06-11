import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/edc/PageShell";
import { Mail, MapPin } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  return (
    <PageShell title="Contact">

      <p>
        If you have any questions, concerns, or requests, please reach out to
        us through any of the following:
      </p>

      <div className="mt-6 flex flex-col gap-4">

        <div className="flex items-start gap-4 bg-card border border-border rounded-xl p-5">
          <Mail className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Email</p>
            
            <a href="mailto:tech@edc.iitd.ac.in"
              className="text-accent hover:underline underline-offset-4 transition-colors"
            >
              tech@edc.iitd.ac.in
            </a>
          </div>
        </div>

        <div className="flex items-start gap-4 bg-card border border-border rounded-xl p-5">
          <MapPin className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Address</p>
            <p>Entrepreneurship Development Cell</p>
            <p>IIT Delhi, Hauz Khas</p>
            <p>New Delhi — 110016</p>
          </div>
        </div>

      </div>

    </PageShell>
  );
}