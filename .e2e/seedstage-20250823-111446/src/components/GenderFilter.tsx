"use client";
import React, {useState} from "react";

export type Gender = "all"|"male"|"female"|"couple"|"lgbtq";
const META: Record<Exclude<Gender,"all">, {label:string;color:string;icon:string}> = {
  female: {label:"Female", color:"#FF3B30", icon:"♀"},
  male:   {label:"Male",   color:"#0A84FF", icon:"♂"},
  couple: {label:"Couple", color:"#FF3B30", icon:"❤"},
  lgbtq:  {label:"LGBTQ",  color:"#FFFFFF", icon:"🏳️‍🌈"},
};

export default function GenderFilter({
  value, onChange, isVip, requireVip
}:{
  value: Gender; onChange:(g:Gender)=>void; isVip:boolean; requireVip:(f:string)=>void;
}){
  const [open,setOpen]=useState(false);
  const active = value!=="all";
  const choose=(g:Gender)=>{
    if (!isVip && g!=="all"){ requireVip("Choose gender"); return; }
    onChange(g); setOpen(false);
  };
  return (
    <div className="gf-wrap">
      <button className={`pill ${active?"active":""}`} onClick={()=>setOpen(v=>!v)} aria-haspopup="menu" aria-expanded={open}>
        <span className="icon">{value==="all"?"⚥":(META as any)[value]?.icon}</span>
        <span>{value==="all"?"All":(META as any)[value]?.label}</span>
        <span className="caret">▾</span>
      </button>
      {open && (
        <div className="menu" role="menu">
          <div className="opt" onClick={()=>choose("all")}><span className="icon">🌐</span>All</div>
          {(["female","male","couple","lgbtq"] as Gender[]).map(k=>(
            <div key={k} className="opt" onClick={()=>choose(k)}>
              <span className="icon">{(META as any)[k].icon}</span>
              <span className="label">{(META as any)[k].label}</span>
            </div>
          ))}
        </div>
      )}
      <style jsx>{`
        .gf-wrap{ position:relative; }
        .pill{ display:inline-flex; align-items:center; gap:8px; padding:8px 10px;
               border-radius:999px; border:1px solid rgba(255,255,255,.18);
               background:rgba(255,255,255,.06); color:#fff; font-size:13px; }
        .pill.active{ outline:2px solid rgba(255,255,255,.35); }
        .icon{ width:18px; text-align:center; }
        .caret{ opacity:.7 }
        .menu{ position:absolute; right:0; top:calc(100% + 8px); z-index:50;
               background:#0f1115; color:#fff; border:1px solid rgba(255,255,255,.15);
               border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,.4); width:200px; }
        .opt{ padding:10px 12px; display:flex; align-items:center; gap:10px; cursor:pointer; }
        .opt:hover{ background:rgba(255,255,255,.06); }
      `}</style>
    </div>
  );
}
