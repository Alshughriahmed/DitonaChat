// ditona: WebRTC helpers (ICE cache + PC factory)
"use client";

type TurnResp = { iceServers: RTCIceServer[]; ts?: number; ttl?: number; source?: string };

let _cache: { iceServers: RTCIceServer[]; exp: number } | null = null;

export async function getIceServers(force = false): Promise<RTCIceServer[]> {
  const now = Date.now();
  if (!force && _cache && now < _cache.exp) return _cache.iceServers;

  const res = await fetch("/api/turn", { cache: "no-store" });
  if (!res.ok) throw new Error(`TURN endpoint error: ${res.status}`);
  const data = (await res.json()) as TurnResp;
  const ttl = typeof data.ttl === "number" ? data.ttl : 300;
  _cache = { iceServers: data.iceServers ?? [], exp: now + ttl * 1000 };
  return _cache.iceServers;
}

/** Create a peer connection with our ICE servers and basic logging. */
export async function createPeerConnection(opts: {
  icePolicy?: "all" | "noRelay"; // hint only; we still pass all, app can filter candidates
  onIce?: (ev: RTCPeerConnectionIceEvent) => void;
  onConnState?: (state: RTCPeerConnectionState) => void;
} = {}): Promise<RTCPeerConnection> {
  const iceServers = await getIceServers();
  const pc = new RTCPeerConnection({ iceServers /* , iceTransportPolicy: "all" */ });

  pc.onicecandidate = (ev) => {
    opts.onIce?.(ev);
    const c = ev.candidate?.candidate || "";
    // lightweight console log for relay/host/srflx detection
    if (c.includes(" typ relay")) console.debug("[ice] relay", c);
    else if (c.includes(" typ srflx")) console.debug("[ice] srflx", c);
    else if (c.includes(" typ host")) console.debug("[ice] host", c);
  };
  pc.onconnectionstatechange = () => {
    opts.onConnState?.(pc.connectionState);
    console.debug("[pc] state:", pc.connectionState);
  };
  return pc;
}

/** Get local media stream with facingMode hint. */
export async function getLocalStream(kind: "user" | "environment" = "user", audio = true) {
  const constraints: MediaStreamConstraints = {
    audio,
    video: { facingMode: { ideal: kind } },
  };
  return navigator.mediaDevices.getUserMedia(constraints);
}
