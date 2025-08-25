"use client";

import React, { useState } from "react";
import Toolbar from "@/components/chat/Toolbar";
import LowerRightQuick from "@/components/chat/LowerRightQuick";
import ChatComposer from "@/components/chat/ChatComposer";
import ChatMessages from "@/components/chat/ChatMessages";

export default function ChatPage() {
  // رسائل بسيطة (type مرن لتفادي أي تعارضات قديمة)
  const [messages, setMessages] = useState<any[]>([
    { id: "seed-1", from: "peer", text: "Hello 👋" },
    { id: "seed-2", from: "me", text: "Hi! How are you?" },
  ]);
  const addMessage = (t: string) =>
    setMessages((prev) => [...prev, { id: Date.now().toString(), from: "me", text: t }]);

  // حالات/ردود أفعال وهمية مؤقتًا (اربطها لاحقًا بـ WebRTC)
  const micOn = true, camOn = true, speakerOn = true, composerOpen = true, isVip = true, beautyOn = false;
  const handlePrev = () => {};
  const handleNext = () => {};
  const handleStop = () => {};
  const handleToggleChat = () => {};
  const handleToggleMic = () => {};
  const handleToggleCam = () => {};
  const handleToggleSpeaker = () => {};
  const handleSwitchCam = () => {};
  const handleReport = () => {};
  const handleBeauty = () => {};
  const handleMask = () => {};
  const handleSettings = () => {};
  const handleLike = () => {};

  return (
    <div
      className="min-h-[100dvh] w-screen overflow-hidden text-white bg-gradient-to-b from-slate-900 via-slate-900 to-black"
      style={{ touchAction: "pan-x" }}
    >
      {/* تخطيط 50% أعلى لعرض الفيديو/المشهد + 50% أسفل */}
      <div className="grid grid-rows-2 h-[100dvh]">
        {/* القسم العلوي (Stage) */}
        <div className="relative flex items-center justify-center select-none">
          <div className="opacity-70 text-center">
            <div className="text-2xl font-semibold">Stage / Video</div>
            <div className="text-sm">المشهد الأساسي يبقى مرئيًا دائمًا</div>
          </div>
        </div>

        {/* القسم السفلي (Self/ground) */}
        <div className="relative">
          {/* رصيف الرسائل الشفّاف داخل النصف السفلي، فوق شريط الأدوات/الكيبورد */}
          <div
            className="absolute inset-x-0"
            style={{ bottom: `calc(var(--tb-h) + var(--kb-pad) + var(--safe-b))` }}
          >
            <ChatMessages items={messages} />
          </div>
        </div>
      </div>

      {/* طبقة عناصر أسفل الشاشة */}
      <div data-bottom-overlay="1">
        {/* زرّا Switch Cam + Beauty في أعلى يمين النصف السفلي */}
        <LowerRightQuick
          onSwitchCam={handleSwitchCam}
          onBeauty={handleBeauty}
          beautyOn={beautyOn}
        />

        {/* شريط الأدوات دائم الظهور ويحسب --tb-h تلقائيًا */}
        <Toolbar
          onPrev={handlePrev}
          onNext={handleNext}
          onStop={handleStop}
          onToggleChat={handleToggleChat}
          onToggleMic={handleToggleMic}
          onToggleCam={handleToggleCam}
          onToggleSpeaker={handleToggleSpeaker}
          onSwitchCam={handleSwitchCam}
          onReport={handleReport}
          onBeauty={handleBeauty}
          onMask={handleMask}
          onSettings={handleSettings}
          onLike={handleLike}
          micOn={micOn}
          camOn={camOn}
          speakerOn={speakerOn}
          composerOpen={composerOpen}
          isVip={isVip}
        />
      </div>

      {/* شريط الكتابة (شفّاف ويقف فوق شريط الأدوات تلقائيًا عبر --tb-h/--kb-pad) */}
      <ChatComposer onSend={addMessage} />
    </div>
  );
}
