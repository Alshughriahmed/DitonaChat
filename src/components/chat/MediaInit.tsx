"use client";
import * as React from "react";

/** Mount-only helper: prepare local stream + global toggles (dev-safe). */
export default function MediaInit(){
  React.useEffect(()=>{
    let stopped=false;
    (async ()=>{
      try{
        if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) return;
        const stream = await navigator.mediaDevices.getUserMedia({ audio:true, video:true }).catch(()=>null);
        if (!stream) return;
        if (stopped) { stream.getTracks().forEach(t=>t.stop()); return; }

        const w = window as any;
        w.__LOCAL_STREAM = stream;

        // attach to existing #localPreview video if present; else create hidden video
        const attach = (v: HTMLVideoElement) => { v.srcObject = stream; v.muted = true; v.playsInline = true; v.autoplay = true; v.play().catch(()=>{}); };
        let v = document.querySelector<HTMLVideoElement>("#localPreview");
        if (!v) {
          v = document.createElement("video");
          v.id = "dc_hidden_local";
          v.style.cssText = "position:fixed;left:-9999px;bottom:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;";
          document.body.appendChild(v);
        }
        attach(v);

        // global toggles
        w.__TOGGLE_MIC = () => {
          const tracks = (w.__LOCAL_STREAM?.getAudioTracks?.() ?? []) as MediaStreamTrack[];
          if (tracks.length===0) return null;
          const enabled = tracks.some(t=>t.enabled);
          tracks.forEach(t=> t.enabled = !enabled);
          return !enabled; // returns new state (true means mic ON)
        };
        w.__TOGGLE_CAM = () => {
          const tracks = (w.__LOCAL_STREAM?.getVideoTracks?.() ?? []) as MediaStreamTrack[];
          if (tracks.length===0) return null;
          const enabled = tracks.some(t=>t.enabled);
          tracks.forEach(t=> t.enabled = !enabled);
          return !enabled; // true means camera ON
        };
        w.__SET_SPEAKER = (muted:boolean) => {
          document.querySelectorAll("audio").forEach(a => { try{ (a as HTMLAudioElement).muted = muted; }catch{} });
          w.__SPEAKER_MUTED = !!muted;
          return !!muted;
        };
      }catch{}
    })();
    return ()=>{ stopped=true; try{ const s=(window as any).__LOCAL_STREAM; s?.getTracks?.().forEach((t:MediaStreamTrack)=>t.stop()); }catch{} };
  },[]);
  return null;
}
