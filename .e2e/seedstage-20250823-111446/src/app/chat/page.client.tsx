"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import PeerBadge from "@/components/PeerBadge";
import UpsellModal from "@/components/UpsellModal";
import { MockMatchService, demoProfiles } from "@/lib/match/mock";
import { guardVip } from "@/lib/vip";
import useVip from "@/hooks/useVip";

type LocalLikes = Record<string, true>;
function getLikes(): LocalLikes {
  try { return JSON.parse(localStorage.getItem("likes") || "{}") || {}; } catch { return {}; }
}
function setLikes(l: LocalLikes) {
  try { localStorage.setItem("likes", JSON.stringify(l)); } catch {}
}
function peerKey(p: any): string {
  return p?.id || `${p?.name || "anon"}:${p?.country || "??"}`.toLowerCase();
}

const match = new MockMatchService();

export default function ChatClient(){
  const { isVip } = useVip();
  const [index, setIndex] = useState(0);
  const [likesMap, setLikesMap] = useState<LocalLikes>({});
  const [showUpsell, setShowUpsell] = useState(false);

  useEffect(() => { setLikesMap(getLikes()); }, []);

  const p = useMemo(() => demoProfiles[index % demoProfiles.length], [index]);
  const id = peerKey(p);
  const liked = !!likesMap[id];
  const displayLikes = (p?.likes || 0) + (liked ? 1 : 0);

  const doNext = () => setIndex((i) => (i + 1) % demoProfiles.length);
  const doPrev = () => setIndex((i) => (i - 1 + demoProfiles.length) % demoProfiles.length);

  function onPrev() { guardVip(() => doPrev(), () => setShowUpsell(true), isVip); }
  function onNext() { guardVip(() => doNext(), () => setShowUpsell(true), isVip); }

  function toggleLike(){
    const next = { ...likesMap };
    if (next[id]) delete next[id]; else next[id] = true;
    setLikesMap(next); setLikes(next);
  }

  return (
    <main style={{minHeight:'100svh',background:'#0b0b0b',color:'#fff'}}>
      <div style={{position:'absolute',top:12,left:12}}>
        <PeerBadge p={{ name: p?.name, avatarUrl: p?.avatarUrl, likes: displayLikes, isVip: !!p?.isVip , id: (p?.id ?? (typeof "peer"!="undefined" ? "peer" : "peer")) , gender: ((p?.gender ?? "male") as any) }}/>
      </div>

      <div style={{position:'absolute',left:12,bottom:12,opacity:.9,fontSize:14}}>
        {p?.gender ?? 'unknown'} · {p?.country || '??'}{p?.city ? `, ${p.city}` : ''}
      </div>

      <div style={{position:'absolute',right:12,bottom:12,display:'flex',gap:8}}>
        <button className={"btn icon like" + (liked ? " active" : "")} onClick={toggleLike} title="Like">❤</button>
        <button className="btn" onClick={onPrev} title="Previous">Prev</button>
        <button className="btn" onClick={onNext} title="Next">Next</button>
      </div>

      {showUpsell && <UpsellModal open={showUpsell} onClose={() => setShowUpsell(false)} />}
    </main>
  );
}
