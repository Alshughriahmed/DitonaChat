"use client";
import React from "react";

export type PeerProfile = {
  id: string;
  name?: string;
  gender: "female" | "male" | "couple" | "lgbtq";
  country?: string;
  city?: string;
  likes?: number;
  isVip?: boolean;
  avatarUrl?: string;
};

export default function PeerBadge({ p }: { p: PeerProfile }) {
  return (
    <div className="peer-badge" aria-label="Peer info">
      <div className="av-wrap">
        {p.avatarUrl ? <img className="av" src={p.avatarUrl} alt="" /> : <div className="av ph" />}
      </div>
      <div className="info">
        <div className="line name">
          {p.isVip && <span className="vip">VIP</span>}
          <span className="n">{p.name ?? "Guest"}</span>
        </div>
        <div className="line likes">❤ {p.likes ?? 0}</div>
      </div>
      <style jsx>{`
        .peer-badge{position:absolute;left:8px;top:8px;display:flex;align-items:center;gap:8px;
          padding:6px 10px;background:rgba(0,0,0,.55);border:1px solid rgba(255,255,255,.08);
          border-radius:12px;backdrop-filter:blur(6px);pointer-events:none}
        .av-wrap{width:30px;height:30px;border-radius:50%;overflow:hidden;flex:none;border:1px solid rgba(255,255,255,.15)}
        .av{width:100%;height:100%;object-fit:cover}
        .av.ph{background:linear-gradient(180deg,#444,#222)}
        .info{display:flex;flex-direction:column;line-height:1}
        .name .n{font-weight:600}
        .vip{color:#ffd700;font-weight:700;margin-right:6px}
        .likes{font-weight:600;opacity:.9}
        @media (max-width:640px){.peer-badge{transform:scale(.9);transform-origin:left top}}
      `}</style>
    </div>
  );
}
