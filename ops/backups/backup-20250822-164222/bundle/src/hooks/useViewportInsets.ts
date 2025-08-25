"use client";
import { useEffect, useState } from "react";

export default function useViewportInsets() {
  const [bottom, setBottom] = useState(0);

  useEffect(() => {
    const vv = (window as any).visualViewport as VisualViewport | undefined;
    const recalc = () => {
      // مقدار المساحة السفلية المتاحة عندما تفتح لوحة المفاتيح
      const kbdOffset = vv ? Math.max(0, window.innerHeight - (vv.height + vv.offsetTop)) : 0;
      const safe = Number.parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--sat-bottom") || "0",
        10
      ) || 0;
      setBottom(kbdOffset + safe);
    };
    // set initial CSS var for safe-area if available
    const root = document.documentElement;
    ["safe-area-inset-bottom"].forEach((key) => {
      const v = getComputedStyle(root).getPropertyValue(key);
      root.style.setProperty("--sat-bottom", v || "0px");
    });

    recalc();
    vv?.addEventListener("resize", recalc);
    vv?.addEventListener("scroll", recalc);
    window.addEventListener("orientationchange", recalc);
    return () => {
      vv?.removeEventListener("resize", recalc);
      vv?.removeEventListener("scroll", recalc);
      window.removeEventListener("orientationchange", recalc);
    };
  }, []);

  return { bottomInset: bottom }; // px
}
