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

export default function Toolbar(props: Props) {
  const barRef = useRef<HTMLDivElement | null>(null);

  // قياس الارتفاع وتحديث --tb-h بشكل مُهدّأ ومشروط (لا تحديث إن لم يتغيّر)
  useEffect(() => {
    const root = document.documentElement;
    let last = -1;
    let raf = 0;
    const setH = (h: number) => {
      if (h !== last) {
        last = h;
        root.style.setProperty("--tb-h", `${h}px`);
      }
    };
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = Math.round(barRef.current?.getBoundingClientRect().height || 0);
        setH(h);
      });
    });
    if (barRef.current) {
      ro.observe(barRef.current);
      // أول قياس
      const h = Math.round(barRef.current.getBoundingClientRect().height || 0);
      setH(h);
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  const baseBtn = "rounded-full grid place-items-center select-none";
  const iconBtn = `${baseBtn} h-9 w-9 md:h-10 md:w-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm`;
  const textBtn = `${baseBtn} h-9 md:h-10 px-3 bg-white/10 hover:bg-white/20 text-sm md:text-base`;

  return (
    <div
      ref={barRef}
      className="fixed bottom-0 left-0 right-0 z-30"
      style={{ paddingBottom: "var(--safe-b,0px)" }}
      data-toolbar-version="trim-v1"
    >
      <div className="mx-auto max-w-screen-sm px-2 pb-2">
        <div className="flex items-center justify-between gap-2">
          {/* يسار: Prev */}
          <button className={textBtn} onClick={props.onPrev} aria-label="Prev">Prev</button>

          {/* الوسط: مجموعة الأيقونات (صفّان على الموبايل، سطر واحد على md+) */}
          <div className="grid grid-cols-5 grid-rows-2 gap-1 md:grid-cols-10 md:grid-rows-1 bg-black/35 backdrop-blur-md rounded-2xl px-2 py-1">
            <button className={iconBtn} onClick={props.onToggleChat} aria-label="Chat">💬</button>
            <button className={iconBtn} onClick={props.onToggleCam} aria-label="Cam on/off">{props.camOn ? "🎥" : "🚫🎥"}</button>
            <button className={iconBtn} onClick={props.onSwitchCam} aria-label="Switch camera">🔄</button>
            <button className={iconBtn} onClick={props.onToggleMic} aria-label="Mic on/off">{props.micOn ? "🎙️" : "🔇"}</button>
            <button className={iconBtn} onClick={props.onToggleSpeaker} aria-label="Speaker on/off">{props.speakerOn ? "🔊" : "🔇"}</button>
            <button className={`${iconBtn} bg-red-600/90 hover:bg-red-600`} onClick={props.onStop} aria-label="Stop">⏹</button>
            <button className={iconBtn} onClick={props.onBeauty} aria-label="Beauty">✨</button>
            <button className={iconBtn} onClick={props.onReport} aria-label="Report">⚠️</button>
            <button className={iconBtn} onClick={props.onSettings} aria-label="Settings">⚙️</button>
            <button className={iconBtn} onClick={props.onLike} aria-label="Like">❤️</button>
          </div>

          {/* يمين: Next */}
          <button className={textBtn} onClick={props.onNext} aria-label="Next">Next</button>
        </div>
      </div>
    </div>
  );
}
