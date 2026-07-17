import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/edc/PageShell";
import { Mail, MapPin, Phone } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  return (
    <PageShell title="Contact">
      <p>
        Have a question, suggestion, or opportunity to share? We'd love to hear
        from you. Reach out through any of the following:
      </p>

      <div className="mt-6 flex flex-col gap-4">
        {/* Email */}
        <div className="flex items-start gap-4 bg-card border border-border rounded-xl p-5">
          <Mail className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Email</p>
            <a
              href="mailto:shivanchalsharma77@gmail.com"
              className="text-accent hover:underline underline-offset-4 transition-colors"
            >
              shivanchalsharma77@gmail.com
            </a>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-4 bg-card border border-border rounded-xl p-5">
          <Phone className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Call Us</p>
            <a
              href="tel:+919876543210"
              className="text-accent hover:underline underline-offset-4 transition-colors"
            >
              +91 82871 32XXX
            </a>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-4 bg-card border border-border rounded-xl p-5">
          <MapPin className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Address</p>
            <p>Innovation District</p>
<p>Aerocity, New Delhi</p>
<p>Delhi — 110037</p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}