import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/edc/AppShell";
import { useUser, usePrefs, useSaved } from "@/lib/edc/store";
import { whatsNew, pickedForYou, books, courses, reports, funders, mentors, competitions } from "@/lib/edc/data";
import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, RotateCcw, Bookmark, ExternalLink, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Resource } from "@/lib/edc/data";

export const Route = createFileRoute("/ai")({
  head: () => ({ meta: [{ title: "AI Recommender — eDC KnowledgeHub" }] }),
  component: AIRecommender,
});

// ── All resources Claude can reference ──────────────────────────────────────
const ALL_RESOURCES: Resource[] = [...whatsNew, ...pickedForYou];

const RESOURCE_CATALOGUE = ALL_RESOURCES.map(r => ({
  id: r.id,
  title: r.title,
  description: r.description,
  category: r.category,
  tags: r.tags,
  deadlineDays: r.deadlineDays,
  emoji: r.emoji,
}));

const EXTRA_CATALOGUE = [
  ...books.map(b => ({ id: b.id, type: "book", title: b.title, author: b.author, emoji: b.emoji })),
  ...courses.map(c => ({ id: c.id, type: "course", title: c.title, desc: c.desc, emoji: c.emoji })),
  ...funders.map(f => ({ id: f.id, type: "funder", title: f.title, amount: f.amount, stage: f.stage, deadline: f.deadline, emoji: f.emoji })),
  ...mentors.map(m => ({ id: m.id, type: "mentor", name: m.name, expertise: m.expertise, status: m.status })),
  ...competitions.map(c => ({ id: c.id, type: "competition", title: c.title, prize: c.prize, deadline: `${c.deadline} days`, emoji: c.emoji })),
];

// ── Types ────────────────────────────────────────────────────────────────────
interface RecommendedResource {
  id: string;
  title: string;
  emoji: string;
  category: string;
  reason: string;
  tags?: string[];
  deadlineDays?: number;
  type?: string;
  amount?: string;
  prize?: string;
  author?: string;
}

interface Message {
  role: "user" | "assistant";
  text: string;
  recommendations?: RecommendedResource[];
  loading?: boolean;
}

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

const SUGGESTIONS = [
  "I'm building a deeptech startup in robotics at IIT Delhi",
  "Early stage fintech idea, looking for funding and mentors",
  "I want to validate my climate tech idea and find grants",
  "SaaS product for college students, need to learn and raise",
];

// ── Component ────────────────────────────────────────────────────────────────
function AIRecommender() {
  const { user } = useUser();
  const { prefs } = usePrefs();
  const { saved, toggle } = useSaved();
  const navigate = useNavigate();

  const [hydrated, setHydrated] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!hydrated) return null;
  if (!user) return <Navigate to="/" />;

  const systemPrompt = `You are an AI resource advisor for eDC KnowledgeHub — the entrepreneurship platform for IIT Delhi students.

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
  "recommendations": [
    {
      "id": "resource_id",
      "title": "Resource title",
      "emoji": "emoji",
      "category": "CATEGORY or type",
      "reason": "One sentence why this fits their specific situation",
      "tags": ["tag1"],
      "deadlineDays": 12,
      "type": "funder/book/etc if from extended catalogue",
      "amount": "if funder",
      "prize": "if competition",
      "author": "if book"
    }
  ]
}
4. If you need more info before recommending, set "recommendations" to an empty array [].
5. Keep "reason" specific to THEIR idea, not generic.
6. Prioritise IITD-exclusive resources when relevant.
7. Always respond ONLY with the JSON — no preamble, no markdown fences.`;

  async function send(text: string) {
    if (!text.trim() || loading) return;
    setInput("");
    setLoading(true);

    const userMsg: Message = { role: "user", text };
    const loadingMsg: Message = { role: "assistant", text: "", loading: true };
    setMessages(prev => [...prev, userMsg, loadingMsg]);

    const newHistory = [...history, { role: "user" as const, content: text }];

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: newHistory,
        }),
      });

      const data = await res.json();
      const raw = data.content?.map((b: { type: string; text?: string }) => b.type === "text" ? b.text : "").join("") || "";

      let parsed: { message: string; recommendations: RecommendedResource[] } = { message: raw, recommendations: [] };
      try {
        const clean = raw.replace(/```json|```/g, "").trim();
        parsed = JSON.parse(clean);
      } catch {
        parsed = { message: raw, recommendations: [] };
      }

      const assistantMsg: Message = {
        role: "assistant",
        text: parsed.message,
        recommendations: parsed.recommendations?.length ? parsed.recommendations : undefined,
      };

      setMessages(prev => [...prev.slice(0, -1), assistantMsg]);
      setHistory([...newHistory, { role: "assistant", content: raw }]);
    } catch (err) {
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: "assistant", text: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function reset() {
    setMessages([]);
    setHistory([]);
    setInput("");
  }

  const isEmpty = messages.length === 0;

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 flex flex-col min-h-[calc(100vh-4rem)]">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-accent" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-none">AI Resource Advisor</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Powered by Claude</p>
            </div>
          </div>
          {!isEmpty && (
            <button onClick={reset} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <RotateCcw className="w-3.5 h-3.5" /> New chat
            </button>
          )}
        </div>

        {/* Empty state */}
        {isEmpty && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12 gap-6">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">What are you building?</h2>
              <p className="text-muted-foreground text-sm max-w-sm">
                Describe your startup idea or what you need help with — I'll find the most relevant resources for you.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-2 w-full max-w-lg">
              {SUGGESTIONS.map(s => (
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
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-primary to-accent text-background"
                    : "bg-accent/15 border border-accent/30 text-accent"
                }`}>
                  {msg.role === "user"
                    ? (user?.name?.charAt(0).toUpperCase() || "U")
                    : <Bot className="w-4 h-4" />
                  }
                </div>

                <div className={`flex flex-col gap-3 max-w-[85%] ${msg.role === "user" ? "items-end" : ""}`}>
                  {/* Bubble */}
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

                  {/* Recommendation cards */}
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="w-full space-y-2">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider px-1">Recommended for you</p>
                      {msg.recommendations.map((r, j) => {
                        const fullResource = ALL_RESOURCES.find(res => res.id === r.id);
                        const isSaved = saved.includes(r.id);
                        return (
                          <div
                            key={j}
                            className="bg-card border border-border rounded-xl p-4 hover:border-accent/40 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-2xl shrink-0">{r.emoji || "📌"}</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <h4 className="font-semibold text-sm leading-snug">{r.title}</h4>
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    {fullResource && (
                                      <button
                                        onClick={() => toggle(r.id)}
                                        aria-label="Save"
                                        className="p-1 rounded hover:bg-white/10 transition-colors"
                                      >
                                        <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-accent text-accent" : "text-muted-foreground hover:text-foreground"}`} />
                                      </button>
                                    )}
                                    {fullResource && (
                                      <button
                                        onClick={() => navigate({ to: "/resource/$id", params: { id: r.id } })}
                                        className="p-1 rounded hover:bg-white/10 transition-colors"
                                        aria-label="Open"
                                      >
                                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* Category + extra info */}
                                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${catColor[r.category] || catColor["LEARN"]}`}>
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

                                {/* Why it fits */}
                                <p className="text-xs text-muted-foreground leading-relaxed border-l-2 border-accent/40 pl-2">
                                  {r.reason}
                                </p>
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
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
              }}
              placeholder="Describe your startup idea or what you need…"
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