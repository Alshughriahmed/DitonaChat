"use client";
import React, { useEffect, useRef, useState } from "react";

export default function ChatComposer({ open, onSend }: { open: boolean; onSend: (t: string)=>void }) {
  const [text, setText] = useState("");
  const composerRef = useRef<HTMLDivElement>(null);

  // كتابة ارتفاع الدرج في --composer-h عندما يكون ظاهرًا
  useEffect(() => {
    if (!open) { document.documentElement.style.setProperty("--composer-h","0px"); return; }
    const setH = () => {
      const h = composerRef.current?.offsetHeight || 0;
      document.documentElement.style.setProperty("--composer-h", `${h}px`);
    };
    setH();
    const ro = new ResizeObserver(setH);
    if (composerRef.current) ro.observe(composerRef.current);
    return () => ro.disconnect();
  }, [open]);

  const send = () => {
    const t = text.trim(); if (!t) return;
    onSend(t); setText("");
  };

  if (!open) return null;

  return (
    <div ref={composerRef}
         className="fixed left-0 right-0 z-20 px-3 pb-2"
         style={{ bottom: "calc(var(--tb-h) + var(--safe-b))" }}
         aria-label="Chat composer">
      <div className="mx-auto max-w-[min(980px,calc(100%-16px))]">
        <div className="rounded-2xl bg-black/35 backdrop-blur-md shadow p-2 flex items-center gap-2">
          <input
            value={text}
            onChange={(e)=>setText(e.target.value)}
            onKeyDown={(e)=> e.key==="Enter" && send()}
            placeholder="اكتب رسالة…"
            className="flex-1 bg-transparent outline-none text-white placeholder:text-white/60"
          />
          <button onClick={send} className="px-3 h-10 rounded-xl bg-sky-600 hover:bg-sky-500 text-white">Send</button>
        </div>
      </div>
    </div>
  );
}
