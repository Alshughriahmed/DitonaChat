"use client";

import React, { useEffect, useRef, useState } from "react";

type Props = {
  open: boolean;
  onSend: (text: string) => void;
  onClose?: () => void;
};

export default function ChatComposer({ open, onSend, onClose }: Props) {
  const composerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");

  // حدّث --composer-h و --kb-pad
  useEffect(() => {
    const updateHeights = () => {
      const h = composerRef.current?.offsetHeight || 0;
      document.documentElement.style.setProperty("--composer-h", `${h}px`);
    };
    updateHeights();
    const ro = new ResizeObserver(updateHeights);
    if (composerRef.current) ro.observe(composerRef.current);

    const vv = (window as any).visualViewport;
    const onVV = () => {
      const pad = Math.max(0, (vv?.height ? window.innerHeight - vv.height : 0));
      document.documentElement.style.setProperty("--kb-pad", `${pad}px`);
    };
    vv?.addEventListener?.("resize", onVV);
    onVV();

    return () => {
      ro.disconnect();
      vv?.removeEventListener?.("resize", onVV);
    };
  }, [open]);

  if (!open) return null;

  const send = () => {
    const t = text.trim();
    if (!t) return;
    onSend(t);
    setText("");
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div
      ref={composerRef}
      data-composer-version="v3"
      className="fixed left-0 right-0 z-20 px-3 pb-2"
      style={{ bottom: "calc(var(--tb-h,64px) + var(--kb-pad,0px) + var(--safe-b,0px))" }}
      aria-label="Chat composer"
    >
      <div className="mx-auto max-w-screen-sm">
        <div className="flex items-center gap-2 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 px-3 py-2">
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") send(); }}
            placeholder="Type a message…"
            className="flex-1 bg-transparent outline-none placeholder-white/60"
            aria-label="Type a message"
          />
          <button
            onClick={send}
            className="rounded-xl px-3 py-1 bg-white/10 hover:bg-white/20"
            aria-label="Send"
          >
            Send
          </button>
          <button
            onClick={onClose}
            className="rounded-xl px-3 py-1 bg-white/10 hover:bg-white/20"
            aria-label="Close"
          >
            X
          </button>
        </div>
      </div>
    </div>
  );
}
