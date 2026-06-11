import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/edc/AppShell";
import { ResourceCard } from "@/components/edc/ResourceCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser, usePrefs } from "@/lib/edc/store";
import { Pencil, Calendar, CheckCircle2 } from "lucide-react";
import {
  whatsNew, pickedForYou, books, courses, reports, competitions,
  facilities, funders, pitchResources, mentors, deadlines,
  getPersonalizedPicks, getDefaultTab, getPersonalizedMentors, getPersonalizedFunders
} from "@/lib/edc/data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — eDC KnowledgeHub" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useUser();
  const { prefs } = usePrefs();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState<typeof mentors[number] | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const defaultTab = prefs ? getDefaultTab(prefs) : "learn";
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    const handler = (e: Event) => setActiveTab((e as CustomEvent).detail as string);
    window.addEventListener("edc:tab", handler);
    return () => window.removeEventListener("edc:tab", handler);
  }, []);

  if (!hydrated) return null;
  if (!user) return <Navigate to="/" />;
  if (user && !prefs) return <Navigate to="/onboarding" />;

  const stageLabel: Record<string, string> = {
    explorer: "Explorer", validator: "Validator", builder: "Builder",
    raiser: "Raising", follower: "Follower"
  };
  const stageChip = prefs?.stage ? `${stageLabel[prefs.stage] || prefs.stage} Stage` : null;
  const domainChips = prefs?.domains || [];

  const personalizedPicks = prefs ? getPersonalizedPicks(prefs) : pickedForYou;
  const personalizedMentors = prefs ? getPersonalizedMentors(prefs) : mentors;
  const personalizedFunders = prefs ? getPersonalizedFunders(prefs) : funders;

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-10">

        {/* Greeting */}
        <header className="animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-bold">Welcome, {user?.name?.split(" ")[0] || "Founder"}.</h1>
          <p className="text-muted-foreground mt-1">Here's what's relevant for you this week.</p>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            {stageChip && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-accent text-accent-foreground">{stageChip}</span>
            )}
            {domainChips.map(c => (
              <span key={c} className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/30">{c}</span>
            ))}
            <button
              onClick={() => navigate({ to: "/onboarding" })}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground ml-1"
            >
              <Pencil className="w-3 h-3" /> Edit preferences
            </button>
          </div>
        </header>

        {/* What's New — full width */}
        <section className="animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-soft" />
              <h2 className="text-xl font-bold">What's new this week</h2>
            </div>
            <span className="text-xs text-muted-foreground">Last updated: Today</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 md:-mx-0 px-4 md:px-8 snap-x">
            {whatsNew.map(r => (
              <div key={r.id} className="snap-start"><ResourceCard r={r} compact /></div>
            ))}
          </div>
        </section>

        {/* Picked for you + Sidebar side by side */}
        <div className="grid lg:grid-cols-[1fr_260px] gap-8 items-start animate-slide-up" style={{ animationDelay: "0.1s" }}>
          {/* Picked for you */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-accent">⚡</span>
              <h2 className="text-xl font-bold">Picked for you</h2>
            </div>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {personalizedPicks.map(r => <ResourceCard key={r.id} r={r} />)}
            </div>
          </section>

          {/* Sidebar — deadlines + digest */}
          <aside className="lg:sticky lg:top-8 self-start space-y-4">
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-accent" />
                <h3 className="font-bold">Upcoming Deadlines</h3>
              </div>
              <ul className="space-y-3">
                {deadlines.sort((a, b) => a.days - b.days).map(d => (
                  <li key={d.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{d.title}</p>
                      <div className="h-1 mt-1 rounded-full bg-secondary overflow-hidden">
                        <div
                          className={`h-full ${d.days <= 7 ? "bg-red-500" : d.days <= 14 ? "bg-accent" : "bg-primary"}`}
                          style={{ width: `${Math.max(8, 100 - d.days * 2)}%` }}
                        />
                      </div>
                    </div>
                    <span className={`text-xs font-bold shrink-0 ${d.days <= 7 ? "text-red-400" : d.days <= 14 ? "text-accent" : "text-muted-foreground"}`}>
                      {d.days}d
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-primary/20 to-accent/10 border border-border rounded-xl p-5">
              <CheckCircle2 className="w-5 h-5 text-accent mb-2" />
              <p className="font-semibold text-sm">Weekly digest</p>
              <p className="text-xs text-muted-foreground mt-1">Get curated funding & event alerts every Monday in your inbox.</p>
              <Button size="sm" className="mt-3 w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">Subscribe</Button>
            </div>
          </aside>
        </div>

        {/* Quick access — full width */}
        <section id="learn" className="animate-slide-up" style={{ animationDelay: "0.15s" }}>
          <h2 className="text-xl font-bold mb-4">Quick access</h2>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="learn">LEARN</TabsTrigger>
              <TabsTrigger value="startup">STARTUP</TabsTrigger>
              <TabsTrigger value="raise">RAISE</TabsTrigger>
            </TabsList>

            <TabsContent value="learn" className="mt-6 space-y-8">
              <Row title="Books">
                {books.map(b => <MiniCard key={b.id} emoji={b.emoji} title={b.title} sub={b.author} />)}
              </Row>
              <Row title="Courses">
                {courses.map(c => <MiniCard key={c.id} emoji={c.emoji} title={c.title} sub={c.desc} cta="Enroll" />)}
              </Row>
              <Row title="Industry Reports">
                {reports.map(r => <MiniCard key={r.id} emoji={r.emoji} title={r.title} sub={r.year} badge={r.year} />)}
              </Row>
            </TabsContent>

            <TabsContent value="startup" id="startup" className="mt-6 space-y-8">
              <Row title="Competitions">
                {competitions.map(c => (
                  <div key={c.id} className="card-lift bg-card border border-border rounded-xl p-4 w-64 shrink-0">
                    <div className="text-2xl mb-2">{c.emoji}</div>
                    <h4 className="font-semibold">{c.title}</h4>
                    <p className="text-xs text-muted-foreground">{c.prize}</p>
                    <span className={`mt-3 inline-block text-[10px] font-bold px-2 py-1 rounded-full ${c.deadline <= 7 ? "bg-red-500/15 text-red-300" : "bg-accent/15 text-accent"}`}>
                      {c.deadline} days left
                    </span>
                  </div>
                ))}
              </Row>
              <Row title="Campus Facilities (IITD Exclusive)">
                {facilities.map(f => <MiniCard key={f.id} emoji={f.emoji} title={f.title} sub={f.desc} badge="IITD" />)}
              </Row>
              <Row title="Institutional Connects">
                <MiniCard emoji="🤝" title="i-TTO" sub="Tech Transfer Office" badge="IITD" />
                <MiniCard emoji="🔬" title="R&D Partnerships" sub="Industry collaboration" badge="IITD" />
                <MiniCard emoji="🏭" title="Makerspace" sub="Hardware lab" badge="IITD" />
              </Row>
            </TabsContent>

            <TabsContent value="raise" id="raise" className="mt-6 space-y-8">
              <Row title="Funders, Grants & Accelerators">
                {personalizedFunders.map(f => (
                  <div key={f.id} className="card-lift bg-card border border-border rounded-xl p-4 w-64 shrink-0">
                    <div className="text-2xl mb-2">{f.emoji}</div>
                    <h4 className="font-semibold">{f.title}</h4>
                    <p className="text-sm text-accent font-bold mt-1">{f.amount}</p>
                    <p className="text-xs text-muted-foreground mt-1">{f.stage}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[10px] text-muted-foreground">{f.deadline}</span>
                      <button className="text-xs font-semibold text-accent hover:underline">Apply</button>
                    </div>
                  </div>
                ))}
              </Row>
              <Row title="Pitch Resources">
                {pitchResources.map(p => <MiniCard key={p.id} emoji={p.emoji} title={p.title} sub="Free download" cta="Download" />)}
              </Row>
            </TabsContent>
          </Tabs>
        </section>

        {/* Mentorship — full width */}
        <section className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-2 mb-4">
            <span>🎙️</span>
            <h2 className="text-xl font-bold">Mentorship</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {personalizedMentors.map(m => (
              <div key={m.id} className="card-lift bg-card border border-border rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-background">{m.initials}</div>
                  <div>
                    <h4 className="font-semibold">{m.name}</h4>
                    <p className="text-xs text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />{m.status}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {m.expertise.map(t => <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-secondary">{t}</span>)}
                </div>
                <Button onClick={() => setMentor(m)} variant="outline" className="w-full">Book a Session</Button>
              </div>
            ))}
          </div>
        </section>

      </div>

      <Dialog open={!!mentor} onOpenChange={(o) => !o && setMentor(null)}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Book a session with {mentor?.name}</DialogTitle>
            <DialogDescription>{mentor?.expertise.join(" · ")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label>Topic</Label><Input placeholder="What would you like to discuss?" /></div>
            <div><Label>Preferred date</Label><Input type="date" /></div>
            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold" onClick={() => setMentor(null)}>
              Request booking
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wider">{title}</h3>
      <div className="flex gap-4 overflow-x-auto pb-3">{children}</div>
    </div>
  );
}

function MiniCard({ emoji, title, sub, cta, badge }: { emoji: string; title: string; sub: string; cta?: string; badge?: string }) {
  return (
    <div className="card-lift bg-card border border-border rounded-xl p-4 w-56 shrink-0 flex flex-col">
      <div className="text-2xl mb-2">{emoji}</div>
      <h4 className="font-semibold leading-snug">{title}</h4>
      <p className="text-xs text-muted-foreground mt-1 flex-1">{sub}</p>
      <div className="flex items-center justify-between mt-3">
        {badge && <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-accent/15 text-accent">{badge}</span>}
        <button className="text-xs font-semibold text-accent hover:underline ml-auto">{cta || "Open"}</button>
      </div>
    </div>
  );
} 