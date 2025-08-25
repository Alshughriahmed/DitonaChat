'use client';

export default function TailwindSafelist() {
  // عناصر "sr-only/hidden" فقط لحفظ كلاسات Tailwind من الحذف أثناء SSR
  return (
    <div id="tw-keep" aria-hidden="true" className="sr-only">
      {/* نحافظ على الرموز التي يحتاجها التخطيط: grid-rows..., h-[100dvh], touch-pan-x */}
      <i className="hidden grid grid-rows-[minmax(0,1fr)_minmax(0,1fr)_auto_auto] h-[100dvh] touch-pan-x" />
      <span className="sr-only">info@ditonachat.com</span>
    </div>
  );
}
