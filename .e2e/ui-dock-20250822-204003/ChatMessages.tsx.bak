"use client";
import React, { useEffect, useRef } from "react";

export type ChatMsg = { id: string; mine?: boolean; text: string; at: number };

type Props = {
  msgs: ChatMsg[];
  visible?: boolean;        // تحكم إظهار/إخفاء
};

export default function ChatMessages({ msgs, visible = true }: Props) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll لآخر رسالة عند الإضافة
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs.length]);

  // إيماءات سحب لأعلى/أسفل (تمرير طبيعي)
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    let lastY: number | null = null;

    const onTouchStart = (e: TouchEvent) => { lastY = e.touches[0].clientY; };
    const onTouchMove = (e: TouchEvent) => {
      if (lastY == null) return;
      const y = e.touches[0].clientY;
      const dy = lastY - y;
      box.scrollTop += dy;    // تمرير
      lastY = y;
      e.preventDefault();     // أخفي المطاطية على iOS قليلاً
    };
    const onTouchEnd = () => { lastY = null; };

    box.addEventListener("touchstart", onTouchStart, { passive: false });
    box.addEventListener("touchmove", onTouchMove, { passive: false });
    box.addEventListener("touchend", onTouchEnd);

    return () => {
      box.removeEventListener("touchstart", onTouchStart);
      box.removeEventListener("touchmove", onTouchMove);
      box.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (<div
      className={[
        "pointer-events-none",  // لا يلتقط الضغط خارج الفقاعات
        "fixed left-3 right-3 z-20",
        // اترك حافة سفلية تساوي ارتفاع التولبار والـcomposer + safe-area
        // التولبار: --tb-h ، الكومبوزر: --composer-h
      ].join(" ")}
      style={{
        bottom: "calc(var(--tb-h,64px) + var(--composer-h,72px) + var(--safe-b,0px) + 8px)",
      }}
      aria-hidden={!visible}
     style={{ paddingBottom: 'var(--tb-h,0px)' }}>
      {/* الحاوية التمريرية: بدون خلفية، وبدون سكرول ظاهر */}
      <div
        ref={boxRef}
        className={[
          "max-h-[36vh] sm:max-h-[40vh]",
          "overflow-y-auto no-scrollbar touch-auto",
          "pointer-events-auto",
          "touch-pan-y", // يسمح بالسحب عمودي
        ].join(" ")}
        style={{ background: "transparent" }}
      >
        <div className="flex flex-col gap-2 px-1 py-1">
          {visible && msgs.map((m) => (
            <div key={m.id} className={`w-full flex ${m.mine ? "justify-end" : "justify-start"}`}>
              <div
                className={[
                  "max-w-[78%] sm:max-w-[65%] px-3 py-2 text-[13px] sm:text-sm rounded-2xl",
                  m.mine
                    ? "bg-sky-600/90 text-white rounded-br-sm"
                    : "bg-white/90 text-slate-900 rounded-bl-sm",
                  "shadow-sm",
                ].join(" ")}
              >
                {m.text}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
      </div>
    </div>
  );
}
