"use client";
import React from "react";
import CountryPicker from "./CountryPicker";
import GenderPicker from "./GenderPicker";
export type PeerInfo = { name?: string; country?: string; city?: string; gender?: string; likes?: number; vip?: boolean; avatarUrl?: string; };
export type Filters = { countryPref: string; genderPref: string };
export default function PeerHeader({ info, filters, onFiltersChange }:{ info: PeerInfo; filters: Filters; onFiltersChange?: (f: Filters)=>void; }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="pointer-events-auto absolute top-3 left-3 z-20 flex items-center gap-2 text-white drop-shadow">
        <div className="h-8 w-8 rounded-full bg-white/20 grid place-items-center">{info.avatarUrl ? <img src={info.avatarUrl} className="h-8 w-8 rounded-full object-cover"/> : "G"}</div>
        <strong className="text-sm">{info.name || "Guest"}</strong>
        <span className="text-xs px-2 py-0.5 rounded bg-black/40 border border-white/10">❤️ {info.likes ?? 0}</span>
        <span className={`vip-badge ${info.vip ? "" : "vip-off"}`}>VIP</span>
      </div>
      <div className="pointer-events-auto absolute top-3 right-3 z-30 flex items-center gap-2 text-white text-sm">
        <CountryPicker value={filters.countryPref} onChange={(v)=> onFiltersChange?.({ ...filters, countryPref: v })} />
        <GenderPicker value={filters.genderPref} onChange={(v)=> onFiltersChange?.({ ...filters, genderPref: v })} />
      </div>
      <div className="pointer-events-auto absolute bottom-3 left-3 z-20 text-white/90 flex items-center gap-2">
        <span className="px-2 py-1 rounded bg-black/30 border border-white/10">{info.country || "—"} · {info.city || "—"}</span>
        <span className="px-2 py-1 rounded bg-black/30 border border-white/10">{info.gender || "—"}</span>
      </div>
    </div>
  );
}
