"use client";
import React, { useMemo } from "react";

export type ChatMsg = { id: string; from: "me" | "peer"; text: string; ts?: number };

export default function ChatMessages({
  items,
  mode = "latest",
}: {
  items?: ChatMsg[] | null;              // ← نجعلها اختيارية
  mode?: "latest" | "history";
}) {
  // طبّق حارس أمان: حوّل لأي Array دائمًا
  const src = Array.isArray(items) ? items : [];

  const list = useMemo(
    () => (mode === "latest" ? src.slice(-3) : src),
    [src, mode]
  );

  if (list.length === 0) {
    // لا نعرض شيء لو ما في رسائل
    return null;
  }

  return (
    <div
      data-messages-version="dock-v1"
      className="pointer-events-auto px-3 pb-2"
      aria-live="polite" aria-atomic="false"
    >
      <div className={`flex flex-col gap-2 ${mode === "latest" ? "pt-2" : ""}`}>
        {list.map((m) => (
          <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            <span
        className="msg-bubble select-text"
        onPointerDown={(e)=>{ const el=e.currentTarget as HTMLSpanElement; (el as any)._lp=setTimeout(async()=>{ try{ await navigator.clipboard.writeText(el.textContent||""); el.setAttribute('data-copied','1'); setTimeout(()=>el.removeAttribute('data-copied'),700);}catch{} },500); }}
        onPointerUp={(e)=>{ const el=e.currentTarget as HTMLSpanElement; clearTimeout((el as any)._lp); }}
        onPointerLeave={(e)=>{ const el=e.currentTarget as HTMLSpanElement; clearTimeout((el as any)._lp); }}>{m.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
