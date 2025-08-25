"use client";
import React, { useEffect, useRef } from "react";

type Props = {
  onPrev: () => void;
  onNext: () => void;
  onStop: () => void;
  onToggleChat: () => void;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onToggleSpeaker: () => void;
  onSwitchCam: () => void;
  onReport: () => void;
  onBeauty: () => void;
  onSettings: () => void;
  onLike: () => void;
  micOn: boolean;
  camOn: boolean;
  speakerOn: boolean;
  beautyOn: boolean;
  composerOpen: boolean;
};

export default function Toolbar({
  onPrev, onNext, onStop, onToggleChat, onToggleMic, onToggleCam,
  onToggleSpeaker, onSwitchCam, onReport, onBeauty, onSettings, onLike,
  micOn, camOn, speakerOn, beautyOn, composerOpen
}: Props) {
  const barRef = useRef<HTMLDivElement | null>(null);

  // قياس ارتفاع الشريط --tb-h مع مراعاة safe-area
  useEffect(() => {
    const root = document.documentElement;
    if (!root.style.getPropertyValue("--safe-b")) {
      root.style.setProperty("--safe-b", "env(safe-area-inset-bottom)");
    }
    const update = () => {
      const el = barRef.current; if (!el) return;
      const rect = el.getBoundingClientRect();
      const safeStr = getComputedStyle(root).getPropertyValue("--safe-b").trim();
      const safe = parseFloat(safeStr || "0") || 0;
      root.style.setProperty("--tb-h", `${Math.max(0, Math.round(rect.height - safe))}px`);
    };
    const ro = new ResizeObserver(update);
    if (barRef.current) ro.observe(barRef.current);
    update();
    addEventListener("resize", update);
    addEventListener("orientationchange", update);
    return () => {
      ro.disconnect();
      removeEventListener("resize", update);
      removeEventListener("orientationchange", update);
    };
  }, []);

  // أيقونة دائرية ثانوية
  const icon = "rounded-full flex items-center justify-center transition-all active:scale-95 bg-white/10 hover:bg-white/20 backdrop-blur";
  const iconSz = "w-10 h-10 md:w-11 md:h-11";
  const active = "bg-sky-600 text-white hover:bg-sky-600";

  return (
    // داخل صف الـGrid (لا fixed)
    <div
      ref={barRef}
      data-toolbar-version="sketch-v2"
      className="relative z-20 bg-black/60 backdrop-blur-md border-t border-white/10 px-3 py-3 md:py-4 text-white"
      style={{ paddingBottom: "var(--safe-b,0px)" }}
    >
      {/* الصف العلوي: Prev | (Stop + Show Chat) | Next */}
      <div className="grid grid-cols-5 md:grid-cols-8 grid-rows-2 place-items-center gap-2 md:gap-3">
        {/* Prev (يسار) */}
        <button
          type="button"
          onClick={onPrev}
          aria-label="Previous"
          title="Previous"
          className="h-11 md:h-12 px-4 md:px-5 rounded-xl bg-white/10 hover:bg-white/20 text-smrounded-lg bg-white/10 hover:bg-white/20 active:scale-95 h-12 w-[74px] md:w-[84px] px-3"
        >
          <span className="text-sm font-medium">←</span>
        </button>

        {/* الوسط: Stop + Show Chat */}
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={onStop}
            aria-label="Stop"
            title="Stop"
            className="px-4 h-10 md:h-11 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-smrounded-lg bg-red-600/80 hover:bg-red-600 active:scale-95 text-white px-4 h-12"
          >
            <span className="text-sm font-semibold">Stop</span>
          </button>
          <button
            type="button"
            onClick={onToggleChat}
            aria-label="Show/Hide Chat"
            title="Show/Hide Chat"
            className={`rounded-lg ${composerOpen ? "bg-white/20" : "bg-white/10"} hover:bg-white/20 active:scale-95 px-4 h-12`}
          >
            <span className="text-sm font-medium">Show Chat</span>
          </button>
        </div>

        {/* Next (يمين) */}
        <button
          type="button"
          onClick={onNext}
          aria-label="Next"
          title="Next"
          className="h-11 md:h-12 px-4 md:px-5 rounded-xl bg-white/10 hover:bg-white/20 text-smrounded-lg bg-white/10 hover:bg-white/20 active:scale-95 h-12 w-[74px] md:w-[84px] px-3"
        >
            <span className="text-sm font-medium">→</span>
        </button>
      </div>

      {/* الصف السفلي: شبكة صفَّين لباقي الأزرار */}
      <div className="grid grid-cols-5 md:grid-cols-8 grid-rows-2 place-items-center gap-2 md:gap-3">
        {/* Mic */}
        <button type="button" onClick={onToggleMic} aria-label="Mic on/off" title="Mic on/off"
          className={`${icon} ${iconSz} ${!micOn ? active : ""}`}>{micOn ? "🎙️" : "🔇"}</button>
        {/* Cam */}
        <button type="button" onClick={onToggleCam} aria-label="Cam on/off" title="Cam on/off"
          className={`${icon} ${iconSz} ${!camOn ? active : ""}`}>🎥</button>
        {/* Switch Camera */}
        <button type="button" onClick={onSwitchCam} aria-label="Switch Camera" title="Switch Camera"
          className={`${icon} ${iconSz}`}>🔄</button>
        {/* Speaker */}
        <button type="button" onClick={onToggleSpeaker} aria-label="Speaker on/off" title="Speaker on/off"
          className={`${icon} ${iconSz} ${!speakerOn ? active : ""}`}>{speakerOn ? "🔊" : "🔇"}</button>
        {/* Beauty */}
        <button type="button" onClick={onBeauty} aria-label="Beauty" title="Beauty"
          className={`${icon} ${iconSz} ${beautyOn ? active : ""}`}>✨</button>
        {/* Mask (stub) */}
        <button type="button" onClick={() => ((window as any).__ditona?.toggleMask?.())} aria-label="Mask" title="Mask"
          className={`${icon} ${iconSz}`}>🎭</button>
        {/* Settings */}
        <button type="button" onClick={onSettings} aria-label="Settings" title="Settings"
          className={`${icon} ${iconSz}`}>⚙️</button>
        {/* Like */}
        <button type="button" onClick={onLike} aria-label="Like" title="Like"
          className={`${icon} ${iconSz}`}>❤️</button>
        {/* Report */}
        <button type="button" onClick={onReport} aria-label="Report" title="Report"
          className={`${icon} ${iconSz}`}>⚠️</button>
      </div>
    </div>
  );
}
