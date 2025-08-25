"use client";
import useViewportInsets from "@/hooks/useViewportInsets";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Toolbar from "@/components/chat/Toolbar";
import ChatComposer from "@/components/chat/ChatComposer";
import ChatMessages, { ChatMsg } from "@/components/chat/ChatMessages";
import SelfPreview, { SelfPreviewHandle } from "@/components/chat/SelfPreview";
import PeerHeader, { PeerInfo } from "@/components/chat/PeerHeader";
import { useRouter } from "next/navigation";

type SessionState = "idle" | "enqueued" | "paired";
const uid = () => (crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2));

export default function ChatPage(){
  const { bottomInset } = useViewportInsets();
const router = useRouter();
  const [sess, setSess] = useState<SessionState>("idle");
  const [composerOpen, setComposerOpen] = useState(false);
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    { id: uid(), text: "Welcome to DitonaChat 👋", at: Date.now()-5000 },
    { id: uid(), text: "This is a demo overlay. Type to test.", at: Date.now()-3000 },
    { id: uid(), mine:true, text: "", at: Date.now()-1500 },
  ]);

  // حالات الأزرار
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [speakerOn, setSpeakerOn] = useState(true); // لا نتحكم فعليًا في إخراج النظام — مجرد حالة
  const [beautyOn, setBeautyOn] = useState(false);
  const [likes, setLikes] = useState(120); // للطرف الآخر

  // معلومات الطرف الآخر (مثال)
  const [peer, setPeer] = useState<PeerInfo>({
    gender: "male", country: "Germany", region: "Berlin", likes, vip: true
  });
  useEffect(()=>{ setPeer(p => ({...p, likes})); }, [likes]);

  const selfRef = useRef<SelfPreviewHandle|null>(null);

  useEffect(()=>{ document.documentElement.style.setProperty("--safe-b","env(safe-area-inset-bottom)"); },[]);

  // -------- Socket.IO and WebRTC state --------
  const socketRef = useRef<any>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const [willOffer, setWillOffer] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);

  // -------- تحكم الجلسة --------
  const join = () => {
    setSess("enqueued");
    if (!socketRef.current) {
      initSocket();
    }
    socketRef.current?.emit('queue:join', { 
      gender: 'other', 
      country: 'XX',
      meta: {} 
    });
  };

  const next = () => {
    // Clean up WebRTC connection
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    
    setSess("enqueued");
    setRoomId(null);
    setWillOffer(false);
    
    // Emit next to server
    socketRef.current?.emit('next');
  };

  const prev = next; // Same behavior as next for now
  
  const stop = () => {
    // Clean up WebRTC connection
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    
    setSess("idle");
    setRoomId(null);
    setWillOffer(false);
    
    socketRef.current?.emit('leave');
  };

  // -------- Socket.IO initialization --------
  const initSocket = () => {
    if (socketRef.current) return;
    
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const socket = require('socket.io-client')(baseUrl, {
      transports: ['websocket', 'polling']
    });
    
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[Socket] Connected');
    });

    socket.on('queue:enqueued', () => {
      setSess("enqueued");
      console.log('[Queue] Enqueued, waiting for match...');
    });

    socket.on('queue:paired', async (data: any) => {
      console.log('[Queue] Paired!', data);
      setSess("paired");
      setRoomId(data.roomId);
      setWillOffer(data.willOffer);
      
      // Initialize WebRTC
      await initWebRTC(data.roomId, data.willOffer);
    });

    socket.on('queue:peer-left', () => {
      console.log('[Queue] Peer left');
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      setSess("enqueued");
      setRoomId(null);
      setWillOffer(false);
    });

    // WebRTC signaling
    socket.on('signal:offer', async (data: any) => {
      console.log('[WebRTC] Received offer');
      if (pcRef.current && data.desc) {
        await pcRef.current.setRemoteDescription(data.desc);
        const answer = await pcRef.current.createAnswer();
        await pcRef.current.setLocalDescription(answer);
        socket.emit('signal:answer', { roomId: data.roomId, desc: answer });
        console.log('[WebRTC] Sent answer');
      }
    });

    socket.on('signal:answer', async (data: any) => {
      console.log('[WebRTC] Received answer');
      if (pcRef.current && data.desc) {
        await pcRef.current.setRemoteDescription(data.desc);
        console.log('[WebRTC] Answer processed');
      }
    });

    socket.on('signal:candidate', async (data: any) => {
      console.log('[WebRTC] Received ICE candidate');
      if (pcRef.current && data.candidate) {
        try {
          await pcRef.current.addIceCandidate(data.candidate);
        } catch (error) {
          console.warn('[WebRTC] Failed to add ICE candidate:', error);
        }
      }
    });
  };

  // -------- WebRTC initialization --------
  const initWebRTC = async (roomId: string, shouldOffer: boolean) => {
    try {
      // Fetch ICE servers
      const turnResponse = await fetch('/api/turn', { cache: 'no-store' });
      const turnData = await turnResponse.json();
      const iceServers = Array.isArray(turnData?.iceServers) ? turnData.iceServers : [];
      
      console.log('[WebRTC] Using ICE servers:', iceServers.length);
      
      // Create peer connection
      const pc = new RTCPeerConnection({ iceServers });
      pcRef.current = pc;

      // ICE candidate handling
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('[WebRTC] Sending ICE candidate');
          socketRef.current?.emit('signal:candidate', { 
            roomId, 
            candidate: event.candidate 
          });
        }
      };

      // Connection state monitoring
      pc.onconnectionstatechange = () => {
        console.log('[WebRTC] Connection state:', pc.connectionState);
      };

      pc.oniceconnectionstatechange = () => {
        console.log('[WebRTC] ICE connection state:', pc.iceConnectionState);
      };

      // Add local stream (placeholder - would be camera/mic)
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        stream.getTracks().forEach(track => {
          pc.addTrack(track, stream);
        });
      } catch (error) {
        console.warn('[WebRTC] Could not get user media:', error);
        // Create data channel for connection without media
        pc.createDataChannel('test');
      }

      // Handle incoming streams
      pc.ontrack = (event) => {
        console.log('[WebRTC] Received remote track');
        // Would connect to video element
      };

      // If we should offer, create and send offer
      if (shouldOffer) {
        console.log('[WebRTC] Creating offer...');
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socketRef.current?.emit('signal:offer', { roomId, desc: offer });
        console.log('[WebRTC] Sent offer');
      }

    } catch (error) {
      console.error('[WebRTC] Initialization failed:', error);
    }
  };

  // -------- Cleanup on unmount --------
  useEffect(() => {
    return () => {
      if (pcRef.current) {
        pcRef.current.close();
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // -------- رسائل --------
  const send = (text:string)=>{
    setMsgs(m=>[...m, {id:uid(), mine:true, text, at:Date.now()}]);
    setTimeout(()=>setMsgs(m=>[...m, {id:uid(), text:"👍", at:Date.now()}]), 500);
  };

  // -------- ربط الأزرار --------
  const toggleMic = ()=>{ const st = selfRef.current?.toggleAudio(); if (typeof st==="boolean") setMicOn(st); };
  const toggleCam = ()=>{ const st = selfRef.current?.toggleVideo(); if (typeof st==="boolean") setCamOn(st); };
  const switchCam = ()=>{ selfRef.current?.switchFacing(); };
  const toggleSpeaker = ()=>{ setSpeakerOn(v=>!v); };
  const report = ()=>{ alert("تم إرسال الإبلاغ (تجريبي)."); };
  const beauty = ()=>{ setBeautyOn(v=>!v); };
  const settings = ()=>{ router.push("/settings"); };
  const like = ()=>{ setLikes(n=>n+1); };

  // -------- ايماءات السحب --------
  const touchX = useRef<number|null>(null);
  const onTouchStart = (e: React.TouchEvent)=>{ touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent)=>{
    const x0 = touchX.current; touchX.current = null;
    if (x0==null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (dx <= -60) next();       // يمين ← يسار = التالي
    else if (dx >= 60) prev();   // يسار ← يمين = السابق
  };

  // دعم الأسهم على الديسكتوب
  useEffect(()=>{
    const onKey = (e:KeyboardEvent)=>{
      if (e.key==="ArrowLeft") prev();
      if (e.key==="ArrowRight") next();
    };
    addEventListener("keydown", onKey);
    return ()=>removeEventListener("keydown", onKey);
  },[]);

  const hint = useMemo(()=> sess==="idle" ? "Tap JOIN to start" : sess==="enqueued" ? "Looking for a match…" : "", [sess]);

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden text-white bg-gradient-to-b from-slate-900 via-slate-900 to-black h-[100dvh] grid grid-rows-[minmax(0,1fr)_minmax(0,1fr)_auto_auto]" style={{ touchAction: 'pan-x', paddingBottom: bottomInset }}>
      {/* منطقة الفيديو العليا + معلومات الطرف الآخر + الرسائل */}
      <div className="relative w-full" style={{height:"45vh"}}>
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-transparent to-emerald-900/30" />
        <PeerHeader info={peer}/>
        {hint && (
          <div className="absolute inset-0 grid place-items-center">
            <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur text-sm">{hint}</div>
          </div>
        )}
        <div className="chat-tray"><div className="chat-tray__log"><div className="stack">
<ChatMessages msgs={msgs}/>
</div></div></div>
      </div>

      {/* زر انضمام عندما idle */}
      {sess==="idle" && (
        <div className="mx-4 mt-6">
          <button onClick={join} className="px-6 py-3 rounded-full bg-sky-600 hover:bg-sky-500 active:scale-[0.98] transition text-white shadow">Join</button>
        </div>
      )}

      {/* المعاينة الذاتية */}
      <SelfPreview ref={selfRef} beauty={beautyOn}/>

      {/* شريط كتابة الرسائل */}
      <div className="row-start-4">
      <div className="row-start-4">
      {/* === Ditona: Toolbar row (row 3) === */}
      <div className="row-start-3">
        <Toolbar
          onPrev={(typeof prev === 'function' ? prev : () => (window as any).__ditona?.prev?.())}
          onNext={(typeof next === 'function' ? next : () => (window as any).__ditona?.next?.())}
          onStop={(typeof stop === 'function' ? stop : () => (window as any).__ditona?.stop?.())}
          onToggleChat={(typeof toggleChat === 'function' ? toggleChat : () => (window as any).__ditona?.toggleChat?.())}
          onToggleMic={(typeof toggleMic === 'function' ? toggleMic : () => (window as any).__ditona?.toggleMic?.())}
          onToggleCam={(typeof toggleCam === 'function' ? toggleCam : () => (window as any).__ditona?.toggleCam?.())}
          onToggleSpeaker={(typeof toggleSpeaker === 'function' ? toggleSpeaker : () => (window as any).__ditona?.toggleSpeaker?.())}
          onSwitchCam={(typeof switchCam === 'function' ? switchCam : () => (window as any).__ditona?.switchCamera?.())}
          onReport={(typeof report === 'function' ? report : () => (window as any).__ditona?.report?.())}
          onBeauty={(typeof beauty === 'function' ? beauty : () => (window as any).__ditona?.beauty?.())}
          onSettings={(typeof openSettings === 'function' ? openSettings : () => (window as any).__ditona?.openSettings?.())}
          onLike={(typeof like === 'function' ? like : () => (window as any).__ditona?.like?.())}
          micOn={(typeof micOn === 'boolean' ? micOn : true)}
          camOn={(typeof camOn === 'boolean' ? camOn : true)}
          speakerOn={(typeof speakerOn === 'boolean' ? speakerOn : true)}
          beautyOn={(typeof beautyOn === 'boolean' ? beautyOn : false)}
          composerOpen={(typeof composerOpen === 'boolean' ? composerOpen : false)}
        />
      </div>

      <ChatComposer open={composerOpen} onSend={send}/>
    </div>
    </div>

      {/* شريط الأدوات */}
      <div className="row-start-3">
      <div className="row-start-3">
      </div>
    </div>
</div>
);
}
