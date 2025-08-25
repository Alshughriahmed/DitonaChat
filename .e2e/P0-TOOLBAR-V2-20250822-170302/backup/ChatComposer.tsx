"use client";
import React, { useRef, useState, useEffect } from "react";

export default function ChatComposer({
  open,
  onSend,
}: {
  open: boolean;
  onSend: (text: string) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");

  // لا منطق خاص هنا؛ فقط ضمان cleanup سليم
  useEffect(() => {
    return () => {};
  }, []);

  const sendNow = () => {
    const v = text.trim();
    if (!v) return;
    onSend(v);
    setText("");
    inputRef.current?.focus();
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendNow();
    }
  };

  const addEmoji = (e: string) => {
    setText((t) => t + e);
    inputRef.current?.focus();
  };

  return (
    <div
      ref={panelRef}
      className={`z-30 transition-transform duration-200 ease-out ${
        open ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {/* شريط علوي صغير (إيموجي/زرار بسيط) */}
      <div className="mb-2 mx-3 sm:mx-4 rounded-2xl bg-white/95 text-slate-900 shadow-lg p-2 grid grid-cols-8 gap-2 w-[min(560px,96vw)]">
        <button
          type="button"
          className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-slate-100 active:scale-95"
          onClick={() => addEmoji("😊")}
          aria-label="Emoji"
          title="Emoji"
        >
          😊
        </button>
        <div className="col-span-6 flex items-center">
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKey}
            placeholder="Type a message…"
            className="flex-1 min-w-0 bg-transparent outline-none text-[15px] placeholder:text-slate-400 h-10"
          />
        </div>
        <button
          type="button"
          className="rounded-full bg-sky-600 hover:bg-sky-500 active:scale-[0.98] text-white px-4 h-8"
          onClick={sendNow}
          aria-label="Send"
          title="Send"
        >
          Send
        </button>
      </div>
    </div>
  );
}
