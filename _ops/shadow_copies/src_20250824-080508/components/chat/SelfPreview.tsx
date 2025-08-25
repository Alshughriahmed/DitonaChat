"use client";
import React, { useEffect, useImperativeHandle, useRef, useState } from "react";

export type Facing = "user" | "environment";

export type SelfPreviewHandle = {
  toggleVideo: () => boolean;
  toggleAudio: () => boolean;
  switchFacing: () => Facing;
  state: () => { video: boolean; audio: boolean; facing: Facing };
};

export default React.forwardRef(function SelfPreview(
  { beauty }: { beauty: boolean },
  ref: React.Ref<SelfPreviewHandle>
){
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [videoOn, setVideoOn] = useState(true);
  const [audioOn, setAudioOn] = useState(true);
  const [facing, setFacing] = useState<Facing>("user");

  async function startStream(face: Facing, keepAudio: boolean) {
    streamRef.current?.getTracks().forEach(t=>t.stop());
    const st = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: face },
      audio: keepAudio
    });
    streamRef.current = st;
    if (videoRef.current) {
      videoRef.current.srcObject = st;
      await videoRef.current.play().catch(()=>{});
    }
    const v = st.getVideoTracks()[0]?.enabled ?? false;
    const a = st.getAudioTracks()[0]?.enabled ?? false;
    setVideoOn(v); setAudioOn(a); setFacing(face);
    return st;
  }

  useEffect(() => {
    let alive = true;
    (async () => {
      try { if (alive) await startStream("user", true); } catch (e) { console.warn(e); }
    })();
    return () => { alive = false; streamRef.current?.getTracks().forEach(t=>t.stop()); };
  }, []);

  useImperativeHandle(ref, () => ({
    toggleVideo() {
      const tr = streamRef.current?.getVideoTracks?.()[0]; if (!tr) return videoOn;
      tr.enabled = !tr.enabled; setVideoOn(tr.enabled); return tr.enabled;
    },
    toggleAudio() {
      const tr = streamRef.current?.getAudioTracks?.()[0]; if (!tr) return audioOn;
      tr.enabled = !tr.enabled; setAudioOn(tr.enabled); return tr.enabled;
    },
    switchFacing() {
      const next: Facing = facing === "user" ? "environment" : "user";
      startStream(next, true).catch(()=>{});
      return next;
    },
    state(){ return { video: videoOn, audio: audioOn, facing }; }
  }), [videoOn, audioOn, facing]);

  const filter = beauty ? "contrast(1.05) saturate(1.06) brightness(1.03) blur(0.5px)" : "none";
  const mirror = facing === "user" ? "scaleX(-1)" : "none";

  return (
    <div
      className="shadow-xl bg-black overflow-hidden rounded-2xl"
      style={{
        position: "fixed",
        right: "clamp(8px,3vw,24px)",
        bottom: "calc(var(--tb-h,64px) + var(--composer-h,0px) + var(--safe-b,0px) + 12px)",
        zIndex: 20,
        width: "min(38vw, 320px)",
        height: "min(28vh, 210px)"
      }}
      aria-label="Your camera preview"
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover rounded-2xl"
        style={{ transform: mirror, filter }}
        playsInline
        muted
        autoPlay
      />
    </div>
  );
});
