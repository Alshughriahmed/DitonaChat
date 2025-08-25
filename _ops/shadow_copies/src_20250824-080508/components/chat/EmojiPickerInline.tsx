// @ts-nocheck
'use client';
import React from 'react';

const EMOJIS = ["😀","😁","😊","😍","😘","😉","😎","🥰","😂","😭","😇","😐","🤔","😴","🙃","👍","👏","🔥","💯","❤️","💖","💋","💫","🌹","🌟"];

export default function EmojiPickerInline({ onPick }: { onPick: (e:string)=>void }) {
  return (
    <div className="absolute bottom-full mb-2 left-2 right-2 rounded-2xl border border-white/10 bg-black/70 backdrop-blur p-2 grid grid-cols-12 gap-1 z-40">
      {EMOJIS.map(e => (
        <button
          key={e}
          className="h-8 rounded hover:bg-white/10"
          onClick={()=>onPick(e)}
          aria-label={`emoji ${e}`}
        >{e}</button>
      ))}
    </div>
  );
}
