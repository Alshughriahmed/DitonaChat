// @ts-nocheck
'use client';
import { makeSocket, type SocketT } from '@/utils/socket';

import { useEffect, useState, useCallback } from "react";
export type GenderType = 'any' | 'male' | 'female' | 'couple' | 'lgbt';

export function useUserPreferences() {
  const [genderPreference, setGenderPreference] = useState<GenderType>('any');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/preferences/gender", { cache: "no-store" });
        if (r.ok) {
          const j = await r.json();
          if (j?.genderPref) setGenderPreference(j.genderPref as GenderType);
        }
      } catch {}
      finally { setLoading(false); }
    })();
  }, []);

  const updateGenderPreference = useCallback(async (value: GenderType) => {
    setGenderPreference(value);
    try {
      await fetch("/api/preferences/gender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ genderPref: value }),
      });
    } catch {}
  }, []);

  return { genderPreference, updateGenderPreference, loading };
}

export default useUserPreferences;
'use client';
import { useEffect, useState } from 'react';

export type Prefs = { gender?: string[], country?: string[], region?: string[] };

export function useUserPreferences() {
  const key = 'ditona:prefs';
  const [prefs, setPrefs] = useState<Prefs>({});
  
  useEffect(() => { 
    try { 
      const s = localStorage.getItem(key); 
      if (s) setPrefs(JSON.parse(s)); 
    } catch {} 
  }, []);
  
  useEffect(() => { 
    try { 
      localStorage.setItem(key, JSON.stringify(prefs)); 
    } catch {} 
  }, [prefs]);
  
  return { prefs, setPrefs };
}
