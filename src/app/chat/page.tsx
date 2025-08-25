'use client'
import { on as busOn, emit } from "@/utils/bus";
import { init as initRotator } from "@/utils/match-rotator";
import "@/utils/media-bridge";                // mic/cam/speaker + masks + beauty + swipe(H80/V50)
import useSwipeNav from "@/hooks/useSwipeNav"; // أفقي ≥80px → prev/next
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import Toolbar from "@/components/chat/Toolbar";                   // شريط الأدوات R→L (له زر السماعة)
import ChatMessages, { type ChatMsg } from "@/components/chat/ChatMessages";
import PeerHeader, { type PeerInfo } from "@/components/chat/PeerHeader";
import LowerRightQuick from "@/components/chat/LowerRightQuick";   // Switch Cam + Beauty + VIP + Likes
import ChatComposer from "@/components/chat/ChatComposer";         // Composer مع زر الإيموجي
import useSocketProbe from "@/hooks/useSocketProbe";

export default function ChatPage() {
  // ==== تفضيلات ومؤشرات الحالة ====
  const [countryPref, setCountryPref] = useState<string>("");
  const [genderPref,  setGenderPref]  = useState<string>("any");

  const [isVip,      setIsVip]      = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [peerLiked,  setPeerLiked]  = useState<boolean>(false);

  const [msgMode, setMsgMode] = useState<"latest"|"history">("latest");
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: "m1", from: "peer", text: "👋 Hi there" },
  ]);

  const [peer, setPeer] = useState<PeerInfo>({
    name: "Guest", country: "Kuwait", city: "Kuwait City", gender: "♂", likes: 123, vip: true,
  });

  const [beautyIdx, setBeautyIdx] = useState<number>(() => {
    try { return Number(localStorage.getItem("beautyIdx")||"0"); } catch { return 0; }
  });
  const [matchId, setMatchId] = useState<string | null>(null);

  // ==== تحميل/حفظ التفضيلات ====
  useEffect(() => {
    try {
      setIsVip((localStorage.getItem("isVip")||"0")==="1");
      setLikesCount(Number(localStorage.getItem("likesCount")||"0"));
      setCountryPref(localStorage.getItem("countryPref")||"");
      setGenderPref(localStorage.getItem("genderPref")||"any");
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("isVip", isVip ? "1":"0");
      localStorage.setItem("likesCount", String(likesCount));
      localStorage.setItem("countryPref", countryPref||"");
      localStorage.setItem("genderPref", genderPref||"any");
    } catch {}
  }, [isVip, likesCount, countryPref, genderPref]);

  // ==== Bus: التاريخ/الأحدث (السحب الرأسي من media-bridge) ====
  useEffect(() => {
    const off1 = busOn("history", () => setMsgMode("history"));
    const off2 = busOn("latest",  () => setMsgMode("latest"));
    return () => { off1?.(); off2?.(); };
  }, []);

  // ==== Rotator: تحديث النظير عند next/prev (بدون أي Banner بصري) ====
  useEffect(() => {
    initRotator(); // يضبط مُولِّد المطابقات
    const onMC = (e: any) => {
      const p = e.detail?.peer; if (!p) return;
      setPeer({
        name: p.name, gender: p.gender as any,
        country: p.country, region: p.region, likes: p.likes, vip: !!p.vip
      });
      setMatchId(p.id ?? null);
      try { setPeerLiked(localStorage.getItem(`peerLiked:${p.id}`)==="true"); } catch {}
      // مهم: لا نضيف أي رسالة "Matched with ..." — المواصفة تمنع ظهور أي Banner تاريخ.
      setMsgMode("latest");
    };
    document.addEventListener("match-change", onMC as any);
    return () => document.removeEventListener("match-change", onMC as any);
  }, []);

  // ==== إرسال الرسائل ====
  const onSend = useCallback((t: string) => {
    const text = t.trim(); if (!text) return;
    setMessages(m => [...m, { id: crypto.randomUUID(), from: "me", text }]);
    setMsgMode("latest");
  }, []);

  // ==== Like (مرة لكل مطابقة + تخزين peerLiked:<matchId>) ====
  const handleToggleLike = useCallback(() => {
    setPeerLiked(v => {
      const nv = !v;
      setPeer(p => ({ ...p, likes: Math.max(0, (p.likes||0) + (nv?1:-1)) }));
      try {
        const key = matchId ? `peerLiked:${matchId}` : "peerLiked:current";
        localStorage.setItem(key, nv ? "true" : "false");
      } catch {}
      return nv;
    });
  }, [matchId]);

  // ==== أزرار/إيماءات التنقل ====
  const handlePrev = useCallback(() => { try { emit("prev"); } catch {} }, []);
  const handleNext = useCallback(() => { try { emit("next"); } catch {} }, []);
  useSwipeNav({ onNext: handleNext, onPrev: handlePrev, threshold: 80 });

  // ==== السماعة/المايك/الكام/البيوتي ====
  const handleToggleMute = useCallback(() => {
    try { (window as any).__SPK_MUTED = !(window as any).__SPK_MUTED; emit("toggle-speaker", { muted: !!(window as any).__SPK_MUTED }); } catch {}
  }, []);
  const handleToggleMic = useCallback(() => {
    try { (window as any).__MIC_ON = !(window as any).__MIC_ON; emit("toggle-mic", { muted: !(window as any).__MIC_ON }); } catch {}
  }, []);
  const handleSwitchCam = useCallback(() => {
    try { (window as any).__CAM_ON = !(window as any).__CAM_ON; emit("toggle-cam", { muted: !(window as any).__CAM_ON }); } catch {}
  }, []);
  const handleBeauty = useCallback(() => {
    const n = (Number(beautyIdx)||0) + 1; const nx = n % 6;
    setBeautyIdx(nx);
    try { localStorage.setItem("beautyIdx", String(nx)); emit("beauty-mode", { idx: nx }); } catch {}
  }, [beautyIdx]);

  // ==== فحص Socket فقط (بدون اعتماد فعلي) ====
  useSocketProbe();

  // ==== أوفست الرسائل: يعتمد على ارتفاع الشريط + المؤلف ====
  const messagesBottom = "8px";

  return (
    <main
      className="min-h-[100dvh] w-screen overflow-hidden text-white bg-gradient-to-b from-slate-900 via-slate-900 to-black"
      style={{ touchAction: "pan-x" }}  // لنتجنّب التعارض مع الإيماءات
    >
      <div className="grid grid-rows-[1fr_1fr_auto_auto] h-[100dvh]">
        {/* صف 1: القسم العلوي (Peer) */}
        <div className="relative">
          <PeerHeader
            info={peer}
            filters={{ countryPref, genderPref }}
            onFiltersChange={(f)=>{ setCountryPref(f.countryPref); setGenderPref(f.genderPref); }}
          />
        </div>

        {/* صف 2: القسم السفلي (أنا + Quick) */}
        <div className="relative">
          <div className="absolute right-2 bottom-2 z-30">
            <LowerRightQuick
              onSwitchCam={handleSwitchCam}
              onBeauty={handleBeauty}
              beautyOn={Number(beautyIdx) > 0}
              likesCount={likesCount}
              isVip={isVip}
            />
          </div>

          {/* رسائل شفافة فوق الفيديو (latest=3 / history=all) */}
          <div className="absolute inset-x-3 z-20 pointer-events-none"
               style={{ bottom: messagesBottom }}>
            <ChatMessages items={messages} mode={msgMode} />
          </div>
        </div>

        {/* صف 3: Composer (فوق شريط الأدوات مباشرة) */}
        <ChatComposer open onSend={onSend} />

        {/* صف 4: Toolbar (أسفل الشاشة) */}
        <div className="px-3 pb-3">
          <Toolbar
            // R→L: Next | (Speaker) | Mic | Like | Mask | Settings | Report | Prev
            onNext={handleNext}
            onPrev={handlePrev}
            onToggleMute={handleToggleMute}   // زر السماعة
            onToggleMic={handleToggleMic}     // زر المايك
            onToggleLike={handleToggleLike}
            onSettings={()=>{ location.href="/settings"; }}
            onReport={()=>{ console.log("[report]"); }}
          />
        </div>
      </div>
    </main>
  );
}
