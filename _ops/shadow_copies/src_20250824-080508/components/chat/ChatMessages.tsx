
"use client";
import React, { useEffect, useRef } from "react";
export type ChatMsg = { id: string; mine?: boolean; text: string; at: number };
export default function ChatMessages({ msgs }: { msgs: ChatMsg[] }) {
  const endRef = useRef<HTMLDivElement | null>(null);
  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth", block:"end"}); },[msgs.length]);
  return (
    <div className="absolute top-4 left-4 rounded-2xl bg-black/35 backdrop-blur-md shadow-lg p-3 overflow-y-auto pointer-events-auto"
         style={{ width: "86vw", height: "34vh" }}>
      <div className="flex flex-col gap-2">
        {msgs.map(m=>(
          <div key={m.id} className={`w-full flex ${m.mine?"justify-end":"justify-start"}`}>
            <div className={`max-w-[78%] px-3 py-2 text-sm rounded-2xl ${m.mine?"bg-[#1A74FF] text-white rounded-br-sm":"bg-white text-slate-900 rounded-bl-sm"}`}>{m.text}</div>
          </div>
        ))}
        <div ref={endRef}/>
      </div>
      <style>{`@media (min-width:1024px){.absolute.top-4.left-4.rounded-2xl.bg-black\\/35{width:40vw;height:300px;}}`}</style>
    </div>
  );
}
