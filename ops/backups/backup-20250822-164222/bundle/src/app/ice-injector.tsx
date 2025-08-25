"use client";
import { makeSocket, type SocketT } from '@/utils/socket';
declare global{interface Window{__rtcPatched?:boolean;}}
if(typeof window!=='undefined' && !window.__rtcPatched){
 (async ()=>{
  try{
    const relayOnly = process.env.NEXT_PUBLIC_RELAY_ONLY==='1';
    const policy:RTCIceTransportPolicy = relayOnly?'relay':'all';
    const res = await fetch('/api/turn',{cache:'no-store'}).catch(()=>null);
    const data = await res?.json().catch(()=>null);
    const servers:RTCIceServer[] = Array.isArray(data) ? data : (data?.iceServers ?? []);
    const NativePC = (window as any).RTCPeerConnection;
    if(!NativePC){ console.log('[RTC-GUARD] RTCPeerConnection missing'); return; }
    (window as any).RTCPeerConnection = function(cfg?:RTCConfiguration){
      const merged:RTCConfiguration = { ...cfg, iceServers:(cfg?.iceServers?.length?cfg.iceServers:servers), iceTransportPolicy:policy };
      const pc = new (NativePC as any)(merged);
      const id=Math.random().toString(36).slice(2,8);
      console.log('[RTC-GUARD] v2 active');
      console.log('[ICE] injector active; servers length =', servers?.length ?? 0, servers);
      pc.addEventListener('icegatheringstatechange', ()=>console.log(`[ICE][${id}] gathering=${pc.iceGatheringState}`));
      pc.addEventListener('iceconnectionstatechange', ()=>console.log(`[ICE][${id}] conn=${pc.iceConnectionState}`));
      pc.addEventListener('connectionstatechange', ()=>console.log(`[PC][${id}] state=${pc.connectionState}`));
      pc.onicecandidateerror=(e:any)=>console.log(`[ICE][${id}] candidate-error`, e?.errorText||e);
      return pc;
    } as any;
    const tune=(v:HTMLVideoElement)=>{ if(!v)return; v.playsInline=true; (v as any).webkitPlaysInline=true; v.autoplay=true; if(v.id==='localVideo') v.muted=true; };
    const mo=new MutationObserver(()=>document.querySelectorAll('video').forEach(v=>tune(v as HTMLVideoElement)));
    mo.observe(document.documentElement,{childList:true,subtree:true});
    document.addEventListener('DOMContentLoaded',()=>document.querySelectorAll('video').forEach(v=>tune(v as HTMLVideoElement)));
    (window as any).__rtcPatched=true;
  }catch(e){ console.log('[RTC-GUARD] injector error', e); }
 })();
}
export default function IceInjector(){ return null; }
