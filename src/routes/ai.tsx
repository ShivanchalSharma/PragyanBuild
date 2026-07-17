import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/edc/AppShell";
import { useUser, usePrefs, useSaved } from "@/lib/edc/store";
import { whatsNew, pickedForYou, books, courses, reports, funders, mentors, competitions } from "@/lib/edc/data";
import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, RotateCcw, Bookmark, ExternalLink, Bot, Map, FileText, type LucideIcon } from "lucide-react";
import type { Resource } from "@/lib/edc/data";

export const Route = createFileRoute("/ai")({
  head: () => ({ meta: [{ title: "AI Advisor — eDC KnowledgeHub" }] }),
  component: AIAdvisor,
});

// ⚠️ Demo-only: calls Anthropic directly from the browser, which exposes the
// API key client-side. Fine for a hackathon; proxy through a serverless
// function before shipping to real users. Requires VITE_ANTHROPIC_API_KEY in
// a .env file at the project root.
const CLAUDE_MODEL = "claude-sonnet-4-20250514";

// ── All resources Claude can reference ──────────────────────────────────────
const ALL_RESOURCES: Resource[] = [...whatsNew, ...pickedForYou];

const RESOURCE_CATALOGUE = ALL_RESOURCES.map(r => ({
  id: r.id, title: r.title, description: r.description, category: r.category,
  tags: r.tags, deadlineDays: r.deadlineDays, emoji: r.emoji,
}));

const EXTRA_CATALOGUE = [
  ...books.map(b => ({ id: b.id, type: "book", title: b.title, author: b.author, emoji: b.emoji })),
  ...courses.map(c => ({ id: c.id, type: "course", title: c.title, desc: c.desc, emoji: c.emoji })),
  ...funders.map(f => ({ id: f.id, type: "funder", title: f.title, amount: f.amount, stage: f.stage, deadline: f.deadline, emoji: f.emoji })),
  ...mentors.map(m => ({ id: m.id, type: "mentor", name: m.name, expertise: m.expertise, status: m.status })),
  ...competitions.map(c => ({ id: c.id, type: "competition", title: c.title, prize: c.prize, deadline: `${c.deadline} days`, emoji: c.emoji })),
];

// ── Types ────────────────────────────────────────────────────────────────────
interface CardItem {
  id: string; title: string; emoji: string; category: string; reason: string;
  tags?: string[]; deadlineDays?: number; type?: string; amount?: string; prize?: string; author?: string;
}
interface Message { role: "user" | "assistant"; text: string; cards?: CardItem[]; loading?: boolean }
interface ChatState { messages: Message[]; history: { role: "user" | "assistant"; content: string }[] }

const catColor: Record<string, string> = {
  FUNDING: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  EVENT:   "bg-primary/15 text-primary border-primary/30",
  REPORT:  "bg-sky-500/15 text-sky-300 border-sky-500/30",
  DEADLINE:"bg-red-500/15 text-red-300 border-red-500/30",
  LEARN:   "bg-purple-500/15 text-purple-300 border-purple-500/30",
  MENTOR:  "bg-accent/15 text-accent border-accent/30",
  book:    "bg-purple-500/15 text-purple-300 border-purple-500/30",
  course:  "bg-sky-500/15 text-sky-300 border-sky-500/30",
  funder:  "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  mentor:  "bg-accent/15 text-accent border-accent/30",
  competition: "bg-red-500/15 text-red-300 border-red-500/30",
};

// ── Modes: General Advisor / AI Roadmap / Pitch Deck Reviewer ───────────────
type ModeId = "general" | "roadmap" | "pitch";

interface Mode {
  id: ModeId;
  label: string;
  Icon: LucideIcon;
  tagline: string;
  emptyTitle: string;
  emptyDesc: string;
  suggestions: string[];
  cardsHeading: string;
  linkToResources: boolean; // only "general" cards map to real, saveable resources
  systemPrompt: (user: ReturnType<typeof useUser>["user"], prefs: ReturnType<typeof usePrefs>["prefs"]) => string;
}

