"use client";
import * as React from "react";

export type Gender = "any" | "male" | "female" | "couple" | "lgbt";
export type GenderPickerProps = {
  value?: Gender;
  onChange?: (g: Gender) => void;
  className?: string;
};

const LABELS: Record<Exclude<Gender,"any">, string> = {
  male: "Male",
  female: "Female",
  couple: "Couple",
  lgbt: "LGBT",
};

function GIcon({ g }: { g: Exclude<Gender,"any"> }) {
  if (g === "male")   return <span className="text-sky-500 text-lg align-middle">♂</span>;
  if (g === "female") return <span className="text-rose-500 text-lg align-middle">♀</span>;
  if (g === "couple") return <span className="text-pink-400 text-lg align-middle">💑</span>;
  return <span className="text-lg align-middle">🌈</span>;
}

export default function GenderPicker({
  value = "any",
  onChange,
  className = "text-[clamp(12px,2.4vw,14px)] px-[clamp(8px,2vw,12px)] h-[clamp(36px,6vw,40px)]",
}: GenderPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);
  React.useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (!(e.target as HTMLElement)?.closest?.("#gender-dd")) setOpen(false); };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  // label على الشارة:
  // - إن لم يختَر المستخدم (value === "any") نعرض "Choose Gender"
  // - وظيفيًا تبقى القيمة "any" = All
  const chipLabel = value === "any"
    ? "Choose Gender"
    : (<span className="inline-flex items-center gap-1"><GIcon g={value as Exclude<Gender,"any">} />{LABELS[value as Exclude<Gender,"any">]}</span>);

  const apply = (g: Gender) => { onChange?.(g); setOpen(false); try{ localStorage.setItem("genderPref", g); }catch{} };

  return (
    <div className="relative" id="gender-dd">
      <button
        type="button"
        onClick={() => setOpen(o=>!o)}
        className={"inline-flex items-center gap-2 rounded-xl bg-black/35 border border-white/10 text-white/90 backdrop-blur px-3 " + className}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {mounted ? chipLabel : "Choose Gender"}
        <span className="opacity-70">▾</span>
      </button>

      {open && (
        <div role="listbox"
             className="absolute right-0 mt-2 w-[min(72vw,260px)] max-h-[60vh] overflow-auto rounded-2xl bg-black/80 text-white/90 backdrop-blur-md border border-white/10 shadow-lg z-[60]">
          <button onClick={()=>apply("any")}   className="w-full text-left px-3 py-2 hover:bg-white/10">✨ All</button>
          <button onClick={()=>apply("male")}  className="w-full text-left px-3 py-2 hover:bg-white/10"><GIcon g="male"/> Male</button>
          <button onClick={()=>apply("female")}className="w-full text-left px-3 py-2 hover:bg-white/10"><GIcon g="female"/> Female</button>
          <button onClick={()=>apply("couple")}className="w-full text-left px-3 py-2 hover:bg-white/10"><GIcon g="couple"/> Couple</button>
          <button onClick={()=>apply("lgbt")}  className="w-full text-left px-3 py-2 hover:bg-white/10"><GIcon g="lgbt"/> LGBT</button>
        </div>
      )}
    </div>
  );
}
