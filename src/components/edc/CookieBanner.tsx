import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { getCookieConsent, setCookieConsent } from "@/lib/edc/store";

export function CookieBanner() {
  const [show, setShow] = useState(false);
  const [managing, setManaging] = useState(false);
  const [personalization, setPersonalization] = useState(true);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const c = getCookieConsent();
    if (!c?.decided) setShow(true);
  }, []);

  const save = (allAccept = false) => {
    setCookieConsent({ decided: true, personalization: allAccept ? true : personalization, analytics: allAccept ? true : analytics });
    setShow(false); setManaging(false);
  };
  const reject = () => { setCookieConsent({ decided: true, personalization: false, analytics: false }); setShow(false); };

  if (!show) return null;
  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-50 bg-card border border-border rounded-xl p-5 shadow-2xl animate-slide-up">
        <p className="text-sm text-foreground mb-3">We use cookies to personalize your experience.</p>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold" onClick={() => save(true)}>Accept All</Button>
          <Button size="sm" variant="outline" onClick={() => setManaging(true)}>Manage</Button>
          <Button size="sm" variant="ghost" onClick={reject}>Reject Non-Essential</Button>
        </div>
      </div>
      <Dialog open={managing} onOpenChange={setManaging}>
        <DialogContent className="bg-card max-w-md">
          <DialogHeader><DialogTitle>Cookie preferences</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <Row label="Essential cookies" desc="Required for the site to function." checked disabled />
            <Row label="Personalization" desc="Tailor resources to your profile." checked={personalization} onChange={setPersonalization} />
            <Row label="Analytics" desc="Help us improve the product." checked={analytics} onChange={setAnalytics} />
          </div>
          <Button onClick={() => save(false)} className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">Save preferences</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Row({ label, desc, checked, onChange, disabled }: { label: string; desc: string; checked: boolean; onChange?: (v: boolean) => void; disabled?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="font-medium text-sm">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  );
}