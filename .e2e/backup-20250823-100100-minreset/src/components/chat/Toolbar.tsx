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
  onMask?: () => void;
  onSettings: () => void;
  onLike: () => void;
  micOn: boolean;
  camOn: boolean;
  speakerOn: boolean;
  composerOpen: boolean;
  isVip?: boolean;
};

export default function Toolbar(props: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const setH = () => {
      const el = ref.current; if(!el) return;
      const h = Math.max(56, el.offsetHeight);
      document.documentElement.style.setProperty('--tb-h', h + 'px');
    };
    const vv = (window as any).visualViewport;
    setH();
    const ro = new ResizeObserver(setH);
    if(ref.current) ro.observe(ref.current);
    window.addEventListener('resize', setH);
    window.addEventListener('orientationchange', setH);
    if(vv) vv.addEventListener('resize', setH);
    return () => { ro.disconnect();
      window.removeEventListener('resize', setH);
      window.removeEventListener('orientationchange', setH);
      if(vv) vv.removeEventListener('resize', setH);
    };
  }, []);



  useEffect(() => {
    // قياس أولي
    setH();

    // تأقلم مع تغيّر الحجم ولوح المفاتيح
    const ro = new ResizeObserver(setH);
    if (ref.current) ro.observe(ref.current);

    const onResize = () => setH();
    const onOrient = () => setH();
    const onVis = () => setH();

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onOrient);
    document.addEventListener("visibilitychange", onVis);

    const vv = (window as any).visualViewport;
    const onVV = () => {
      // عند ظهور لوح المفاتيح، عدّل متغيّر --kb-pad لتجنّب اختفاء الشريط
      const pad = vv ? Math.max(0, window.innerHeight - vv.height) : 0;
      document.documentElement.style.setProperty("--kb-pad", `${pad}px`);
      setH();
    };
    if (vv && vv.addEventListener) vv.addEventListener("resize", onVV);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onOrient);
      document.removeEventListener("visibilitychange", onVis);
      if (vv && vv.removeEventListener) vv.removeEventListener("resize", onVV);
    };
  }, []);

  const IconBtn = ({
    label,
    onClick,
    children,
    active,
  }: {
    label: string;
    onClick: () => void;
    children: React.ReactNode;
    active?: boolean;
  }) => (
    <button
      aria-label={label}
      onClick={onClick}
      className={`h-10 w-10 grid place-items-center rounded-full bg-white/10 backdrop-blur-sm select-none ${
        active ? "ring-2 ring-emerald-400" : "hover:bg-white/20"
      }`}
    >
      <span className="text-base">{children}</span>
    </button>
  );

  return (
    <div ref={ref} className="fixed bottom-0 left-0 right-0 z-[999] bg-black/40 backdrop-blur-md fixed inset-x-0 z-[1000] bg-black/50 backdrop-blur-md pt-2"
      style={{
        // اجعله دائمًا أسفل الشاشة مع تعويض لوح المفاتيح والـ safe-area
        bottom:
          "max(0px, calc(env(safe-area-inset-bottom) + var(--kb-pad, 0px)))",
      }}
    >
      <div className="px-3">
        <div className="min-h-[56px] flex items-center gap-2">
          {/* يسار: Prev دائم */}
          <button
            onClick={props.onPrev}
            aria-label="Prev"
            className="h-10 px-3 rounded-lg bg-white/10 hover:bg-white/20 select-none shrink-0"
          >
            Prev
          </button>

          {/* المنتصف: أيقونات مع تمرير أفقي عند ضيق العرض */}
          <div className="flex-1 overflow-x-auto no-scrollbar">
            <div
              className="flex items-center gap-2 px-2"
              role="toolbar"
              aria-label="Chat controls"
            >
              <IconBtn label="Show Chat" onClick={props.onToggleChat} active={props.composerOpen}>💬</IconBtn>
              <IconBtn label="Camera on/off" onClick={props.onToggleCam} active={props.camOn}>🎥</IconBtn>
              <IconBtn label="Switch camera" onClick={props.onSwitchCam}>🔄</IconBtn>
              <IconBtn label="Mic on/off" onClick={props.onToggleMic} active={props.micOn}>🎙️</IconBtn>
              <IconBtn label="Speaker on/off" onClick={props.onToggleSpeaker} active={props.speakerOn}>🔊</IconBtn>
              <IconBtn label="Stop" onClick={props.onStop}>⏹️</IconBtn>
              <IconBtn label="Beauty" onClick={props.onBeauty}>✨</IconBtn>
              <IconBtn label="Report" onClick={props.onReport}>⚠️</IconBtn>
              <IconBtn label="Settings" onClick={props.onSettings}>⚙️</IconBtn>
              <IconBtn label="Like" onClick={props.onLike}>❤️</IconBtn>
              {props.onMask && <IconBtn label="Mask" onClick={props.onMask}>🎭</IconBtn>}
            </div>
          </div>

          {/* يمين: Next دائم */}
          <button
            onClick={props.onNext}
            aria-label="Next"
            className="h-10 px-3 rounded-lg bg-white/10 hover:bg-white/20 select-none shrink-0"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
