import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/edc/AppShell";
import { NeuralBackground } from "@/components/edc/NeuralBackground";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare, Send, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/feedback")({
  head: () => ({ meta: [{ title: "Feedback — eDC KnowledgeHub" }] }),
  component: FeedbackPage,
});

function FeedbackPage() {
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Safely handle the success state reset to avoid unmounted component errors
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (submitted) {
      timer = setTimeout(() => {
        setSubmitted(false);
        setTopic("");
        setSubject("");
        setMessage("");
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [submitted]);

  const handleSubmit = () => {
    if (!topic || !subject.trim() || !message.trim()) return;
    
    // Simulate API call
    console.log("Feedback Submitted:", { topic, subject, message });
    setSubmitted(true);
  };

  // Ensure all fields are filled before enabling the submit button
  const isFormValid = topic !== "" && subject.trim() !== "" && message.trim() !== "";

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-8">
        
        {/* ── Hero Container ── */}
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 md:p-8">
          <NeuralBackground className="opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/15 via-transparent to-accent/15 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5 text-indigo-400" />
                </span>
                <h1 className="text-3xl font-bold">Feedback</h1>
              </div>
              <p className="text-sm text-muted-foreground max-w-xl">
                Help us improve the KnowledgeHub. Share your questions, feature requests, grievances, or bug reports directly with the team.
              </p>
            </div>
          </div>
        </section>

        {/* ── Form Container ── */}
        <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-xl font-bold mb-2">Message received!</h2>
              <p className="text-sm text-muted-foreground max-w-sm">
                Thanks for taking the time to share your thoughts. We read every piece of feedback to make the platform better.
              </p>
            </div>
          ) : (
            <div className="space-y-6 max-w-2xl">
              <div>
                <Label htmlFor="topic" className="text-sm font-semibold">
                  Topic <span className="text-destructive">*</span>
                </Label>
                <select
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="flex h-10 w-full mt-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                >
                  <option value="" disabled>Select a topic...</option>
                  <option value="General Query">General Query</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="Grievance">Grievance</option>
                  <option value="Suggestion">Suggestion</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <Label htmlFor="subject" className="text-sm font-semibold">
                  Subject <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="subject"
                  placeholder="Brief summary of your feedback..." 
                  className="mt-2"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="message" className="text-sm font-semibold">
                  Message <span className="text-destructive">*</span>
                </Label>
                <textarea 
                  id="message"
                  className="flex min-h-[160px] w-full mt-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="What's on your mind? The more details, the better..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>

              <div className="pt-2">
                <Button 
                  onClick={handleSubmit} 
                  disabled={!isFormValid}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Send Feedback
                </Button>
              </div>
            </div>
          )}
        </section>

      </div>
    </AppShell>
  );
}