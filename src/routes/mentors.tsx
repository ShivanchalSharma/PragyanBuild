import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/edc/AppShell";
import { NeuralBackground } from "@/components/edc/NeuralBackground";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser, usePrefs } from "@/lib/edc/store";
import { Mic, Star, Users, Rocket, Quote } from "lucide-react";
import { mentors, getPersonalizedMentors } from "@/lib/edc/data";

export const Route = createFileRoute("/mentors")({
  head: () => ({ meta: [{ title: "Mentors — eDC KnowledgeHub" }] }),
  component: MentorsPage,
});

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[0, 1, 2, 3, 4].map(i => (
        <Star key={i} className={`w-3 h-3 ${i < Math.round(rating) ? "fill-accent text-accent" : "text-muted-foreground/40"}`} />
      ))}
      <span className="text-xs font-semibold text-foreground ml-1">{rating.toFixed(1)}</span>
    </span>
  );
}

const MENTOR_DETAILS: Record<string, { bio: string; rating: number; sessions: number; quote: string; quoteBy: string }> = {
  m1: { bio: "Ex-DRDO researcher turned deeptech founder. Raised a pre-seed for a robotics startup out of IIT Delhi.", rating: 4.9, sessions: 128, quote: "Rohan cut through months of confusion in a single call.", quoteBy: "3rd-year founder" },
  m2: { bio: "Scaled a consumer app past 1M users. Now angel-invests in student-led D2C and growth plays.", rating: 4.8, sessions: 96, quote: "Her growth playbook doubled our signups in three weeks.", quoteBy: "Consumer founder" },
  m3: { bio: "Built and sold a B2B SaaS company. Lives for GTM, pricing, and landing the first enterprise logos.", rating: 5.0, sessions: 74, quote: "Vikram made our pitch finally click with real buyers.", quoteBy: "SaaS founder" },
};

function MentorsPage() {
  const { user } = useUser();
  const { prefs } = usePrefs();
  const [mentor, setMentor] = useState<typeof mentors[number] | null>(null);

  const domainChips = prefs?.domains || [];
  const personalizedMentors = prefs ? getPersonalizedMentors(prefs) : mentors;

  const mentorReason = (m: typeof mentors[number]) => {
    const match = m.expertise.find(e => domainChips.some(d => e.toLowerCase().includes(d.toLowerCase()) || d.toLowerCase().includes(e.toLowerCase())));
    return match ? `Matched to your ${match} focus` : `${m.expertise[0]} specialist`;
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
        
        {/* ── Hero Container ── */}
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 md:p-8">
          <NeuralBackground className="opacity-50" />
          {/* Main outer glow: Indigo top-left sweeping to Accent bottom-right */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/15 via-transparent to-accent/15 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {/* Updated Icon Container with Indigo/Blue Theme */}
                <span className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <Mic className="w-5 h-5 text-indigo-400" />
                </span>
                <h1 className="text-3xl font-bold">Mentors</h1>
              </div>
              <p className="text-sm text-muted-foreground max-w-xl mb-8">
                Book 1:1 sessions with experienced founders and operators. Find the exact expertise you need to unblock your startup.
              </p>

              <div className="flex flex-wrap gap-4">
                {/* Stat Box 1 */}
                <div className="bg-background/50 border border-border rounded-2xl p-4 min-w-[140px]">
                  <Users className="w-5 h-5 text-accent mb-2" />
                  <div className="text-2xl font-bold">{personalizedMentors.length}</div>
                  <div className="text-xs text-muted-foreground mt-1">available mentors</div>
                </div>
                
                {/* Stat Box 2 */}
                <div className="bg-background/50 border border-border rounded-2xl p-4 min-w-[140px]">
                  <Rocket className="w-5 h-5 text-accent mb-2" />
                  <div className="text-2xl font-bold">99+</div>
                  <div className="text-xs text-muted-foreground mt-1">startups guided</div>
                </div>
                
                {/* Stat Box 3 */}
                <div className="bg-background/50 border border-border rounded-2xl p-4 min-w-[140px]">
                  <Star className="w-5 h-5 text-accent mb-2" />
                  <div className="text-2xl font-bold">4.9</div>
                  <div className="text-xs text-muted-foreground mt-1">average rating</div>
                </div>
              </div>
            </div>

            {/* Quote Box */}
            <div className="rounded-2xl border border-border bg-background/40 p-6 md:p-8 max-w-sm shrink-0 flex flex-col justify-center">
              <Quote className="w-6 h-6 text-accent mb-4 fill-accent/20" />
              <p className="text-lg font-semibold leading-snug mb-3">
                "A good mentor doesn't give you the answers, they help you ask the right questions."
              </p>
              <p className="text-sm text-muted-foreground">— Mentor wisdom</p>
            </div>
          </div>
        </section>

        {/* ── Mentor Cards ── */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {personalizedMentors.map(m => {
            const d = MENTOR_DETAILS[m.id];
            return (
              <div key={m.id} className="card-lift bg-card border border-border rounded-2xl p-6 flex flex-col">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-background shrink-0">{m.initials}</div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold leading-tight">{m.name}</h4>
                    {d && <div className="mt-1"><Stars rating={d.rating} /></div>}
                  </div>
                </div>
                <p className="text-xs text-accent font-medium border-l-2 border-accent/40 pl-2 mb-3">{mentorReason(m)}</p>
                {d && <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-3">{d.bio}</p>}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {m.expertise.map(t => <span key={t} className="text-[10px] font-medium px-2 py-1 rounded bg-secondary">{t}</span>)}
                </div>
                {d && (
                  <div className="rounded-xl bg-secondary/40 border border-border p-3 mb-4">
                    <p className="text-xs italic text-foreground leading-relaxed">"{d.quote}"</p>
                    <p className="text-[10px] text-muted-foreground mt-1.5">— {d.quoteBy}</p>
                  </div>
                )}
                <div className="flex items-center justify-between mt-auto pt-1">
                  <span className="text-xs text-muted-foreground">{d && <><span className="font-semibold text-foreground">{d.sessions}</span> sessions</>}</span>
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />{m.status}</span>
                </div>
                <Button onClick={() => setMentor(m)} variant="outline" className="w-full mt-3 hover:bg-accent hover:text-accent-foreground hover:border-accent">Book a Session</Button>
              </div>
            );
          })}
        </div>

        {/* ── Booking Dialog ── */}
        <Dialog open={!!mentor} onOpenChange={(o) => !o && setMentor(null)}>
          <DialogContent className="bg-card">
            <DialogHeader>
              <DialogTitle>Book a session with {mentor?.name}</DialogTitle>
              <DialogDescription>{mentor?.expertise.join(" · ")}</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              <div><Label>Topic</Label><Input placeholder="What would you like to discuss?" className="mt-1.5" /></div>
              <div><Label>Preferred date</Label><Input type="date" className="mt-1.5" /></div>
              {(user?.pitch || user?.link) && (
                <div className="rounded-lg border border-border bg-secondary/30 p-3 mt-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Shared with {mentor?.name}</p>
                  {user?.pitch && <p className="text-xs text-foreground">{user.pitch}</p>}
                  {user?.link && <p className="text-xs text-accent mt-1 truncate">{user.link}</p>}
                </div>
              )}
              <Button className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold" onClick={() => setMentor(null)}>Request booking</Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </AppShell>
  );
}