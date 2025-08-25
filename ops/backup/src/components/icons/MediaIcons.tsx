"use client";
import React from "react";

export function HeartIcon({ filled=false, color="#FF3B30" }:{filled?:boolean;color?:string}) {
  return (<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
    <path d="M12 21s-7.534-4.534-10-8.5C-0.2 8.9 2.2 5 6 5c2.09 0 3.91 1.23 4.66 3.02C11.09 6.23 12.91 5 15 5c3.8 0 6.2 3.9 4 7.5-2.466 3.966-10 8.5-10 8.5z"
      fill={filled?color:"none"} stroke={color} strokeWidth="1.5"/></svg>);
}
export function VipBadge({label="VIP"}:{label?:string}) {
  return (<span style={{
    display:"inline-flex",alignItems:"center",justifyContent:"center",
    padding:"2px 6px",borderRadius:6,background:"rgba(255,215,0,.15)",
    color:"#FFD700",fontWeight:700,fontSize:12,border:"1px solid rgba(255,215,0,.4)"
  }} aria-label="VIP">{label}</span>);
}
export function CameraSwapIcon(){
  return (<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
    <path d="M7 7h10l-1.5-2M17 17H7l1.5 2" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>);
}
export function MicIcon({muted}:{muted:boolean}){
  return (<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
    <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zm7-3a7 7 0 0 1-14 0M12 21v-3"
      fill="none" stroke="currentColor" strokeWidth="1.5"/>
    {muted && <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="1.5"/>}
  </svg>);
}
export function SpeakerIcon({muted}:{muted:boolean}){
  return (<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
    <path d="M4 10v4h4l5 4V6l-5 4H4z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    {!muted && <path d="M16 8a4 4 0 0 1 0 8M18 6a7 7 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="1.5"/>}
    {muted && <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="1.5"/>}
  </svg>);
}
export function BeautyIcon({on}:{on:boolean}){
  return (<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
    <path d="M12 3l1.8 3.6L18 8l-3.6 1.4L12 13l-2.4-3.6L6 8l4.2-1.4L12 3z"
      fill="none" stroke="currentColor" strokeWidth="1.2"/>
    {on && <circle cx="19" cy="5" r="2" fill="currentColor"/>}
  </svg>);
}
export function SettingsIcon(){
  return (<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm8-3l2-1-2-1-.6-1.6 1.2-1.6-1.6-1.2L18.6 5 18 3h-2l-.6 2-1.6.6L12 4 10.2 5.6 8.6 5 8 3H6l-.6 2-1.6.6L2 8l1.6 1.8L3 12l.6 2L2 15l1.8 2 1.6-.6L6 19h2l.6-2 1.6-.6L12 20l1.8-1.6 1.6.6.6 2h2l.6-2 1.6-.6L22 16l-1.6-1.8.6-1.2z"
      fill="none" stroke="currentColor" strokeWidth="1.1"/></svg>);
}
export function StopPlayIcon({playing}:{playing:boolean}){
  return (<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
    {playing ? (<rect x="6" y="6" width="12" height="12" fill="currentColor" rx="2"/>)
             : (<polygon points="8,6 18,12 8,18" fill="currentColor"/>)}
  </svg>);
}
export function FlagIcon(){
  return (<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
    <path d="M5 3v18M6 4h9l-1 3h-8" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>);
}
