"use client";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  open?: boolean;                 // يظهر/يختفي الصندوق
  onSend?: (text: string) => void;
  onClose?: () => void;
};

const ChatComposer: React.FC<Props> = ({ open = true, onSend, onClose }) => {
  const composerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");

  // قياس ارتفاع الصندوق وتعبئة --composer-h + ضبط --kb-pad عبر visualViewport
  useEffect(() => {
    const updateHeights = () => {
      const h = composerRef.current?.offsetHeight ?? 0;
      document.documentElement.style.setProperty("--composer-h", `${h}px`);
    };
    updateHeights();
    const ro = new ResizeObserver(updateHeights);
    if (composerRef.current) ro.observe(composerRef.current);

    let vvHandler: any;
    if (typeof window !== "undefined" && (window as any).visualViewport) {
      const vv = (window as any).visualViewport;
      vvHandler = () => {
        const bottomPad = Math.max(0, window.innerHeight - (vv.height + vv.offsetTop));
        document.documentElement.style.setProperty("--kb-pad", `${Math.round(bottomPad)}px`);
      };
      vv.addEventListener("resize", vvHandler);
      vv.addEventListener("scroll", vvHandler);
      vvHandler();
    }

    return () => {
      ro.disconnect();
      if ((window as any).visualViewport && vvHandler) {
        const vv = (window as any).visualViewport;
        vv.removeEventListener("resize", vvHandler);
        vv.removeEventListener("scroll", vvHandler);
      }
    };
  }, []);

  if (!open) return null;

  const send = () => {
    const t = text.trim();
    if (!t) return;
    onSend?.(t);
    setText("");
    inputRef.current?.focus();
  };

  return (
    <div
      data-composer-version="v2"
      ref={composerRef}
      className="fixed left-0 right-0 z-20 px-3 pb-2" style={{ bottom: "calc(var(--tb-h, 64px) + var(--kb-pad, 0px) + var(--safe-b, 0px))" }}
      aria-label="Chat composer"
    >
      <div className="mx-auto max-w-screen-sm">
        <div className="flex items-center gap-2 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 px-3 py-2">
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type a message..."
            className="flex-1 bg-transparent outline-none placeholder:text-white/70"
            aria-label="Type a message"
          />
          <button
            onClick={send}
            className="rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1"
            aria-label="Send"
          >
            Send
          </button>
          <button
            onClick={onClose}
            className="rounded-lg bg-white/10 hover:bg-white/20 px-2 py-1"
            aria-label="Close composer"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComposer;
