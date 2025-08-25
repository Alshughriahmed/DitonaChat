"use client";
import React from "react";

type Props = { onSwitchCam: () => void; onBeauty: () => void; beautyOn?: boolean; };

export default function LowerRightQuick({ onSwitchCam, onBeauty, beautyOn = false }: Props) {
  return (
    <div
      data-lrq="v1"
      className="fixed z-30 flex gap-2"
      style={{
        top: "calc(50dvh + 8px)",                         // مثبت بدايةً من منتصف الشاشة (القسم السفلي)
        right: "max(8px, env(safe-area-inset-right))",
      }}
    >
      <button
        aria-label="Switch camera"
        className="h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm"
        onClick={onSwitchCam}
      >🔄</button>

      <button
        aria-label="Beauty"
        className={`h-10 w-10 grid place-items-center rounded-full backdrop-blur-sm ${beautyOn ? "bg-pink-500/60" : "bg-white/10 hover:bg-white/20"}`}
        onClick={onBeauty}
      >✨</button>
    </div>
  );
}
