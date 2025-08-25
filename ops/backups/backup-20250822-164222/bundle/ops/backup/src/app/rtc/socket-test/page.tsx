// @ts-nocheck
"use client";
import { makeSocket, type SocketT } from '@/utils/socket';
import { useEffect, useRef, useState } from "react";
async function getIceServers(){
  try {
    const r = await fetch('/api/turn', { cache: 'no-store' });
    const j = await r.json();
    return (j?.iceServers ?? []) as RTCIceServer[];
  } catch {
    return [{ urls: ["stun:stun.l.google.com:19302"] }];
  }
}

function connectIO(): SocketT {
  return makeSocket(undefined, { path: '/socket.io', transports: ["websocket","polling"] });
}

export default function SocketTest(){
  const [log,setLog]=useState<string[]>([]);
  const [role,setRole]=useState<"caller"|"callee"|null>(null);
  const [paired,setPaired]=useState(false);
  const [iceCount,setIceCount]=useState(0);
  const vLocal = useRef<HTMLVideoElement>(null);
  const vRemote= useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection|null>(null);
  const sockRef = useRef<SocketT | null>(null);
  const localStreamRef = useRef<MediaStream|null>(null);

  const L=(...a:any[])=>setLog(l=>[a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '),...l].slice(0,120));

  useEffect(() => {
    const s = connectIO(); sockRef.current = s;
    s.on("connect",()=>L("io:connected", s.id));
    s.on("hello",(d)=>L("hello", d));
    s.on("queued",(d)=>L("queued", d));
    s.on("paired", async ({ role: r }: any)=>{
      setPaired(true); setRole(r); L("paired", r);
      await startNegotiation(r);
    });
    s.on("partner:left", ()=>{ L("partner left"); cleanup(true); });

    // إشارات
    s.on("webrtc:offer", async (desc)=>{
      const pc = pcRef.current!;
      await pc.setRemoteDescription(desc);
      const ans = await pc.createAnswer();
      await pc.setLocalDescription(ans);
      s.emit("webrtc:answer", ans);
      L("sent answer");
    });
    s.on("webrtc:answer", async (desc)=>{
      const pc = pcRef.current!;
      await pc.setRemoteDescription(desc);
      L("got answer");
    });
    s.on("webrtc:ice", async (cand)=>{
      const pc = pcRef.current!;
      try { await pc.addIceCandidate(new RTCIceCandidate((cand) as RTCIceCandidateInit)); } catch (e:any) { L("addIce err", e?.message || e); }
    });

    return () => { try { s.disconnect(); } catch {} cleanup(false); };
  }, []);

  async function ensureMedia():
    Promise<MediaStream|null>{
    if (localStreamRef.current) return localStreamRef.current;
    try {
      const st = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = st;
      if (vLocal.current){ vLocal.current.srcObject = st; await vLocal.current.play().catch(()=>{}); }
      L("media ok");
      return st;
    } catch (e:any) {
      L("media error:", e?.name || e?.message || String(e));
      return null; // سننضم بدون كاميرا
    }
  }

  async function newPC(){
    const ice = await getIceServers();
    setIceCount(Array.isArray(ice)? ice.length : 0);
    const pc = new RTCPeerConnection({ iceServers: ice });
    pc.onicecandidate = (e)=>{ if (e.candidate) sockRef.current?.emit("webrtc:ice", e.candidate); };
    pc.ontrack = (ev)=>{ if (vRemote.current) { vRemote.current.srcObject = ev.streams[0]; vRemote.current.play().catch(()=>{}); } };
    return pc;
  }

  async function startNegotiation(r:"caller"|"callee"){
    const pc = await newPC(); pcRef.current = pc;
    const st = await ensureMedia();
    if (st) st.getTracks().forEach(t => pc.addTrack(t, st));
    else {
      // انضم بدون كاميرا لاستلام السطور فقط
      pc.addTransceiver('video', { direction: 'recvonly' });
      pc.addTransceiver('audio', { direction: 'recvonly' });
    }

    if (r === "caller") {
      const offer = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
      await pc.setLocalDescription(offer);
      sockRef.current?.emit("webrtc:offer", offer);
      L("sent offer");
    } else {
      L("callee waiting offer…");
    }
  }

  function cleanup(leave:boolean){
    try { localStreamRef.current?.getTracks().forEach(t=>t.stop()); } catch {}
    try { pcRef.current?.close(); } catch {}
    localStreamRef.current = null; pcRef.current = null;
    if (leave) sockRef.current?.emit("queue:leave");
    setPaired(false); setRole(null);
  }

  const enqueue = async () => { await ensureMedia(); sockRef.current?.emit("queue:join"); L("join requested"); };
  const enqueueNoCam = async () => { /* ينضم بدون كاميرا */ sockRef.current?.emit("queue:join"); L("join requested (no cam)"); };

  return (
    <main className="p-4 space-y-3">
      <h1 className="text-xl font-bold">Socket Test (local matcher)</h1>
      <div className="text-sm">ICE servers: {iceCount}</div>
      <div className="grid grid-cols-2 gap-4">
        <video ref={vLocal} muted playsInline className="bg-black rounded-2xl w-full aspect-video" />
        <video ref={vRemote} playsInline className="bg-black rounded-2xl w-full aspect-video" />
      </div>
      <div className="flex gap-3 flex-wrap">
        <button className="px-4 py-2 rounded-2xl border" onClick={enqueue} disabled={paired}>Start camera & join</button>
        <button className="px-4 py-2 rounded-2xl border" onClick={enqueueNoCam} disabled={paired}>Join (no camera)</button>
        <button className="px-4 py-2 rounded-2xl border" onClick={()=>cleanup(true)}>Leave</button>
        <a className="px-4 py-2 rounded-2xl border" href="/share">/share</a>
      </div>
      <div className="text-sm">status: {paired ? `paired as ${role}` : "idle"}</div>
      <pre className="text-xs bg-black/5 p-3 rounded-2xl max-h-80 overflow-auto">{log.join('\n')}</pre>
    </main>
  );
}
