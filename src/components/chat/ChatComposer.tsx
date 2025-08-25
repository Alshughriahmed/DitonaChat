"use client";
import React, { useEffect, useRef, useState } from "react";

export default function ChatComposer({ open, onSend }: { open: boolean; onSend: (t: string)=>void }) {
  const [text, setText] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const composerRef = useRef<HTMLDivElement>(null);

  // قياس ارتفاع المؤلف وكتابته في --composer-h
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

  // غلق الـpicker بالنقر خارجاً
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("#emoji-pop") || t.closest("#emoji-btn")) return;
      setPickerOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const send = () => {
    const t = text.trim(); if (!t) return;
    onSend(t); setText("");
  };

  const addRecent = (ch: string) => {
    try {
      const key="recentEmojis";
      const cur = JSON.parse(localStorage.getItem(key) || "[]");
      const next = [ch, ...cur.filter((x:string)=>x!==ch)].slice(0, 12);
      localStorage.setItem(key, JSON.stringify(next));
    } catch {}
  };

  const addEmoji = (ch: string) => {
    setText(prev => prev + ch);
    addRecent(ch);
    setPickerOpen(false);
  };

  const recent: string[] = (() => {
    try { return JSON.parse(localStorage.getItem("recentEmojis") || "[]"); }
    catch { return []; }
  })();

  // باقة إيموجي خفيفة (قابلة للتوسعة لاحقاً)
  const EMOJIS = [
    "😀","😃","😄","😁","😆","🥹","🤣","😂","🙂","😉","😊","😍","😘","😗","😚","😙",
    "😜","🤪","😝","😛","🫠","😎","🤩","🤗","🤭","🤫","🤔","🫡","🤨","😐","😶","🙄",
    "😏","😴","🤤","🥱","🤒","🤕","🤧","🥵","🥶","🤯","😵","🥳","😇","🙏","👏","👍",
    "👎","👌","✌️","🤞","🤟","🤘","🫶","❤️","🩷","💜","💙","💚","🧡","💛","🖤","🤍",
    "🔥","✨","💫","🎉","🎊","🥰","😈","👋","✋","🤝","💋","💦","💤","🫦","🍀","🌹"
  ];

  if (!open) return null;

  return (
    <div
      ref={composerRef}
      className="w-full     px-3 pb-2">
      aria-label="Chat composer"
    >
      <div className="mx-auto max-w-[min(980px,calc(100%-16px))] relative">
        {/* Emoji Picker */}
        {pickerOpen && (
          <div
            id="emoji-pop"
            className="absolute ] left-2 w-[min(92vw,360px)] max-h-[40vh] overflow-auto rounded-2xl bg-black/85 border border-white/10 backdrop-blur-md shadow-xl p-2 z-[60]"
          >
            {recent.length > 0 && (
              <div className="mb-2">
                <div className="text-xs opacity-70 px-1 mb-1">Recent</div>
                <div className="grid grid-cols-8 gap-1">
                  {recent.map((e) => (
                    <button key={"r"+e} onClick={()=>addEmoji(e)} className="h-9 w-9 rounded-lg bg-white/5 hover:bg-white/10">{e}</button>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-8 gap-1">
              {EMOJIS.map((e) => (
                <button key={e} onClick={()=>addEmoji(e)} className="h-9 w-9 rounded-lg bg-white/5 hover:bg-white/10">{e}</button>
              ))}
            </div>
          </div>
        )}

        {/* Composer Row */}
        <div className="rounded-2xl bg-black/35 backdrop-blur-md shadow p-2 flex items-center gap-2">
          <button
            id="emoji-btn"
            onClick={()=>setPickerOpen(v=>!v)}
            className="h-10 w-10 rounded-xl bg-white/10 hover:bg-white/20 grid place-items-center"
            aria-label="Emoji picker"
          >😊</button>
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
