import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/edc/AppShell";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useUser, useTheme } from "@/lib/edc/store";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — eDC KnowledgeHub" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user, setUser } = useUser();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [hydrated, setHydrated] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [pitch, setPitch] = useState("");
  const [link, setLink] = useState("");

  // wait for useUser() to finish reading localStorage before deciding whether
  // to redirect — checking `user` on the very first render (before hydration)
  // always sees null and kicks logged-in users straight back to the landing page.
  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email || "");
      setOrganization(user.organization || "");
      setPitch(user.pitch || "");
      setLink(user.link || "");
    }
  }, [user]);

  if (!hydrated) return null;
  if (!user) return <Navigate to="/" />;

  const nameValid = name.trim().length > 0;
  const emailValid = /\S+@\S+\.\S+/.test(email.trim());
  const canSave = nameValid && emailValid;

  const save = () => {
    if (!user || !canSave) return;
    setUser({ ...user, name: name.trim(), email: email.trim(), organization, pitch, link });
  };
  const del = () => {
    setUser(null);
    navigate({ to: "/" });
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <Tabs defaultValue="profile">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="prefs">Preferences</TabsTrigger>
            <TabsTrigger value="notif">Notifications</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent
            value="profile"
            className="mt-6 space-y-4 bg-card border border-border rounded-xl p-6"
          >
            <div>
              <Label>Name <span className="text-destructive">*</span></Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
              {!nameValid && <p className="text-xs text-destructive mt-1">Name is required.</p>}
            </div>
            <div>
              <Label>Email <span className="text-destructive">*</span></Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              {!emailValid && <p className="text-xs text-destructive mt-1">Enter a valid email address.</p>}
            </div>
            <div>
              <Label>College / School / Organization</Label>
              <Input
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Have a startup but no organization yet? Leave this empty."
              />
            </div>
            <div>
              <Label>What are you building? <span className="text-muted-foreground font-normal">(one-liner)</span></Label>
              <Input
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                placeholder="e.g. AI-powered inventory tool for D2C brands"
              />
              <p className="text-xs text-muted-foreground mt-1">Shown to mentors when you request a session, and used to personalize your dashboard.</p>
            </div>
            <div>
              <Label>LinkedIn / Portfolio</Label>
              <Input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://..."
              />
              <p className="text-xs text-muted-foreground mt-1">Included with mentor session requests so they know who's reaching out.</p>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="font-medium text-sm">Light mode</p>
                <p className="text-xs text-muted-foreground">Switch to a brighter theme.</p>
              </div>
              <Switch
                checked={theme === "light"}
                onCheckedChange={(v) => setTheme(v ? "light" : "dark")}
              />
            </div>
            <Button
              onClick={save}
              disabled={!canSave}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            >
              Save changes
            </Button>
          </TabsContent>

          <TabsContent
            value="prefs"
            className="mt-6 bg-card border border-border rounded-xl p-6 space-y-4"
          >
            <p className="text-sm text-muted-foreground">
              Update what we recommend by re-taking the onboarding quiz.
            </p>
            <Button onClick={() => navigate({ to: "/onboarding" })} variant="outline">
              Re-take quiz
            </Button>
          </TabsContent>

          <TabsContent
            value="notif"
            className="mt-6 bg-card border border-border rounded-xl p-6 space-y-4"
          >
            <Toggle
              label="Weekly digest email"
              desc="Curated funding and event roundup every Monday."
            />
            <Toggle label="Deadline alerts" desc="Get pinged 48 hours before deadlines." />
            <Toggle label="New resources" desc="Notify me when new resources match my interests." />
          </TabsContent>

          <TabsContent
            value="account"
            className="mt-6 bg-card border border-border rounded-xl p-6 space-y-4"
          >
            <div>
              <Label>Current password</Label>
              <Input type="password" />
            </div>
            <div>
              <Label>New password</Label>
              <Input type="password" />
            </div>
            <Button variant="outline">Update password</Button>
            <div className="pt-4 border-t border-border">
              <p className="font-semibold text-destructive">Delete account</p>
              <p className="text-xs text-muted-foreground mb-3">
                This is permanent and cannot be undone.
              </p>
              <Button variant="destructive" onClick={del}>
                Delete account
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}

function Toggle({ label, desc }: { label: string; desc: string }) {
  const [on, setOn] = useState(true);
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="font-medium text-sm">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <Switch checked={on} onCheckedChange={setOn} />
    </div>
  );
}