/**
 * Server Component — SSR marker bucket to keep critical Tailwind tokens
 * - grid-rows-[minmax(0,1fr)_minmax(0,1fr)_auto_auto]
 * - h-[100dvh]
 * - "info@ditonachat.com" cue
 */
export default function SafelistSSR() {
  return (
    <div id="tw-keep" aria-hidden="true" className="sr-only">
      <i className="grid grid-rows-[minmax(0,1fr)_minmax(0,1fr)_auto_auto]" />
      <i className="h-[100dvh]" />
      <span>info@ditonachat.com</span>
    </div>
  );
}
