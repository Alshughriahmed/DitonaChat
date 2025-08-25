'use client';

import React, { useEffect, useRef, useState } from "react";
import Toolbar from "@/components/chat/Toolbar";
import LowerRightQuick from "@/components/chat/LowerRightQuick";
import ChatComposer from "@/components/chat/ChatComposer";
import ChatMessages from "@/components/chat/ChatMessages";
import PeerHeader from "@/components/chat/PeerHeader";
import { useSocketProbe } from "@/hooks/useSocketProbe";

type ChatMsg = { id: string; from: "me"|"peer"|"system"; text: string };

export default function ChatPage() {
  // فلاتر ثابتة (مع حفظ محلي)
  const [countryPref, setCountryPref] = useState<string>("");
  const [genderPref, setGenderPref]   = useState<string>("any"); // any|male|female|couple|lgbt

  // VIP / Likes (أنا كمستخدم)
  const [isVip, setIsVip] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(0);
  // Like state for peer (toolbar)
  const [peerLiked, setPeerLiked] = useState(false);
  const handleToggleLike = () => setPeerLiked(v => !v);

  useEffect(() => {
    try {
      setIsVip((localStorage.getItem("isVip")||"0")==="1");
      setLikesCount(parseInt(localStorage.getItem("likesCount")||"0",10) || 0);
      const c0 = localStorage.getItem("countryPref"); if (c0) setCountryPref(c0);
      const g0 = localStorage.getItem("genderPref");  if (g0) setGenderPref(g0);
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("isVip", isVip ? "1" : "0");
      localStorage.setItem("likesCount", String(likesCount||0));
      localStorage.setItem("countryPref", countryPref || "");
      localStorage.setItem("genderPref", genderPref || "any");
    } catch {}
  }, [isVip, likesCount, countryPref, genderPref]);

  // رسائل
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: "m1", from: "peer", text: "👋 Hi there" },
  ]);
  const addMessage = (t: string) => setMessages(m => [...m, { id: String(Date.now()), from: "me", text: t }]);

  // المعاينة المحلية (كاميرتي) في القسم السفلي
  const selfRef = useRef<HTMLVideoElement|null>(null);
  const [beautyOn, setBeautyOn] = useState(false);
  const [facing, setFacing] = useState<"user"|"environment">("user");
  const streamRef = useRef<MediaStream|null>(null);

  async function startSelf(kind: "user"|"environment" = "user") {
    try {
      streamRef.current?.getTracks().forEach(t => t.stop());
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: kind },
        audio: false
      });
      streamRef.current = s;
      if (selfRef.current) {
        selfRef.current.srcObject = s;
        await selfRef.current.play().catch(()=>{});
      }
      setFacing(kind);
    } catch (e) {
      console.warn("[selfcam] getUserMedia error", e);
    }
  }
  useEffect(()=>{ startSelf("user"); return () => streamRef.current?.getTracks().forEach(t=>t.stop()); }, []);
  const handleSwitchCam = () => startSelf(facing === "user" ? "environment" : "user");
  const handleBeauty = () => setBeautyOn(v=>!v);

  // فحص السوكت (اختياري)
  useSocketProbe();

  // تنبيهات انتقال (يمكن تعديل النصين لاحقاً)
  const [banner, setBanner] = useState("Finding your next match…");
  useEffect(()=>{
    const ids = ["Finding your next match…", "Get ready — next encounter incoming!"];
    let i = 0;
    const t = setInterval(()=>{ i = (i+1)%ids.length; setBanner(ids[i]); }, 3000);
    return ()=>clearInterval(t);
  },[]);

  // أزرار Prev/Next (مكان الربط لاحقاً)
  const handlePrev = () => console.log("[nav] prev");
  const handleNext = () => console.log("[nav] next");

  return (
    <main className="min-h-[100dvh] w-screen overflow-hidden text-white bg-gradient-to-b from-slate-900 via-slate-900 to-black">
      {/* شبكة 50% / 50% */}
      <div className="grid grid-rows-[1fr_1fr] h-[100dvh]">

        {/* القسم العلوي: المطابَق */}
        <section className="relative">
          {/* Placeholder للفيديو/صورة الطرف الآخر */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800/60 to-black/40" />
          {/* Overlay معلومات المطابَق + فلاتر ثابتة يمين أعلى */}
          <PeerHeader
            className="pointer-events-none"
            info={{
              avatarUrl: "",
              name: "Guest",
              likes: 123,
              vip: true,
              country: "KW",
              city: "Kuwait City",
              gender: "male",
              peerId: "peer-xyz",
            }}
            filters={{ countryPref, genderPref }}
            onFiltersChange={(f)=>{ setCountryPref(f.countryPref); setGenderPref(f.genderPref); }}
          />
          {/* بانر لطيف عند التنقل */}
          <div className="absolute inset-x-0 top-2 z-20 grid place-items-center pointer-events-none">
            <div className="px-3 py-1 text-xs rounded-full bg-black/50 border border-white/10">{banner}</div>
          </div>
        </section>

        {/* القسم السفلي: أنا + الرسائل + الأدوات */}
        <section className="relative">
          {/* كاميرتي أنا */}
          <video
            ref={selfRef}
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover ${beautyOn ? "beauty-filters" : ""}`}
          />
          {/* طبقة الواجهات السفلى */}
          <div className="absolute inset-0 flex flex-col justify-end">
            {/* شريط الأدوات أعلى القسم السفلي */}
            <div className="px-3 pt-2 pointer-events-auto">
              <Toolbar onPrev={handlePrev} onNext={handleNext}>
                {/* ضع هنا أزرار الوسط إذا أردت لاحقاً */}
              </Toolbar>
            </div>

            {/* الرسائل (أعلى المؤلف بقليل) */}
            <div className="flex-1 overflow-y-auto p-3 pt-4">
              <ChatMessages items={messages} mode="latest" />
            </div>

            {/* مؤلف الرسائل */}
            <div className="px-3 pb-3">
              <ChatComposer open={true} onSend={addMessage} />
            </div>
          </div>

          {/* أزرار سريعة أعلى يمين القسم السفلي */}
          <div className="absolute right-2 top-2 z-30">
            <LowerRightQuick
              onSwitchCam={handleSwitchCam}
              onBeauty={handleBeauty}
              beautyOn={beautyOn}
              likesCount={likesCount}
              isVip={isVip}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
