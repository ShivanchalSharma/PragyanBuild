import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AppShell } from "@/components/edc/AppShell";
import { NeuralBackground } from "@/components/edc/NeuralBackground";
import { ScrollReveal } from "@/components/edc/ScrollReveal";
import { useUser, usePrefs } from "@/lib/edc/store";
import { useState, useEffect } from "react";
import { TiltCard } from "@/components/edc/TiltCard";
import {
  MapPinned, Milestone, Landmark, Layers, FileText, TrendingUp, Users,
  CheckCircle2, Circle, ExternalLink, Info, ChevronRight, Sparkles, ArrowUpRight, type LucideIcon,
} from "lucide-react";

export const Route = createFileRoute("/bharat")({
  head: () => ({ meta: [{ title: "Bharat — eDC KnowledgeHub" }] }),
  component: BharatPage,
});

// ── 1. India Startup Journey ────────────────────────────────────────────────
// each step is tagged with the founder STAGE it typically belongs to, so its
// status (done / relevant now / comes later) can be computed against the
// USER'S actual progress instead of a generic, out-of-context label.
const STAGE_ORDER = ["explorer", "validator", "builder", "raiser", "follower"];

// 0-indexed position of "you are here" on the 10-step rail below.
// 5 = "DPIIT Recognition" (the 6th step) — change this number to move it.
const JOURNEY_CURRENT_INDEX = 5;

const JOURNEY = [
  { id: "idea", label: "Idea", stage: "explorer", desc: "Just exploring? You need nothing formal yet — talk to users, sketch the problem." },
  { id: "validation", label: "Validation", stage: "explorer", desc: "Confirm real demand before spending on paperwork or incorporation." },
  { id: "mvp", label: "MVP", stage: "validator", desc: "Build the smallest working version. Still no registration required." },
  { id: "incorporation", label: "Incorporation", stage: "builder", desc: "Register as a Private Limited Company or LLP once you have co-founders and real traction to protect." },
  { id: "dpiit", label: "DPIIT Recognition", stage: "builder", desc: "Apply via Startup India — unlocks tax benefits, self-certification, and scheme eligibility." },
  { id: "startupindia", label: "Startup India", stage: "builder", desc: "Register on the national portal to access the full scheme ecosystem." },
  { id: "ip", label: "IP / Trademark", stage: "builder", desc: "File once you have a defensible product or brand worth protecting." },
  { id: "incubator", label: "Incubator", stage: "builder", desc: "Apply when you need structured mentorship, workspace, or an early cheque." },
  { id: "grants", label: "Grants", stage: "raiser", desc: "Apply once DPIIT-recognised — most grants require this first." },
  { id: "preseed", label: "Angel / Pre-seed", stage: "raiser", desc: "Raise once you have a validated MVP and early signs of traction." },
];

// ── 2. Government schemes ───────────────────────────────────────────────────
interface Scheme { id: string; name: string; body: string; support: string; stage: string; eligibility: string[]; note?: string }
const SCHEMES: Scheme[] = [
  { id: "s1", name: "Startup India Seed Fund Scheme (SISFS)", body: "DPIIT, Govt. of India", support: "Up to ₹20L grant + ₹50L convertible debt", stage: "Idea / Validation", eligibility: ["DPIIT recognised", "Incorporated < 2 years", "Indian-owned"] },
  { id: "s2", name: "NIDHI-PRAYAS", body: "DST, Govt. of India", support: "Up to ₹10L for prototyping", stage: "Idea / Prototype", eligibility: ["Innovative tech idea", "Prototype-stage", "No incorporation required to apply"] },
  { id: "s3", name: "Atal Innovation Mission — AIC", body: "NITI Aayog", support: "Incubation + funding via Atal Incubation Centres", stage: "Idea / MVP", eligibility: ["Innovation-led venture", "Access via an AIM-empanelled incubator"] },
  { id: "s4", name: "Stand-Up India", body: "Dept. of Financial Services", support: "₹10L – ₹1Cr bank loans", stage: "Incorporation+", eligibility: ["SC/ST or woman entrepreneur", "Greenfield enterprise", "Non-individual borrower ≥51% held by eligible category"] },
  { id: "s5", name: "MSME PMEGP", body: "Ministry of MSME", support: "Subsidy up to 35% of project cost", stage: "Incorporation+", eligibility: ["Manufacturing or service venture", "New enterprise", "Age 18+"] },
];

