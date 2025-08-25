"use client";
import React from "react";
export function Toast({ text }: { text: string }) {
  return (
    <div className="fixed inset-x-0 bottom-[calc(var(--tb-h,44px)+var(--composer-h,0px)+24px)] z-50 grid place-items-center pointer-events-none">
      <div className="pointer-events-auto px-3 py-1 rounded-full text-xs bg-black/70 border border-white/10">{text}</div>
    </div>
  );
}
