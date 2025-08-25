"use client";
import React from "react";
type Props = {
  onSwitchCam: () => void;
  onBeauty: () => void;
  beautyOn?: boolean;
  likesCount?: number;
  isVip?: boolean;
};
export default function LowerRightQuick({ onSwitchCam, onBeauty, beautyOn=false, likesCount=0, isVip=false }: Props) {
  const Pill = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-flex items-center gap-1 px-2 h-7 rounded-full text-xs bg-black/40 border border-white/10 backdrop-blur-sm">{children}</span>
  );
  return (
    <div className="flex items-center gap-2">
      <button aria-label="Switch camera"
        className="h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10"
        onClick={onSwitchCam}>🔁</button>
      <button aria-label="Beauty"
        className={`h-10 w-10 grid place-items-center rounded-full backdrop-blur-sm border border-white/10 ${beautyOn ? "bg-pink-500/70" : "bg-white/10 hover:bg-white/20"}`}
        onClick={onBeauty}>✨</button>
      <Pill>❤️ {likesCount}</Pill>
      <span className={"inline-flex items-center gap-1 px-2 h-7 rounded-full text-xs bg-black/40 border border-white/10 backdrop-blur-sm vip-badge " + (!isVip ? "vip-badge--off" : "")}>👑 VIP</span>
    </div>
  );
}
