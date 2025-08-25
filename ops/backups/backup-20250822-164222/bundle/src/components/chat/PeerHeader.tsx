"use client";
import React from "react";
import CountryFilter from "./CountryFilter";

export type PeerInfo = {
  name?: string;
  likes: number;
  vip: boolean;
  avatarUrl?: string;
  genderSymbol: "♂" | "♀" | "👫" | "🏳️‍🌈";
  country?: string;
  city?: string;
  peerId?: string;
  roomId?: string;
};

export type Filters = {
  genderPref: "all" | "male" | "female" | "couple" | "lgbtq";
  countryPref: string;
  countries: string[];
  onGenderChange(v: string): void;
  onCountryChange(v: string): void;
};

export type PeerHeaderProps = {
  info: PeerInfo;
  filters?: Filters;
  onFiltersChange?: (filters: Filters) => void;
  className?: string;
};

const GENDER_COLORS: Record<PeerInfo["genderSymbol"], string> = {
  "♂": "#4ea1ff",
  "♀": "#ff4e6a", 
  "👫": "#ff4e6a",
  "🏳️‍🌈": "#ffffff"
};

export default function PeerHeader({ 
  info, 
  filters, 
  onFiltersChange, 
  className 
}: PeerHeaderProps) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className || ""}`}>
      {/* Top-Left: Name, likes, VIP */}
      <div className="pointer-events-auto absolute top-3 left-3 z-20 flex items-center gap-2 text-white drop-shadow">
        {info.avatarUrl && (
          <img 
            src={info.avatarUrl} 
            alt="" 
            className="w-8 h-8 rounded-full object-cover border border-white/20" 
          />
        )}
        <strong className="text-sm font-semibold">{info.name || "Guest"}</strong>
        <span title="Likes" className="text-rose-400 text-sm">
          ❤️ {info.likes}
        </span>
        {info.vip && (
          <span className="px-1.5 py-0.5 text-xs bg-yellow-400/90 text-black rounded font-medium">
            VIP
          </span>
        )}
      </div>

      {/* Bottom-Left: Gender + Location */}
      <div className="pointer-events-auto absolute bottom-3 left-3 z-20 text-white/90 flex items-center gap-2">
        <span 
          style={{ color: GENDER_COLORS[info.genderSymbol] }}
          className="text-lg"
        >
          {info.genderSymbol}
        </span>
        <span className="text-sm">
          {info.country || "—"}
          {info.city && ` / ${info.city}`}
        </span>
      </div>

      {/* Top-Right: Filters */}
      {filters && (
        <div className="pointer-events-auto absolute top-3 right-3 z-30 flex items-center gap-2 text-white text-sm">
          <label className="flex items-center gap-1">
            <span>Match with</span>
            <select
              aria-label="Gender preference"
              className="px-2 py-1 rounded bg-black/40 border border-white/10 text-white"
              value={filters.genderPref}
              onChange={(e) => {
                const newGender = e.target.value as Filters["genderPref"];
                filters.onGenderChange(newGender);
                onFiltersChange?.({ ...filters, genderPref: newGender });
              }}
            >
              <option value="all">All</option>
              <option value="male">♂ Male</option>
              <option value="female">♀ Female</option>
              <option value="couple">👫 Couple</option>
              <option value="lgbtq">🏳️‍🌈 LGBTQ</option>
            </select>
          </label>

          <CountryFilter
            value={filters.countryPref || ""}
            onChange={(v) => {
              filters.onCountryChange(v);
              onFiltersChange?.({ ...filters, countryPref: v });
            }}
            countries={filters.countries || []}
          />
        </div>
      )}
    </div>
  );
}
