// @ts-nocheck
"use client";
import { makeSocket, type SocketT } from '@/utils/socket';
import React, { useEffect, useRef, useState } from 'react';
type TurnResp = { iceServers: RTCIceServer[]; ttl?: number };

export default function TestCallPage() {
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection|null>(null);
  const socketRef = useRef<SocketT | null>(null);
  const roomRef = useRef<string|null>(null);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    let mounted = true;
    (async () => {
      setStatus('init');
      // ICE
      let ice: RTCIceServer[] = [{ urls: 'stun:stun.l.google.com:19302' }];
      try {
        const r = await fetch('/api/turn', { cache: 'no-store' });
        const j: TurnResp = await r.json();
        if (Array.isArray(j?.iceServers)) ice = j.iceServers;
      } catch {}
      // Media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width:{ideal:1280}, height:{ideal:720}, frameRate:{ideal:24}, facingMode:'user' },
        audio: { echoCancellation:true, noiseSuppression:true, autoGainControl:true }
      });
      if (!mounted) return;
      if (localRef.current) {
        localRef.current.srcObject = stream;
        localRef.current.muted = true; localRef.current.playsInline = true;
        await localRef.current.play().catch(()=>{});
      }
      const pc = new RTCPeerConnection({ iceServers: ice });
      stream.getTracks().forEach(t => pc.addTrack(t, stream));
      pc.ontrack = ev => {
        const [rs] = ev.streams;
        if (remoteRef.current) {
          remoteRef.current.srcObject = rs;
          remoteRef.current.playsInline = true;
          remoteRef.current.muted = false;
          remoteRef.current.play().catch(()=>{});
        }
      };
      pc.onicecandidate = ev => {
        if (ev.candidate && socketRef.current && roomRef.current) {
          socketRef.current.emit('signal:candidate', { roomId: roomRef.current, candidate: ev.candidate.toJSON() });
        }
      };
      pcRef.current = pc;

      // Socket
      const socket = makeSocket(undefined, { transports: ['websocket'] });
      socketRef.current = socket;

      socket.on('connect', () => setStatus('socket:connected'));
      socket.on('next:blocked', (why: string) => setStatus('next:blocked:' + why));

      socket.on('queue:paired', async ({ roomId, shouldOffer  }: any) => {
        roomRef.current = roomId;
        setStatus('paired:' + roomId + (shouldOffer?':offerer':':answerer'));
        if (shouldOffer) {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit('signal:offer', { roomId, sdp: offer.sdp });
        }
      });
      socket.on('signal:offer', async ({ roomId, sdp  }: any) => {
        await pc.setRemoteDescription({ type:'offer', sdp });
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('signal:answer', { roomId, sdp: answer.sdp });
      });
      socket.on('signal:answer', async ({ roomId, sdp  }: any) => {
        await pc.setRemoteDescription({ type:'answer', sdp });
      });
      socket.on('signal:candidate', async ({ roomId, candidate  }: any) => {
        try { await pc.addIceCandidate(new RTCIceCandidate((candidate) as RTCIceCandidateInit)); } catch {}
      });
      socket.on('leave', ({ reason  }: any) => {
        setStatus('peer:left:' + reason);
        socket.emit('queue:join', {}); // re-enqueue
      });

      // Join queue
      socket.emit('queue:join', {});
    })();

    return () => {
      mounted = false;
      try { socketRef.current?.emit('leave'); } catch {}
      try { socketRef.current?.disconnect(); } catch {}
      try { pcRef.current?.getSenders().forEach(s => s.track && s.track.stop()); } catch {}
      try { pcRef.current?.close(); } catch {}
    };
  }, []);

  const onNext = () => socketRef.current?.emit('next');

  return (
    <main style={{padding:'12px', color:'#fff', background:'#0a0a0a', minHeight:'100vh'}}>
      <h1 style={{fontSize:18, marginBottom:8}}>Ditona — Test Call</h1>
      <p style={{opacity:.8, marginBottom:12}}>Status: {status}</p>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px'}}>
        <video ref={remoteRef} className="remote-video" style={{width:'100%', background:'#111'}} />
        <video ref={localRef} style={{width:'100%', transform:'scaleX(-1)'}} />
      </div>
      <div style={{marginTop:12, display:'flex', gap:8}}>
        <button onClick={onNext} style={{padding:'8px 12px'}}>Next</button>
        <a href="/chat" style={{padding:'8px 12px', background:'#222'}}>Go to /chat</a>
      </div>
      <p style={{marginTop:8, opacity:.7}}>افتح هذه الصفحة على جهازين (هاتف + كمبيوتر) لتجربة مكالمة فعلية.</p>
    </main>
  );
}