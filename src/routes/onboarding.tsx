import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { usePrefs, type Preferences } from "@/lib/edc/store";
import { Logo } from "@/components/edc/Logo";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [{ title: "Personalize your journey" }],
  }),
  component: Onboarding,
});

const Q1 = [
  {
    v: "explorer",
    emoji: "🎓",
    label: "Student exploring startups for the first time",
  },
  {
    v: "validator",
    emoji: "💡",
    label: "I have an idea and want to validate it",
  },
  {
    v: "builder",
    emoji: "🛠️",
    label: "I'm building something and need tools or connections",
  },
  {
    v: "raiser",
    emoji: "📈",
    label: "I'm raising funding or looking for investors",
  },
  {
    v: "follower",
    emoji: "🔁",
    label: "Just here to stay updated on the ecosystem",
  },
];

const Q2 = [
  {
    v: "explore",
    emoji: "🧭",
    label: "Explore entrepreneurship",
  },
  {
    v: "validate",
    emoji: "💡",
    label: "Validate an idea",
  },
  {
    v: "mvp",
    emoji: "🛠️",
    label: "Build an MVP",
  },
  {
    v: "team",
    emoji: "🤝",
    label: "Find a co-founder or team",
  },
  {
    v: "funding",
    emoji: "💰",
    label: "Raise funding",
  },
  {
    v: "grow",
    emoji: "🚀",
    label: "Launch or grow my startup",
  },
];

const Q3 = [
  "DeepTech",
  "Fintech",
  "Climate",
  "HealthTech",
  "EdTech",
  "Consumer",
  "SaaS/B2B",
  "Social Impact",
  "Hardware/IoT",
  "AI/ML",
];

const Q4 = [
  {
    v: "learn",
    emoji: "📚",
    label: "Books, courses and learning resources",
  },
  {
    v: "funding",
    emoji: "💰",
    label: "Funding opportunities and grants",
  },
  {
    v: "mentor",
    emoji: "🤝",
    label: "Mentorship and expert connections",
  },
  {
    v: "compete",
    emoji: "🏆",
    label: "Competitions and programs",
  },
  {
    v: "build",
    emoji: "🛠️",
    label: "Product building and idea validation",
  },
  {
    v: "reports",
    emoji: "📊",
    label: "Industry reports and market research",
  },
];

const Q5 = [
  {
    v: "latest",
    emoji: "⚡",
    label: "Show me what's new this week",
  },
  {
    v: "recommended",
    emoji: "🎯",
    label: "Recommend based on my stage",
  },
  {
    v: "browse",
    emoji: "🔍",
    label: "Let me browse everything",
  },
  {
    v: "mixed",
    emoji: "✨",
    label: "A mix of all",
  },
];

