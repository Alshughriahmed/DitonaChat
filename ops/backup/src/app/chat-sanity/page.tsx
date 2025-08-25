"use client";
import React from "react";

const LAYOUT = { upper: 55, lower: 45 };

export default function ChatSanity() {
  const msgs = ["Hello!", "Hi!"];

  return (
    <div className="relative min-h-[100svh] w-full overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      {/* القسم العلوي (55%) */}
      <section className="relative w-full" style={{ height: `${LAYOUT.upper}svh` }}>
        {/* تمثيل فيديو الطرف الآخر */}
        <div className="absolute inset-0 bg-black/40" />

        {/* شريط علوي موحّد بعرض القسم: يسار معلومات الشخص / يمين الفلاتر */}
        <div className="absolute left-2 right-2 top-[max(0.5rem,env(safe-area-inset-top))] z-20 flex items-start justify-between gap-2">
          {/* يسار: الاسم + لايك + VIP + أفاتار */}
          <div className="flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 backdrop-blur-sm">
            <div className="h-7 w-7 rounded-full bg-white/20" />
            <span className="font-medium">Guest</span>
            <span className="text-rose-400">❤️ 0</span>
            <span className="text-yellow-400">VIP</span>
          </div>

          {/* يمين: قوائم الجنس + البلد */}
          <div className="flex items-center gap-2">
            <select className="rounded-lg bg-black/40 px-3 py-2 backdrop-blur-sm">
              <option>All</option>
              <option>Male ♂</option>
              <option>Female ♀</option>
              <option>Couple 👫</option>
              <option>LGBT 🏳️‍🌈</option>
            </select>
            <select className="rounded-lg bg-black/40 px-3 py-2 backdrop-blur-sm">
              <option>All Countries</option>
              <option>Germany</option>
              <option>USA</option>
              <option>France</option>
            </select>
          </div>
        </div>

        {/* أسفل يسار: الجنس + البلد/المدينة (LTR لضمان شكل ♀ Deutschland/Stuttgart) */}
        <div className="absolute bottom-[max(0.5rem,env(safe-area-inset-bottom))] left-2 z-20" dir="ltr">
          <div className="rounded-full bg-black/40 px-3 py-1 backdrop-blur-sm">
            <span className="font-medium text-pink-400">♀ Deutschland/Stuttgart</span>
          </div>
        </div>

        {/* رسائل تطفو على أسفل القسم العلوي */}
        <div className="pointer-events-none absolute inset-x-0 bottom-2 z-20 px-3">
          <div className="max-h-[24svh] space-y-1 overflow-y-auto">
            {msgs.map((t, i) => (
              <div key={i} className={`flex ${i % 2 ? "justify-end" : "justify-start"}`}>
                <span className={`rounded-2xl px-3 py-1 text-sm ${i % 2 ? "bg-blue-500/70" : "bg-gray-600/70"}`}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* القسم السفلي (45%) */}
      <section className="relative w-full" style={{ height: `${LAYOUT.lower}svh` }}>
        {/* تمثيل فيديو المستخدم */}
        <div className="absolute inset-0 bg-black/60" />

        {/* الحزمة السفلية: شريط الرسائل + شريط الأدوات (مُثبّتة) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30">
          {/* شريط الرسائل */}
          <div className="px-3 pb-2">
            <div className="pointer-events-auto flex items-center gap-2 rounded-2xl bg-black/40 px-3 py-2 backdrop-blur-md">
              <input className="min-h-10 flex-1 bg-transparent outline-none" placeholder="Type a message…" />
              <button className="h-10 w-10 shrink-0 rounded-xl bg-white/10 hover:bg-white/20">➤</button>
            </div>
          </div>

          {/* شريط الأدوات */}
          <div className="px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
            <div className="pointer-events-auto flex w-full items-center gap-2 rounded-2xl bg-black/40 px-2 py-2 backdrop-blur-md">
              {/* يسار: Previous مثبت */}
              <button className="h-12 min-w-[110px] shrink-0 rounded-xl bg-white/10 px-3 hover:bg-white/20">
                ⬅️ Previous
              </button>

              {/* وسط: أدوات قابلة للتمرير الأفقي ولا تلتف لسطر جديد */}
              <div className="flex-1 overflow-x-auto whitespace-nowrap">
                <div className="mx-auto flex w-max items-center justify-center gap-2 px-1">
                  <button className="h-12 w-12 rounded-xl bg-white/10 hover:bg-white/20" aria-label="Speaker">🔈</button>
                  <button className="h-12 w-12 rounded-xl bg-white/10 hover:bg-white/20" aria-label="Mic">🎤</button>
                  <button className="h-12 w-12 rounded-xl bg-white/10 hover:bg-white/20" aria-label="Camera">📷</button>
                  <button className="h-12 w-12 rounded-xl bg-white/10 hover:bg-white/20" aria-label="Switch Cam">🔄</button>
                  <button className="h-12 w-12 rounded-xl bg-white/10 hover:bg-white/20" aria-label="Beauty">✨</button>
                  <button className="h-12 w-12 rounded-xl bg-white/10 hover:bg-white/20" aria-label="Mask">🎭</button>
                  <button className="h-12 w-12 rounded-xl bg-white/10 hover:bg-white/20" aria-label="Settings">⚙️</button>
                  <button className="h-12 w-12 rounded-xl bg-white/10 hover:bg-white/20" aria-label="Stop">⏹️</button>
                  <button className="h-12 w-12 rounded-xl bg-white/10 hover:bg-white/20" aria-label="Like">❤️</button>
                  <button className="h-12 w-12 rounded-xl bg-white/10 hover:bg-white/20" aria-label="Report">🚨</button>
                  <span className="rounded-xl bg-yellow-400/20 px-3 py-1 text-yellow-300">VIP</span>
                </div>
              </div>

              {/* يمين: Next مثبت */}
              <button className="h-12 min-w-[110px] shrink-0 rounded-xl bg-emerald-500/90 px-3 hover:bg-emerald-500">
                Next ➡️
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
