"use client";
'use client';

/**
 * WebRTC client with:
 *  - Dynamic ICE from /api/turn (Twilio) + client-side TTL cache
 *  - Socket.IO signaling (join/leave/offer/answer/candidate) on /api/socket
 *  - Same base API (initPeer/attachLocal/createOffer/acceptAnswer/addRemoteCandidate/teardown)
 *  - New helpers: joinSignaling(roomId), leaveSignaling(), startCall()
 */

import { getSocket, type SocketT } from '@/utils/socket';

export interface TurnResponse {
  ok: boolean;
  iceServers: RTCIceServer[];
  ttl?: number;
  mode?: 'twilio' | 'stun-only';
  cached?: boolean;
}

type OnStream = (stream: MediaStream | null) => void;
type OnIce = (candidate: RTCIceCandidateInit) => void;

let __iceCache: { expiresAt: number; ice: RTCIceServer[] } | null = null;

function stunFallback(): RTCIceServer[] {
  return [
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ];
}

async function getIceServers(): Promise<RTCIceServer[]> {
  const now = Date.now();
  if (__iceCache && __iceCache.expiresAt > now) return __iceCache.ice;

  try {
    const res = await fetch('/api/turn', { cache: 'no-store' });
    const j = (await res.json()) as TurnResponse;
    const ice = (j?.ok && Array.isArray(j.iceServers) && j.iceServers.length > 0) ? j.iceServers : stunFallback();
    const ttl = Math.max(30, Number(j?.ttl ?? 60));
    __iceCache = { ice, expiresAt: now + ttl * 1000 };
    return ice;
  } catch {
    return stunFallback();
  }
}

export class WebRTCManager {
  private pc: RTCPeerConnection | null = null;
  private local: MediaStream | null = null;
  private remote: MediaStream | null = null;

  private onTrackCb: OnStream | null = null;
  private onIceCb: OnIce | null = null;

  // signaling
  private socket: SocketT | null = null;
  private roomId: string | null = null;

  getLocalStream() { return this.local; }
  getRemoteStream() { return this.remote; }

  /** Initialize RTCPeerConnection and wire listeners; await to load ICE from /api/turn. */
  async initPeer(onTrack: OnStream, onIce: OnIce): Promise<RTCPeerConnection> {
    const iceServers = await getIceServers();
    this.onTrackCb = onTrack;
    this.onIceCb = onIce;

    this.pc = new RTCPeerConnection({ iceServers });

    this.pc.onicecandidate = (e) => {
      const c = e.candidate?.toJSON();
      if (c) {
        // callback for app-level code
        this.onIceCb?.(c);
        // and signaling if joined to a room
        if (this.socket && this.roomId) {
          try { this.socket?.emit('signal:candidate', { roomId: this.roomId, candidate: c }); } catch {}
        }
      }
    };

    this.pc.ontrack = (e) => {
      if (!this.remote) this.remote = new MediaStream();
      // add event track
      try { this.remote.addTrack(e.track); } catch {}
      // also add all tracks from first stream if present
      const tracks = e.streams?.[0]?.getTracks?.() ?? [];
      for (const t of tracks) { try { this.remote.addTrack(t); } catch {} }
      this.onTrackCb?.(this.remote);
    };

    this.pc.onconnectionstatechange = () => {
      const s = this.pc?.connectionState;
      if (s && (s === 'failed' || s === 'closed')) {
        this.teardown();
      }
    };

    return this.pc;
  }

  /** Attach local media (default 640x480, audio+video) and add tracks. */
  async attachLocal(constraints: MediaStreamConstraints = { audio: true, video: { width: 640, height: 480 } }) {
    this.local = await navigator.mediaDevices.getUserMedia(constraints);
    if (!this.pc) throw new Error('Peer not initialized');
    for (const t of this.local.getTracks()) this.pc.addTrack(t, this.local);
    return this.local;
  }

