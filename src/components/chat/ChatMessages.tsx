"use client";
import * as React from "react";

export type ChatMsg = {
  id: string;
  from: "me" | "peer";
  text: string;
  kind?: "chat" | "system" | "match";
};

export default function ChatMessages({
  items,
  mode = "latest",
}: {
  items: ChatMsg[];
  mode?: "latest" | "history";
}) {
  // فلترة: لا نظهر أي system/match ولا أي نص يبدأ بـ "Matched with"
  const visible = React.useMemo(() => {
    const base = (items || []).filter(
      (m) =>
        (m?.kind ?? "chat") === "chat" &&
        !/^\s*👋?\s*Matched with/i.test(m?.text || "")
    );
    return mode === "latest" ? base.slice(-3) : base;
  }, [items, mode]);

  // نسخ بالضغط المطوّل
  const onLong = (t: string) => {
    try { navigator.clipboard.writeText(t); } catch {}
    // Toast بسيط
    const el = document.createElement("div");
    el.textContent = "Copied";
    el.className =
      "fixed bottom-[calc(var(--tb-h,56px)+56px)] left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/70 text-white text-xs z-50";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 900);
  };

  return (
    <div className="px-3 space-y-2 select-none">
      {visible.map((m) => (
        <div
          key={m.id}
          className={
            m.from === "me"
              ? "text-right"
              : "text-left"
          }
        >
          <span
            onPointerDown={(e) => {
              let tid: any = setTimeout(() => onLong(m.text), 550);
              const stop = () => { clearTimeout(tid); document.removeEventListener("pointerup", stop); document.removeEventListener("pointercancel", stop); };
              document.addEventListener("pointerup", stop, { passive: true });
              document.addEventListener("pointercancel", stop, { passive: true });
            }}
            className={
              (m.from === "me"
                ? "bg-white/0 text-sky-200"
                : "bg-white/0 text-white") +
              " inline-block px-0 py-0" // شفافة تمامًا
            }
          >
            {m.text}
          </span>
        </div>
      ))}
    </div>
  );
}
