import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useUser, usePrefs } from "@/lib/edc/store";
import { useNavigate } from "@tanstack/react-router";
import { Mail, Lock, User as UserIcon } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "signup" | "signin";
  onSwitchMode?: (m: "signup" | "signin") => void;
}

export function AuthDialog({ open, onOpenChange, mode, onSwitchMode }: Props) {
  const { setUser } = useUser();
  const { prefs } = usePrefs();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [year, setYear] = useState("2nd Year");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) return setError("Email and password required");
    if (mode === "signup" && !name) return setError("Please enter your name");
    const finalName = mode === "signup" ? name : email.split("@")[0];
    setUser({ name: finalName, email});
    onOpenChange(false);
    if (mode === "signup" || !prefs) navigate({ to: "/onboarding" });
    else navigate({ to: "/dashboard" });
  };

  const google = () => {
    setUser({ name: "Founder", email: "founder@iitd.ac.in"});
    onOpenChange(false);
    if (!prefs) navigate({ to: "/onboarding" });
    else navigate({ to: "/dashboard" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </DialogTitle>
          <DialogDescription>
            {mode === "signup" ? "Join the IIT Delhi founder community." : "Sign in to your eDC KnowledgeHub."}
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
            <Label htmlFor="email">IIT Delhi Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="pl-9" placeholder="you@iitd.ac.in" />
            </div>
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="pl-9" placeholder="••••••••" />
            </div>
          </div>
          {/* {mode === "signup" && ( */}
            {/* // <div>
            //   <Label htmlFor="year">Year</Label>
            //   <select id="year" value={year} onChange={e => setYear(e.target.value)} className="w-full h-10 rounded-md bg-background border border-input px-3 text-sm">
            //     {["1st Year","2nd Year","3rd Year","4th Year","MTech/PhD","Alumni"].map(y => <option key={y}>{y}</option>)}
            //   </select>
            // </div> */}
          {/* )} */}
          {mode === "signin" && (
            <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
          )}
          {error && <p className="text-xs text-destructive">{error}</p>}
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
            {mode === "signup" ? "Create account" : "Sign in"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          {mode === "signup" ? "Already have an account? " : "New to eDC KnowledgeHub? "}
          <button onClick={() => onSwitchMode?.(mode === "signup" ? "signin" : "signup")} className="text-primary hover:underline">
            {mode === "signup" ? "Sign in" : "Create one"}
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
}