  /** Create an SDP offer, setLocalDescription and (if joined) emit via signaling. */
  async createOffer(): Promise<RTCSessionDescriptionInit> {
    if (!this.pc) throw new Error('Peer not initialized');
    const offer = await this.pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
    await this.pc.setLocalDescription(offer);
    // auto-emit if in a room
    if (this.socket && this.roomId) {
      try { this.socket?.emit('signal:offer', { roomId: this.roomId, sdp: offer }); } catch {}
    }
    return offer;
  }

  /** Send offer explicitly (sugar over createOffer). */
  async startCall() {
    await this.createOffer();
  }

  /** Accept remote SDP answer. */
  async acceptAnswer(answer: RTCSessionDescriptionInit) {
    if (!this.pc) throw new Error('Peer not initialized');
    await this.pc.setRemoteDescription(new RTCSessionDescription(answer));
  }

  /** Add a remote ICE candidate. */
  async addRemoteCandidate(cand: RTCIceCandidateInit) {
    if (!this.pc) throw new Error('Peer not initialized');
    try { await this.pc.addIceCandidate(new RTCIceCandidate(cand)); } catch (e) { console.warn('[WebRTC] addIceCandidate failed:', e); }
  }

  /** Join signaling room and bind listeners (offer/answer/candidate). */
  joinSignaling(roomId: string) {
    this.roomId = roomId;
    this.socket = getSocket();
    // join room
    try { this.socket?.emit('join', roomId); } catch {}

    // safety: remove previous bindings
    this.socket?.off('signal:offer');
    this.socket?.off('signal:answer');
    this.socket?.off('signal:candidate');

    this.socket?.on('signal:offer', async (p: { from: string; sdp: any; }) => {
      try {
        // ensure peer exists
        if (!this.pc && this.onTrackCb && this.onIceCb) {
          await this.initPeer(this.onTrackCb, this.onIceCb);
        }
        if (!this.pc) return;
        await this.pc.setRemoteDescription(new RTCSessionDescription(p.sdp));
        const answer = await this.pc.createAnswer();
        await this.pc.setLocalDescription(answer);
        // reply
        if (this.roomId) {
          this.socket?.emit('signal:answer', { roomId: this.roomId, sdp: answer });
        }
      } catch (e) { console.warn('[WebRTC] handle offer failed:', e); }
    });

    this.socket?.on('signal:answer', async (p: { from: string; sdp: any; }) => {
      try {
        if (!this.pc) return;
        await this.pc.setRemoteDescription(new RTCSessionDescription(p.sdp));
      } catch (e) { console.warn('[WebRTC] handle answer failed:', e); }
    });

    this.socket?.on('signal:candidate', async (p: { from: string; candidate: any; }) => {
      try {
        if (!this.pc) return;
        await this.addRemoteCandidate(p.candidate);
      } catch (e) { console.warn('[WebRTC] handle candidate failed:', e); }
    });
  }

  /** Leave signaling room and unbind listeners. */
  leaveSignaling() {
    try { if (this.socket && this.roomId) this.socket?.emit('leave', this.roomId); } catch {}
    try {
      this.socket?.off('signal:offer');
      this.socket?.off('signal:answer');
      this.socket?.off('signal:candidate');
    } catch {}
    this.roomId = null;
  }

  /** Stop tracks and close the peer connection. */
  teardown() {
    try { this.pc?.getSenders?.().forEach(s => s.track && s.track.stop()); } catch {}
    try { this.local?.getTracks().forEach(t => t.stop()); } catch {}
    try { this.remote?.getTracks().forEach(t => t.stop()); } catch {}
    try { this.pc?.close(); } catch {}

    this.pc = null;
    this.local = null;
    this.remote = null;
  }
}

export default WebRTCManager;

// --- injected: ICE preferences & metrics ---
/* ICE helper: postMetric */
async function __postIceMetric(type: string) {
  try { await fetch("/api/metrics/ice", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type }) }); } catch {}
}

/* If you create RTCPeerConnection elsewhere, keep default 'all';
 * we'll filter relay candidates only if not necessary. */
try {
  // global listener pattern (no-op if not used)
  // You can call __postIceMetric from your onicecandidate handlers:
  // pc.onicecandidate = (e) => { const t = e.candidate?.type; if (t) __postIceMetric(t); ... }
} catch {}
