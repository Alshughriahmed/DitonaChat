"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Gender = "female"|"male"|"couple"|"lgbtq";
type LocalPrefs = {
  displayName?: string;
  gender?: Gender;
  country?: string;
  city?: string;
  avatarDataUrl?: string;
  
};
const readPrefs = (): LocalPrefs => {
  try { return JSON.parse(localStorage.getItem("user:prefs")||"{}"); } catch { return {}; }
};
const writePrefs = (p: LocalPrefs) => {
  try { localStorage.setItem("user:prefs", JSON.stringify(p)); } catch {}
};

export default function SyncProfile() {
  const { data: session } = useSession();
  const email = session?.user?.email ?? null;

  const [loading, setLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!email) return;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const r = await fetch(`/api/profile?email=${encodeURIComponent(email)}`);
        const j = await r.json();
        if (j?.profile) {
          // دمج من السحابة إلى المحلي (دون الكتابة القسرية إن كان المحلي ممتلئًا)
          const local = readPrefs();
          const cloud = j.profile;
          const merged: LocalPrefs = {
            displayName: local.displayName ?? cloud.name ?? "",
            gender: local.gender ?? cloud.gender ?? undefined,
            country: local.country ?? cloud.country ?? undefined,
            city: local.city ?? cloud.city ?? undefined,
            avatarDataUrl: local.avatarDataUrl ?? cloud.avatarUrl ?? undefined,
            
          };
          writePrefs(merged);
        }
      } catch (e:any) {
        setErr(e?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, [email]);

  const pushToCloud = async () => {
    if (!email) return;
    setLoading(true);
    setErr(null);
    try {
      const p = readPrefs();
      const r = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({
          email,
          data: {
            name: p.displayName ?? "",
            gender: p.gender ?? null,
            country: p.country ?? null,
            city: p.city ?? null,
            avatarUrl: p.avatarDataUrl ?? null,
            
          }
        })
      });
      if (!r.ok) throw new Error(await r.text());
      setLastSaved(new Date().toLocaleTimeString());
    } catch (e:any) {
      setErr(e?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  if (!email) return null; // يظهر فقط عند تسجيل الدخول

  return (
    <div className="rounded-xl border border-white/15 bg-white/5 p-3 mb-4">
      <div className="text-sm opacity-80 mb-2">Signed in as <b>{email}</b></div>
      <button
        className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20"
        onClick={pushToCloud}
        disabled={loading}
        title="Sync settings to your account"
      >
        {loading ? "Saving…" : "Save profile to account"}
      </button>
      {lastSaved && <span className="ml-3 text-xs opacity-70">Saved at {lastSaved}</span>}
      {err && <div className="mt-2 text-xs text-red-400">{err}</div>}
    </div>
  );
}
