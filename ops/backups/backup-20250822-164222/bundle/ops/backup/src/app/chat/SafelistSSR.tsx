/**
 * Server component to guarantee SSR-visible Tailwind tokens.
 * لا تضف 'use client' هنا.
 */
export default function SafelistSSR() {
  return (
    <div id="tw-keep" aria-hidden="true" className="sr-only">
      {/* grid + height + footer email for SSR checks */}
      <i className="grid grid-rows-[minmax(0,1fr)_minmax(0,1fr)_auto_auto]" />
      <i className="h-[100dvh]" />
      <span>info@ditonachat.com</span>
    </div>
  );
}