// ── 3. Bharat Stack — India's digital public infrastructure ────────────────
const STACK = [
  { id: "upi", name: "UPI", desc: "Real-time payments infrastructure — instant, low-cost transactions.", who: "Any consumer or B2B payments product." },
  { id: "ondc", name: "ONDC", desc: "Open, decentralised network for e-commerce — no platform lock-in.", who: "D2C, retail, and marketplace startups." },
  { id: "aa", name: "Account Aggregator", desc: "Consent-based sharing of financial data across institutions.", who: "Fintech, lending, and wealth products." },
  { id: "ocen", name: "OCEN", desc: "Open protocol connecting lenders with loan-seekers digitally.", who: "Embedded credit and lending platforms." },
  { id: "digilocker", name: "DigiLocker", desc: "Verified digital documents — ID, certificates, records.", who: "KYC-heavy products: fintech, edtech, healthtech." },
  { id: "abdm", name: "ABDM", desc: "India's digital health ecosystem — unified health records.", who: "Healthtech and telemedicine startups." },
];

// ── 4. Founding documents ───────────────────────────────────────────────────
interface DocItem { id: string; name: string; desc: string; stage: "Idea" | "Incorporation" | "Growth" }
// ordered chronologically — the first document you'll actually need, first.
const DOCS: DocItem[] = [
  { id: "d3", name: "Co-founder Agreement", desc: "Equity split, roles, vesting schedule, and — critically — the exit clause if a co-founder leaves early. Do this before incorporation, ideally before you write any code.", stage: "Idea" },
  { id: "d1", name: "Certificate of Incorporation", desc: "Legal proof your company exists — issued by the Registrar of Companies.", stage: "Incorporation" },
  { id: "d2", name: "MOA & AOA", desc: "Memorandum & Articles of Association — define your company's purpose and internal rules.", stage: "Incorporation" },
  { id: "d5", name: "PAN & TAN", desc: "Tax identity for the company — required before opening a bank account or hiring.", stage: "Incorporation" },
  { id: "d4", name: "IP Assignment Agreement", desc: "Ensures any IP built by founders/employees legally belongs to the company, not the individual.", stage: "Incorporation" },
  { id: "d7", name: "DPIIT Recognition Certificate", desc: "Unlocks tax exemptions, self-certification, and scheme eligibility.", stage: "Incorporation" },
  { id: "d6", name: "GST Registration", desc: "Mandatory once turnover crosses the threshold, or for most B2B billing.", stage: "Growth" },
  { id: "d8", name: "ESOP Pool Documentation", desc: "Formalises equity set aside for future hires — set this up before you need it.", stage: "Growth" },
];
const STAGE_TAG: Record<DocItem["stage"], string> = {
  Idea: "bg-sky-500/10 text-sky-300 border-sky-500/25",
  Incorporation: "bg-accent/10 text-accent border-accent/25",
  Growth: "bg-emerald-500/10 text-emerald-300 border-emerald-500/25",
};

// ── 5. India market insights ────────────────────────────────────────────────
const MARKET_INSIGHTS = [
  { stat: "63M+", label: "MSMEs in India", desc: "A massive, digitising base for B2B and vertical SaaS — most still run on WhatsApp and spreadsheets today." },
  { stat: "900M+", label: "Internet users", desc: "Fast-growing beyond metros — the next 200M users will come from Tier 2/3 cities, not Delhi or Bengaluru." },
  { stat: "UPI-first", label: "Payment behaviour", desc: "Cash and card habits are being replaced by UPI — build payment flows around it, not around cards." },
  { stat: "GST era", label: "Formalisation wave", desc: "GST is pushing millions of informal businesses into the digital economy — a real wedge for B2B tools." },
];

