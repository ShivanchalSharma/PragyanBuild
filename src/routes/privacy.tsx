import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/edc/PageShell";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PageShell title="Privacy Policy">

      <p className="text-sm">Last updated: July 11, 2026</p>

      <div>
        <h2 className="text-xl font-semibold text-foreground mb-3">
          1. Information We Collect
        </h2>

        <p className="mb-3">
          We may collect information that helps us personalize and improve your experience:
        </p>

        <ul className="list-disc list-inside space-y-2 pl-2">
          <li>
            Account information:- Such as your name and email address.
          </li>
          <li>
            Onboarding preferences:- Including your entrepreneurial stage,
            interests, goals, and the type of support you are looking for.
          </li>
          <li>
            Platform activity:- Such as resources viewed, opportunities explored,
            and items saved or bookmarked.
          </li>
          <li>
            AI interactions:- Prompts and information you choose to share with
            the AI advisor to provide more relevant guidance.
          </li>
          <li>
            Technical information:- Such as browser and device information
            required for security and platform performance.
          </li>
        </ul>

        <p className="mt-3">
          We do not intentionally collect payment information, government
          identification, or other sensitive personal information unless
          explicitly required for a feature and clearly disclosed.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-foreground mb-3">
          2. How We Use Your Information
        </h2>

        <ul className="list-disc list-inside space-y-2 pl-2">
          <li>Personalize resources, opportunities, and recommendations.</li>
          <li>Provide stage-specific guidance through the AI advisor.</li>
          <li>Surface relevant funding opportunities, programs, and events.</li>
          <li>Facilitate mentorship and connection requests.</li>
          <li>Improve the platform through aggregated usage insights.</li>
          <li>Maintain the security and reliability of the platform.</li>
        </ul>

        <p className="mt-3">
          We do not sell your personal information to third parties.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-foreground mb-3">
          3. How We Share Your Information
        </h2>

        <ul className="list-disc list-inside space-y-2 pl-2">
          <li>
            With mentors or ecosystem partners:- Only when you choose to
            initiate a connection or request.
          </li>
          <li>
            With service providers:- When required to operate features such as
            authentication, data storage, analytics, or AI-powered services.
          </li>
          <li>
            For legal compliance:- When required by applicable law or necessary
            to protect the safety and integrity of the platform and its users.
          </li>
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-foreground mb-3">
          4. Data Storage and Security
        </h2>

        <ul className="list-disc list-inside space-y-2 pl-2">
          <li>Secure data transmission using HTTPS.</li>
          <li>Authentication and access controls to protect user accounts.</li>
          <li>Restricted access to personal information.</li>
          <li>Reasonable technical safeguards to protect stored information.</li>
        </ul>

        <p className="mt-3">
          While we take reasonable measures to protect your information, no
          online platform or method of electronic storage can guarantee complete
          security.
        </p>
      </div>

    </PageShell>
  );
}