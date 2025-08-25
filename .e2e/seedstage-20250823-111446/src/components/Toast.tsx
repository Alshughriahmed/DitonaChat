"use client";
import React, {useEffect, useState} from "react";

export default function Toast({ text, show, onDone }:{text:string; show:boolean; onDone:()=>void;}){
  const [visible, setVisible] = useState(show);
  useEffect(()=>{ if(show){ setVisible(true); const t=setTimeout(()=>{ setVisible(false); onDone(); }, 1200); return ()=>clearTimeout(t); }},[show, onDone]);
  if (!visible) return null;
  return (
    <div className="toast">{text}
      <style jsx>{`
        .toast{
          position:fixed; top:14px; left:50%; transform:translateX(-50%);
          background:rgba(0,0,0,.75); color:#fff; padding:8px 12px; border-radius:999px;
          border:1px solid rgba(255,255,255,.18); z-index:1000; font-size:13px;
        }
      `}</style>
    </div>
  );
}
