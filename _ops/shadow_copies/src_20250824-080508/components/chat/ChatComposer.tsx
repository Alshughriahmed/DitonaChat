// @ts-nocheck
'use client';
import React, { useEffect, useRef, useState } from 'react';
import EmojiPickerInline from './EmojiPickerInline';

export default function ChatComposer({ open=true, onSend }: { open?: boolean; onSend: (t:string)=>void }) {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const refWrap = useRef<HTMLDivElement>(null);

  // قياس ارتفاع الدرج وكتابته في --composer-h عندما يكون ظاهرًا
  useEffect(() => {
    const setH = () => {
      const el = refWrap.current;
      const h = el ? el.offsetHeight : 0;
      document.documentElement.style.setProperty("--composer-h", `${open ? h : 0}px`);
    };
    setH();
    const ro = new ResizeObserver(setH);
    refWrap.current && ro.observe(refWrap.current);
    const vv = (window as any).visualViewport;
    vv && vv.addEventListener("resize", setH);
    return () => { ro.disconnect(); vv && vv.removeEventListener("resize", setH); };
  }, [open]);

  const doSend = () => {
    const t = text.trim();
    if (!t) return;
    onSend(t);
    setText("");
    setShowEmoji(false);
  };

  // مخفي إن لم يكن مفتوح
  if (!open) {
    if (typeof document !== 'undefined') document.documentElement.style.setProperty("--composer-h","0px");
    return null;
  }

  return (
    <div ref={refWrap} className="px-2 pb-2">
      <div className="relative rounded-2xl bg-black/35 backdrop-blur-md shadow border border-white/10 p-2 flex items-center gap-2">
        {/* زر الإيموجي يسارًا */}
        <button
          aria-label="Emoji"
          onClick={()=>setShowEmoji(v=>!v)}
          className="h-10 w-10 grid place-items-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/10"
        >😊</button>

        {/* حقل الإدخال مرن */}
        <input
          value={text}
          onChange={e=>setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doSend(); } }}
          placeholder="Type a message…"
          className="flex-1 bg-transparent outline-none placeholder-white/50"
        />

        {/* زر الإرسال يمينًا */}
        <button
          aria-label="Send"
          onClick={doSend}
          className="h-10 px-4 rounded-xl bg-white text-black font-semibold hover:opacity-90"
        >Send</button>

        {showEmoji && <EmojiPickerInline onPick={(e)=>setText(t=>t + e)} />}
      </div>
    </div>
  );
}
