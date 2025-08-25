"use client";
import React, { useEffect, useRef } from "react";

type Props = {
  onPrev: () => void;
  onNext: () => void;
  onStop: () => void;
  onToggleChat: () => void;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onToggleSpeaker: () => void;
  onSwitchCam: () => void;
  onReport: () => void;
  onBeauty: () => void;
  onSettings: () => void;
  onLike: () => void;
  micOn: boolean;
  camOn: boolean;
  speakerOn: boolean;
  beautyOn: boolean;
  composerOpen: boolean;
};

export default function Toolbar({
  onPrev, onNext, onStop, onToggleChat, onToggleMic, onToggleCam,
  onToggleSpeaker, onSwitchCam, onReport, onBeauty, onSettings, onLike,
  micOn, camOn, speakerOn, beautyOn, composerOpen
}: Props) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(()=>{
    const ro = new ResizeObserver(()=>{
      const h = rootRef.current?.offsetHeight || 0;
      document.documentElement.style.setProperty("--tb-h", h + "px");
    });
    if(rootRef.current) ro.observe(rootRef.current);
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(()=> {
    const setH=()=> {
      const h = rootRef.current?.offsetHeight || 0;
      document.documentElement.style.setProperty('--tb-h', h + 'px');
    };
    setH();
    const ro=new ResizeObserver(setH);
    if(rootRef.current) ro.observe(rootRef.current);
    return ()=> ro.disconnect();
  }, []);

    return ()=>ro.disconnect();
  },[]);

  const barRef = useRef<HTMLDivElement | null>(null);

  // ثبّت --safe-b و --tb-h بهدوء (مع debounce) حتى لا يحدث وميض
  useEffect(() => {
    const root = document.documentElement;
    if (!root.style.getPropertyValue("--safe-b")) {
      root.style.setProperty("--safe-b", "env(safe-area-inset-bottom)");
    }
    let t: any;
    const setH = () => {
      if (!barRef.current) return;
      const h = Math.round(barRef.current.getBoundingClientRect().height);
      root.style.setProperty("--tb-h", `${h}px`);
    };
    const onResize = () => { clearTimeout(t); t = setTimeout(setH, 120); };

    setH();
    addEventListener("resize", onResize);
    addEventListener("orientationchange", onResize);
    return () => {
      clearTimeout(t);
      removeEventListener("resize", onResize);
      removeEventListener("orientationchange", onResize);
    };
  }, []);

  const ico = "h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur text-base";
  const big = "px-4 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-medium";

  return (
    <div
      ref={barRef}
      data-toolbar-version="sketch-v4"
      className="fixed bottom-0 left-0 right-0 z-50 z-30 px-3 py-2 pointer-events-auto backdrop-blur-md bg-black/30 rounded-t-2xl"
      style={{ paddingBottom: "var(--safe-b, 0px)" }}
     ref={rootRef}>
      <div className="mx-auto max-w-[960px] px-3 pb-2">
        <div className="flex items-center justify-between gap-2">
          <button onClick={onPrev} aria-label="Prev" className={big}>Prev</button>

          <div className="flex-1">
            <div className="grid grid-cols-6 sm:grid-cols-10 grid-rows-2 sm:grid-rows-1 place-items-center gap-2">
              <button onClick={onToggleChat} aria-label="Chat" className={`${ico} ${composerOpen ? "ring-2 ring-sky-500" : ""}`}>💬</button>
              <button onClick={onToggleCam} aria-label="Cam on/off" className={`${ico} ${!camOn ? "bg-sky-600 text-white" : ""}`}>🎥</button>
              <button onClick={onSwitchCam} aria-label="Switch camera" className={ico}>🔄</button>
              <button onClick={onToggleMic} aria-label="Mic on/off" className={`${ico} ${!micOn ? "bg-sky-600 text-white" : ""}`}>{micOn ? "🎙️" : "🔇"}</button>
              <button onClick={onToggleSpeaker} aria-label="Speaker on/off" className={`${ico} ${!speakerOn ? "bg-sky-600 text-white" : ""}`}>{speakerOn ? "🔊" : "🔇"}</button>
              <button onClick={onBeauty} aria-label="Beauty" className={`${ico} ${beautyOn ? "ring-2 ring-pink-500" : ""}`}>✨</button>
              <button onClick={onReport} aria-label="Report" className={ico}>⚠️</button>
              <button onClick={onSettings} aria-label="Settings" className={ico}>⚙️</button>
              <button onClick={onLike} aria-label="Like" className={ico}>❤️</button>
              <button onClick={onStop} aria-label="Stop" className="px-4 h-10 rounded-xl bg-red-600 hover:bg-red-700 text-white">Stop</button>
            </div>
          </div>

          <button onClick={onNext} aria-label="Next" className={big}>Next</button>
        </div>
      </div>
    </div>
  );
}
