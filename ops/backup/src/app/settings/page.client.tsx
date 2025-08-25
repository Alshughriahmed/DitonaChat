import dynamic from "next/dynamic";
const SyncProfile = dynamic(()=>import("@/components/SyncProfile"),{ ssr:false });
"use client";

import React, { useRef, useState } from "react";
import { usePrefs, isVip, type UserPrefs } from "@/utils/prefs";

function Section({title, children}:{title:string, children:React.ReactNode}){
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
        {children}
      </div>
    </section>
  );
}

export default function SettingsPage(){
  const [prefs, setPrefs] = usePrefs();
  const vip = isVip(prefs);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const fileRef = useRef<HTMLInputElement|null>(null);

  const gate = (run:()=>void) => { if (vip) run(); else setShowUpgrade(true); };

  function setP(p: Partial<UserPrefs>){
    setPrefs(prev => ({ ...prev, ...p, lang: p.language ?? prev?.lang }));
  }

  function pickAvatar(){
    fileRef.current?.click();
  }

  function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>){
    const f = e.target.files?.[0];
    if(!f) return;
    const reader = new FileReader();
    reader.onload = ()=> setP({ avatarDataUrl: String(reader.result || "") });
    reader.readAsDataURL(f);
  }

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      <div className="mx-auto max-w-2xl px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold">Settings {vip && <span className="ml-2 rounded-md border border-yellow-400/40 bg-yellow-400/10 px-2 py-0.5 text-yellow-300 text-sm">VIP</span>}</h1>

        {/* Profile */}
        <Section title="Profile">
          <div className="flex items-center gap-4">
            <button onClick={pickAvatar} className="w-16 h-16 rounded-full border border-white/20 overflow-hidden bg-white/10 flex items-center justify-center">
              {prefs.avatarDataUrl
                ? <img src={prefs.avatarDataUrl} alt="avatar" className="w-full h-full object-cover"/>
                : <span className="text-2xl">+</span>}
            </button>
            <div className="flex-1">
              <label className="block text-sm opacity-80">Display name</label>
              <input
                className="w-full mt-1 rounded-md bg-white/5 border border-white/15 px-3 py-2 outline-none"
                value={prefs.displayName ?? ""}
                onChange={e=> setP({ displayName: e.target.value })}
                placeholder="Your name"
              />
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onAvatarChange}/>
          </div>
        </Section>

        {/* Subscription */}
        <Section title="Subscription">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{vip ? "You are VIP" : "Not subscribed"}</div>
              <div className="text-sm opacity-70">{vip ? "Enjoy all premium features" : "Unlock advanced filters and features"}</div>
            </div>
            {!vip && (
              <button onClick={()=>setShowUpgrade(true)} className="rounded-lg bg-emerald-500/90 hover:bg-emerald-500 px-4 py-2 font-semibold">
                Upgrade
              </button>
            )}
          </div>
        </Section>

        {/* Language & Translate */}
        <Section title="Language & Translation">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!prefs.autoTranslate}
                onChange={e=> setP({ autoTranslate: e.target.checked })}
              />
              <span>Auto-translate messages</span>
            </label>
            <div className="ml-auto">
              <label className="text-sm opacity-80 mr-2">Language</label>
              <select
                className="rounded-md bg-white/5 border border-white/15 px-3 py-2"
                value={prefs.language ?? "en"}
                onChange={e=> setP({ language: e.target.value })}
              >
                {["en","ar","de","fr","es","tr","ru","zh","ja"].map(l=>(
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>
        </Section>

        {/* Privacy */}
        <Section title="Privacy">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!prefs.hideLocation}
              onChange={e=> gate(()=> setP({ hideLocation: e.target.checked }))}
            />
            <span>Hide my location (VIP)</span>
          </label>
        </Section>

        {/* My gender (free) */}
        <Section title="My Gender">
          <select
            className="rounded-md bg-white/5 border border-white/15 px-3 py-2"
            value={prefs.gender ?? "male"}
            onChange={e=> setP({ gender: e.target.value as any })}
          >
            <option value="male">♂ Male</option>
            <option value="female">♀ Female</option>
            <option value="couple">❤ Couple</option>
            <option value="lgbtq">🏳️‍🌈 LGBTQ</option>
          </select>
        </Section>

        {/* Intro message (VIP) */}
        <Section title="Intro (VIP)">
          <textarea
            className="w-full min-h-[90px] rounded-md bg-white/5 border border-white/15 px-3 py-2"
            placeholder="Short intro shown on match…"
            value={(prefs as any)?.name ?? ""}
            onChange={e=> gate(()=> setP({ }))}
          />
        </Section>

        {/* Socials (VIP) */}
        <Section title="Social Links (VIP)">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input className="rounded-md bg-white/5 border border-white/15 px-3 py-2" placeholder="Facebook URL"
              value={prefs.socials?.facebook ?? ""} onChange={e=> gate(()=> setP({ socials: { ...(prefs.socials||{}), facebook: e.target.value } }))}/>
            <input className="rounded-md bg-white/5 border border-white/15 px-3 py-2" placeholder="Instagram URL"
              value={prefs.socials?.instagram ?? ""} onChange={e=> gate(()=> setP({ socials: { ...(prefs.socials||{}), instagram: e.target.value } }))}/>
            <input className="rounded-md bg-white/5 border border-white/15 px-3 py-2" placeholder="Snapchat URL"
              value={prefs.socials?.snapchat ?? ""} onChange={e=> gate(()=> setP({ socials: { ...(prefs.socials||{}), snapchat: e.target.value } }))}/>
          </div>
        </Section>

        {/* Upgrade modal */}
        {showUpgrade && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="w-[min(92vw,520px)] rounded-2xl border border-white/15 bg-[#0f0f0f] p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold">Go VIP</h3>
                <button onClick={()=>setShowUpgrade(false)} className="opacity-70 hover:opacity-100">✕</button>
              </div>
              <p className="opacity-80 mb-4">Unlock gender & country filters, beauty, previous match, and more.</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button className="rounded-lg bg-white/5 border border-white/15 p-3 hover:bg-white/10">
                  <div className="font-bold">Daily</div><div className="opacity-80">$2.99</div>
                </button>
                <button className="rounded-lg bg-white/5 border border-white/15 p-3 hover:bg-white/10">
                  <div className="font-bold">Weekly</div><div className="opacity-80">$7.99</div>
                </button>
                <button className="rounded-lg bg-white/5 border border-white/15 p-3 hover:bg-white/10">
                  <div className="font-bold">Monthly</div><div className="opacity-80">$19.99</div>
                </button>
                <button className="rounded-lg bg-white/5 border border-white/15 p-3 hover:bg-white/10">
                  <div className="font-bold">Yearly</div><div className="opacity-80">$99</div>
                </button>
              </div>
              <div className="mt-4 text-right">
                <button onClick={()=>setShowUpgrade(false)} className="rounded-lg bg-emerald-500/90 hover:bg-emerald-500 px-4 py-2 font-semibold">Continue</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