const MODES: Mode[] = [
  {
    id: "general",
    label: "General Advisor",
    Icon: Sparkles,
    tagline: "Powered by Claude",
    emptyTitle: "What are you building?",
    emptyDesc: "Describe your startup idea or what you need help with — I'll find the most relevant resources for you.",
    suggestions: [
      "I'm building a deeptech startup in robotics at IIT Delhi",
      "Early stage fintech idea, looking for funding and mentors",
      "I want to validate my climate tech idea and find grants",
      "SaaS product for college students, need to learn and raise",
    ],
    cardsHeading: "Recommended for you",
    linkToResources: true,
    systemPrompt: (user, prefs) => `You are an AI resource advisor for eDC KnowledgeHub — the entrepreneurship platform for IIT Delhi students.

User profile:
- Name: ${user?.name || "Founder"}
- Stage: ${prefs?.stage || "unknown"}
- Domains: ${prefs?.domains?.join(", ") || "not set"}
- Needs: ${prefs?.needs?.join(", ") || "not set"}

Your job: understand what the user is building or needs, then recommend the most relevant resources from the catalogue below.

RESOURCE CATALOGUE (cards on the platform):
${JSON.stringify(RESOURCE_CATALOGUE, null, 2)}

EXTENDED CATALOGUE (books, courses, funders, mentors, competitions):
${JSON.stringify(EXTRA_CATALOGUE, null, 2)}

INSTRUCTIONS:
1. Have a brief, warm conversation to understand their startup idea, stage, and needs.
2. Once you have enough context (after 1-2 messages), recommend 3-6 resources.
3. Always respond in this exact JSON format:
{
  "message": "Your conversational reply here...",
  "cards": [
    { "id": "resource_id", "title": "Resource title", "emoji": "emoji", "category": "CATEGORY or type",
      "reason": "One sentence why this fits their specific situation", "tags": ["tag1"],
      "deadlineDays": 12, "type": "funder/book/etc if from extended catalogue",
      "amount": "if funder", "prize": "if competition", "author": "if book" }
  ]
}
4. If you need more info before recommending, set "cards" to an empty array [].
5. Keep "reason" specific to THEIR idea, not generic.
6. Prioritise IITD-exclusive resources when relevant.
7. Respond ONLY with the JSON — no preamble, no markdown fences.`,
  },
  {
    id: "roadmap",
    label: "AI Roadmap",
    Icon: Map,
    tagline: "Turns your idea into a week-by-week plan",
    emptyTitle: "Where are you starting from?",
    emptyDesc: "Tell me about your idea and current stage — I'll turn it into a concrete, week-by-week roadmap.",
    suggestions: [
      "I have an idea for an EV charging startup — give me a roadmap",
      "Validate-stage SaaS idea, what should I do this month?",
      "I'm about to launch — what are my next 4 weeks?",
      "Turn my fintech idea into a week-by-week plan",
    ],
    cardsHeading: "Your roadmap",
    linkToResources: false,
    systemPrompt: (user, prefs) => `You are an AI startup roadmap generator for eDC KnowledgeHub, built for IIT Delhi student founders.

User profile:
- Name: ${user?.name || "Founder"}
- Stage: ${prefs?.stage || "unknown"}
- Domains: ${prefs?.domains?.join(", ") || "not set"}

INSTRUCTIONS:
1. Have a brief conversation (1-2 messages max) to understand their idea, stage, and constraints.
2. Once you have enough context, generate a concrete 4-6 week roadmap with one clear, actionable step per week.
3. Respond in this exact JSON format:
{
  "message": "A short conversational reply or summary of the roadmap.",
  "cards": [
    { "id": "week-1", "title": "Short step title", "emoji": "🔍", "category": "Week 1",
      "reason": "1-2 sentences on exactly what to do and why it matters now." }
  ]
}
4. If you need more info before generating a roadmap, set "cards" to an empty array [].
5. Steps must be specific, ordered chronologically, and realistic for a student founder.
6. Respond ONLY with the JSON — no preamble, no markdown fences.`,
  },
  {
    id: "pitch",
    label: "Pitch Deck Reviewer",
    Icon: FileText,
    tagline: "Investor-grade feedback on your deck",
    emptyTitle: "Paste your pitch deck outline",
    emptyDesc: "Describe or paste your deck slide-by-slide (Problem, Solution, Market, Traction, Team, Ask) — I'll score it and tell you what's missing.",
    suggestions: [
      "Review my 10-slide pitch deck for a climate-tech startup",
      "I'll paste my deck outline — please score it",
      "Help me improve my problem and market slides",
      "What's missing from my seed-stage pitch?",
    ],
    cardsHeading: "Slide-by-slide feedback",
    linkToResources: false,
    systemPrompt: (user, prefs) => `You are an AI pitch deck reviewer for eDC KnowledgeHub, giving investor-grade feedback to IIT Delhi student founders.

User profile:
- Name: ${user?.name || "Founder"}
- Stage: ${prefs?.stage || "unknown"}

INSTRUCTIONS:
1. If the user hasn't described their deck yet, ask them to outline it slide-by-slide (Problem, Solution, Market, Traction, Team, The Ask).
2. Once they've given enough detail, score each key section out of 10 and give specific, actionable feedback — like a real investor would.
3. Respond in this exact JSON format:
{
  "message": "Overall verdict — mention an overall score out of 100 and the single biggest thing to fix first.",
  "cards": [
    { "id": "problem", "title": "Problem", "emoji": "🎯", "category": "Score: 7/10",
      "reason": "Specific, actionable feedback on this section." }
  ]
}
4. If you don't have enough detail yet, set "cards" to an empty array [].
5. Be honest and specific — vague praise helps no one preparing to raise money.
6. Respond ONLY with the JSON — no preamble, no markdown fences.`,
  },
];

