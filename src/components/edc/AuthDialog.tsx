import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/edc/store";
import { useNavigate } from "@tanstack/react-router";
import { Mail, Lock, User as UserIcon, UserPlus, Sparkles } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "signup" | "signin";
  onSwitchMode?: (m: "signup" | "signin") => void;
}

export function AuthDialog({ open, onOpenChange, mode, onSwitchMode }: Props) {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ⚠️ Temporary, honest limitation: there's no real backend yet, so there's
  // no way to actually check whether an account exists. Rather than let
  // "Sign In" silently create a fresh account for any email/password typed
  // in (which is misleading), sign-in is disabled here and points people to
  // Get Started instead. Only Get Started (mode === "signup") creates a
  // session. Swap this gate out once real auth/accounts exist.
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) return setError("Email and password required");

    if (mode === "signin") {
      setError("We couldn't find an account with that email. Create one to get started — it only takes a moment.");
      return;
    }

    if (!name) return setError("Please enter your name");
    setUser({ name, email });
    onOpenChange(false);
    // Every new signup goes to onboarding — unconditionally. `prefs` is
    // global localStorage, not scoped to this account, so checking it here
    // was letting leftover prefs from a PREVIOUS session skip onboarding
    // for brand-new users and dump them on the dashboard with someone
    // else's old stage/domain answers.
    navigate({ to: "/onboarding" });
  };

  const google = () => {
    if (mode === "signin") {
      setError("We couldn't find an account with that email. Create one to get started — it only takes a moment.");
      return;
    }
    setUser({ name: "Founder", email: "founder@iitd.ac.in" });
    onOpenChange(false);
    // same fix as submit() above — always onboarding for a new account
    navigate({ to: "/onboarding" });
  };

  // Fills the fixed demo defaults and creates the account immediately — no
  // typing required. Same onboarding-first behavior as a real signup.
  const DEMO = { name: "Shivanchal", email: "shivanchalsharma77@gmail.com", password: "1234" };
  const demoAccount = () => {
    setName(DEMO.name);
    setEmail(DEMO.email);
    setPassword(DEMO.password);
    setUser({ name: DEMO.name, email: DEMO.email });
    onOpenChange(false);
    navigate({ to: "/onboarding" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </DialogTitle>
          <DialogDescription>
            {mode === "signup" ? "Join the founder community." : "Sign in to your PragyanBuild account."}
          </DialogDescription>
        </DialogHeader>
        <Button variant="outline" onClick={google} className="w-full">
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.93h5.26c-.5 2.4-2.5 3.78-5.26 3.78a5.81 5.81 0 1 1 0-11.6c1.45 0 2.77.51 3.8 1.36l2.18-2.18A8.9 8.9 0 0 0 12.18 3a9 9 0 1 0 0 18c4.7 0 9-3.4 9-9 0-.6-.07-1.18-.18-1.9z"/></svg>
          Continue with Google
        </Button>
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">or</span></div>
        </div>
        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <div>
              <Label htmlFor="name">Name</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input id="name" value={name} onChange={e => setName(e.target.value)} className="pl-9" placeholder="Aarav Sharma" />
              </div>
            </div>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="pl-9" placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="pl-9" placeholder="••••••••" />
            </div>
          </div>
          {mode === "signin" && (
            <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
          )}
          {error && (
            <div className="rounded-lg border border-accent/30 bg-accent/[0.06] p-3 space-y-2">
              <p className="text-xs text-foreground leading-relaxed">{error}</p>
              {mode === "signin" && (
                <button
                  type="button"
                  onClick={() => onSwitchMode?.("signup")}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Get started instead
                </button>
              )}
            </div>
          )}
          {mode === "signup" && (
            <Button
              type="button"
              variant="outline"
              onClick={demoAccount}
              className="w-full border-dashed"
            >
              <Sparkles className="w-4 h-4 mr-2 text-accent" /> Continue with Demo Account
            </Button>
          )}
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
            {mode === "signup" ? "Create account" : "Sign in"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          {mode === "signup" ? "Already have an account? " : "New to PragyanBuild? "}
          <button onClick={() => onSwitchMode?.(mode === "signup" ? "signin" : "signup")} className="text-primary hover:underline">
            {mode === "signup" ? "Sign in" : "Create one"}
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
}