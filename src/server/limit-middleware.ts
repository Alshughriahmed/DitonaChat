type ByEvent = Record<string, number>;
const stats = { allowed: 0, dropped: 0, byEvent: {} as ByEvent };
export function count(event: string, ok = true) {
  if (ok) stats.allowed++; else stats.dropped++;
  stats.byEvent[event] = (stats.byEvent[event] ?? 0) + 1;
}
export function reset() { stats.allowed = 0; stats.dropped = 0; stats.byEvent = {}; }
export default { stats, reset, count };