// ── Component ────────────────────────────────────────────────────────────────
function AIAdvisor() {
  const { user } = useUser();
  const { prefs } = usePrefs();
  const { saved, toggle } = useSaved();
  const navigate = useNavigate();

  const [hydrated, setHydrated] = useState(false);
  const [activeMode, setActiveMode] = useState<ModeId>("general");
  const [chats, setChats] = useState<Record<ModeId, ChatState>>({
    general: { messages: [], history: [] },
    roadmap: { messages: [], history: [] },
    pitch: { messages: [], history: [] },
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => setHydrated(true), []);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, activeMode]);

  if (!hydrated) return null;
  if (!user) return <Navigate to="/" />;

  const mode = MODES.find(m => m.id === activeMode)!;
  const chat = chats[activeMode];
  const isEmpty = chat.messages.length === 0;

  function setChat(id: ModeId, next: ChatState) {
    setChats(prev => ({ ...prev, [id]: next }));
  }

  async function send(text: string) {
    if (!text.trim() || loading) return;
    setInput("");
    setLoading(true);

    const current = chats[activeMode];
    const userMsg: Message = { role: "user", text };
    const loadingMsg: Message = { role: "assistant", text: "", loading: true };
    const nextMessages = [...current.messages, userMsg, loadingMsg];
    const nextHistory = [...current.history, { role: "user" as const, content: text }];
    setChat(activeMode, { messages: nextMessages, history: nextHistory });

    try {
      const key = import.meta.env.VITE_ANTHROPIC_API_KEY;
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: CLAUDE_MODEL,
          max_tokens: 1200,
          system: mode.systemPrompt(user, prefs),
          messages: nextHistory,
        }),
      });

      const data = await res.json();
      const raw = data.content?.map((b: { type: string; text?: string }) => b.type === "text" ? b.text : "").join("") || "";

      let parsed: { message: string; cards: CardItem[] } = { message: raw, cards: [] };
      try {
        const clean = raw.replace(/```json|```/g, "").trim();
        parsed = JSON.parse(clean);
      } catch {
        parsed = { message: raw || "Something went wrong reading that response. Please try again.", cards: [] };
      }

      const assistantMsg: Message = {
        role: "assistant",
        text: parsed.message,
        cards: parsed.cards?.length ? parsed.cards : undefined,
      };

      setChat(activeMode, {
        messages: [...nextMessages.slice(0, -1), assistantMsg],
        history: [...nextHistory, { role: "assistant", content: raw }],
      });
    } catch {
      setChat(activeMode, {
        messages: [...nextMessages.slice(0, -1), { role: "assistant", text: "Something went wrong. Please try again." }],
        history: nextHistory,
      });
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function reset() {
    setChat(activeMode, { messages: [], history: [] });
    setInput("");
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 flex flex-col min-h-[calc(100vh-4rem)]">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center">
              <mode.Icon className="w-4 h-4 text-accent" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-none">{mode.label}</h1>
              <p className="text-xs text-muted-foreground mt-0.5">{mode.tagline}</p>
            </div>
          </div>
          {!isEmpty && (
            <button onClick={reset} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <RotateCcw className="w-3.5 h-3.5" /> New chat
            </button>
          )}
        </div>

        {/* Mode tabs */}
        <div className="flex gap-2 mb-6 border-b border-border pb-4">
          {MODES.map(m => (
            <button
              key={m.id}
              onClick={() => setActiveMode(m.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                activeMode === m.id
                  ? "bg-accent/15 border border-accent/30 text-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 border border-transparent"
              }`}
            >
              <m.Icon className="w-4 h-4" /> {m.label}
            </button>
          ))}
        </div>

        {/* Empty state */}
        {isEmpty && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12 gap-6">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
              <mode.Icon className="w-7 h-7 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">{mode.emptyTitle}</h2>
              <p className="text-muted-foreground text-sm max-w-sm">{mode.emptyDesc}</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-2 w-full max-w-lg">
              {mode.suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-left text-sm px-4 py-3 rounded-xl bg-card border border-border hover:border-accent/40 hover:bg-card/80 transition-colors text-muted-foreground hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {!isEmpty && (
          <div className="flex-1 space-y-6 mb-6 overflow-y-auto">
            {chat.messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-primary to-accent text-background"
                    : "bg-accent/15 border border-accent/30 text-accent"
                }`}>
                  {msg.role === "user" ? (user?.name?.charAt(0).toUpperCase() || "U") : <Bot className="w-4 h-4" />}
                </div>

                <div className={`flex flex-col gap-3 max-w-[85%] ${msg.role === "user" ? "items-end" : ""}`}>
                  {msg.loading ? (
                    <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex gap-1.5 items-center h-5">
                        {[0, 1, 2].map(j => (
                          <span key={j} className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: `${j * 0.15}s` }} />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-accent text-accent-foreground rounded-tr-sm"
                        : "bg-card border border-border rounded-tl-sm text-foreground"
                    }`}>
                      {msg.text}
                    </div>
                  )}

                  {msg.cards && msg.cards.length > 0 && (
                    <div className="w-full space-y-2">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider px-1">{mode.cardsHeading}</p>
                      {msg.cards.map((r, j) => {
                        const fullResource = mode.linkToResources ? ALL_RESOURCES.find(res => res.id === r.id) : undefined;
                        const isSaved = saved.includes(r.id);
                        return (
                          <div key={j} className="bg-card border border-border rounded-xl p-4 hover:border-accent/40 transition-colors">
                            <div className="flex items-start gap-3">
                              <span className="text-2xl shrink-0">{r.emoji || "📌"}</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <h4 className="font-semibold text-sm leading-snug">{r.title}</h4>
                                  {fullResource && (
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <button onClick={() => toggle(r.id)} aria-label="Save" className="p-1 rounded hover:bg-white/10 transition-colors">
                                        <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-accent text-accent" : "text-muted-foreground hover:text-foreground"}`} />
                                      </button>
                                      <button onClick={() => navigate({ to: "/resource/$id", params: { id: r.id } })} className="p-1 rounded hover:bg-white/10 transition-colors" aria-label="Open">
                                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                                      </button>
                                    </div>
                                  )}
                                </div>

                                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${catColor[r.category] || "bg-secondary text-secondary-foreground border-border"}`}>
                                    {r.category?.toUpperCase()}
                                  </span>
                                  {r.amount && <span className="text-[10px] font-semibold text-emerald-400">{r.amount}</span>}
                                  {r.prize && <span className="text-[10px] font-semibold text-accent">{r.prize}</span>}
                                  {r.author && <span className="text-[10px] text-muted-foreground">by {r.author}</span>}
                                  {r.deadlineDays && (
                                    <span className={`text-[10px] font-medium ${r.deadlineDays <= 7 ? "text-red-400" : "text-muted-foreground"}`}>
                                      {r.deadlineDays}d left
                                    </span>
                                  )}
                                </div>

                                <p className="text-xs text-muted-foreground leading-relaxed border-l-2 border-accent/40 pl-2">{r.reason}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}

        {/* Input */}
        <div className={`${isEmpty ? "mt-4" : ""} sticky bottom-4`}>
          <div className="relative bg-card border border-border rounded-2xl overflow-hidden focus-within:border-accent/50 transition-colors shadow-lg">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
              placeholder={mode.id === "pitch" ? "Paste or describe your pitch deck…" : "Describe your startup idea or what you need…"}
              rows={1}
              className="w-full bg-transparent px-4 pt-3.5 pb-10 text-sm resize-none outline-none placeholder:text-muted-foreground"
              style={{ minHeight: "52px", maxHeight: "140px" }}
              onInput={e => {
                const t = e.currentTarget;
                t.style.height = "auto";
                t.style.height = Math.min(t.scrollHeight, 140) + "px";
              }}
            />
            <div className="absolute bottom-2.5 right-3 flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground hidden sm:block">Enter to send</span>
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || loading}
                className="w-8 h-8 rounded-xl bg-accent hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all"
              >
                <Send className="w-3.5 h-3.5 text-accent-foreground" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </AppShell>
  );
}