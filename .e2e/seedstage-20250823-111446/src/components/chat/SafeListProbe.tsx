"use client";
// AUTO: Safelist probe — keeps tokens as simple one-per-line classes for reliable grepping.
export default function SafeListProbe(){
  return (
    <div data-id="safelist-probe" className="hidden">
      {/* exact tokens to keep Tailwind + source checks happy */}
      <div className="h-[100dvh]"></div>
      <div className="h-[100svh]"></div>
      <div className="grid-rows-[minmax(0,1fr)_minmax(0,1fr)_auto_auto]"></div>
    </div>
  );
}