// domain-specific reality check — opportunity + the honest challenge that
// comes with it, so this reads as genuinely useful, not filler stats.
interface DomainInsight { domain: string; opportunity: string; challenge: string }
const DOMAIN_INSIGHTS: Record<string, DomainInsight> = {
  DeepTech: { domain: "DeepTech", opportunity: "Govt. grants (NIDHI-PRAYAS, BIRAC) specifically target deep tech — funding exists before revenue does.", challenge: "Long R&D cycles mean you need patient capital and grant-stacking, not a typical VC seed round." },
  Fintech: { domain: "Fintech", opportunity: "India Stack (UPI, Account Aggregator, OCEN) lets you build on infrastructure that took other countries a decade to create.", challenge: "RBI regulation is strict and evolving — compliance cost is real, budget for it early." },
  Climate: { domain: "Climate", opportunity: "India's net-zero commitments are unlocking climate-specific funds like Build3 and government EV/solar incentives.", challenge: "Hardware-adjacent climate ventures need longer runways than pure software climate plays." },
  HealthTech: { domain: "HealthTech", opportunity: "ABDM (Ayushman Bharat Digital Mission) gives you a unified health-record layer to build on nationally.", challenge: "Trust and clinical validation matter more than in most sectors — expect a longer sales cycle." },
  EdTech: { domain: "EdTech", opportunity: "Regional-language content and vernacular onboarding are still wide open — most EdTech is still English-first.", challenge: "Post-2022, Indian consumers are far more price-sensitive about EdTech subscriptions than before." },
  Consumer: { domain: "Consumer", opportunity: "ONDC removes the platform-lock-in problem — you can reach customers without paying Amazon-style commissions.", challenge: "Customer acquisition cost in metros is now comparable to the US — Tier 2/3 distribution is the real edge." },
  "SaaS/B2B": { domain: "SaaS/B2B", opportunity: "63M+ MSMEs are digitising right now — vertical, India-specific B2B tools have almost no incumbent competition.", challenge: "Indian SMBs expect ₹-priced, WhatsApp-supported, assisted-sales software — a US SaaS playbook won't convert." },
  "Social Impact": { domain: "Social Impact", opportunity: "CSR mandates (2% of profit) create a real, recurring funding pool most founders never tap into.", challenge: "Impact measurement and reporting overhead is real — build it into your model from day one." },
  "Hardware/IoT": { domain: "Hardware/IoT", opportunity: "PLI (Production Linked Incentive) schemes are actively subsidising India-manufactured hardware.", challenge: "Manufacturing and supply chain in India still lags China on speed — plan longer prototype-to-production timelines." },
  "AI/ML": { domain: "AI/ML", opportunity: "Bhashini and other government language-AI missions are funding India-specific, multilingual AI work directly.", challenge: "GPU compute access and cost remain a real bottleneck outside the big cloud providers." },
};
const DEFAULT_DOMAINS = ["SaaS/B2B", "Consumer", "Fintech"];

// ── 6. India founder stories ─────────────────────────────────────────────────
const STORIES = [
  { name: "Zoho", strategy: "Bootstrapped", lesson: "Grew a global SaaS suite for two decades without external funding — profitability funded every stage of growth." },
  { name: "Zerodha", strategy: "Bootstrapped", lesson: "Kept the team lean and pricing simple, proving a capital-light fintech can out-execute funded competitors." },
  { name: "Freshworks", strategy: "Product-led, then global", lesson: "Started by serving underserved SMB customers before expanding into enterprise and going global." },
  { name: "Ather Energy", strategy: "Hardware-first", lesson: "Built manufacturing and R&D in-house from day one — a reminder that hardware startups need patient, deep capital." },
  { name: "Razorpay", strategy: "Infrastructure-first", lesson: "Solved a boring, unglamorous problem (payment gateways) exceptionally well before expanding into a full stack." },
  { name: "Meesho", strategy: "Built for Bharat", lesson: "Designed distribution around WhatsApp and social reselling instead of assuming a Western e-commerce playbook." },
];

