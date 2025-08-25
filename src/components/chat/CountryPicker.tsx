"use client";
import * as React from "react";

type Country = { code: string; name: string; emoji: string };
export type CountryPickerProps = {
  value?: string;                          // ISO code; "" means All
  onChange?: (code: string) => void;
  className?: string;
};

// قائمة خفيفة (قابلة للتوسعة لاحقًا). المهم الآن: ليست فارغة + فيها All + بحث.
const COUNTRIES: Country[] = [
  { code:"",   name:"All",         emoji:"🌍" },
  { code:"US", name:"United States", emoji:"🇺🇸" },
  { code:"GB", name:"United Kingdom", emoji:"🇬🇧" },
  { code:"DE", name:"Germany",       emoji:"🇩🇪" },
  { code:"FR", name:"France",        emoji:"🇫🇷" },
  { code:"SA", name:"Saudi Arabia",  emoji:"🇸🇦" },
  { code:"KW", name:"Kuwait",        emoji:"🇰🇼" },
  { code:"AE", name:"United Arab Emirates", emoji:"🇦🇪" },
  { code:"TR", name:"Türkiye",       emoji:"🇹🇷" },
  { code:"EG", name:"Egypt",         emoji:"🇪🇬" },
  { code:"IN", name:"India",         emoji:"🇮🇳" },
  { code:"PK", name:"Pakistan",      emoji:"🇵🇰" },
  { code:"IQ", name:"Iraq",          emoji:"🇮🇶" },
  { code:"JO", name:"Jordan",        emoji:"🇯🇴" },
  { code:"LB", name:"Lebanon",       emoji:"🇱🇧" },
  { code:"MA", name:"Morocco",       emoji:"🇲🇦" },
  { code:"ES", name:"Spain",         emoji:"🇪🇸" },
  { code:"IT", name:"Italy",         emoji:"🇮🇹" },
  { code:"SE", name:"Sweden",        emoji:"🇸🇪" },
  { code:"NO", name:"Norway",        emoji:"🇳🇴" },
  { code:"DK", name:"Denmark",       emoji:"🇩🇰" },
  { code:"NL", name:"Netherlands",   emoji:"🇳🇱" },
  { code:"BR", name:"Brazil",        emoji:"🇧🇷" },
  { code:"CA", name:"Canada",        emoji:"🇨🇦" },
  { code:"MX", name:"Mexico",        emoji:"🇲🇽" },
  { code:"RU", name:"Russia",        emoji:"🇷🇺" },
  { code:"KR", name:"Korea",         emoji:"🇰🇷" },
  { code:"JP", name:"Japan",         emoji:"🇯🇵" },
  { code:"CN", name:"China",         emoji:"🇨🇳" },
  { code:"ID", name:"Indonesia",     emoji:"🇮🇩" },
  { code:"TH", name:"Thailand",      emoji:"🇹🇭" },
  { code:"PH", name:"Philippines",   emoji:"🇵🇭" },
];

export default function CountryPicker({
  value = "",
  onChange,
  className = "text-[clamp(12px,2.4vw,14px)] px-[clamp(8px,2vw,12px)] h-[clamp(36px,6vw,40px)]",
}: CountryPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(()=>{ setMounted(true); },[]);
  React.useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (!(e.target as HTMLElement)?.closest?.("#country-dd")) setOpen(false); };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const apply = (code: string) => {
    onChange?.(code);
    setOpen(false);
    try { localStorage.setItem("countryPref", code); } catch {}
  };

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = COUNTRIES;
    const arr = q ? base.filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)) : base;
    // تأكد أن All دائمًا أول عنصر
    const all = arr.find(c=>c.code==="");
    const rest = arr.filter(c=>c.code!=="");
    return [all || COUNTRIES[0], ...rest];
  }, [query]);

  // label على الشارة: 🌍 عندما لا يوجد اختيار
  const chip = (
    <span className="inline-flex items-center gap-2">
      <span className="text-lg"> {value ? (COUNTRIES.find(c=>c.code===value)?.emoji || "🌍") : "🌍"} </span>
      <span className="hidden sm:inline">{value ? (COUNTRIES.find(c=>c.code===value)?.name || "All") : (mounted ? "" : "All")}</span>
    </span>
  );

  return (
    <div className="relative" id="country-dd">
      <button
        type="button"
        onClick={() => setOpen(o=>!o)}
        className={"inline-flex items-center gap-2 rounded-xl bg-black/35 border border-white/10 text-white/90 backdrop-blur px-3 " + className}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {chip}
        <span className="opacity-70">▾</span>
      </button>

      {open && (
        <div role="listbox"
             className="absolute right-0 mt-2 w-[min(82vw,320px)] max-h-[60vh] overflow-auto rounded-2xl bg-black/85 text-white/90 backdrop-blur-md border border-white/10 shadow-lg z-[60] p-2">
          {/* حقل البحث في الأعلى */}
          <div className="mb-2">
            <input
              autoFocus
              value={query}
              onChange={(e)=>setQuery(e.target.value)}
              placeholder="Search country…"
              className="w-full px-3 h-9 rounded-xl bg-white/10 outline-none placeholder:text-white/60"
            />
          </div>
          {/* قائمة الدول */}
          <div className="divide-y divide-white/5">
            {filtered.map((c) => (
              <button key={c.code || "ALL"}
                onClick={()=>apply(c.code)}
                className="w-full text-left px-3 py-2 hover:bg-white/10 flex items-center gap-2">
                <span className="text-lg">{c.emoji}</span>
                <span>{c.name}</span>
                {c.code===(value||"") && <span className="ml-auto text-xs opacity-70">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
