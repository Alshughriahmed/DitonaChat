'use client'
"use client";
import React from "react";
import dynamic from "next/dynamic";
const CountryPicker = dynamic(() => import("./CountryPicker"), { ssr: false });

export type PeerInfo = {
  gender: "male" | "female" | "couple" | "gay";
  country: string;
  region?: string;
  likes: number;
  vip?: boolean;
};

export default function PeerHeader({ info }: { info: PeerInfo }) {
  const genderLabel =
    info.gender === "male" ? "ذكر" :
    info.gender === "female" ? "أنثى" :
    info.gender === "couple" ? "زوج" : "مثلي";
  return (
    <div
      className="absolute top-2 left-1/2 -translate-x-1/2 z-20"
      aria-label="peer-info"
    >
      <div className="flex items-center gap-2 rounded-full bg-black/40 backdrop-blur px-3 py-1 text-[13px]">
        <span className="px-2 py-0.5 rounded-full bg-white/10">{genderLabel}</span>
        <span className="px-2 py-0.5 rounded-full bg-white/10">{info.country}</span>
        {info.region ? (
          <span className="px-2 py-0.5 rounded-full bg-white/10">{info.region}</span>
        ) : null}
        <span className="px-2 py-0.5 rounded-full bg-white/10">❤️ {info.likes}</span>
        {info.vip ? (
          <span className="px-2 py-0.5 rounded-full bg-yellow-500/90 text-black font-semibold">VIP</span>
        ) : null}
      </div>
    </div>
  );
}
