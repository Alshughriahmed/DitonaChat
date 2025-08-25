export type BusEvent =
  | 'next' | 'prev'
  | 'history' | 'latest'
  | 'toggle-mic' | 'toggle-cam' | 'toggle-speaker'
  | 'like'
  | 'toggle-mask'  // { mode?: 'off'|'sunglasses'|'mustache'|'surgical'|'clown'|'bunny' }
  | 'beauty-mode'; // { idx: 0|1|2|3|4|5 } -> off, soft, soft+, warm, cool, mono

type Detail = any;
const w = typeof window !== 'undefined' ? (window as any) : undefined;
const BUS: EventTarget = w ? (w.__DITONA_BUS__ ||= new EventTarget()) : new EventTarget();

export function emit(type: BusEvent, detail?: Detail) {
  try { BUS.dispatchEvent(new CustomEvent(type, { detail })); } catch {}
}
export function on(type: BusEvent, handler: (e: CustomEvent)=>void) {
  const fn = (ev: Event) => handler(ev as CustomEvent);
  BUS.addEventListener(type, fn as EventListener);
  return () => BUS.removeEventListener(type, fn as EventListener);
}
