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
  const {
    onPrev, onNext, onStop, onToggleChat, onToggleMic, onToggleCam,
    onToggleSpeaker, onSwitchCam, onReport, onBeauty, onSettings, onLike,
    micOn, camOn, speakerOn, beautyOn, composerOpen
  } = props;

  const barRef = useRef<HTMLDivElement | null>(null);

  // ضبط --tb-h بدون أي fixed
  useEffect(() => {
    const root = document.documentElement;
    if (!root.style.getPropertyValue("--safe-b")) {
      root.style.setProperty("--safe-b", "env(safe-area-inset-bottom)");
    }
    const update = () => {
      const el = barRef.current; if (!el) return;
      const rect = el.getBoundingClientRect();
      const safePx = parseFloat(getComputedStyle(root).getPropertyValue("--safe-b")) || 0;
      root.style.setProperty("--tb-h", `${Math.max(0, Math.round(rect.height - safePx))}px`);
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

  const icon =
    "h-10 w-10 md:h-11 md:w-11 grid place-items-center rounded-full " +
    "bg-white/10 hover:bg-white/20 backdrop-blur transition active:scale-95 shrink-0";
  const activeOn  = "bg-sky-600 text-white hover:bg-sky-600";
  const activeOff = "ring-1 ring-white/25";

  return (
    <div
      ref={barRef}
      data-toolbar-version="sketch-v3"
      className="z-20 w-full"
      style={{ paddingBottom: "var(--safe-b,0px)" }}
    >
      {/* صف علوي: Prev | شبكة الأزرار | Next */}
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 md:gap-3 px-3 md:px-4">
        {/* يسار: Prev */}
        <button
          aria-label="Prev"
          onClick={onPrev}
          className="h-11 md:h-12 px-4 md:px-5 rounded-xl bg-white/10 hover:bg-white/20 text-sm text-white/90"
        >
          Prev
        </button>

        {/* الوسط: شبكة أيقونات صفّين */}
        <div className="grid grid-cols-5 md:grid-cols-8 grid-rows-2 place-items-center gap-2 md:gap-3 py-2">
          <button
            aria-label="Stop"
            onClick={onStop}
            className="px-4 h-10 md:h-11 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-sm"
          >
            Stop
          </button>

          <button
            aria-label="Toggle Chat Panel"
            onClick={onToggleChat}
            className="px-3 h-10 md:h-11 rounded-xl bg-white/10 hover:bg-white/20 text-sm text-white/90"
          >
            {composerOpen ? "Hide Chat" : "Show Chat"}
          </button>

          <button
            aria-label="Camera on/off"
            onClick={onToggleCam}
            className={`${icon} ${!camOn ? activeOn : ""}`}
            title="Camera"
          >
            🎥
          </button>

          <button
            aria-label="Switch camera"
            onClick={onSwitchCam}
            className={`${icon} ${activeOff}`}
            title="Switch Camera"
          >
            🔁
          </button>

          <button
            aria-label="Mic on/off"
            onClick={onToggleMic}
            className={`${icon} ${!micOn ? activeOn : ""}`}
            title="Microphone"
          >
            {micOn ? "🎙️" : "🔇"}
          </button>

          <button
            aria-label="Speaker on/off"
            onClick={onToggleSpeaker}
            className={`${icon} ${!speakerOn ? activeOn : ""}`}
            title="Speaker"
          >
            {speakerOn ? "🔊" : "🔇"}
          </button>

          <button
            aria-label="Beauty"
            onClick={onBeauty}
            className={`${icon} ${beautyOn ? activeOn : ""}`}
            title="Beauty"
          >
            ✨
          </button>

          <button
            aria-label="Report"
            onClick={onReport}
            className={`${icon} ${activeOff}`}
            title="Report"
          >
            ⚠️
          </button>

          <button
            aria-label="Settings"
            onClick={onSettings}
            className={`${icon} ${activeOff}`}
            title="Settings"
          >
            ⚙️
          </button>

          <button
            aria-label="Like"
            onClick={onLike}
            className={`${icon} ${activeOff}`}
            title="Like"
          >
            ❤️
          </button>
        </div>

        {/* يمين: Next */}
        <button
          aria-label="Next"
          onClick={onNext}
          className="h-11 md:h-12 px-4 md:px-5 rounded-xl bg-white/10 hover:bg-white/20 text-sm text-white/90"
        >
          Next
        </button>
      </div>
    </div>
  );
}
