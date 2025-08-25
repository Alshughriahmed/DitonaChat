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
  onMask?: () => void;
  onSettings: () => void;
  onLike: () => void;
  micOn: boolean;
  camOn: boolean;
  speakerOn: boolean;
  composerOpen?: boolean;
  isVip?: boolean;
};

export default function Toolbar(props: Props) {
  // يجب تعريف المرجع قبل أي useEffect
  const rootRef = useRef<HTMLDivElement>(null);

  // قياس ارتفاع الشريط وتحديث --tb-h
  useEffect(() => {
    const setH = () => {
      const h = rootRef.current?.offsetHeight ?? 0;
      document.documentElement.style.setProperty("--tb-h", `${h}px`);
    };
    setH();
    const ro = new ResizeObserver(setH);
    if (rootRef.current) ro.observe(rootRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className="fixed bottom-0 left-0 right-0 z-30 min-h-[56px] bg-black/40 backdrop-blur-md px-3 py-2 bg-black/40 backdrop-blur-md px-3 py-2"
      aria-label="Bottom toolbar"
    >
      <div className="mx-auto max-w-screen-sm flex items-center justify-between gap-3">
        <button
          onClick={props.onPrev}
          aria-label="Prev"
          className="rounded-xl bg-white/10 hover:bg-white/20 px-3 py-2"
        >
          Prev
        </button>

        {/* أيقونات في صف واحد مع تمرير أفقي عند صِغر الشاشة */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
          <button aria-label="Chat" onClick={props.onToggleChat} className="h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-white/20">💬</button>
          <button aria-label="Cam on/off" onClick={props.onToggleCam} className="h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-white/20">{props.camOn ? "🎥" : "🚫🎥"}</button>
          <button aria-label="Switch camera" onClick={props.onSwitchCam} className="h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-white/20">🔄</button>
          <button aria-label="Mic on/off" onClick={props.onToggleMic} className="h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-white/20">{props.micOn ? "🎤" : "🚫🎤"}</button>
          <button aria-label="Speaker on/off" onClick={props.onToggleSpeaker} className="h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-white/20">{props.speakerOn ? "🔊" : "🔇"}</button>
          <button aria-label="Beauty" onClick={props.onBeauty} className="h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-white/20">✨</button>
          <button aria-label="Report" onClick={props.onReport} className="h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-white/20">⚠️</button>
          <button aria-label="Settings" onClick={props.onSettings} className="h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-white/20">⚙️</button>
          <button aria-label="Like" onClick={props.onLike} className="h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-white/20">❤️</button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={props.onStop}
            aria-label="Stop"
            className="rounded-xl bg-red-600 hover:bg-red-700 px-3 py-2"
          >
            Stop
          </button>
          <button
            onClick={props.onNext}
            aria-label="Next"
            className="rounded-xl bg-white/10 hover:bg-white/20 px-3 py-2"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
