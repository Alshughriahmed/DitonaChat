"use client";
import React, { useEffect, useRef, useState } from "react";

export default function ChatComposer({
  open = true,
  onSend,
  onClose,
}: {
  open?: boolean;
  onSend?: (text: string) => void;
  onClose?: () => void;
}) {
  const composerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");

  // حدّث --composer-h عند التغيّر
  useEffect(() => {
    const sync = () => {
      const h = composerRef.current?.offsetHeight ?? 0;
      document.documentElement.style.setProperty("--composer-h", `${h}px`);
    };
    sync();
    const ro = new ResizeObserver(sync);
    if (composerRef.current) ro.observe(composerRef.current);
    return () => ro.disconnect();
  }, []);

  // padding للكيبورد على الموبايل (اختياري بسيط)
  useEffect(() => {
    const vv = (window as any).visualViewport;
    if (!vv) return;
    const onResize = () => {
      const extra = Math.max(0, (vv.height ?? 0) - window.innerHeight);
      document.documentElement.style.setProperty("--kb-pad", `${extra}px`);
    };
    vv.addEventListener("resize", onResize);
    onResize();
    return () => vv.removeEventListener("resize", onResize);
  }, []);

  const handleSend = () => {
    const t = text.trim();
    if (!t) return;
    onSend?.(t);
    setText("");
  };

  if (!open) return null;

  return (
    <div
      ref={composerRef}
      data-composer-version="v1"
      className="fixed left-0 right-0 z-20 px-3 pb-2"
      style={{ bottom: "calc(var(--tb-h, 64px) + var(--kb-pad, 0px) + var(--safe-b, 0px))" }}
      aria-label="Chat composer"
    >
      <div className="mx-auto w-full max-w-screen-md">
        {/* شفاف: بدون خلفية، فقط حدود خفيفة */}
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border border-white/25 text-white placeholder-white/50 rounded-xl px-3 py-2 focus:outline-none"
            aria-label="Type a message"
          />
          <button
            onClick={handleSend}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20"
            aria-label="Send"
          >
            Send
          </button>
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20"
            aria-label="Close composer"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