const SECTIONS = [
  { id: "journey", label: "Startup Journey", Icon: Milestone },
  { id: "schemes", label: "Govt. Schemes", Icon: Landmark },
  { id: "stack", label: "Bharat Stack", Icon: Layers },
  { id: "docs", label: "Documents", Icon: FileText },
  { id: "market", label: "Market Insights", Icon: TrendingUp },
  { id: "stories", label: "Founder Stories", Icon: Users },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function useCountUp(target: number, ms = 900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0; const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / ms, 1);
      setV(Math.round((1 - Math.pow(1 - t, 3)) * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

function BharatPage() {
  const { user } = useUser();
  const { prefs } = usePrefs();
  const [hydrated, setHydrated] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("journey");

  useEffect(() => setHydrated(true), []);

  // scrollspy — highlight whichever section pill matches what's on screen
  useEffect(() => {
    const els = SECTIONS.map(s => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    if (els.length === 0) return;
    const obs = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [hydrated]);

  const nSchemes = useCountUp(SCHEMES.length);
  const nStack = useCountUp(STACK.length);
  const nDocs = useCountUp(DOCS.length);
  const nStories = useCountUp(STORIES.length);

  if (!hydrated) return null;
  if (!user) return <Navigate to="/" />;

  const currentIdx = Math.max(0, STAGE_ORDER.indexOf(prefs?.stage || "explorer"));

  const matchedDomains = (prefs?.domains || []).filter(d => DOMAIN_INSIGHTS[d]);
  const domainInsights = (matchedDomains.length ? matchedDomains : DEFAULT_DOMAINS)
    .slice(0, 3)
    .map(d => DOMAIN_INSIGHTS[d])
    .filter(Boolean);

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-12">

        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 md:p-8">
          <NeuralBackground className="opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-br from-accent/15 via-transparent to-emerald-500/10 pointer-events-none" />
          {/* tricolor thread — rendered ABOVE NeuralBackground (which paints its own
              top fade-to-background overlay) so it's no longer masked/invisible */}
          <div className="absolute top-0 left-0 right-0 h-[5px] bg-gradient-to-r from-orange-400 via-white to-emerald-500 z-[1]" />
          {/* slow-rotating dotted ring behind the icon — quiet motion, not kitsch */}
          <div className="absolute left-6 top-6 w-24 h-24 pointer-events-none opacity-30">
            <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_18s_linear_infinite]">
              <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 6" className="text-accent" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-6 justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1.5">
              <span className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center"><MapPinned className="w-5 h-5 text-accent" /></span>
              <h1 className="text-3xl md:text-4xl font-bold">Bharat</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Global ambition, built with the realities of Bharat in mind — the journey, the schemes, the infrastructure, and the paperwork every Indian founder actually needs.
            </p>

            {/* count-up stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 max-w-xl">
              {[
                { v: nSchemes, label: "govt. schemes" },
                { v: nStack, label: "digital rails" },
                { v: nDocs, label: "documents covered" },
                { v: nStories, label: "founder stories" },
              ].map((s, i) => (
                <div key={i} className="bg-card/60 backdrop-blur border border-border rounded-2xl p-3.5">
                  <div className="text-xl font-bold leading-none text-accent">{s.v}</div>
                  <div className="text-[11px] text-muted-foreground mt-1.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* quick-jump — highlights the section currently on screen */}
            <div className="flex flex-wrap gap-2 mt-6">
              {SECTIONS.map(s => {
                const active = activeSection === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                      active
                        ? "bg-accent/15 border-accent/40 text-accent"
                        : "bg-card/70 border-border hover:border-accent/40 hover:text-accent"
                    }`}
                  >
                    <s.Icon className="w-3.5 h-3.5" /> {s.label}
                  </button>
                );
              })}
            </div>
          </div>

            {/* big round flag badge — right side of the hero */}
            <div className="hidden lg:flex w-70 shrink-0 items-center justify-center">
              <svg viewBox="0 0 40 40" className="w-64 h-64 drop-shadow-lg" aria-label="Bharat">
                <defs>
                  <clipPath id="roundFlagClip"><circle cx="20" cy="20" r="18" /></clipPath>
                </defs>
                <g clipPath="url(#roundFlagClip)">
                  <rect x="0" y="0" width="40" height="13.4" fill="#FF9933" />
                  <rect x="0" y="13.4" width="40" height="13.2" fill="#FFFFFF" />
                  <rect x="0" y="26.6" width="40" height="13.4" fill="#138808" />
                  <circle cx="20" cy="20" r="4.2" fill="none" stroke="#0B3D91" strokeWidth="0.6" />
                  {Array.from({ length: 24 }).map((_, i) => (
                    <line key={i} x1="20" y1="20" x2={20 + 4.2 * Math.cos((i * Math.PI) / 12)} y2={20 + 4.2 * Math.sin((i * Math.PI) / 12)} stroke="#0B3D91" strokeWidth="0.35" />
                  ))}
                </g>
                <circle cx="20" cy="20" r="18" fill="none" stroke="var(--border)" strokeWidth="1" />
              </svg>
            </div>
          </div>
        </section>

        {/* 1. India Startup Journey */}
        <ScrollReveal>
          <section id="journey" className="scroll-mt-20 bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center"><Milestone className="w-4 h-4 text-accent" /></span>
              <h2 className="text-xl font-bold">India Startup Journey</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6 ml-[42px]">The India-specific operational track — with an honest answer to "do I need this now?"</p>

            {/* connected rail — a tricolor thread runs behind each step,
                so the journey reads as one continuous path, not a bare list */}
            <div className="relative">
              <div className="absolute left-[13px] top-2 bottom-2 w-[2.5px] rounded-full bg-gradient-to-b from-orange-400 via-accent/60 to-emerald-500" />
              <div className="space-y-2.5">
                {JOURNEY.map((j, i) => {
                  const done = i < JOURNEY_CURRENT_INDEX;
                  const current = i === JOURNEY_CURRENT_INDEX;
                  const statusLabel = done ? "You've likely done this" : current ? "Relevant right now" : "Comes later";
                  const statusStyle = done
                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                    : current
                      ? "bg-accent/15 text-accent border-accent/30"
                      : "bg-secondary text-muted-foreground border-border";
                  return (
                    <div key={j.id} className="relative flex items-start gap-4 pl-0">
                      <span className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border-2 border-background transition-transform hover:scale-110 ${
                        done ? "bg-emerald-500 text-white" : current ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"
                      }`}>
                        {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                      </span>
                      <div className={`min-w-0 flex-1 rounded-xl border p-4 transition-colors ${
                        current ? "border-accent/40 bg-accent/[0.05]" : done ? "border-emerald-500/20 bg-background" : "border-border bg-background hover:border-accent/20"
                      }`}>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-sm">{j.label}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusStyle}`}>{statusLabel}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{j.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* 2. Government Schemes */}
        <ScrollReveal>
          <section id="schemes" className="scroll-mt-20">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"><Landmark className="w-4 h-4 text-emerald-300" /></span>
              <h2 className="text-xl font-bold">Government Schemes</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-5 ml-[42px]">Figures and eligibility are indicative — always confirm on the official scheme portal before applying.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SCHEMES.map((s, i) => (
                <TiltCard key={s.id} className="animate-slide-up h-full">
                <div style={{ animationDelay: `${i * 0.06}s` }} className="card-lift bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 h-full">
                  <div className="w-11 h-11 rounded-xl border bg-emerald-500/10 border-emerald-500/20 text-emerald-300 flex items-center justify-center"><Landmark className="w-5 h-5" /></div>
                  <div className="flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{s.body}</span>
                    <h4 className="font-semibold leading-snug mt-1">{s.name}</h4>
                    <p className="text-sm font-bold text-accent mt-2">{s.support}</p>
                    <p className="text-xs text-muted-foreground mt-1">{s.stage}</p>
                  </div>
                  <div className="space-y-1 pt-3 border-t border-border">
                    {s.eligibility.map(e => (
                      <p key={e} className="text-[11px] text-muted-foreground flex items-start gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" /> {e}</p>
                    ))}
                  </div>
                  <button className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline self-start">
                    Read more <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                </TiltCard>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* 3. Bharat Stack */}
        <ScrollReveal>
          <section id="stack" className="scroll-mt-20">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center"><Layers className="w-4 h-4 text-sky-300" /></span>
              <h2 className="text-xl font-bold">Build on India's Digital Rails</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-5 ml-[42px]">India's digital public infrastructure — free, open, and built for founders to build on.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {STACK.map((s, i) => (
                <TiltCard key={s.id} className="h-full">
                <div style={{ animationDelay: `${i * 0.06}s` }} className="card-lift bg-card border border-border rounded-2xl p-5 animate-slide-up flex flex-col h-full">
                  <div className="w-11 h-11 rounded-xl border bg-sky-500/10 border-sky-500/20 text-sky-300 flex items-center justify-center mb-3"><Layers className="w-5 h-5" /></div>
                  <h4 className="font-semibold">{s.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed flex-1">{s.desc}</p>
                  <p className="text-xs text-accent mt-3 border-t border-border pt-3">Useful for: {s.who}</p>
                </div>
                </TiltCard>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* 4. Documents */}
        <ScrollReveal>
          <section id="docs" className="scroll-mt-20">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center"><FileText className="w-4 h-4 text-primary" /></span>
              <h2 className="text-xl font-bold">Documents You'll Need</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-5 ml-[42px]">From your first co-founder agreement to incorporation paperwork — tagged by when you'll actually need them.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {DOCS.map((d, i) => (
                <TiltCard key={d.id} className="h-full">
                <div style={{ animationDelay: `${i * 0.05}s` }} className="card-lift bg-card border border-border rounded-2xl p-5 animate-slide-up flex flex-col h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-11 h-11 rounded-xl border bg-primary/10 border-primary/20 text-primary flex items-center justify-center"><FileText className="w-5 h-5" /></div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STAGE_TAG[d.stage]}`}>{d.stage}</span>
                  </div>
                  <h4 className="font-semibold">{d.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed flex-1">{d.desc}</p>
                </div>
                </TiltCard>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* 5. Market Insights */}
        <ScrollReveal>
          <section id="market" className="scroll-mt-20">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center"><TrendingUp className="w-4 h-4 text-accent" /></span>
              <h2 className="text-xl font-bold">India Market Reality</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-5 ml-[42px]">Broad national context, plus what it actually means for the domain you're building in.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {MARKET_INSIGHTS.map((m, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-5">
                  <p className="text-2xl font-bold text-accent leading-none">{m.stat}</p>
                  <p className="text-sm font-semibold mt-2">{m.label}</p>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>

            {/* personalized: opportunity + honest challenge for the user's own domains */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                {domainInsights.length && prefs?.domains?.length ? "For your domains" : "A few domains to consider"}
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {domainInsights.map(d => (
                  <div key={d.domain} className="bg-card border border-border rounded-2xl p-5">
                    <h4 className="font-bold mb-3">{d.domain}</h4>
                    <div className="space-y-2.5">
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shrink-0 mt-0.5">EDGE</span>
                        <p className="text-xs text-muted-foreground leading-relaxed">{d.opportunity}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/15 text-red-300 border border-red-500/30 shrink-0 mt-0.5">WATCH</span>
                        <p className="text-xs text-muted-foreground leading-relaxed">{d.challenge}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* 6. Founder Stories */}
        <ScrollReveal>
          <section id="stories" className="scroll-mt-20">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center"><Users className="w-4 h-4 text-purple-300" /></span>
              <h2 className="text-xl font-bold">Built from India</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-5 ml-[42px]">Strategy patterns from Indian companies — not Silicon Valley playbooks.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {STORIES.map((s, i) => (
                <TiltCard key={s.name} className="h-full">
                <div style={{ animationDelay: `${i * 0.06}s` }} className="card-lift bg-card border border-border rounded-2xl p-5 animate-slide-up flex flex-col gap-3 h-full">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold">{s.name}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/25">{s.strategy}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{s.lesson}</p>
                  <button className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline self-start">
                    Read more <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                </TiltCard>
              ))}
            </div>
          </section>
        </ScrollReveal>

      </div>
    </AppShell>
  );
}