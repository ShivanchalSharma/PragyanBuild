import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/edc/PageShell";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PageShell title="Privacy Policy">

      <p className="text-sm">Last updated: June 10, 2026</p>

      <div>
        <h2 className="text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
        <p className="mb-3">We collect the following types of information:</p>
        <ul className="list-disc list-inside space-y-2 pl-2">
          <li>Account information — your name, email address, and year of study.</li>
          <li>Onboarding preferences — your startup stage, domains of interest, and resource needs from the quiz.</li>
          <li>Usage data — pages visited, resources opened, items bookmarked, and time on platform.</li>
          <li>Device information — browser type, operating system, and IP address for security purposes.</li>
          <li>Mentor booking requests — messages you send when requesting a mentorship session.</li>
        </ul>
        <p className="mt-3">We do not collect payment information, government ID, or any sensitive personal data.</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
        <ul className="list-disc list-inside space-y-2 pl-2">
          <li>Personalize your dashboard and resource recommendations.</li>
          <li>Send updates about funding deadlines and events (opt-in only).</li>
          <li>Facilitate mentor booking requests and communications.</li>
          <li>Improve the platform through anonymized usage analytics.</li>
          <li>Maintain the security and integrity of your account.</li>
          <li>Comply with applicable laws and IIT Delhi institutional policies.</li>
        </ul>
        <p className="mt-3">We do not use your information for advertising or sell it to any third party.</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-foreground mb-3">3. How We Share Your Information</h2>
        <ul className="list-disc list-inside space-y-2 pl-2">
          <li>With mentors — your name and message are shared only when you submit a booking request.</li>
          <li>With IIT Delhi administration — only if required by institutional policy or a lawful request.</li>
          <li>With service providers — Supabase processes data on our behalf under confidentiality obligations.</li>
          <li>Legal compliance — if required by law or to protect the safety of our users.</li>
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-foreground mb-3">4. Data Storage and Security</h2>
        <ul className="list-disc list-inside space-y-2 pl-2">
          <li>Encrypted data transmission via HTTPS.</li>
          <li>Password hashing — we never store your password in plain text.</li>
          <li>Access controls limiting who within eDC can access your data.</li>
        </ul>
        <p className="mt-3">
          While we take all reasonable precautions, no method of electronic
          storage is 100% secure. We encourage you to use a strong, unique
          password for your account.
        </p>
      </div>

    </PageShell>
  );
}