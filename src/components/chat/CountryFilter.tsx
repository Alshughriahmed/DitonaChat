"use client";
import React from "react";

export type CountryFilterProps = {
  value: string;
  onChange: (v: string) => void;
  countries: string[];
  className?: string;
};

export default function CountryFilter({ 
  value, 
  onChange, 
  countries, 
  className 
}: CountryFilterProps) {
  return (
    <div className={className || ""}>
      <select
        aria-label="Select country"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-2 py-1 rounded bg-black/40 border border-white/10 text-white"
      >
        {countries.map((c) => (
          <option key={c} value={c === "🌍 All Countries" ? "" : c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}
