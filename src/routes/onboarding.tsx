import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { usePrefs, type Preferences } from "@/lib/edc/store";
import { Logo } from "@/components/edc/Logo";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Personalize your dashboard — eDC KnowledgeHub" }] }),
  component: Onboarding,
});

const Q1 = [
  { v: "explorer", emoji: "🎓", label: "Student exploring startups for the first time" },
  { v: "validator", emoji: "💡", label: "I have an idea and want to validate it" },
  { v: "builder", emoji: "🛠️", label: "I'm building something — need tools and connects" },
  { v: "raiser", emoji: "📈", label: "I'm raising funding or looking for investors" },
  { v: "follower", emoji: "🔁", label: "Just here to stay updated on the ecosystem" },
];
const Q2 = ["1st Year", "2nd Year", "3rd Year", "4th Year", "MTech/PhD", "Alumni"];
const Q3 = ["DeepTech", "Fintech", "Climate", "HealthTech", "EdTech", "Consumer", "SaaS/B2B", "Social Impact", "Hardware/IoT", "AI/ML"];
const Q4 = [
  { v: "learn", emoji: "📚", label: "Books, courses, learning resources" },
  { v: "funding", emoji: "💰", label: "Funding opportunities and grants" },
  { v: "mentor", emoji: "🤝", label: "Mentorship and expert connects" },
  { v: "compete", emoji: "🏆", label: "Competitions and programs" },
  { v: "labs", emoji: "🏭", label: "Lab/facility access (Makerspace, i-TTO)" },
  { v: "reports", emoji: "📊", label: "Industry reports and market research" },
];
const Q5 = ["Show me what's new this week", "Recommend based on my stage", "Let me browse everything", "A mix of all"];

function Onboarding() {
  const navigate = useNavigate();
  const { setPrefs } = usePrefs();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [data, setData] = useState<Preferences>({ domains: [], needs: [] });

  const total = 5;
  const progress = ((step + 1) / total) * 100;

  const next = () => {
    if (step < total - 1) setStep(step + 1);
    else {
      setPrefs(data);
      setDone(true);
      setTimeout(() => navigate({ to: "/dashboard" }), 2200);
    }
  };
  const back = () => step > 0 && setStep(step - 1);

  const canNext = () => {
    if (step === 0) return !!data.stage;
    if (step === 1) return !!data.year;
    if (step === 2) return data.domains.length > 0;
    if (step === 3) return data.needs.length > 0;
    if (step === 4) return !!data.discovery;
    return false;
  };

  const toggleMulti = (key: "domains" | "needs", v: string, max?: number) => {
    const list = data[key];
    if (list.includes(v)) setData({ ...data, [key]: list.filter(x => x !== v) });
    else if (!max || list.length < max) setData({ ...data, [key]: [...list, v] });
  };

  if (done) {
    return (
      <div className="min-h-screen bg-hero-mesh flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="mx-auto w-16 h-16 rounded-full border-4 border-accent border-t-transparent animate-spin mb-6" />
          <h2 className="text-2xl font-bold mb-4">Building your dashboard…</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="animate-slide-up">⚡ Personalizing for you</p>
            <p className="animate-slide-up" style={{ animationDelay: "0.4s" }}>📚 Curating resources</p>
            <p className="animate-slide-up" style={{ animationDelay: "0.8s" }}>📡 Setting up your feed</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hero-mesh flex flex-col">
      <header className="px-6 py-5 flex items-center justify-between">
        <Logo />
        <span className="text-xs text-muted-foreground">Step {step + 1} of {total}</span>
      </header>
      <Progress value={progress} className="h-1 rounded-none" />
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <div key={step} className="bg-card border border-border rounded-2xl p-8 md:p-10 shadow-glow animate-slide-up">
            {step === 0 && (
              <>
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Who are you right now?</h2>
                <div className="grid gap-3">
                  {Q1.map(o => (
                    <Card key={o.v} selected={data.stage === o.v} onClick={() => setData({ ...data, stage: o.v })}>
                      <span className="text-2xl">{o.emoji}</span>
                      <span className="font-medium">{o.label}</span>
                    </Card>
                  ))}
                </div>
              </>
            )}
            {step === 1 && (
              <>
                <h2 className="text-2xl md:text-3xl font-bold mb-6">What's your year at IIT Delhi?</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Q2.map(y => (
                    <Card key={y} selected={data.year === y} onClick={() => setData({ ...data, year: y })}>
                      <span className="font-medium">{y}</span>
                    </Card>
                  ))}
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">What domains excite you most?</h2>
                <p className="text-sm text-muted-foreground mb-6">Pick up to 3 · {data.domains.length}/3 selected</p>
                <div className="flex flex-wrap gap-2">
                  {Q3.map(d => {
                    const on = data.domains.includes(d);
                    return (
                      <button key={d} onClick={() => toggleMulti("domains", d, 3)} className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${on ? "bg-accent text-accent-foreground border-accent" : "border-border hover:border-primary hover:text-primary"}`}>
                        {d}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <h2 className="text-2xl md:text-3xl font-bold mb-6">What do you need most right now?</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {Q4.map(o => (
                    <Card key={o.v} selected={data.needs.includes(o.v)} onClick={() => toggleMulti("needs", o.v)}>
                      <span className="text-2xl">{o.emoji}</span>
                      <span className="font-medium text-sm">{o.label}</span>
                    </Card>
                  ))}
                </div>
              </>
            )}
            {step === 4 && (
              <>
                <h2 className="text-2xl md:text-3xl font-bold mb-6">How do you prefer to discover resources?</h2>
                <div className="grid gap-3">
                  {Q5.map(o => (
                    <Card key={o} selected={data.discovery === o} onClick={() => setData({ ...data, discovery: o })}>
                      <span className="font-medium">{o}</span>
                    </Card>
                  ))}
                </div>
              </>
            )}

            <div className="flex items-center justify-between mt-8">
              <Button variant="ghost" onClick={back} disabled={step === 0}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold" disabled={!canNext()} onClick={next}>
                {step === total - 1 ? "Finish" : "Next"} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Card({ children, selected, onClick }: { children: React.ReactNode; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`relative flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${selected ? "bg-primary/10 border-primary shadow-glow" : "bg-background border-border hover:border-primary/60"}`}>
      {children}
      {selected && <Check className="ml-auto w-5 h-5 text-accent" />}
    </button>
  );
}