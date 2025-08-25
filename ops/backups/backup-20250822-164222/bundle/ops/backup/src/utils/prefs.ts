"use client";
import { useEffect, useState } from "react";

export type Gender = "male" | "female" | "couple" | "lgbtq";
export type MatchGender = "any" | Gender;

export type UserPrefs = {
  displayName?: string;
  photoUrl?: string;
  avatarDataUrl?: string;          // لعرض صورة مصغّرة (optional)
  gender?: Gender;
  isVip?: boolean;

  // ترجمة / لغة
  autoTranslate?: boolean;
  language?: string;               // e.g. 'en'
  lang?: string;                   // alias

  // الموقع
  allowShareLocation?: boolean;
  hideLocation?: boolean;

  // رسالة تعريف وروابط
  
  socials?: { facebook?: string; instagram?: string; snapchat?: string };
  likesVisible?: boolean;

  // تفضيلات المطابقة
  preferredMatchGender?: MatchGender;
  preferredGender?: MatchGender;   // alias
  preferredCountries?: string[];   // ISO-2
  countryFilter?: string[];        // alias
};

const STORAGE_KEY = "prefs:v1";

export function loadPrefs(): UserPrefs {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

export function savePrefs(p: UserPrefs) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {}
}

export function usePrefs(): [UserPrefs, (u: UserPrefs | ((prev: UserPrefs)=>UserPrefs))=>void] {
  const [prefs, _set] = useState<UserPrefs>(loadPrefs());
  useEffect(()=>{ savePrefs(prefs); }, [prefs]);
  const setPrefs = (u: any) => _set((prev)=> typeof u === "function" ? u(prev) : u);
  return [prefs, setPrefs];
}

export function isVip(p?: UserPrefs): boolean {
  if (typeof window !== "undefined" && localStorage.getItem("dev:vip") === "1") return true;
  return !!p?.isVip;
}
export function setVip(v: boolean) {
  const current = loadPrefs(); current.isVip = v; savePrefs(current);
}

export function detectBrowserCountry(): string | null {
  try {
    if (typeof navigator !== "undefined") {
      const langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
      for (const l of langs) {
        try {
          // @ts-ignore
          const loc = new (Intl as any).Locale(l);
          if (loc && loc.region) return String(loc.region);
        } catch {}
      }
    }
  } catch {}
  return null;
}

export function supportedRegions(): string[] {
  try {
    // @ts-ignore
    if ((Intl as any).supportedValuesOf) {
      // @ts-ignore
      const all = (Intl as any).supportedValuesOf("region") as string[];
      return all.filter(c => typeof c === "string" && c.length === 2);
    }
  } catch {}
  return ["US","DE","GB","FR","IT","ES","NL","SE","NO","DK","FI","PL","CZ","AT","CH","BE","IE","PT","GR","TR","RU",
          "CA","MX","BR","AR","CL","CO","PE","VE","UY","PY",
          "AU","NZ","JP","KR","CN","TW","HK","SG","MY","TH","ID","PH","VN","IN","PK","BD","AE","SA","EG","MA","TN","ZA"];
}