function Onboarding() {
  const navigate = useNavigate();
  const { setPrefs } = usePrefs();

  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const [data, setData] = useState<Preferences>({
    domains: [],
    needs: [],
  });

  const total = 5;

  // Starts at 0% before Question 1 is answered.
  // Advances as soon as the current question has a valid answer.
  const canNext = () => {
    if (step === 0) return !!data.stage;
    if (step === 1) return !!data.goal;
    if (step === 2) return data.domains.length > 0;
    if (step === 3) return data.needs.length > 0;
    if (step === 4) return !!data.discovery;
    return false;
  };

  const progress = (step / total) * 100;

  const next = () => {
    if (step < total - 1) {
      setStep(step + 1);
    } else {
      setPrefs(data);
      setDone(true);

      setTimeout(() => {
        navigate({ to: "/dashboard" });
      }, 2200);
    }
  };

  const back = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const toggleMulti = (
    key: "domains" | "needs",
    value: string,
    max?: number
  ) => {
    const list = data[key];

    if (list.includes(value)) {
      setData({
        ...data,
        [key]: list.filter((item) => item !== value),
      });
    } else if (!max || list.length < max) {
      setData({
        ...data,
        [key]: [...list, value],
      });
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-hero-mesh flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="mx-auto w-16 h-16 rounded-full border-4 border-accent border-t-transparent animate-spin mb-6" />

          <h2 className="text-2xl font-bold mb-4">
            Building your dashboard…
          </h2>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="animate-slide-up">
              ⚡ Personalizing for you
            </p>

            <p
              className="animate-slide-up"
              style={{ animationDelay: "0.4s" }}
            >
              📚 Curating resources
            </p>

            <p
              className="animate-slide-up"
              style={{ animationDelay: "0.8s" }}
            >
              📡 Setting up your feed
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hero-mesh flex flex-col">
      <header className="px-6 py-5 flex items-center justify-between">
        <Logo />

        <span className="text-xs text-muted-foreground">
          Step {step + 1} of {total}
        </span>
      </header>

      <Progress
        value={progress}
        className="h-1 rounded-none"
      />

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <div
            key={step}
            className="bg-card border border-border rounded-2xl p-8 md:p-10 shadow-glow animate-slide-up"
          >
            {/* QUESTION 1 */}
            {step === 0 && (
              <>
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  Who are you right now?
                </h2>

                <div className="grid gap-3">
                  {Q1.map((o) => (
                    <Card
                      key={o.v}
                      selected={data.stage === o.v}
                      onClick={() =>
                        setData({
                          ...data,
                          stage: o.v,
                        })
                      }
                    >
                      <span className="text-2xl">{o.emoji}</span>
                      <span className="font-medium">{o.label}</span>
                    </Card>
                  ))}
                </div>
              </>
            )}

            {/* QUESTION 2 */}
            {step === 1 && (
              <>
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  What are you trying to achieve in the next 3 months?
                </h2>

                <div className="grid sm:grid-cols-2 gap-3">
                  {Q2.map((o) => (
                    <Card
                      key={o.v}
                      selected={data.goal === o.v}
                      onClick={() =>
                        setData({
                          ...data,
                          goal: o.v,
                        })
                      }
                    >
                      <span className="text-2xl">{o.emoji}</span>
                      <span className="font-medium">{o.label}</span>
                    </Card>
                  ))}
                </div>
              </>
            )}

            {/* QUESTION 3 */}
            {step === 2 && (
              <>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  What domains excite you the most?
                </h2>

                <p className="text-sm text-muted-foreground mb-6">
                  Pick up to 3 · {data.domains.length}/3 selected
                </p>

                <div className="flex flex-wrap gap-2">
                  {Q3.map((domain) => {
                    const selected = data.domains.includes(domain);

                    return (
                      <button
                        key={domain}
                        onClick={() =>
                          toggleMulti("domains", domain, 3)
                        }
                        className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                          selected
                            ? "bg-accent text-accent-foreground border-accent"
                            : "border-border hover:border-primary hover:text-primary"
                        }`}
                      >
                        {domain}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* QUESTION 4 */}
            {step === 3 && (
              <>
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  What do you need most right now?
                </h2>

                <div className="grid sm:grid-cols-2 gap-3">
                  {Q4.map((o) => (
                    <Card
                      key={o.v}
                      selected={data.needs.includes(o.v)}
                      onClick={() =>
                        toggleMulti("needs", o.v)
                      }
                    >
                      <span className="text-2xl">{o.emoji}</span>
                      <span className="font-medium text-sm">
                        {o.label}
                      </span>
                    </Card>
                  ))}
                </div>
              </>
            )}

            {/* QUESTION 5 */}
            {step === 4 && (
              <>
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  How do you prefer to discover resources?
                </h2>

                <div className="grid gap-3">
                  {Q5.map((o) => (
                    <Card
                      key={o.v}
                      selected={data.discovery === o.v}
                      onClick={() =>
                        setData({
                          ...data,
                          discovery: o.v,
                        })
                      }
                    >
                      <span className="text-2xl">{o.emoji}</span>
                      <span className="font-medium">{o.label}</span>
                    </Card>
                  ))}
                </div>
              </>
            )}

            {/* NAVIGATION */}
            <div className="flex items-center justify-between mt-8">
              <Button
                variant="ghost"
                onClick={back}
                disabled={step === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              <Button
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                disabled={!canNext()}
                onClick={next}
              >
                {step === total - 1 ? "Finish" : "Next"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Card({
  children,
  selected,
  onClick,
}: {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
        selected
          ? "bg-primary/10 border-primary shadow-glow"
          : "bg-background border-border hover:border-primary/60"
      }`}
    >
      {children}

      {selected && (
        <Check className="ml-auto w-5 h-5 text-accent" />
      )}
    </button>
  );
}