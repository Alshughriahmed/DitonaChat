'use client';
import * as React from 'react';
import { emit as busEmit } from '@/utils/bus';


type Props = {
  onPrev?: ()=>void; onNext?: ()=>void;
  onToggleMic?: ()=>void; onToggleMute?: ()=>void; // السماعة
  onToggleLike?: ()=>void; liked?: boolean;
  onSettings?: ()=>void; onReport?: ()=>void;
};

const IconBtn = ({children, big=false, onClick, label}:{children:React.ReactNode; big?:boolean; onClick?:()=>void; label?:string}) => (
  <button
    aria-label={label}
    onClick={onClick}
    className={`shrink-0 ${big?'min-w-[88px]':'min-w-[52px]'} h-[48px] px-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white/95 backdrop-blur-md`}
  >{children}</button>
);

export default function Toolbar({
  onPrev, onNext, onToggleMic, onToggleMute, onToggleLike, liked, onSettings, onReport
}: Props) {
  // قياس ارتفاع الشريط لكتابة --tb-h
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(()=>{
    const setH = ()=> {
      const h = ref.current?.offsetHeight || 48;
      document.documentElement.style.setProperty('--tb-h', h+'px');
    };
    setH();
    const ro = new ResizeObserver(setH); if(ref.current) ro.observe(ref.current);
    return ()=> ro.disconnect();
  }, []);

  // تدوير الماسكات
  const masks = ['off','sunglasses','mustache','surgical','clown','bunny'] as const;
  const [maskIdx, setMaskIdx] = React.useState(0);
  const cycleMask = ()=> {
    const i = (maskIdx + 1) % masks.length;
    setMaskIdx(i);
    try { busEmit('toggle-mask', { mode: masks[i] }); } catch {}
  };

  // السماعة (Mute/Unmute) — محليًا + بث حدث للـ media-bridge
  const [speakerMuted, setSpeakerMuted] = React.useState(false);
  const toggleSpeaker = ()=> {
    setSpeakerMuted(prev => {
      const next = !prev;
      try { busEmit('toggle-speaker', { muted: next }); } catch {}
      onToggleMute?.(); // يسمح للصفحة تسجّل أي لوج إضافي
      return next;
    });
  };

  return (
    <div ref={ref} className="">
      <div className="mx-auto max-w-screen-sm px-3 pb-2">
        <div className="flex flex-row-reverse items-center gap-2 overflow-x-auto no-scrollbar">
          {/* R→L: Next | Speaker | Mic | Like | Mask | Settings | Report | Prev */}
          <IconBtn big label="Next" onClick={onNext}>⏭️</IconBtn>

          {/* زر السماعة */}
          <IconBtn
            label={speakerMuted ? "Unmute speaker" : "Mute speaker"}
            onClick={toggleSpeaker}
          >
            {speakerMuted ? '🔇' : '🔊'}
          </IconBtn>

          <IconBtn label="Toggle Mic" onClick={(e)=>{ busEmit("toggle-mic"); return (typeof onToggleMic==="function" ? onToggleMic(e) : undefined); }}>🎙️</IconBtn>

          {/* Like */}
          <IconBtn label="Like" onClick={onToggleLike}>{liked ? '💖' : '🤍'}</IconBtn>

          {/* Mask */}
          <IconBtn label="Mask" onClick={cycleMask}>🎭</IconBtn>

          <IconBtn label="Settings" onClick={onSettings}>⚙️</IconBtn>
          <IconBtn label="Report" onClick={onReport}>🚩</IconBtn>
          <IconBtn big label="Prev" onClick={onPrev}>⏮️</IconBtn>
        </div>
      </div>
    </div>
  );
}
