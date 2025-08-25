"use client";
import React, { useEffect, useRef } from "react";

type Props = {
  onPrev: () => void; onNext: () => void; onStop: () => void;
  onToggleChat: () => void; onToggleMic: () => void; onToggleCam: () => void;
  onToggleSpeaker: () => void; onSwitchCam: () => void;
  onReport: () => void; onBeauty: () => void; onSettings: () => void; onLike: () => void;
  micOn: boolean; camOn: boolean; speakerOn: boolean; composerOpen: boolean;
};

export default function Toolbar(props: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // قياس ارتفاع الشريط وكتابته في --tb-h (مرة واحدة + عند تغيير الحجم/الاتجاه)
  const setH = () => {
    const el = ref.current; if (!el) return;
    const h = Math.max(56, el.offsetHeight);
    document.documentElement.style.setProperty("--tb-h", `${h}px`);
  };

  useEffect(() => {
    setH();
    const ro = new ResizeObserver(setH);
    if (ref.current) ro.observe(ref.current);
    const vv = (window as any).visualViewport;
    const onR = () => setH();
    window.addEventListener("resize", onR);
    window.addEventListener("orientationchange", onR);
    vv?.addEventListener("resize", onR);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onR);
      window.removeEventListener("orientationchange", onR);
      vv?.removeEventListener("resize", onR);
    };
  }, []);

  const btn = "rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition px-3 py-2 text-sm md:text-base";
  const ico = "min-w-9 h-9 sm:min-w-10 sm:h-10 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 active:scale-95";

  return (
    <div ref={ref} data-toolbar-version="smart-v5"
         className="fixed bottom-0 left-0 right-0 z-30">
      <div className="mx-auto max-w-[min(980px,calc(100%-16px))]">
        <div className="min-h-[56px] px-3 py-2 bg-black/50 backdrop-blur-md rounded-t-2xl
                        flex items-center justify-between gap-2">

          {/* يسار: Prev */}
          <button onClick={props.onPrev} aria-label="Prev" className={btn}>Prev</button>

          {/* وسط: أيقونات — تتمدد وتمرير أفقي عند صغر العرض */}
          <div className="flex-1 overflow-x-auto no-scrollbar">
            <div className="min-w-[520px] flex items-center justify-center gap-3">
              <button aria-label="Chat" onClick={props.onToggleChat} className={ico}>💬</button>
              <button aria-label="Cam on/off" onClick={props.onToggleCam} className={ico}>🎥</button>
              <button aria-label="Switch camera" onClick={props.onSwitchCam} className={ico} className="hidden">🔄</button>
              <button aria-label="Mic on/off" onClick={props.onToggleMic} className={ico}>{props.micOn ? "🎙️" : "🔇"}</button>
              <button aria-label="Speaker on/off" onClick={props.onToggleSpeaker} className={ico}>{props.speakerOn ? "🔊" : "🔇"}</button>
              <button aria-label="Stop" onClick={props.onStop} className={ico}>⏹</button>
              <button aria-label="Beauty" onClick={props.onBeauty} className={ico} className="hidden">✨</button>
              <button aria-label="Report" onClick={props.onReport} className={ico}>⚠️</button>
              <button aria-label="Settings" onClick={props.onSettings} className={ico}>⚙️</button>
              <button aria-label="Like" onClick={props.onLike} className={ico}>❤️</button>
            </div>
          </div>

          {/* يمين: Next */}
          <button onClick={props.onNext} aria-label="Next" className={btn}>Next</button>
        </div>
      </div>
    </div>
  );
}
