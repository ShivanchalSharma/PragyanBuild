import { useEffect, useState, useCallback } from "react";

export interface UserProfile {
  name: string;
  email: string;
  year?: string;
  branch?: string;
}

export interface Preferences {
  stage?: string;
  year?: string;
  domains: string[];
  needs: string[];
  discovery?: string;
}

const K_USER = "edc:user";
const K_PREFS = "edc:prefs";
const K_SAVED = "edc:saved";
const K_THEME = "edc:theme";
const K_COOKIES = "edc:cookies";

function read<T>(k: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; }
}
function write<T>(k: string, v: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(k, JSON.stringify(v));
  window.dispatchEvent(new Event("edc:storage"));
}

export function useUser() {
  const [user, setUserState] = useState<UserProfile | null>(null);
  useEffect(() => {
    setUserState(read<UserProfile | null>(K_USER, null));
    const h = () => setUserState(read<UserProfile | null>(K_USER, null));
    window.addEventListener("edc:storage", h);
    return () => window.removeEventListener("edc:storage", h);
  }, []);
  const setUser = useCallback((u: UserProfile | null) => {
    if (u) write(K_USER, u); else { localStorage.removeItem(K_USER); window.dispatchEvent(new Event("edc:storage")); }
  }, []);
  return { user, setUser };
}

export function usePrefs() {
  const [prefs, setPrefsState] = useState<Preferences | null>(null);
  useEffect(() => {
    setPrefsState(read<Preferences | null>(K_PREFS, null));
    const h = () => setPrefsState(read<Preferences | null>(K_PREFS, null));
    window.addEventListener("edc:storage", h);
    return () => window.removeEventListener("edc:storage", h);
  }, []);
  const setPrefs = useCallback((p: Preferences) => write(K_PREFS, p), []);
  return { prefs, setPrefs };
}

export function useSaved() {
  const [saved, setSavedState] = useState<string[]>([]);
  useEffect(() => {
    setSavedState(read<string[]>(K_SAVED, []));
    const h = () => setSavedState(read<string[]>(K_SAVED, []));
    window.addEventListener("edc:storage", h);
    return () => window.removeEventListener("edc:storage", h);
  }, []);
  const toggle = useCallback((id: string) => {
    const cur = read<string[]>(K_SAVED, []);
    const next = cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id];
    write(K_SAVED, next);
  }, []);
  return { saved, toggle };
}

export function useTheme() {
  const [theme, setThemeState] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const t = (localStorage.getItem(K_THEME) as "dark" | "light") || "dark";
    setThemeState(t);
    document.documentElement.classList.toggle("light", t === "light");
  }, []);
  const setTheme = useCallback((t: "dark" | "light") => {
    localStorage.setItem(K_THEME, t);
    document.documentElement.classList.toggle("light", t === "light");
    setThemeState(t);
  }, []);
  return { theme, setTheme };
}

export function getCookieConsent(): { decided: boolean; personalization: boolean; analytics: boolean } | null {
  return read(K_COOKIES, null);
}
export function setCookieConsent(v: { decided: boolean; personalization: boolean; analytics: boolean }) {
  write(K_COOKIES, v);
}