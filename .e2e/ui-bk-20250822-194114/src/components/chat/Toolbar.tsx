"use client";
import React from "react";

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
  // أزرار الحبة (Prev/Next/Show Chat/Stop)
  const pill =
    "h-11 md:h-10 px-4 md:px-5 rounded-xl bg-white/10 hover:bg-white/20 " +
    "text-sm md:text-base font-medium select-none";

  // أيقونات دائرية
  const ico =
    "h-9 w-9 md:h-11 md:w-10 grid place-items-center rounded-full " +
    "bg-white/10 hover:bg-white/20 backdrop-blur-sm select-none";

  const active = " bg-sky-600 text-white hover:bg-sky-600";

  return (
    <div
      data-toolbar-version="sketch-v3"
      className="w-full px-3 md:px-4 py-3 md:py-4"
    >
      {/* صف علوي: Prev | شبكة الأزرار | Next */}
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
        {/* يسار: Prev */}
        <button aria-label="Prev" onClick={onPrev} className={pill}>
          Prev
        </button>

        {/* الوسط: شبكة الأزرار صفّين دائمًا */}
        <div className="grid grid-cols-5 md:grid-cols-6 grid-rows-2 place-items-center gap-2 md:gap-3">
          {/* صف 1 */}
          <button
            className={ico + (composerOpen ? active : "")}
            onClick={onToggleChat}
            aria-label="Chat"
            title="Show/Hide Chat"
          >
            💬
          </button>
          <button
            className={ico + (!camOn ? active : "")}
            onClick={onToggleCam}
            aria-label="Cam on/off"
            title="Camera"
          >
            🎥
          </button>
          <button
            className={ico}
            onClick={onSwitchCam}
            aria-label="Switch camera"
            title="Switch Camera"
          >
            🔄
          </button>
          <button
            className={ico + (!micOn ? active : "")}
            onClick={onToggleMic}
            aria-label="Mic on/off"
            title="Microphone"
          >
            {micOn ? "🎙️" : "🔇"}
          </button>
          <button
            className={ico + (!speakerOn ? active : "")}
            onClick={onToggleSpeaker}
            aria-label="Speaker on/off"
            title="Speaker"
          >
            {speakerOn ? "🔊" : "🔇"}
          </button>
          {/* Stop كحبة وسطية */}
          <button
            className="h-11 md:h-10 px-4 md:px-5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white font-medium"
            onClick={onStop}
            aria-label="Stop"
            title="Stop"
          >
            Stop
          </button>

          {/* صف 2 */}
          <button
            className={ico + (beautyOn ? active : "")}
            onClick={onBeauty}
            aria-label="Beauty"
            title="Beauty"
          >
            ✨
          </button>
          <button
            className={ico}
            onClick={onReport}
            aria-label="Report"
            title="Report"
          >
            ⚠️
          </button>
          <button
            className={ico}
            onClick={onSettings}
            aria-label="Settings"
            title="Settings"
          >
            ⚙️
          </button>
          <button
            className={ico}
            onClick={onLike}
            aria-label="Like"
            title="Like"
          >
            ❤️
          </button>
          {/* Show Chat كحبة ثانية في الصف السفلي */}
          <button
            className={pill}
            onClick={onToggleChat}
            aria-label="Show Chat"
            title="Show/Hide Chat"
          >
            Show Chat
          </button>
        </div>

        {/* يمين: Next */}
        <button aria-label="Next" onClick={onNext} className={pill}>
          Next
        </button>
      </div>
    </div>
  );
}
