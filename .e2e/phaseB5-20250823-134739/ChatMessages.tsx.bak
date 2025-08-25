"use client";
import React, { useMemo } from "react";

export type ChatMsg = { id: string; from: "me" | "peer"; text: string; ts?: number };

export default function ChatMessages({ items, mode }: { items: ChatMsg[]; mode: "latest"|"history" }) {
  const list = useMemo(
    () => (mode === "latest" ? items.slice(-3) : items),
    [items, mode]
  );

  return (
    <div
      className="fixed left-0 right-0 z-10 px-3 pb-2 pointer-events-none"
      style={{ bottom: "calc(var(--tb-h) + var(--composer-h) + var(--safe-b))" }}
      aria-label="Message dock"
    >
      <div className="mx-auto max-w-[min(980px,calc(100%-16px))] pointer-events-auto">
        <div className={`flex flex-col gap-2 ${mode==="latest" ? "pt-2" : ""}`}>
          {list.map((m) => (
            <div key={m.id} className={`flex ${m.from==="me" ? "justify-end" : "justify-start"}`}>
              <span dir="auto" className="max-w-[82%] rounded-2xl px-3 py-2 shadow
                                         bg-black/40 text-white backdrop-blur-sm select-text">
                {m.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
